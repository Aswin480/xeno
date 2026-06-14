import { z } from 'zod';

export const createCampaignSchema = z.object({
  name: z.string().min(3, 'Campaign name must be at least 3 characters'),
  goal: z.string().min(5, 'Goal description must be at least 5 characters'),
  segmentDsl: z.string().refine((val) => {
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  }, 'Segment DSL must be a valid JSON string'),
  channel: z.enum(['EMAIL', 'SMS', 'WHATSAPP']),
  messageTemplate: z.string().min(3, 'Message template must be at least 3 characters'),
  confidenceScore: z.number().min(0).max(1).optional(),
  estimatedRoi: z.number().nonnegative().optional(),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
