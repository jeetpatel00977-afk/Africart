# Africart Deployment Guide

## Prerequisites
- Node.js v16+
- PostgreSQL 12+
- Git
- Docker (optional)

## Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/jeetpatel00977-afk/Africart.git
cd Africart
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### 3. Database Setup
```bash
psql -U postgres
CREATE DATABASE africart_db;
\c africart_db
\i database/schema.sql
```

## Production Deployment

### Docker Deployment

#### Build Docker Image
```bash
docker build -t africart:latest .
```

#### Run Container
```bash
docker run -p 5000:5000 --env-file .env africart:latest
```

### Cloud Deployment (Heroku)
```bash
heroku login
heroku create africart-api
git push heroku main
heroku config:set JWT_SECRET=your_secret
```

## Environment Variables for Production
- Set all variables in `.env` file
- Never commit `.env` to version control
- Use strong, unique secrets
- Rotate JWT secrets periodically
