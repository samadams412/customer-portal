// src/app/api/cart/[id]/route.ts
// This route manages specific cart items (update quantity, remove item, fetch single item).

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth-server"; // Import the new session helper
import { isValidUUID } from "@/lib/validators"; // Utility for UUID validation

// Interface for the payload when updating a cart item
interface UpdateCartItemPayload {
  quantity?: number;
}

// --- PUT /api/cart/[id] (Update Specific Cart Item Quantity) ---
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // FIX: Reverted type to Promise to satisfy Next.js build
) {
  // FIX: Access id after awaiting context.params
  const { id: cartItemId } = await context.params;

  if (!isValidUUID(cartItemId)) {
    return NextResponse.json({ error: "Invalid cart item ID format" }, { status: 400 });
  }

  try {
    const { quantity }: UpdateCartItemPayload = await request.json();

    if (typeof quantity !== 'number' || quantity <= 0) {
      return NextResponse.json({ error: "Invalid quantity provided" }, { status: 400 });
    }

    // Authenticate the user using NextAuth.js session
    const user = await getSessionUser(); // Fetch user inside the handler
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the cart item and ensure it belongs to the authenticated user's cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true } // Include cart to check userId
    });

    if (!existingCartItem || existingCartItem.cart.userId !== user.id) {
      return NextResponse.json({ error: "Cart item not found or unauthorized" }, { status: 404 });
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: quantity },
      include: { product: true }
    });

    return NextResponse.json(updatedCartItem, { status: 200 });
  } catch (error: unknown) {
    console.error(`PUT /api/cart/${cartItemId} error:`, error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 });
  }
}

// --- DELETE /api/cart/[id] (Remove Specific Cart Item) ---
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // FIX: Reverted type to Promise to satisfy Next.js build
) {
  // FIX: Access id after awaiting context.params
  const { id: cartItemId } = await context.params;

  if (!isValidUUID(cartItemId)) {
    return NextResponse.json({ error: "Invalid cart item ID format" }, { status: 400 });
  }

  try {
    // Authenticate the user using NextAuth.js session
    const user = await getSessionUser(); // Fetch user inside the handler
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the cart item and ensure it belongs to the authenticated user's cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { cart: true } // Include cart to check userId
    });

    if (!existingCartItem || existingCartItem.cart.userId !== user.id) {
      return NextResponse.json({ error: "Cart item not found or unauthorized" }, { status: 404 });
    }

    const deletedCartItem = await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return NextResponse.json({ message: "Cart item deleted successfully", id: deletedCartItem.id }, { status: 200 });
  } catch (error: unknown) {
    console.error(`DELETE /api/cart/${cartItemId} error:`, error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to delete cart item" }, { status: 500 });
  }
}

// --- GET /api/cart/[id] (Fetch Single Cart Item) ---
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> } // FIX: Reverted type to Promise to satisfy Next.js build
) {
    // FIX: Access id after awaiting context.params
    const { id: cartItemId } = await context.params;

    if (!isValidUUID(cartItemId)) {
        return NextResponse.json({ error: "Invalid cart item ID format" }, { status: 400 });
    }

    try {
        // Authenticate the user using NextAuth.js session
        const user = await getSessionUser(); // Fetch user inside the handler
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const cartItem = await prisma.cartItem.findUnique({
            where: { id: cartItemId },
            include: {
                product: true,
                cart: true // Include cart to verify ownership
            }
        });

        if (!cartItem || cartItem.cart.userId !== user.id) {
            return NextResponse.json({ error: "Cart item not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json(cartItem, { status: 200 });
    } catch (error: unknown) {
        console.error(`GET /api/cart/${cartItemId} error:`, error);
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Failed to retrieve cart item" }, { status: 500 });
    }
}
