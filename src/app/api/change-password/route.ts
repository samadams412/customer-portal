// src/app/api/change-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth-server"; // Helper that uses getServerSession
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Find user in DB
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser || !dbUser.password) {
    return NextResponse.json({ error: "User not found or missing password" }, { status: 404 });
  }

  // Check current password
  const isMatch = await bcrypt.compare(currentPassword, dbUser.password);
  if (!isMatch) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
  }

  // Hash and update new password
  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed },
  });

  return NextResponse.json({ success: true });
}
