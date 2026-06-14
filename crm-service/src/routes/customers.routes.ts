import { Router } from 'express';
import customersController from '../controllers/customers.controller';

const router = Router();

router.get('/', customersController.getAllCustomers);
router.get('/:id', customersController.getCustomerById);

export default router;
