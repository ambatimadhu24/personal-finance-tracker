# Personal Finance Tracker

Full-stack Personal Finance Tracker using React, Django REST Framework, JWT authentication, database integration, analytics dashboards, and report exports.

## Tech Stack

- Frontend: React, Material UI, Axios, Recharts
- Backend: Python, Django, Django REST Framework
- Auth: JWT with SimpleJWT
- Database: SQLite for quick demo, PostgreSQL supported
- Reports: CSV, Excel, PDF with pandas, openpyxl, reportlab

## Project Structure

```text
personal-finance-tracker/
|-- backend/
|   |-- accounts/
|   |-- transactions/
|   |-- budgets/
|   |-- reports/
|   |-- finance_tracker/
|   |-- fixtures/
|   |-- manage.py
|   |-- requirements-postgres.txt
|   `-- requirements.txt
|-- frontend/
|   |-- src/
|   |-- package.json
|   `-- index.html
|-- docs/
|-- docker-compose.yml
`-- README.md
```

## Quick Start With SQLite

### 1. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend runs at:

`http://127.0.0.1:8000`

### 2. Frontend

Open a second terminal:

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend runs at:

`http://localhost:5173`

## PostgreSQL Setup

Start PostgreSQL with Docker:

```bash
docker compose up -d
```

In `backend/.env`, change:

```env
DB_ENGINE=postgres
POSTGRES_DB=finance_tracker
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

Then run:

```bash
pip install -r requirements-postgres.txt
python manage.py migrate
```

For interviews and college demos, the SQLite setup is enough. Use PostgreSQL only if the interviewer specifically asks for a production-style database setup.

## Common Install Error

If `pip install -r requirements.txt` fails while building `psycopg2-binary`, use the updated `requirements.txt` in this project. PostgreSQL support has been moved to `requirements-postgres.txt`.

If Django is missing after an install error, run:

```bash
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
python manage.py migrate
```

The error `ModuleNotFoundError: No module named 'django'` means Django was not installed because the earlier pip installation failed.

## Sample Data

The fixture contains sample transactions and budgets. Because the fixture user password is not usable, first create your own user from the frontend, or create a superuser.

To load sample data:

```bash
python manage.py loaddata fixtures/sample_data.json
```

For a clean demo, it is usually easier to register from the frontend and add these records manually:

| Type | Category | Amount | Description | Date |
| --- | --- | ---: | --- | --- |
| Income | Salary | 75000 | Monthly salary | 2026-07-01 |
| Expense | Food | 8500 | Groceries and eating out | 2026-07-04 |
| Expense | Travel | 6200 | Fuel and cab rides | 2026-07-08 |

Budgets:

| Category | Budget | Month | Year |
| --- | ---: | ---: | ---: |
| Food | 10000 | 7 | 2026 |
| Travel | 5000 | 7 | 2026 |

## Core Features

- User registration and login
- JWT protected APIs
- Password reset API
- Add, view, update, and delete transactions
- Create, view, update, and delete budgets
- Budget utilization with `Safe` and `Over Budget` status
- Dashboard with income, expenses, savings, pie chart, and bar chart
- Monthly and annual reports
- CSV, Excel, and PDF export

## Important API Docs

See [docs/API.md](docs/API.md).

You can also import [docs/postman_collection.json](docs/postman_collection.json) into Postman.

## Project Explanation

See [docs/PROJECT_EXPLANATION.md](docs/PROJECT_EXPLANATION.md).

## Resume Description

Developed a Personal Finance Tracker using Python Django REST Framework, React.js, and PostgreSQL. Implemented JWT authentication, transaction management, budget tracking, analytics dashboards, and PDF/CSV/Excel report generation. Designed RESTful APIs and integrated a responsive React frontend with protected backend services.
