import { prisma } from '../config/prisma';
import { CampaignStats } from '../types';
import { logger } from '../utils/logger';
import { getCanonicalSegment } from '../utils/segmentDsl';

export class AnalyticsService {
  private static segmentCache = new Map<string, any[]>();
  private static segmentChannelCache = new Map<string, any[]>();

  static clearCache() {
    AnalyticsService.segmentCache.clear();
    AnalyticsService.segmentChannelCache.clear();
  }

  /**
   * Compiles live metrics for a specific campaign, including conversion rates and revenue attribution.
   */
  async getCampaignStats(campaignId: string): Promise<CampaignStats | null> {
    try {
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        select: { id: true, name: true, goal: true, channel: true, status: true, createdAt: true }
      });

      if (!campaign) {
        return null;
      }

      const total = await prisma.campaignRecipient.count({
        where: { campaignId }
      });

      const statusGroups = await prisma.campaignRecipient.groupBy({
        by: ['status'],
        where: { campaignId },
        _count: { _all: true }
      });

      let sent = 0;
      let delivered = 0;
      let read = 0;
      let failed = 0;

      statusGroups.forEach(group => {
        const status = group.status.toUpperCase();
        const count = group._count._all;
        if (status === 'SENT' || status === 'DELIVERED' || status === 'READ') {
          sent += count;
        }
        if (status === 'DELIVERED' || status === 'READ') {
          delivered += count;
        }
        if (status === 'READ') {
          read += count;
        }
        if (status === 'FAILED') {
          failed += count;
        }
      });

      const campaignLaunchTime = campaign.createdAt;

      const revenueAgg = await prisma.order.aggregate({
        _sum: { amount: true },
        where: {
          status: 'COMPLETED',
          createdAt: { gte: campaignLaunchTime },
          customer: {
            recipients: { some: { campaignId } }
          }
        }
      });

      const revenueRecovered = revenueAgg._sum.amount || 0;

      const deliveryRate = sent > 0 ? Math.round((delivered / sent) * 100) : 0;
      const readRate = delivered > 0 ? Math.round((read / delivered) * 100) : 0;

      return {
        id: campaign.id,
        name: campaign.name,
        goal: campaign.goal,
        channel: campaign.channel,
        status: campaign.status,
        createdAt: campaign.createdAt.toISOString(),
        metrics: {
          total,
          sent,
          delivered,
          read,
          failed,
          deliveryRate,
          readRate,
          revenueRecovered: Math.round(revenueRecovered * 100) / 100,
        },
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      logger.error(`Failed to calculate campaign stats for ${campaignId}:`, errorMsg);
      return null;
    }
  }

  /**
   * Compiles live metrics for all campaigns
   */
  async getAllCampaignStats(): Promise<CampaignStats[]> {
    try {
      const campaigns = await prisma.campaign.findMany({
        select: { id: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      const statsList: CampaignStats[] = [];
      for (const camp of campaigns) {
        const stats = await this.getCampaignStats(camp.id);
        if (stats) {
          statsList.push(stats);
        }
      }
      return statsList;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Failed to calculate all campaign stats:', errorMsg);
      return [];
    }
  }

  /**
   * Retrieves campaign performance metrics for a specific campaign.
   */
  async getCampaignMetrics(campaignId: string) {
    try {
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
        select: { id: true, name: true, channel: true, createdAt: true, segmentDsl: true }
      });

      if (!campaign) {
        return null;
      }

      const sent = await prisma.campaignRecipient.count({
        where: { campaignId }
      });

      const statusGroups = await prisma.campaignRecipient.groupBy({
        by: ['status'],
        where: { campaignId },
        _count: { _all: true }
      });

      let delivered = 0;
      let opened = 0;

      statusGroups.forEach(group => {
        const status = group.status.toUpperCase();
        const count = group._count._all;
        if (status === 'DELIVERED' || status === 'READ') {
          delivered += count;
        }
        if (status === 'READ') {
          opened += count;
        }
      });

      const clicked = await prisma.channelEvent.count({
        where: {
          eventType: 'CLICKED',
          recipient: { campaignId }
        }
      });

      const campaignLaunchTime = campaign.createdAt;

      const revenueAgg = await prisma.order.aggregate({
        _sum: { amount: true },
        _count: { customerId: true },
        where: {
          status: 'COMPLETED',
          createdAt: { gte: campaignLaunchTime },
          customer: {
            recipients: { some: { campaignId } }
          }
        }
      });

      const revenue = revenueAgg._sum.amount || 0;
      const converted = revenueAgg._count.customerId || 0;

      // Extract segment name
      let segment = 'General';
      try {
        const dsl = JSON.parse(campaign.segmentDsl);
        const cond = dsl.conditions?.find((c: any) => c.field === 'segment');
        if (cond && cond.value) {
          segment = String(cond.value);
        }
      } catch {
        if (campaign.segmentDsl.includes('VIP')) segment = 'VIP';
        else if (campaign.segmentDsl.includes('Cart Abandoner')) segment = 'Cart Abandoner';
        else if (campaign.segmentDsl.includes('Dormant')) segment = 'Dormant';
        else if (campaign.segmentDsl.includes('New User')) segment = 'New User';
      }

      return {
        campaignName: campaign.name,
        segment,
        channel: campaign.channel,
        sent,
        delivered,
        opened,
        clicked,
        converted,
        revenue: Math.round(revenue * 100) / 100,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      logger.error(`Failed to calculate campaign metrics for ${campaignId}:`, errorMsg);
      return null;
    }
  }

  /**
   * Retrieves all completed campaigns targeting a specific segment.
   */
  async getCampaignsBySegment(segment: string) {
    try {
      const cacheKey = segment.toLowerCase();
      if (AnalyticsService.segmentCache.has(cacheKey)) {
        return AnalyticsService.segmentCache.get(cacheKey)!;
      }

      // Step 1: Fetch only campaign IDs and segmentDsl to filter them without fetching heavy relations
      const campaignsOverview = await prisma.campaign.findMany({
        where: { status: 'COMPLETED' },
        select: { id: true, segmentDsl: true },
      });

      const matchingIds = campaignsOverview.filter((c) => {
        try {
          const dsl = JSON.parse(c.segmentDsl);
          return dsl.conditions?.some((cond: any) => cond.field === 'segment' && getCanonicalSegment(String(cond.value)) === getCanonicalSegment(segment));
        } catch {
          return getCanonicalSegment(c.segmentDsl).includes(getCanonicalSegment(segment));
        }
      }).map(c => c.id);

      if (matchingIds.length === 0) {
        AnalyticsService.segmentCache.set(cacheKey, []);
        return [];
      }

      // Step 2: Only load heavy nested details for the matching campaigns
      const campaigns = await prisma.campaign.findMany({
        where: { id: { in: matchingIds } },
        include: {
          recipients: {
            include: {
              events: true,
              customer: {
                include: {
                  orders: {
                    where: { status: 'COMPLETED' },
                  },
                },
              },
            },
          },
        },
      });

      const results = campaigns.map((c) => this.calculateCampaignMetrics(c, segment));
      AnalyticsService.segmentCache.set(cacheKey, results);
      return results;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      logger.error(`Failed to get campaigns by segment ${segment}:`, errorMsg);
      return [];
    }
  }

  /**
   * Retrieves all completed campaigns targeting a specific segment and channel.
   */
  async getCampaignsBySegmentAndChannel(segment: string, channel: 'EMAIL' | 'SMS' | 'WHATSAPP') {
    try {
      const cacheKey = `${segment.toLowerCase()}_${channel.toLowerCase()}`;
      if (AnalyticsService.segmentChannelCache.has(cacheKey)) {
        return AnalyticsService.segmentChannelCache.get(cacheKey)!;
      }

      // Step 1: Fetch only campaign IDs and segmentDsl to filter them
      const campaignsOverview = await prisma.campaign.findMany({
        where: { status: 'COMPLETED', channel },
        select: { id: true, segmentDsl: true },
      });

      const matchingIds = campaignsOverview.filter((c) => {
        try {
          const dsl = JSON.parse(c.segmentDsl);
          return dsl.conditions?.some((cond: any) => cond.field === 'segment' && getCanonicalSegment(String(cond.value)) === getCanonicalSegment(segment));
        } catch {
          return getCanonicalSegment(c.segmentDsl).includes(getCanonicalSegment(segment));
        }
      }).map(c => c.id);

      if (matchingIds.length === 0) {
        AnalyticsService.segmentChannelCache.set(cacheKey, []);
        return [];
      }

      // Step 2: Only load heavy nested details for the matching campaigns
      const campaigns = await prisma.campaign.findMany({
        where: { id: { in: matchingIds } },
        include: {
          recipients: {
            include: {
              events: true,
              customer: {
                include: {
                  orders: {
                    where: { status: 'COMPLETED' },
                  },
                },
              },
            },
          },
        },
      });

      const results = campaigns.map((c) => this.calculateCampaignMetrics(c, segment));
      AnalyticsService.segmentChannelCache.set(cacheKey, results);
      return results;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      logger.error(`Failed to get campaigns by segment ${segment} and channel ${channel}:`, errorMsg);
      return [];
    }
  }

  private calculateCampaignMetrics(c: any, segment: string) {
    const recipients = c.recipients;
    const total = recipients.length;
    
    const sent = recipients.length;
    const read = recipients.filter((r: any) => r.status.toUpperCase() === 'READ').length;
    const clicked = recipients.filter((r: any) => r.events?.some((e: any) => e.eventType.toUpperCase() === 'CLICKED')).length;

    // Attributed revenue & conversions
    const campaignLaunchTime = c.createdAt.getTime();
    let revenue = 0;
    let converted = 0;
    for (const rec of recipients) {
      const attributedOrders = rec.customer.orders.filter((order: any) => {
        return new Date(order.createdAt).getTime() >= campaignLaunchTime;
      });
      if (attributedOrders.length > 0) {
        converted++;
        revenue += attributedOrders.reduce((sum: number, order: any) => sum + order.amount, 0);
      }
    }

    const openRate = sent > 0 ? read / sent : 0;
    const clickRate = sent > 0 ? clicked / sent : 0;
    const conversionRate = sent > 0 ? converted / sent : 0;

    return {
      id: c.id,
      name: c.name,
      goal: c.goal,
      channel: c.channel as 'EMAIL' | 'SMS' | 'WHATSAPP',
      status: c.status,
      createdAt: c.createdAt,
      messageTemplate: c.messageTemplate,
      reach: total,
      openRate,
      clickRate,
      conversionRate,
      roi: revenue,
      segment,
    };
  }
}
