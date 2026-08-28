import { NextRequest, NextResponse } from "next/server";
import { signToken, verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { checkRateLimit } from "@/lib/rate-limiter";

export async function POST(req: NextRequest) {
  try {
    // Rate Limiting: Max 10 refresh attempts per minute per IP (process-local, development protection)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
    const rateCheck = checkRateLimit(`auth-refresh-${ip}`, { limit: 10, windowSeconds: 60 });
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many refresh attempts. Please wait." },
        { status: 429, headers: { "Retry-After": `${rateCheck.reset}` } }
      );
    }

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
