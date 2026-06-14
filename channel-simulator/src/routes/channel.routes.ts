import { Router } from 'express';
import channelController from '../controllers/channel.controller';

const router = Router();

router.post('/send', channelController.sendMessage);

export default router;
