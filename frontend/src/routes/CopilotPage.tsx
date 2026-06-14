import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCopilot } from '../hooks/useCopilot';
import { useCampaign } from '../hooks/useCampaign';
import GoalInput from '../components/copilot/GoalInput';
import GoalChips from '../components/copilot/GoalChips';
import SegmentCard from '../components/copilot/SegmentCard';
import RecommendationCard from '../components/copilot/RecommendationCard';
import MessagePreview from '../components/copilot/MessagePreview';
import ConfidenceBadge from '../components/copilot/ConfidenceBadge';
import { Sparkles, ArrowRight, CheckCircle2, Brain, Target, Send } from 'lucide-react';

export const CopilotPage: React.FC = () => {
  const navigate = useNavigate();
  const { goal, setGoal, generatedPlan, generating, error, generatePlan } = useCopilot();
  const { createCampaign } = useCampaign();

  const [prompt, setPrompt] = useState(goal);
  const [editedTemplate, setEditedTemplate] = useState('');

  const handleGenerate = async () => {
    try {
      const plan = await generatePlan(prompt);
      setEditedTemplate(plan.messageTemplate);
    } catch (err) {
      console.error('Generation failed:', err);
    }
  };

  const handleSaveCampaign = async () => {
    if (!generatedPlan) return;

    try {
      const newCampaign = await createCampaign({
        name: generatedPlan.name,
        goal: generatedPlan.goal,
        segmentDsl: generatedPlan.segmentDsl,
        status: 'READY', // Ready for final review and launch
        channel: generatedPlan.channel,
        messageTemplate: editedTemplate || generatedPlan.messageTemplate,
        confidenceScore: generatedPlan.confidenceScore,
        estimatedRoi: generatedPlan.estimatedRoi,
      });

      // Route to review page with campaign ID
      navigate(`/campaigns/review?id=${newCampaign.id}`);
    } catch (err) {
      console.error('Failed to create campaign:', err);
    }
  };

  return (
    <div className="space-y-6 pt-6">
      {/* Intro Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-primary bg-primary/10 w-fit px-3 py-1 rounded-full border border-primary/20 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Native Marketing Copilot</span>
        </div>
        <h2 className="text-2xl font-bold text-text-primary tracking-tight">Design Autonomous Strategy Campaigns</h2>
        <p className="text-xs text-text-secondary max-w-2xl leading-relaxed">
          Input your customer goals. Xeno AI Copilot will formulate segment filters, draft high-conversion message copy templates, select optimal channels, and estimate campaign ROI.
        </p>
      </div>

      {/* Goal Generation Input */}
      <div className="space-y-4">
        <GoalInput
          value={prompt}
          onChange={setPrompt}
          onSubmit={handleGenerate}
          loading={generating}
        />
        <GoalChips onSelect={(text) => setPrompt(text)} disabled={generating} />
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-accent-rose/10 border border-accent-rose/25 p-4 rounded-xl text-xs text-accent-rose flex items-start space-x-2.5">
          <span>⚠️ {error}</span>
        </div>
      )}

      {/* Generated Strategy Preview Card */}
      {generatedPlan && !generating && (
        <div className="space-y-6 border-t border-border pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-text-primary flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-accent-emerald" />
                <span>Strategy Proposed: {generatedPlan.name}</span>
              </h3>
              <p className="text-xs text-text-muted">Review, edit templates, and save campaign configuration details below.</p>
            </div>

            {/* Confidence Gauge */}
            <ConfidenceBadge score={generatedPlan.confidenceScore} />
          </div>

          {/* Gemini Conversational Voice Bubble */}
          {generatedPlan.voiceSummary && (
            <div className="bg-card border border-border rounded-xl p-4.5 flex items-start space-x-3.5 text-xs text-text-secondary leading-relaxed shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500 pointer-events-none" />
              <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5 animate-pulse" />
              <div className="space-y-1">
                <p className="font-bold text-primary tracking-wide uppercase text-[10px]">Xeno AI Copilot Voice</p>
                <p className="italic text-text-primary text-xs leading-relaxed">"{generatedPlan.voiceSummary}"</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Segment Resolver Card */}
            <SegmentCard
              dslString={generatedPlan.segmentDsl}
              segmentSize={generatedPlan.segmentSize}
            />

            {/* Strategy & ROI Recommendation Card */}
            <RecommendationCard
              channel={generatedPlan.channel}
              estimatedRoi={generatedPlan.estimatedRoi}
              reasoning={generatedPlan.confidenceReasoning}
            />
          </div>

          {/* Copywriting device mock previews */}
          <MessagePreview
            channel={generatedPlan.channel}
            messageTemplate={editedTemplate || generatedPlan.messageTemplate}
            onChange={setEditedTemplate}
          />

          {/* Proceed to launch action */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSaveCampaign}
              className="flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
            >
              <span>Save & Review Campaign</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default CopilotPage;
