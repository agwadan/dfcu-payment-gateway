# Payment API Documentation

## Overview

This project includes a payment processing system built with:

- **Frontend**: React.js
- **Backend**: Express.js
- **Database**: MySQL

It supports payment initiation, transaction status checking, and fetching all payments.

---

## API Endpoints

### 1. Initiate Payment

**Endpoint:** `POST /api/payments/initiate`

**Request Body:**

```json
{
  "payer": "1234567890",
  "payee": "0987654321",
  "amount": 100.50,
  "currency": "USD",
  "payerReference": "Invoice123"
}
```

**Success Response:**

```json
{
  "statusCode": 200,
  "transactionReference": "uuid-generated",
  "message": "Transaction successfully processed ✅"
}
```

**Error Response:** (e.g. invalid input)

```json
{
  "statusCode": 400,
  "message": "Transaction failed ❌: Invalid account number."
}
```

---

### 2. Check Payment Status

**Endpoint:** `GET /api/payments/status/:transactionReference`

**Response:**

```json
{
  "transactionReference": "uuid",
  "statusCode": 200,
  "message": "Transaction successfully processed ✅"
}
```

---

### 3. Get All Payments

**Endpoint:** `GET /api/payments/all`

**Response:**

```json
[
  {
    "payer": "1234567890",
    "payee": "0987654321",
    "amount": 100.5,
    "currency": "USD",
    "transaction_reference": "uuid",
    "status": "SUCCESSFUL",
    "created_at": "2025-05-10T10:30:00Z"
  },
  ...
]
```

---

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- MySQL server
- npm or yarn
- React development tools

---

### 1. Clone the Repository

```bash
git clone https://github.com/agwadan/dfcu-payment-gateway.git
cd dfcu-payment-gateway
```

---

### 2. Setup the Backend

```bash
cd payment-gateway-backend
npm install or yarn 
```

#### Create a `.env` file:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=dfcu_payment_gateway
PORT=3000
```

#### Create the Database and Table:

```sql
CREATE DATABASE dfcu_payment_gateway;

USE dfcu_payment_gateway;

CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  payer VARCHAR(10),
  payee VARCHAR(10),
  amount DECIMAL(10, 2),
  currency VARCHAR(3),
  payer_reference VARCHAR(255),
  transaction_reference VARCHAR(255),
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Run the Backend Server

```bash
npm run dev
```

---

### 3. Setup the Frontend

```bash
cd ../payment-gateway-frontend
npm install or yarn
npm start
```

Your frontend should now be running on `http://localhost:3001` (or default React port).

---

### Notes

- Ensure MySQL is running and credentials in `.env` match your setup.
- Backend runs on port 3000 by default.
- Frontend communicates with backend via `http://localhost:3000/api/...`

### Assumptions

- **User Is Authenticated:** This demo does not cover user authentication and the requests made to the api endpoints are based on the assumption that the user is already authenticated.

## Proposed Next Steps

- Implement user authentincation so that the requests are verified using an access token before they are processed.
- Hosting the different components of the app i.e. client side and the backend on a cloud hosting service so that it is accessible from anywhere.
- Move the database to a cloud service to improve scalability and security.
- Improve the UI/UX by adding authentication pages to allow users signup and login to perform transactions.
- Set up Continuous Integration and Continuous Deployment.
