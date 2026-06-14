import { z } from 'zod';

export const receiptSchema = z.object({
  eventId: z.string().min(1, 'eventId is required'),
  recipientId: z.string().uuid('recipientId must be a valid UUID'),
  status: z.enum(['SENT', 'DELIVERED', 'READ', 'FAILED']),
  timestamp: z.string().datetime({ message: 'timestamp must be a valid ISO 8601 string' }),
  errorMessage: z.string().optional(),
  payload: z.record(z.unknown()).optional(),
});

export type ReceiptInput = z.infer<typeof receiptSchema>;
