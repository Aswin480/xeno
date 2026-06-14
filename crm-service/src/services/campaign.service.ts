import { CampaignRepository } from '../repositories/campaign.repository';
import { Campaign } from '@prisma/client';

export class CampaignService {
  private campaignRepo: CampaignRepository;

  constructor() {
    this.campaignRepo = new CampaignRepository();
  }

  async createCampaign(data: {
    name: string;
    goal: string;
    segmentDsl: string;
    status: string;
    channel: string;
    messageTemplate: string;
    confidenceScore: number;
    estimatedRoi: number;
  }): Promise<Campaign> {
    return this.campaignRepo.create(data);
  }

  async getAllCampaigns(): Promise<Campaign[]> {
    return this.campaignRepo.findAll();
  }

  async getCampaignById(id: string) {
    return this.campaignRepo.findById(id);
  }

  async updateCampaignStatus(id: string, status: string): Promise<Campaign> {
    return this.campaignRepo.updateStatus(id, status);
  }
}
