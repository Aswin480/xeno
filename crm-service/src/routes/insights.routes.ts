import { Router } from 'express';
import insightsController from '../controllers/insights.controller';

const router = Router();

router.get('/', insightsController.getAllInsights);

export default router;
