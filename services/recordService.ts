import { Types } from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import FinancialRecord, { IFinancialRecord, RecordType } from '../models/FinancialRecord';
import { ApiError } from '../errors/ApiError';
import { parsePagination } from '../utils/pagination';
import { financeConfig } from '../config/finance';

interface RecordFilters {
  type?: RecordType;
  category?: string;
  startDate?: string;
  endDate?: string;
  page?: string;
  limit?: string;
}

const assertValidAmount = (amount: number) => {
  if (amount <= 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Amount must be greater than zero');
  }
};

const assertValidCategory = (category: string) => {
  if (!financeConfig.categories.includes(category)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid category');
  }
};

export const createRecord = async (payload: {
  amount: number;
  type: RecordType;
  category: string;
  date: string;
  notes?: string;
  createdBy: string;
}) => {
  assertValidAmount(payload.amount);
  assertValidCategory(payload.category);

  const record = await FinancialRecord.create({
    amount: payload.amount,
    type: payload.type,
    category: payload.category,
    date: new Date(payload.date),
    notes: payload.notes,
    createdBy: new Types.ObjectId(payload.createdBy)
  });

  return record;
};

export const updateRecord = async (recordId: string, payload: Partial<IFinancialRecord>) => {
  const record = await FinancialRecord.findOne({ _id: recordId, isDeleted: false });
  if (!record) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Record not found');
  }

  if (payload.amount !== undefined) {
    assertValidAmount(payload.amount);
    record.amount = payload.amount;
  }
  if (payload.type !== undefined) record.type = payload.type;
  if (payload.category !== undefined) {
    assertValidCategory(payload.category);
    record.category = payload.category;
  }
  if (payload.date !== undefined) {
    const parsedDate = new Date(payload.date);
    if (Number.isNaN(parsedDate.getTime())) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid date format');
    }
    record.date = parsedDate;
  }
  if (payload.notes !== undefined) record.notes = payload.notes;

  await record.save();
  return record;
};

export const deleteRecord = async (recordId: string) => {
  const record = await FinancialRecord.findOne({ _id: recordId, isDeleted: false });
  if (!record) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Record not found');
  }

  record.isDeleted = true;
  await record.save();

  return record;
};

export const getRecords = async (filters: RecordFilters) => {
  const query: Record<string, any> = { isDeleted: false };

  if (filters.type) {
    query.type = filters.type;
  }

  if (filters.category) {
    query.category = new RegExp(`^${filters.category}$`, 'i');
  }

  if (filters.startDate || filters.endDate) {
    query.date = {};
    if (filters.startDate) {
      query.date.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      query.date.$lte = new Date(filters.endDate);
    }
  }

  const { pageNumber, limitNumber, skip } = parsePagination(filters.page, filters.limit);

  const [records, total] = await Promise.all([
    FinancialRecord.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNumber)
      .populate('createdBy', 'name email role')
      .lean(),
    FinancialRecord.countDocuments(query)
  ]);

  return {
    records,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total
    }
  };
};
