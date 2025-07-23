import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || "";
  const sortByParam = searchParams.get("sortBy");
  const sortOrder = searchParams.get("order") === "desc" ? "desc" : "asc";

  const category = searchParams.get("category") || "";

  // Validate sortBy
  const validSortBy = sortByParam === "price" || sortByParam === "inStock" ? sortByParam : null;

  try {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
        ...(category && {
          category: {
            equals: category,
          },
        }),
      },
      orderBy: validSortBy
        ? {
            [validSortBy]: sortOrder,
          }
        : undefined,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
