import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const ChannelChart: React.FC = () => {
  // Mock channel distribution statistics
  const data = [
    { name: 'EMAIL', campaigns: 8, fill: '#06b6d4' },
    { name: 'SMS', campaigns: 15, fill: '#f59e0b' },
    { name: 'WHATSAPP', campaigns: 11, fill: '#10b981' },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-5 h-[260px] flex flex-col">
      <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-4">Volume by Dispatch Channel</h4>
      <div className="flex-1 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
            <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
                fontSize: 11,
                borderRadius: 8,
              }}
            />
            <Bar dataKey="campaigns" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default ChannelChart;
