import React from 'react';
import { ArrowUpRight, ArrowDownRight, Zap, TestTube, RotateCcw, AlertCircle, Target } from 'lucide-react';

export type ActionType = 'scale' | 'optimize' | 'pivot' | 'retry' | 'pause';

export interface NextActionRecommendationProps {
  action: ActionType;
  reason: string;
  recommendation: string;
  confidence: 'high' | 'moderate' | 'low';
  details?: {
    segmentToScale?: string;
    channelToPivot?: string;
    testVariation?: string;
  };
  campaignName?: string;
}

/**
 * Next Action: Closes the learning loop
 * Shows: WHAT happened (outcome) → WHY it matters → WHAT TO DO NEXT
 * 
 * This demonstrates the closed-loop decision engine
 */
export const NextActionRecommendation: React.FC<NextActionRecommendationProps> = ({
  action,
  reason,
  recommendation,
  confidence,
  details,
  campaignName,
}) => {
  const actionConfig: Record<ActionType, { icon: React.ReactNode; color: string; label: string }> = {
    scale: {
      icon: <ArrowUpRight className="w-6 h-6" />,
      color: 'bg-accent-emerald/10 border-accent-emerald/25 text-accent-emerald',
      label: 'SCALE THIS CAMPAIGN',
    },
    optimize: {
      icon: <TestTube className="w-6 h-6" />,
      color: 'bg-accent-cyan/10 border-accent-cyan/25 text-accent-cyan',
      label: 'TEST & OPTIMIZE',
    },
    pivot: {
      icon: <RotateCcw className="w-6 h-6" />,
      color: 'bg-accent-amber/10 border-accent-amber/25 text-accent-amber',
      label: 'PIVOT TO NEW CHANNEL',
    },
    retry: {
      icon: <Zap className="w-6 h-6" />,
      color: 'bg-primary/10 border-primary/25 text-primary',
      label: 'RETRY WITH REFINEMENT',
    },
    pause: {
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'bg-accent-rose/10 border-accent-rose/25 text-accent-rose',
      label: 'PAUSE & REPLAN',
    },
  };

  const confidenceColors: Record<string, string> = {
    high: 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/25',
    moderate: 'bg-accent-amber/10 text-accent-amber border-accent-amber/25',
    low: 'bg-secondary text-text-secondary border-border',
  };

  const config = actionConfig[action];

  return (
    <div className={`${config.color} border rounded-xl p-6 space-y-4 transition-all`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            {config.icon}
            <h3 className="text-lg font-bold">{config.label}</h3>
          </div>
          {campaignName && (
            <p className="text-xs opacity-75">{campaignName}</p>
          )}
        </div>
        <div className={`text-xs font-semibold px-3 py-1 rounded-full border ${confidenceColors[confidence]}`}>
          {confidence.toUpperCase()} CONFIDENCE
        </div>
      </div>

      {/* Reason (What happened) */}
      <div className="bg-black/30 rounded-lg p-3">
        <div className="text-xs font-semibold opacity-75 mb-1">OUTCOME</div>
        <p className="text-sm leading-relaxed">{reason}</p>
      </div>

      {/* Recommendation (What to do) */}
      <div className="bg-black/30 rounded-lg p-3">
        <div className="text-xs font-semibold opacity-75 mb-1">NEXT STEP</div>
        <p className="text-sm leading-relaxed">{recommendation}</p>
      </div>

      {/* Details if available */}
      {details && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2">
          {details.segmentToScale && (
            <div className="text-xs bg-black/40 rounded px-2 py-1.5">
              <span className="opacity-60">Segment to expand:</span>
              <br />
              <span className="font-semibold">{details.segmentToScale}</span>
            </div>
          )}
          {details.channelToPivot && (
            <div className="text-xs bg-black/40 rounded px-2 py-1.5">
              <span className="opacity-60">Try channel:</span>
              <br />
              <span className="font-semibold">{details.channelToPivot}</span>
            </div>
          )}
          {details.testVariation && (
            <div className="text-xs bg-black/40 rounded px-2 py-1.5">
              <span className="opacity-60">Test:</span>
              <br />
              <span className="font-semibold capitalize">{details.testVariation}</span>
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      <div className="pt-2 border-t border-border">
        <button className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2 rounded-lg transition-all flex items-center justify-center space-x-2">
          <Target className="w-4 h-4" />
          <span>Create {action === 'scale' ? 'Scaled' : 'New'} Campaign</span>
        </button>
      </div>
    </div>
  );
};

export default NextActionRecommendation;
