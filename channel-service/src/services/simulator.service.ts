import { scheduleCallbacks } from './callback.service';

export function simulateSend(payload: any) {
  // schedule simulated callbacks with timeouts
  scheduleCallbacks(payload);
}
