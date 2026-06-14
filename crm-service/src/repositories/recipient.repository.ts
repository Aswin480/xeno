import { prisma } from '../config/prisma';
import { CampaignRecipient } from '@prisma/client';

export class RecipientRepository {
  async createMany(recipients: { campaignId: string; customerId: string; status: string }[]): Promise<number> {
    const result = await prisma.campaignRecipient.createMany({
      data: recipients,
    });
    return result.count;
  }

  async findByCampaignId(campaignId: string): Promise<CampaignRecipient[]> {
    return prisma.campaignRecipient.findMany({
      where: { campaignId },
      include: {
        customer: true,
      },
    });
  }

  async findByEventId(eventId: string): Promise<CampaignRecipient | null> {
    return prisma.campaignRecipient.findUnique({
      where: { eventId },
    });
  }

  async findByCampaignAndCustomer(campaignId: string, customerId: string): Promise<CampaignRecipient | null> {
    return prisma.campaignRecipient.findUnique({
      where: {
        campaignId_customerId: {
          campaignId,
          customerId,
        },
      },
    });
  }

  async updateRecipient(
    id: string,
    data: Partial<CampaignRecipient>
  ): Promise<CampaignRecipient> {
    return prisma.campaignRecipient.update({
      where: { id },
      data,
    });
  }
}
