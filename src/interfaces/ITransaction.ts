import { Document } from 'mongoose';

export interface ITransaction extends Document {
    _id: string;
    account_id: number;
    transaction_count: number;
    bucket_start_date: Date;
    bucket_end_date: Date;
    transactions: {
        date: Date;
        amount: number;
        transaction_code: string;
        symbol: string;
        price: number;
        total: number;
    }[];
    _dateUpdated: Date;
}
