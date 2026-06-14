import React from 'react';
import { Users, Filter, CheckCircle2 } from 'lucide-react';

interface SegmentCardProps {
  dslString: string;
  segmentSize: number;
}

export const SegmentCard: React.FC<SegmentCardProps> = ({ dslString, segmentSize }) => {
  // Try to parse the DSL
  let conditions: Array<{ field: string; operator: string; value: string | number }> = [];
  let logicalOperator = 'AND';

  try {
    const parsed = JSON.parse(dslString);
    conditions = parsed.conditions || [];
    logicalOperator = parsed.logicalOperator || 'AND';
  } catch {
    conditions = [];
  }

  const formatFieldLabel = (field: string) => {
    switch (field) {
      case 'total_spend': return 'Total Spend';
      case 'orders_count': return 'Orders Count';
      case 'last_order_days': return 'Days Since Last Order';
      case 'segment': return 'Segment Tag';
      case 'email': return 'Email Address';
      default: return field;
    }
  };

  const formatOperatorLabel = (op: string) => {
    switch (op) {
      case 'equals': return '=';
      case 'contains': return 'contains';
      case 'gt': return '>';
      case 'gte': return '≥';
      case 'lt': return '<';
      case 'lte': return '≤';
      default: return op;
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Users className="w-4.5 h-4.5 text-primary" />
          <h4 className="text-sm font-semibold text-text-primary">Target Audience Segment</h4>
        </div>
        <span className="text-[10px] uppercase font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
          Live Count
        </span>
      </div>

      {/* Segment Size Header */}
      <div className="flex items-baseline space-x-2 mb-5">
        <span className="text-3xl font-bold text-text-primary tracking-tight">{segmentSize}</span>
        <span className="text-xs text-text-secondary">matching customers targetable</span>
      </div>

      {/* DSL Filters Visual list */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center space-x-1.5 mb-2.5">
          <Filter className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Criteria Logic</span>
        </div>

        {conditions.length === 0 ? (
          <div className="flex items-center space-x-1.5 text-xs text-text-secondary bg-background border border-border p-2.5 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-accent-emerald" />
            <span>Targeting 100% of all registered users (No segment criteria applied).</span>
          </div>
        ) : (
          <div className="space-y-2">
            {conditions.map((cond, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-xs bg-background border border-border p-2.5 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-text-secondary font-medium">{formatFieldLabel(cond.field)}</span>
                  <span className="text-primary font-mono text-[10px] bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                    {formatOperatorLabel(cond.operator)}
                  </span>
                  <span className="text-text-primary font-semibold">"{cond.value}"</span>
                </div>
                {index < conditions.length - 1 && (
                  <span className="text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded">
                    {logicalOperator}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default SegmentCard;
