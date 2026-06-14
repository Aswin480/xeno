import { Request, Response, NextFunction } from 'express';
import { InsightService } from '../services/insight.service';
import { logger } from '../utils/logger';

export class InsightsController {
  private insightService: InsightService;

  constructor() {
    this.insightService = new InsightService();
  }

  getAllInsights = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      logger.info('API Call: GET /insights');
      const insights = await this.insightService.generateInsights();

      res.status(200).json({
        success: true,
        data: insights,
      });
    } catch (err) {
      logger.error('Error in InsightsController.getAllInsights:', err);
      next(err);
    }
  };

  getCampaignInsights = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      logger.info(`API Call: GET /campaigns/${id}/insights`);

      const insights = await this.insightService.getCampaignInsights(id);

      res.status(200).json({
        success: true,
        data: insights,
      });
    } catch (err) {
      logger.error(`Error in InsightsController.getCampaignInsights for campaign ${req.params.id}:`, err);
      next(err);
    }
  };
}

export default new InsightsController();
