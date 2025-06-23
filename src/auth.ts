// src/auth.ts
// This file defines the core NextAuth.js configuration options,
// including the CredentialsProvider which now handles both login and registration
// with more specific error messages.

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma"; // Import your Prisma Client instance
import bcrypt from "bcrypt"
export const authOptions: NextAuthOptions = {
  // Use 'jwt' strategy for session management.
  // This means session data is stored in a JWT in a cookie, not in the database.
  session: {
    strategy: "jwt",
  },
  // Define authentication providers. Here, we use CredentialsProvider for email/password login.
  providers: [
    CredentialsProvider({
      name: "Credentials", // Name of the provider (displayed on sign-in page)
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      // The authorize function handles the authentication logic for both login and registration.
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        // 1. Attempt to find the user in your database by email.
        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // 2. If user DOES NOT exist, this is a registration attempt.
        if (!user) {
          console.log(`No user found for ${credentials.email}. Attempting to register new user.`);
          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          
          try {
            // Create the new user in the database
            user = await prisma.user.create({
              data: {
                email: credentials.email,
                password: hashedPassword,
                // You might add a default name here if your schema requires it, e.g., name: "New User"
              },
            });
            //console.log(`Successfully registered new user: ${user.email}`);
          } catch (createError) {
            console.error("Error creating new user during registration:", createError);
            // This error is typically for DB issues during creation, not email conflict if !user was true.
            throw new Error("Registration failed due to a server error. Please try again.");
          }
        } else {
          // 3. If user DOES exist, this is a login attempt, or an attempt to register with an existing email.
          // Check if the existing user has a password for credentials login.
          if (!user.password) {
            throw new Error("This account was not set up with a password. Please use another login method (e.g., OAuth).");
          }

          const isValidPassword = await bcrypt.compare(credentials.password, user.password);

          if (!isValidPassword) {
            // This error is for INCORRECT PASSWORD for an existing user.
            throw new Error("Invalid email or password.");
          }

          // If password is valid, but the user was trying to 'register' with an existing email.
          // This scenario is handled by the client-side 'isLogin' toggle, but we can clarify.
          // NextAuth's `authorize` doesn't know if the client intended 'login' or 'register'.
          // It just tries to authenticate. If it succeeds on an existing user, it logs them in.
          // If a user tried to 'register' with an existing email and correct password, they'll simply log in.
          // If they tried to 'register' with an existing email and *wrong* password, they get "Invalid email or password."
          // This is the expected, albeit sometimes confusing, behavior for a combined `authorize` callback.
        }

        // 4. If we reach here, either an existing user was authenticated or a new user was successfully registered.
        // Return the user object. This object will be available in the 'jwt' and 'session' callbacks.
        // ONLY include what you need for the session here; sensitive data like password should NOT be returned.
        return {
          id: user.id,
          email: user.email,
          name: user.email, // Use name if available, otherwise email
        };
      },
    }),
    // You can add other providers here (e.g., GitHubProvider, GoogleProvider)
  ],
  // Callbacks are used to control the JWT and session data.
  callbacks: {
    // The 'jwt' callback is called whenever a JWT is created or updated.
    // It's a good place to add custom data to the JWT payload.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Add user ID to the JWT
        token.email = user.email; // Add email to the JWT
        token.name = user.name; // Add name to the JWT
      }
      return token;
    },
    // The 'session' callback is called whenever a session is checked.
    // It's a good place to expose custom data from the JWT to the client-side session.
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string; // Expose user ID to session.user
        session.user.email = token.email as string; // Expose email to session.user
        session.user.name = token.name as string; // Expose name to session.user
      }
      return session;
    },
  },
  // Custom pages for NextAuth.js flows (e.g., sign-in, error pages).
  pages: {
    signIn: "/auth", // Redirects to /auth for login/register
    error: "/auth", // Redirects to /auth page for errors (NextAuth.js will append `?error=...`)
  },
  // The secret used to sign and encrypt cookies. Must be a strong, random string.
  secret: process.env.NEXTAUTH_SECRET,
};
