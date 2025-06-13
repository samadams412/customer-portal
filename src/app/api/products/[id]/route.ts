import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { isValidUUID } from "@/lib/validators";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  // Workaround to satisfy the Next.js warning:
  // Although 'params' is typically synchronous, this pattern makes it 'await'ed.
  const { id } = await Promise.resolve(params);

  if (!isValidUUID(id)) {
    return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: { id: id }, // Use the 'id' extracted from the awaited 'params'
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
