import { AnalyticsService } from '../src/services/analytics.service';
import { prisma } from '../src/config/prisma';

// Mock the prisma client
jest.mock('../src/config/prisma', () => ({
  prisma: {
    campaign: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

describe('Analytics Service Unit Tests', () => {
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    analyticsService = new AnalyticsService();
    jest.clearAllMocks();
  });

  test('should calculate correct metrics rates for a campaign', async () => {
    const mockCampaignDbResponse = {
      id: 'camp-123',
      name: 'Test Campaign',
      goal: 'Test Goal',
      channel: 'EMAIL',
      status: 'COMPLETED',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      recipients: [
        {
          id: 'rec-1',
          status: 'READ',
          customer: {
            orders: [
              { amount: 150.00, status: 'COMPLETED', createdAt: new Date() } // Placed after campaign
            ]
          }
        },
        {
          id: 'rec-2',
          status: 'DELIVERED',
          customer: {
            orders: [
              { amount: 50.00, status: 'COMPLETED', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) } // Placed before campaign
            ]
          }
        },
        {
          id: 'rec-3',
          status: 'SENT',
          customer: {
            orders: []
          }
        },
        {
          id: 'rec-4',
          status: 'FAILED',
          customer: {
            orders: []
          }
        }
      ]
    };

    (prisma.campaign.findUnique as jest.Mock).mockResolvedValue(mockCampaignDbResponse);

    const stats = await analyticsService.getCampaignStats('camp-123');

    expect(stats).not.toBeNull();
    if (stats) {
      expect(stats.metrics.total).toBe(4);
      expect(stats.metrics.sent).toBe(3); // READ, DELIVERED, SENT are sent
      expect(stats.metrics.delivered).toBe(2); // READ, DELIVERED are delivered
      expect(stats.metrics.read).toBe(1); // READ is read
      expect(stats.metrics.failed).toBe(1);

      // delivery rate = (delivered / sent) * 100 = (2 / 3) * 100 = 67%
      expect(stats.metrics.deliveryRate).toBe(67);
      // read rate = (read / delivered) * 100 = (1 / 2) * 100 = 50%
      expect(stats.metrics.readRate).toBe(50);

      // Revenue recovered attribution: only rec-1 order was placed AFTER campaign launched.
      // rec-2 order was 5 days ago (before campaign).
      expect(stats.metrics.revenueRecovered).toBe(150);
    }
  });

  test('should return null if campaign not found', async () => {
    (prisma.campaign.findUnique as jest.Mock).mockResolvedValue(null);
    const stats = await analyticsService.getCampaignStats('invalid-id');
    expect(stats).toBeNull();
  });
});
