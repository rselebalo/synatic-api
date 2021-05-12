import { model, Schema, Model, Types } from 'mongoose';
import { ICustomer } from '../../interfaces/ICustomer';
import { IAccount } from '../../interfaces/IAccount';

const CustomerSchema: Schema = new Schema({
    username: { type: String, required: true },
    name: { type: String, required: true },
    active: { type: Boolean, required: true, default: true },
    address: { type: String, required: true },
    birthdate: { type: Date, required: true },
    email: { type: String, required: true },
    accounts: { type: [Number], ref: 'Account', required: true },
    account_details: { type: Array<any>(), required: false },
    _dateUpdated: { type: Date, required: false },
});

export const Customer: Model<ICustomer> = model('Customer', CustomerSchema);
