# Africart API Endpoints

## Authentication

### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+254712345678",
  "role": "customer"
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}
```

## Products

### Get All Products
```
GET /api/products?category=medicines&limit=10&offset=0
```

### Get Product Details
```
GET /api/products/:id
```

### Create Product (Vendor)
```
POST /api/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Aspirin",
  "category": "medicines",
  "price": 5.99,
  "stock_quantity": 100
}
```

## Orders

### Create Order
```
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "items": [
    {"product_id": 1, "quantity": 2}
  ],
  "delivery_address": "123 Main St, Nairobi",
  "delivery_latitude": -1.2865,
  "delivery_longitude": 36.8172
}
```

### Get Order Status
```
GET /api/orders/:id
Authorization: Bearer {token}
```

### Get Order Tracking
```
GET /api/orders/:id/tracking
```

## Seasonal Events

### Get Active Seasonal Events
```
GET /api/events/active
```

### Get All Events
```
GET /api/events
```
