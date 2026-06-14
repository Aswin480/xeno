import axios from 'axios';

export function scheduleCallbacks(payload: any) {
  const { recipients, campaignId } = payload;
  recipients.forEach((r: any, i: number) => {
    setTimeout(async () => {
      // send delivery event
      await axios.post(process.env.CRM_SERVICE_URL + '/api/receipts', {
        eventId: `evt_${campaignId}_${r.customerId}_${i}`,
        recipientId: r.id,
        campaignId,
        status: 'DELIVERED',
        timestamp: new Date().toISOString(),
      }).catch(() => {});
    }, 1000 + i * 50);
  });
}
