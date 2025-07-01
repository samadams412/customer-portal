// src/lib/prisma.ts
// This file initializes the Prisma Client for use throughout the application.
// It uses a singleton pattern to ensure only one instance of PrismaClient is created,
// and extends it with Prisma Accelerate for optimized serverless performance.

import { PrismaClient } from '@prisma/client'; // FIX: Changed from '@prisma/client/edge' back to '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'; // Import the Accelerate extension

// Function to create and extend the PrismaClient instance
const prismaClientSingleton = () => {
  return new PrismaClient({
    // Optional: Configure logging for Prisma queries in development
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  }).$extends(withAccelerate()); // Extend with Accelerate for connection pooling and caching
};

// Define a type for the extended PrismaClient instance
// This type accurately reflects the client after extensions have been applied.
export type ExtendedPrismaClient = ReturnType<typeof prismaClientSingleton>;

// Declare a global variable to store the PrismaClient instance.
// This is necessary to maintain a single instance across hot reloads in development.
declare global {
  
  var prismaGlobal: ExtendedPrismaClient | undefined;
}

// Export the singleton PrismaClient instance.
// In development, it's stored on the global object; in production, a new instance is created.
export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// In development, attach the PrismaClient instance to the global object
// to prevent multiple instances during hot module replacement.
if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}
