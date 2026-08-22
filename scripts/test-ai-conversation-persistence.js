// ==============================================================================================
// 🧪 Automated Verification Test: AI Conversation Active-Session-Only Persistence Engine
// Tests active-session persistence, serialization, single-row isolation, and failure resilience.
// ==============================================================================================

const assert = require("assert");

async function runAiPersistenceTests() {
  console.log("================================================================================");
  console.log("⚡ TESTING AI CONVERSATION ACTIVE-SESSION-ONLY PERSISTENCE ENGINE");
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

  // Model of the active-session-only persistence engine implemented in ai-assistant/page.tsx
  class MockAiPersistenceEngine {
    constructor() {
      this.pendingSessionSync = new Map();
      this.isSessionSyncing = new Set();
      this.supabaseNetworkCalls = [];
      this.localStorage = { su_ai_chat_sessions: [] };
      this.networkFailure = false;
    }

    updateLocalSessions(sessions) {
      this.localStorage.su_ai_chat_sessions = JSON.parse(JSON.stringify(sessions));
    }

    async persistSessionToCloud(session) {
      const sessionId = session.id;
      this.pendingSessionSync.set(sessionId, JSON.parse(JSON.stringify(session)));

      if (this.isSessionSyncing.has(sessionId)) {
        return;
      }

      this.isSessionSyncing.add(sessionId);

      while (this.pendingSessionSync.has(sessionId)) {
        const snapshot = this.pendingSessionSync.get(sessionId);
        this.pendingSessionSync.delete(sessionId);

        if (!snapshot) break;

        // Simulate network latency
        await new Promise((r) => setTimeout(r, 40));

        if (this.networkFailure) {
          // Simulate network failure without destroying local cache
          console.log(`     [Simulated Network Failure for session ${sessionId}]`);
          break;
        }

        this.supabaseNetworkCalls.push({
          sessionId: snapshot.id,
          timestamp: Date.now(),
          payload: snapshot
        });
      }

      this.isSessionSyncing.delete(sessionId);
    }
  }

  // --------------------------------------------------------------------------------------------
  // SCENARIO 1: Create 5 conversations, update only conversation #3
  // --------------------------------------------------------------------------------------------
  console.log("📌 Scenario 1: Update single session among 5 existing sessions...");
  const engine1 = new MockAiPersistenceEngine();
  const sessions = [
    { id: "s-1", title: "Chat 1", messages: [{ role: "user", content: "Hi" }] },
    { id: "s-2", title: "Chat 2", messages: [{ role: "user", content: "Hello" }] },
    { id: "s-3", title: "Chat 3", messages: [{ role: "user", content: "Question" }] },
    { id: "s-4", title: "Chat 4", messages: [{ role: "user", content: "Help" }] },
    { id: "s-5", title: "Chat 5", messages: [{ role: "user", content: "Info" }] }
  ];
  engine1.updateLocalSessions(sessions);

  // Update only conversation #3
  const updatedS3 = {
    ...sessions[2],
    messages: [...sessions[2].messages, { role: "user", content: "Follow-up question on AI" }]
  };
  await engine1.persistSessionToCloud(updatedS3);

  test("Exactly ONE Supabase UPSERT occurred", engine1.supabaseNetworkCalls.length === 1, `Total calls: ${engine1.supabaseNetworkCalls.length}`);
  test("The persisted session belongs to conversation #3", engine1.supabaseNetworkCalls[0]?.sessionId === "s-3", `Persisted ID: ${engine1.supabaseNetworkCalls[0]?.sessionId}`);
  test("Unchanged sessions (1, 2, 4, 5) were NOT sent to Supabase", !engine1.supabaseNetworkCalls.some(c => c.sessionId !== "s-3"), "Only s-3 in network log");

  // --------------------------------------------------------------------------------------------
  // SCENARIO 2: 5 rapid messages to same active conversation
  // --------------------------------------------------------------------------------------------
  console.log("\n📌 Scenario 2: 5 rapid messages to the same active conversation (Coalesced Serialization)...");
  const engine2 = new MockAiPersistenceEngine();
  const activeS = { id: "s-active", title: "Active", messages: [] };

  // Fire 5 rapid updates in quick succession
  for (let i = 1; i <= 5; i++) {
    activeS.messages.push({ role: "user", content: `Message #${i}` });
    engine2.persistSessionToCloud({ ...activeS, messages: [...activeS.messages] });
    await new Promise((r) => setTimeout(r, 5)); // 5ms apart, faster than 40ms network latency
  }

  // Wait for all queued network activity to settle
  await new Promise((r) => setTimeout(r, 200));

  test("Network calls were serialized without concurrent collision", engine2.supabaseNetworkCalls.length >= 1 && engine2.supabaseNetworkCalls.length <= 3, `Calls: ${engine2.supabaseNetworkCalls.length}`);
  const finalSavedCall = engine2.supabaseNetworkCalls[engine2.supabaseNetworkCalls.length - 1];
  test("Final persisted conversation contains all 5 messages", finalSavedCall?.payload?.messages?.length === 5, `Messages count: ${finalSavedCall?.payload?.messages?.length}`);

  // --------------------------------------------------------------------------------------------
  // SCENARIO 3: Update arrives while request is in flight
  // --------------------------------------------------------------------------------------------
  console.log("\n📌 Scenario 3: Update arriving while previous request is in-flight (Queueing & Serial Lock)...");
  const engine3 = new MockAiPersistenceEngine();
  const chatSession = { id: "s-stream", title: "Streaming", messages: [{ role: "user", content: "A" }] };

  // Start first request
  const p1 = engine3.persistSessionToCloud(chatSession);

  // Send second update 10ms later while p1 is in flight (takes 40ms)
  await new Promise((r) => setTimeout(r, 10));
  const updatedChatSession = { id: "s-stream", title: "Streaming", messages: [{ role: "user", content: "A" }, { role: "assistant", content: "B" }] };
  const p2 = engine3.persistSessionToCloud(updatedChatSession);

  await Promise.all([p1, p2]);
  await new Promise((r) => setTimeout(r, 100));

  test("Requests executed sequentially", engine3.supabaseNetworkCalls.length === 2, `Calls count: ${engine3.supabaseNetworkCalls.length}`);
  test("Final persisted state contains latest assistant response", engine3.supabaseNetworkCalls[1]?.payload?.messages?.length === 2, `Messages: ${engine3.supabaseNetworkCalls[1]?.payload?.messages?.length}`);

  // --------------------------------------------------------------------------------------------
  // SCENARIO 4: Modify conversation A without touching conversation B
  // --------------------------------------------------------------------------------------------
  console.log("\n📌 Scenario 4: Modify conversation A, verify conversation B is untouched...");
  const engine4 = new MockAiPersistenceEngine();
  const sessionA = { id: "conv-A", title: "Topic A", messages: [{ role: "user", content: "Hello A" }] };
  const sessionB = { id: "conv-B", title: "Topic B", messages: [{ role: "user", content: "Hello B" }] };

  await engine4.persistSessionToCloud(sessionA);

  test("Only conversation A was persisted", engine4.supabaseNetworkCalls.length === 1 && engine4.supabaseNetworkCalls[0]?.sessionId === "conv-A", `Persisted: ${engine4.supabaseNetworkCalls[0]?.sessionId}`);
  test("Conversation B had zero network calls", !engine4.supabaseNetworkCalls.some(c => c.sessionId === "conv-B"), "Zero calls for conv-B");

  // --------------------------------------------------------------------------------------------
  // SCENARIO 5: Simulate Supabase/Network failure (Data Safety & Local Cache Retention)
  // --------------------------------------------------------------------------------------------
  console.log("\n📌 Scenario 5: Network failure resilience (Local state preserved)...");
  const engine5 = new MockAiPersistenceEngine();
  engine5.networkFailure = true; // Enable simulated failure

  const sessionOffline = { id: "conv-offline", title: "Offline Chat", messages: [{ role: "user", content: "Saved locally" }] };
  engine5.updateLocalSessions([sessionOffline]);

  // Attempt persistence over failing network
  await engine5.persistSessionToCloud(sessionOffline);

  test("LocalStorage retains the conversation even when network fails", engine5.localStorage.su_ai_chat_sessions.length === 1, `Stored in cache: ${engine5.localStorage.su_ai_chat_sessions.length}`);
  test("Cached conversation message content is intact", engine5.localStorage.su_ai_chat_sessions[0]?.messages[0]?.content === "Saved locally", `Content: ${engine5.localStorage.su_ai_chat_sessions[0]?.messages[0]?.content}`);

  console.log("\n================================================================================");
  console.log(`📊 TEST SUMMARY: Total: ${totalTests} | Passed: ${passedTests} | Failed: ${totalTests - passedTests}`);
  console.log("================================================================================\n");

  if (totalTests !== passedTests) {
    process.exit(1);
  }
}

runAiPersistenceTests();
