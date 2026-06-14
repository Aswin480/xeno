import eventGeneratorService, { generateEventId } from './eventGenerator.service';
import callbackService from './callback.service';

export interface SendRequest {
  recipientId: string;
  channel: 'SMS' | 'EMAIL' | 'WHATSAPP';
  destination: string;
  message: string;
  callbackUrl: string;
}

export class SimulatorService {
  /**
   * Accepts a message send request and schedules asynchronous status callback flows.
   */
  async processSendRequest(request: SendRequest): Promise<{ success: boolean; eventId: string }> {
    const { recipientId, channel, callbackUrl } = request;
    const eventId = generateEventId();

    // 1. Generate callback pipeline sequence
    const flowSteps = eventGeneratorService.generateStatusFlow(channel);

    console.log(`[SIMULATOR] Scheduled ${flowSteps.length} callback steps for recipient ${recipientId} via ${channel}. Event ID: ${eventId}`);

    // 2. Schedule callback dispatches in background
    let accumulatedDelay = 0;

    for (const step of flowSteps) {
      accumulatedDelay += step.delayMs;

      // Use a closure to capture the step parameters
      setTimeout(async () => {
        const payload = {
          eventId,
          recipientId,
          status: step.status,
          timestamp: new Date().toISOString(),
          errorMessage: step.errorMessage,
          payload: {
            simulatedChannel: channel,
            attemptTime: Date.now(),
          },
        };

        await callbackService.fireCallback(callbackUrl, payload);
      }, accumulatedDelay);
    }

    // 3. Respond immediately to the caller
    return {
      success: true,
      eventId,
    };
  }
}
export default new SimulatorService();
