import express from 'express';
import { ERROR_MESSAGE } from '../constants';
import { getAccounts } from '../services/accounts.service';

export const allAccounts = async (
    req: express.Request,
    res: express.Response,
) => {
    try {
        const resp = await getAccounts('');
        res.status(200).json(resp);
    } catch (error) {
        res.status(500).json(ERROR_MESSAGE);
    }
};

export const accountsByCustomer = async (
    req: express.Request,
    res: express.Response,
) => {
    try {
        //@ts-ignore
        const customer_id = JSON.parse(req.query.customer_id);
        const query = `{\"customer_id\": \"${customer_id}\"}`;

        const resp = await getAccounts(query);
        res.status(200).json(resp);
    } catch (error) {
        res.status(500).json(ERROR_MESSAGE);
    }
};
