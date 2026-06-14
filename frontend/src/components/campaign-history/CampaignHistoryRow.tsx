import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, MessageSquare, PhoneCall, ArrowRight } from 'lucide-react';
import { Campaign } from '../../types/campaign';
import StatusBadge from '../campaign/StatusBadge';
import { formatCurrency, formatPercent } from '../../utils/format';
import { formatDateTime } from '../../utils/date';

interface CampaignHistoryRowProps {
  campaign: Campaign;
}

export const CampaignHistoryRow: React.FC<CampaignHistoryRowProps> = ({ campaign }) => {
  const navigate = useNavigate();

  const getChannelIcon = (channel: string) => {
    switch (channel.toUpperCase()) {
      case 'EMAIL':
        return <Mail className="w-4 h-4 text-accent-cyan" />;
      case 'SMS':
        return <MessageSquare className="w-4 h-4 text-accent-amber" />;
      case 'WHATSAPP':
        return <PhoneCall className="w-4 h-4 text-accent-emerald" />;
      default:
        return null;
    }
  };

  const metrics = campaign.metrics;
  const hasMetrics = !!metrics;

  const getIntelligenceBadge = () => {
    if (!hasMetrics) return <span className="text-text-muted">—</span>;
    const openRate = metrics.readRate;
    const rev = metrics.revenueRecovered;
    
    if (rev > 5000) {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[9px] font-bold border bg-accent-rose/10 text-accent-rose border-accent-rose/25">
          <span>🔥</span>
          <span>High ROI</span>
        </span>
      );
    }
    if (openRate >= 0.5) {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[9px] font-bold border bg-accent-amber/10 text-accent-amber border-accent-amber/25">
          <span>⭐</span>
          <span>Above Expectation</span>
        </span>
      );
    }
    if (campaign.status.toLowerCase() === 'completed' && openRate < 0.25) {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[9px] font-bold border bg-accent-amber/10 text-accent-amber border-accent-amber/25">
          <span>⚠</span>
          <span>Underperforming</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[9px] font-bold border bg-secondary text-text-secondary border-border">
        <span>🟢</span>
        <span>Stable</span>
      </span>
    );
  };

  return (
    <tr
      onClick={() => navigate(`/campaigns/monitor/${campaign.id}`)}
      className="hover:bg-primary/5 transition-colors cursor-pointer group"
    >
      <td className="px-6 py-4">
        <div>
          <p className="font-semibold text-text-primary group-hover:text-primary transition-colors">
            {campaign.name}
          </p>
          <p className="text-[10px] text-text-muted mt-0.5 line-clamp-1 max-w-xs">{campaign.goal}</p>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          {getChannelIcon(campaign.channel)}
          <span className="text-text-secondary uppercase text-[10px] font-semibold">{campaign.channel}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={campaign.status} />
      </td>
      <td className="px-6 py-4 text-right font-semibold text-text-primary">
        {hasMetrics ? metrics.total : '—'}
      </td>
      <td className="px-6 py-4 text-right font-semibold text-text-secondary">
        {hasMetrics ? formatPercent(metrics.deliveryRate) : '—'}
      </td>
      <td className="px-6 py-4 text-right font-semibold text-text-secondary">
        {hasMetrics ? formatPercent(metrics.readRate) : '—'}
      </td>
      <td className="px-6 py-4 text-right font-bold text-accent-emerald">
        {hasMetrics ? formatCurrency(metrics.revenueRecovered) : '—'}
      </td>
      <td className="px-6 py-4">
        {getIntelligenceBadge()}
      </td>
      <td className="px-6 py-4 text-text-muted">
        {formatDateTime(campaign.createdAt)}
      </td>
      <td className="px-6 py-4 text-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/campaigns/monitor/${campaign.id}`);
          }}
          className="inline-flex items-center justify-center p-1.5 rounded-lg border border-border bg-background hover:border-primary/30 hover:bg-primary/5 text-text-secondary hover:text-primary cursor-pointer transition-all"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
};
export default CampaignHistoryRow;
