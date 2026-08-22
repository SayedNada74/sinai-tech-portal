// ==============================================================================================
// 🧪 Automated Verification Test: Academic Coalesced Debounced Sync Engine
// Simulates rapid consecutive course updates and verifies coalesced serialization.
// ==============================================================================================

const assert = require("assert");

async function testAcademicCoalescedSync() {
  console.log("================================================================================");
  console.log("⚡ TESTING ACADEMIC COALESCED DEBOUNCED SYNC ENGINE");
  console.log("================================================================================\n");

  let totalTests = 0;
  let passedTests = 0;

  function test(label, condition, details = "") {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  ✅ [PASS] ${label} ${details ? `(${details})` : ""}`);
    } else {
      console.error(`  ❌ [FAIL] ${label} ${details ? `-> ${details}` : ""}`);
    }
  }

  // 1. Simulation of the Coalesced Debounced Sync Engine in Node
  class MockAcademicSyncEngine {
    constructor() {
      this.pendingSync = null;
      this.debounceTimer = null;
      this.isSyncing = false;
      this.hasPendingNextSync = false;
      this.supabaseNetworkCalls = [];
      this.localStorage = {};
    }

    queueAcademicUpdate(completed, planned, target) {
      // 1. Optimistic Local Cache
      this.localStorage["su_academic_test"] = JSON.stringify({ completed, planned, target });

      // 2. Pending snapshot
      this.pendingSync = { completed, planned, target };

      // 3. Debounce 100ms for fast testing
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }

      this.debounceTimer = setTimeout(() => {
        this.flushSyncToCloud();
      }, 100);
    }

    async flushSyncToCloud() {
      if (!this.pendingSync) return;

      if (this.isSyncing) {
        this.hasPendingNextSync = true;
        return;
      }

      this.isSyncing = true;
      this.hasPendingNextSync = false;

      const snapshot = JSON.parse(JSON.stringify(this.pendingSync));

      // Simulate network latency (50ms)
      await new Promise((resolve) => setTimeout(resolve, 50));

      this.supabaseNetworkCalls.push({
        timestamp: Date.now(),
        payload: snapshot
      });

      this.isSyncing = false;

      if (this.hasPendingNextSync) {
        this.hasPendingNextSync = false;
        await this.flushSyncToCloud();
      }
    }
  }

  // TEST 1: Rapid 5 Updates within Debounce Window
  console.log("📌 Scenario 1: Rapid 5 Updates within Debounce Window...");
  const engine = new MockAcademicSyncEngine();

  // Rapid updates 10ms apart
  engine.queueAcademicUpdate([{ code: "CSW 101", grade: "A+" }], [], 3.5);
  await new Promise((r) => setTimeout(r, 10));
  engine.queueAcademicUpdate([{ code: "CSW 101", grade: "A+" }, { code: "CSW 150", grade: "A" }], [], 3.6);
  await new Promise((r) => setTimeout(r, 10));
  engine.queueAcademicUpdate([{ code: "CSW 101", grade: "A+" }, { code: "CSW 150", grade: "A" }, { code: "CSW 201", grade: "B+" }], [], 3.7);
  await new Promise((r) => setTimeout(r, 10));
  engine.queueAcademicUpdate([{ code: "CSW 101", grade: "A+" }, { code: "CSW 150", grade: "A" }, { code: "CSW 201", grade: "B+" }, { code: "CSW 232", grade: "A-" }], [], 3.8);
  await new Promise((r) => setTimeout(r, 10));
  engine.queueAcademicUpdate([{ code: "CSW 101", grade: "A+" }, { code: "CSW 150", grade: "A" }, { code: "CSW 201", grade: "B+" }, { code: "CSW 232", grade: "A-" }, { code: "CSW 251", grade: "A+" }], ["CSW 301"], 3.9);

  // Local storage updated immediately
  const localCache = JSON.parse(engine.localStorage["su_academic_test"]);
  test("LocalStorage updated synchronously with all 5 courses", localCache.completed.length === 5, `Found ${localCache.completed.length} courses in cache`);
  test("LocalStorage target GPA updated to latest", localCache.target === 3.9, `Target GPA: ${localCache.target}`);

  // Wait for debounce + network sync (200ms)
  await new Promise((r) => setTimeout(r, 200));

  test("Exactly 1 coalesced network request sent to Supabase instead of 5 separate requests", engine.supabaseNetworkCalls.length === 1, `Network calls count: ${engine.supabaseNetworkCalls.length}`);
  test("Supabase received complete final coalesced payload", engine.supabaseNetworkCalls[0].payload.completed.length === 5, `Courses in payload: ${engine.supabaseNetworkCalls[0].payload.completed.length}`);
  test("Planned course in final payload", engine.supabaseNetworkCalls[0].payload.planned[0] === "CSW 301", `Planned: ${engine.supabaseNetworkCalls[0].payload.planned[0]}`);

  // TEST 2: Update Arriving While a Network Request is in Flight (Serialization)
  console.log("\n📌 Scenario 2: Update Arriving While a Network Request is In Flight (Queueing & Serial Lock)...");
  const engine2 = new MockAcademicSyncEngine();

  // First batch
  engine2.queueAcademicUpdate([{ code: "CSW 101", grade: "A" }], [], 3.5);
  await new Promise((r) => setTimeout(r, 110)); // Trigger first network call

  // While in flight (takes 50ms), queue another update
  engine2.queueAcademicUpdate([{ code: "CSW 101", grade: "A" }, { code: "CSW 202", grade: "A+" }], [], 3.8);

  // Wait for both to finish
  await new Promise((r) => setTimeout(r, 250));

  test("Serialized requests executed without concurrent collision", engine2.supabaseNetworkCalls.length === 2, `Total calls: ${engine2.supabaseNetworkCalls.length}`);
  test("Final persisted call contains the latest state", engine2.supabaseNetworkCalls[1].payload.completed.length === 2, `Final count: ${engine2.supabaseNetworkCalls[1].payload.completed.length}`);

  console.log("\n================================================================================");
  console.log(`📊 TEST SUMMARY: Total: ${totalTests} | Passed: ${passedTests} | Failed: ${totalTests - passedTests}`);
  console.log("================================================================================\n");

  if (totalTests !== passedTests) {
    process.exit(1);
  }
}

testAcademicCoalescedSync();
