import axios from 'axios';
import { config } from '../config/env';
import { logger } from '../utils/logger';

export interface ChannelSendRequest {
  recipientId: string;
  channel: 'SMS' | 'EMAIL' | 'WHATSAPP';
  destination: string;
  message: string;
  callbackUrl: string;
}

export interface ChannelSendResponse {
  success: boolean;
  eventId?: string;
  errorMessage?: string;
}

export class ChannelClient {
  private simulatorUrl: string;

  constructor() {
    this.simulatorUrl = config.simulatorUrl;
  }

  async sendMessage(request: ChannelSendRequest): Promise<ChannelSendResponse> {
    try {
      const response = await axios.post(`${this.simulatorUrl}/send`, request, {
        timeout: 5000, // 5 seconds timeout
      });

      if (response.status === 200 && response.data.success) {
        return {
          success: true,
          eventId: response.data.eventId,
        };
      }

      return {
        success: false,
        errorMessage: response.data.error || 'Simulator returned unsuccessful status',
      };
    } catch (err: unknown) {
      let errorMsg = 'Failed to connect to channel simulator';
      if (err instanceof Error) {
        errorMsg = err.message;
      }
      logger.error(`Channel simulator send request failed for recipient ${request.recipientId}:`, errorMsg);
      return {
        success: false,
        errorMessage: errorMsg,
      };
    }
  }
}
