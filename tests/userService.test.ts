jest.mock('../models/User');
jest.mock('../models/FinancialRecord');

import { getUsers, deactivateUser } from '../services/userService';
import User from '../models/User';
import { ApiError } from '../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

const mockUser = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Test User',
  email: 'test@example.com',
  role: 'admin' as const,
  status: 'active' as const,
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
      
      (User.find as jest.Mock).mockReturnValue({
        select: () => Promise.resolve([mockUser, mockUser]),
        sort: () => Promise.resolve([mockUser, mockUser])
      });

      const result = await getUsers();

      expect(User.find).toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });
  });

  describe('deactivateUser', () => {
    it('should deactivate a user successfully', async () => {
      (User.findById as jest.Mock).mockResolvedValue({ ...mockUser, save: jest.fn().mockResolvedValue(true) });

      const result = await deactivateUser('507f1f77bcf86cd799439011');

      expect(result.status).toBe('inactive');
    });

    it('should throw error if user not found', async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      await expect(deactivateUser('invalid-id')).rejects.toThrow('User not found');
    });
  });
});