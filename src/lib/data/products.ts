import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/types/product"; // Assuming product.ts is in types folder

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy");
  const sortOrder = searchParams.get("order") === "desc" ? "desc" : "asc";

  try {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive", // Case-insensitive search, supported by PostgreSQL
        },
      },
      orderBy: sortBy
        ? {
            [sortBy === "price" ? "price" : "inStock"]: sortOrder,
          }
        : undefined,
    });

    // Manually convert Date objects to string to match the Product interface
    const productsToSend: Product[] = products.map((product) => ({
      ...product,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(), 
    }));

    return NextResponse.json(productsToSend);
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
