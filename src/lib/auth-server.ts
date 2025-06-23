// src/lib/auth-server.ts
// This file provides server-side utilities for NextAuth.js session management.

import { getServerSession } from "next-auth"; // Import getServerSession
import { authOptions } from "@/auth"; // Import your authOptions
// Removed: import { headers } from "next/headers"; // Not needed for getServerSession directly

// Helper function to get the authenticated user from the session on the server.
// This should be used in API routes and Server Components that need user data.
export async function getSessionUser() {
  // FIX: getServerSession implicitly gets the request context (including headers/cookies)
  // when called within an App Router Route Handler or Server Component.
  // We just need to pass the authOptions directly.
  const session = await getServerSession(authOptions);

  // Return the user object if authenticated, otherwise null.
  // The 'user' object will have 'id', 'name', 'email' due to our type extensions in src/types/next-auth.d.ts.
  return session?.user || null;
}
