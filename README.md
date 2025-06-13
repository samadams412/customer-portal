# Customer Portal – Online Grocery Store

A web application for browsing grocery items, managing customer accounts, and placing orders. Built as part of a Software Engineering course project.

## Stack

- **Frontend:** Next.js 15, React, TypeScript, Tailwind CSS, ShadCN UI
- **Backend:** Next.js API Routes, Prisma, PostgreSQL
- **Auth:** JWT-based
- **API Testing:** Insomnia

## Setup

1. Create `.env` with:

   ```env
   DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/grocery"
   JWT_SECRET="your-secret-key"
   PROD_URL="http://localhost:3000"

2. Run setup

    ```npm install
    npx prisma migrate dev --name init
    npx prisma db seed
    npm run dev

## Repo Workflow

* Use feature branches and PRs to merge into main
* Track tasks via GitHub Issues
* Branch protection enabled on main