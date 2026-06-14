import { api } from './axios';
import { Insight } from '../types/insight';

export const insightsApi = {
  getInsights: async (): Promise<Insight[]> => {
    const response = await api.get('/insights');
    return response.data.data;
  },

  getCampaignInsights: async (campaignId: string): Promise<Insight[]> => {
    const response = await api.get(`/campaigns/${campaignId}/insights`);
    return response.data.data;
  },
};
