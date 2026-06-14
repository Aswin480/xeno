import React from 'react';
import { Users, Filter } from 'lucide-react';

interface AudienceSummaryProps {
  segmentSize: number;
  segmentDsl: string;
}

export const AudienceSummary: React.FC<AudienceSummaryProps> = ({ segmentSize, segmentDsl }) => {
  let segmentName = 'General Segment';
  let conditions: any[] = [];
  try {
    const parsed = JSON.parse(segmentDsl);
    conditions = parsed.conditions || [];
    if (conditions.length > 0) {
      const cond = conditions[0];
      if (cond.field === 'segment') {
        segmentName = cond.value.toUpperCase().replace('_', ' ');
      }
    }
  } catch {}

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center space-x-2 text-primary">
        <Users className="w-4.5 h-4.5" />
        <h4 className="text-sm font-semibold text-text-primary">Target Audience Summary</h4>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="border border-border bg-background rounded-lg p-3">
          <span className="text-[10px] uppercase font-bold text-text-secondary">Segment Target</span>
          <p className="text-lg font-bold text-text-primary mt-1">{segmentName}</p>
        </div>
        <div className="border border-border bg-background rounded-lg p-3">
          <span className="text-[10px] uppercase font-bold text-text-secondary">Estimated Reach</span>
          <p className="text-lg font-bold text-accent-cyan mt-1">{segmentSize} Customers</p>
        </div>
      </div>

      {conditions.length > 0 && (
        <div className="border-t border-border/60 pt-3 space-y-2">
          <div className="flex items-center space-x-1.5 text-[10px] font-bold text-text-secondary uppercase">
            <Filter className="w-3.5 h-3.5" />
            <span>Targeting Criteria</span>
          </div>
          <div className="bg-background border border-border rounded-lg p-2.5 space-y-1.5">
            {conditions.map((cond, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs text-text-secondary">
                <span className="capitalize">{cond.field.replace('_', ' ')}</span>
                <span className="font-semibold text-text-primary uppercase">{cond.operator} {cond.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default AudienceSummary;
