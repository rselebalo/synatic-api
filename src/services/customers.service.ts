import axios, { AxiosResponse } from 'axios';
import { Request } from 'express';
import converter from 'json-2-csv';
import { Client } from 'ssh2';
import { ICustomer } from '../interfaces/ICustomer';
import { Customer } from '../db/schema/customer.schema';
import { connectToDatabase } from '../db/connection';
import { isEmpty } from 'lodash';
import { Account } from '../db/schema/account.schema';
import { IAccount } from '../interfaces/IAccount';
import { getTransactions } from './transactions.service';

const getCustomersAccountsInfo = async (req: Request): Promise<ICustomer[]> => {
    try {
        // establish db connection
        await connectToDatabase();

        const query = formattedQuery(req, 'emails', 'email');

        // get customer data from api
        const results: AxiosResponse = await axios.request({
            url: `${process.env.BASE_URL}/customers?${query}`,
            method: 'GET',
            auth: {
                username: process.env.AUTH_USERNAME || '',
                password: process.env.AUTH_PASSWORD || '',
            },
        });

        const customers: ICustomer[] = results.data;
        let finalResult: ICustomer[] = [];

        await Promise.all(
            customers.map(async (cust: ICustomer) => {
                const accountsQuery = formattedQuery(
                    { query: { account_id: cust.accounts.join(',') } },
                    'account_id',
                    'account_id',
                );

                // get related accounts information by account ids
                const acountsResults: AxiosResponse = await axios.request({
                    url: `${process.env.BASE_URL}/accounts?${accountsQuery}`,
                    method: 'GET',
                    auth: {
                        username: process.env.AUTH_USERNAME || '',
                        password: process.env.AUTH_PASSWORD || '',
                    },
                });

                // upsert accounts
                if (!isEmpty(acountsResults.data)) {
                    await Promise.all(
                        acountsResults.data.map(async (x: IAccount) => {
                            const updateAccount = {
                                _id: x._id,
                                account_id: x.account_id,
                                limit: x.limit,
                                products: x.products,
                                _dateUpdated: new Date(),
                            };

                            await Account.updateMany(
                                { _id: x._id },
                                updateAccount,
                                { upsert: true },
                            );
                        }),
                    );
                }
                // upsert customer
                const query = { _id: cust._id };
                const update = {
                    $set: {
                        _id: cust._id,
                        username: cust.username,
                        name: cust.name,
                        address: cust.address,
                        birthdate: cust.birthdate,
                        email: cust.email,
                        accounts: cust.accounts,
                        _dateUpdated: new Date(),
                    },
                };
                const options = { upsert: true };

                await Customer.updateOne(query, update, options);

                //update final result
                cust.accounts = acountsResults.data;
                finalResult.push(cust);
            }),
        );

        return Promise.resolve(finalResult);
    } catch (error) {
        return Promise.reject(error);
    }
};

const getAllCustomersRelatedInfo = async (
    req: Request,
): Promise<ICustomer[]> => {
    try {
        let finalResult: ICustomer[] = [];
        const customers = await getCustomersAccountsInfo(req);

        await Promise.all(
            customers.map(async (customer: ICustomer) => {
                customer.accounts.map(async (x: any) => {
                    //get account transactions
                    const transactions = await getTransactions({
                        query: { account_id: x.account_id },
                    });

                    // update result
                    customer.account_details = transactions;
                    finalResult.push(customer);
                });
            }),
        );

        if (!isEmpty(finalResult)) await saveAsCSV(finalResult);

        return Promise.resolve(finalResult);
    } catch (error) {
        return Promise.reject(error);
    }
};

const saveAsCSV = async (data: ICustomer[]) => {
    try {
        const csv = await converter.json2csvAsync(data);

        //write to ftp server
        const settings = {
            host: process.env.SFTP_HOST,
            port: 22,
            username: process.env.SFTP_USERNAME || '',
            password: process.env.SFTP_PASSWORD || '',
        };

        const conn = new Client();

        conn.on('ready', () => {
            conn.sftp((err, sftp) => {
                if (err) throw err;

                sftp.writeFile('customer.csv', csv, (err) => {
                    if (err) throw err;
                    console.log('Success!! file saved');
                    return Promise.resolve('success');
                });
            });
        }).connect(settings);
    } catch (error) {
        return Promise.reject(error);
    }
};

const formattedQuery = (req: any, field: string, filterName: string) => {
    let fieldValues: any = req.query[field];
    let query = '$filter=';
    console.log({ fieldValues });

    if (!isEmpty(fieldValues)) {
        //@ts-ignore
        fieldValues = fieldValues.split(',');

        fieldValues.map((x: string, index: number) => {
            query +=
                filterName === 'email'
                    ? `${filterName} eq '${x}'` //wrap email in '' to escape the @ character
                    : `${filterName} eq ${x}`;
            if (index < fieldValues.length - 1) query += ' or ';
        });
    }
    return query.trim();
};

export { getCustomersAccountsInfo, getAllCustomersRelatedInfo, saveAsCSV };
