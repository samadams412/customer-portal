import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth-server";

// --- Expected input payload directly from frontend cart ---
interface PlaceOrderPayload {
  deliveryType: "DELIVERY" | "PICKUP";
  shippingAddressId?: string;
  discountCode?: string; // code string from client
  items: {
    productId: string;
    quantity: number;
    priceAtPurchase: number;
  }[];
}

// --- POST /api/orders ---
export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      shippingAddressId,
      deliveryType,
      discountCode,
      items,
    }: PlaceOrderPayload = await request.json();

    if (!deliveryType || (deliveryType === "DELIVERY" && !shippingAddressId)) {
      return NextResponse.json(
        { error: "Missing delivery type or shipping address" },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items to order" }, { status: 400 });
    }

    // Calculate subtotal and tax
    const subtotalAmount = items.reduce(
      (sum, item) => sum + item.priceAtPurchase * item.quantity,
      0
    );
    const taxAmount = subtotalAmount * 0.0825;

    // Lookup discountCode if provided
    let discountAmount = 0;
    let discountCodeRecord: { id: string; percentage: number } | null = null;

    if (discountCode) {
      const found = await prisma.discountCode.findUnique({
        where: { code: discountCode.toUpperCase() },
        select: { id: true, percentage: true, expiresAt: true },
      });

      if (found && (!found.expiresAt || found.expiresAt > new Date())) {
        discountCodeRecord = found;
        discountAmount = subtotalAmount * (found.percentage / 100);
      }
    }

    const totalAmount = subtotalAmount + taxAmount - discountAmount;

    // Create order and order items in transaction
    const order = await prisma.$transaction(async (tx) => {
      const data: any = {
        userId: user.id,
        subtotalAmount: parseFloat(subtotalAmount.toFixed(2)),
        taxAmount: parseFloat(taxAmount.toFixed(2)),
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        deliveryType,
        status: "PENDING",
        shippingAddressId: deliveryType === "DELIVERY" ? shippingAddressId ?? null : null,
      };

      if (discountCodeRecord) {
        data.discountCode = { connect: { id: discountCodeRecord.id } };
      }

      const newOrder = await tx.order.create({ data });

      await tx.orderItem.createMany({
        data: items.map((item) => ({
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: item.priceAtPurchase,
        })),
      });

      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });

  } catch (error: unknown) {
    console.error("POST /api/orders error:", error);
    const message = error instanceof Error ? error.message : "Failed to place order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// --- GET /api/orders ---
export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const sortBy = url.searchParams.get("sortBy") ?? "date";
    const sortOrder = url.searchParams.get("order") ?? "desc";

    const orderByClause =
      sortBy === "amount"
        ? { totalAmount: sortOrder as "asc" | "desc" }
        : { orderDate: sortOrder as "asc" | "desc" };

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        orderItems: { include: { product: true } },
        shippingAddress: true,
      },
      orderBy: orderByClause,
    });

    return NextResponse.json(orders, { status: 200 });

  } catch (error: unknown) {
    console.error("GET /api/orders error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch orders";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
