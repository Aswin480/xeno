import React from 'react';
import { Target, Star, Gift, RotateCcw } from 'lucide-react';

interface GoalChipsProps {
  onSelect: (goal: string) => void;
  disabled: boolean;
}

export const GoalChips: React.FC<GoalChipsProps> = ({ onSelect, disabled }) => {
  const presets = [
    {
      label: 'Recover Abandoned Carts',
      text: 'Recover abandoned carts for customers with pending orders in the last 3 days using SMS urgency copy.',
      icon: Target,
      color: 'hover:border-accent-cyan/30 hover:bg-accent-cyan/5 text-accent-cyan',
    },
    {
      label: 'VIP Loyalty Reward',
      text: 'Reward VIP customers with early access to our anniversary sale via WhatsApp and high estimation of ROI.',
      icon: Star,
      color: 'hover:border-gold/30 hover:bg-gold/5 text-gold',
    },
    {
      label: 'Welcome New Users',
      text: 'Send a welcoming onboarding email to new customers offering a 15% discount code for their first purchase.',
      icon: Gift,
      color: 'hover:border-accent-emerald/30 hover:bg-accent-emerald/5 text-accent-emerald',
    },
    {
      label: 'Inactive Customer Winback',
      text: 'Re-engage inactive customers who have not placed orders in the last 60 days with a winback discount campaign.',
      icon: RotateCcw,
      color: 'hover:border-primary/30 hover:bg-primary/5 text-primary',
    },
  ];

  return (
    <div className="flex flex-col space-y-2 mt-4">
      <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Suggested Goals</span>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {presets.map((preset, index) => {
          const Icon = preset.icon;
          return (
            <button
              key={index}
              disabled={disabled}
              onClick={() => onSelect(preset.text)}
              className={`flex items-start text-left p-3 rounded-lg border border-border bg-card cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:shadow-sm ${preset.color}`}
            >
              <Icon className="w-4 h-4 mr-2.5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-text-primary">{preset.label}</p>
                <p className="text-[10px] text-text-secondary line-clamp-1 mt-0.5">{preset.text}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default GoalChips;
