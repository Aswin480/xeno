import React from 'react';
import { Users, Send, MessageSquare, TrendingUp, AlertCircle } from 'lucide-react';

export interface DecisionCardProps {
  type: 'audience' | 'channel' | 'message' | 'strength';
  title: string;
  value?: string | number;
  reason?: string[];
  icon?: React.ReactNode;
  strength?: 'strong' | 'moderate' | 'limited';
}

/**
 * Decision Card: Clean, explainable format for campaign recommendations
 * Shows WHAT the recommendation is and WHY it's recommended
 */
export const DecisionCard: React.FC<DecisionCardProps> = ({
  type,
  title,
  value,
  reason = [],
  icon,
  strength,
}) => {
  const icons: Record<string, React.ReactNode> = {
    audience: <Users className="w-5 h-5" />,
    channel: <Send className="w-5 h-5" />,
    message: <MessageSquare className="w-5 h-5" />,
    strength: <TrendingUp className="w-5 h-5" />,
  };

  const strengthColors: Record<string, string> = {
    strong: 'bg-accent-emerald/10 border-accent-emerald/25 text-accent-emerald',
    moderate: 'bg-accent-amber/10 border-accent-amber/25 text-accent-amber',
    limited: 'bg-secondary border-border text-text-secondary',
  };

  const strengthLabel: Record<string, string> = {
    strong: '✓ Strong Recommendation',
    moderate: '◐ Moderate Confidence',
    limited: '⊘ Limited Data',
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:border-border-strong transition-all space-y-3">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="text-primary">{icon || icons[type]}</div>
        <h3 className="font-semibold text-text-primary text-base">{title}</h3>
      </div>

      {/* Value display */}
      {value && (
        <div className="text-2xl font-bold text-primary">
          {value}
        </div>
      )}

      {/* Reasoning */}
      {reason.length > 0 && (
        <div className="space-y-1.5 text-xs text-text-secondary">
          <div className="font-semibold text-text-primary">Why?</div>
          {reason.map((r, i) => (
            <div key={i} className="flex items-start space-x-2">
              <span className="text-primary flex-shrink-0 mt-0.5">•</span>
              <span>{r}</span>
            </div>
          ))}
        </div>
      )}

      {/* Strength indicator */}
      {strength && (
        <div className={`text-xs font-semibold px-3 py-2 rounded-lg border ${strengthColors[strength]} flex items-center space-x-1.5`}>
          <span>{strengthLabel[strength]}</span>
        </div>
      )}
    </div>
  );
};

/**
 * Decision Cards Grid: Layout multiple recommendations
 */
export interface DecisionCardsGridProps {
  cards: DecisionCardProps[];
}

export const DecisionCardsGrid: React.FC<DecisionCardsGridProps> = ({ cards }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {cards.map((card, i) => (
        <DecisionCard key={i} {...card} />
      ))}
    </div>
  );
};

export default DecisionCard;
