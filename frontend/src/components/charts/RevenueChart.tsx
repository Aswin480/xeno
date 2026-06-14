import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Campaign } from '../../types/campaign';
import { formatCurrency } from '../../utils/format';

interface RevenueChartProps {
  campaigns: Campaign[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ campaigns }) => {
  // Extract data from completed campaigns that have metrics
  const completedCampaigns = campaigns
    .filter((c) => c.status === 'COMPLETED' && c.metrics)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const data = completedCampaigns.map((c) => ({
    name: c.name.length > 12 ? `${c.name.substring(0, 12)}...` : c.name,
    revenue: c.metrics?.revenueRecovered || 0,
  }));

  // Fallback data if none exist
  const displayData =
    data.length > 0
      ? data
      : [
          { name: 'Campaign Alpha', revenue: 1200 },
          { name: 'Campaign Beta', revenue: 4500 },
          { name: 'Campaign Gamma', revenue: 3100 },
          { name: 'Campaign Delta', revenue: 8900 },
        ];

  return (
    <div className="bg-card border border-border rounded-xl p-5 h-full flex flex-col">
      <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-4">Attributed Campaign Revenue</h4>
      <div className="flex-1 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={9} tickLine={false} />
            <YAxis stroke="var(--text-muted)" fontSize={9} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              formatter={(value: any) => [formatCurrency(Number(value)), 'Revenue']}
              contentStyle={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
                fontSize: 11,
                borderRadius: 8,
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default RevenueChart;
