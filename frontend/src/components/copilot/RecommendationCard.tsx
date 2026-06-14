import React from 'react';
import { Mail, MessageSquare, PhoneCall, TrendingUp, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

interface RecommendationCardProps {
  channel: 'EMAIL' | 'SMS' | 'WHATSAPP';
  estimatedRoi: number;
  reasoning: string[];
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  channel,
  estimatedRoi,
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

  const getChannelStyle = () => {
    switch (channel) {
      case 'EMAIL':
        return 'border-accent-cyan/25 bg-accent-cyan/5 text-accent-cyan';
      case 'SMS':
        return 'border-accent-amber/25 bg-accent-amber/5 text-accent-amber';
      case 'WHATSAPP':
        return 'border-accent-emerald/25 bg-accent-emerald/5 text-accent-emerald';
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4.5 h-4.5 text-primary" />
          <h4 className="text-sm font-semibold text-text-primary">AI Strategy Recommendations</h4>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Recommended Channel */}
        <div className={`border rounded-lg p-3 flex flex-col justify-between ${getChannelStyle()}`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-text-secondary">Optimal Channel</span>
            {getChannelIcon()}
          </div>
          <p className="text-xl font-bold tracking-wide mt-2">{channel}</p>
        </div>

        {/* Estimated ROI */}
        <div className="border border-border bg-background rounded-lg p-3 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-text-secondary">Projected Returns</span>
          <p className="text-xl font-bold text-accent-emerald tracking-wide mt-2">
            {formatCurrency(estimatedRoi)}
          </p>
        </div>
      </div>

      {/* Confidence Reasoning List */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center space-x-1.5 mb-2.5">
          <AlertCircle className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
            Decision Reasoning
          </span>
        </div>
        <ul className="space-y-2">
          {reasoning.map((reason, idx) => (
            <li key={idx} className="flex items-start text-xs text-text-secondary leading-relaxed">
              <span className="text-primary mr-2 font-bold">•</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default RecommendationCard;
