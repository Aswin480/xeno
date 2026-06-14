import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Campaign } from '../../types/campaign';
import CampaignHistoryRow from './CampaignHistoryRow';

interface CampaignHistoryTableProps {
  campaigns: Campaign[];
}

export const CampaignHistoryTable: React.FC<CampaignHistoryTableProps> = ({ campaigns }) => {
  if (campaigns.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center shadow-sm">
        <TrendingUp className="w-8 h-8 text-text-muted mx-auto mb-3" />
        <p className="text-sm font-semibold text-text-primary">No campaigns registered yet</p>
        <p className="text-xs text-text-secondary mt-1">Use the AI Copilot to generate and launch your first campaign strategy.</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-secondary/40 text-[10px] uppercase font-bold text-text-muted tracking-wider">
              <th className="px-6 py-4">Campaign Name</th>
              <th className="px-6 py-4">Channel</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Audience</th>
              <th className="px-6 py-4 text-right">Delivery Rate</th>
              <th className="px-6 py-4 text-right">Open Rate</th>
              <th className="px-6 py-4 text-right text-accent-emerald">Rev Recovered</th>
              <th className="px-6 py-4">Intelligence</th>
              <th className="px-6 py-4">Launched At</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs">
            {campaigns.map((camp) => (
              <CampaignHistoryRow key={camp.id} campaign={camp} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default CampaignHistoryTable;
