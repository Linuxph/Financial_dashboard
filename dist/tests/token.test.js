"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = require("../utils/token");
describe('Token Utils', () => {
    const testPayload = { userId: '507f1f77bcf86cd799439011', role: 'admin' };
    describe('signToken', () => {
        it('should sign a valid token', () => {
            const token = (0, token_1.signToken)(testPayload);
            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
        });
    });
    describe('verifyToken', () => {
        it('should verify a valid token', () => {
            const token = (0, token_1.signToken)(testPayload);
            const decoded = (0, token_1.verifyToken)(token);
            expect(decoded.userId).toBe(testPayload.userId);
            expect(decoded.role).toBe(testPayload.role);
        });
        it('should throw error for invalid token', () => {
            expect(() => (0, token_1.verifyToken)('invalid_token')).toThrow();
        });
    });
});
