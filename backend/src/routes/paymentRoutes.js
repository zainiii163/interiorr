import { Router } from 'express';
import * as c from '../controllers/paymentController.js';

const router = Router();

router.post('/create-checkout-session', c.createCheckoutSession);
router.post('/confirm-payment', c.confirmPayment);

export default router;
