/**
 * Simulated delivery, read, and conversion probabilities across channels.
 */
export const ChannelProbabilities = {
  WHATSAPP: {
    delivery: 0.95,
    read: 0.70,
    click: 0.30,
    conversion: 0.08
  },
  SMS: {
    delivery: 0.92,
    read: 0.35,
    click: 0.15,
    conversion: 0.04
  },
  EMAIL: {
    delivery: 0.88,
    read: 0.25,
    click: 0.08,
    conversion: 0.02
  }
};

/**
 * Returns true if a random check falls within the error probability threshold
 */
export function rollFailure(failureRate = 0.05): boolean {
  return Math.random() < failureRate;
}

/**
 * Returns a random integer between min and max inclusive
 */
export function getLatencyMs(min = 300, max = 1500): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
