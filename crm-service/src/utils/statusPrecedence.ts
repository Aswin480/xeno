const STATUS_PRECEDENCE: Record<string, number> = {
  PENDING: 0,
  SENT: 1,
  FAILED: 2,
  DELIVERED: 3,
  READ: 4,
};

/**
 * Determines whether a state transition from currentStatus to newStatus is valid.
 * A transition is valid if the new status has a higher precedence than the current status.
 * Terminal states or higher states cannot be overridden by lower states.
 */
export function canTransition(currentStatus: string, newStatus: string): boolean {
  const currentRank = STATUS_PRECEDENCE[currentStatus.toUpperCase()] ?? -1;
  const newRank = STATUS_PRECEDENCE[newStatus.toUpperCase()] ?? -1;

  // If status is unrecognized, do not allow change
  if (currentRank === -1 || newRank === -1) {
    return false;
  }

  // Precedence rule: new status rank must be strictly greater than current status rank
  // Wait: can we transition from SENT to FAILED? Yes, because sending succeeded but delivery failed.
  // Can we transition from DELIVERED to FAILED? In some channels, delivery is final, but in others it might fail.
  // However, once READ or DELIVERED, we shouldn't degrade back to SENT or PENDING.
  return newRank > currentRank;
}
