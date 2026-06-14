export interface Campaign {
  id: string;
  name: string;
  goal: string;
  segmentDsl: string;
  status: 'DRAFT' | 'READY' | 'LAUNCHING' | 'COMPLETED' | 'FAILED';
  channel: 'EMAIL' | 'SMS' | 'WHATSAPP';
  messageTemplate: string;
  confidenceScore: number;
  estimatedRoi: number;
  createdAt: string;
  updatedAt: string;
  metrics?: {
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
