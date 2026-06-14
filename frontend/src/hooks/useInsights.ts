import { useState, useCallback } from 'react';
import { Insight } from '../types/insight';
import { insightsApi } from '../api/insights';

export const useInsights = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [campaignInsights, setCampaignInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await insightsApi.getInsights();
      setInsights(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load global insights');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCampaignInsights = useCallback(async (campaignId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await insightsApi.getCampaignInsights(campaignId);
      setCampaignInsights(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load campaign insights');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    insights,
    campaignInsights,
    loading,
    error,
    fetchInsights,
    fetchCampaignInsights,
  };
};
