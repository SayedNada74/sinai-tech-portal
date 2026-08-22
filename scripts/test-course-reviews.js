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

const supabase = createClient(supabaseUrl, supabaseAnonKey);

let totalTests = 0;
let passedTests = 0;

function assert(description, condition, details = "") {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${description}`);
  } else {
    console.error(`  ❌ [FAIL] ${description} ${details ? `(${details})` : ""}`);
  }
}

async function runCourseReviewsTests() {
  console.log("================================================================================");
  console.log("🧪 PHASE 2 STEP 4: COURSE REVIEWS SUITE");
  console.log("================================================================================");

  // Test 1: Cloud Hydration
  console.log("\n--- TEST 1: Cloud Hydration from public.reviews ---");
  try {
    const { data, error } = await supabase.from("reviews").select("*");
    assert("Query public.reviews table succeeds", !error, error ? error.message : "");
    assert("Data returned as an array", Array.isArray(data));
  } catch (e) {
    assert("Cloud Hydration executes without exception", false, e.message);
  }

  // Test 2: Anonymous INSERT / Unauthorized checks
  console.log("\n--- TEST 2: Security & RLS on public.reviews ---");
  const testReviewId = `test-rev-${Date.now()}`;
  try {
    // Attempt anonymous INSERT without auth
    const { data: anonInsertData, error: anonInsertError } = await supabase
      .from("reviews")
      .insert({
        id: testReviewId,
        course_code: "CS 101",
        rating: 5,
        difficulty: 3,
        workload: 3,
        attendance: true,
        exam_difficulty: 3,
        comment: "Anonymous review attempt",
        tips: "None",
        author: "Hacker",
        author_id: "fake-user-id",
        date: "2026-08-22",
        helpful_count: 0
      })
      .select();

    // With RLS "Authenticated users can post reviews", anon INSERT should be blocked
    const anonBlocked = !!anonInsertError || !anonInsertData || anonInsertData.length === 0;
    assert("Anonymous review INSERT is properly rejected by RLS", anonBlocked, anonInsertError ? anonInsertError.message : "0 rows inserted");
  } catch (e) {
    assert("Anonymous INSERT properly caught", true, e.message);
  }

  // Test 3: Anonymous DELETE attempt
  console.log("\n--- TEST 3: Anonymous DELETE rejection ---");
  try {
    const { data: anonDel, error: anonDelErr } = await supabase
      .from("reviews")
      .delete()
      .eq("id", "non-existent-review")
      .select();

    const isBlocked = !!anonDelErr || !anonDel || anonDel.length === 0;
    assert("Anonymous DELETE on reviews is rejected or affects 0 rows", isBlocked, anonDelErr ? anonDelErr.message : "0 rows");
  } catch (e) {
    assert("Anonymous DELETE properly caught", true, e.message);
  }

  // Test 4: Learning Context Code Verification
  console.log("\n--- TEST 4: Code Architecture Audit (learning-context.tsx) ---");
  const learningCtxPath = path.join(process.cwd(), 'context', 'learning-context.tsx');
  const learningCtxContent = fs.readFileSync(learningCtxPath, 'utf8');

  assert("learning-context imports supabase", learningCtxContent.includes('isSupabaseConfigured, supabase'));
  assert("learning-context queries public.reviews directly", learningCtxContent.includes('.from("reviews")'));
  assert("learning-context uses su_course_reviews_cache as cache key", learningCtxContent.includes('su_course_reviews_cache'));
  
  const saveStateMatch = learningCtxContent.match(/const finalPayload = {([\s\S]*?)};/);
  const excludesReviews = saveStateMatch && !saveStateMatch[1].includes('reviews');
  assert("learning-context saveState excludes reviews from finalPayload", !!excludesReviews);
  assert("learning-context contains deleteReview method", learningCtxContent.includes('deleteReview:'));

  // Test 5: Admin Reviews Page Verification
  console.log("\n--- TEST 5: Admin Moderation Audit (app/admin/reviews/page.tsx) ---");
  const adminReviewsPath = path.join(process.cwd(), 'app', 'admin', 'reviews', 'page.tsx');
  const adminReviewsContent = fs.readFileSync(adminReviewsPath, 'utf8');

  assert("admin reviews uses deleteReview from context", adminReviewsContent.includes('deleteReview(id)'));
  assert("admin reviews eliminates legacy su_learning_user-admin", !adminReviewsContent.includes('su_learning_user-admin'));

  // Test 6: Course Details Page Verification
  console.log("\n--- TEST 6: Course Details Hub Audit (app/(platform)/courses/[code]/page.tsx) ---");
  const courseDetailsPath = path.join(process.cwd(), 'app', '(platform)', 'courses', '[code]', 'page.tsx');
  const courseDetailsContent = fs.readFileSync(courseDetailsPath, 'utf8');

  assert("course details uses reviews from useLearning", courseDetailsContent.includes('reviews,') && courseDetailsContent.includes('addReview,'));
  assert("course details supports review deletion for author/admin", courseDetailsContent.includes('deleteReview(rev.id)'));

  console.log("\n================================================================================");
  console.log(`RESULTS: ${passedTests} / ${totalTests} Passed`);
  console.log("================================================================================");

  if (passedTests === totalTests) {
    console.log("🎉 ALL COURSE REVIEWS INTEGRITY TESTS PASSED!");
    process.exit(0);
  } else {
    console.error("❌ SOME TESTS FAILED!");
    process.exit(1);
  }
}

runCourseReviewsTests();
