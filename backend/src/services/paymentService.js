const Stripe = require('stripe');
const axios = require('axios');
const crypto = require('crypto');
const db = require('../config/database');
const { sendEmail } = require('../utils/email');

class PaymentService {
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    this.mpesaConsumerKey = process.env.MPESA_CONSUMER_KEY;
    this.mpesaConsumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.flutterwave_secret = process.env.FLUTTERWAVE_SECRET;
  }

  // ==================== M-PESA ====================
  async getMPesaAccessToken() {
    try {
      const auth = Buffer.from(
        `${this.mpesaConsumerKey}:${this.mpesaConsumerSecret}`
      ).toString('base64');

      const response = await axios.get(
        'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );

      return response.data.access_token;
    } catch (error) {
      console.error('M-Pesa token error:', error);
      throw new Error('Failed to get M-Pesa access token');
    }
  }

  async initiateMPesaPayment(orderId, amount, phoneNumber) {
    try {
      const accessToken = await this.getMPesaAccessToken();
      const timestamp = new Date()
        .toISOString()
        .replace(/[^0-9]/g, '')
        .slice(0, -3);

      const password = Buffer.from(
        `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
      ).toString('base64');

      const response = await axios.post(
        'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
        {
          BusinessShortCode: process.env.MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: Math.round(amount),
          PartyA: phoneNumber.replace(/\D/g, ''),
          PartyB: process.env.MPESA_SHORTCODE,
          PhoneNumber: phoneNumber.replace(/\D/g, ''),
          CallBackURL: `${process.env.API_URL}/api/payments/mpesa/callback`,
          AccountReference: `Order-${orderId}`,
          TransactionDesc: 'Africart Order Payment',
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Save payment record
      const paymentId = await this.savePayment({
        order_id: orderId,
        amount,
        method: 'mpesa',
        status: 'pending',
        transaction_ref: response.data.CheckoutRequestID,
        phone: phoneNumber,
      });

      return {
        success: true,
        message: 'STK push sent successfully',
        checkoutRequestId: response.data.CheckoutRequestID,
        paymentId,
      };
    } catch (error) {
      console.error('M-Pesa initiation error:', error);
      throw error;
    }
  }

  async handleMPesaCallback(data) {
    try {
      const body = data.Body.stkCallback;
      const checkoutRequestId = body.CheckoutRequestID;
      const resultCode = body.ResultCode;

      if (resultCode === 0) {
        // Payment successful
        const resultData = body.CallbackMetadata.Item;
        const amount = resultData.find((item) => item.Name === 'Amount').Value;
        const transactionId = resultData.find(
          (item) => item.Name === 'MpesaReceiptNumber'
        ).Value;

        await this.updatePaymentStatus(checkoutRequestId, 'completed', {
          transaction_id: transactionId,
          amount_received: amount,
        });

        // Update order status
        const payment = await db.query(
          'SELECT order_id FROM payments WHERE transaction_ref = $1',
          [checkoutRequestId]
        );
        await db.query(
          'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2',
          ['confirmed', payment.rows[0].order_id]
        );

        return { success: true };
      } else {
        // Payment failed
        await this.updatePaymentStatus(checkoutRequestId, 'failed');
        return { success: false };
      }
    } catch (error) {
      console.error('M-Pesa callback error:', error);
      throw error;
    }
  }

  // ==================== STRIPE ====================
  async initiateStripePayment(orderId, amount, email) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Africart Order #${orderId}`,
              },
              unit_amount: Math.round(amount * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/orders/${orderId}?payment=success`,
        cancel_url: `${process.env.CLIENT_URL}/checkout/${orderId}?payment=cancelled`,
        customer_email: email,
        metadata: {
          order_id: orderId,
        },
      });

      // Save payment record
      const paymentId = await this.savePayment({
        order_id: orderId,
        amount,
        method: 'stripe',
        status: 'pending',
        transaction_ref: session.id,
      });

      return {
        success: true,
        sessionId: session.id,
        url: session.url,
        paymentId,
      };
    } catch (error) {
      console.error('Stripe initiation error:', error);
      throw error;
    }
  }

  async handleStripeWebhook(event) {
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object;
          await this.updatePaymentStatus(session.id, 'completed', {
            stripe_customer_id: session.customer,
          });

          // Update order
          const payment = await db.query(
            'SELECT order_id FROM payments WHERE transaction_ref = $1',
            [session.id]
          );
          await db.query(
            'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2',
            ['confirmed', payment.rows[0].order_id]
          );
          break;

        case 'charge.refunded':
          const charge = event.data.object;
          // Handle refund
          break;
      }
      return { received: true };
    } catch (error) {
      console.error('Stripe webhook error:', error);
      throw error;
    }
  }

  // ==================== FLUTTERWAVE ====================
  async initiateFlutterwavePayment(orderId, amount, email, phoneNumber) {
    try {
      const response = await axios.post(
        'https://api.flutterwave.com/v3/payments',
        {
          tx_ref: `africart-${orderId}-${Date.now()}`,
          amount,
          currency: 'KES',
          redirect_url: `${process.env.CLIENT_URL}/orders/${orderId}`,
          meta: {
            order_id: orderId,
          },
          customer: {
            email,
            phone_number: phoneNumber,
          },
          customizations: {
            title: 'Africart Order Payment',
            description: `Payment for order #${orderId}`,
            logo: 'https://africart.com/logo.png',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.flutterwave_secret}`,
          },
        }
      );

      // Save payment record
      const paymentId = await this.savePayment({
        order_id: orderId,
        amount,
        method: 'flutterwave',
        status: 'pending',
        transaction_ref: response.data.data.link,
      });

      return {
        success: true,
        paymentLink: response.data.data.link,
        paymentId,
      };
    } catch (error) {
      console.error('Flutterwave initiation error:', error);
      throw error;
    }
  }

  async verifyFlutterwavePayment(transactionId) {
    try {
      const response = await axios.get(
        `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
        {
          headers: {
            Authorization: `Bearer ${this.flutterwave_secret}`,
          },
        }
      );

      if (response.data.data.status === 'successful') {
        await this.updatePaymentStatus(transactionId, 'completed', {
          flutterwave_ref: response.data.data.flw_ref,
        });

        // Update order
        const payment = await db.query(
          'SELECT order_id FROM payments WHERE transaction_ref = $1',
          [transactionId]
        );
        await db.query(
          'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2',
          ['confirmed', payment.rows[0].order_id]
        );
      }

      return response.data.data;
    } catch (error) {
      console.error('Flutterwave verification error:', error);
      throw error;
    }
  }

  // ==================== COMMON METHODS ====================
  async savePayment(paymentData) {
    try {
      const result = await db.query(
        `INSERT INTO payments 
        (order_id, amount, method, status, transaction_ref, phone, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        RETURNING id`,
        [
          paymentData.order_id,
          paymentData.amount,
          paymentData.method,
          paymentData.status,
          paymentData.transaction_ref,
          paymentData.phone || null,
        ]
      );
      return result.rows[0].id;
    } catch (error) {
      console.error('Save payment error:', error);
      throw error;
    }
  }

  async updatePaymentStatus(transactionRef, status, metadata = {}) {
    try {
      await db.query(
        `UPDATE payments 
        SET status = $1, metadata = $2, updated_at = NOW()
        WHERE transaction_ref = $3`,
        [status, JSON.stringify(metadata), transactionRef]
      );
    } catch (error) {
      console.error('Update payment status error:', error);
      throw error;
    }
  }

  async getPaymentStatus(paymentId) {
    try {
      const result = await db.query(
        'SELECT * FROM payments WHERE id = $1',
        [paymentId]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Get payment status error:', error);
      throw error;
    }
  }

  async refundPayment(paymentId, reason) {
    try {
      const payment = await this.getPaymentStatus(paymentId);

      if (payment.method === 'stripe') {
        await this.stripe.refunds.create({
          charge: payment.stripe_charge_id,
          reason,
        });
      } else if (payment.method === 'mpesa') {
        // M-Pesa refund logic
        // This would need Safaricom B2C API
      }

      await this.updatePaymentStatus(payment.transaction_ref, 'refunded', {
        refund_reason: reason,
      });

      return { success: true };
    } catch (error) {
      console.error('Refund error:', error);
      throw error;
    }
  }
}

module.exports = new PaymentService();
