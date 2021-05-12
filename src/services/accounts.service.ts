import axios, { AxiosResponse } from 'axios';
import { IAccount } from '../interfaces/IAccount';
import { Account } from '../db/schema/account.schema';
import { connectToDatabase } from '../db/connection';

const getAccounts = async (query: any): Promise<IAccount[]> => {
    try {
        // establish db connection
        await connectToDatabase();

        // get customer data from api
        const results: AxiosResponse = await axios.request({
            url: `${process.env.BASE_URL}/transactions?$rawQuery=${query}`,
            method: 'GET',
            auth: {
                username: process.env.AUTH_USERNAME || '',
                password: process.env.AUTH_PASSWORD || '',
            },
        });
        const accounts: IAccount[] = results.data;

        await Promise.all(
            accounts.map(async (acc: IAccount) => {
                // upsert customer
                const query = { _id: acc._id };
                const update = {
                    $set: {
                        _id: acc._id,
                        account_id: acc.account_id,
                        limit: acc.limit,
                        products: acc.products,
                        _dateUpdated: new Date(),
                    },
                };
                const options = { upsert: true };

                await Account.updateOne(query, update, options);
            }),
        );

        return Promise.resolve(accounts);
    } catch (error) {
        return Promise.reject(error);
    }
};

export { getAccounts };
