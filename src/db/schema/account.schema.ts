import { model, Schema, Model } from 'mongoose';
import { IAccount } from '../../interfaces/IAccount';

const AccountSchema: Schema = new Schema({
    account_id: { type: String, required: true },
    limit: { type: Number, required: true },
    products: { type: [String], required: true },
    _dateUpdated: { type: Date, required: false },
});

export const Account: Model<IAccount> = model('Account', AccountSchema);
