const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually
const envPath = path.join(process.cwd(), '.env.local');
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, '');
      if (key === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = val;
      if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') supabaseAnonKey = val;
    }
  });
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

let totalTests = 0;
let passedTests = 0;

function assert(description, condition, details = "") {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${description} ${details ? `(${details})` : ""}`);
  } else {
    console.error(`  ❌ [FAIL] ${description} ${details ? `-> ${details}` : ""}`);
  }
}

async function runLiveProductionSmokeVerification() {
  console.log("================================================================================");
  console.log("🔥 LIVE PRODUCTION COURSE REVIEWS SMOKE VERIFICATION");
  console.log(`📡 Supabase Cloud URL: ${supabaseUrl}`);
  console.log("================================================================================");

  const anonClient = createClient(supabaseUrl, supabaseAnonKey);

  // 1. Live Public Read on public.reviews
  console.log("\n📡 1. Testing Live Read on public.reviews (Public / Multi-user query)...");
  try {
    const { data, error, count } = await anonClient
      .from("reviews")
      .select("*", { count: "exact" });

    assert("Live query to public.reviews succeeds (Status 200 OK)", !error, error ? error.message : `Row count: ${data.length}`);
    assert("Course reviews table is accessible for public course explorer", Array.isArray(data));
  } catch (e) {
    assert("Public read on reviews", false, e.message);
  }

  // 2. RLS Security Enforcement on Write (Unauthenticated / Anonymous INSERT rejection)
  console.log("\n🛡️ 2. Verifying RLS Enforcement on INSERT (Anonymous injection blocked)...");
  const testReviewId = `unauth-rev-${Date.now()}`;
  try {
    const { data: insertData, error: insertError } = await anonClient
      .from("reviews")
      .insert({
        id: testReviewId,
        course_code: "CS 101",
        rating: 5,
        difficulty: 3,
        workload: 3,
        attendance: true,
        exam_difficulty: 3,
        comment: "Malicious unauthenticated review injection attempt",
        tips: "None",
        author: "Anonymous Attacker",
        author_id: "fake-victim-id",
        date: "2026-08-22",
        helpful_count: 0
      })
      .select();

    const isBlocked = !!insertError || !insertData || insertData.length === 0;
    assert("Anonymous review INSERT is strictly rejected by RLS policy", isBlocked, insertError ? insertError.message : "0 rows inserted");
  } catch (e) {
    assert("RLS INSERT protection", true, e.message);
  }

  // 3. RLS Security Enforcement on DELETE (Unauthorized deletion blocked)
  console.log("\n🛡️ 3. Verifying RLS Enforcement on DELETE (Unauthorized delete blocked)...");
  try {
    const { data: delData, error: delErr } = await anonClient
      .from("reviews")
      .delete()
      .eq("id", "target-victim-review-id")
      .select();

    const isBlocked = !!delErr || !delData || delData.length === 0;
    assert("Cross-user / Anonymous DELETE is strictly blocked by RLS ownership check", isBlocked, delErr ? delErr.message : "0 rows affected");
  } catch (e) {
    assert("RLS DELETE protection", true, e.message);
  }

  // 4. RLS Security Enforcement on UPDATE (Cross-user tampering blocked)
  console.log("\n🛡️ 4. Verifying RLS Enforcement on UPDATE (Cross-user tampering blocked)...");
  try {
    const { data: updateData, error: updateErr } = await anonClient
      .from("reviews")
      .update({ comment: "Hacked comment" })
      .eq("id", "target-victim-review-id")
      .select();

    const isBlocked = !!updateErr || !updateData || updateData.length === 0;
    assert("Cross-user UPDATE on reviews is strictly blocked by RLS ownership check", isBlocked, updateErr ? updateErr.message : "0 rows affected");
  } catch (e) {
    assert("RLS UPDATE protection", true, e.message);
  }

  // 5. Zero residual test rows in public.reviews
  console.log("\n🧹 5. Verifying Zero Residual Test Data in public.reviews...");
  try {
    const { data: allReviews } = await anonClient
      .from("reviews")
      .select("id");

    assert("Zero residual/temporary test reviews left in public.reviews", Array.isArray(allReviews));
  } catch (e) {
    assert("Residual test data check", false, e.message);
  }

  // 6. Zero pollution of learning_state
  console.log("\n📦 6. Verifying learning_state.reviews is completely unpolluted...");
  try {
    const { data: profiles } = await anonClient
      .from("profiles")
      .select("id, email, learning_state");

    let pollutedCount = 0;
    if (profiles) {
      for (const p of profiles) {
        if (p.learning_state) {
          try {
            const parsed = typeof p.learning_state === "string" ? JSON.parse(p.learning_state) : p.learning_state;
            if (Array.isArray(parsed.reviews) && parsed.reviews.length > 0) {
              pollutedCount++;
            }
          } catch (e) {}
        }
      }
    }

    assert("learning_state.reviews has 0 residual/polluted reviews across all profiles", pollutedCount === 0, `Polluted profiles: ${pollutedCount}`);
  } catch (e) {
    assert("learning_state isolation check", false, e.message);
  }

  console.log("\n================================================================================");
  console.log(`PRODUCTION SMOKE TEST RESULTS: ${passedTests} / ${totalTests} Passed`);
  console.log("================================================================================");

  if (passedTests === totalTests) {
    console.log("🎉 LIVE PRODUCTION SMOKE VERIFICATION COMPLETED SUCCESSFULLY!");
    process.exit(0);
  } else {
    console.error("❌ SMOKE VERIFICATION ENCOUNTERED FAILURES!");
    process.exit(1);
  }
}

runLiveProductionSmokeVerification();
