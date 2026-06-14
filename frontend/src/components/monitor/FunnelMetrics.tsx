import React from 'react';
import { Send, CheckCircle2, Eye, AlertCircle } from 'lucide-react';
import { formatPercent } from '../../utils/format';
import FunnelCard from './FunnelCard';

interface FunnelMetricsProps {
  sent: number;
  delivered: number;
  read: number;
  failed: number;
  total: number;
}

export const FunnelMetrics: React.FC<FunnelMetricsProps> = ({
  sent,
  delivered,
  read,
  failed,
  total,
}) => {
  const deliveryRate = sent > 0 ? Math.round((delivered / sent) * 100) : 0;
  const openRate = delivered > 0 ? Math.round((read / delivered) * 100) : 0;
  const failureRate = total > 0 ? Math.round((failed / total) * 100) : 0;

  const cards = [
    {
      label: 'Dispatched Audience',
      value: sent,
      sub: `out of ${total} targeted`,
      icon: Send,
      color: 'text-primary border-primary/20 bg-primary/5',
    },
    {
      label: 'Delivered Devices',
      value: delivered,
      sub: `${formatPercent(deliveryRate)} delivery rate`,
      icon: CheckCircle2,
      color: 'text-accent-cyan border-accent-cyan/20 bg-accent-cyan/5',
    },
    {
      label: 'Customer Engagement',
      value: read,
      sub: `${formatPercent(openRate)} interaction rate`,
      icon: Eye,
      color: 'text-accent-emerald border-accent-emerald/20 bg-accent-emerald/5',
    },
    {
      label: 'Carrier Bounces',
      value: failed,
      sub: `${formatPercent(failureRate)} bounce rate`,
      icon: AlertCircle,
      color: 'text-accent-rose border-accent-rose/20 bg-accent-rose/5',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <FunnelCard
          key={idx}
          label={card.label}
          value={card.value}
          subText={card.sub}
          icon={card.icon}
          colorClass={card.color}
        />
      ))}
    </div>
  );
};
export default FunnelMetrics;
