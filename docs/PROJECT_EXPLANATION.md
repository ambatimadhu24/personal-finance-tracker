# Project Explanation

## What This Project Does

The Personal Finance Tracker lets a user register, log in, record income and expenses, create category budgets, view analytics, and export monthly reports. It is a full-stack project because the React frontend talks to a Django REST Framework backend through REST APIs, and the backend stores data in a database.

## Main Modules

### 1. Authentication

Users register with username, email, and password. Login returns JWT access and refresh tokens. The React app stores the tokens in browser local storage and sends the access token in the `Authorization` header for protected APIs.

Implemented APIs:

- `POST /api/register/`
- `POST /api/login/`
- `POST /api/token/refresh/`
- `POST /api/password-reset/`
- `POST /api/password-reset/confirm/`

### 2. Transaction Management

Transactions are income or expense records. Each transaction belongs to the logged-in user, so one user cannot view another user's data.

Important fields:

- `transaction_type`: `income` or `expense`
- `category`: salary, food, rent, travel, shopping, etc.
- `amount`
- `description`
- `date`
- `created_at`

### 3. Budget Management

Budgets are monthly limits for categories. Example: Food budget for July 2026 is INR 10,000. The API calculates how much the user has already spent in that category for that month and returns status as `Safe` or `Over Budget`.

### 4. Dashboard and Analytics

The dashboard shows:

- Total income
- Total expenses
- Savings
- Category-wise expense pie chart
- Monthly income/expense trend chart

### 5. Reports

Reports can be generated for a selected month and year. The backend can export transaction data as CSV, Excel, and PDF using `csv`, `pandas`, `openpyxl`, and `reportlab`.

## Database Design

### User

Django's built-in user model is used:

- `id`
- `username`
- `email`
- `password`

### Transaction

- `id`
- `user`
- `transaction_type`
- `category`
- `amount`
- `description`
- `date`
- `created_at`

### Budget

- `id`
- `user`
- `category`
- `monthly_limit`
- `month`
- `year`
- `created_at`

## How Data Flows

1. User logs in from React.
2. Django returns JWT tokens.
3. React stores token and sends API requests with `Bearer <token>`.
4. DRF verifies the token.
5. Backend reads/writes only records owned by that user.
6. Dashboard and reports aggregate the user's transactions.

## How to Explain This in an Interview

Say:

"I built a Personal Finance Tracker using Django REST Framework and React. The backend exposes protected REST APIs with JWT authentication. Users can manage transactions and budgets. The dashboard uses aggregated API data for income, expenses, savings, trends, and category breakdowns. I also implemented report exports in CSV, Excel, and PDF. The application follows a modular structure with separate Django apps for accounts, transactions, budgets, and reports."

## Suggested Demo Flow

1. Register a user.
2. Login and show token-based authentication.
3. Add income transaction.
4. Add expense transactions under categories like Food and Travel.
5. Create budgets for those categories.
6. Show one category as `Safe` and one as `Over Budget`.
7. Open dashboard charts.
8. Export monthly report as CSV, Excel, and PDF.
