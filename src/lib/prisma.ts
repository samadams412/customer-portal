// src/lib/prisma.ts
// This file initializes the Prisma Client for use throughout the application.
// It uses a singleton pattern to ensure only one instance of PrismaClient is created,
// and extends it with Prisma Accelerate for optimized serverless performance.

import { PrismaClient } from '@prisma/client/edge'; // IMPORTANT: Use '/edge' for serverless environments like Vercel
import { withAccelerate } from '@prisma/extension-accelerate'; // Import the Accelerate extension

// Define a type for the singleton PrismaClient instance
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// Function to create and extend the PrismaClient instance
const prismaClientSingleton = () => {
  return new PrismaClient({
    // Optional: Configure logging for Prisma queries in development
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  }).$extends(withAccelerate()); // Extend with Accelerate for connection pooling and caching
};

// Declare a global variable to store the PrismaClient instance.
// This is necessary to maintain a single instance across hot reloads in development.
declare global {
  var prismaGlobal: PrismaClientSingleton | undefined;
}

// Export the singleton PrismaClient instance.
// In development, it's stored on the global object; in production, a new instance is created.
export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// In development, attach the PrismaClient instance to the global object
// to prevent multiple instances during hot module replacement.
if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}
