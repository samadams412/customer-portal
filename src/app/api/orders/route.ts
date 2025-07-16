import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth-server";

// --- Expected input payload directly from frontend cart ---
interface PlaceOrderPayload {
  deliveryType: "DELIVERY" | "PICKUP";
  shippingAddressId?: string;
  discountCode?: string;
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

    // --- Calculate totals ---
    const subtotalAmount = items.reduce(
      (total, item) => total + item.priceAtPurchase * item.quantity,
      0
    );

    const taxRate = 0.0825;
    const taxAmount = subtotalAmount * taxRate;
    const discountAmount = discountCode ? subtotalAmount * 0.10 : 0;
    const totalAmount = subtotalAmount + taxAmount - discountAmount;

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          subtotalAmount: parseFloat(subtotalAmount.toFixed(2)),
          taxAmount: parseFloat(taxAmount.toFixed(2)),
          discountAmount: parseFloat(discountAmount.toFixed(2)),
          discountCode: discountCode || null,
          totalAmount: parseFloat(totalAmount.toFixed(2)),
          deliveryType,
          status: "PENDING",
          shippingAddressId: deliveryType === "DELIVERY" ? shippingAddressId : null,
        },
      });

      const orderItemsData = items.map((item) => ({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase,
      }));

      await tx.orderItem.createMany({ data: orderItemsData });

      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });
    } catch (error: unknown) {
      console.error("POST /api/orders error:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Failed to place order";

      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }
}

// --- GET /api/orders ---
export async function GET(_request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(_request.url);
    const sortBy = url.searchParams.get("sortBy") ?? "date";   // 'date' or 'amount'
    const sortOrder = url.searchParams.get("order") ?? "desc"; // 'asc' or 'desc'

    const orderByClause =
      sortBy === "amount"
        ? { totalAmount: sortOrder as "asc" | "desc" }
        : { orderDate: sortOrder as "asc" | "desc" };
        
    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
      orderBy: orderByClause,
    });

    return NextResponse.json(orders, { status: 200 });
    } catch (error: unknown) {
      console.error("GET /api/orders error:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch orders";

      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }
  }
