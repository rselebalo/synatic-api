import express from 'express';
import { isEmpty } from 'lodash';
import { ERROR_MESSAGE } from '../constants';
import { getTransactions } from '../services/transactions.service';

export const transactions = async (
    req: express.Request,
    res: express.Response,
) => {
    try {
        const resp = await getTransactions(req);
        res.status(200).json(resp);
    } catch (error) {
        res.status(500).json(ERROR_MESSAGE);
    }
};
