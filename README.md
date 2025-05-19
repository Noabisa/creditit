#  Credit Bureau Management System

## Live Deployment

- **Frontend** (Vercel): [https://vercel.com/noabisoas-projects/creditit](https://vercel.com/noabisoas-projects/creditit)
- **Backend** (Render): [https://creditit.onrender.com](https://creditit.onrender.com)


##  Tech Stack

| Layer        | Technology                    |
|--------------|-------------------------------|
| Frontend     | React.js, HTML, CSS, Chart.js |
| Backend      | Node.js, Express.js           |
| Database     | MongoDB                       |
| Deployment   | Vercel (Frontend), Render (Backend) |



## Features

###  Borrower Dashboard

-  View **credit score** and **score factors**
-  **Download credit report as PDF**
-  Apply for **new loans** (with monthly limit enforcement)
-  Track loan repayment progress with **charts**
-  Make **partial repayments** with real-time updates
-  View **interest breakdown** and total amount owed

### Authentication

-  Secure **User Sign Up / Login**
-  Admin-only **backend routes** and **dashboard**

###  Admin Panel

-  View **all borrowers and loans**
-  **Approve / Reject** loan applications
-  View overall statistics (users, loans, income, etc.)
-  **Bar** and **Pie Charts** of loan distribution and credit scores
-  Search, sort, and delete borrowers (non-destructive delete)
-  Update loan status or mark loans as **paid**


## API Endpoints

### Auth
- `POST /api/auth/signup` – Register a new user
- `POST /api/auth/login` – Login and get token

### User / Borrower
- `GET /api/credit-reports/my` – Get user's credit score and factors
- `GET /api/loans` – View user loans
- `POST /api/loans` – Submit new loan request
- `POST /api/loans/:loanId/repay` – Repay a loan

### Admin
- `GET /api/admin/loans` – View all loan applications
- `PATCH /api/admin/loans/:id` – Update loan status (approve/reject)
- `DELETE /api/admin/loans/:id` – Delete a loan
- `GET /api/admin/users` – View all users
- `GET /api/admin/stats` – System-wide statistics (income, counts)

##  Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/Noabisa/credit-bureau-system.git
cd credit-bureau-system
