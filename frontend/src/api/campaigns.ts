import { api } from './axios';
import { Campaign } from '../types/campaign';

export const campaignsApi = {
  getCampaigns: async (): Promise<Campaign[]> => {
    const response = await api.get('/campaigns');
    return response.data.data;
  },

  getCampaign: async (id: string): Promise<Campaign> => {
    const response = await api.get(`/campaigns/${id}`);
    return response.data.data;
  },

  createCampaign: async (campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<Campaign> => {
    const response = await api.post('/campaigns', campaign);
    return response.data.data;
  },

  launchCampaign: async (id: string): Promise<{ success: boolean; message: string; recipientsCount: number }> => {
    const response = await api.post(`/campaigns/${id}/launch`);
    return response.data;
  },
};
