import { Router } from 'express';
import * as c from '../controllers/paymentController.js';
import express from 'express';

const router = Router();

router.post('/create-checkout-session', c.createCheckoutSession);
router.post('/confirm-payment', c.confirmPayment);
router.post('/webhook', express.raw({ type: 'application/json' }), c.handleStripeWebhook);

export default router;
