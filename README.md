# Customer Portal Project

This project is a customer portal built with Next.js (App Router), React, Tailwind CSS, and ShadCN UI. It uses Prisma ORM with Prisma Postgres (Accelerate) for its database and a custom JWT-based authentication system.


## Setup

1. Clone the Repo
    ```
    git clone https://github.com/samadams412/customer-portal.git
    cd customer-portal
    ```

2. Install Dependencies
    ```
    npm install
    ```

3. Configure Environmental Variables
    
    Create a ```.env``` file at the root of your project. This project requires connection to the hosted Prisma Postgres database via Prisma Accelerate. 

    ```.env``` example:
    ```
    # Database Connection URL for Prisma Accelerate
    # Get this from your Prisma Cloud dashboard (Accelerate section).
    # IMPORTANT: Replace 'YOUR_PRISMA_ACCELERATE_API_KEY_HERE' with your actual key.

    DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_PRISMA_ACCELERATE_API_KEY_HERE"

    # JWT Secret for authentication tokens
    # Use a strong, unique secret for production deployments. For local dev, a simple string is fine.

    JWT_SECRET="your_local_dev_jwt_secret"
    ```

4. Setup the Database Schema and Seed Data

    1. Generate Prisma Client:
        ```
        npx prisma generate --no-engine
        ```
    2. Apply Migrations to Database:
        ```
        npx prisma migrate deploy
        ```
    3. Seed the Database
        ```
        npx prisma db seed
        ```
5. Run the Development Server
    ```
    npm run dev
    ```
