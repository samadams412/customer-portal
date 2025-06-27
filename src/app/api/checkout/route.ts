// /app/api/checkout/route.ts
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {

});

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { cartItems, deliveryType, shippingAddressId } = body;

  if (!cartItems?.length) {
    return NextResponse.json({ error: "No cart items provided" }, { status: 400 });
  }

  const line_items = cartItems.map((item: any) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.product.name,
        // Optionally include: description, images, etc.
      },
      unit_amount: Math.round(item.product.price * 100), // convert to cents
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
    metadata: {
      userId: user.id,
      deliveryType,
      shippingAddressId: shippingAddressId || "",
      cartItems: JSON.stringify(
        cartItems.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
        }))
      ),
    },
  });

  return NextResponse.json({ url: session.url });
}
