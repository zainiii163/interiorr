import { Quote } from '../models/Quote.js';
import { Lead } from '../models/Lead.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { formatQuote } from '../utils/legacyFormat.js';
import { env } from '../config/env.js';

async function getStripe() {
  if (!env.stripe.secretKey) return null;
  const Stripe = (await import('stripe')).default;
  return new Stripe(env.stripe.secretKey);
}

async function assertQuoteAccess(quote, accessCode) {
  if (!quote) throw new ApiError(404, 'Quote not found');
  if (!accessCode || String(accessCode).trim() !== String(quote.accessCode || '').trim()) {
    throw new ApiError(403, 'Valid client access code is required');
  }
}

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { quoteId, accessCode } = req.body;
  if (!quoteId) throw new ApiError(400, 'Quote ID is required');

  const quote = await Quote.findById(quoteId).populate('lead');
  await assertQuoteAccess(quote, accessCode);

  const clientOrigin =
    env.frontendUrl && env.frontendUrl !== 'same-origin'
      ? env.frontendUrl
      : req.headers.origin || 'http://localhost:5173';
  const stripe = await getStripe();

  if (stripe) {
    try {
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

      if (quote.tax > 0) {
        lineItems.push({
          price_data: {
            currency: (quote.currency || 'AED').toLowerCase(),
            product_data: { name: 'UAE VAT (5%)' },
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
          accessCode: quote.accessCode || '',
          leadId: quote.lead?._id?.toString() || '',
        },
        success_url: `${clientOrigin}/payment/success?quoteId=${quote._id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${clientOrigin}/portal/${quote.accessCode}?payment=cancelled`,
      });

      quote.paymentStatus = 'pending';
      quote.stripeCheckoutSessionId = session.id;
      await quote.save();

      res.status(200).json(
        new ApiResponse(200, {
          url: session.url,
          sessionId: session.id,
          mode: 'stripe',
        }, 'Stripe checkout session created')
      );
      return;
    } catch (err) {
      console.warn('Stripe checkout failed, using sandbox mode:', err.message);
    }
  }

  const sandboxSessionId = `cs_sandbox_${Date.now()}`;
  quote.paymentStatus = 'pending';
  quote.stripeCheckoutSessionId = sandboxSessionId;
  await quote.save();

  res.status(200).json(
    new ApiResponse(200, {
      url: `${clientOrigin}/payment/success?quoteId=${quote._id}&session_id=${sandboxSessionId}`,
      sessionId: sandboxSessionId,
      mode: 'sandbox',
    }, 'Sandbox payment session created (set STRIPE_SECRET_KEY for live payments)')
  );
});

export const confirmPayment = asyncHandler(async (req, res) => {
  const { quoteId, sessionId } = req.body;
  if (!quoteId || !sessionId) throw new ApiError(400, 'Quote ID and session ID are required');

  const quote = await Quote.findById(quoteId).populate('lead');
  if (!quote) throw new ApiError(404, 'Quote not found');

  if (quote.paymentStatus === 'paid') {
    res.status(200).json(
      new ApiResponse(200, {
        quote: formatQuote(quote),
        paymentDetails: {
          paidAmount: quote.grandTotal,
          currency: quote.currency || 'AED',
          transactionRef: quote.stripePaymentIntentId,
          paidAt: quote.paidAt,
        },
      }, 'Payment already confirmed')
    );
    return;
  }

  if (!quote.stripeCheckoutSessionId || quote.stripeCheckoutSessionId !== sessionId) {
    throw new ApiError(403, 'Invalid or mismatched payment session');
  }

  const stripe = await getStripe();
  if (stripe && !String(sessionId).startsWith('cs_sandbox_')) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== 'paid' && session.status !== 'complete') {
        throw new ApiError(402, 'Payment not completed yet');
      }
      if (session.client_reference_id && session.client_reference_id !== quote._id.toString()) {
        throw new ApiError(403, 'Session does not match this quote');
      }
      quote.stripePaymentIntentId = session.payment_intent || sessionId;
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(400, 'Unable to verify Stripe session');
    }
  } else if (!String(sessionId).startsWith('cs_sandbox_')) {
    throw new ApiError(403, 'Invalid sandbox session');
  } else {
    quote.stripePaymentIntentId = `pi_sandbox_${Date.now()}`;
  }

  quote.status = 'accepted';
  quote.paymentStatus = 'paid';
  quote.paidAt = new Date();
  quote.acceptedAt = quote.acceptedAt || new Date();
  await quote.save();

  if (quote.lead) {
    await Lead.findByIdAndUpdate(quote.lead._id, { status: 'won' });
  }

  res.status(200).json(
    new ApiResponse(200, {
      quote: formatQuote(quote),
      paymentDetails: {
        paidAmount: quote.grandTotal,
        currency: quote.currency || 'AED',
        transactionRef: quote.stripePaymentIntentId,
        paidAt: quote.paidAt,
      },
    }, 'Payment confirmed and quote marked as accepted')
  );
});

export const handleStripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = env.stripe.webhookSecret;

  if (!webhookSecret || !env.stripe.secretKey) {
    res.status(200).json({ received: true, mode: 'no_webhook_secret' });
    return;
  }

  try {
    const stripe = await getStripe();
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
          quote.stripeCheckoutSessionId = session.id;
          await quote.save();

          if (quote.lead) {
            await Lead.findByIdAndUpdate(quote.lead, { status: 'won' });
          }
        }
      }
    }
    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Stripe webhook error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});
