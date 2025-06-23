// src/app/api/auth/[...nextauth]/route.ts
// This is the NextAuth.js API route handler.

import NextAuth from "next-auth";
import { authOptions } from "@/auth"; // Import the authOptions from your central configuration file

// Create the NextAuth.js handler. This handler processes all API requests
// to /api/auth/* (e.g., /api/auth/signin, /api/auth/callback, /api/auth/signout).
const handler = NextAuth(authOptions);

// Export the handler for both GET and POST requests.
// NextAuth.js uses these to manage authentication flows.
export { handler as GET, handler as POST };

