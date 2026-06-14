/**
 * Utility to rank communication channels based on aggregate metrics.
 * Default ranking fallback: WHATSAPP (high open rate) > EMAIL (high reach) > SMS.
 */
export function rankChannels(stats: Record<'EMAIL' | 'SMS' | 'WHATSAPP', { sent: number; read: number }>): ('EMAIL' | 'SMS' | 'WHATSAPP')[] {
  return (Object.keys(stats) as ('EMAIL' | 'SMS' | 'WHATSAPP')[])
    .sort((a, b) => {
      const rateA = stats[a].sent > 0 ? stats[a].read / stats[a].sent : 0;
      const rateB = stats[b].sent > 0 ? stats[b].read / stats[b].sent : 0;
      
      if (rateA !== rateB) {
        return rateB - rateA; // Descending order of engagement rate
      }

      // Default fallback priorities if rates are equal
      const priorities: Record<string, number> = { WHATSAPP: 3, EMAIL: 2, SMS: 1 };
      return priorities[b] - priorities[a];
    });
}
