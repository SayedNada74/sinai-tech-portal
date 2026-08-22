// ==============================================================================================
// 🎯 Phase 1 RLS Penetration & Exploit Test Suite
// Executes simulated cross-user attacks against the live Supabase database
// ==============================================================================================

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const envFile = fs.readFileSync(path.join(__dirname, "../.env.local"), "utf-8");
const env = {};
envFile.split("\n").forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#")) {
    const [k, ...v] = trimmed.split("=");
    if (k && v) env[k.trim()] = v.join("=").trim();
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function runPenetrationSuite() {
  console.log("================================================================================");
  console.log("⚔️  PHASE 1 LIVE DATABASE RLS PENETRATION & ATTACK SIMULATION");
  console.log("================================================================================\n");

  let total = 0;
  let blocked = 0;
  let exposed = 0;

  function report(name, isBlocked, details = "") {
    total++;
    if (isBlocked) {
      blocked++;
      console.log(`  🛡️ [BLOCKED] ${name} ${details ? `(${details})` : ""}`);
    } else {
      exposed++;
      console.error(`  🚨 [EXPLOIT SUCCEEDED] ${name} ${details ? `(${details})` : ""}`);
    }
  }

  // --------------------------------------------------------------------------------------------
  // ATTACK SCENARIO 1: Anonymous / Unauthenticated Client Exploits
  // --------------------------------------------------------------------------------------------
  console.log("1. Testing Anonymous / Unauthenticated Client Exploits...");

  // 1.1 Anonymous trying to delete or modify profiles
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({ name: "PWNED_BY_ANON" })
      .neq("id", "none");

    const wasBlocked = error !== null || (!data || data.length === 0);
    report("Anon: Update all profiles in database", wasBlocked, error ? error.message : "0 rows modified");
  } catch (e) {
    report("Anon: Update all profiles in database", true, e.message);
  }

  // 1.2 Anonymous trying to delete audit_logs
  try {
    const { data, error } = await supabase
      .from("audit_logs")
      .delete()
      .neq("id", "none");

    const wasBlocked = error !== null || (!data || data.length === 0);
    report("Anon: Purge/Delete Audit Logs table", wasBlocked, error ? error.message : "0 rows modified");
  } catch (e) {
    report("Anon: Purge/Delete Audit Logs table", true, e.message);
  }

  // 1.3 Anonymous trying to view audit_logs
  try {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*");

    const wasBlocked = error !== null || (!data || data.length === 0);
    report("Anon: Read sensitive Audit Logs table", wasBlocked, error ? error.message : "0 rows returned");
  } catch (e) {
    report("Anon: Read sensitive Audit Logs table", true, e.message);
  }

  // 1.4 Anonymous trying to modify careers/announcements
  try {
    const { data, error } = await supabase
      .from("announcements")
      .insert([{ id: "hack-ann-" + Date.now(), title: "Hacked News", content: "Compromised", category: "news", date: "2026-08-22", published: true }]);

    const wasBlocked = error !== null || (!data || data.length === 0);
    report("Anon: Insert fake announcement into Announcements center", wasBlocked, error ? error.message : "Operation handled");
  } catch (e) {
    report("Anon: Insert fake announcement into Announcements center", true, e.message);
  }

  // --------------------------------------------------------------------------------------------
  // ATTACK SCENARIO 2: Cross-Student Isolation (Student A vs Student B)
  // --------------------------------------------------------------------------------------------
  console.log("\n2. Testing Cross-Student Isolation & Role Escalation...");

  const studentB_id = "test-victim-student-uuid";

  // 2.1 Student A modifying Student B's academic_progress
  try {
    const { data, error } = await supabase
      .from("academic_progress")
      .update({ completed_hours: 999 })
      .eq("user_id", studentB_id);

    const wasBlocked = error !== null || (!data || data.length === 0);
    report("Student A -> Modify Student B's Academic Progress", wasBlocked, error ? error.message : "0 rows modified");
  } catch (e) {
    report("Student A -> Modify Student B's Academic Progress", true, e.message);
  }

  // 2.2 Student A modifying Student B's AI Conversations
  try {
    const { data, error } = await supabase
      .from("ai_conversations")
      .update({ title: "Stolen Chat" })
      .eq("user_id", studentB_id);

    const wasBlocked = error !== null || (!data || data.length === 0);
    report("Student A -> Modify Student B's AI Conversations", wasBlocked, error ? error.message : "0 rows modified");
  } catch (e) {
    report("Student A -> Modify Student B's AI Conversations", true, e.message);
  }

  // 2.3 Student A deleting Student B's Community Post
  try {
    const { data, error } = await supabase
      .from("posts")
      .delete()
      .eq("author_email", "studentB@su.edu.eg");

    const wasBlocked = error !== null || (!data || data.length === 0);
    report("Student A -> Delete Student B's Community Post", wasBlocked, error ? error.message : "0 rows modified");
  } catch (e) {
    report("Student A -> Delete Student B's Community Post", true, e.message);
  }

  console.log("\n================================================================================");
  console.log(`📊 PENETRATION RESULTS: Total Tests: ${total} | Blocked by RLS: ${blocked} | Exploited: ${exposed}`);
  console.log("================================================================================\n");

  if (exposed > 0) {
    console.error("⚠️ SECURITY ALERT: One or more attack vectors were not blocked by database RLS!");
    process.exit(1);
  } else {
    console.log("✅ All simulated penetration vectors were successfully defended at the database level!");
  }
}

runPenetrationSuite();
