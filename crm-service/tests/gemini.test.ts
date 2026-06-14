import axios from 'axios';
import { GeminiService } from '../src/services/gemini.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GeminiService API Key Rotation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fall back to local template if no API keys are provided', async () => {
    // Temporarily clear env keys
    process.env.GEMINI_API_KEY_PRIMARY = '';
    process.env.GEMINI_API_KEY_SECONDARY = '';
    process.env.GEMINI_API_KEY = '';

    const geminiService = new GeminiService();
    const voiceSummary = await geminiService.generateVoiceSummary({
      goal: 'Win back dormant customers',
      segment: 'Dormant',
      channel: 'WHATSAPP',
      template: 'Hi {name}',
      strength: 'strong',
      reasons: ['Reason A', 'Reason B'],
    });

    expect(voiceSummary).toContain("generated a strong-strength campaign targeting your Dormant segment");
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it('should attempt the primary key first, and return success if it works', async () => {
    process.env.GEMINI_API_KEY_PRIMARY = 'AIzaSy-primary-key-123';
    process.env.GEMINI_API_KEY_SECONDARY = 'AIzaSy-secondary-key-456';

    const mockResponse = {
      data: {
        candidates: [
          {
            content: {
              parts: [{ text: 'Conversational response from primary key!' }],
            },
          },
        ],
      },
    };

    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    const geminiService = new GeminiService();
    const voiceSummary = await geminiService.generateVoiceSummary({
      goal: 'Win back dormant customers',
      segment: 'Dormant',
      channel: 'WHATSAPP',
      template: 'Hi {name}',
      strength: 'strong',
      reasons: ['Reason A', 'Reason B'],
    });

    expect(voiceSummary).toBe('Conversational response from primary key!');
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('key=AIzaSy-primary-key-123'),
      expect.any(Object),
      expect.any(Object)
    );
  });

  it('should fail over to the secondary key if the primary key throws an error', async () => {
    process.env.GEMINI_API_KEY_PRIMARY = 'AIzaSy-primary-key-123';
    process.env.GEMINI_API_KEY_SECONDARY = 'AIzaSy-secondary-key-456';

    const primaryError = {
      response: {
        status: 429,
        statusText: 'Too Many Requests',
        data: { error: { message: 'Resource exhausted' } },
      },
    };

    const secondarySuccessResponse = {
      data: {
        candidates: [
          {
            content: {
              parts: [{ text: 'Conversational response from secondary failover key!' }],
            },
          },
        ],
      },
    };

    // First call rejects, second call resolves
    mockedAxios.post.mockRejectedValueOnce(primaryError);
    mockedAxios.post.mockResolvedValueOnce(secondarySuccessResponse);

    const geminiService = new GeminiService();
    const voiceSummary = await geminiService.generateVoiceSummary({
      goal: 'Win back dormant customers',
      segment: 'Dormant',
      channel: 'WHATSAPP',
      template: 'Hi {name}',
      strength: 'strong',
      reasons: ['Reason A', 'Reason B'],
    });

    expect(voiceSummary).toBe('Conversational response from secondary failover key!');
    expect(mockedAxios.post).toHaveBeenCalledTimes(2);

    // Assert first call used primary key
    expect(mockedAxios.post).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('key=AIzaSy-primary-key-123'),
      expect.any(Object),
      expect.any(Object)
    );

    // Assert second call used secondary key
    expect(mockedAxios.post).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('key=AIzaSy-secondary-key-456'),
      expect.any(Object),
      expect.any(Object)
    );
  });
});
