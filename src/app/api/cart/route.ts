// src/app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server";
// import { Prisma } from '@prisma/client'; // Keep if other Prisma namespace types are used
import { prisma, ExtendedPrismaClient } from "@/lib/prisma"; // Import ExtendedPrismaClient
import { Product } from "@/types/product"; // Keep Product import, it's used implicitly by 'include: { product: true }'
import { withAuth } from "@/lib/auth";

// Interface for the payload when adding/updating a cart item
interface CartItemPayload {
  productId: string;
  quantity: number;
}

// --- GET /api/cart (Fetch User's Cart) ---
// Fetches the authenticated user's cart with all its items and the associated product details.
export const GET = withAuth(async (request: NextRequest, user) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        items: {
          include: {
            product: true, // Product type is implicitly used here for the shape of the returned data
          },
        },
      },
    });

    if (!cart) {
      // If no cart exists, return an empty cart structure
      return NextResponse.json({ userId: user.id, items: [] }, { status: 200 });
    }

    return NextResponse.json(cart, { status: 200 });
  } catch (error: unknown) {
    console.error("GET /api/cart error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
});

// --- POST /api/cart (Add/Update Item in Cart) ---
// Adds a new product to the cart or updates the quantity of an existing item.
export const POST = withAuth(async (request: NextRequest, user) => {
  try {
    const { productId, quantity }: CartItemPayload = await request.json();

    if (!productId || typeof quantity !== 'number' || quantity <= 0) {
      return NextResponse.json({ error: "Invalid product ID or quantity" }, { status: 400 });
    }

    // 1. Find or Create User's Cart
    // This transaction ensures atomicity: either cart is found/created, or the whole operation fails.
    // FIX: Use 'any' type for prismaTx as a workaround for complex type inference issues with Accelerate extension in transactions.
    const cart = await prisma.$transaction(async (prismaTx: any) => { 
      let userCart = await prismaTx.cart.findUnique({
        where: { userId: user.id },
      });

      if (!userCart) {
        userCart = await prismaTx.cart.create({
          data: {
            userId: user.id,
          },
        });
        console.log(`Created new cart for user ${user.id}`);
      }
      return userCart;
    });

    // 2. Check if product exists and is in stock (optional, based on business logic)
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    // You might add a check here for product.inStock if you don't allow out-of-stock items in cart.
    // E.g., if (!product.inStock) { return NextResponse.json({ error: "Product is out of stock" }, { status: 409 }); }


    // 3. Find or Update CartItem
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: { // Unique constraint defined on CartItem model for (cartId, productId)
          cartId: cart.id,
          productId: productId,
        },
      },
    });

    let updatedCartItemResult; 
    if (existingCartItem) {
      // Update quantity if item already exists
      updatedCartItemResult = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
        include: { product: true }, // Include product for response
      });
      console.log(`Updated quantity for cart item ${updatedCartItemResult.id}`);
    } else {
      // Add new item to cart
      updatedCartItemResult = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: quantity,
        },
        include: { product: true }, // Include product for response
      });
      console.log(`Added new cart item ${updatedCartItemResult.id}`);
    }

    // Return the full updated cart
    const fullCart = await prisma.cart.findUnique({
        where: { id: cart.id },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    });

    return NextResponse.json(fullCart, { status: 200 });
  } catch (error: unknown) {
    console.error("POST /api/cart error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 });
  }
});
