import { NextResponse } from "next/server";
import { signToken, verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("su_refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token provided" }, { status: 401 });
    }

    // Verify the refresh token (enforces HS256)
    const payload = await verifyToken(refreshToken);

    // Refresh Token Rotation: Generate new tokens
    const newAccessToken = await signToken({ sub: payload.sub, role: payload.role }, "15m");
    const newRefreshToken = await signToken({ sub: payload.sub, role: payload.role }, "7d");

    // Set the new refresh token (Rotate)
    cookieStore.set("su_refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return NextResponse.json({
      accessToken: newAccessToken,
    });

  } catch (err: any) {
    // If token is invalid or expired, clear the cookie
    const cookieStore = await cookies();
    cookieStore.delete("su_refresh_token");
    return NextResponse.json({ error: "Invalid refresh token. Please login again." }, { status: 401 });
  }
}
