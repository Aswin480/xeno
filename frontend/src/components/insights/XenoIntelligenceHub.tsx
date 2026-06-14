import React, { useState } from 'react';
import { History, Brain, Sparkles, TrendingUp, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';

export const XenoIntelligenceHub: React.FC = () => {
  const [selectedPath, setSelectedPath] = useState<'ignore' | 'apply' | 'none'>('none');

  return (
    <div className="bg-gradient-to-br from-card to-background border border-primary/20 rounded-xl p-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-primary animate-pulse-subtle" />
          <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider">Xeno Copilot Intelligence Hub</h4>
        </div>
        <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
          Memory & Foresight Enabled
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Xeno Strategic Memory (50%) */}
        <div className="lg:col-span-6 bg-background border border-border p-4.5 rounded-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <History className="w-4 h-4 text-primary" />
              <h5 className="text-xs font-bold text-text-primary uppercase tracking-wider">Xeno Strategic Memory</h5>
            </div>
            
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Xeno has matched this campaign's current behavioral cohort to historical execution patterns:
            </p>

            <div className="bg-card border border-border rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-text-muted">Matched Baseline:</span>
                <span className="font-semibold text-text-primary">March 14 (Summer Promo)</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-text-muted">Historical Action:</span>
                <span className="font-semibold text-accent-cyan">Switched Segment to WhatsApp</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-text-muted">Historical Result:</span>
                <span className="font-bold text-accent-emerald">+18% Conversion Lift</span>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex justify-between items-center">
            <div>
              <span className="text-[9px] text-primary uppercase font-bold tracking-wider block">Expected Recovery Lift</span>
              <span className="text-lg font-extrabold text-primary">+12.4%</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-primary uppercase font-bold tracking-wider block">Confidence Rating</span>
              <span className="text-xs font-bold text-text-primary">87% Accuracy</span>
            </div>
          </div>
        </div>

        {/* Right Column: Future Projection Simulator / Digital Twin (50%) */}
        <div className="lg:col-span-6 bg-background border border-border p-4.5 rounded-xl flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-accent-cyan" />
              <h5 className="text-xs font-bold text-text-primary uppercase tracking-wider">Digital Twin Future Simulator</h5>
            </div>
            <p className="text-[11px] text-text-secondary leading-relaxed">
              Simulated outcomes based on current subscriber engagement decline rate:
            </p>
          </div>

          {/* Interactive Simulation Map */}
          <div className="relative h-20 bg-card border border-border rounded-lg flex items-center justify-between px-6 overflow-hidden">
            {/* Background paths lines */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              {/* Central connection to now */}
              <line x1="0" y1="40" x2="20" y2="40" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="3 3" />
              {/* Ignore Path (red) */}
              <path 
                d="M 20 40 Q 200 70 380 65" 
                fill="none" 
                stroke={selectedPath === 'ignore' ? 'var(--accent-rose)' : '#f43f5e30'} 
                strokeWidth={selectedPath === 'ignore' ? '2.5' : '1.5'} 
                className="transition-all duration-300"
              />
              {/* Execute Path (green) */}
              <path 
                d="M 20 40 Q 200 10 380 15" 
                fill="none" 
                stroke={selectedPath === 'apply' ? 'var(--accent-emerald)' : '#10b98130'} 
                strokeWidth={selectedPath === 'apply' ? '2.5' : '1.5'} 
                className="transition-all duration-300"
              />
            </svg>

            {/* Now Point */}
            <div className="z-10 flex flex-col items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-primary/40 animate-ping absolute"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-primary z-20"></div>
              <span className="text-[8px] text-text-muted mt-1 font-bold">NOW</span>
            </div>

            {/* Path Selector Buttons overlay */}
            <button 
              onMouseEnter={() => setSelectedPath('ignore')} 
              onMouseLeave={() => setSelectedPath('none')}
              className={`z-10 border rounded px-2 py-1 flex flex-col items-center cursor-pointer transition-all ${
                selectedPath === 'ignore' ? 'border-accent-rose bg-accent-rose/10 text-accent-rose scale-105' : 'border-border bg-background text-text-secondary'
              }`}
            >
              <span className="text-[9px] font-bold">Ignore Actions</span>
              <span className="text-[8px] opacity-80">-9.2% Conversions</span>
            </button>

            <button 
              onMouseEnter={() => setSelectedPath('apply')} 
              onMouseLeave={() => setSelectedPath('none')}
              className={`z-10 border rounded px-2 py-1 flex flex-col items-center cursor-pointer transition-all ${
                selectedPath === 'apply' ? 'border-accent-emerald bg-accent-emerald/10 text-accent-emerald scale-105' : 'border-border bg-background text-text-secondary'
              }`}
            >
              <span className="text-[9px] font-bold">Apply Xeno</span>
              <span className="text-[8px] opacity-80">+13.1% Recovery</span>
            </button>
          </div>

          {/* Metrics summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-accent-rose/5 border border-accent-rose/25 rounded-lg p-2 flex items-center space-x-2">
              <AlertTriangle className="w-3.5 h-3.5 text-accent-rose" />
              <div>
                <span className="text-[8px] text-accent-rose uppercase font-bold block">If Left Unresolved</span>
                <span className="text-xs font-bold text-accent-rose">Reach drops 4% in 6h</span>
              </div>
            </div>

            <div className="bg-accent-emerald/5 border border-accent-emerald/25 rounded-lg p-2 flex items-center space-x-2">
              <ShieldCheck className="w-3.5 h-3.5 text-accent-emerald" />
              <div>
                <span className="text-[8px] text-accent-emerald uppercase font-bold block">If Recommendation Applied</span>
                <span className="text-xs font-bold text-accent-emerald">+13.1% Recovered</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default XenoIntelligenceHub;
