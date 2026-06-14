import { Router } from 'express';
import campaignsController from '../controllers/campaigns.controller';
import insightsController from '../controllers/insights.controller';

const router = Router();

router.post('/', campaignsController.createCampaign);
router.get('/', campaignsController.getAllCampaigns);
router.get('/:id', campaignsController.getCampaignById);
router.get('/:id/insights', insightsController.getCampaignInsights);
router.post('/:id/launch', campaignsController.launchCampaign);

export default router;
