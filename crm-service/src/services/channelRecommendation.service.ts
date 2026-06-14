import { prisma } from '../config/prisma';
import { logger } from '../utils/logger';
import { rankChannels } from '../utils/channelRanking';

export class ChannelRecommendationService {
  /**
   * Recommends the best communication channel based on historical delivery and read rates.
   */
  async recommendBestChannel(): Promise<{ channel: 'EMAIL' | 'SMS' | 'WHATSAPP'; score: number; reasoning: string }> {
    try {
      const stats = await prisma.campaignRecipient.groupBy({
        by: ['status'],
        _count: {
          id: true,
        },
      });

      // Let's do a query of campaign channels and see how their read rates compare
      const campaigns = await prisma.campaign.findMany({
        include: {
          recipients: true,
        },
      });

      if (campaigns.length === 0) {
        return {
          channel: 'EMAIL',
          score: 0.85,
          reasoning: 'Default channel recommendation based on balanced pricing and universal accessibility.',
        };
      }

      const channelStats: Record<string, { sent: number; read: number }> = {
        EMAIL: { sent: 0, read: 0 },
        SMS: { sent: 0, read: 0 },
        WHATSAPP: { sent: 0, read: 0 },
      };

      for (const camp of campaigns) {
        const chan = camp.channel;
        if (!channelStats[chan]) continue;

        for (const rec of camp.recipients) {
          if (rec.status === 'SENT' || rec.status === 'DELIVERED' || rec.status === 'READ') {
            channelStats[chan].sent++;
          }
          if (rec.status === 'READ') {
            channelStats[chan].read++;
          }
        }
      }

      const ranked = rankChannels(channelStats as any);
      const bestChannel = ranked[0];
      const metrics = channelStats[bestChannel];
      const highestRate = metrics.sent > 0 ? metrics.read / metrics.sent : 0;

      // If no read history yet, choose a default
      if (highestRate === 0) {
        return {
          channel: 'WHATSAPP',
          score: 0.92,
          reasoning: 'WhatsApp recommended as first engagement channel, exhibiting the highest industry open rates (98%+).',
        };
      }

      const percentage = Math.round(highestRate * 100);
      return {
        channel: bestChannel,
        score: highestRate,
        reasoning: `Historically, the ${bestChannel} channel displays the highest customer engagement rate of ${percentage}% in your workspace.`,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Failed to calculate channel recommendation:', errorMsg);
      return {
        channel: 'EMAIL',
        score: 0.80,
        reasoning: 'Email default fallback recommendation.',
      };
    }
  }
}
