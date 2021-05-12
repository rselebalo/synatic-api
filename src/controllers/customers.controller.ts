import { Request, Response } from 'express';
import { ERROR_MESSAGE } from '../constants';
import {
    getCustomersAccountsInfo,
    getAllCustomersRelatedInfo,
} from '../services/customers.service';

export const customers = async (req: Request, res: Response) => {
    try {
        const resp = await getCustomersAccountsInfo(req);
        res.status(200).json(resp);
    } catch (error) {
        res.status(500).json(ERROR_MESSAGE);
    }
};

export const enrished_customer = async (req: Request, res: Response) => {
    try {
        const resp = await getAllCustomersRelatedInfo(req);
        res.status(200).json(resp);
    } catch (error) {
        res.status(500).json(ERROR_MESSAGE);
    }
};
