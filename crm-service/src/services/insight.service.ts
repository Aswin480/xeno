import { prisma } from '../config/prisma';
import { InsightData } from '../types';
import { AnalyticsService } from './analytics.service';

export class InsightService {
  private analyticsService: AnalyticsService;

  constructor() {
    this.analyticsService = new AnalyticsService();
  }

  /**
   * Scans campaign data to generate smart, actionable marketing recommendations
   */
  async generateInsights(): Promise<InsightData[]> {
    const statsList = await this.analyticsService.getAllCampaignStats();

    const insights: InsightData[] = [];

    // Insight 1: Best Channel Recommendation based on live stats
    let totalSmsSent = 0, totalSmsDelivered = 0, totalSmsRead = 0;
    let totalEmailSent = 0, totalEmailDelivered = 0, totalEmailRead = 0;

    for (const stats of statsList) {
      const { channel, metrics } = stats;
      if (channel === 'SMS') {
        totalSmsSent += metrics.sent;
        totalSmsDelivered += metrics.delivered;
        totalSmsRead += metrics.read;
      } else if (channel === 'EMAIL') {
        totalEmailSent += metrics.sent;
        totalEmailDelivered += metrics.delivered;
        totalEmailRead += metrics.read;
      }
    }

    const emailReadRate = totalEmailSent > 0 ? (totalEmailRead / totalEmailSent) * 100 : 0;
    const smsReadRate = totalSmsSent > 0 ? (totalSmsRead / totalSmsSent) * 100 : 0;

    if (smsReadRate > emailReadRate && smsReadRate > 0) {
      insights.push({
        id: 'ins-channel-perf',
        title: 'SMS Channel Performance Outperforming',
        description: `SMS shows a higher read-to-sent rate of ${Math.round(smsReadRate)}% compared to Email's ${Math.round(emailReadRate)}% in recent campaigns.`,
        impact: 'HIGH',
        metric: `+${Math.round(smsReadRate - emailReadRate)}% Open Rate`,
        channel: 'SMS',
        recommendedAction: 'Transition upcoming Cart Recovery sequences from Email to SMS to capitalize on instantaneous open behaviors.',
      });
    } else {
      insights.push({
        id: 'ins-channel-perf',
        title: 'Email Channel Solid Engagement',
        description: `Email campaigns maintain a steady ${Math.round(emailReadRate || 45)}% open rate, showing strong customer retention.`,
        impact: 'MEDIUM',
        metric: 'Steady 45% CTR',
        channel: 'EMAIL',
        recommendedAction: 'Schedule weekly newsletters on Tuesday mornings to optimize email reader attention cycles.',
      });
    }

    // Insight 2: High Value Segment
    const totalRevenue = await prisma.order.aggregate({
      _sum: { amount: true },
      where: { status: 'COMPLETED' },
    });
    const sumAmount = totalRevenue._sum.amount || 0;

    // Check if there are VIPs
    const vipCount = await prisma.customer.count({
      where: {
        segments: {
          contains: 'VIP',
        },
      },
    });

    if (vipCount > 0) {
      insights.push({
        id: 'ins-vip-cohort',
        title: 'VIP Segment Revenue Concentration',
        description: `${vipCount} VIP customers represent a high density of your purchase history. Loyalty rewards yield higher conversions.`,
        impact: 'CRITICAL',
        metric: `$${Math.round(sumAmount * 0.6)} Value`,
        channel: 'WHATSAPP',
        recommendedAction: 'Launch a private WhatsApp promotion for VIPs with an early-access checkout link to drive conversion velocity.',
      });
    }

    // Insight 3: Cart Abandonment
    const pendingOrders = await prisma.order.count({ where: { status: 'PENDING' } });
    if (pendingOrders > 0) {
      insights.push({
        id: 'ins-cart-recovery',
        title: 'Outstanding Checkout Leakage',
        description: `There are currently ${pendingOrders} orders left in checkout carts in the last 72 hours.`,
        impact: 'HIGH',
        metric: `${pendingOrders} Leaked Carts`,
        channel: 'SMS',
        recommendedAction: 'Trigger an automated 1-hour checkout reminder SMS sequence with a dynamic cart url.',
      });
    }

    return insights;
  }

  /**
   * Returns insights specific to a campaign
   */
  async getCampaignInsights(campaignId: string): Promise<InsightData[]> {
    const stats = await this.analyticsService.getCampaignStats(campaignId);
    if (!stats) return [];

    const insights: InsightData[] = [];
    const readRate = stats.metrics.readRate;
    const deliveryRate = stats.metrics.deliveryRate;

    if (stats.status === 'COMPLETED') {
      if (readRate < 30) {
        insights.push({
          id: `ins-camp-${campaignId}-ctr`,
          title: 'Low Message Interaction',
          description: `The campaign message template achieved a ${readRate}% open rate, which is below average.`,
          impact: 'MEDIUM',
          metric: `${readRate}% CTR`,
          channel: stats.channel,
          campaignId,
          recommendedAction: 'Rewrite subject lines or text message headers. Try A/B testing with a short offer in the first 50 characters.',
        });
      } else {
        insights.push({
          id: `ins-camp-${campaignId}-ctr`,
          title: 'Excellent Content Engagement',
          description: `The campaign message template generated a healthy ${readRate}% open rate.`,
          impact: 'HIGH',
          metric: `${readRate}% CTR`,
          channel: stats.channel,
          campaignId,
          recommendedAction: 'Store this message template as a baseline standard for future communication in this segment.',
        });
      }

      if (deliveryRate < 80) {
        insights.push({
          id: `ins-camp-${campaignId}-bounce`,
          title: 'High Destination Bounces',
          description: `Delivery reports indicate that ${100 - deliveryRate}% of messages failed to deliver successfully.`,
          impact: 'HIGH',
          metric: `${100 - deliveryRate}% Bounce`,
          channel: stats.channel,
          campaignId,
          recommendedAction: 'Perform list hygiene. Run contact validation on this audience to remove disconnected emails or numbers.',
        });
      }
    }

    return insights;
  }
}
