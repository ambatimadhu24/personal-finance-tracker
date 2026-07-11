# Personal Finance Tracker API

Base URL: `http://127.0.0.1:8000/api`

## Authentication

### Register
`POST /register/`

```json
{
  "username": "rahul",
  "email": "rahul@example.com",
  "password": "StrongPass123"
}
```

### Login
`POST /login/`

```json
{
  "username": "rahul",
  "password": "StrongPass123"
}
```

Use the returned access token in protected requests:

`Authorization: Bearer <access_token>`

### Refresh Token
`POST /token/refresh/`

```json
{
  "refresh": "<refresh_token>"
}
```

### Password Reset
`POST /password-reset/`

```json
{
  "email": "rahul@example.com"
}
```

The development server prints the reset uid and token in the terminal.

`POST /password-reset/confirm/`

```json
{
  "uid": "MQ",
  "token": "token-from-email",
  "new_password": "NewStrongPass123"
}
```

## Transactions

`GET /transactions/`

`POST /transactions/`

```json
{
  "transaction_type": "expense",
  "category": "Food",
  "amount": "8500.00",
  "description": "Groceries",
  "date": "2026-07-04"
}
```

`PUT /transactions/{id}/`

`DELETE /transactions/{id}/`

Optional filters:

`GET /transactions/?type=expense&category=Food`

## Budgets

`GET /budgets/`

`POST /budgets/`

```json
{
  "category": "Travel",
  "monthly_limit": "5000.00",
  "month": 7,
  "year": 2026
}
```

`PUT /budgets/{id}/`

`DELETE /budgets/{id}/`

## Reports

`GET /reports/dashboard/`

`GET /reports/monthly/?month=7&year=2026`

`GET /reports/annual/?year=2026`

`GET /reports/export/csv/?month=7&year=2026`

`GET /reports/export/excel/?month=7&year=2026`

`GET /reports/export/pdf/?month=7&year=2026`
