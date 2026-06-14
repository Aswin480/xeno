import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInsights } from '../hooks/useInsights';
import { useCampaign } from '../hooks/useCampaign';
import { useCopilot } from '../hooks/useCopilot';
import { api, simulatorApi } from '../api/axios';
import XenoIntelligenceHub from '../components/insights/XenoIntelligenceHub';
import ChannelPerformance from '../components/insights/ChannelPerformance';
import RevenueChart from '../components/charts/RevenueChart';
import { TrendingUp, Loader2, Sparkles, ArrowRight, Activity, AlertTriangle, ShieldCheck, Heart, Clock } from 'lucide-react';

// Sub-component: Unified AI Recommendations (Sticky Sidebar)
interface AIRecommendationsProps {
  insights: any[];
  onActionClick: (recommendation: string) => void;
}

export const AIRecommendationsCard: React.FC<AIRecommendationsProps> = ({ insights, onActionClick }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-5 h-full flex flex-col justify-between shadow-md">
      <div className="flex items-center space-x-2 border-b border-border/60 pb-3">
        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
        <h4 className="text-sm font-semibold text-text-primary">AI Recommendations</h4>
      </div>

      {/* 1. Best Next Action */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">⚡ Best Next Actions</span>
        <div className="space-y-3">
          {insights.length === 0 ? (
            <p className="text-xs text-text-muted italic">No active actions. Launch a campaign to fetch analytics.</p>
          ) : (
            insights.slice(0, 2).map((ins, idx) => (
              <div key={ins.id || idx} className="p-3 bg-background border border-border hover:border-primary/30 rounded-lg space-y-2 group transition-all">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-primary">Action 0{idx + 1}</span>
                  <span className="font-bold text-accent-emerald">{ins.metric}</span>
                </div>
                <p className="text-xs font-semibold text-text-primary group-hover:text-primary transition-colors">
                  {ins.title}
                </p>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  {ins.recommendedAction}
                </p>
                <button
                  onClick={() => onActionClick(ins.recommendedAction)}
                  className="flex items-center space-x-1 text-[10px] font-bold text-accent-cyan hover:text-cyan-300 transition-colors pt-1 cursor-pointer"
                >
                  <span>Execute Strategy</span>
                  <ArrowRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. Xeno Timing Intelligence */}
      <div className="space-y-3 pt-3 border-t border-border/60">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">🕒 Xeno Timing Intelligence</span>
        <p className="text-[10px] font-medium text-text-secondary">Recommended Send Window</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-accent-amber/5 border border-accent-amber/25 p-2.5 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-xs">🥇</span>
              <div>
                <p className="text-xs font-semibold text-accent-amber">Morning (9–11 AM)</p>
                <p className="text-[9px] text-text-muted">Primary Active Window</p>
              </div>
            </div>
            <span className="text-xs font-bold text-accent-amber">78%</span>
          </div>

          <div className="flex items-center justify-between bg-background border border-border p-2.5 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-xs">🥈</span>
              <div>
                <p className="text-xs font-semibold text-text-primary">Evening (7–9 PM)</p>
                <p className="text-[9px] text-text-muted">Secondary Active Window</p>
              </div>
            </div>
            <span className="text-xs font-bold text-text-secondary">64%</span>
          </div>

          <div className="flex items-center justify-between bg-background border border-border p-2.5 rounded-lg opacity-80">
            <div className="flex items-center space-x-2">
              <span className="text-xs">🥉</span>
              <div>
                <p className="text-xs font-semibold text-text-primary">Afternoon (2–4 PM)</p>
                <p className="text-[9px] text-text-muted">Standard Active Window</p>
              </div>
            </div>
            <span className="text-xs font-bold text-text-secondary">42%</span>
          </div>
        </div>
        <div className="p-2.5 bg-background border border-border rounded-lg text-[10px] text-text-secondary leading-relaxed">
          <strong className="text-text-primary font-semibold block mb-0.5">Reason:</strong>
          This audience historically engages most during early business hours.
        </div>
      </div>

      {/* 3. Channel Suggestions */}
      <div className="space-y-2.5 pt-3 border-t border-border/60">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">📢 Suggested Channel Hierarchy</span>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-background border border-border p-2 rounded-lg text-center">
            <span className="text-[9px] text-text-muted font-semibold block uppercase">1st</span>
            <span className="text-xs font-bold text-primary">WhatsApp</span>
          </div>
          <div className="bg-background border border-border p-2 rounded-lg text-center">
            <span className="text-[9px] text-text-muted font-semibold block uppercase">2nd</span>
            <span className="text-xs font-bold text-accent-cyan">Email</span>
          </div>
          <div className="bg-background border border-border p-2 rounded-lg text-center">
            <span className="text-[9px] text-text-muted font-semibold block uppercase">3rd</span>
            <span className="text-xs font-bold text-text-secondary">SMS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component: Recent AI Decisions (Live Activity Feed)
interface RecentDecisionsProps {
  insights: any[];
  campaigns: any[];
  loading: boolean;
}

export const RecentDecisionsFeed: React.FC<RecentDecisionsProps> = ({ insights, campaigns, loading }) => {
  const decisions: any[] = [];

  if (insights.length > 0) {
    insights.forEach(ins => {
      decisions.push({
        id: ins.id,
        title: ins.title,
        description: ins.description,
        type: ins.impact === 'CRITICAL' ? 'critical' : ins.impact === 'HIGH' ? 'warning' : 'info',
        metric: ins.metric,
        time: 'Just now'
      });
    });
  }

  campaigns.slice(0, 2).forEach((c, idx) => {
    decisions.push({
      id: `camp-${c.id}`,
      title: `Campaign "${c.name}" Optimized`,
      description: `Targeting segment using ${c.channel}. Current status is ${c.status.toLowerCase()}.`,
      type: 'success',
      metric: c.metrics ? `${c.metrics.deliveryRate}% Del` : 'Ready',
      time: idx === 0 ? '10m ago' : '1h ago'
    });
  });

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-accent-cyan" />
          <h4 className="text-sm font-semibold text-text-primary">Recent AI Decisions</h4>
        </div>
        <span className="text-[10px] text-accent-emerald bg-accent-emerald/10 border border-accent-emerald/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse">Live Activity Feed</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-6 space-x-2">
          <Loader2 className="w-4 h-4 text-accent-cyan animate-spin" />
          <span className="text-xs text-text-secondary">Updating feed...</span>
        </div>
      ) : decisions.length === 0 ? (
        <p className="text-xs text-text-muted italic text-center py-4">No recent decisions. Launch campaigns to populate feed.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {decisions.map((dec, idx) => (
            <div key={dec.id || idx} className="bg-background border border-border hover:border-primary/20 p-3.5 rounded-lg flex flex-col justify-between space-y-2.5 group transition-all">
              <div className="flex items-center justify-between text-[9px] uppercase font-semibold">
                <span className={`px-2 py-0.5 rounded-full border ${
                  dec.type === 'critical' ? 'bg-accent-rose/10 text-accent-rose border-accent-rose/25' :
                  dec.type === 'warning' ? 'bg-accent-amber/10 text-accent-amber border-accent-amber/25' :
                  dec.type === 'success' ? 'bg-accent-emerald/10 text-accent-emerald border-accent-emerald/25' :
                  'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/25'
                }`}>
                  {dec.type}
                </span>
                <span className="text-text-muted">{dec.time}</span>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-text-primary group-hover:text-primary transition-colors">
                  {dec.title}
                </p>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  {dec.description}
                </p>
              </div>
              <div className="pt-2 flex items-center justify-between border-t border-border/30 mt-auto text-[10px]">
                <span className="text-text-muted">Impact:</span>
                <span className="font-bold text-text-primary">{dec.metric}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Sub-component: Detailed System Metrics
interface DetailedMetricsProps {
  campaigns: any[];
}

export const DetailedMetricsCard: React.FC<DetailedMetricsProps> = ({ campaigns }) => {
  let totalSent = 0;
  let totalDelivered = 0;
  let totalRead = 0;
  let totalClicked = 0;
  let totalRevenue = 0;

  campaigns.forEach(c => {
    if (c.metrics) {
      totalSent += c.metrics.sent || 0;
      totalDelivered += c.metrics.delivered || 0;
      totalRead += c.metrics.read || 0;
      totalClicked += c.metrics.clicked || 0;
      totalRevenue += c.metrics.revenueRecovered || 0;
    }
  });

  const openRate = totalSent > 0 ? (totalRead / totalSent) * 100 : 64.2;
  const clickRate = totalSent > 0 ? (totalClicked / totalSent) * 100 : 28.5;
  const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 92.1;

  const metricsList = [
    { name: 'Average Open Rate', value: `${openRate.toFixed(1)}%`, desc: 'Ratios of read messages to total sent' },
    { name: 'Click-Through Rate (CTR)', value: `${clickRate.toFixed(1)}%`, desc: 'Ratio of links clicked to total sent' },
    { name: 'Average Delivery Rate', value: `${deliveryRate.toFixed(1)}%`, desc: 'Delivery report completion stats' },
    { name: 'Total Campaign Revenue', value: `$${totalRevenue.toLocaleString()}`, desc: 'Aggregated conversions across all channels' },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-5 h-full flex flex-col justify-between shadow-sm">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-accent-cyan" />
          <h4 className="text-sm font-semibold text-text-primary">System Metrics</h4>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          Aggregated performance ratios compiled across all active user cohorts.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 flex-grow mt-3">
        {metricsList.map((m, idx) => (
          <div key={idx} className="bg-background border border-border p-2.5 rounded-xl flex flex-col justify-center space-y-0.5">
            <span className="text-[9px] text-text-muted font-medium block uppercase tracking-wider">{m.name}</span>
            <span className="text-base font-bold text-text-primary">{m.value}</span>
            <span className="text-[8px] text-text-muted leading-tight block">{m.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const InsightsPage: React.FC = () => {
  const navigate = useNavigate();
  const { insights, loading, error, fetchInsights } = useInsights();
  const { campaigns, fetchCampaigns } = useCampaign();
  const { setGoal } = useCopilot();

  const [crmStatus, setCrmStatus] = useState<'online' | 'offline'>('offline');
  const [simulatorStatus, setSimulatorStatus] = useState<'online' | 'offline'>('offline');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    fetchInsights();
    fetchCampaigns();
  }, [fetchInsights, fetchCampaigns]);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await api.get('/insights');
        setCrmStatus('online');
      } catch {
        setCrmStatus('offline');
      }

      try {
        await simulatorApi.post('/send', {});
        setSimulatorStatus('online');
      } catch (err: any) {
        if (err.response) {
          setSimulatorStatus('online');
        } else {
          setSimulatorStatus('offline');
        }
      }
      setLastUpdated(new Date().toLocaleTimeString());
    };

    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleResolveAction = (recommendation: string) => {
    setGoal(recommendation);
    navigate('/');
  };

  // KPI Calculations
  const atRiskCount = insights.filter(i => i.impact === 'CRITICAL' || i.impact === 'HIGH').length;
  const needsApprovalCount = campaigns.filter(c => c.status === 'READY' || c.status === 'DRAFT').length;
  const highImpactCount = insights.filter(i => i.impact === 'CRITICAL' || i.impact === 'HIGH').length;
  const totalAudience = campaigns.reduce((acc, c) => acc + (c.metrics?.total || 0), 0);

  return (
    <div className="max-w-[1600px] w-full mx-auto px-6 md:px-8 py-6 space-y-8">
      
      {/* 1. Header + Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border/60 pb-5 gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-primary bg-primary/10 w-fit px-3 py-1 rounded-full border border-primary/20 text-[10px] font-bold uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Marketing Intelligence Hub</span>
          </div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">Performance Analytics</h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            Real-time closed-loop decision telemetry, campaigns audit data, and execution recommendations.
          </p>
        </div>

        {/* Live statuses sub-bar */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-text-muted bg-card border border-border px-4 py-2.5 rounded-xl self-start md:self-auto">
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-text-secondary">Last Updated:</span>
            <span>{lastUpdated || 'Polling...'}</span>
          </div>
          <span className="text-border hidden sm:inline">•</span>
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-text-secondary">Server:</span>
            <span className="flex items-center space-x-1">
              <span className={`w-1.5 h-1.5 rounded-full ${crmStatus === 'online' ? 'bg-accent-emerald' : 'bg-accent-rose'}`}></span>
              <span className="text-[9px] uppercase font-bold text-text-primary">{crmStatus}</span>
            </span>
          </div>
          <span className="text-border hidden sm:inline">•</span>
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-text-secondary">Simulator:</span>
            <span className="flex items-center space-x-1">
              <span className={`w-1.5 h-1.5 rounded-full ${simulatorStatus === 'online' ? 'bg-accent-emerald' : 'bg-accent-rose'}`}></span>
              <span className="text-[9px] uppercase font-bold text-text-primary">{simulatorStatus}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. AI Campaign Insights Summary (XenoIntelligenceHub) & KPI Cards */}
      <div className="space-y-6">
        <XenoIntelligenceHub />

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-accent-rose/25 bg-accent-rose/5 rounded-xl p-4.5 flex flex-col justify-between space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-accent-rose">At Risk Cohorts</span>
              <AlertTriangle className="w-4 h-4 text-accent-rose" />
            </div>
            <div className="text-2xl font-bold text-text-primary pt-1">{atRiskCount}</div>
            <span className="text-[10px] text-text-muted leading-normal">Requires immediate channel strategy adjustment</span>
          </div>

          <div className="border border-accent-cyan/25 bg-accent-cyan/5 rounded-xl p-4.5 flex flex-col justify-between space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-accent-cyan">Needs Approval</span>
              <ShieldCheck className="w-4 h-4 text-accent-cyan" />
            </div>
            <div className="text-2xl font-bold text-text-primary pt-1">{needsApprovalCount}</div>
            <span className="text-[10px] text-text-muted leading-normal">Campaign variations pending launch review</span>
          </div>

          <div className="border border-primary/25 bg-primary/5 rounded-xl p-4.5 flex flex-col justify-between space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-primary">High Impact Insights</span>
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-text-primary pt-1">{highImpactCount}</div>
            <span className="text-[10px] text-text-muted leading-normal">Optimization recommendations generated</span>
          </div>

          <div className="border border-accent-emerald/25 bg-accent-emerald/5 rounded-xl p-4.5 flex flex-col justify-between space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-accent-emerald">Total Campaign Reach</span>
              <Heart className="w-4 h-4 text-accent-emerald" />
            </div>
            <div className="text-2xl font-bold text-text-primary pt-1">{totalAudience.toLocaleString()}</div>
            <span className="text-[10px] text-text-muted leading-normal">Aggregated target audience count</span>
          </div>
        </div>
      </div>

      {/* 3. Recent AI Decisions Feed */}
      <RecentDecisionsFeed insights={insights} campaigns={campaigns} loading={loading} />

      {/* 4. Main Analysis & Diagnostics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-stretch">
        {/* Left Column (70%) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="h-[285px]">
            <RevenueChart campaigns={campaigns} />
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-10 gap-6 items-stretch min-h-[225px]">
            <div className="md:col-span-6">
              <ChannelPerformance />
            </div>
            <div className="md:col-span-4">
              <DetailedMetricsCard campaigns={campaigns} />
            </div>
          </div>
        </div>

        {/* Right Column (30%) */}
        <div className="lg:col-span-3">
          <AIRecommendationsCard insights={insights} onActionClick={handleResolveAction} />
        </div>
      </div>

    </div>
  );
};

export default InsightsPage;
