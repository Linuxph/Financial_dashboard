import FinancialRecord from '../models/FinancialRecord';

export const getDashboardSummary = async () => {
  const baseMatch = { isDeleted: false };

  const [totals] = await FinancialRecord.aggregate([
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

  const categoryBreakdown = await FinancialRecord.aggregate([
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

  const monthlySummary = await FinancialRecord.aggregate([
    { $match: baseMatch },
    {
      $group: {
        _id: { year: { $year: '$date' }, month: { $month: '$date' }, type: '$type' },
        total: { $sum: '$amount' }
      }
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } }
  ]);

  const lastTransactions = await FinancialRecord.find(baseMatch)
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
