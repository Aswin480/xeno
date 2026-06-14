import React from 'react';
import { Mail, MessageSquare, PhoneCall, BarChart3 } from 'lucide-react';

export const ChannelPerformance: React.FC = () => {
  const channels = [
    {
      name: 'SMS Gateway',
      rate: 94,
      bounce: 2,
      icon: MessageSquare,
      color: 'text-accent-amber bg-accent-amber/10 border-accent-amber/25',
      fill: 'bg-accent-amber',
    },
    {
      name: 'WhatsApp Business',
      rate: 88,
      bounce: 4,
      icon: PhoneCall,
      color: 'text-accent-emerald bg-accent-emerald/10 border-accent-emerald/25',
      fill: 'bg-accent-emerald',
    },
    {
      name: 'Email SMTP',
      rate: 45,
      bounce: 12,
      icon: Mail,
      color: 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/25',
      fill: 'bg-accent-cyan',
    },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-5 h-full flex flex-col justify-between">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-4.5 h-4.5 text-primary" />
          <h4 className="text-sm font-semibold text-text-primary">Channel Performance Comparison</h4>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">
          Comparison audit showing average open and bounce rates across messaging integrations in active workspaces.
        </p>
      </div>

      <div className="space-y-3 pt-1">
        {channels.map((chan, idx) => {
          const Icon = chan.icon;
          return (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div className={`w-6.5 h-6.5 rounded-lg flex items-center justify-center border ${chan.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-text-primary">{chan.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-text-primary">{chan.rate}% Opens</span>
                  <span className="text-[10px] text-text-muted ml-2">({chan.bounce}% Bounces)</span>
                </div>
              </div>

              {/* Bar indicator */}
              <div className="w-full h-1.5 bg-background rounded-full overflow-hidden border border-border">
                <div className={`h-full ${chan.fill} rounded-full`} style={{ width: `${chan.rate}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ChannelPerformance;
