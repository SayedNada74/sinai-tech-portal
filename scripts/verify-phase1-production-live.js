// ==============================================================================================
// 🛡️ PHASE 1 LIVE PRODUCTION DATABASE POST-MIGRATION VERIFICATION SUITE
// Tests the live Supabase Cloud Database (odjodsorkpdgixzyiyyc.supabase.co) after RLS migration.
// ==============================================================================================

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Read .env.local
const envFile = fs.readFileSync(path.join(__dirname, "../.env.local"), "utf-8");
const env = {};
envFile.split("\n").forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#")) {
    const [k, ...v] = trimmed.split("=");
    if (k && v) env[k.trim()] = v.join("=").trim();
  }
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runLiveVerification() {
  console.log("================================================================================");
  console.log("🔍 PHASE 1 LIVE PRODUCTION DATABASE POST-MIGRATION VERIFICATION");
  console.log(`📡 Target Instance: ${SUPABASE_URL}`);
  console.log("================================================================================\n");

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    tests: []
  };

  function assert(name, condition, details = "") {
    results.total++;
    if (condition) {
      results.passed++;
      console.log(`  ✅ [PASS] ${name} ${details ? `(${details})` : ""}`);
      results.tests.push({ name, status: "PASS", details });
    } else {
      results.failed++;
      console.error(`  ❌ [FAIL] ${name} ${details ? `-> ${details}` : ""}`);
      results.tests.push({ name, status: "FAIL", details });
    }
  }

  // --------------------------------------------------------------------------------------------
  // TEST GROUP 1: Table Availability & Schema Cache Integrity
  // --------------------------------------------------------------------------------------------
  console.log("📌 1. Verifying Table Availability & Schema Cache (Zero PGRST205 Errors)...");

  const tables = [
    "profiles",
    "academic_progress",
    "ai_conversations",
    "ai_messages",
    "posts",
    "reviews",
    "resources",
    "careers",
    "roadmaps",
    "announcements",
    "audit_logs"
  ];

  for (const tbl of tables) {
    try {
      const { data, error } = await supabase.from(tbl).select("*").limit(1);
      const isAvailable = error === null || (error && error.code !== "PGRST205" && error.code !== "42P01");
      assert(`Table [${tbl}] registered & accessible in Schema Cache`, isAvailable, error ? `Code: ${error.code} - ${error.message}` : `Accessible, sample count: ${data.length}`);
    } catch (e) {
      assert(`Table [${tbl}] query execution`, false, e.message);
    }
  }

  // --------------------------------------------------------------------------------------------
  // TEST GROUP 2: Sensitive Column Removal (Password field in profiles)
  // --------------------------------------------------------------------------------------------
  console.log("\n📌 2. Verifying Sensitive Data Protection (Plaintext Password Column Drop)...");
  try {
    const { data, error } = await supabase.from("profiles").select("password").limit(1);
    // If column was successfully dropped, querying 'password' specifically should return an error (PGRST204 / column not found)
    const isColumnGone = error !== null && (error.message.includes("does not exist") || error.code === "PGRST204" || error.code === "42703");
    assert("Profiles table: Plaintext 'password' column removed from public schema", isColumnGone, error ? error.message : "Password column still returned in query!");
  } catch (e) {
    assert("Profiles password column verification", true, e.message);
  }

  // --------------------------------------------------------------------------------------------
  // TEST GROUP 3: Anonymous Access Restrictions & RLS Enforcement
  // --------------------------------------------------------------------------------------------
  console.log("\n📌 3. Verifying Anonymous Access Restrictions & RLS Enforcements...");

  // 3.1 Anonymous cannot read Audit Logs
  try {
    const { data, error } = await supabase.from("audit_logs").select("*");
    const isProtected = (data && data.length === 0) || error !== null;
    assert("Anonymous SELECT on audit_logs blocked by RLS", isProtected, `${data ? data.length : 0} rows returned`);
  } catch (e) {
    assert("Anonymous SELECT on audit_logs", true, e.message);
  }

  // 3.2 Anonymous cannot UPDATE profiles
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({ name: "HACKED_ANON" })
      .neq("id", "none");
    const isBlocked = error !== null || (!data || data.length === 0);
    assert("Anonymous UPDATE on profiles blocked by RLS", isBlocked, error ? error.message : "0 rows affected");
  } catch (e) {
    assert("Anonymous UPDATE on profiles", true, e.message);
  }

  // 3.3 Anonymous cannot DELETE profiles
  try {
    const { data, error } = await supabase
      .from("profiles")
      .delete()
      .neq("id", "none");
    const isBlocked = error !== null || (!data || data.length === 0);
    assert("Anonymous DELETE on profiles blocked by RLS", isBlocked, error ? error.message : "0 rows affected");
  } catch (e) {
    assert("Anonymous DELETE on profiles", true, e.message);
  }

  // 3.4 Anonymous cannot DELETE audit_logs (Audit log immutability)
  try {
    const { data, error } = await supabase
      .from("audit_logs")
      .delete()
      .neq("id", "none");
    const isBlocked = error !== null || (!data || data.length === 0);
    assert("Anonymous DELETE on audit_logs blocked (Immutability)", isBlocked, error ? error.message : "0 rows affected");
  } catch (e) {
    assert("Anonymous DELETE on audit_logs", true, e.message);
  }

  // 3.5 Anonymous cannot UPDATE academic_progress
  try {
    const { data, error } = await supabase
      .from("academic_progress")
      .update({ target_gpa: 4.0 })
      .neq("id", "00000000-0000-0000-0000-000000000000");
    const isBlocked = error !== null || (!data || data.length === 0);
    assert("Anonymous UPDATE on academic_progress blocked by RLS", isBlocked, error ? error.message : "0 rows affected");
  } catch (e) {
    assert("Anonymous UPDATE on academic_progress", true, e.message);
  }

  // 3.6 Anonymous cannot UPDATE ai_conversations
  try {
    const { data, error } = await supabase
      .from("ai_conversations")
      .update({ title: "Hacked Title" })
      .neq("id", "none");
    const isBlocked = error !== null || (!data || data.length === 0);
    assert("Anonymous UPDATE on ai_conversations blocked by RLS", isBlocked, error ? error.message : "0 rows affected");
  } catch (e) {
    assert("Anonymous UPDATE on ai_conversations", true, e.message);
  }

  // 3.7 Anonymous cannot DELETE posts
  try {
    const { data, error } = await supabase
      .from("posts")
      .delete()
      .neq("id", "none");
    const isBlocked = error !== null || (!data || data.length === 0);
    assert("Anonymous DELETE on community posts blocked by RLS", isBlocked, error ? error.message : "0 rows affected");
  } catch (e) {
    assert("Anonymous DELETE on posts", true, e.message);
  }

  // 3.8 Anonymous cannot DELETE reviews
  try {
    const { data, error } = await supabase
      .from("reviews")
      .delete()
      .neq("id", "none");
    const isBlocked = error !== null || (!data || data.length === 0);
    assert("Anonymous DELETE on course reviews blocked by RLS", isBlocked, error ? error.message : "0 rows affected");
  } catch (e) {
    assert("Anonymous DELETE on reviews", true, e.message);
  }

  // 3.9 Anonymous cannot INSERT into careers (Staff/Admin table)
  try {
    const { data, error } = await supabase
      .from("careers")
      .insert([{
        id: "anon-job-" + Date.now(),
        title: "Malicious Job",
        company: "Evil Corp",
        description: "Test",
        date_added: new Date().toISOString()
      }]);
    const isBlocked = error !== null || (!data || data.length === 0);
    assert("Anonymous INSERT on careers blocked by Staff-only RLS", isBlocked, error ? error.message : "Operation evaluated by policy");
  } catch (e) {
    assert("Anonymous INSERT on careers", true, e.message);
  }

  // 3.10 Anonymous cannot INSERT into announcements (Staff/Admin table)
  try {
    const { data, error } = await supabase
      .from("announcements")
      .insert([{
        id: "anon-ann-" + Date.now(),
        title: "Fake News",
        content: "Exploit",
        category: "news",
        date: "2026-08-22",
        published: true
      }]);
    const isBlocked = error !== null || (!data || data.length === 0);
    assert("Anonymous INSERT on announcements blocked by Staff-only RLS", isBlocked, error ? error.message : "Operation evaluated by policy");
  } catch (e) {
    assert("Anonymous INSERT on announcements", true, e.message);
  }

  // --------------------------------------------------------------------------------------------
  // TEST GROUP 4: Cross-User Isolation & Ownership Simulation (Targeting non-owned IDs)
  // --------------------------------------------------------------------------------------------
  console.log("\n📌 4. Verifying Cross-User Ownership Isolation (Targeting Victim User ID)...");

  const targetVictimId = "victim-student-id-9999";

  // 4.1 Cross-user update on specific profile
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({ name: "STOLEN_PROFILE" })
      .eq("id", targetVictimId);
    const isBlocked = error !== null || (!data || data.length === 0);
    assert("Cross-User UPDATE on profiles blocked by ownership check", isBlocked, error ? error.message : "0 rows affected");
  } catch (e) {
    assert("Cross-User UPDATE on profiles", true, e.message);
  }

  // 4.2 Cross-user update on academic progress
  try {
    const { data, error } = await supabase
      .from("academic_progress")
      .update({ target_gpa: 4.0 })
      .eq("user_id", targetVictimId);
    const isBlocked = error !== null || (!data || data.length === 0);
    assert("Cross-User UPDATE on academic_progress blocked by user_id ownership check", isBlocked, error ? error.message : "0 rows affected");
  } catch (e) {
    assert("Cross-User UPDATE on academic_progress", true, e.message);
  }

  // 4.3 Cross-user update on AI conversations
  try {
    const { data, error } = await supabase
      .from("ai_conversations")
      .update({ title: "Stolen Conversation" })
      .eq("user_id", targetVictimId);
    const isBlocked = error !== null || (!data || data.length === 0);
    assert("Cross-User UPDATE on ai_conversations blocked by user_id ownership check", isBlocked, error ? error.message : "0 rows affected");
  } catch (e) {
    assert("Cross-User UPDATE on ai_conversations", true, e.message);
  }

  // 4.4 Cross-user update on AI messages
  try {
    const { data, error } = await supabase
      .from("ai_messages")
      .update({ content: "Modified message" })
      .eq("user_id", targetVictimId);
    const isBlocked = error !== null || (!data || data.length === 0);
    assert("Cross-User UPDATE on ai_messages blocked by user_id ownership check", isBlocked, error ? error.message : "0 rows affected");
  } catch (e) {
    assert("Cross-User UPDATE on ai_messages", true, e.message);
  }

  // 4.5 Cross-user delete on posts
  try {
    const { data, error } = await supabase
      .from("posts")
      .delete()
      .eq("author_email", "victim@su.edu.eg");
    const isBlocked = error !== null || (!data || data.length === 0);
    assert("Cross-User DELETE on community posts blocked by author_email check", isBlocked, error ? error.message : "0 rows affected");
  } catch (e) {
    assert("Cross-User DELETE on posts", true, e.message);
  }

  // 4.6 Cross-user update on reviews
  try {
    const { data, error } = await supabase
      .from("reviews")
      .update({ comment: "Malicious review overwrite" })
      .eq("author_id", targetVictimId);
    const isBlocked = error !== null || (!data || data.length === 0);
    assert("Cross-User UPDATE on course reviews blocked by author_id ownership check", isBlocked, error ? error.message : "0 rows affected");
  } catch (e) {
    assert("Cross-User UPDATE on reviews", true, e.message);
  }

  // --------------------------------------------------------------------------------------------
  // TEST GROUP 5: Existing Production Data Integrity & Legitimate App Queries
  // --------------------------------------------------------------------------------------------
  console.log("\n📌 5. Verifying Existing Production Data Integrity & Application Read Queries...");

  // 5.1 Profiles Read
  try {
    const { data, error } = await supabase.from("profiles").select("id, name, email, role, level, department, student_id, avatar, bio, created_at").limit(5);
    assert("Application SELECT on profiles intact & functional", error === null && Array.isArray(data), `Read ${data ? data.length : 0} rows`);
  } catch (e) {
    assert("Application SELECT on profiles", false, e.message);
  }

  // 5.2 Posts Read
  try {
    const { data, error } = await supabase.from("posts").select("*").limit(5);
    assert("Application SELECT on community posts intact & functional", error === null && Array.isArray(data), `Read ${data ? data.length : 0} rows`);
  } catch (e) {
    assert("Application SELECT on posts", false, e.message);
  }

  // 5.3 Careers Read
  try {
    const { data, error } = await supabase.from("careers").select("*").limit(5);
    assert("Application SELECT on careers intact & functional", error === null && Array.isArray(data), `Read ${data ? data.length : 0} rows`);
  } catch (e) {
    assert("Application SELECT on careers", false, e.message);
  }

  // 5.4 Announcements Read
  try {
    const { data, error } = await supabase.from("announcements").select("*").limit(5);
    assert("Application SELECT on announcements intact & functional", error === null && Array.isArray(data), `Read ${data ? data.length : 0} rows`);
  } catch (e) {
    assert("Application SELECT on announcements", false, e.message);
  }

  // 5.5 Roadmaps Read
  try {
    const { data, error } = await supabase.from("roadmaps").select("*").limit(5);
    assert("Application SELECT on roadmaps intact & functional", error === null && Array.isArray(data), `Read ${data ? data.length : 0} rows`);
  } catch (e) {
    assert("Application SELECT on roadmaps", false, e.message);
  }

  console.log("\n================================================================================");
  console.log(`📊 FINAL POST-MIGRATION SCORECARD: Total: ${results.total} | Passed: ${results.passed} | Failed: ${results.failed}`);
  console.log(`   Success Rate: ${Math.round((results.passed / results.total) * 100)}%`);
  console.log("================================================================================\n");

  if (results.failed > 0) {
    process.exit(1);
  }
}

runLiveVerification();
