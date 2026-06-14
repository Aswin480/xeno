import React, { createContext, useContext, useState, useCallback } from 'react';
import { Campaign } from '../types/campaign';
import { campaignsApi } from '../api/campaigns';

interface CampaignStoreContextType {
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
  fetchCampaigns: () => Promise<void>;
  createCampaign: (campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Campaign>;
  launchCampaign: (id: string) => Promise<boolean>;
  selectedCampaign: Campaign | null;
  fetchCampaignById: (id: string) => Promise<void>;
}

const CampaignStoreContext = createContext<CampaignStoreContextType | undefined>(undefined);

export const CampaignStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await campaignsApi.getCampaigns();
      setCampaigns(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCampaign = useCallback(async (campaignData: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const newCampaign = await campaignsApi.createCampaign(campaignData);
      setCampaigns(prev => [newCampaign, ...prev]);
      return newCampaign;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create campaign');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const launchCampaign = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await campaignsApi.launchCampaign(id);
      if (result.success) {
        // Refresh campaigns to catch status transition
        await fetchCampaigns();
        if (selectedCampaign && selectedCampaign.id === id) {
          await fetchCampaignById(id);
        }
        return true;
      }
      return false;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to launch campaign');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchCampaigns, selectedCampaign]);

  const fetchCampaignById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await campaignsApi.getCampaign(id);
      setSelectedCampaign(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch campaign details');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <CampaignStoreContext.Provider
      value={{
        campaigns,
        loading,
        error,
        fetchCampaigns,
        createCampaign,
        launchCampaign,
        selectedCampaign,
        fetchCampaignById,
      }}
    >
      {children}
    </CampaignStoreContext.Provider>
  );
};

export const useCampaignStore = () => {
  const context = useContext(CampaignStoreContext);
  if (context === undefined) {
    throw new Error('useCampaignStore must be used within a CampaignStoreProvider');
  }
  return context;
};
