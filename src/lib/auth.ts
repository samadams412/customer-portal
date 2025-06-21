// src/lib/auth.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret"; // This 'dev-secret' fallback is ONLY for local development.

// Define the expected structure of your JWT payload
interface JwtPayload {
  id: string;
  email: string;
  // Add other properties that you might include in your JWT payload, e.g., roles: string[];
  iat?: number; // Issued at time (standard JWT claim) - optional if you don't always add it
  exp?: number; // Expiration time (standard JWT claim) - optional if you don't always add it
}

// ----- JWT Utilities -----

export function signJwt(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
}

// Explicitly type the return as JwtPayload, or a subset if only some fields are guaranteed
export function verifyJwt<T extends JwtPayload>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch {
    return null;
  }
}

// ----- Middleware for Protected Routes -----

// FIX: Adjust withAuth's handler and wrapper signatures to accept 'context?: any'.
// This provides the necessary flexibility for complex context types (like those involving Promises for params)
// in route handlers, especially when working with Prisma Accelerate.
export function withAuth(
  handler: (req: NextRequest, user: JwtPayload, context?: any) => Promise<NextResponse>
) {
  return async function (req: NextRequest, context?: any) { // Pass context through to the handler
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid authorization header" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const user = verifyJwt<JwtPayload>(token);

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    // Pass the request, user, AND context to the actual handler
    return handler(req, user, context);
  };
}
