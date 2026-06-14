import { CopilotBrainService } from './copilotBrain.service';
import { HistoricalAnalyzer } from './historicalAnalyzer.service';
import { NextActionEngine } from './nextActionEngine.service';
import { SegmentationService } from './segmentation.service';
import { GeminiService } from './gemini.service';
import { CopilotPlanResponse } from '../types';
import { logger } from '../utils/logger';

export class CopilotService {
  private brainService: CopilotBrainService;
  private historicalAnalyzer: HistoricalAnalyzer;
  private nextActionEngine: NextActionEngine;
  private segmentationService: SegmentationService;
  private geminiService: GeminiService;

  constructor() {
    this.brainService = new CopilotBrainService();
    this.historicalAnalyzer = new HistoricalAnalyzer();
    this.nextActionEngine = new NextActionEngine();
    this.segmentationService = new SegmentationService();
    this.geminiService = new GeminiService();
  }

  /**
   * Main: Closed-loop decision engine
   * 
   * Flow:
   * Goal → Interpret → Plan → (Execute & Observe happen externally) → Learn → Recommend Next
   */
  async generatePlan(goal: string): Promise<CopilotPlanResponse> {
    logger.info(`\n🎯 XENO COPILOT: Closed-Loop Decision Engine\n`);
    logger.info(`📝 Goal: "${goal}"\n`);

    try {
      // STEP 1: Use brain to think through recommendation
      logger.info(`🧠 Step 1: Interpreting goal and building plan...`);
      const thinking = await this.brainService.think(goal);

      const strength = thinking.strength;
      logger.info(`✓ Recommendation strength: ${strength}\n`);

      // STEP 2: Resolve actual audience size from database
      logger.info(`📊 Step 2: Resolving audience from database...`);
      const matchingCustomers = await this.segmentationService.resolveSegment(
        JSON.stringify({
          conditions: [{ field: 'segment', operator: 'equals', value: thinking.recommendation.audience.segment }],
          logicalOperator: 'AND',
        })
      );
      thinking.recommendation.audience.estimatedSize = matchingCustomers.length;
      logger.info(`✓ Found ${matchingCustomers.length} customers\n`);

      // STEP 3: Transform to response format
      const response = this.transformRecommendationToPlan(thinking, strength);

      // STEP 4: Generate conversational summary voice via Gemini with fallback
      logger.info(`🗣️ Step 4: Compiling conversational voice summary using Gemini...`);
      let voiceSummary = '';
      try {
        voiceSummary = await this.geminiService.generateVoiceSummary({
          goal,
          segment: thinking.recommendation.audience.segment,
          channel: thinking.recommendation.campaign.channel,
          template: thinking.recommendation.messaging.template,
          strength: thinking.strength,
          reasons: response.confidenceReasoning,
        });
      } catch (err: any) {
        logger.warn('Failed to compile Gemini voice summary, using fallback.');
      }
      response.voiceSummary = voiceSummary;

      logger.info(`\n📋 RECOMMENDATION READY`);
      logger.info(`───────────────────────`);
      logger.info(`Campaign: ${response.name}`);
      logger.info(`Channel:  ${response.channel}`);
      logger.info(`Strength: ${strength}`);
      logger.info(`───────────────────────\n`);

      return response;
    } catch (error) {
      logger.error('\n❌ Plan generation failed:', error);
      throw error;
    }
  }

  /**
   * Observe campaign outcome and recommend next action
   */
  async observeOutcomeAndRecommendNext(campaignId: string): Promise<any> {
    logger.info(`\n🔄 LEARNING LOOP: Observing outcomes\n`);

    try {
      // Get campaign outcome
      logger.info(`📈 Analyzing campaign performance...`);
      const nextAction = await this.nextActionEngine.recommendNextAction(campaignId);

      logger.info(`\n💡 NEXT ACTION: ${nextAction.action.toUpperCase()}`);
      logger.info(`Reason: ${nextAction.reason}`);
      logger.info(`Recommendation: ${nextAction.recommendation}`);
      logger.info(`Confidence: ${nextAction.confidence}\n`);

      return nextAction;
    } catch (error) {
      logger.error('Failed to recommend next action:', error);
      throw error;
    }
  }

  private transformRecommendationToPlan(thinking: any, strength: string): CopilotPlanResponse {
    const rec = thinking.recommendation;

    return {
      name: rec.campaign.name,
      goal: rec.campaign.goal,
      channel: rec.campaign.channel,
      segmentDsl: JSON.stringify({
        conditions: [{ field: 'segment', operator: 'equals', value: rec.audience.segment }],
        logicalOperator: 'AND',
      }),
      messageTemplate: rec.messaging.template,
      confidenceScore: strength === 'strong' ? 0.88 : strength === 'moderate' ? 0.72 : 0.55,
      confidenceReasoning: [
        ...rec.explanation.whyThisChannel,
        ...rec.explanation.whyThisSegment,
        ...rec.explanation.whyThisOffer,
      ],
      estimatedRoi: this.estimateRoiFromStrength(strength),
      segmentSize: rec.audience.estimatedSize,
    };
  }

  private estimateRoiFromStrength(strength: string): number {
    // ROI based on recommendation strength
    if (strength === 'strong') return 3200;
    if (strength === 'moderate') return 2000;
    return 1200;
  }
}
