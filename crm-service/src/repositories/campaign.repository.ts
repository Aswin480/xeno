import { prisma } from '../config/prisma';
import { Campaign, CampaignRecipient } from '@prisma/client';

export class CampaignRepository {
  async create(data: {
    name: string;
    goal: string;
    segmentDsl: string;
    status: string;
    channel: string;
    messageTemplate: string;
    confidenceScore: number;
    estimatedRoi: number;
  }): Promise<Campaign> {
    return prisma.campaign.create({
      data,
    });
  }

  async findAll(): Promise<Campaign[]> {
    return prisma.campaign.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string): Promise<(Campaign & { recipients: (CampaignRecipient & { customer: { name: string; email: string; phone: string } })[] }) | null> {
    return prisma.campaign.findUnique({
      where: { id },
      include: {
        recipients: {
          include: {
            customer: {
              select: {
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });
  }

  async updateStatus(id: string, status: string): Promise<Campaign> {
    return prisma.campaign.update({
      where: { id },
      data: { status },
    });
  }

  async update(id: string, data: Partial<Campaign>): Promise<Campaign> {
    return prisma.campaign.update({
      where: { id },
      data,
    });
  }
}
