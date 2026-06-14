import React from 'react';
import { Mail, MessageSquare, PhoneCall, AlertTriangle, ArrowRight } from 'lucide-react';
import { Insight } from '../../types/insight';

interface InsightCardProps {
  insight: Insight;
  onActionClick?: (recommendation: string) => void;
  className?: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight, onActionClick, className }) => {
  const getChannelIcon = () => {
    switch (insight.channel) {
      case 'EMAIL':
        return <Mail className="w-4 h-4 text-accent-cyan" />;
      case 'SMS':
        return <MessageSquare className="w-4 h-4 text-accent-amber" />;
      case 'WHATSAPP':
        return <PhoneCall className="w-4 h-4 text-accent-emerald" />;
    }
  };

  const getImpactStyle = () => {
    switch (insight.impact.toUpperCase()) {
      case 'CRITICAL':
        return 'border-accent-rose/25 bg-accent-rose/5 text-accent-rose';
      case 'HIGH':
        return 'border-accent-amber/25 bg-accent-amber/5 text-accent-amber';
      case 'MEDIUM':
        return 'border-primary/25 bg-primary/5 text-primary';
      default:
        return 'border-border bg-card text-text-secondary';
    }
  };

  const getImpactBadge = () => {
    switch (insight.impact.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-accent-rose/10 text-accent-rose border-accent-rose/25';
      case 'HIGH':
        return 'bg-accent-amber/10 text-accent-amber border-accent-amber/25';
      case 'MEDIUM':
        return 'bg-primary/10 text-primary border-primary/25';
      default:
        return 'bg-background text-text-secondary border-border';
    }
  };

  return (
    <div className={`border rounded-xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] ${getImpactStyle()} ${className || ''}`}>
      <div className="space-y-4 flex-grow flex flex-col justify-start mb-4">
        {/* Card Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {getChannelIcon()}
            <span className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">
              {insight.channel} Campaign Insight
            </span>
          </div>
          <span className={`text-[9px] uppercase font-bold border px-2 py-0.5 rounded-full ${getImpactBadge()}`}>
            {insight.impact} Impact
          </span>
        </div>

        {/* Narrative */}
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-text-primary">{insight.title}</h4>
          <p className="text-xs text-text-secondary leading-relaxed">{insight.description}</p>
        </div>

        {/* Suggested Strategy */}
        <div className="bg-background border border-border p-3.5 rounded-lg space-y-2 mt-auto">
          <div className="flex items-center space-x-1.5 text-text-primary text-[10px] uppercase font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-accent-amber" />
            <span>Recommended AI Action</span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">{insight.recommendedAction}</p>
        </div>
      </div>

      {/* Resolve CTA */}
      {onActionClick && (
        <button
          onClick={() => onActionClick(insight.recommendedAction)}
          className="w-full flex items-center justify-center space-x-1.5 py-2.5 bg-background border border-border hover:border-primary/40 hover:bg-primary/5 text-primary text-xs font-bold rounded-lg cursor-pointer transition-all duration-150 mt-auto"
        >
          <span>Load Follow-up Copilot Strategy</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default InsightCard;
