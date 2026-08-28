import { NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { checkRateLimit } from "@/lib/rate-limiter";

// Initialize Supabase admin client for backend validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: Request) {
  try {
    // 1. IP & Rate Limiting Check (Max 6 attempts per minute)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown-client";
    const rateCheck = checkRateLimit(`login-${ip}`, { limit: 6, windowSeconds: 60 });
    
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "تم تجاوز الحد المسموح به من محاولات الدخول. يرجى الانتظار لمدة دقيقة ثم المحاولة مجدداً." },
        { 
          status: 429,
          headers: {
            "Retry-After": `${rateCheck.reset}`,
            "X-RateLimit-Limit": `${rateCheck.limit}`,
            "X-RateLimit-Remaining": "0"
          }
        }
      );
    }

    const { email, password } = await req.json();

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "البريد الإلكتروني وكلمة المرور مطلوبان." }, { status: 400 });
    }

    if (email.length > 254 || password.length > 128) {
      return NextResponse.json({ error: "البيانات المدخلة تتجاوز الطول المسموح به." }, { status: 400 });
    }

    // 2. Authenticate user using Supabase to verify credentials securely
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
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
