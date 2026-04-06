jest.mock('../models/User');
jest.mock('../models/FinancialRecord');
jest.mock('../utils/token');

import { registerUser, loginUser } from '../services/authService';
import User from '../models/User';
import { ApiError } from '../errors/ApiError';
import { signToken } from '../utils/token';
import { StatusCodes } from 'http-status-codes';

const mockUser = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashed_password',
  role: 'admin' as const,
  status: 'active' as const
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Auth Service', () => {
  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await registerUser({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        role: 'admin'
      });

      expect(result).toHaveProperty('id');
      expect(result.name).toBe('Test User');
      expect(result.email).toBe('test@example.com');
      expect(result.role).toBe('admin');
    });

    it('should throw error if email already exists', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        registerUser({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123!'
        })
      ).rejects.toThrow('Email already in use');
    });

    it('should default role to viewer if not provided', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue({ ...mockUser, role: 'viewer' });

      const result = await registerUser({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!'
      });

      expect(result.role).toBe('viewer');
    });
  });

  describe('loginUser', () => {
    it('should login successfully with valid credentials', async () => {
      (User.findOne as jest.Mock).mockReturnValue({
        select: () => Promise.resolve({ ...mockUser, password: 'hashed_password' })
      });
      (signToken as jest.Mock).mockReturnValue('mock_token');

      const result = await loginUser('test@example.com', 'Password123!');

      expect(result.token).toBe('mock_token');
      expect(result.user).toHaveProperty('id');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw error for non-existent user', async () => {
      (User.findOne as jest.Mock).mockReturnValue({
        select: () => Promise.resolve(null)
      });

      await expect(loginUser('nonexistent@example.com', 'password')).rejects.toThrow(
        'Invalid credentials'
      );
    });

    it('should throw error for inactive user', async () => {
      (User.findOne as jest.Mock).mockReturnValue({
        select: () => Promise.resolve({ ...mockUser, status: 'inactive', password: 'hashed_password' })
      });

      await expect(loginUser('test@example.com', 'password')).rejects.toThrow(
        'User account is inactive'
      );
    });

    it('should throw error for incorrect password', async () => {
      (User.findOne as jest.Mock).mockReturnValue({
        select: () => Promise.resolve({ ...mockUser, password: 'hashed_password' })
      });

      const bcrypt = require('bcrypt');
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await expect(loginUser('test@example.com', 'wrongpassword')).rejects.toThrow(
        'Invalid credentials'
      );
    });
  });
});