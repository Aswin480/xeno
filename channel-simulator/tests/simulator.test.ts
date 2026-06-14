import eventGeneratorService from '../src/services/eventGenerator.service';

describe('Channel Simulator Event Generation Tests', () => {
  test('should generate status flow with SENT as first step', () => {
    const flow = eventGeneratorService.generateStatusFlow('SMS', 0); // Force 0% failure
    expect(flow.length).toBeGreaterThanOrEqual(2);
    expect(flow[0].status).toBe('SENT');
    expect(flow[1].status).toBe('DELIVERED');
  });

  test('should generate FAILED status if failureRate is 100%', () => {
    const flow = eventGeneratorService.generateStatusFlow('SMS', 1.0); // Force 100% failure
    const statuses = flow.map(f => f.status);
    expect(statuses).toContain('FAILED');
    expect(statuses).not.toContain('READ');
  });

  test('should include READ step for successful flows (high probability)', () => {
    let hasRead = false;
    for (let i = 0; i < 20; i++) {
      const flow = eventGeneratorService.generateStatusFlow('SMS', 0);
      const statuses = flow.map(f => f.status);
      if (statuses.includes('READ')) {
        hasRead = true;
        break;
      }
    }
    expect(hasRead).toBe(true);
  });
});
