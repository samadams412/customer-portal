// api/products/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { isValidUUID } from "@/lib/validators";

export async function GET(
  request: NextRequest,
  // Workaround: Type params as a Promise to satisfy Next.js's internal type checking
  // This is specifically to resolve the build error related to 'Promise<any>' properties
  context: { params: Promise<{ id: string }> } 
) {
  // Await the params object to get the actual id.
  // This satisfies the runtime access and the compile-time 'Promise' expectation.
  const { id } = await context.params;

  if (!isValidUUID(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: unknown) {
    console.error("GET /api/products/[id] error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
