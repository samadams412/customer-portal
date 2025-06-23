import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth-server"; // Import the new session helper
import { Product } from "@/types/product"; // Keep Product import if needed for type reference

// Interface for the payload when adding/updating a cart item
interface CartItemPayload {
  productId: string;
  quantity: number;
}

// Get User's Cart
// --- GET /api/cart (Fetch User's Cart) ---
export async function GET(request: NextRequest) {
  // Authenticate the user using NextAuth.js session
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        items: {
          include: {
            product: true, // Include product details for each item
          },
        },
      },
    });

    // If no cart exists for the user, return an empty cart structure
    if (!cart) {
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
}

// Update User's Cart
// --- POST /api/cart (Add/Update Item in Cart) ---
export async function POST(request: NextRequest) {
  // Authenticate the user using NextAuth.js session
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { productId, quantity }: CartItemPayload = await request.json();

    if (!productId || typeof quantity !== 'number' || quantity <= 0) {
      return NextResponse.json({ error: "Invalid product ID or quantity" }, { status: 400 });
    }

    // 1. Find or Create User's Cart (in a transaction for atomicity)
    const cart = await prisma.$transaction(async (prismaTx: { cart: { findUnique: (arg0: { where: { userId: string; }; }) => any; create: (arg0: { data: { userId: string; }; }) => any; }; }) => {
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

    // 2. Check if product exists and is in stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    // Optional: Check if product.inStock and throw error if not

    // 3. Find or Update CartItem
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: { // Composite unique key for cart item
          cartId: cart.id,
          productId: productId,
        },
      },
    });

    let updatedCartItemResult;
    if (existingCartItem) {
      updatedCartItemResult = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity }, // Increment quantity
        include: { product: true },
      });
      console.log(`Updated quantity for cart item ${updatedCartItemResult.id}`);
    } else {
      updatedCartItemResult = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: quantity,
        },
        include: { product: true },
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
}
