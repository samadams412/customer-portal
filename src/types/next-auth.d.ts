// src/types/next-auth.d.ts
// Extend NextAuth.js default types to include custom properties from your User model

import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string; // Your Prisma User model's ID
    name?: string | null; // From your Prisma User model
    email?: string | null; // From your Prisma User model
  }

  interface Session {
    user: {
      id: string; // User ID available in session.user
      name?: string | null;
      email?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string; // User ID embedded in the JWT payload
    // Add other properties you explicitly put into the JWT from authorize callback, e.g.:
    // name?: string | null;
    // email?: string | null;
  }
}
