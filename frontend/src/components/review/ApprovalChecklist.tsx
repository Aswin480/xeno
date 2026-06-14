import React from 'react';
import { Check, X, ClipboardCheck } from 'lucide-react';

interface ApprovalChecklistProps {
  campaignName: string;
  segmentSize: number;
  messageTemplate: string;
  simulatorOnline: boolean;
}

export const ApprovalChecklist: React.FC<ApprovalChecklistProps> = ({
  campaignName,
  segmentSize,
  messageTemplate,
  simulatorOnline,
}) => {
  const checks = [
    {
      label: 'Campaign Name Defined',
      isValid: campaignName.trim().length >= 3,
      error: 'Must be at least 3 characters',
    },
    {
      label: 'Targetable Audience Size Positive',
      isValid: segmentSize > 0,
      error: 'Audience segment contains 0 customers',
    },
    {
      label: 'Message Content Personalized',
      isValid: messageTemplate.trim().length >= 5 && messageTemplate.includes('{name}'),
      error: 'Must be 5+ chars and contain dynamic tag {name}',
    },
    {
      label: 'Channel Delivery Gateway Online',
      isValid: simulatorOnline,
      error: 'Channel Simulator service is unreachable',
    },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center space-x-2">
        <ClipboardCheck className="w-4.5 h-4.5 text-primary" />
        <h4 className="text-sm font-semibold text-text-primary">Launch Approval Checklist</h4>
      </div>

      <div className="space-y-3">
        {checks.map((check, idx) => (
          <div key={idx} className="flex items-start justify-between text-xs border-b border-border pb-2 last:border-0 last:pb-0">
            <div className="flex items-center space-x-2.5">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${check.isValid ? 'bg-accent-emerald/20 text-accent-emerald' : 'bg-accent-rose/20 text-accent-rose'}`}>
                {check.isValid ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              </div>
              <span className={`font-medium ${check.isValid ? 'text-text-primary' : 'text-text-secondary'}`}>
                {check.label}
              </span>
            </div>
            {!check.isValid && (
              <span className="text-[10px] text-accent-rose font-semibold bg-accent-rose/10 px-2 py-0.5 rounded border border-accent-rose/20 font-mono">
                {check.error}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default ApprovalChecklist;
