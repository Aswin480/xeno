import { Router } from 'express';
import receiptsController from '../controllers/receipts.controller';

const router = Router();

router.post('/', receiptsController.processReceipt);

export default router;
