import React from 'react';
import { Activity, Loader2, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';

interface LiveCounterProps {
  total: number;
  completed: number;
  openRate?: number; // optional readRate to compute dynamic signals
}

export const LiveCounter: React.FC<LiveCounterProps> = ({ total, completed, openRate = 0.90 }) => {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isFinished = percent === 100 && total > 0;

  // Compute status metrics
  const displayOpenRate = Math.round(openRate * 100);

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
        <div className="flex items-center space-x-2">
          <Activity className="w-4.5 h-4.5 text-primary" />
          <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Campaign Status</h4>
        </div>
        {!isFinished ? (
          <div className="flex items-center space-x-1 text-accent-amber bg-accent-amber/10 px-2 py-0.5 border border-accent-amber/25 rounded text-[9px] font-bold">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>DISPATCHING</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1 text-accent-emerald bg-accent-emerald/10 px-2 py-0.5 border border-accent-emerald/25 rounded text-[9px] font-bold">
            <CheckCircle className="w-3 h-3 text-accent-emerald" />
            <span>COMPLETED</span>
          </div>
        )}
      </div>

      {/* Decision Cockpit State details */}
      <div className="space-y-3 pt-1">
        {isFinished ? (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-accent-emerald" />
              <span className="text-xs font-bold text-accent-emerald">🟢 Momentum Increasing</span>
            </div>
            <ul className="space-y-1.5 text-xs text-text-secondary pl-1">
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                <span><strong className="text-text-primary">{displayOpenRate}%</strong> Interaction Rate achieved.</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                <span>High conversion velocity detected in session logs.</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                <span>Zero gateway packet delivery bounces.</span>
              </li>
            </ul>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 text-accent-amber animate-spin" />
              <span className="text-xs font-bold text-accent-amber">⚡ Dispatching Active Queue</span>
            </div>
            <ul className="space-y-1.5 text-xs text-text-secondary pl-1">
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                <span>Pipelining target segment records in real time.</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-text-muted"></span>
                <span>Awaiting callback logs from active SMS/WhatsApp simulators.</span>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Progress metrics and indicator bar */}
      <div className="space-y-2 pt-2 border-t border-border">
        <div className="flex items-baseline justify-between text-[11px]">
          <span className="text-text-muted font-bold uppercase tracking-wide">Audience Delivery Logged</span>
          <span className="text-text-primary font-mono font-bold">{completed} / {total} ({percent}%)</span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-2 bg-background rounded-full overflow-hidden border border-border">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LiveCounter;
