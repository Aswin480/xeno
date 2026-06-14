import { Request, Response, NextFunction } from 'express';
import { ReceiptService } from '../services/receipt.service';
import { receiptSchema } from '../validators/receipt.schema';
import { logger } from '../utils/logger';

export class ReceiptsController {
  private receiptService: ReceiptService;

  constructor() {
    this.receiptService = new ReceiptService();
  }

  processReceipt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      logger.info('API Callback: POST /receipts webhook triggered.');
      const validation = receiptSchema.safeParse(req.body);

      if (!validation.success) {
        logger.warn('Callback validation failed:', validation.error.format());
        res.status(400).json({
          success: false,
          errors: validation.error.flatten().fieldErrors,
        });
        return;
      }

      const result = await this.receiptService.processCallback(validation.data);

      res.status(200).json({
        success: result.processed,
        message: result.reason,
      });
    } catch (err) {
      logger.error('Error in ReceiptsController.processReceipt:', err);
      next(err);
    }
  };
}

export default new ReceiptsController();
