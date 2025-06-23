# Onboarding Tips – CS3773 Dev Setup

Quick notes for anyone jumping into the project. You’re probably familiar with Git, PRs, etc.—this is more about how we do things here and how to not break the app for everyone.

---

## 1. Branch Workflow

**Don't work on `main`. Ever.**  
Always make a feature branch for your work:  
Examples:
- `feature/cart-api`
- `bugfix/fix-auth-redirect`
- `refactor/order-model`

Makes it easier to review and rollback if something goes wrong.

**Open a PR when ready.**  
Once your changes are working locally, push and open a Pull Request to `main`.  
Include: (I also reccomend running 'npm run build' to ensure there is no type Errors/Warnings).
- Short description of what changed
- Anything weird reviewers should know
- How to test it if applicable

**Provide a detailed commit message.**  
Keep the first line short and useful:  
- `fix: redirect to login on 401`  
- `feat: add product by ID page`  
Add details underneath if needed.

**Sync up with `main` often.**  
Before starting something new (or pushing), pull the latest from `main`.

```bash
git pull origin main
```

## 2. Vercel Deployment

**Preview URLs on every branch.**  
When you push a branch or open a PR, Vercel auto-deploys it and drops a link in the PR. Use it to test your changes live. Share it if you want feedback before merging.

**Check the Vercel status**  
PRs won’t merge if the Vercel build fails. Look for the green check in GitHub. If it’s red, open the Vercel logs to figure out what broke (usually a TypeScript or lint error).

## 3. Useful Resources


**[Prisma Accelerate Console](https://console.prisma.io/cmbjr1n0s00itos4d448pgctl/cmbjr2k6i01gng7ivfmdupnn7/cmbvb89cj005jcmgzt69mcvzm/dashboard)**
 
**[Prisma Client](https://www.prisma.io/docs/orm/prisma-client)**

**[NextAuth.js](https://console.prisma.io/cmbjr1n0s00itos4d448pgctl/cmbjr2k6i01gng7ivfmdupnn7/cmbvb89cj005jcmgzt69mcvzm/dashboard)**

**[Next.js & Prisma Postgres Auth Starter](https://vercel.com/templates/next.js/prisma-postgres)**

**[Shadcn Components](https://ui.shadcn.com/docs/components)**
