import React from 'react';
import { getCampaignStatusColors, getRecipientStatusColors } from '../../utils/status';

interface StatusBadgeProps {
  status: string;
  type?: 'campaign' | 'recipient';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'campaign' }) => {
  const colors =
    type === 'campaign' ? getCampaignStatusColors(status) : getRecipientStatusColors(status);

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border capitalize tracking-wide select-none ${colors.bg} ${colors.text} ${colors.border}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80"></span>
      {status.toLowerCase()}
    </span>
  );
};
export default StatusBadge;
