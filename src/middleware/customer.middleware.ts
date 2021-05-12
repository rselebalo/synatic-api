import express from 'express';
import { isEmpty } from 'lodash';

export const validateEmailParams = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    if (!isEmpty(req.query) || isEmpty(req.query.email)) {
        next();
    } else {
        res.status(400).json({
            statusCode: 400,
            url: '/api/customers',
            method: 'GET',
            errorMessage: 'Invalid Query Parameters',
            message: 'Error parsing query parameters',
        });
    }
};
