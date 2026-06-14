import { canTransition } from '../src/utils/statusPrecedence';

describe('Status Precedence Rules', () => {
  test('should allow transition from PENDING to SENT', () => {
    expect(canTransition('PENDING', 'SENT')).toBe(true);
  });

  test('should allow transition from SENT to DELIVERED', () => {
    expect(canTransition('SENT', 'DELIVERED')).toBe(true);
  });

  test('should allow transition from DELIVERED to READ', () => {
    expect(canTransition('DELIVERED', 'READ')).toBe(true);
  });

  test('should block transition from DELIVERED back to SENT', () => {
    expect(canTransition('DELIVERED', 'SENT')).toBe(false);
  });

  test('should block transition from READ back to DELIVERED', () => {
    expect(canTransition('READ', 'DELIVERED')).toBe(false);
  });

  test('should block transition from FAILED back to PENDING', () => {
    expect(canTransition('FAILED', 'PENDING')).toBe(false);
  });

  test('should allow transition from PENDING to FAILED', () => {
    expect(canTransition('PENDING', 'FAILED')).toBe(true);
  });

  test('should allow transition from SENT to FAILED', () => {
    expect(canTransition('SENT', 'FAILED')).toBe(true);
  });
});
