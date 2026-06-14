import { Request, Response, NextFunction } from 'express';
import { CampaignService } from '../services/campaign.service';
import { AnalyticsService } from '../services/analytics.service';
import { LaunchService } from '../services/launch.service';
import { createCampaignSchema } from '../validators/campaign.schema';
import { logger } from '../utils/logger';

export class CampaignsController {
  private campaignService: CampaignService;
  private analyticsService: AnalyticsService;
  private launchService: LaunchService;

  constructor() {
    this.campaignService = new CampaignService();
    this.analyticsService = new AnalyticsService();
    this.launchService = new LaunchService();
  }

  createCampaign = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      logger.info('API Call: POST /campaigns');
      const validation = createCampaignSchema.safeParse(req.body);

      if (!validation.success) {
        res.status(400).json({
          success: false,
          errors: validation.error.flatten().fieldErrors,
        });
        return;
      }

      const campaign = await this.campaignService.createCampaign({
        status: 'PENDING',
        confidenceScore: validation.data.confidenceScore ?? 0.8,
        estimatedRoi: validation.data.estimatedRoi ?? 1.5,
        ...validation.data,
      });

      res.status(201).json({
        success: true,
        data: campaign,
      });
    } catch (err) {
      logger.error('Error in CampaignsController.createCampaign:', err);
      next(err);
    }
  };

  getAllCampaigns = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      logger.info('API Call: GET /campaigns');
      // Fetch all campaign stats (which includes campaigns merged with live aggregated metrics)
      const statsList = await this.analyticsService.getAllCampaignStats();

      res.status(200).json({
        success: true,
        data: statsList,
      });
    } catch (err) {
      logger.error('Error in CampaignsController.getAllCampaigns:', err);
      next(err);
    }
  };

  getCampaignById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      logger.info(`API Call: GET /campaigns/${id}`);

      const campaignDetails = await this.campaignService.getCampaignById(id);
      if (!campaignDetails) {
        res.status(404).json({
          success: false,
          message: 'Campaign not found',
        });
        return;
      }

      const stats = await this.analyticsService.getCampaignStats(id);

      res.status(200).json({
        success: true,
        data: {
          ...campaignDetails,
          metrics: stats?.metrics || null,
        },
      });
    } catch (err) {
      logger.error('Error in CampaignsController.getCampaignById:', err);
      next(err);
    }
  };

  launchCampaign = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      logger.info(`API Call: POST /campaigns/${id}/launch`);

      const result = await this.launchService.launchCampaign(id);

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      logger.error(`Error in CampaignsController.launchCampaign for campaign ${req.params.id}:`, errorMsg);
      res.status(500).json({
        success: false,
        message: errorMsg,
      });
    }
  };
}

export default new CampaignsController();
