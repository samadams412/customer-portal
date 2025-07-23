import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || "";
  // Ensure sortBy matches the Prisma model fields ("price" or "inStock")
  const sortBy = searchParams.get("sortBy");
  const sortOrder = searchParams.get("order") === "desc" ? "desc" : "asc";
  const category = searchParams.get("category") || "";

  try {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
        ...(category && { category }), // Add category filter if provided
      },
      orderBy: sortBy
        ? {
            // Dynamically set the orderBy field based on sortBy parameter
            [sortBy === "price" ? "price" : "inStock"]: sortOrder,
          }
        : undefined,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/products error:", error);
    // Provide a more generic error message to the client
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
