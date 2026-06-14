import { CampaignRepository } from '../repositories/campaign.repository';
import { RecipientRepository } from '../repositories/recipient.repository';
import { SegmentationService } from './segmentation.service';
import { ChannelClient } from '../integrations/channelClient';
import { config } from '../config/env';
import { logger } from '../utils/logger';
import { LaunchCampaignResponse } from '../types';
import { AnalyticsService } from './analytics.service';

export class LaunchService {
  private campaignRepo: CampaignRepository;
  private recipientRepo: RecipientRepository;
  private segmentationService: SegmentationService;
  private channelClient: ChannelClient;

  constructor() {
    this.campaignRepo = new CampaignRepository();
    this.recipientRepo = new RecipientRepository();
    this.segmentationService = new SegmentationService();
    this.channelClient = new ChannelClient();
  }

  /**
   * Triggers the launch process for a campaign. Resolves audience, creates pending receipts,
   * and dispatches sending asynchronously.
   */
  async launchCampaign(campaignId: string): Promise<LaunchCampaignResponse> {
    const campaign = await this.campaignRepo.findById(campaignId);
    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }

    if (campaign.status === 'LAUNCHING') {
      return {
        success: false,
        message: 'Campaign is already launching',
        recipientsCount: 0,
      };
    }

    // 1. Set campaign status to LAUNCHING
    await this.campaignRepo.updateStatus(campaignId, 'LAUNCHING');

    // 2. Resolve target customers
    const targetCustomers = await this.segmentationService.resolveSegment(campaign.segmentDsl);

    if (targetCustomers.length === 0) {
      await this.campaignRepo.updateStatus(campaignId, 'COMPLETED');
      AnalyticsService.clearCache();
      return {
        success: true,
        message: 'Campaign launched successfully (target audience was empty)',
        recipientsCount: 0,
      };
    }

    // 3. Create Pending Campaign Recipients (Pre-register recipients)
    const recipientPayloads = targetCustomers.map(customer => ({
      campaignId,
      customerId: customer.id,
      status: 'PENDING',
    }));

    // Insert recipients into DB (handles duplicates by skipping them)
    await this.recipientRepo.createMany(recipientPayloads);

    // Retrieve full recipient records with database IDs
    const createdRecipients = await this.recipientRepo.findByCampaignId(campaignId);

    // Filter createdRecipients to only those matching target customers and currently PENDING
    const pendingRecipients = createdRecipients.filter(
      r => r.status === 'PENDING' && targetCustomers.some(tc => tc.id === r.customerId)
    );

    // 4. Start asynchronous message dispatch (Non-blocking background worker)
    this.dispatchMessagesBackground(campaignId, pendingRecipients, campaign.channel as 'SMS' | 'EMAIL' | 'WHATSAPP', campaign.messageTemplate, targetCustomers);

    logger.info(`Campaign ${campaignId} launch initiated. Dispatching ${pendingRecipients.length} messages in background.`);

    return {
      success: true,
      message: `Campaign dispatch started for ${pendingRecipients.length} recipients`,
      recipientsCount: pendingRecipients.length,
    };
  }

  private async dispatchMessagesBackground(
    campaignId: string,
    recipients: Array<{ id: string; customerId: string }>,
    channel: 'SMS' | 'EMAIL' | 'WHATSAPP',
    template: string,
    customers: Array<{ id: string; name: string; email: string; phone: string }>
  ): Promise<void> {
    logger.info(`Starting background message delivery for campaign ${campaignId}...`);

    const callbackUrl = `http://localhost:${config.port}/receipts`;
    const chunkSize = 5;

    for (let i = 0; i < recipients.length; i += chunkSize) {
      const chunk = recipients.slice(i, i + chunkSize);
      await Promise.all(
        chunk.map(async (recipient) => {
          const customer = customers.find((c) => c.id === recipient.customerId);
          if (!customer) return;

          // Compile personal template
          const compiledMessage = template.replace(/{name}/g, customer.name);

          // Identify destination address
          const destination = channel === 'EMAIL' ? customer.email : customer.phone;

          try {
            // Call simulator
            const response = await this.channelClient.sendMessage({
              recipientId: recipient.id,
              channel,
              destination,
              message: compiledMessage,
              callbackUrl,
            });

            if (response.success && response.eventId) {
              // Update recipient with eventId and SENT status
              await this.recipientRepo.updateRecipient(recipient.id, {
                status: 'SENT',
                eventId: response.eventId,
                sentAt: new Date(),
              });
            } else {
              // Update recipient with FAILED status and error message
              await this.recipientRepo.updateRecipient(recipient.id, {
                status: 'FAILED',
                failedAt: new Date(),
                errorMessage: response.errorMessage || 'Unknown simulator delivery failure',
              });
            }
          } catch (err: any) {
            await this.recipientRepo.updateRecipient(recipient.id, {
              status: 'FAILED',
              failedAt: new Date(),
              errorMessage: err.message || 'Connection failure',
            });
          }
        })
      );
    }

    // Set campaign status to COMPLETED once all dispatches are processed
    await this.campaignRepo.updateStatus(campaignId, 'COMPLETED');
    AnalyticsService.clearCache();
    logger.info(`Background message delivery for campaign ${campaignId} finished.`);
  }
}
