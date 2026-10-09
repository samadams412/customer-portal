import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth-server";

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
