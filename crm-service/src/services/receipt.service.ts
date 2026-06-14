import { RecipientRepository } from '../repositories/recipient.repository';
import { EventRepository } from '../repositories/event.repository';
import { canTransition } from '../utils/statusPrecedence';
import { logger } from '../utils/logger';

export interface CallbackPayload {
  eventId: string;
  recipientId: string;
  status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  timestamp: string;
  errorMessage?: string;
  payload?: Record<string, unknown>;
}

export class ReceiptService {
  private recipientRepo: RecipientRepository;
  private eventRepo: EventRepository;

  constructor() {
    this.recipientRepo = new RecipientRepository();
    this.eventRepo = new EventRepository();
  }

  /**
   * Processes a webhook callback event from the channel simulator
   */
  async processCallback(callback: CallbackPayload): Promise<{ processed: boolean; reason: string }> {
    const { eventId, recipientId, status, timestamp, errorMessage, payload } = callback;
    logger.info(`Received callback event ${eventId} for recipient ${recipientId} with status ${status}`);

    // 1. Idempotency Check: Verify if this eventId has already been processed
    const existingEvent = await this.eventRepo.findByEventId(eventId);
    if (existingEvent) {
      logger.info(`Callback event ${eventId} already processed (Idempotency check passed). Skipping.`);
      return { processed: false, reason: 'Duplicate event (already processed)' };
    }

    // 2. Load the target campaign recipient
    // Actually, recipientRepo has findByCampaignId, etc. Let's look at recipientRepo:
    // It has findByCampaignId, findByEventId, etc.
    // Let's retrieve by recipientId in recipientRepo. Let's check how we retrieve.
    // Ah, wait: we can retrieve using prisma directly, or add a method to recipientRepo.
    // Let's add findById to recipientRepo, or use prisma directly. In recipientRepo, let's look:
    // We didn't define a direct findById, let's do prisma directly or update recipientRepo.
    // We can query prisma.campaignRecipient.findUnique({ where: { id: recipientId } }).
    // Let's check recipientRepo methods we wrote:
    // - createMany
    // - findByCampaignId
    // - findByEventId
    // - findByCampaignAndCustomer
    // - updateRecipient
    // We can add findById or query via prisma in the service, or write it in recipient.repository.ts.
    // Let's query via prisma directly or update recipient.repository.ts. Since we are in typescript,
    // let's do a findUnique on prisma.campaignRecipient.
    const { prisma } = await import('../config/prisma');
    const dbRecipient = await prisma.campaignRecipient.findUnique({
      where: { id: recipientId }
    });

    if (!dbRecipient) {
      logger.warn(`Recipient ${recipientId} not found in database for callback ${eventId}.`);
      return { processed: false, reason: 'Recipient not found' };
    }

    const currentStatus = dbRecipient.status;

    // 3. Precedence Check: Verify if we can transition from currentStatus to newStatus
    const isTransitionAllowed = canTransition(currentStatus, status);

    // Use a status-specific key to allow multiple status callbacks per message while keeping each status idempotent
    const idempotentEventId = `${eventId}_${status.toLowerCase()}`;

    try {
      // 4. Create the ChannelEvent to lock this eventId (idempotency key)
      await this.eventRepo.create({
        recipientId,
        eventId: idempotentEventId,
        eventType: status,
        payload: JSON.stringify(payload || { timestamp, errorMessage }),
      });
    } catch (err: any) {
      // Check for Prisma unique constraint error code (P2002)
      if (err.code === 'P2002') {
        logger.info(`Duplicate callback event ignored for recipient ${recipientId} status ${status}.`);
        return { processed: false, reason: 'Duplicate event ignored' };
      }
      throw err;
    }

    if (!isTransitionAllowed) {
      logger.info(
        `Precedence check rejected status downgrade. Recipient ${recipientId} remains in ${currentStatus} state (attempted ${status}).`
      );
      return {
        processed: false,
        reason: `Ignored status transition from ${currentStatus} to ${status} (precedence rules)`
      };
    }

    // 5. Update CampaignRecipient status & timestamps
    const updateData: Partial<typeof dbRecipient> = {
      status: status,
    };

    const eventDate = new Date(timestamp);
    if (status === 'SENT') {
      updateData.sentAt = eventDate;
    } else if (status === 'DELIVERED') {
      updateData.deliveredAt = eventDate;
    } else if (status === 'READ') {
      updateData.readAt = eventDate;
    } else if (status === 'FAILED') {
      updateData.failedAt = eventDate;
      updateData.errorMessage = errorMessage || 'Simulator reporting callback failure';
    }

    // Keep the latest eventId on the recipient record for quick reference
    updateData.eventId = eventId;

    await this.recipientRepo.updateRecipient(recipientId, updateData);
    logger.info(`Recipient ${recipientId} status successfully transitioned from ${currentStatus} to ${status}.`);

    if (status === 'READ') {
      // Simulate conversion: 12% chance this customer completes an order
      if (Math.random() < 0.12) {
        const categories = ['Espresso', 'Latte', 'Cold Brew', 'Americano', 'Mocha', 'Coffee Beans', 'Pastries'];
        const category = categories[Math.floor(Math.random() * categories.length)];
        const orderAmount = 8 + Math.random() * 25;
        
        await prisma.order.create({
          data: {
            customerId: dbRecipient.customerId,
            amount: Math.round(orderAmount * 100) / 100,
            status: 'COMPLETED',
            category,
          }
        });
        logger.info(`Simulated purchase conversion for customer ${dbRecipient.customerId} - Category: ${category}`);
      }
    }

    return { processed: true, reason: 'Recipient status updated' };
  }
}
