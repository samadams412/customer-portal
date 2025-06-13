import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || "";
  // Ensure sortBy matches the Prisma model fields ("price" or "inStock")
  const sortBy = searchParams.get("sortBy");
  const sortOrder = searchParams.get("order") === "desc" ? "desc" : "asc";

  try {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive", // Case-insensitive search
        },
      },
      orderBy: sortBy
        ? {
            // Dynamically set the orderBy field based on sortBy parameter
            [sortBy === "price" ? "price" : "inStock"]: sortOrder,
          }
        : undefined, // No specific order if sortBy is not provided
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/products error:", error);
    // Provide a more generic error message to the client
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
