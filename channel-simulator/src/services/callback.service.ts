import axios from 'axios';

export interface CallbackPayload {
  eventId: string;
  recipientId: string;
  status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  timestamp: string;
  errorMessage?: string;
  payload?: Record<string, unknown>;
}

export class CallbackService {
  /**
   * Fires a callback payload back to the CRM webhook URL.
   */
  async fireCallback(url: string, payload: CallbackPayload): Promise<boolean> {
    try {
      console.log(`[CALLBACK-WORKER] Posting status "${payload.status}" to: ${url}`);
      const response = await axios.post(url, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000,
      });

      return response.status === 200;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error(`[CALLBACK-WORKER] [ERROR] Failed to post callback ${payload.eventId} to ${url}: ${errorMsg}`);
      return false;
    }
  }
}
export default new CallbackService();
