// ✅ /app/api/checkout/route.ts — CREATE ORDER BEFORE SESSION
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { cartItems, deliveryType, shippingAddressId } = body;

  if (!cartItems?.length) {
    return NextResponse.json({ error: "No cart items provided" }, { status: 400 });
  }

  // Compute subtotal and tax
  const subtotalAmount = cartItems.reduce(
    (sum: number, item: any) => sum + item.product.price * item.quantity,
    0
  );
  const taxAmount = subtotalAmount * 0.0825;
  const totalAmount = subtotalAmount + taxAmount;

  // Create order in DB first
  const newOrder = await prisma.order.create({
    data: {
      userId: user.id,
      subtotalAmount,
      taxAmount,
      totalAmount,
      deliveryType: "PICKUP",
      shippingAddressId,
      status: "PENDING",
      orderItems: {
        create: cartItems.map((item: any) => ({
          productId: item.product.id,
          quantity: item.quantity,
          priceAtPurchase: item.product.price,
        })),
      },
    },
  });

  const line_items = cartItems.map((item: any) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.product.name,
      },
      unit_amount: Math.round(item.product.price * 100),
    },
    quantity: item.quantity,
  }));

  const baseUrl =
    process.env.VERCEL === "1"
      ? "https://customer-portal-alpha-nine.vercel.app"
      : "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items,
    success_url: `${baseUrl}/dashboard`,
    cancel_url: `${baseUrl}/cancel`,
    payment_intent_data: {
      // Here we send the orderId in metadata 
      // Stripe webhook will use this to update the order
      metadata: {
        orderId: newOrder.id,
      },
    },
  });

  return NextResponse.json({ url: session.url });
}