import * as fs from 'fs';
import * as path from 'path';

const API_BASE = 'http://localhost:3001/api';
// We use localhost:3001 because the user's next dev server might be there

async function runTests() {
  console.log("=====================================================");
  console.log("🛡️  Sinai Tech Portal — Production Readiness Audit");
  console.log("=====================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, errorMessage: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} - ${errorMessage}`);
      failed++;
    }
  }

  try {
    // Wait for server if it's slow
    await fetch('http://localhost:3001/', { method: 'HEAD' });
  } catch (e) {
    console.warn("⚠️ Server not reachable on 3001. Tests might fail.");
  }

  // ---------------------------------------------------------
  // PHASE 1: LOCAL / MOCK LOAD & CONCURRENCY TEST
  // ---------------------------------------------------------
  console.log("\n--- PHASE 1: LOCAL / MOCK LOAD TEST (No DB Impact) ---");
  
  // A. Rapid Duplicate Requests Simulation (Moodle Proxy - 100 requests)
  console.log("\nRunning 100 concurrent requests to Moodle Proxy (Rate Limit Expected)...");
  const proxyPromises = [];
  const startProxy = Date.now();
  for (let i = 0; i < 100; i++) {
    proxyPromises.push(fetch(`${API_BASE}/moodle-proxy?url=https://moodle.su.edu.eg`));
  }
  const proxyResults = await Promise.all(proxyPromises);
  const proxyTime = Date.now() - startProxy;
  
  const tooManyRequests = proxyResults.filter(r => r.status === 429).length;
  const successRequests = proxyResults.filter(r => r.status === 200).length;
  
  assert(
    tooManyRequests > 50 && successRequests <= 20, 
    `Rate Limiter effectively stopped barrage (Success: ${successRequests}, Blocked: ${tooManyRequests})`, 
    "Rate limiter did not block enough requests."
  );
  console.log(`⏱️  100 concurrent requests processed in ${proxyTime}ms (Avg: ${proxyTime / 100}ms/req)`);

  // B. Logic Concurrency Simulation (Simulating the frontend Coalesced Update pattern)
  console.log("\nRunning 250 concurrent logical state updates (Chaos Simulation)...");
  let sharedState = { gpa: 0, clicks: 0 };
  let isSyncing = false;
  let hasPending = false;
  let cloudWrites = 0;

  async function mockCloudUpdate(snapshot: any) {
    cloudWrites++;
    await new Promise(resolve => setTimeout(resolve, 50)); // Mock 50ms latency
  }

  async function queueUpdate(newGpa: number, isFlush = false) {
    sharedState.gpa = newGpa;
    if (!isFlush) sharedState.clicks++; // Only count external clicks
    
    if (isSyncing) {
      hasPending = true;
      return;
    }
    
    isSyncing = true;
    hasPending = false;
    let snap = { ...sharedState };
    
    await mockCloudUpdate(snap);
    
    isSyncing = false;
    if (hasPending) {
      hasPending = false;
      await queueUpdate(sharedState.gpa, true);
    }
  }

  const startLogic = Date.now();
  const logicPromises = [];
  for (let i = 1; i <= 250; i++) {
    logicPromises.push(queueUpdate(i));
  }
  await Promise.all(logicPromises);
  const logicTime = Date.now() - startLogic;

  assert(
    sharedState.gpa === 250 && sharedState.clicks === 250,
    "Race condition test passed: No lost updates in local state.",
    `State corrupted. GPA: ${sharedState.gpa}, Clicks: ${sharedState.clicks}`
  );
  assert(
    cloudWrites < 250 && cloudWrites > 0,
    `Coalescing worked: 250 clicks resulted in only ${cloudWrites} network writes.`,
    `Too many or zero writes: ${cloudWrites}`
  );
  console.log(`⏱️  250 concurrent operations coalesced in ${logicTime}ms`);


  // ---------------------------------------------------------
  // PHASE 2: REAL SUPABASE SMOKE TEST (Low Volume)
  // ---------------------------------------------------------
  console.log("\n--- PHASE 2: REAL SUPABASE INTEGRATION TEST (Max 10 Reqs) ---");
  
  // A. RLS / IDOR Test (Unauthenticated access to another user's profile)
  // We use the Supabase REST API directly to test RLS
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl || !anonKey) {
    console.warn("⚠️ Cannot run real Supabase tests without NEXT_PUBLIC_SUPABASE_URL and ANON_KEY.");
  } else {
    // 1. Unauthenticated attempt to modify a profile
    const fakeId = "00000000-0000-0000-0000-000000000000";
    const maliciousPatch = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${fakeId}`, {
      method: 'PATCH',
      headers: {
        'apikey': anonKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ role: 'admin', points: 9999 })
    });
    
    const maliciousPatchText = await maliciousPatch.text();
    let isBlocked = maliciousPatch.status === 401 || maliciousPatch.status === 404 || maliciousPatch.status === 403 || maliciousPatch.status === 400;
    
    // PostgREST returns 200 OK and an empty array if RLS silently filters out the rows
    if (maliciousPatch.status === 200 || maliciousPatch.status === 204) {
      if (maliciousPatchText === '[]' || maliciousPatchText === '') {
        isBlocked = true;
      }
    }
    
    assert(
      isBlocked,
      "RLS / IDOR: Unauthenticated PATCH to profiles is rejected (RLS filtered)",
      `Expected rejection/empty, got ${maliciousPatch.status} with body: ${maliciousPatchText}`
    );

    // 2. Auth Bypass via Fake JWT
    const fakeJwtReq = await fetch(`${API_BASE}/admin/delete-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.fake_signature_here'
      },
      body: JSON.stringify({ userId: fakeId })
    });

    assert(
      fakeJwtReq.status === 401,
      "Authorization Bypass: Fake JWT rejected by admin endpoint",
      `Expected 401, got ${fakeJwtReq.status}`
    );

    // 3. Security Headers Verification
    const rootReq = await fetch('http://localhost:3001/');
    const csp = rootReq.headers.get('content-security-policy');
    
    assert(
      csp !== null && csp.includes('frame-src') && csp.includes('self'),
      "Security Headers: Content-Security-Policy is active and restrictive",
      "CSP is missing or malformed"
    );
  }

  console.log("\n=====================================================");
  console.log(`Test Summary: ${passed} Passed | ${failed} Failed`);
  console.log("=====================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
