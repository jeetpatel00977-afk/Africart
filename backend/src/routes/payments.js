const express = require('express');
const router = express.Router();
const paymentService = require('../services/paymentService');
const { authenticate } = require('../middleware/auth');
const { validatePayment } = require('../middleware/validators');

// Initiate M-Pesa payment
router.post('/mpesa/initiate', authenticate, validatePayment, async (req, res) => {
  try {
    const { order_id, amount, phone } = req.body;

    const result = await paymentService.initiateMPesaPayment(
      order_id,
      amount,
      phone
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// M-Pesa callback
router.post('/mpesa/callback', async (req, res) => {
  try {
    const result = await paymentService.handleMPesaCallback(req.body);
    res.json(result);
  } catch (error) {
    console.error('Callback error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Initiate Stripe payment
router.post('/stripe/initiate', authenticate, validatePayment, async (req, res) => {
  try {
    const { order_id, amount } = req.body;
    const user = req.user;

    const result = await paymentService.initiateStripePayment(
      order_id,
      amount,
      user.email
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stripe webhook
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const event = paymentService.stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    const result = await paymentService.handleStripeWebhook(event);
    res.json(result);
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Initiate Flutterwave payment
router.post('/flutterwave/initiate', authenticate, validatePayment, async (req, res) => {
  try {
    const { order_id, amount, phone } = req.body;
    const user = req.user;

    const result = await paymentService.initiateFlutterwavePayment(
      order_id,
      amount,
      user.email,
      phone
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify Flutterwave payment
router.post('/flutterwave/verify', authenticate, async (req, res) => {
  try {
    const { transaction_id } = req.body;

    const result = await paymentService.verifyFlutterwavePayment(transaction_id);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payment status
router.get('/:id/status', authenticate, async (req, res) => {
  try {
    const payment = await paymentService.getPaymentStatus(req.params.id);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Refund payment
router.post('/:id/refund', authenticate, async (req, res) => {
  try {
    const { reason } = req.body;

    const result = await paymentService.refundPayment(req.params.id, reason);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
