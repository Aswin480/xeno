import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { copilotApi } from '../../api/copilot';
import { 
  Brain, 
  Rocket, 
  PauseCircle, 
  RefreshCw, 
  Shuffle, 
  GitCompare, 
  ArrowRight, 
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useCopilot } from '../../hooks/useCopilot';

interface NextActionCardProps {
  campaignId: string;
  status: string;
  pollingActive: boolean;
}

interface NextAction {
  action: 'scale' | 'pause' | 'retry' | 'pivot' | 'ab_test';
  reason: string;
  recommendation: string;
  confidence: 'high' | 'moderate' | 'low';
  details: {
    segmentToScale?: string;
    channelToPivot?: string;
    testVariation?: string;
  };
}

export const NextActionCard: React.FC<NextActionCardProps> = ({ campaignId, status, pollingActive }) => {
  const navigate = useNavigate();
  const { setGoal, resetPlan } = useCopilot();
  const [nextAction, setNextAction] = useState<NextAction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendation = async () => {
    try {
      const data = await copilotApi.getObserveOutcome(campaignId);
      setNextAction(data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load next action recommendation:', err);
      setError('Could not compile next action metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendation();

    if (pollingActive) {
      const interval = setInterval(() => {
        fetchRecommendation();
      }, 3000);
      return () => clearInterval(interval);
    }
    return () => {};
  }, [campaignId, pollingActive]);

  const handleApplyRecommendation = () => {
    if (!nextAction) return;

    let targetPrompt = '';
    
    switch (nextAction.action) {
      case 'scale':
        targetPrompt = `Scale our successful campaigns for ${nextAction.details.segmentToScale || 'dormant'} customers and increase our engagement.`;
        break;
      case 'pivot':
        targetPrompt = `Pivot our inactive campaign from SMS/Email and try ${nextAction.details.channelToPivot || 'WHATSAPP'} for better reach.`;
        break;
      case 'ab_test':
        targetPrompt = `Run an A/B test with message variations to optimize engagement for this campaign.`;
        break;
      case 'retry':
        targetPrompt = `Refine and relaunch the reactivation campaign to improve conversion rates.`;
        break;
      case 'pause':
      default:
        targetPrompt = `Bring back dormant coffee buyers with a fresh message and strong discount offer.`;
        break;
    }

    resetPlan();
    setGoal(targetPrompt);
    navigate('/');
  };

  if (loading && !nextAction) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6 flex flex-col items-center justify-center min-h-[220px]">
        <Loader2 className="w-6 h-6 text-primary animate-spin mb-2" />
        <span className="text-[11px] text-text-muted">Analyzing outcomes...</span>
      </div>
    );
  }

  if (error || !nextAction) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6 text-center">
        <span className="text-xs text-accent-rose">{error || 'No recommendation compiled.'}</span>
      </div>
    );
  }

  // Visual mapping for actions
  const actionConfigs = {
    scale: {
      title: 'Scale Campaign',
      color: 'text-accent-emerald bg-accent-emerald/10 border-accent-emerald/20',
      icon: Rocket,
    },
    ab_test: {
      title: 'Optimize & A/B Test',
      color: 'text-primary bg-primary/10 border-primary/25',
      icon: GitCompare,
    },
    pivot: {
      title: 'Pivot Channel',
      color: 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20',
      icon: Shuffle,
    },
    retry: {
      title: 'Refine & Retry',
      color: 'text-accent-amber bg-accent-amber/10 border-accent-amber/20',
      icon: RefreshCw,
    },
    pause: {
      title: 'Pause Campaign',
      color: 'text-accent-rose bg-accent-rose/10 border-accent-rose/20',
      icon: PauseCircle,
    },
  };

  const config = actionConfigs[nextAction.action] || actionConfigs.ab_test;
  const ActionIcon = config.icon;

  const confidenceColor = 
    nextAction.confidence === 'high' ? 'text-accent-emerald bg-accent-emerald/10' :
    nextAction.confidence === 'moderate' ? 'text-accent-amber bg-accent-amber/10' :
    'text-accent-rose bg-accent-rose/10';

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border bg-background flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-text-primary tracking-wide uppercase">XENO Decision Engine</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="text-[10px] text-text-muted">Evidence:</span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${confidenceColor}`}>
            {nextAction.confidence}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        {/* Recommended Action Badge */}
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold ${config.color}`}>
            <ActionIcon className="w-3.5 h-3.5" />
            <span>{config.title}</span>
          </div>
          <span className="text-[10px] text-text-muted italic flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-accent-cyan animate-pulse" />
            Learning loop active
          </span>
        </div>

        {/* Reason Card */}
        <div className="space-y-1">
          <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Live Signals</span>
          <p className="text-xs text-text-primary font-medium leading-relaxed bg-background border border-border rounded-xl p-3">
            {nextAction.reason}
          </p>
        </div>

        {/* Recommendation Card */}
        <div className="space-y-1">
          <span className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Recommended Strategy</span>
          <p className="text-xs text-text-secondary leading-relaxed bg-background border border-border rounded-xl p-3">
            {nextAction.recommendation}
          </p>
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="px-5 py-3.5 border-t border-border bg-background flex justify-end">
        <button
          onClick={handleApplyRecommendation}
          className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-[11px] font-bold rounded-lg transition-all duration-150 active:translate-y-px cursor-pointer"
        >
          <span>Apply in Copilot</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default NextActionCard;
