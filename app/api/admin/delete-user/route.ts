import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit } from "@/lib/rate-limiter";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting Check (Max 15 admin delete actions per minute)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown-admin";
    const rateCheck = checkRateLimit(`admin-delete-${ip}`, { limit: 15, windowSeconds: 60 });
    
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many admin requests. Please wait a minute." },
        { status: 429 }
      );
    }

    // 2. Authorization Header Verification — MANDATORY
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: Authentication token required" }, { status: 401 });
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: { Authorization: `Bearer ${token}` } }
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser(token);
    
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized access: invalid token" }, { status: 401 });
    }

    // Check caller's role in profiles table
    const { data: callerProfile } = await userClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!callerProfile || (callerProfile.role !== "admin" && callerProfile.role !== "super-admin")) {
      return NextResponse.json({ error: "Forbidden: Admin or Super-Admin privileges required" }, { status: 403 });
    }

    const { userId } = await req.json();

    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "Valid User ID is required" }, { status: 400 });
    }

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "Supabase configuration missing" }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // 3. Delete from profiles table
    await supabaseAdmin.from("profiles").delete().eq("id", userId);

    // 4. Try deleting from auth.users via admin API if service role key is available
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { error: deleteAuthErr } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (deleteAuthErr) {
        console.warn("Supabase auth.admin.deleteUser warning:", deleteAuthErr.message);
      }
    }

    // 5. Call RPC fallback if created in Supabase
    try {
      await supabaseAdmin.rpc("delete_user_by_admin", { user_id: userId });
    } catch (e) {}

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to delete user" }, { status: 500 });
  }
}
