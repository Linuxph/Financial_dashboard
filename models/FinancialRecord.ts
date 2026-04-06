import mongoose, { Document, Schema } from 'mongoose';
import { financeConfig } from '../config/finance';

export type RecordType = 'income' | 'expense';

export interface IFinancialRecord extends Document {
  amount: number;
  type: RecordType;
  category: string;
  date: Date;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const financialRecordSchema = new Schema<IFinancialRecord>(
  {
    amount: { type: Number, required: true, min: financeConfig.minAmount },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true, enum: financeConfig.categories, trim: true },
    date: { type: Date, required: true },
    notes: { type: String, trim: true, maxlength: 500 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const FinancialRecord = mongoose.model<IFinancialRecord>('FinancialRecord', financialRecordSchema);

export default FinancialRecord;
