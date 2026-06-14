export interface BadgeColors {
  bg: string;
  text: string;
  border: string;
}

/**
 * Maps campaign status to color styles
 */
export function getCampaignStatusColors(status: string): BadgeColors {
  const normalized = status.toUpperCase();

  switch (normalized) {
    case 'DRAFT':
      return {
        bg: 'bg-secondary',
        text: 'text-text-secondary',
        border: 'border-border'
      };
    case 'READY':
      return {
        bg: 'bg-accent-amber/10',
        text: 'text-accent-amber',
        border: 'border-accent-amber/25'
      };
    case 'LAUNCHING':
      return {
        bg: 'bg-primary/10',
        text: 'text-primary',
        border: 'border-primary/25'
      };
    case 'COMPLETED':
      return {
        bg: 'bg-accent-emerald/10',
        text: 'text-accent-emerald',
        border: 'border-accent-emerald/25'
      };
    case 'FAILED':
      return {
        bg: 'bg-accent-rose/10',
        text: 'text-accent-rose',
        border: 'border-accent-rose/25'
      };
    default:
      return {
        bg: 'bg-secondary',
        text: 'text-text-secondary',
        border: 'border-border'
      };
  }
}

/**
 * Maps recipient callback status to color styles
 */
export function getRecipientStatusColors(status: string): BadgeColors {
  const normalized = status.toUpperCase();

  switch (normalized) {
    case 'PENDING':
      return {
        bg: 'bg-secondary',
        text: 'text-text-muted',
        border: 'border-border'
      };
    case 'SENT':
      return {
        bg: 'bg-primary/10',
        text: 'text-primary',
        border: 'border-primary/25'
      };
    case 'DELIVERED':
      return {
        bg: 'bg-accent-cyan/10',
        text: 'text-accent-cyan',
        border: 'border-accent-cyan/25'
      };
    case 'READ':
      return {
        bg: 'bg-accent-emerald/10',
        text: 'text-accent-emerald',
        border: 'border-accent-emerald/25'
      };
    case 'FAILED':
      return {
        bg: 'bg-accent-rose/10',
        text: 'text-accent-rose',
        border: 'border-accent-rose/25'
      };
    default:
      return {
        bg: 'bg-secondary',
        text: 'text-text-secondary',
        border: 'border-border'
      };
  }
}
