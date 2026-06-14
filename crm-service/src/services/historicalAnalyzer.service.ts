/**
 * Historical Analyzer: Query real campaign outcomes
 * Powers data-driven recommendations instead of fake statistics
 */

import { AnalyticsService } from './analytics.service';
import { logger } from '../utils/logger';

export interface HistoricalInsight {
  segment: string;
  channel: string;
  totalCampaigns: number;
  avgOpenRate: number;
  avgClickRate: number;
  avgConversionRate: number;
  avgRoi: number;
  lastCampaignDate: Date | null;
  trend: 'improving' | 'stable' | 'declining';
}

export interface ChannelPerformance {
  channel: 'EMAIL' | 'SMS' | 'WHATSAPP';
  openRate: number;
  clickRate: number;
  conversionRate: number;
  roiMultiplier: number;
  sampleSize: number;
  recommendation: 'strong' | 'moderate' | 'weak';
}

export class HistoricalAnalyzer {
  private analyticsService: AnalyticsService;

  constructor() {
    this.analyticsService = new AnalyticsService();
  }

  /**
   * Get historical performance for a segment
   */
  async getSegmentPerformance(segment: string): Promise<HistoricalInsight> {
    try {
      logger.info(`Analyzing historical performance for segment: ${segment}`);

      // Query real campaign data from analytics
      const campaigns = await this.analyticsService.getCampaignsBySegment(segment);

      if (campaigns.length === 0) {
        logger.warn(`No historical data for segment: ${segment}, using baseline`);
        return this.getBaselineInsight(segment);
      }

      // Calculate actual metrics from real campaigns
      const openRates = campaigns.map((c: any) => c.openRate);
      const clickRates = campaigns.map((c: any) => c.clickRate);
      const conversionRates = campaigns.map((c: any) => c.conversionRate);
      const rois = campaigns.map((c: any) => c.roi);

      const avgOpenRate = this.average(openRates);
      const avgClickRate = this.average(clickRates);
      const avgConversionRate = this.average(conversionRates);
      const avgRoi = this.average(rois);

      // Determine trend
      const recentCampaigns = campaigns.slice(-3);
      const historicalAvg = this.average(campaigns.slice(0, -3).map((c: any) => c.roi));
      const recentAvg = this.average(recentCampaigns.map((c: any) => c.roi));

      let trend: 'improving' | 'stable' | 'declining' = 'stable';
      if (recentAvg > historicalAvg * 1.1) trend = 'improving';
      if (recentAvg < historicalAvg * 0.9) trend = 'declining';

      logger.info(
        `Segment ${segment}: ${campaigns.length} campaigns, ` +
        `avg open ${(avgOpenRate * 100).toFixed(1)}%, trend: ${trend}`
      );

      return {
        segment,
        channel: campaigns[0].channel, // Most recent
        totalCampaigns: campaigns.length,
        avgOpenRate,
        avgClickRate,
        avgConversionRate,
        avgRoi,
        lastCampaignDate: campaigns[campaigns.length - 1].createdAt,
        trend,
      };
    } catch (error) {
      logger.error('Historical analysis failed, using baseline:', error);
      return this.getBaselineInsight(segment);
    }
  }

  /**
   * Compare channel performance for a segment
   */
  async compareChannels(segment: string): Promise<ChannelPerformance[]> {
    try {
      const channels: Array<'EMAIL' | 'SMS' | 'WHATSAPP'> = ['EMAIL', 'SMS', 'WHATSAPP'];
      const results: ChannelPerformance[] = [];

      for (const channel of channels) {
        const campaigns = await this.analyticsService.getCampaignsBySegmentAndChannel(
          segment,
          channel
        );

        if (campaigns.length === 0) {
          results.push(this.getBaselineChannelPerformance(channel));
          continue;
        }

        const openRates = campaigns.map((c: any) => c.openRate);
        const clickRates = campaigns.map((c: any) => c.clickRate);
        const conversionRates = campaigns.map((c: any) => c.conversionRate);
        const rois = campaigns.map((c: any) => c.roi);

        const avgOpenRate = this.average(openRates);
        const avgClickRate = this.average(clickRates);
        const avgConversionRate = this.average(conversionRates);
        const avgRoi = this.average(rois);

        // Recommendation strength based on confidence (sample size + consistency)
        let recommendation: 'strong' | 'moderate' | 'weak' = 'weak';
        if (campaigns.length >= 3 && avgOpenRate > 0.15) recommendation = 'strong';
        else if (campaigns.length >= 1 && avgOpenRate > 0.05) recommendation = 'moderate';

        results.push({
          channel,
          openRate: avgOpenRate,
          clickRate: avgClickRate,
          conversionRate: avgConversionRate,
          roiMultiplier: avgRoi > 0 ? avgRoi / 1000 : 0.5, // Normalize to multiplier
          sampleSize: campaigns.length,
          recommendation,
        });
      }

      // Sort by ROI
      results.sort((a, b) => b.roiMultiplier - a.roiMultiplier);

      logger.info(
        `Channel comparison for ${segment}: ${results.map((r) => `${r.channel}(${(r.openRate * 100).toFixed(0)}%)`).join(', ')}`
      );

      return results;
    } catch (error) {
      logger.error('Channel comparison failed, using defaults:', error);
      return this.getDefaultChannelComparison();
    }
  }

  /**
   * Get messaging performance for this segment
   */
  async getMostEffectiveMessaging(segment: string, channel: string): Promise<string> {
    try {
      const campaigns = await this.analyticsService.getCampaignsBySegmentAndChannel(
        segment,
        channel as 'EMAIL' | 'SMS' | 'WHATSAPP'
      );

      if (campaigns.length === 0) return this.getDefaultMessage(segment, channel);

      // Find highest-performing campaign
      const topCampaign = campaigns.reduce((best: any, current: any) =>
        current.conversionRate > best.conversionRate ? current : best
      );

      logger.info(
        `Most effective message for ${segment}/${channel}: ` +
        `"${topCampaign.messageTemplate.substring(0, 40)}..." (${(topCampaign.conversionRate * 100).toFixed(1)}% conv)`
      );

      return topCampaign.messageTemplate;
    } catch (error) {
      logger.error('Messaging analysis failed:', error);
      return this.getDefaultMessage(segment, channel);
    }
  }

  /**
   * Get data-backed explanation for channel choice
   */
  async getChannelJustification(segment: string, channel: string): Promise<string[]> {
    try {
      const campaigns = await this.analyticsService.getCampaignsBySegmentAndChannel(
        segment,
        channel as 'EMAIL' | 'SMS' | 'WHATSAPP'
      );

      if (campaigns.length === 0) {
        return [`Limited data for ${channel} with ${segment} segment, using industry best practice`];
      }

      const reasoning: string[] = [];

      const avgOpenRate = this.average(campaigns.map((c: any) => c.openRate));
      const avgConversionRate = this.average(campaigns.map((c: any) => c.conversionRate));
      const totalReach = campaigns.reduce((sum: number, c: any) => sum + c.reach, 0);

      reasoning.push(
        `${channel} delivered ${(avgOpenRate * 100).toFixed(1)}% open rate ` +
        `across ${campaigns.length} similar campaigns`
      );

      reasoning.push(
        `Conversion rate: ${(avgConversionRate * 100).toFixed(1)}% ` +
        `(${campaigns.length} campaigns, ${totalReach.toLocaleString()} total reach)`
      );

      // Trend insight
      const recentCampaigns = campaigns.slice(-2);
      if (recentCampaigns.length > 0) {
        const recentAvg = this.average(recentCampaigns.map((c: any) => c.conversionRate));
        if (recentAvg > avgConversionRate) {
          reasoning.push(`Performance improving with recent campaigns`);
        }
      }

      return reasoning;
    } catch (error) {
      logger.error('Justification generation failed:', error);
      return [`Channel selected based on available historical data`];
    }
  }

  // Helper methods
  private average(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  private getBaselineInsight(segment: string): HistoricalInsight {
    return {
      segment,
      channel: 'EMAIL',
      totalCampaigns: 0,
      avgOpenRate: 0.21,
      avgClickRate: 0.02,
      avgConversionRate: 0.005,
      avgRoi: 1500,
      lastCampaignDate: null,
      trend: 'stable',
    };
  }

  private getBaselineChannelPerformance(channel: string): ChannelPerformance {
    const baseline: Record<string, ChannelPerformance> = {
      SMS: {
        channel: 'SMS' as any,
        openRate: 0.35,
        clickRate: 0.08,
        conversionRate: 0.015,
        roiMultiplier: 2.5,
        sampleSize: 0,
        recommendation: 'moderate',
      },
      WHATSAPP: {
        channel: 'WHATSAPP' as any,
        openRate: 0.32,
        clickRate: 0.06,
        conversionRate: 0.012,
        roiMultiplier: 2.2,
        sampleSize: 0,
        recommendation: 'moderate',
      },
      EMAIL: {
        channel: 'EMAIL' as any,
        openRate: 0.21,
        clickRate: 0.02,
        conversionRate: 0.005,
        roiMultiplier: 1.5,
        sampleSize: 0,
        recommendation: 'moderate',
      },
    };
    return baseline[channel] || baseline.EMAIL;
  }

  private getDefaultChannelComparison(): ChannelPerformance[] {
    return [
      {
        channel: 'SMS',
        openRate: 0.35,
        clickRate: 0.08,
        conversionRate: 0.015,
        roiMultiplier: 2.5,
        sampleSize: 0,
        recommendation: 'moderate',
      },
      {
        channel: 'WHATSAPP',
        openRate: 0.32,
        clickRate: 0.06,
        conversionRate: 0.012,
        roiMultiplier: 2.2,
        sampleSize: 0,
        recommendation: 'moderate',
      },
      {
        channel: 'EMAIL',
        openRate: 0.21,
        clickRate: 0.02,
        conversionRate: 0.005,
        roiMultiplier: 1.5,
        sampleSize: 0,
        recommendation: 'moderate',
      },
    ];
  }

  private getDefaultMessage(_segment: string, channel: string): string {
    const templates: Record<string, string> = {
      'SMS_default': 'Hi {name}, we have something special for you. Check it out →',
      'EMAIL_default': 'Hi {name}, we thought you might love this. Learn more →',
      'WHATSAPP_default': 'Hey {name}! 👋 We have something just for you ✨',
    };
    return templates[`${channel}_default`] || 'Hi {name}, check this out →';
  }
}
