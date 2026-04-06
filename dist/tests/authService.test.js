"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock('../models/User');
jest.mock('../models/FinancialRecord');
jest.mock('../utils/token');
const authService_1 = require("../services/authService");
const User_1 = __importDefault(require("../models/User"));
const token_1 = require("../utils/token");
const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashed_password',
    role: 'admin',
    status: 'active'
};
beforeEach(() => {
    jest.clearAllMocks();
});
describe('Auth Service', () => {
    describe('registerUser', () => {
        it('should register a new user successfully', async () => {
            User_1.default.findOne.mockResolvedValue(null);
            User_1.default.create.mockResolvedValue(mockUser);
            const result = await (0, authService_1.registerUser)({
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
            User_1.default.findOne.mockResolvedValue(mockUser);
            await expect((0, authService_1.registerUser)({
                name: 'Test User',
                email: 'test@example.com',
                password: 'Password123!'
            })).rejects.toThrow('Email already in use');
        });
        it('should default role to viewer if not provided', async () => {
            User_1.default.findOne.mockResolvedValue(null);
            User_1.default.create.mockResolvedValue({ ...mockUser, role: 'viewer' });
            const result = await (0, authService_1.registerUser)({
                name: 'Test User',
                email: 'test@example.com',
                password: 'Password123!'
            });
            expect(result.role).toBe('viewer');
        });
    });
    describe('loginUser', () => {
        it('should login successfully with valid credentials', async () => {
            User_1.default.findOne.mockReturnValue({
                select: () => Promise.resolve({ ...mockUser, password: 'hashed_password' })
            });
            token_1.signToken.mockReturnValue('mock_token');
            const result = await (0, authService_1.loginUser)('test@example.com', 'Password123!');
            expect(result.token).toBe('mock_token');
            expect(result.user).toHaveProperty('id');
            expect(result.user.email).toBe('test@example.com');
        });
        it('should throw error for non-existent user', async () => {
            User_1.default.findOne.mockReturnValue({
                select: () => Promise.resolve(null)
            });
            await expect((0, authService_1.loginUser)('nonexistent@example.com', 'password')).rejects.toThrow('Invalid credentials');
        });
        it('should throw error for inactive user', async () => {
            User_1.default.findOne.mockReturnValue({
                select: () => Promise.resolve({ ...mockUser, status: 'inactive', password: 'hashed_password' })
            });
            await expect((0, authService_1.loginUser)('test@example.com', 'password')).rejects.toThrow('User account is inactive');
        });
        it('should throw error for incorrect password', async () => {
            User_1.default.findOne.mockReturnValue({
                select: () => Promise.resolve({ ...mockUser, password: 'hashed_password' })
            });
            const bcrypt = require('bcrypt');
            bcrypt.compare = jest.fn().mockResolvedValue(false);
            await expect((0, authService_1.loginUser)('test@example.com', 'wrongpassword')).rejects.toThrow('Invalid credentials');
        });
    });
});
