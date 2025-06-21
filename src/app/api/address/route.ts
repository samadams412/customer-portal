// src/app/api/address/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth"; // Assuming you have withAuth middleware for protection

// Define the expected shape for creating an address
interface CreateAddressPayload {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean; // Optional: client can suggest if it's default
}

// --- POST /api/address (Create Address) ---
export const POST = withAuth(async (request: NextRequest, user) => {
  try {
    const body: CreateAddressPayload = await request.json();
    const { street, city, state, zipCode, isDefault = false } = body;

    // Basic validation
    if (!street || !city || !state || !zipCode) {
      return NextResponse.json({ error: "Missing required address fields" }, { status: 400 });
    }

    // Check if the user already has a default address if the new one is marked as default
    if (isDefault) {
      const existingDefaultAddress = await prisma.address.findFirst({
        where: {
          userId: user.id,
          isDefault: true,
        },
      });

      // If an existing default is found, update it to be non-default
      if (existingDefaultAddress) {
        await prisma.address.update({
          where: { id: existingDefaultAddress.id },
          data: { isDefault: false },
        });
      }
    }

    // Create the new address
    const newAddress = await prisma.address.create({
      data: {
        street,
        city,
        state,
        zipCode,
        isDefault,
        userId: user.id, // Link to the authenticated user
      },
    });

    return NextResponse.json(newAddress, { status: 201 }); // 201 Created
  } catch (error: unknown) {
    console.error("POST /api/address error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to create address" }, { status: 500 });
  }
});

// --- GET /api/address (Fetch All Addresses for User) ---
export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    const addresses = await prisma.address.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        isDefault: 'desc', // Show default address first
      },
    });

    return NextResponse.json(addresses, { status: 200 });
  } catch (error: unknown) {
    console.error("GET /api/address error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 });
  }
});
