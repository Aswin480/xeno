import { Request, Response } from 'express';
import simulatorService from '../services/simulator.service';

export class ChannelController {
  sendMessage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { recipientId, channel, destination, message, callbackUrl } = req.body;

      // Simple validation
      if (!recipientId || !channel || !destination || !message || !callbackUrl) {
        res.status(400).json({
          success: false,
          error: 'Missing required parameters: recipientId, channel, destination, message, callbackUrl',
        });
        return;
      }

      if (!['SMS', 'EMAIL', 'WHATSAPP'].includes(channel)) {
        res.status(400).json({
          success: false,
          error: 'Invalid channel. Must be SMS, EMAIL, or WHATSAPP',
        });
        return;
      }

      const result = await simulatorService.processSendRequest({
        recipientId,
        channel,
        destination,
        message,
        callbackUrl,
      });

      res.status(200).json(result);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('[SIMULATOR] Error processing send message:', errorMsg);
      res.status(500).json({
        success: false,
        error: errorMsg,
      });
    }
  };
}
export default new ChannelController();
