import { model, Schema, Model, Types } from 'mongoose';
import { ITransaction } from '../../interfaces/ITransaction';

const TransactionSchema: Schema = new Schema({
    account_id: { type: Number, ref: 'Account', required: true },
    transaction_count: { type: String, required: true },
    bucket_start_date: { type: Date, required: true },
    bucket_end_date: { type: Date, required: true },
    transactions: {
        type: [
            {
                date: { type: Date, required: true },
                amount: { type: Number, required: true },
                transaction_code: { type: String, required: true },
                symbol: { type: String, required: true },
                price: { type: Number, required: true },
                total: { type: Number, required: true },
            },
        ],
        required: true,
    },
    _dateUpdated: { type: Date, required: false },
});

export const Transaction: Model<ITransaction> = model(
    'Transaction',
    TransactionSchema,
);
