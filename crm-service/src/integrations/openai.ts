import axios from 'axios';
import { config } from '../config/env';
import { logger } from '../utils/logger';
import { CopilotPlanResponse } from '../types';

export class OpenAiClient {
  private apiKey: string;

  constructor() {
    this.apiKey = config.openaiApiKey;
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  /**
   * Enhance an existing plan with AI-generated insights
   */
  async enhancePlanWithAi(goal: string, basePlan: CopilotPlanResponse): Promise<Partial<CopilotPlanResponse>> {
    if (!this.apiKey) {
      return {}; // No enhancement without API
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4-turbo',
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: `You are an expert marketing strategist. Given a campaign plan, enhance it with:
1. Refined confidence reasoning (why this will work)
2. Real business impact estimates
3. Messaging tone adjustments
4. Risk mitigation strategies

Return JSON with optional fields: confidenceReasoning (array), estimatedRoi (number), refinedMessageTemplate (string)`,
            },
            {
              role: 'user',
              content: `Goal: "${goal}"
Base plan:
- Campaign: ${basePlan.name}
- Channel: ${basePlan.channel}
- Message: ${basePlan.messageTemplate}
- Confidence: ${basePlan.confidenceScore}

Enhance this plan.`,
            },
          ],
          temperature: 0.8,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      const content = response.data.choices[0].message.content;
      const parsed = JSON.parse(content);

      return {
        confidenceReasoning: parsed.confidenceReasoning || basePlan.confidenceReasoning,
        estimatedRoi: parsed.estimatedRoi || basePlan.estimatedRoi,
        messageTemplate: parsed.refinedMessageTemplate || basePlan.messageTemplate,
      };
    } catch (err) {
      logger.warn('AI enhancement failed, using base plan:', err);
      return {};
    }
  }

  async generateCampaignPlan(goal: string): Promise<CopilotPlanResponse> {
    if (!this.apiKey) {
      logger.info('No OPENAI_API_KEY found, running local AI Copilot simulation.');
      return this.simulateLocalAiPlan(goal);
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4-turbo',
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: `You are an AI-Native CRM marketing assistant. Given a marketing goal, output a structured JSON plan for a target campaign.

THINK LIKE A DATA-DRIVEN MARKETER:
1. What is the user trying to achieve?
2. Who is the right audience for this goal?
3. What message resonates with them?
4. Which channel performs best for this segment?
5. Why will this work?

The JSON must follow this structure:
{
  "name": "Campaign Name",
  "goal": "Explain the campaign goal briefly",
  "channel": "EMAIL" | "SMS" | "WHATSAPP",
  "segmentDsl": "JSON string representing conditions. Available fields: total_spend, orders_count, last_order_days, segment, email. Operators: equals, contains, gt, gte, lt, lte.",
  "messageTemplate": "Copy template using {name} variable. MUST be channel-appropriate.",
  "confidenceScore": 0.75 to 0.94,
  "confidenceReasoning": ["reason 1", "reason 2", "reason 3"],
  "estimatedRoi": estimated revenue in USD,
  "segmentSize": estimated percentage size (10-100)
}

Example: For "Bring back dormant coffee customers":
- Intent: Reactivation
- Audience: Last purchase >60 days ago + high lifetime value
- Channel: Email (cost-effective) or SMS (urgency)
- Message: Nostalgia + strong incentive
- Reasoning: [
  "Dormant high-value customers have proven buying power",
  "Email reaches broad audience cost-effectively",
  "Incentive lowers reactivation friction"
]
`,
            },
            {
              role: 'user',
              content: `Generate a POWERFUL campaign plan for this goal: "${goal}"

Requirements:
- Be specific, not generic
- Show business reasoning, not marketing fluff
- Pick the channel with highest ROI for this segment
- Create a message that creates urgency or exclusivity
- Estimate ROI realistically (not inflated)`,
            },
          ],
          temperature: 0.7,
          top_p: 0.95,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      const content = response.data.choices[0].message.content;
      const parsed = JSON.parse(content);

      return {
        name: parsed.name || 'AI Generated Campaign',
        goal: parsed.goal || goal,
        channel: parsed.channel || 'EMAIL',
        segmentDsl: typeof parsed.segmentDsl === 'string' ? parsed.segmentDsl : JSON.stringify(parsed.segmentDsl),
        messageTemplate: parsed.messageTemplate || 'Hello {name}!',
        confidenceScore: Math.min(Math.max(parsed.confidenceScore || 0.85, 0.75), 0.94),
        confidenceReasoning: parsed.confidenceReasoning || ['Based on standard performance'],
        estimatedRoi: parsed.estimatedRoi || 500,
        segmentSize: parsed.segmentSize || 30,
      };
    } catch (err) {
      logger.error('Failed to query OpenAI API, falling back to local simulation:', err);
      return this.simulateLocalAiPlan(goal);
    }
  }

  private simulateLocalAiPlan(goal: string): CopilotPlanResponse {
    const goalLower = goal.toLowerCase();

    // Default settings
    let name = 'General Customer Engagement';
    let channel: 'EMAIL' | 'SMS' | 'WHATSAPP' = 'EMAIL';
    let conditions: Array<{ field: string; operator: string; value: string | number }> = [];
    let messageTemplate = 'Hello {name}, check out our latest collections today!';
    let confidenceScore = 0.85;
    let confidenceReasoning = [
      'Targets active users with moderate past engagement',
      'Leverages high email open rates on weekend mornings'
    ];
    let estimatedRoi = 1500;
    let segmentSize = 50;

    if (goalLower.includes('cart') || goalLower.includes('abandon')) {
      name = 'Cart Recovery Urgency Sequence';
      channel = 'SMS'; // SMS is faster for abandoned carts
      conditions = [
        { field: 'segment', operator: 'equals', value: 'Cart Abandoner' }
      ];
      messageTemplate = 'Hi {name}! We noticed you left items in your cart. Complete your order in the next 2 hours for 10% off: {cart_url}!';
      confidenceScore = 0.94;
      confidenceReasoning = [
        'SMS has a 98% open rate within 3 minutes',
        'Urgency-driven 10% coupon increases checkout conversion by 22%',
        'Targets users who demonstrated active intent in the last 72 hours'
      ];
      estimatedRoi = 2800;
      segmentSize = 30; // 30% of users
    } else if (goalLower.includes('vip') || goalLower.includes('high value') || goalLower.includes('loyal')) {
      name = 'VIP Reward & Retention Campaign';
      channel = 'WHATSAPP';
      conditions = [
        { field: 'segment', operator: 'equals', value: 'VIP' }
      ];
      messageTemplate = 'Dearest {name}, as one of our most valued VIP customers, here is early access to our exclusive anniversary sale! Use code VIPEARLY at checkout.';
      confidenceScore = 0.89;
      confidenceReasoning = [
        'VIP customer segments exhibit a 3.5x higher purchase frequency',
        'WhatsApp creates a high-touch personalized feel for brand loyalty',
        'Exclusivity copy triggers high engagement rates'
      ];
      estimatedRoi = 5200;
      segmentSize = 20;
    } else if (goalLower.includes('inactive') || goalLower.includes('winback') || goalLower.includes('re-engage')) {
      name = 'Winback Re-engagement Campaign';
      channel = 'EMAIL';
      conditions = [
        { field: 'last_order_days', operator: 'gte', value: 60 }
      ];
      messageTemplate = 'We miss you, {name}! It has been a while since your last visit. Here is $15 off your next order: MISSYOU15.';
      confidenceScore = 0.76;
      confidenceReasoning = [
        'Email is cost-effective for large dormant audiences',
        'Direct dollar discount outperforms percentage discounts for inactive cohorts',
        'Aims to rebuild brand affinity with an attractive incentive'
      ];
      estimatedRoi = 1800;
      segmentSize = 40;
    } else if (goalLower.includes('new') || goalLower.includes('welcome') || goalLower.includes('sign up')) {
      name = 'Welcome Onboarding Series';
      channel = 'EMAIL';
      conditions = [
        { field: 'segment', operator: 'equals', value: 'New User' }
      ];
      messageTemplate = 'Welcome to Xeno, {name}! Get started with 15% off your very first order using code WELCOME15. Let us know if you need anything!';
      confidenceScore = 0.88;
      confidenceReasoning = [
        'Immediate welcome message capitalizes on peak buyer interest',
        'Simple welcome gift eases first-time buyer friction',
        'Sets expectations for future communication cadence'
      ];
      estimatedRoi = 1200;
      segmentSize = 25;
    }

    return {
      name,
      goal,
      channel,
      segmentDsl: JSON.stringify({ conditions, logicalOperator: 'AND' }),
      messageTemplate,
      confidenceScore,
      confidenceReasoning,
      estimatedRoi,
      segmentSize,
    };
  }
}
