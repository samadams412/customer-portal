import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth-server";

// Define the expected shape for creating an address
interface CreateAddressPayload {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean; 
}

// Add User Address
// --- POST /api/address (Create Address) ---
export async function POST(request: NextRequest) {
  // Authenticate the user using NextAuth.js session
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
}

// Get User Address
// --- GET /api/address (Fetch All Addresses for User) ---
export async function GET(_request: NextRequest) {
  // Authenticate the user using NextAuth.js session
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
}
