export interface ChannelEvent {
  id: string;
  recipientId: string;
  eventId: string;
  eventType: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  timestamp: string;
  payload: string;
}
