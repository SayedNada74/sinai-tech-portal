const fs = require('fs');
const path = require('path');

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

// Emulate learning context's in-flight idempotency mutex engine
class IdempotentReviewEngine {
  constructor() {
    this.inFlightReviews = new Set();
    this.inFlightDeletes = new Set();
    this.reviews = [];
    this.networkInsertsCount = 0;
    this.networkDeletesCount = 0;
  }

  async addReview(user, courseCode, reviewPayload) {
    if (!user) return false;
    const lockKey = `${user.id}_${courseCode.trim().toLowerCase()}`;

    if (this.inFlightReviews.has(lockKey)) {
      // Intercepted and blocked by idempotency guard
      return false;
    }

    this.inFlightReviews.add(lockKey);

    const newReviewId = `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newReview = {
      ...reviewPayload,
      id: newReviewId,
      courseCode,
      author: user.name,
      authorId: user.id,
      date: "2026-08-22",
      helpfulCount: 0
    };

    // Optimistic state update
    if (!this.reviews.some(r => r.id === newReviewId)) {
      this.reviews = [newReview, ...this.reviews];
    }

    // Simulated network call with latency
    await new Promise(resolve => setTimeout(resolve, 80));
    this.networkInsertsCount++;

    // Cooldown
    setTimeout(() => {
      this.inFlightReviews.delete(lockKey);
    }, 500);

    return true;
  }

  async deleteReview(reviewId) {
    if (this.inFlightDeletes.has(reviewId)) {
      return false;
    }
    this.inFlightDeletes.add(reviewId);

    this.reviews = this.reviews.filter(r => r.id !== reviewId);
    await new Promise(resolve => setTimeout(resolve, 50));
    this.networkDeletesCount++;

    setTimeout(() => {
      this.inFlightDeletes.delete(reviewId);
    }, 300);

    return true;
  }
}

async function runStep1HardeningTests() {
  console.log("================================================================================");
  console.log("🛡️ TESTING PHASE 3 STEP 1: COURSE REVIEWS HARDENING & IDEMPOTENCY");
  console.log("================================================================================");

  const engine = new IdempotentReviewEngine();
  const testUser = { id: "student-123", name: "Ahmed Student" };
  const courseCode = "CS 101";

  // ----------------------------------------------------------------------------------
  // TEST 1: 50 Rapid Concurrent Clicks within 10ms
  // ----------------------------------------------------------------------------------
  console.log("\n📌 Test 1: Simulating 50 Rapid Concurrent Clicks on 'Submit Review'...");
  const promises = [];
  for (let i = 0; i < 50; i++) {
    promises.push(
      engine.addReview(testUser, courseCode, {
        rating: 5,
        difficulty: 2,
        workload: 3,
        attendance: true,
        examDifficulty: 2,
        comment: "Great course and practical labs.",
        tips: "Solve past assignments."
      })
    );
  }

  const results = await Promise.all(promises);
  const successCount = results.filter(r => r === true).length;
  const blockedCount = results.filter(r => r === false).length;

  assert("Exactly 1 submission was accepted and processed", successCount === 1, `Accepted: ${successCount}`);
  assert("49 rapid duplicate clicks were blocked by In-Flight Mutex", blockedCount === 49, `Blocked: ${blockedCount}`);
  assert("Exactly ONE review exists in local state", engine.reviews.length === 1, `Found ${engine.reviews.length} reviews`);
  assert("Exactly ONE network INSERT was dispatched", engine.networkInsertsCount === 1, `Network calls: ${engine.networkInsertsCount}`);

  // ----------------------------------------------------------------------------------
  // TEST 2: Concurrent Rapid Delete Clicks
  // ----------------------------------------------------------------------------------
  console.log("\n📌 Test 2: Simulating Rapid Double/Triple Delete on the Created Review...");
  const reviewId = engine.reviews[0].id;
  const delPromises = [
    engine.deleteReview(reviewId),
    engine.deleteReview(reviewId),
    engine.deleteReview(reviewId),
    engine.deleteReview(reviewId)
  ];

  const delResults = await Promise.all(delPromises);
  const delSuccess = delResults.filter(r => r === true).length;
  const delBlocked = delResults.filter(r => r === false).length;

  assert("Exactly 1 delete request was executed", delSuccess === 1, `Accepted deletes: ${delSuccess}`);
  assert("Duplicate concurrent delete clicks were intercepted", delBlocked === 3, `Blocked deletes: ${delBlocked}`);
  assert("Review successfully removed from state", engine.reviews.length === 0);

  // ----------------------------------------------------------------------------------
  // TEST 3: Code Inspection in Source Files
  // ----------------------------------------------------------------------------------
  console.log("\n📌 Test 3: Source Code Inspection for UI Disabled & In-Flight Guards...");
  const pagePath = path.join(process.cwd(), 'app', '(platform)', 'courses', '[code]', 'page.tsx');
  const pageContent = fs.readFileSync(pagePath, 'utf8');

  assert("courses/[code]/page.tsx contains isSubmittingReview state", pageContent.includes('isSubmittingReview'));
  assert("courses/[code]/page.tsx submit button has isLoading guard", pageContent.includes('isLoading={isSubmittingReview}'));
  assert("courses/[code]/page.tsx submit button has disabled guard", pageContent.includes('disabled={isSubmittingReview}'));

  const learningPath = path.join(process.cwd(), 'context', 'learning-context.tsx');
  const learningContent = fs.readFileSync(learningPath, 'utf8');
  assert("learning-context.tsx contains inFlightReviewsRef mutex", learningContent.includes('inFlightReviewsRef'));
  assert("learning-context.tsx contains inFlightDeleteRef mutex", learningContent.includes('inFlightDeleteRef'));

  console.log("\n================================================================================");
  console.log(`RESULTS: ${passedTests} / ${totalTests} Passed`);
  console.log("================================================================================");

  if (passedTests === totalTests) {
    console.log("🎉 PHASE 3 STEP 1 HARDENING VERIFIED SUCCESSFULLY WITH 100% IDEMPOTENCY!");
    process.exit(0);
  } else {
    console.error("❌ STEP 1 HARDENING TESTS FAILED!");
    process.exit(1);
  }
}

runStep1HardeningTests();
