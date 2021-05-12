import express from 'express';
import controllers from '../controllers';
import { validateEmailParams } from '../middleware/customer.middleware';

const router = express.Router();

//customers
router.get('/customers', validateEmailParams, controllers.customers);
router.get(
    '/enriched_customers',
    validateEmailParams,
    controllers.enrished_customer,
);

//accounts
router.get('/accounts', controllers.allAccounts);
router.get('/accounts/:customer_id', controllers.accountsByCustomer);

//transactions
router.get('/transactions', controllers.transactions);

export default router;
