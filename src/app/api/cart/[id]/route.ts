// src/app/api/cart/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/auth"; // Assuming withAuth middleware is available
import { isValidUUID } from "@/lib/validators"; // Utility for UUID validation

// Interface for the payload when updating a cart item
interface UpdateCartItemPayload {
  quantity?: number;
}

// --- PUT /api/cart/[id] (Update Specific Cart Item Quantity) ---
// Updates the quantity of a specific cart item for the authenticated user.
export const PUT = withAuth(async (
  request: NextRequest,
  user,
  // FIX: Apply Promise typing to context.params to resolve build errors
  context: { params: Promise<{ id: string }> }
) => {
  const { id: cartItemId } = await context.params; // FIX: Await context.params

  if (!isValidUUID(cartItemId)) {
    return NextResponse.json({ error: "Invalid cart item ID format" }, { status: 400 });
  }

  try {
    const { quantity }: UpdateCartItemPayload = await request.json();

    if (typeof quantity !== 'number' || quantity <= 0) {
      return NextResponse.json({ error: "Invalid quantity provided" }, { status: 400 });
    }

    const existingCartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        cart: true
      }
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
});

// --- DELETE /api/cart/[id] (Remove Specific Cart Item) ---
// Removes a specific cart item from the authenticated user's cart.
export const DELETE = withAuth(async (
  request: NextRequest,
  user,
  // FIX: Apply Promise typing to context.params to resolve build errors
  context: { params: Promise<{ id: string }> }
) => {
  const { id: cartItemId } = await context.params; // FIX: Await context.params

  if (!isValidUUID(cartItemId)) {
    return NextResponse.json({ error: "Invalid cart item ID format" }, { status: 400 });
  }

  try {
    const existingCartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        cart: true
      }
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
});

// Optional: GET /api/cart/[id] to fetch a single cart item if needed (less common than fetching full cart)
export const GET = withAuth(async (
    request: NextRequest,
    user,
    // FIX: Apply Promise typing to context.params to resolve build errors
    context: { params: Promise<{ id: string }> }
) => {
    const { id: cartItemId } = await context.params; // FIX: Await context.params

    if (!isValidUUID(cartItemId)) {
        return NextResponse.json({ error: "Invalid cart item ID format" }, { status: 400 });
    }

    try {
        const cartItem = await prisma.cartItem.findUnique({
            where: { id: cartItemId },
            include: {
                product: true,
                cart: true
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
});
