import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "Supabase configuration missing" }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // 1. Delete from profiles table
    await supabaseAdmin.from("profiles").delete().eq("id", userId);

    // 2. Try deleting from auth.users via admin API if service role key is available
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const { error: deleteAuthErr } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (deleteAuthErr) {
        console.warn("Supabase auth.admin.deleteUser warning:", deleteAuthErr.message);
      }
    }

    // 3. Call RPC fallback if created in Supabase
    try {
      await supabaseAdmin.rpc("delete_user_by_admin", { user_id: userId });
    } catch (e) {}

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to delete user" }, { status: 500 });
  }
}
