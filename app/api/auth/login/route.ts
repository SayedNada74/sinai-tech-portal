import { NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Initialize Supabase admin client for backend validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // 1. Authenticate user using Supabase to verify credentials securely
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return NextResponse.json({ error: "بيانات الدخول غير صحيحة" }, { status: 401 });
    }

    const userId = authData.user.id;

    // Fetch user role from profiles
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    const role = profile?.role || "student";

    // 2. Generate Custom JWTs (as requested by User)
    const payload = { sub: userId, role };
    
    // Access Token: Short-lived (15 minutes)
    const accessToken = await signToken(payload, "15m");
    
    // Refresh Token: Long-lived (7 days) for HttpOnly Cookie rotation
    const refreshToken = await signToken(payload, "7d");

    // 3. Set HttpOnly + Secure + SameSite=Strict Cookie for Refresh Token
    const cookieStore = await cookies();
    cookieStore.set("su_refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    // 4. Return Access Token in JSON body (to be kept in memory by frontend)
    return NextResponse.json({
      accessToken,
      user: {
        id: userId,
        email: authData.user.email,
        role,
      }
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
