// ✅ /app/api/stripe/webhook/route.ts — UPDATE ORDER ON PAYMENT
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { buffer } from "node:stream/consumers";
import Stripe from "stripe";
import { Readable } from "stream";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});
const endpointSecret = process.env.ENDPOINT_SECRET!;

export async function POST(req: Request) {
  const bodyStream = req.body ? Readable.fromWeb(req.body as any) : undefined;
  if (!bodyStream) {
    return new Response("No body provided", { status: 400 });
  }
  const rawBody = await buffer(bodyStream);

  let event: Stripe.Event;
  try {
    const signature = (await headers()).get("stripe-signature")!;
    event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Invalid Stripe signature";
    console.error("⚠️ Webhook signature verification failed:", message);
    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  if (event.type === "charge.succeeded") {
    const charge = event.data.object as Stripe.Charge;
    const orderId = charge.metadata?.orderId;

    if (!orderId) {
      console.error("❌ Missing orderId in metadata");
      return new Response("Missing orderId", { status: 400 });
    }

    try {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "PROCESSING" },
      });
      //console.log("✅ Order marked as PROCESSING:", orderId);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Unknown database error";
        console.error("❌ Failed to update order status:", message);
        return new Response("Failed to update order", { status: 500 });
      }
  }

  return new Response("Received", { status: 200 });
}
