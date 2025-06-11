# Grocery Portal Project: Backend and Feature Implementation Plan

This outlines our current progress, project structure, and how we’re going to break tasks down and assign them moving forward. We’re prioritizing getting all backend routes tested and working using Insomnia before moving into frontend polish. Once routes are done, we’ll hook them up page by page and iterate.

## Stack Overview

- **Frontend**: Next.js (App Router) + React + Tailwind CSS + ShadCN UI
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: JWT-based system (stored in localStorage on the client)
- **Payments**: Stripe (test mode)
- **Testing**: Unit testing for routes (to fulfill project requirements)

---

## Phase 1: Core API Development

### Auth (Complete)
- [x] Set up Prisma `User` model
- [x] `/api/register`: Create user
- [x] `/api/login`: Authenticate and return JWT
- [ ] `withAuth`: Middleware to protect routes

### Products
- [ ] Create `Product` model in Prisma
- [ ] Seed DB with 10+ dummy products and image URLs
- [ ] `/api/products`: GET all products, support search/sort
- [ ] `/api/products/[id]`: GET single product by ID

### Cart
- [ ] Create `CartItem` model
- [ ] `/api/cart`: Add item, delete item, fetch cart
- [ ] Connect cart to current user

### Orders
- [ ] Create `Order` and `OrderItem` models
- [ ] Add delivery option field
- [ ] Implement tax calculation (8.25%)
- [ ] Support discount codes (hardcoded for now)
- [ ] `/api/orders`: Fetch all orders by logged-in user
- [ ] Integrate Stripe test checkout flow

### Addresses
- [ ] Add `Address` model linked to User
- [ ] `/api/address`: Add/update/remove user addresses

---

## Phase 2: Frontend Integration

Once backend routes are tested and stable, we’ll build the frontend UI pages.

- [ ] Login / Register form (done)
- [ ] Product search + filtering UI
- [ ] Cart page to view/add/remove items
- [ ] Checkout screen with Stripe integration
- [ ] User Dashboard:
  - View order history
  - Sort by date or price
  - Manage addresses

---

## Phase 3: Final Touches

- [ ] Style polish, layout, animations
- [ ] Seed database with final product set and mock images
- [ ] Add unit tests to at least 1-2 backend routes
- [ ] Document routes and auth system
- [ ] Containerize with Docker and/or deploy to AWS

---

## Notes

- For product images, we can use placeholder services like [Lorem Picsum](https://picsum.photos) or [Unsplash Source](https://source.unsplash.com)
- Discount codes can be handled with a simple in-memory array for now
- Stripe handles tax in full implementation, but we’ll calculate manually at first
- Delivery types can be handled with an enum (`"pickup"` or `"delivery"`) in the `Order` model

---

## Next Steps

- Create GitHub issues from this outline
- Assign one or two issues per teammate to begin
- Focus on testing backend routes before wiring up frontend pages
- Stripe will be implemented after core order flow works

