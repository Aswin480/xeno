import React from 'react';
import { LucideIcon } from 'lucide-react';
import AnimatedCounter from '../ui/AnimatedCounter';

interface FunnelCardProps {
  label: string;
  value: number;
  subText: string;
  icon: LucideIcon;
  colorClass: string;
}

export const FunnelCard: React.FC<FunnelCardProps> = ({
  label,
  value,
  subText,
  icon: Icon,
  colorClass,
}) => {
  return (
    <div className={`border rounded-xl p-4 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] ${colorClass}`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">{label}</span>
        <Icon className="w-4.5 h-4.5 opacity-80" />
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold tracking-tight text-text-primary">
          <AnimatedCounter value={value} />
        </p>
        <p className="text-[10px] text-text-muted mt-0.5">{subText}</p>
      </div>
    </div>
  );
};
export default FunnelCard;
