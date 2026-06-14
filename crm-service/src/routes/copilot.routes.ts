import { Router } from 'express';
import copilotController from '../controllers/copilot.controller';

const router = Router();

router.post('/generate-plan', copilotController.generatePlan);
router.get('/observe/:campaignId', copilotController.observeOutcome);

export default router;
