# customer-portal

## What this is
An e-commerce storefront: Next.js (App Router, TypeScript) + Prisma/Postgres
+ Stripe + NextAuth. Users browse products, hold a cart client-side in
`localStorage`, check out through Stripe, and view their order history.

## Commit and PR rules
- Plain conventional commit format only: `fix:`, `feat:`, `chore:`, `test:`,
  etc.
- No trailers, no footers, no co-author lines.
- Never mention Claude or AI assistance anywhere in a commit message or PR
  description. This applies to every commit and PR, no exceptions.

## Security: server-side pricing
Checkout and any other money-handling code must always compute prices
server-side from the Prisma `Product.price` field in the database — never
trust a price field sent from the client (request body, cart payload,
`localStorage` cart, etc.). The client cart is for display only.

This was a real, exploitable bug in `/api/checkout` (client-sent
`item.product.price` was used directly for the order total and the Stripe
charge) and has since been fixed. Any new route that creates an order,
computes a total, or talks to Stripe must re-fetch the product(s) by id and
use the DB price, the same way `/api/checkout` does now. Also check
`Product.inStock` before letting an order through.

## Testing
Vitest is the test runner (config: `vitest.config.mts`). Run with
`npm test`. Mock `@/lib/prisma`, `@/lib/auth-server`, and `stripe` in route
tests rather than hitting a real database or Stripe — importing the real
`@/lib/prisma` module has the side effect of connecting a `PrismaClient` at
import time.

## Dependency notes
- `@types/node` is pinned to `^20.19.0` even though the local Node runtime
  is newer. Vitest's peer range wants `^22`/`>=24`, which conflicts with
  that pin — installing Vitest-related packages needs
  `npm install --legacy-peer-deps`. Don't "fix" this by bumping
  `@types/node` unless that's the actual task; it's a known, intentional
  tradeoff, not an oversight.
