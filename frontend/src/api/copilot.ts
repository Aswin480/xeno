import { api } from './axios';

export interface CopilotPlan {
  name: string;
  goal: string;
  channel: 'EMAIL' | 'SMS' | 'WHATSAPP';
  segmentDsl: string;
  messageTemplate: string;
  confidenceScore: number;
  confidenceReasoning: string[];
  estimatedRoi: number;
  segmentSize: number;
  voiceSummary?: string;
}

export const copilotApi = {
  generatePlan: async (goal: string): Promise<CopilotPlan> => {
    const response = await api.post('/copilot/generate-plan', { goal });
    return response.data.data;
  },

  getObserveOutcome: async (campaignId: string): Promise<any> => {
    const response = await api.get(`/copilot/observe/${campaignId}`);
    return response.data.data;
  },
};
