import React from 'react';
import { Mail, MessageSquare, PhoneCall, CheckCircle } from 'lucide-react';

interface ChannelRecommendationCardProps {
  channel: 'EMAIL' | 'SMS' | 'WHATSAPP';
  score: number;
  reasoning: string;
}

export const ChannelRecommendationCard: React.FC<ChannelRecommendationCardProps> = ({
  channel,
  score,
  reasoning,
}) => {
  const getChannelIcon = () => {
    switch (channel) {
      case 'EMAIL':
        return <Mail className="w-5 h-5 text-accent-cyan" />;
      case 'SMS':
        return <MessageSquare className="w-5 h-5 text-accent-amber" />;
      case 'WHATSAPP':
        return <PhoneCall className="w-5 h-5 text-accent-emerald" />;
    }
  };

  const getStyle = () => {
    switch (channel) {
      case 'EMAIL':
        return 'border-cyan-500/20 bg-cyan-950/10 text-cyan-400';
      case 'SMS':
        return 'border-amber-500/20 bg-amber-950/10 text-amber-400';
      case 'WHATSAPP':
        return 'border-emerald-500/20 bg-emerald-950/10 text-emerald-400';
    }
  };

  return (
    <div className={`border rounded-xl p-4.5 space-y-3 relative overflow-hidden group ${getStyle()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getChannelIcon()}
          <span className="text-xs font-bold uppercase tracking-wider">{channel} Recommended</span>
        </div>
        <div className="flex items-center space-x-1 bg-white/5 px-2 py-0.5 rounded-full border border-white/10 text-[10px] font-semibold text-text-primary">
          <CheckCircle className="w-3 h-3 text-accent-emerald" />
          <span>{(score * 100).toFixed(0)}% Match</span>
        </div>
      </div>
      <p className="text-xs text-text-secondary leading-relaxed">{reasoning}</p>
    </div>
  );
};
export default ChannelRecommendationCard;
