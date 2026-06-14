import { LaunchService } from '../src/services/launch.service';
import { prisma } from '../src/config/prisma';
import { ChannelClient } from '../src/integrations/channelClient';

// Mock dependencies
jest.mock('../src/config/prisma', () => ({
  prisma: {
    campaign: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    campaignRecipient: {
      createMany: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    customer: {
      findMany: jest.fn(),
    },
    channelEvent: {
      create: jest.fn(),
    }
  },
}));

describe('Launch Service Unit Tests', () => {
  let launchService: LaunchService;

  beforeEach(() => {
    launchService = new LaunchService();
    jest.clearAllMocks();
    jest.spyOn(ChannelClient.prototype, 'sendMessage').mockResolvedValue({
      success: true,
      eventId: 'mock-evt-123',
    });
  });

  test('should fail launching if campaign does not exist', async () => {
    (prisma.campaign.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(launchService.launchCampaign('invalid-id')).rejects.toThrow(
      'Campaign with ID invalid-id not found'
    );
  });

  test('should launch campaign and return target size', async () => {
    const mockCampaign = {
      id: 'camp-123',
      name: 'Launch Test',
      goal: 'Launch Goal',
      segmentDsl: JSON.stringify({ conditions: [] }),
      status: 'READY',
      channel: 'SMS',
      messageTemplate: 'Hello {name}!',
    };

    const mockCustomers = [
      { id: 'c-1', name: 'User One', email: 'u1@example.com', phone: '+1234' },
      { id: 'c-2', name: 'User Two', email: 'u2@example.com', phone: '+5678' }
    ];

    (prisma.campaign.findUnique as jest.Mock).mockResolvedValue(mockCampaign);
    (prisma.customer.findMany as jest.Mock).mockResolvedValue(mockCustomers);
    (prisma.campaignRecipient.createMany as jest.Mock).mockResolvedValue({ count: 2 });
    (prisma.campaignRecipient.findMany as jest.Mock).mockResolvedValue([
      { id: 'rec-1', campaignId: 'camp-123', customerId: 'c-1', status: 'PENDING' },
      { id: 'rec-2', campaignId: 'camp-123', customerId: 'c-2', status: 'PENDING' }
    ]);

    const result = await launchService.launchCampaign('camp-123');

    expect(result.success).toBe(true);
    expect(result.recipientsCount).toBe(2);

    // Verify campaign status was updated to LAUNCHING
    expect(prisma.campaign.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'camp-123' },
      data: { status: 'LAUNCHING' }
    }));
  });
});
