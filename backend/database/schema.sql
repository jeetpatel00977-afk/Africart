-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20) UNIQUE,
    role VARCHAR(50) DEFAULT 'customer',
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    vendor_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price DECIMAL(10, 2),
    discount_percentage DECIMAL(5, 2) DEFAULT 0,
    stock_quantity INTEGER,
    is_available BOOLEAN DEFAULT TRUE,
    seasonal BOOLEAN DEFAULT FALSE,
    seasonal_start_date DATE,
    seasonal_end_date DATE,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES users(id)
);

-- Orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    vendor_id INTEGER NOT NULL,
    delivery_partner_id INTEGER,
    total_amount DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'pending',
    delivery_address TEXT,
    delivery_latitude DECIMAL(10, 8),
    delivery_longitude DECIMAL(11, 8),
    estimated_delivery_time TIMESTAMP,
    actual_delivery_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (vendor_id) REFERENCES users(id),
    FOREIGN KEY (delivery_partner_id) REFERENCES users(id)
);

-- Order Items table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER,
    price_at_purchase DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Delivery Tracking table
CREATE TABLE delivery_tracking (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Seasonal Events table
CREATE TABLE seasonal_events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    start_date DATE,
    end_date DATE,
    description TEXT,
    discount_percentage DECIMAL(5, 2),
    featured_categories TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_delivery_tracking_order_id ON delivery_tracking(order_id);
