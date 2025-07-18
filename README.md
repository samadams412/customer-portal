# Modern E-commerce Platform

A full-stack e-commerce platform built using the modern React ecosystem. This project emphasizes seamless user experience, secure authentication, and scalable backend architecture with clean UI components and integration with Stripe for real-time payments.

## Project Overview

Our application allows users to:

- Browse products with search, filter, and sort capabilities  
- Add/remove items from the cart and adjust quantities  
- Apply discount codes and view updated totals with tax  
- Checkout securely using Stripe  
- Register and log in with authentication powered by NextAuth.js  
- View order history and details with persistent data via PostgreSQL  

---

## Technologies Used

| Frontend        | Backend         | Tooling & Infra         |
|-----------------|-----------------|--------------------------|
| ![Next.js](https://img.shields.io/badge/next.js-%23000000.svg?logo=next.js&logoColor=white&style=for-the-badge) | ![PostgreSQL](https://img.shields.io/badge/postgres-%23336791.svg?logo=postgresql&logoColor=white&style=for-the-badge) | ![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?logo=vercel&logoColor=white&style=for-the-badge) |
| ![React](https://img.shields.io/badge/react-%2320232a.svg?logo=react&logoColor=%2361dafb&style=for-the-badge) | Prisma ORM + Accelerate | ![Insomnia](https://img.shields.io/badge/insomnia-%234000bf.svg?logo=insomnia&logoColor=white&style=for-the-badge) |
| ![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338b2ac.svg?logo=tailwind-css&logoColor=white&style=for-the-badge) | Stripe API (Payments) | ![TypeScript](https://img.shields.io/badge/typescript-%23007acc.svg?logo=typescript&logoColor=white&style=for-the-badge) |
| ShadCN UI        | NextAuth.js     | Zod (form validation)   |

---

## Key Features

- **Secure Auth** — Integrated with `NextAuth` to prevent token leakage, replacing an earlier JWT method.
- **Cart Logic** — Handles multiple edge cases like merging items, applying discounts, and persistent cart storage.
- **Backend Testing** — Ensured robust API functionality before integrating frontend.
- **CI/CD + Previews** — Leveraged Vercel preview deployments and GitHub branch protections to enable smooth team collaboration.
- **Stripe Integration** — Dynamic checkout, discount logic, and order receipt management.

---

## Future Development

- **Containerization** (Docker) for local dev parity and production scaling  
- **Microservices architecture** to isolate payment, auth, and order logic  
- Move from `useEffect` data fetching → [SWR](https://swr.vercel.app/) or [React Query](https://tanstack.com/query) for **stale-while-revalidate**, caching, and real-time syncing  
- Add an Admin Dashboard for product/order management  

---

##  License

MIT
