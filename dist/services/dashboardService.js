"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardSummary = void 0;
const FinancialRecord_1 = __importDefault(require("../models/FinancialRecord"));
const getDashboardSummary = async () => {
    const baseMatch = { isDeleted: false };
    const [totals] = await FinancialRecord_1.default.aggregate([
        { $match: baseMatch },
        {
            $group: {
                _id: null,
                totalIncome: {
                    $sum: {
                        $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0]
                    }
                },
                totalExpense: {
                    $sum: {
                        $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0]
                    }
                }
            }
        }
    ]);
    const categoryBreakdown = await FinancialRecord_1.default.aggregate([
        { $match: baseMatch },
        {
            $group: {
                _id: { type: '$type', category: '$category' },
                total: { $sum: '$amount' },
                count: { $sum: 1 }
            }
        },
        { $sort: { total: -1 } }
    ]);
    const monthlySummary = await FinancialRecord_1.default.aggregate([
        { $match: baseMatch },
        {
            $group: {
                _id: { year: { $year: '$date' }, month: { $month: '$date' }, type: '$type' },
                total: { $sum: '$amount' }
            }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);
    const lastTransactions = await FinancialRecord_1.default.find(baseMatch)
        .sort({ date: -1 })
        .limit(5)
        .populate('createdBy', 'name email role')
        .lean();
    const totalIncome = totals?.totalIncome || 0;
    const totalExpense = totals?.totalExpense || 0;
    return {
        totalIncome,
        totalExpense,
        netBalance: totalIncome - totalExpense,
        categoryBreakdown,
        monthlySummary,
        lastTransactions
    };
};
exports.getDashboardSummary = getDashboardSummary;
