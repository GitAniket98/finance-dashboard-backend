# Finance Dashboard Backend

A backend REST API for a finance dashboard system. Supports role-based access control, financial record management, and summary-level analytics designed to serve a frontend dashboard.

---

## Tech Stack

| Layer          | Technology                       |
| -------------- | -------------------------------- |
| Runtime        | Node.js + TypeScript             |
| Framework      | Express.js                       |
| Database       | PostgreSQL                       |
| Authentication | JWT (Bearer tokens)              |
| Validation     | Zod                              |
| Security       | Helmet, CORS, express-rate-limit |

---

## Project Structure

src/
├── controllers/ # Route handlers
├── db/ # Database connection, migrations, seed
├── middlewares/ # Auth, role guard, validation, rate limiting
├── models/ # TypeScript interfaces
├── routes/ # Express routers
├── utils/ # ApiError, ApiResponse, asyncHandler
└── validators/ # Zod schemas

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/finance-dashboard-backend.git
cd finance-dashboard-backend
```

2. Install dependencies

```bash
npm install
```

3. Configure environment

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```bash
   PORT=8000
    DATABASE_URL=postgresql://user:password@localhost:5432/finance_db
    JWT_SECRET=jwt_secret
    JWT_EXPIRY=7d
    NODE_ENV=development
```

To generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

4. Run database migrations

```bash
npm run migrate
```

5. Seed the database

```bash
npm run seed
```

6. Start the development server

```bash
npm run dev
```

Server runs at `http://localhost:8000`

---

## Test Accounts

The seed script creates three accounts, one for each role:

| Email               | Password    | Role    |
| ------------------- | ----------- | ------- |
| admin@finance.com   | password123 | admin   |
| analyst@finance.com | password123 | analyst |
| viewer@finance.com  | password123 | viewer  |

---

## Roles and Permissions

| Endpoint                   | viewer | analyst | admin |
| -------------------------- | ------ | ------- | ----- |
| GET /dashboard/summary     | yes    | yes     | yes   |
| GET /dashboard/trends      | no     | yes     | yes   |
| GET /dashboard/by-category | no     | yes     | yes   |
| GET /dashboard/recent      | no     | yes     | yes   |
| GET /records               | no     | yes     | yes   |
| POST /records              | no     | no      | yes   |
| PATCH /records/:id         | no     | no      | yes   |
| DELETE /records/:id        | no     | no      | yes   |
| GET /users                 | no     | no      | yes   |
| PATCH /users/:id           | no     | no      | yes   |

---

## API Reference

### Authentication

```bash
POST /auth/register => Create a new user account
POST /auth/login => Login and receive a JWT token
```

### Users (admin only)

```bash
GET /users => List all users
GET /users/:id => Get a user by ID
PATCH /users/:id => Update user role or status
```

### Financial Records

```bash
POST /records => Create a new record (admin)
GET /records => List records with filters (admin, analyst)
PATCH /records/:id => Update a record (admin)
DELETE /records/:id => Soft delete a record (admin)
```

#### Supported query filters for GET /records

| Parameter | Type   | Description                           |
| --------- | ------ | ------------------------------------- |
| type      | string | Filter by income or expense           |
| category  | string | Partial match, case insensitive       |
| from      | date   | Start date in YYYY-MM-DD format       |
| to        | date   | End date in YYYY-MM-DD format         |
| page      | number | Page number, default 1                |
| limit     | number | Records per page, default 10, max 100 |

### Dashboard

```bash
GET /dashboard/summary  => Total income, expenses and net balance
GET /dashboard/by-category  => Totals grouped by category and type
GET /dashboard/trends  => Monthly income and expense breakdown
GET /dashboard/recent  => Last 10 financial records
```

---

## Design Decisions

- **Raw SQL over ORM** — keeps queries transparent and easy to reason about
- **Soft delete** — financial records are never hard deleted, preserving audit trail
- **DB-level aggregation** — all dashboard calculations use SQL aggregates, not application logic
- **Consistent response shape** — every endpoint returns `{ success, message, data }`
- **Role middleware** — access control is enforced at the route level before any controller logic runs
- **Same error for invalid credentials** — wrong email and wrong password return identical messages to prevent user enumeration

---

## Available Scripts

```bash
npm run dev        # Start development server with hot reload
npm run build      # Compile TypeScript to JavaScript
npm run start      # Run compiled output
npm run migrate    # Run database migrations
npm run seed       # Seed database with test data
```
