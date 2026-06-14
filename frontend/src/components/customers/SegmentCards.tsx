import React from 'react';
import { Sparkles, Star, Target, RotateCcw } from 'lucide-react';

interface SegmentCardsProps {
  selectedSegment: string;
  onSelectSegment: (segment: string) => void;
}

export const SegmentCards: React.FC<SegmentCardsProps> = ({
  selectedSegment,
  onSelectSegment,
}) => {
  const cards = [
    { name: 'All Customers', key: '', icon: Sparkles, color: 'text-primary bg-primary/10 border-primary/25' },
    { name: 'VIP Segment', key: 'VIP', icon: Star, color: 'text-gold bg-gold/10 border-gold/25' },
    { name: 'Cart Abandoners', key: 'Cart Abandoner', icon: Target, color: 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/25' },
    { name: 'Inactive Users', key: 'Inactive', icon: RotateCcw, color: 'text-accent-rose bg-accent-rose/10 border-accent-rose/25' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        const isSelected = selectedSegment === c.key;

        return (
          <button
            key={idx}
            onClick={() => onSelectSegment(c.key)}
            className={`flex items-center space-x-3 p-3.5 border rounded-xl cursor-pointer text-left transition-all duration-200 hover:shadow-md ${
              isSelected
                ? 'bg-card border-primary ring-1 ring-primary/25 shadow-md'
                : 'bg-card border-border hover:border-border-strong'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${c.color}`}>
              <Icon className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-text-primary">{c.name}</p>
              <p className="text-[9px] text-text-muted mt-0.5">Quick Filter</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
export default SegmentCards;
