/**
 * Next Action Engine: Closed-loop recommendation
 * Observes outcomes and recommends the next best action
 */

import { AnalyticsService } from './analytics.service';
import { logger } from '../utils/logger';

export interface CampaignOutcome {
  campaignId: string;
  name: string;
  segment: string;
  channel: string;
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
  revenue: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
}

export interface NextAction {
  action: 'scale' | 'pause' | 'retry' | 'pivot' | 'ab_test';
  reason: string;
  recommendation: string;
  confidence: 'high' | 'moderate' | 'low';
  details: {
    segmentToScale?: string;
    channelToPivot?: string;
    testVariation?: string;
  };
}

export class NextActionEngine {
  private analyticsService: AnalyticsService;

  constructor() {
    this.analyticsService = new AnalyticsService();
  }

  /**
   * Main method: Analyze campaign outcome and recommend next action
   */
  async recommendNextAction(campaignId: string): Promise<NextAction> {
    try {
      logger.info(`🎯 Analyzing campaign outcome for next action: ${campaignId}`);

      // Get campaign outcome
      const outcome = await this.getCampaignOutcome(campaignId);

      if (!outcome) {
        logger.warn(`Campaign ${campaignId} not found`);
        return this.noDataAction();
      }

      logger.info(
        `Campaign: ${outcome.name}, Segment: ${outcome.segment}, ` +
        `Conversion: ${(outcome.conversionRate * 100).toFixed(2)}%`
      );

      // Analyze performance
      const isSuccessful = outcome.conversionRate > 0.01; // >1% is good
      const isExceptional = outcome.conversionRate > 0.03; // >3% is exceptional

      // Get historical context
      const historicalAvg = await this.getHistoricalConversionRate(
        outcome.segment,
        outcome.channel
      );

      // Decide action
      if (isExceptional) {
        return this.scaleAction(outcome, historicalAvg);
      } else if (isSuccessful && outcome.conversionRate > historicalAvg * 0.8) {
        return this.optimizeAction(outcome);
      } else if (outcome.openRate < 0.1) {
        return this.pivotChannelAction(outcome);
      } else if (outcome.conversionRate > 0) {
        return this.retryAction(outcome);
      } else {
        return this.pauseAction(outcome);
      }
    } catch (error) {
      logger.error('Next action analysis failed:', error);
      return this.defaultAction();
    }
  }

  /**
   * Action 1: Scale - This is working, expand it
   */
  private scaleAction(outcome: CampaignOutcome, historicalAvg: number): NextAction {
    const improvement = ((outcome.conversionRate - historicalAvg) / historicalAvg * 100).toFixed(0);

    return {
      action: 'scale',
      reason: `Exceptional performance: ${(outcome.conversionRate * 100).toFixed(2)}% conversion rate (${improvement}% above historical avg)`,
      recommendation: `Scale this campaign immediately. Expand audience by 2-3x while maintaining message and channel. Current ROI trajectory suggests strong revenue opportunity.`,
      confidence: 'high',
      details: {
        segmentToScale: outcome.segment,
      },
    };
  }

  /**
   * Action 2: Optimize - Good, but test variations
   */
  private optimizeAction(outcome: CampaignOutcome): NextAction {
    return {
      action: 'ab_test',
      reason: `Good performance: ${(outcome.conversionRate * 100).toFixed(2)}% conversion. Opportunity to optimize further.`,
      recommendation: `Run A/B test with message variation. Keep channel (${outcome.channel}) and segment (${outcome.segment}) constant. Test: different offer, subject line, or CTA.`,
      confidence: 'moderate',
      details: {
        testVariation: 'message_variation',
      },
    };
  }

  /**
   * Action 3: Pivot - Channel didn't perform, try another
   */
  private pivotChannelAction(outcome: CampaignOutcome): NextAction {
    const newChannel = this.suggestAlternativeChannel(outcome.channel);

    return {
      action: 'pivot',
      reason: `Low open rate (${(outcome.openRate * 100).toFixed(1)}%) with ${outcome.channel}. Suggests audience preference issue.`,
      recommendation: `Retry same segment and message with ${newChannel} channel. This segment may have better engagement on a different platform.`,
      confidence: 'moderate',
      details: {
        channelToPivot: newChannel,
      },
    };
  }

  /**
   * Action 4: Retry - Some positive signal, try again with refinement
   */
  private retryAction(outcome: CampaignOutcome): NextAction {
    return {
      action: 'retry',
      reason: `Moderate performance: ${(outcome.conversionRate * 100).toFixed(2)}% conversion. Positive signal present.`,
      recommendation: `Retry campaign with improved targeting or message. Use lookalike segments based on converters. Consider incentive adjustment.`,
      confidence: 'moderate',
      details: {},
    };
  }

  /**
   * Action 5: Pause - Not working, stop investment
   */
  private pauseAction(_outcome: CampaignOutcome): NextAction {
    return {
      action: 'pause',
      reason: `No conversions detected. Channel/message/segment mismatch likely.`,
      recommendation: `Pause further investment in this combination. Recommend: (1) Pivot to different channel, (2) Test new message angle, or (3) Refine segment definition.`,
      confidence: 'high',
      details: {},
    };
  }

  /**
   * Fallback: No clear pattern
   */
  private noDataAction(): NextAction {
    return {
      action: 'ab_test',
      reason: 'Insufficient data for clear recommendation',
      recommendation: 'Run controlled test to gather performance baseline',
      confidence: 'low',
      details: {},
    };
  }

  /**
   * Default: Conservative next step
   */
  private defaultAction(): NextAction {
    return {
      action: 'ab_test',
      reason: 'Analysis unable to complete',
      recommendation: 'Test new message variation with same audience and channel',
      confidence: 'low',
      details: {},
    };
  }

  // Helper methods

  private async getCampaignOutcome(campaignId: string): Promise<CampaignOutcome | null> {
    try {
      // Query campaign metrics from analytics
      const metrics = await this.analyticsService.getCampaignMetrics(campaignId);
      if (!metrics) return null;

      const openRate = metrics.delivered > 0 ? metrics.opened / metrics.delivered : 0;
      const clickRate = metrics.opened > 0 ? metrics.clicked / metrics.opened : 0;
      const conversionRate = metrics.sent > 0 ? metrics.converted / metrics.sent : 0;

      return {
        campaignId,
        name: metrics.campaignName,
        segment: metrics.segment,
        channel: metrics.channel,
        sent: metrics.sent,
        opened: metrics.opened,
        clicked: metrics.clicked,
        converted: metrics.converted,
        revenue: metrics.revenue,
        openRate,
        clickRate,
        conversionRate,
      };
    } catch (error) {
      logger.error(`Failed to get outcome for ${campaignId}:`, error);
      return null;
    }
  }

  private async getHistoricalConversionRate(segment: string, channel: string): Promise<number> {
    try {
      const campaigns = await this.analyticsService.getCampaignsBySegmentAndChannel(segment, channel as any);
      if (campaigns.length === 0) return 0.005; // 0.5% baseline

      const rates = campaigns.map((c: any) => c.conversionRate);
      return rates.reduce((a: number, b: number) => a + b, 0) / rates.length;
    } catch (error) {
      logger.warn(`Could not get historical rate for ${segment}/${channel}`, error);
      return 0.005;
    }
  }

  private suggestAlternativeChannel(currentChannel: string): string {
    const alternatives: Record<string, string> = {
      EMAIL: 'SMS',
      SMS: 'WHATSAPP',
      WHATSAPP: 'EMAIL',
    };
    return alternatives[currentChannel] || 'SMS';
  }
}
