# 🚀 Odoo Hackathon Starter Kit

A production-ready, full-stack monorepo designed for 24-hour hackathons. It features a scalable Express backend and an ultra-modern React frontend that acts as a dual-theme design system.

## 🌟 Key Features

### 🎨 Frontend: Design System Core
- **Token-Driven Dual Theme**: Built with a robust CSS-variable foundation (via Tailwind CSS). Supports **Light, Dark, and System** themes out of the box.
- **Side-by-Side Dual View**: A unique interactive mode that lets you preview UI components and entire dashboards simultaneously in *both* Light and Dark modes.
- **Modular Components**: Built with React, Tailwind CSS, and `shadcn/ui` primitives (Buttons, Cards, Dialogs, Tables, Accordions, and more).
- **Ready for Anything**: Change the brand colors in `index.css` and the entire UI kit instantly adapts across both themes.

### ⚙️ Backend: Scalable API
- **Express + Prisma ORM**: Rapid database modeling and migrations.
- **Real-Time Enabled**: Socket.io integration built-in for instant dashboard updates.
- **Authentication**: JWT-based auth flows (User vs Admin roles).

---

## 🗄️ Database Configuration

This project uses **PostgreSQL** via **Prisma ORM**.

### Prisma Schema Overview

| Model | Fields | Notes |
|---|---|---|
| `User` | `id`, `name`, `email`, `passwordHash`, `role`, `createdAt` | Roles: `USER` or `ADMIN` |
| `Submission` | `id`, `title`, `description`, `status`, `createdAt`, `updatedAt`, `ownerId` | Statuses: `PENDING`, `APPROVED`, `REJECTED` |

> **Note:** The `Submission` model is a placeholder. Rename it to match your hackathon problem domain (e.g. `Complaint`, `Ticket`, `Listing`).

### Setting up the database

**1. Create a PostgreSQL database.** You can use any of the following:
- **Local**: Install [PostgreSQL](https://www.postgresql.org/download/) and create a database.
- **Hosted (recommended for hackathons)**:
  - [Neon](https://neon.tech) — free serverless Postgres
  - [Supabase](https://supabase.com) — free tier with dashboard
  - [Render](https://render.com) — free PostgreSQL instance

**2. Configure your `.env` file** in the `backend/` directory:
```bash
# Copy the example file
cp .env.example .env
```
Then open `backend/.env` and fill in your values:
```env
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<dbname>?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN="7d"
PORT=4000
CLIENT_URL="http://localhost:5173"
```

**3. Run migrations** to create all tables:
```bash
npx prisma migrate dev --name init
```

**4. (Optional) Explore your data** with Prisma Studio:
```bash
npx prisma studio
```
This opens a browser-based GUI at `http://localhost:5555` to view/edit your database records.

---

## 🛠️ Quick Start Guide

### 1. Backend Setup
Navigate to the `backend` directory and start the API:
```bash
cd backend
cp .env.example .env    # Then fill in your DATABASE_URL
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```
*API runs on http://localhost:4000*

### 2. Frontend Setup
Navigate to the `frontend` directory and start the UI:
```bash
cd frontend
npm install
npm run dev
```
*App runs on http://localhost:5173*

---

## 🏗️ Project Architecture

```
Hackathon/
├── backend/            # Express.js API & Prisma ORM
│   ├── prisma/
│   │   └── schema.prisma   # Database schema (User, Submission)
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth (requireAuth, requireRole)
│   │   ├── routes/         # API endpoints
│   │   ├── lib/            # Prisma client singleton
│   │   └── socket/         # Socket.io setup
│   └── .env                # ⚠️ Your secrets (never commit this!)
├── frontend/           # React + Vite Design System
│   ├── src/
│   │   ├── components/ # Reusable UI primitives (shadcn)
│   │   ├── context/    # ThemeProvider logic
│   │   ├── pages/      # Views (Dashboard, Gallery)
│   │   └── index.css   # Core design tokens
└── README.md
```

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | None | Health check |
| `POST` | `/api/auth/register` | None | Register a new user |
| `POST` | `/api/auth/login` | None | Login, returns JWT |
| `GET` | `/api/submissions` | Required | List submissions (admins see all) |
| `POST` | `/api/submissions` | Required | Create a submission |
| `PATCH` | `/api/submissions/:id/status` | Admin only | Approve or reject a submission |

## 📝 Usage Notes
- **Placeholder Models**: The `Submission` model in `prisma/schema.prisma` is meant to be renamed to fit whatever the hackathon problem statement demands.
- **Component Gallery**: Check out `/components` in the frontend to view the entire UI library and test the live side-by-side theme rendering!
- **Mock Auth**: During development, `requireAuth` in `src/middleware/auth.js` can be temporarily replaced with a mock user — see the comments in that file.
