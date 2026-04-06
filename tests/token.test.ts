import { signToken, verifyToken } from '../utils/token';
import { appConfig } from '../config/app';

describe('Token Utils', () => {
  const testPayload = { userId: '507f1f77bcf86cd799439011', role: 'admin' };

  describe('signToken', () => {
    it('should sign a valid token', () => {
      const token = signToken(testPayload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const token = signToken(testPayload);
      const decoded = verifyToken(token);
      expect(decoded.userId).toBe(testPayload.userId);
      expect(decoded.role).toBe(testPayload.role);
    });

    it('should throw error for invalid token', () => {
      expect(() => verifyToken('invalid_token')).toThrow();
    });
  });
});