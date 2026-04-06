jest.mock('../models/FinancialRecord');
jest.mock('../utils/pagination');

import {
  createRecord,
  updateRecord,
  deleteRecord,
  getRecords
} from '../services/recordService';
import FinancialRecord from '../models/FinancialRecord';
import { ApiError } from '../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

const mockRecord = {
  _id: '507f1f77bcf86cd799439011',
  amount: 1000,
  type: 'income' as const,
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
      (FinancialRecord.create as jest.Mock).mockResolvedValue(mockRecord);

      const result = await createRecord({
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
      await expect(
        createRecord({
          amount: -100,
          type: 'income',
          category: 'Salary',
          date: '2026-01-01',
          createdBy: '507f1f77bcf86cd799439011'
        })
      ).rejects.toThrow('Amount must be greater than zero');
    });

    it('should throw error for invalid category', async () => {
      await expect(
        createRecord({
          amount: 1000,
          type: 'income',
          category: 'InvalidCategory',
          date: '2026-01-01',
          createdBy: '507f1f77bcf86cd799439011'
        })
      ).rejects.toThrow('Invalid category');
    });
  });

  describe('updateRecord', () => {
    it('should update a record successfully', async () => {
      const updatedRecord = { ...mockRecord, amount: 2000, save: jest.fn().mockResolvedValue(true) };
      (FinancialRecord.findOne as jest.Mock).mockResolvedValue(updatedRecord);

      const result = await updateRecord('507f1f77bcf86cd799439011', { amount: 2000 });

      expect(result.amount).toBe(2000);
    });

    it('should throw error if record not found', async () => {
      (FinancialRecord.findOne as jest.Mock).mockResolvedValue(null);

      await expect(updateRecord('invalid-id', { amount: 2000 })).rejects.toThrow(
        'Record not found'
      );
    });
  });

  describe('deleteRecord', () => {
    it('should soft delete a record', async () => {
      const deletedRecord = { ...mockRecord, isDeleted: true, save: jest.fn().mockResolvedValue(true) };
      (FinancialRecord.findOne as jest.Mock).mockResolvedValue(deletedRecord);

      const result = await deleteRecord('507f1f77bcf86cd799439011');

      expect(result.isDeleted).toBe(true);
    });
  });

  describe('getRecords', () => {
    it('should return paginated records', async () => {
      (FinancialRecord.find as jest.Mock).mockReturnValue({
        sort: () => ({
          skip: () => ({ limit: () => ({ populate: () => Promise.resolve([mockRecord]) }) })
        })
      });
      (FinancialRecord.countDocuments as jest.Mock).mockResolvedValue(1);

      const result = await getRecords({ page: '1', limit: '10' });

      expect(result.records).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
    });

    it('should filter by type', async () => {
      (FinancialRecord.find as jest.Mock).mockReturnValue({
        sort: () => ({
          skip: () => ({ limit: () => ({ populate: () => Promise.resolve([mockRecord]) }) })
        })
      });
      (FinancialRecord.countDocuments as jest.Mock).mockResolvedValue(1);

      await getRecords({ type: 'income' });

      expect(FinancialRecord.find).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'income' })
      );
    });
  });
});