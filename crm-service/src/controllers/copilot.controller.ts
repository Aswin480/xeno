import { Request, Response, NextFunction } from 'express';
import { CopilotService } from '../services/copilot.service';
import { generatePlanSchema } from '../validators/copilot.schema';
import { logger } from '../utils/logger';

export class CopilotController {
  private copilotService: CopilotService;

  constructor() {
    this.copilotService = new CopilotService();
  }

  generatePlan = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      logger.info('API Call: POST /copilot/generate-plan');
      const validation = generatePlanSchema.safeParse(req.body);

      if (!validation.success) {
        res.status(400).json({
          success: false,
          errors: validation.error.flatten().fieldErrors,
        });
        return;
      }

      const { goal } = validation.data;
      const plan = await this.copilotService.generatePlan(goal);

      res.status(200).json({
        success: true,
        data: plan,
      });
    } catch (err) {
      logger.error('Error in CopilotController.generatePlan:', err);
      next(err);
    }
  };

  observeOutcome = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { campaignId } = req.params;
      logger.info(`API Call: GET /copilot/observe/${campaignId}`);
      const nextAction = await this.copilotService.observeOutcomeAndRecommendNext(campaignId);

      res.status(200).json({
        success: true,
        data: nextAction,
      });
    } catch (err) {
      logger.error('Error in CopilotController.observeOutcome:', err);
      next(err);
    }
  };
}
export default new CopilotController();
