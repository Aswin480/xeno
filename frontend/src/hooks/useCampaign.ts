import { useCampaignStore } from '../store/campaignStore';

export const useCampaign = () => {
  const store = useCampaignStore();
  return {
    campaigns: store.campaigns,
    loading: store.loading,
    error: store.error,
    selectedCampaign: store.selectedCampaign,
    fetchCampaigns: store.fetchCampaigns,
    createCampaign: store.createCampaign,
    launchCampaign: store.launchCampaign,
    fetchCampaignById: store.fetchCampaignById,
  };
};
