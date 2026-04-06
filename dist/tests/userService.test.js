"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock('../models/User');
jest.mock('../models/FinancialRecord');
const userService_1 = require("../services/userService");
const User_1 = __importDefault(require("../models/User"));
const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Test User',
    email: 'test@example.com',
    role: 'admin',
    status: 'active',
    save: jest.fn()
};
beforeEach(() => {
    jest.clearAllMocks();
});
describe('User Service', () => {
    describe('getUsers', () => {
        it('should return all users without passwords', async () => {
            const mockUsers = [
                { ...mockUser, select: () => mockUser },
                { ...mockUser, _id: '507f1f77bcf86cd799439012', email: 'user2@example.com', select: () => mockUser }
            ];
            User_1.default.find.mockReturnValue({
                select: () => Promise.resolve([mockUser, mockUser]),
                sort: () => Promise.resolve([mockUser, mockUser])
            });
            const result = await (0, userService_1.getUsers)();
            expect(User_1.default.find).toHaveBeenCalled();
            expect(result).toHaveLength(2);
        });
    });
    describe('deactivateUser', () => {
        it('should deactivate a user successfully', async () => {
            User_1.default.findById.mockResolvedValue({ ...mockUser, save: jest.fn().mockResolvedValue(true) });
            const result = await (0, userService_1.deactivateUser)('507f1f77bcf86cd799439011');
            expect(result.status).toBe('inactive');
        });
        it('should throw error if user not found', async () => {
            User_1.default.findById.mockResolvedValue(null);
            await expect((0, userService_1.deactivateUser)('invalid-id')).rejects.toThrow('User not found');
        });
    });
});
