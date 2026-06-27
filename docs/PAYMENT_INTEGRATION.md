# Payment Integration Guide

## Supported Payment Methods

AfriCart supports multiple payment gateways optimized for East Africa:

### 1. **M-Pesa** (Kenya, Tanzania, Uganda)
- Mobile money payment system
- Instant transactions
- High penetration in East Africa
- USSD support for feature phones

### 2. **Stripe**
- Credit/Debit card payments
- International transactions
- Webhook support
- PCI compliant

### 3. **Flutterwave**
- Pan-African payment provider
- Multiple payment options (cards, mobile money, bank transfers)
- Supports 34+ African countries
- Excellent for East Africa

### 4. **PayPal** (Optional)
- For international customers
- Secure transactions
- Buyer protection

---

## Setup Instructions

### M-Pesa Setup (Kenya)

#### Prerequisites
- Safaricom M-Pesa Business Account
- Consumerkey and Consumersecret from Safaricom
- Initiator name and security credential

#### Configuration
```bash
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd1a503b6e
MPESA_CALLBACK_URL=https://your-domain.com/api/payments/mpesa/callback
```

### Stripe Setup

#### Prerequisites
- Stripe account
- API keys from Stripe dashboard

#### Configuration
```bash
STRIPE_PUBLIC_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### Flutterwave Setup

#### Prerequisites
- Flutterwave merchant account
- Public and secret keys

#### Configuration
```bash
FLUTTERWAVE_PUBLIC_KEY=pk_test_xxxxx
FLUTTERWAVE_SECRET_KEY=sk_test_xxxxx
FLUTTERWAVE_ENCRYPTION_KEY=xxxxx
```

---

## API Endpoints

### Initiate Payment
```
POST /api/payments/initiate
{
  "order_id": 123,
  "amount": 2500,
  "currency": "KES",
  "payment_method": "mpesa|stripe|flutterwave",
  "phone": "+254712345678" // For M-Pesa
}
```

### Get Payment Status
```
GET /api/payments/:id/status
```

### Webhook Callback
```
POST /api/payments/webhook/mpesa
POST /api/payments/webhook/stripe
POST /api/payments/webhook/flutterwave
```

---

## Transaction Flow

### M-Pesa Flow
1. Customer initiates payment
2. System sends STK push to customer phone
3. Customer enters M-Pesa PIN
4. M-Pesa processes transaction
5. Webhook confirms payment
6. Order status updated to "Confirmed"

### Stripe/Card Flow
1. Customer enters card details
2. Stripe tokenizes card
3. System charges card via API
4. Webhook confirms payment
5. Order confirmed

### Flutterwave Flow
1. Redirect to Flutterwave payment page
2. Customer selects payment method
3. Payment processed
4. Webhook confirms transaction
5. Order confirmed

---

## Error Handling

- Invalid amount
- Insufficient funds
- Network timeout
- Card declined
- Invalid phone number
- Transaction already processed

---

## Security

- All transactions encrypted
- PCI DSS compliance
- Webhook signature verification
- Rate limiting on payment endpoints
- Audit logging for all transactions
