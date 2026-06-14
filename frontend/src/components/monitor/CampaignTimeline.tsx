import React from 'react';
import { Send, CheckCircle2, Eye, MousePointerClick, ShoppingCart, Clock } from 'lucide-react';

export interface TimelineEvent {
  timestamp: Date | string;
  event: 'launched' | 'delivered' | 'opened' | 'clicked' | 'converted';
  count?: number;
  rate?: number; // as percentage
  details?: string;
}

interface CampaignTimelineProps {
  events: TimelineEvent[];
  campaignName?: string;
}

/**
 * Campaign Timeline: Shows real-time event stream
 * This is the "callbacks" visualization Xeno wants to see
 */
export const CampaignTimeline: React.FC<CampaignTimelineProps> = ({
  events,
  campaignName,
}) => {
  const eventIcons: Record<string, React.ReactNode> = {
    launched: <Send className="w-5 h-5" />,
    delivered: <CheckCircle2 className="w-5 h-5" />,
    opened: <Eye className="w-5 h-5" />,
    clicked: <MousePointerClick className="w-5 h-5" />,
    converted: <ShoppingCart className="w-5 h-5" />,
  };

  const eventLabels: Record<string, string> = {
    launched: 'Campaign Launched',
    delivered: 'Messages Delivered',
    opened: 'Started Opening',
    clicked: 'Started Clicking',
    converted: 'First Conversions',
  };

  const eventColors: Record<string, string> = {
    launched: 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20',
    delivered: 'text-accent-emerald bg-accent-emerald/10 border-accent-emerald/20',
    opened: 'text-primary bg-primary/10 border-primary/20',
    clicked: 'text-accent-amber bg-accent-amber/10 border-accent-amber/20',
    converted: 'text-accent-emerald bg-accent-emerald/10 border-accent-emerald/20',
  };

  const formatTime = (timestamp: Date | string): string => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-base font-bold text-text-primary flex items-center space-x-2">
          <Clock className="w-5 h-5 text-primary" />
          <span>Live Campaign Events</span>
        </h3>
        {campaignName && (
          <p className="text-xs text-text-secondary mt-1">{campaignName}</p>
        )}
      </div>

      {/* Timeline */}
      <div className="space-y-3 relative">
        {/* Vertical line */}
        <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-border"></div>

        {/* Events */}
        {events.map((event, idx) => (
          <div key={idx} className="relative pl-12">
            {/* Event dot */}
            <div className={`absolute left-0 top-1 w-5 h-5 rounded-full flex items-center justify-center ${eventColors[event.event]} border border-border`}>
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>

            {/* Event card */}
            <div className="bg-card border border-border rounded-lg p-3 space-y-2 hover:border-border-strong transition-all">
              {/* Event label + time */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-primary">
                  {eventLabels[event.event]}
                </span>
                <span className="text-xs text-text-secondary font-mono">
                  {formatTime(event.timestamp)}
                </span>
              </div>

              {/* Metrics */}
              {(event.count || event.rate) && (
                <div className="flex items-center space-x-4 text-xs">
                  {event.count !== undefined && (
                    <div>
                      <span className="text-text-secondary">Count: </span>
                      <span className={`font-bold ${eventColors[event.event].split(' ')[0]}`}>
                        {event.count.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {event.rate !== undefined && (
                    <div>
                      <span className="text-text-secondary">Rate: </span>
                      <span className={`font-bold ${eventColors[event.event].split(' ')[0]}`}>
                        {event.rate.toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Details */}
              {event.details && (
                <div className="text-xs text-text-secondary bg-background rounded px-2 py-1.5">
                  {event.details}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {events.length === 0 && (
        <div className="text-center py-8 text-text-secondary">
          <p className="text-xs">Waiting for campaign events...</p>
        </div>
      )}
    </div>
  );
};

export default CampaignTimeline;
