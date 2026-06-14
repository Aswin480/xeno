import React from 'react';
import { Clock, Sun, Moon } from 'lucide-react';

export const BestSendTime: React.FC = () => {
  const times = [
    { hour: 'Morning (8AM-12PM)', rate: 76, active: true, icon: Sun, color: 'text-accent-amber bg-accent-amber/10 border-accent-amber/25' },
    { hour: 'Afternoon (12PM-4PM)', rate: 42, active: false, icon: Sun, color: 'text-text-muted bg-background border-border' },
    { hour: 'Evening (4PM-8PM)', rate: 64, active: false, icon: Sun, color: 'text-primary bg-primary/10 border-primary/25' },
    { hour: 'Night (8PM-12AM)', rate: 18, active: false, icon: Moon, color: 'text-text-muted bg-background border-border' },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center space-x-2">
        <Clock className="w-4.5 h-4.5 text-primary" />
        <h4 className="text-sm font-semibold text-text-primary">Best Send Time Recommendation</h4>
      </div>
      <p className="text-xs text-text-secondary leading-relaxed">
        Based on historic customer open reports, dispatching campaigns during morning hours yields maximum click velocity and minimal inbox competition.
      </p>

      <div className="space-y-3 pt-2">
        {times.map((t, idx) => {
          const Icon = t.icon;
          return (
            <div key={idx} className={`border rounded-lg p-3 flex items-center justify-between ${t.active ? 'border-accent-amber/25 bg-accent-amber/5' : 'bg-background border-border'}`}>
              <div className="flex items-center space-x-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${t.active ? 'bg-accent-amber/15 text-accent-amber' : 'bg-secondary text-text-muted'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-primary">{t.hour}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">{t.active ? 'Best Performing Interval' : 'Standard Interval'}</p>
                </div>
              </div>

              <div className="flex items-baseline space-x-1.5 text-right">
                <span className={`text-sm font-bold ${t.active ? 'text-accent-amber' : 'text-text-secondary'}`}>{t.rate}%</span>
                <span className="text-[9px] text-text-muted">Open Rate</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default BestSendTime;
