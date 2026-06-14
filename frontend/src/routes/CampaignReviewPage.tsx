import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCampaign } from '../hooks/useCampaign';
import MessagePreview from '../components/copilot/MessagePreview';
import ApprovalChecklist from '../components/review/ApprovalChecklist';
import LaunchButton from '../components/review/LaunchButton';
import AudienceSummary from '../components/review/AudienceSummary';
import CampaignSummary from '../components/review/CampaignSummary';
import { Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import { simulatorApi } from '../api/axios';

export const CampaignReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get('id');

  const { selectedCampaign, loading, error, fetchCampaignById, launchCampaign } = useCampaign();
  const [simulatorOnline, setSimulatorOnline] = useState(false);
  const [launching, setLaunching] = useState(false);

  useEffect(() => {
    if (campaignId) {
      fetchCampaignById(campaignId);
    }
  }, [campaignId, fetchCampaignById]);

  useEffect(() => {
    // Check if channel simulator is online
    const checkSimulator = async () => {
      try {
        await simulatorApi.post('/send', {});
        setSimulatorOnline(true);
      } catch (err: any) {
        if (err.response) {
          setSimulatorOnline(true);
        } else {
          setSimulatorOnline(false);
        }
      }
    };
    checkSimulator();
  }, []);

  const handleLaunch = async () => {
    if (!campaignId) return;
    setLaunching(true);
    try {
      const success = await launchCampaign(campaignId);
      if (success) {
        // Navigate to monitor page
        navigate(`/campaigns/monitor/${campaignId}`);
      }
    } catch (err) {
      console.error('Launch failed:', err);
    } finally {
      setLaunching(false);
    }
  };

  if (loading && !selectedCampaign) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] space-y-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-xs text-text-secondary">Loading campaign details...</p>
      </div>
    );
  }

  if (error || !selectedCampaign) {
    return (
      <div className="space-y-4 pt-6">
        <div className="bg-accent-rose/10 border border-accent-rose/25 p-4 rounded-xl text-xs text-accent-rose">
          Failed to load campaign: {error || 'Campaign not found.'}
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-xs font-semibold text-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Copilot Center</span>
        </button>
      </div>
    );
  }

  // Calculate segment count
  let conditionsCount = 0;
  try {
    const parsed = JSON.parse(selectedCampaign.segmentDsl);
    conditionsCount = parsed.conditions?.length || 0;
  } catch {}

  // Mock a size estimation if metrics aren't populated yet
  const segmentSize = selectedCampaign.metrics?.total || 10; // defaults to 10 for seeds

  const checklistValid =
    selectedCampaign.name.length >= 3 &&
    selectedCampaign.messageTemplate.includes('{name}') &&
    simulatorOnline;

  return (
    <div className="space-y-6 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-1 text-xs font-semibold text-text-muted hover:text-text-primary transition-colors cursor-pointer mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Copilot</span>
          </button>
          <h2 className="text-xl font-bold text-text-primary tracking-tight">Campaign Launchpad</h2>
          <p className="text-xs text-text-secondary">Perform final checks and launch delivery dispatch.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & Preview */}
        <div className="lg:col-span-2 space-y-6">
          <CampaignSummary
            goal={selectedCampaign.goal}
            channel={selectedCampaign.channel}
            messageTemplate={selectedCampaign.messageTemplate}
          />
          
          <AudienceSummary
            segmentSize={segmentSize}
            segmentDsl={selectedCampaign.segmentDsl}
          />

          <MessagePreview
            channel={selectedCampaign.channel}
            messageTemplate={selectedCampaign.messageTemplate}
            readOnly={true}
          />
        </div>

        {/* Right Column: Approval & Action */}
        <div className="space-y-6">
          <ApprovalChecklist
            campaignName={selectedCampaign.name}
            segmentSize={segmentSize}
            messageTemplate={selectedCampaign.messageTemplate}
            simulatorOnline={simulatorOnline}
          />

          <LaunchButton
            onLaunch={handleLaunch}
            disabled={!checklistValid}
            loading={launching}
          />
        </div>
      </div>
    </div>
  );
};
export default CampaignReviewPage;
