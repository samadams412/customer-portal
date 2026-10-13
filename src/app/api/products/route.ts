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

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize")) || 20));

  const where = {
    name: {
      contains: search,
      mode: "insensitive" as const,
    },
    ...(category && {
      category: {
        equals: category,
      },
    }),
  };

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: validSortBy
          ? {
              [validSortBy]: sortOrder,
            }
          : undefined,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ products, total, page, pageSize });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
