// Database schema additions for payments

-- Payments table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'KES',
    method VARCHAR(50), -- mpesa, stripe, flutterwave, paypal
    status VARCHAR(50), -- pending, completed, failed, refunded
    transaction_ref VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    stripe_charge_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    flutterwave_ref VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    UNIQUE(order_id, method)
);

-- Payment logs table for audit trail
CREATE TABLE payment_logs (
    id SERIAL PRIMARY KEY,
    payment_id INTEGER NOT NULL,
    event VARCHAR(100),
    status_before VARCHAR(50),
    status_after VARCHAR(50),
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES payments(id)
);

-- Refunds table
CREATE TABLE refunds (
    id SERIAL PRIMARY KEY,
    payment_id INTEGER NOT NULL,
    amount DECIMAL(10, 2),
    reason TEXT,
    status VARCHAR(50), -- pending, approved, rejected, completed
    refund_reference VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES payments(id)
);

-- Create indexes
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_method ON payments(method);
CREATE INDEX idx_payments_created_at ON payments(created_at);
CREATE INDEX idx_payment_logs_payment_id ON payment_logs(payment_id);
CREATE INDEX idx_refunds_payment_id ON refunds(payment_id);
CREATE INDEX idx_refunds_status ON refunds(status);
