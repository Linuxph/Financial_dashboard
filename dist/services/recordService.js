"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecords = exports.deleteRecord = exports.updateRecord = exports.createRecord = void 0;
const mongoose_1 = require("mongoose");
const http_status_codes_1 = require("http-status-codes");
const FinancialRecord_1 = __importDefault(require("../models/FinancialRecord"));
const ApiError_1 = require("../errors/ApiError");
const pagination_1 = require("../utils/pagination");
const finance_1 = require("../config/finance");
const assertValidAmount = (amount) => {
    if (amount <= 0) {
        throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Amount must be greater than zero');
    }
};
const assertValidCategory = (category) => {
    if (!finance_1.financeConfig.categories.includes(category)) {
        throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid category');
    }
};
const createRecord = async (payload) => {
    assertValidAmount(payload.amount);
    assertValidCategory(payload.category);
    const record = await FinancialRecord_1.default.create({
        amount: payload.amount,
        type: payload.type,
        category: payload.category,
        date: new Date(payload.date),
        notes: payload.notes,
        createdBy: new mongoose_1.Types.ObjectId(payload.createdBy)
    });
    return record;
};
exports.createRecord = createRecord;
const updateRecord = async (recordId, payload) => {
    const record = await FinancialRecord_1.default.findOne({ _id: recordId, isDeleted: false });
    if (!record) {
        throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Record not found');
    }
    if (payload.amount !== undefined) {
        assertValidAmount(payload.amount);
        record.amount = payload.amount;
    }
    if (payload.type !== undefined)
        record.type = payload.type;
    if (payload.category !== undefined) {
        assertValidCategory(payload.category);
        record.category = payload.category;
    }
    if (payload.date !== undefined) {
        const parsedDate = new Date(payload.date);
        if (Number.isNaN(parsedDate.getTime())) {
            throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Invalid date format');
        }
        record.date = parsedDate;
    }
    if (payload.notes !== undefined)
        record.notes = payload.notes;
    await record.save();
    return record;
};
exports.updateRecord = updateRecord;
const deleteRecord = async (recordId) => {
    const record = await FinancialRecord_1.default.findOne({ _id: recordId, isDeleted: false });
    if (!record) {
        throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.NOT_FOUND, 'Record not found');
    }
    record.isDeleted = true;
    await record.save();
    return record;
};
exports.deleteRecord = deleteRecord;
const getRecords = async (filters) => {
    const query = { isDeleted: false };
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
    const { pageNumber, limitNumber, skip } = (0, pagination_1.parsePagination)(filters.page, filters.limit);
    const [records, total] = await Promise.all([
        FinancialRecord_1.default.find(query)
            .sort({ date: -1 })
            .skip(skip)
            .limit(limitNumber)
            .populate('createdBy', 'name email role')
            .lean(),
        FinancialRecord_1.default.countDocuments(query)
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
exports.getRecords = getRecords;
