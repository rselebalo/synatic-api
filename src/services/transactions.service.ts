import axios, { AxiosResponse } from 'axios';
import { Request } from 'express';
import { ITransaction } from '../interfaces/ITransaction';
import { connectToDatabase } from '../db/connection';
import { Transaction } from '../db/schema/transaction.schema';
import { isEmpty } from 'lodash';

const getTransactions = async (req: any): Promise<ITransaction[]> => {
    try {
        // establish db connection
        await connectToDatabase();
        const query = formattedQuery(req);

        // get transactions data from api
        const results: AxiosResponse = await axios.request({
            url: `${process.env.BASE_URL}/transactions?${query}`,
            method: 'GET',
            auth: {
                username: process.env.AUTH_USERNAME || '',
                password: process.env.AUTH_PASSWORD || '',
            },
        });
        const transactions: ITransaction[] = results.data;

        await Promise.all(
            transactions.map(async (trans: ITransaction) => {
                // upsert transactions
                const query = { _id: trans._id };
                const update = {
                    $set: {
                        _id: trans._id,
                        account_id: trans.account_id,
                        transaction_count: trans.transaction_count,
                        bucket_start_date: trans.bucket_start_date,
                        bucket_end_date: trans.bucket_end_date,
                        transactions: trans.transactions,
                        _dateUpdated: new Date(),
                    },
                };
                const options = { upsert: true };

                await Transaction.updateOne(query, update, options);
            }),
        );

        return Promise.resolve(transactions);
    } catch (error) {
        return Promise.reject(error);
    }
};

const formattedQuery = (req: any): string => {
    let account_id = req.query.account_id;
    let query = '';

    if (!isEmpty(account_id)) {
        //@ts-ignore
        account_id = JSON.parse(account_id);

        query = `$filter=account_id eq ${Number(account_id)}`;
    }

    return query;
};
export { getTransactions };
