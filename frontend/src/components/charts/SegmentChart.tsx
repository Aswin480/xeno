import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const SegmentChart: React.FC = () => {
  // Mock customer segments distributions
  const data = [
    { name: 'VIP Customer List', value: 350, fill: '#f59e0b' },
    { name: 'Cart Abandoners', value: 180, fill: '#06b6d4' },
    { name: 'Inactive Users', value: 240, fill: '#f43f5e' },
    { name: 'Unsegmented Users', value: 430, fill: '#6366f1' },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-5 h-[260px] flex flex-col">
      <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-4">Customer Segments Distribution</h4>
      <div className="flex-1 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
                fontSize: 11,
                borderRadius: 8,
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 10, color: 'var(--text-muted)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default SegmentChart;
