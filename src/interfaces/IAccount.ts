import { Document } from 'mongoose';

export interface IAccount extends Document {
    _id: string;
    account_id: number;
    limit: number;
    products: string[];
    _dateUpdated: Date;
}
