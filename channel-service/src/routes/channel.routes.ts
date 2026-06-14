import { Router } from 'express';
import { sendHandler } from '../controllers/channel.controller';

const router = Router();
router.post('/send', sendHandler);

export default router;
