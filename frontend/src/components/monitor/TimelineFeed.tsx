import React from 'react';
import { Activity } from 'lucide-react';
import ActivityItem, { ActivityLog } from './ActivityItem';

interface TimelineFeedProps {
  activities: ActivityLog[];
}

export const TimelineFeed: React.FC<TimelineFeedProps> = ({ activities }) => {
  if (activities.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 text-center">
        <Activity className="w-6 h-6 text-text-muted mx-auto mb-2 animate-pulse" />
        <p className="text-xs text-text-secondary">Awaiting dispatch events...</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center space-x-2">
          <Activity className="w-4.5 h-4.5 text-primary" />
          <h4 className="text-sm font-semibold text-text-primary">Live Monitoring</h4>
        </div>
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-accent-emerald animate-ping"></span>
          <span className="text-[9px] uppercase font-bold text-accent-emerald">Streaming</span>
        </span>
      </div>

      <div className="max-h-[300px] overflow-y-auto space-y-1 pr-2">
        {activities.map((act) => (
          <ActivityItem key={act.id} activity={act} />
        ))}
      </div>
    </div>
  );
};
export default TimelineFeed;
