// ✅ /app/api/checkout/route.ts — CREATE ORDER BEFORE SESSION
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { CartItem } from "@/types/interface";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

   const { cartItems, deliveryType, shippingAddressId }: {
    cartItems: CartItem[];
    deliveryType: "PICKUP" | "DELIVERY";
    shippingAddressId?: string;
  } = await req.json();

  if (!cartItems?.length) {
    return NextResponse.json({ error: "No cart items provided" }, { status: 400 });
  }

  const deliveryTypeEnum = deliveryType === "DELIVERY" ? "DELIVERY" : "PICKUP";

  // Compute subtotal and tax
  const subtotalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
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
      deliveryType: deliveryTypeEnum,
      shippingAddressId: deliveryTypeEnum === "DELIVERY" ? shippingAddressId : null,
      status: "PENDING",
      orderItems: {
        create: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          priceAtPurchase: item.product.price,
        })),
      },
    },
  });

  const line_items = cartItems.map((item) => ({
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
      metadata: {
        orderId: newOrder.id,
        deliveryType: deliveryTypeEnum,
        shippingAddressId: deliveryTypeEnum === "DELIVERY" ? shippingAddressId || "" : "",
      },
    },
  });

  return NextResponse.json({ url: session.url });
}
