import React from 'react';
import { Target, Mail, MessageSquare, PhoneCall } from 'lucide-react';

interface CampaignSummaryProps {
  goal: string;
  channel: 'EMAIL' | 'SMS' | 'WHATSAPP';
  messageTemplate: string;
}

export const CampaignSummary: React.FC<CampaignSummaryProps> = ({ goal, channel, messageTemplate }) => {
  const getChannelIcon = () => {
    switch (channel) {
      case 'EMAIL':
        return <Mail className="w-4 h-4 text-accent-cyan" />;
      case 'SMS':
        return <MessageSquare className="w-4 h-4 text-accent-amber" />;
      case 'WHATSAPP':
        return <PhoneCall className="w-4 h-4 text-accent-emerald" />;
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center space-x-2 text-primary">
        <Target className="w-4.5 h-4.5" />
        <h4 className="text-sm font-semibold text-text-primary">Campaign Details</h4>
      </div>

      <div className="space-y-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-text-secondary">Campaign Goal</span>
          <p className="text-xs font-semibold text-text-primary mt-0.5 leading-relaxed">{goal}</p>
        </div>

        <div className="flex items-center justify-between border-t border-border/60 pt-3">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-text-secondary">Dispatch Channel</span>
            <div className="flex items-center space-x-1.5">
              {getChannelIcon()}
              <span className="text-xs font-bold text-text-primary">{channel}</span>
            </div>
          </div>
          <div className="text-right space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-text-secondary">Template Integrity</span>
            <p className="text-xs font-semibold text-text-primary">
              {messageTemplate.includes('{name}') ? '✓ Dynamic Tag {name}' : '⚠️ No Name Tag'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CampaignSummary;
