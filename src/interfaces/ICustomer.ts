import { Document } from 'mongoose';

export interface ICustomer extends Document {
    _id: string;
    username: string;
    active: boolean;
    name: string;
    address: string;
    birthdate: Date;
    email: string;
    accounts: number[];
    account_details?: any[];
    _dateUpdated: Date;
}
