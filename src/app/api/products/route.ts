import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy"); // "price" | "availability"
  const sortOrder = searchParams.get("order") === "desc" ? "desc" : "asc";

  try {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      orderBy: sortBy
        ? {
            [sortBy === "price" ? "price" : "inStock"]: sortOrder,
          }
        : undefined,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
