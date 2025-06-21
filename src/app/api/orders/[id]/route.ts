// src/app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth"; // Assuming withAuth middleware is available
import { isValidUUID } from "@/lib/validators"; // Utility for UUID validation

// --- GET /api/orders/[id] (Fetch Single Order by ID) ---
// Fetches a specific order for the authenticated user by its ID.
export const GET = withAuth(async (
  request: NextRequest,
  user,
  // Using Promise typing for context.params to resolve potential build errors
  // consistent with your other dynamic routes.
  context: { params: Promise<{ id: string }> }
) => {
  const { id: orderId } = await context.params; // Get the order ID from dynamic route params

  if (!isValidUUID(orderId)) {
    return NextResponse.json({ error: "Invalid order ID format" }, { status: 400 });
  }

  try {
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
});


