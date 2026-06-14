import crypto from 'crypto';

export function generateEventId(): string {
  return `evt-${crypto.randomUUID()}`;
}

export interface StatusCallbackStep {
  status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  delayMs: number;
  errorMessage?: string;
}

export class EventGeneratorService {
  /**
   * Generates a sequence of callbacks representing a message journey.
   */
  generateStatusFlow(
    channel: 'SMS' | 'EMAIL' | 'WHATSAPP',
    failureRate = 0.05
  ): StatusCallbackStep[] {
    const flow: StatusCallbackStep[] = [];
    const isFailed = Math.random() < failureRate;

    // 1. Initial Send Attempt
    flow.push({
      status: 'SENT',
      delayMs: 100,
    });

    if (isFailed) {
      const failStep = Math.random() > 0.5 ? 'DELIVERED' : 'SENT';
      if (failStep === 'SENT') {
        flow.push({
          status: 'FAILED',
          delayMs: 600,
          errorMessage: 'Provider transmission failed: Route blocked or invalid number format',
        });
      } else {
        flow.push({
          status: 'DELIVERED',
          delayMs: 800,
        });
        flow.push({
          status: 'FAILED',
          delayMs: 1200,
          errorMessage: 'Handset unreachable: Device powered off or out of coverage',
        });
      }
      return flow;
    }

    // 2. Successful Delivery
    flow.push({
      status: 'DELIVERED',
      delayMs: 1000 + Math.floor(Math.random() * 1000), // 1-2s delay
    });

    // 3. Reader Open Event (Probabilistic based on channel specs)
    const readProbability = channel === 'SMS' ? 0.35 : channel === 'WHATSAPP' ? 0.70 : 0.25;
    const isOpened = Math.random() < readProbability;

    if (isOpened) {
      flow.push({
        status: 'READ',
        delayMs: 2500 + Math.floor(Math.random() * 2000), // 2.5-4.5s delay
      });
    }

    return flow;
  }
}
export default new EventGeneratorService();
