export interface Insight {
  id: string;
  title: string;
  description: string;
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  metric: string;
  channel: 'EMAIL' | 'SMS' | 'WHATSAPP';
  campaignId?: string;
  recommendedAction: string;
}
