import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCampaign } from '../hooks/useCampaign';
import CampaignHistoryTable from '../components/campaign-history/CampaignHistoryTable';
import { Plus, Loader2, BarChart2 } from 'lucide-react';

export const CampaignHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { campaigns, loading, error, fetchCampaigns } = useCampaign();

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return (
    <div className="space-y-6 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-text-primary tracking-tight">Campaign Registry</h2>
          <p className="text-xs text-text-secondary">Browse historical logs, delivery rates, and ROI metrics.</p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New AI Campaign</span>
        </button>
      </div>

      {/* Loading & error handlers */}
      {loading && campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[300px] space-y-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-xs text-text-secondary">Loading campaign records...</p>
        </div>
      ) : error ? (
        <div className="bg-accent-rose/10 border border-accent-rose/25 p-4 rounded-xl text-xs text-accent-rose">
          Failed to load campaigns: {error}
        </div>
      ) : (
        /* History Grid Table */
        <CampaignHistoryTable campaigns={campaigns} />
      )}
    </div>
  );
};
export default CampaignHistoryPage;
