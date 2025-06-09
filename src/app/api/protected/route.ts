import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";

export const GET = withAuth(async (req, user) => {
  return NextResponse.json({
    message: "Access granted",
    user,
  });
});
