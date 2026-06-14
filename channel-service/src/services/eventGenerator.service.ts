export function generateEvent(recipient: any, campaignId: string, type: string) {
  return {
    eventId: `evt_${campaignId}_${recipient.customerId}_${type}_${Date.now()}`,
    recipientId: recipient.id,
    campaignId,
    status: type,
    timestamp: new Date().toISOString(),
  };
}
