import axios from 'axios';
import { logger } from '../utils/logger';

export class GeminiService {
  private primaryKey: string;
  private secondaryKey: string;

  constructor() {
    this.primaryKey = process.env.GEMINI_API_KEY_PRIMARY || process.env.GEMINI_API_KEY || '';
    this.secondaryKey = process.env.GEMINI_API_KEY_SECONDARY || '';
  }

  /**
   * Generates a conversational summaries using Gemini API with key rotation failover.
   */
  async generateVoiceSummary(plan: {
    goal: string;
    segment: string;
    channel: string;
    template: string;
    strength: string;
    reasons: string[];
  }): Promise<string> {
    const keys = [this.primaryKey, this.secondaryKey].filter(k => k && k.startsWith('AIzaSy'));

    if (keys.length === 0) {
      logger.info('No Gemini API keys configured. Using local fallback voice summary.');
      return this.getLocalFallback(plan);
    }

    const prompt = `You are Xeno, the AI-Native Marketing Copilot for BrewBean Coffee.
Our decision engine has analyzed the marketer's goal and generated a data-driven campaign plan.
Your task is to act as the "mouth/voice" of our system. Present the plan in a highly engaging, professional, and friendly manner to the marketer.

Goal: "${plan.goal}"
Target Segment: "${plan.segment}"
Recommended Channel: "${plan.channel}"
Message Template: "${plan.template}"
Recommendation Strength: "${plan.strength}"

Key Data Points:
${plan.reasons.map(r => `- ${r}`).join('\n')}

Provide a concise, talkative executive summary (2 sentences max) explaining why this plan was built and why the marketer should launch it. Be encouraging and sound like an elite co-strategist roaster. Do not output markdown lists or formatting, just plain text.`;

    for (let i = 0; i < keys.length; i++) {
      const apiKey = keys[i];
      const isPrimary = i === 0;
      logger.info(`Calling Gemini API using ${isPrimary ? 'PRIMARY' : 'SECONDARY'} API Key...`);

      try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            contents: [
              {
                parts: [
                  {
                    text: prompt
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 250
            }
          },
          {
            timeout: 6000 // 6-second timeout to failover quickly
          }
        );

        const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          logger.info('Gemini response generated successfully.');
          return text.trim().replace(/\n+/g, ' ');
        }
      } catch (err: any) {
        const status = err.response?.status;
        const details = err.response?.data?.error?.message || err.message;
        logger.warn(
          `Gemini API call failed with key index ${i} (${isPrimary ? 'primary' : 'secondary'}). Status: ${status}. Error: ${details}`
        );

        if (i < keys.length - 1) {
          logger.info('Failing over to SECONDARY Gemini API key...');
        }
      }
    }

    logger.warn('All Gemini API keys failed or exhausted. Using local fallback.');
    return this.getLocalFallback(plan);
  }

  private getLocalFallback(plan: { segment: string; channel: string; strength: string }): string {
    const channelPhrases: Record<string, string> = {
      EMAIL: 'Email is chosen to deliver detailed, visual engagement at low cost.',
      SMS: 'SMS is chosen to maximize immediate delivery rates directly to their mobile screens.',
      WHATSAPP: 'WhatsApp is chosen to offer a rich, personal, and highly interactive communication experience.',
    };

    return `I've analyzed our BrewBean customer data and generated a ${plan.strength}-strength campaign targeting your ${plan.segment} segment. ${channelPhrases[plan.channel] || ''} This strategy is fully optimized based on your segment's historical conversion trends.`;
  }
}
