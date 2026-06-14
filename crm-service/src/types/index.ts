export interface LaunchCampaignResponse {
  success: boolean;
  message: string;
  recipientsCount: number;
}

export interface CopilotPlanResponse {
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

export interface CampaignStats {
  id: string;
  name: string;
  goal: string;
  channel: string;
  status: string;
  createdAt: string;
  metrics: {
    total: number;
    sent: number;
    delivered: number;
    read: number;
    failed: number;
    deliveryRate: number;
    readRate: number;
    revenueRecovered: number;
  };
}

export interface InsightData {
  id: string;
  title: string;
  description: string;
  impact: string;
  metric: string;
  channel: string;
  campaignId?: string;
  recommendedAction: string;
}
