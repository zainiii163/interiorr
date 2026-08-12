import { Quote } from '../models/Quote.js';
import { Lead } from '../models/Lead.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { formatQuote } from '../utils/legacyFormat.js';
import { env } from '../config/env.js';

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { quoteId } = req.body;
  if (!quoteId) throw new ApiError(400, 'Quote ID is required');

  const quote = await Quote.findById(quoteId).populate('lead');
  if (!quote) throw new ApiError(404, 'Quote not found');

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const clientOrigin = req.headers.origin || env.frontendUrl || 'http://localhost:5173';

  // If Stripe Secret Key is present, execute real Stripe API checkout session
  if (stripeSecretKey) {
    try {
      const Stripe = (await import('stripe')).default;
      const stripe = new Stripe(stripeSecretKey);

      const lineItems = (quote.lineItems || []).map((item) => ({
        price_data: {
          currency: (quote.currency || 'AED').toLowerCase(),
          product_data: {
            name: item.description || 'Interior Fit-out Services',
            description: `Category: ${item.category || 'Service'}`,
          },
          unit_amount: Math.round((item.unitPrice || 0) * 100),
        },
        quantity: item.quantity || 1,
      }));

      // Add tax line item if applicable
      if (quote.tax > 0) {
        lineItems.push({
          price_data: {
            currency: (quote.currency || 'AED').toLowerCase(),
            product_data: {
              name: 'UAE VAT (5%)',
            },
            unit_amount: Math.round(quote.tax * 100),
          },
          quantity: 1,
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        customer_email: quote.lead?.email || undefined,
        client_reference_id: quote._id.toString(),
        metadata: {
          quoteNumber: quote.quoteNumber,
          leadId: quote.lead?._id?.toString() || '',
        },
        success_url: `${clientOrigin}/payment/success?quoteId=${quote._id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${clientOrigin}/portal/${quote.accessCode || quote._id}?payment=cancelled`,
      });

      quote.paymentStatus = 'pending';
      quote.stripeCheckoutSessionId = session.id;
      await quote.save();

      res.status(200).json(
        new ApiResponse(200, {
          url: session.url,
          sessionId: session.id,
          mode: 'stripe',
          message: 'Stripe Checkout session initialized',
        })
      );
      return;
    } catch (err) {
      console.warn('Stripe checkout session creation error, falling back to sandbox mode:', err.message);
    }
  }

  // Sandbox checkout session for demonstration / immediate testing
  const sandboxSessionId = `cs_sandbox_${Math.random().toString(36).substr(2, 9)}`;
  quote.paymentStatus = 'pending';
  quote.stripeCheckoutSessionId = sandboxSessionId;
  await quote.save();

  const successUrl = `${clientOrigin}/payment/success?quoteId=${quote._id}&session_id=${sandboxSessionId}`;

  res.status(200).json(
    new ApiResponse(200, {
      url: successUrl,
      sessionId: sandboxSessionId,
      mode: 'sandbox',
      message: 'Sandbox payment session generated (Stripe test fallback)',
    })
  );
});

export const confirmPayment = asyncHandler(async (req, res) => {
  const { quoteId, sessionId } = req.body;
  if (!quoteId) throw new ApiError(400, 'Quote ID is required');

  const quote = await Quote.findById(quoteId).populate('lead');
  if (!quote) throw new ApiError(404, 'Quote not found');

  quote.status = 'accepted';
  quote.paymentStatus = 'paid';
  quote.paidAt = new Date();
  quote.acceptedAt = quote.acceptedAt || new Date();
  quote.stripePaymentIntentId = sessionId || `pi_${Math.random().toString(36).substr(2, 9)}`;
  await quote.save();

  if (quote.lead) {
    await Lead.findByIdAndUpdate(quote.lead._id, { status: 'won' });
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        quote: formatQuote(quote),
        paymentDetails: {
          paidAmount: quote.grandTotal,
          currency: quote.currency || 'AED',
          transactionRef: quote.stripePaymentIntentId,
          paidAt: quote.paidAt,
        },
      },
      'Payment confirmed and quote marked as accepted!'
    )
  );
});

export const handleStripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    res.status(200).json({ received: true });
    return;
  }

  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const quoteId = session.client_reference_id;

      if (quoteId) {
        const quote = await Quote.findById(quoteId);
        if (quote) {
          quote.status = 'accepted';
          quote.paymentStatus = 'paid';
          quote.paidAt = new Date();
          quote.stripePaymentIntentId = session.payment_intent;
          await quote.save();

          if (quote.lead) {
            await Lead.findByIdAndUpdate(quote.lead, { status: 'won' });
          }
        }
      }
    }
    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});
