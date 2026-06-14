import { z } from 'zod';

export const generatePlanSchema = z.object({
  goal: z.string().min(5, 'Marketing goal must be at least 5 characters long'),
});

export type GeneratePlanInput = z.infer<typeof generatePlanSchema>;
