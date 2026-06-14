import React from 'react';
import { ArrowDown } from 'lucide-react';

export interface FunnelStage {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

interface CallbackFunnelProps {
  stages: FunnelStage[];
  title?: string;
  description?: string;
}

/**
 * Callback Funnel: Visualizes campaign lifecycle events
 * Shows: Sent → Delivered → Opened → Clicked → Converted
 * 
 * This is THE key SDE feature: event-driven funnel, not status dashboard
 */
export const CallbackFunnel: React.FC<CallbackFunnelProps> = ({
  stages,
  title = 'Campaign Funnel',
  description,
}) => {
  const maxCount = Math.max(...stages.map((s) => s.count), 1);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-base font-bold text-text-primary">{title}</h3>
        {description && (
          <p className="text-xs text-text-secondary mt-1">{description}</p>
        )}
      </div>

      {/* Funnel visualization */}
      <div className="space-y-3">
        {stages.map((stage, idx) => {
          const width = (stage.count / maxCount) * 100;

          return (
            <div key={stage.name}>
              {/* Stage bar */}
              <div className="space-y-1.5">
                {/* Label + stats */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-text-primary">{stage.name}</span>
                    <span className="text-text-secondary">({stage.count.toLocaleString()})</span>
                  </div>
                  <span className="font-semibold text-primary">{stage.percentage.toFixed(1)}%</span>
                </div>

                {/* Bar */}
                <div className="bg-background rounded-full h-8 overflow-hidden border border-border">
                  <div
                    className={`h-full ${stage.color} transition-all duration-500 flex items-center justify-end pr-3`}
                    style={{ width: `${Math.max(width, 5)}%` }}
                  >
                    {width > 15 && (
                      <span className="text-xs font-bold text-white mix-blend-lighten">
                        {stage.percentage.toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Connector arrow */}
              {idx < stages.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="w-4 h-4 text-text-muted" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
        <div className="space-y-1">
          <div className="text-xs text-text-secondary">Total Reach</div>
          <div className="text-lg font-bold text-text-primary">
            {stages[0]?.count.toLocaleString() || 0}
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-text-secondary">Final Conversion</div>
          <div className="text-lg font-bold text-accent-emerald">
            {stages[stages.length - 1]?.count.toLocaleString() || 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallbackFunnel;
