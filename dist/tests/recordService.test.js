"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock('../models/FinancialRecord');
jest.mock('../utils/pagination');
const recordService_1 = require("../services/recordService");
const FinancialRecord_1 = __importDefault(require("../models/FinancialRecord"));
const mockRecord = {
    _id: '507f1f77bcf86cd799439011',
    amount: 1000,
    type: 'income',
    category: 'Salary',
    date: new Date('2026-01-01'),
    notes: 'Test note',
    createdBy: '507f1f77bcf86cd799439011',
    isDeleted: false,
    save: jest.fn().mockResolvedValue(true)
};
beforeEach(() => {
    jest.clearAllMocks();
});
describe('Record Service', () => {
    describe('createRecord', () => {
        it('should create a record successfully', async () => {
            FinancialRecord_1.default.create.mockResolvedValue(mockRecord);
            const result = await (0, recordService_1.createRecord)({
                amount: 1000,
                type: 'income',
                category: 'Salary',
                date: '2026-01-01',
                notes: 'Test note',
                createdBy: '507f1f77bcf86cd799439011'
            });
            expect(result.amount).toBe(1000);
            expect(result.category).toBe('Salary');
        });
        it('should throw error for invalid amount', async () => {
            await expect((0, recordService_1.createRecord)({
                amount: -100,
                type: 'income',
                category: 'Salary',
                date: '2026-01-01',
                createdBy: '507f1f77bcf86cd799439011'
            })).rejects.toThrow('Amount must be greater than zero');
        });
        it('should throw error for invalid category', async () => {
            await expect((0, recordService_1.createRecord)({
                amount: 1000,
                type: 'income',
                category: 'InvalidCategory',
                date: '2026-01-01',
                createdBy: '507f1f77bcf86cd799439011'
            })).rejects.toThrow('Invalid category');
        });
    });
    describe('updateRecord', () => {
        it('should update a record successfully', async () => {
            const updatedRecord = { ...mockRecord, amount: 2000, save: jest.fn().mockResolvedValue(true) };
            FinancialRecord_1.default.findOne.mockResolvedValue(updatedRecord);
            const result = await (0, recordService_1.updateRecord)('507f1f77bcf86cd799439011', { amount: 2000 });
            expect(result.amount).toBe(2000);
        });
        it('should throw error if record not found', async () => {
            FinancialRecord_1.default.findOne.mockResolvedValue(null);
            await expect((0, recordService_1.updateRecord)('invalid-id', { amount: 2000 })).rejects.toThrow('Record not found');
        });
    });
    describe('deleteRecord', () => {
        it('should soft delete a record', async () => {
            const deletedRecord = { ...mockRecord, isDeleted: true, save: jest.fn().mockResolvedValue(true) };
            FinancialRecord_1.default.findOne.mockResolvedValue(deletedRecord);
            const result = await (0, recordService_1.deleteRecord)('507f1f77bcf86cd799439011');
            expect(result.isDeleted).toBe(true);
        });
    });
    describe('getRecords', () => {
        it('should return paginated records', async () => {
            FinancialRecord_1.default.find.mockReturnValue({
                sort: () => ({
                    skip: () => ({ limit: () => ({ populate: () => Promise.resolve([mockRecord]) }) })
                })
            });
            FinancialRecord_1.default.countDocuments.mockResolvedValue(1);
            const result = await (0, recordService_1.getRecords)({ page: '1', limit: '10' });
            expect(result.records).toHaveLength(1);
            expect(result.pagination.total).toBe(1);
        });
        it('should filter by type', async () => {
            FinancialRecord_1.default.find.mockReturnValue({
                sort: () => ({
                    skip: () => ({ limit: () => ({ populate: () => Promise.resolve([mockRecord]) }) })
                })
            });
            FinancialRecord_1.default.countDocuments.mockResolvedValue(1);
            await (0, recordService_1.getRecords)({ type: 'income' });
            expect(FinancialRecord_1.default.find).toHaveBeenCalledWith(expect.objectContaining({ type: 'income' }));
        });
    });
});
