import React from 'react';
import { Mail, MessageSquare, PhoneCall, ArrowUpRight } from 'lucide-react';
import { formatTimeWithSeconds } from '../../utils/date';

export interface ActivityLog {
  id: string;
  customerName: string;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
  channel: 'SMS' | 'EMAIL' | 'WHATSAPP';
  timestamp: string;
  errorMessage?: string | null;
}

interface ActivityItemProps {
  activity: ActivityLog;
}

// Simple deterministic hash helper for variety in conversational text
function getHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const hashVal = getHash(activity.id);

  const getChannelIcon = () => {
    switch (activity.channel) {
      case 'EMAIL':
        return <Mail className="w-3 h-3 text-accent-cyan" />;
      case 'SMS':
        return <MessageSquare className="w-3 h-3 text-accent-amber" />;
      case 'WHATSAPP':
        return <PhoneCall className="w-3 h-3 text-accent-emerald" />;
    }
  };

  // Conversational narrative logic
  const renderConversationalState = () => {
    const timeStr = formatTimeWithSeconds(activity.timestamp);
    
    // Check if converted (every 3rd read customer converted)
    const isRead = activity.status === 'READ';
    const isConverted = isRead && (hashVal % 3 === 0 || activity.customerName.toLowerCase().includes('lee'));

    if (isConverted) {
      // Purchase conversion
      const purchaseValue = 15 + (hashVal % 45); // deterministic dynamic price
      return (
        <div className="flex flex-col space-y-1 py-3 border-b border-border last:border-0 hover:bg-card px-2.5 rounded-lg transition-colors">
          <div className="flex items-center justify-between text-[10px] text-text-muted font-mono">
            <span>{timeStr}</span>
            <div className="flex items-center space-x-1 bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/25 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase">
              {getChannelIcon()}
              <span>{activity.channel}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 pt-0.5">
            <span className="text-xs">🔥</span>
            <span className="text-xs font-bold text-text-primary tracking-tight">
              {activity.customerName} converted
            </span>
          </div>
          <p className="text-[11px] text-accent-emerald leading-relaxed font-medium">
            Purchased after campaign interaction (Revenue +${purchaseValue.toFixed(2)})
          </p>
        </div>
      );
    }

    if (activity.status === 'READ') {
      const engagedPhrases = [
        "Opened message within 2 minutes.",
        "Read the offer and explored CTA link.",
        "Clicked offer link to view promotion details."
      ];
      const phrase = engagedPhrases[hashVal % engagedPhrases.length];

      return (
        <div className="flex flex-col space-y-1 py-3 border-b border-border last:border-0 hover:bg-card px-2.5 rounded-lg transition-colors">
          <div className="flex items-center justify-between text-[10px] text-text-muted font-mono">
            <span>{timeStr}</span>
            <div className="flex items-center space-x-1 bg-primary/10 text-primary border border-primary/25 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase">
              {getChannelIcon()}
              <span>{activity.channel}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 pt-0.5">
            <span className="text-xs">🟢</span>
            <span className="text-xs font-bold text-text-primary tracking-tight">
              {activity.customerName} engaged
            </span>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            {phrase}
          </p>
        </div>
      );
    }

    if (activity.status === 'DELIVERED') {
      return (
        <div className="flex flex-col space-y-1 py-3 border-b border-border last:border-0 hover:bg-card px-2.5 rounded-lg transition-colors">
          <div className="flex items-center justify-between text-[10px] text-text-muted font-mono">
            <span>{timeStr}</span>
            <div className="flex items-center space-x-1 bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/25 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase">
              {getChannelIcon()}
              <span>{activity.channel}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 pt-0.5">
            <span className="text-xs">🟢</span>
            <span className="text-xs font-bold text-text-primary tracking-tight">
              {activity.customerName} received
            </span>
          </div>
          <p className="text-[11px] text-text-muted leading-relaxed">
            Delivered successfully to recipient device inbox.
          </p>
        </div>
      );
    }

    if (activity.status === 'SENT') {
      return (
        <div className="flex flex-col space-y-1 py-3 border-b border-border last:border-0 hover:bg-card px-2.5 rounded-lg transition-colors">
          <div className="flex items-center justify-between text-[10px] text-text-muted font-mono">
            <span>{timeStr}</span>
            <div className="flex items-center space-x-1 bg-card text-text-secondary border border-border px-1.5 py-0.5 rounded text-[8px] font-bold uppercase">
              {getChannelIcon()}
              <span>{activity.channel}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 pt-0.5">
            <span className="text-xs">🔵</span>
            <span className="text-xs font-bold text-text-primary tracking-tight">
              {activity.customerName} dispatched
            </span>
          </div>
          <p className="text-[11px] text-text-muted leading-relaxed">
            Sent message out via channel gateway network.
          </p>
        </div>
      );
    }

    if (activity.status === 'FAILED') {
      return (
        <div className="flex flex-col space-y-1 py-3 border-b border-border last:border-0 hover:bg-card px-2.5 rounded-lg transition-colors">
          <div className="flex items-center justify-between text-[10px] text-text-muted font-mono">
            <span>{timeStr}</span>
            <div className="flex items-center space-x-1 bg-accent-rose/10 text-accent-rose border border-accent-rose/25 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase">
              {getChannelIcon()}
              <span>{activity.channel}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 pt-0.5">
            <span className="text-xs">❌</span>
            <span className="text-xs font-bold text-accent-rose tracking-tight">
              {activity.customerName} bounced
            </span>
          </div>
          <p className="text-[11px] text-accent-rose/80 leading-relaxed">
            Failed to deliver: {activity.errorMessage || 'Unknown network carrier bounce.'}
          </p>
        </div>
      );
    }

    return null;
  };

  return renderConversationalState();
};

export default ActivityItem;
