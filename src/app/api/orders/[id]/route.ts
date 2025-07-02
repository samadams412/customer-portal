// src/app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth-server"; // Import the new session helper
import { isValidUUID } from "@/lib/validators"; // Utility for UUID validation

// --- GET /api/orders/[id] (Fetch Single Order by ID) ---
// Fetches a specific order for the authenticated user by its ID.
// FIX: Reverted type to Promise to satisfy Next.js build

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  // FIX: Access id after awaiting context.params
  const { id: orderId } = await context.params;

  if (!isValidUUID(orderId)) {
    return NextResponse.json({ error: "Invalid order ID format" }, { status: 400 });
  }

  try {
    // Authenticate the user using NextAuth.js session
    const user = await getSessionUser(); // Fetch user inside the handler
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        userId: user.id, // Ensure the order belongs to the authenticated user
      },
      include: {
        orderItems: {
          include: {
            product: true, // Include product details for each item in the order
          },
        },
        shippingAddress: true, // Include the shipping address details if available
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error: unknown) {
    console.error(`GET /api/orders/${orderId} error:`, error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to retrieve order" }, { status: 500 });
  }
}

