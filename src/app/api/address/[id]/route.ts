import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth-server"; // Import the new session helper
import { isValidUUID } from "@/lib/validators"; // Utility for UUID validation 

// Define the expected shape for updating an address
interface UpdateAddressPayload {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  isDefault?: boolean;
}

// Update User Address
// --- PUT /api/address/[id] (Update Specific Address) ---

// lots of type errors with params
// FIX: Reverted type to Promise to satisfy Next.js build
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }
) {
  // FIX: Access id after awaiting context.params
  const { id: addressId } = await context.params;

  if (!isValidUUID(addressId)) {
    return NextResponse.json({ error: "Invalid address ID format" }, { status: 400 });
  }

  try {
    const body: UpdateAddressPayload = await request.json();
    if (Object.keys(body).length === 0) {
      return NextResponse.json({ error: "No fields provided for update" }, { status: 400 });
    }

    // First, find the address and ensure it belongs to the authenticated user
    const user = await getSessionUser(); // Fetch user inside the handler
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingAddress = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!existingAddress || existingAddress.userId !== user.id) {
      return NextResponse.json({ error: "Address not found or unauthorized" }, { status: 404 });
    }

    // If setting to default, ensure other default for this user is unset
    if (body.isDefault === true) {
      await prisma.address.updateMany({
        where: {
          userId: user.id,
          isDefault: true,
          id: { not: addressId } // Don't unset the current address if it's already default
        },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: { ...body },
    });

    return NextResponse.json(updatedAddress, { status: 200 });
  } catch (error: unknown) {
    console.error(`PUT /api/address/${addressId} error:`, error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 });
  }
}

// Delete User Address
// --- DELETE /api/address/[id] (Delete Specific Address) ---
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> } 
) {
 
  const { id: addressId } = await context.params;

  if (!isValidUUID(addressId)) {
    return NextResponse.json({ error: "Invalid address ID format" }, { status: 400 });
  }

  try {
    // Authenticate the user using NextAuth.js session
    const user = await getSessionUser(); // Fetch user inside the handler
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the address and ensure it belongs to the authenticated user
    const existingAddress = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!existingAddress || existingAddress.userId !== user.id) {
      return NextResponse.json({ error: "Address not found or unauthorized" }, { status: 404 });
    }

    const deletedAddress = await prisma.address.delete({
      where: { id: addressId },
    });

    return NextResponse.json({ message: "Address deleted successfully", id: deletedAddress.id }, { status: 200 });
  } catch (error: unknown) {
    console.error(`DELETE /api/address/${addressId} error:`, error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 });
  }
}
