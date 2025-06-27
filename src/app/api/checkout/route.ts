// /app/api/checkout/route.ts
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  
});

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // TODO: add useAuthRedirect

  const body = await req.json(); // Should contain items: [{ name, price, quantity }]
  const { cartItems, deliveryType, shippingAddressId } = body;
  const line_items = cartItems.map((item: { product: { name: any; description: any; price: number; }; quantity: any; }) => ({
  price_data: {
    currency: 'usd',
    product_data: {
      name: item.product.name
      // images: [item.product.imageUrl], // optional
    },
    unit_amount: Math.round(item.product.price * 100), // in cents
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
      cartItems: JSON.stringify(cartItems),
      deliveryType,
      shippingAddressId: shippingAddressId || "",
    },
  });

  return NextResponse.json({ url: session.url });
}
