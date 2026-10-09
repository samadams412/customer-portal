import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { CartItem } from "@/types/interface";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const {
    cartItems,
    deliveryType,
    shippingAddressId,
    discountCode, // now expected from frontend
  }: {
    cartItems: CartItem[];
    deliveryType: "PICKUP" | "DELIVERY";
    shippingAddressId?: string;
    discountCode?: string | null;
  } = await req.json();

  if (!cartItems?.length) {
    return NextResponse.json({ error: "No cart items provided" }, { status: 400 });
  }

  const deliveryTypeEnum = deliveryType === "DELIVERY" ? "DELIVERY" : "PICKUP";

  // Re-fetch products from the DB so price and stock come from a trusted source,
  // never from the client-sent cart.
  const dbProducts = await prisma.product.findMany({
    where: { id: { in: cartItems.map((item) => item.product.id) } },
  });
  const dbProductsById = new Map(dbProducts.map((p) => [p.id, p]));

  const missing = cartItems.filter((item) => !dbProductsById.has(item.product.id));
  if (missing.length > 0) {
    return NextResponse.json({ error: "One or more products no longer exist" }, { status: 400 });
  }

  const outOfStock = cartItems
    .map((item) => dbProductsById.get(item.product.id)!)
    .filter((product) => !product.inStock);
  if (outOfStock.length > 0) {
    return NextResponse.json(
      { error: `Out of stock: ${outOfStock.map((p) => p.name).join(", ")}` },
      { status: 400 }
    );
  }

  const subtotalAmount = cartItems.reduce(
    (sum, item) => sum + dbProductsById.get(item.product.id)!.price * item.quantity,
    0
  );

  const taxAmount = subtotalAmount * 0.0825;

  // Optional: Handle discount code
  let discountPercentage = 0;
  let discountCodeRecord = null;

  if (discountCode) {
    discountCodeRecord = await prisma.discountCode.findUnique({
      where: { code: discountCode.toUpperCase() },
    });

    if (discountCodeRecord && (!discountCodeRecord.expiresAt || discountCodeRecord.expiresAt > new Date())) {
      discountPercentage = discountCodeRecord.percentage;
    } else {
      discountCodeRecord = null; // not valid
    }
  }

  let stripeCouponId: string | undefined = undefined;

if (discountPercentage > 0) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
    name: discountCodeRecord?.code || `Custom-${discountPercentage}%`,
  });

  stripeCouponId = coupon.id;
}


  const discountAmount = subtotalAmount * (discountPercentage / 100);
  const totalAmount = subtotalAmount + taxAmount - discountAmount;

const newOrder = await prisma.order.create({
  data: {
    userId: user.id,
    subtotalAmount,
    taxAmount,
    totalAmount,
    deliveryType: deliveryTypeEnum,
    shippingAddressId: deliveryTypeEnum === "DELIVERY" ? shippingAddressId : null,
    status: "PENDING",
    discountCodeId: discountCodeRecord?.id || null, // ✅ Direct FK assignment
    orderItems: {
      create: cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        priceAtPurchase: dbProductsById.get(item.product.id)!.price,
      })),
    },
  },
});


  const line_items = cartItems.map((item) => {
    const dbProduct = dbProductsById.get(item.product.id)!;
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: dbProduct.name,
        },
        unit_amount: Math.round(dbProduct.price * 100),
      },
      quantity: item.quantity,
    };
  });

  const baseUrl =
    process.env.VERCEL === "1"
      ? "https://customer-portal-alpha-nine.vercel.app"
      : "http://localhost:3000";

const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  mode: "payment",
  line_items,
  discounts: stripeCouponId ? [{ coupon: stripeCouponId }] : [],
  success_url: `${baseUrl}/order-success?orderId=${newOrder.id}`,
  cancel_url: `${baseUrl}`,
  payment_intent_data: {
    metadata: {
      orderId: newOrder.id,
      deliveryType: deliveryTypeEnum,
      shippingAddressId: deliveryTypeEnum === "DELIVERY" ? shippingAddressId || "" : "",
      discountCode: discountCodeRecord?.code || "",
    },
  },
});


  return NextResponse.json({ url: session.url });
}
