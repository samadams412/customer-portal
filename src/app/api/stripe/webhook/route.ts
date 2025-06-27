// src/app/api/stripe/webhook/route.ts
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { buffer } from "node:stream/consumers";
import Stripe from "stripe";
import { Readable } from "stream";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {

});

const endpointSecret = process.env.ENDPOINT_SECRET!;

export async function POST(req: Request) {
  
const body = req.body ? Readable.fromWeb(req.body as any) : undefined;
if (!body) {
  return new Response("No body provided", { status: 400 });
}
const rawBody = await buffer(body);
  let event: Stripe.Event;

  try {
    const signature = (await headers()).get("stripe-signature");
    event = stripe.webhooks.constructEvent(rawBody, signature!, endpointSecret);
  } catch (err: any) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "charge.succeeded") {
    const charge = event.data.object as Stripe.Charge;

    try {
      const metadata = charge.metadata;

      const userId = metadata.userId;
      const deliveryType = metadata.deliveryType === "DELIVERY" ? "DELIVERY" : "PICKUP";
      const shippingAddressId = metadata.shippingAddressId || null;
      const cartItems = JSON.parse(metadata.cartItems || "[]");

      if (!userId || !cartItems.length) {
        console.warn("❗ Missing metadata for order creation.");
        return new Response("Missing data", { status: 400 });
      }

      // Order pricing logic
      const subtotalAmount = cartItems.reduce(
        (sum: number, item: any) => sum + item.product.price * item.quantity,
        0
      );

      const taxRate = 0.0825;
      const taxAmount = subtotalAmount * taxRate;
      const totalAmount = subtotalAmount + taxAmount;

      // Create Order and OrderItems in DB
      const newOrder = await prisma.order.create({
        data: {
          userId,
          subtotalAmount,
          taxAmount,
          totalAmount,
          deliveryType,
          shippingAddressId,
          status: "PROCESSING",
          orderItems: {
            create: cartItems.map((item: any) => ({
              productId: item.product.id,
              quantity: item.quantity,
              priceAtPurchase: item.product.price,
            })),
          },
        },
      });

      console.log("✅ Order created:", newOrder.id);
    } catch (error: any) {
      console.error("❌ Error processing charge.succeeded:", error.message);
      return new Response("Internal Server Error", { status: 500 });
    }
  }

  return new Response("Received", { status: 200 });
}
