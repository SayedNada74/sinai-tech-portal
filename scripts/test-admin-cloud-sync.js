// ==============================================================================================
// 🧪 Automated Verification Test: Admin CMS Cloud Source of Truth & Synchronization Suite
// Tests 8 real scenarios: Hydration, Create, Update, Delete, Cross-Device, Concurrency, Failure.
// ==============================================================================================

const assert = require("assert");

async function runAdminCloudSyncTests() {
  console.log("================================================================================");
  console.log("⚡ TESTING ADMIN CMS CLOUD SOURCE OF TRUTH & SYNC ENGINE");
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

  // Model of the Supabase Cloud Backend and Admin Context Client
  class MockSupabaseCloud {
    constructor() {
      this.announcements = new Map();
      this.resources = new Map();
      this.careers = new Map();
      this.networkCalls = [];
      this.shouldFail = false;
    }

    async select(table) {
      this.networkCalls.push({ type: "SELECT", table, timestamp: Date.now() });
      if (this.shouldFail) throw new Error("Network timeout");
      return Array.from(this[table].values());
    }

    async insert(table, rows) {
      this.networkCalls.push({ type: "INSERT", table, rows, timestamp: Date.now() });
      if (this.shouldFail) throw new Error("Network insert failed");
      rows.forEach((r) => this[table].set(r.id, JSON.parse(JSON.stringify(r))));
      return rows;
    }

    async update(table, id, fields) {
      this.networkCalls.push({ type: "UPDATE", table, id, fields, timestamp: Date.now() });
      if (this.shouldFail) throw new Error("Network update failed");
      if (this[table].has(id)) {
        const existing = this[table].get(id);
        const updated = { ...existing, ...fields };
        this[table].set(id, updated);
        return updated;
      }
      return null;
    }

    async delete(table, id) {
      this.networkCalls.push({ type: "DELETE", table, id, timestamp: Date.now() });
      if (this.shouldFail) throw new Error("Network delete failed");
      this[table].delete(id);
      return true;
    }
  }

  class MockAdminClient {
    constructor(cloud) {
      this.cloud = cloud;
      this.localStorage = {};
      this.announcements = [];
      this.resources = [];
      this.careers = [];
    }

    async hydrate() {
      // 1. LocalStorage fast cache hydration
      if (this.localStorage["su_announcements"]) {
        this.announcements = JSON.parse(this.localStorage["su_announcements"]);
      }

      // 2. Authoritative Supabase Cloud fetch
      try {
        const cloudData = await this.cloud.select("announcements");
        if (cloudData && cloudData.length > 0) {
          this.announcements = cloudData;
          this.localStorage["su_announcements"] = JSON.stringify(cloudData);
        }
      } catch (e) {
        console.log("   (Hydration fell back to cache safely due to network)");
      }
    }

    async addAnnouncement(ann) {
      const newAnn = { ...ann, id: `ann-${Date.now()}-${Math.random().toString(36).substring(2, 6)}` };
      this.announcements = [newAnn, ...this.announcements];
      this.localStorage["su_announcements"] = JSON.stringify(this.announcements);

      try {
        await this.cloud.insert("announcements", [newAnn]);
      } catch (e) {
        console.log("   (Failed cloud insert, local state retained)");
      }
      return newAnn;
    }

    async updateAnnouncement(id, fields) {
      this.announcements = this.announcements.map((a) => (a.id === id ? { ...a, ...fields } : a));
      this.localStorage["su_announcements"] = JSON.stringify(this.announcements);

      try {
        await this.cloud.update("announcements", id, fields);
      } catch (e) {
        console.log("   (Failed cloud update, local state retained)");
      }
    }

    async deleteAnnouncement(id) {
      this.announcements = this.announcements.filter((a) => a.id !== id);
      this.localStorage["su_announcements"] = JSON.stringify(this.announcements);

      try {
        await this.cloud.delete("announcements", id);
      } catch (e) {
        console.log("   (Failed cloud delete, local state retained)");
      }
    }
  }

  const cloud = new MockSupabaseCloud();

  // --------------------------------------------------------------------------------------------
  // SCENARIO 1: Initial Hydration (Supabase wins over stale LocalStorage)
  // --------------------------------------------------------------------------------------------
  console.log("📌 Scenario 1: Initial Hydration (Authoritative Cloud fetch overrides stale cache)...");
  // Seed cloud with fresh announcement
  await cloud.insert("announcements", [{ id: "ann-cloud-1", title: "Fresh Cloud Announcement", content: "Important", category: "news", date: "2026-08-22", published: true }]);
  
  const client1 = new MockAdminClient(cloud);
  // Stale local cache
  client1.localStorage["su_announcements"] = JSON.stringify([{ id: "ann-stale-0", title: "Stale Local Announcement", content: "Old", category: "news", date: "2026-07-01", published: true }]);

  await client1.hydrate();

  test("Supabase cloud announcement overrides stale local cache", client1.announcements[0]?.id === "ann-cloud-1", `Current ID: ${client1.announcements[0]?.id}`);
  test("LocalStorage cache was updated with fresh cloud data", JSON.parse(client1.localStorage["su_announcements"])[0]?.id === "ann-cloud-1", "Cache updated");

  // --------------------------------------------------------------------------------------------
  // SCENARIO 2: Create Announcement (Single Row INSERT)
  // --------------------------------------------------------------------------------------------
  console.log("\n📌 Scenario 2: Create Announcement (Single-row INSERT, zero collection rewrite)...");
  const callCountBeforeInsert = cloud.networkCalls.length;
  const created = await client1.addAnnouncement({ title: "Summer Training Program", content: "Details", category: "internships", date: "2026-08-22", published: true });

  const insertCalls = cloud.networkCalls.slice(callCountBeforeInsert).filter(c => c.type === "INSERT");
  test("Exactly ONE single-row INSERT was dispatched to Supabase", insertCalls.length === 1 && insertCalls[0].rows.length === 1, `Insert calls: ${insertCalls.length}`);
  test("Created announcement exists in local state & cache", client1.announcements.some(a => a.id === created.id), "Found in state");
  test("Created announcement exists in Supabase cloud", cloud.announcements.has(created.id), "Found in cloud");

  // --------------------------------------------------------------------------------------------
  // SCENARIO 3: Update Announcement (Single Row UPDATE)
  // --------------------------------------------------------------------------------------------
  console.log("\n📌 Scenario 3: Update Announcement (Targeted UPDATE by ID)...");
  const callCountBeforeUpdate = cloud.networkCalls.length;
  await client1.updateAnnouncement(created.id, { title: "UPDATED: Summer Training Program" });

  const updateCalls = cloud.networkCalls.slice(callCountBeforeUpdate).filter(c => c.type === "UPDATE");
  test("Exactly ONE targeted UPDATE was dispatched to Supabase", updateCalls.length === 1 && updateCalls[0].id === created.id, `Update calls: ${updateCalls.length}`);
  test("Local state reflects updated title", client1.announcements.find(a => a.id === created.id)?.title === "UPDATED: Summer Training Program", "State updated");
  test("Cloud reflects updated title", cloud.announcements.get(created.id)?.title === "UPDATED: Summer Training Program", "Cloud updated");

  // --------------------------------------------------------------------------------------------
  // SCENARIO 4: Delete Announcement (Single Row DELETE)
  // --------------------------------------------------------------------------------------------
  console.log("\n📌 Scenario 4: Delete Announcement (Targeted DELETE by ID)...");
  const callCountBeforeDelete = cloud.networkCalls.length;
  await client1.deleteAnnouncement(created.id);

  const deleteCalls = cloud.networkCalls.slice(callCountBeforeDelete).filter(c => c.type === "DELETE");
  test("Exactly ONE targeted DELETE was dispatched to Supabase", deleteCalls.length === 1 && deleteCalls[0].id === created.id, `Delete calls: ${deleteCalls.length}`);
  test("Deleted announcement removed from local state", !client1.announcements.some(a => a.id === created.id), "Removed from state");
  test("Deleted announcement removed from cloud", !cloud.announcements.has(created.id), "Removed from cloud");

  // --------------------------------------------------------------------------------------------
  // SCENARIO 5: Cross-Device Simulation (Device A creates -> Device B hydrates from Cloud)
  // --------------------------------------------------------------------------------------------
  console.log("\n📌 Scenario 5: Cross-Device Simulation (Admin Device A -> Student Device B)...");
  const deviceA = new MockAdminClient(cloud);
  const deviceB = new MockAdminClient(cloud); // Fresh student device with empty cache

  // Device A creates announcement
  const examAnn = await deviceA.addAnnouncement({ title: "Exam starts Monday", content: "Good luck", category: "midterms", date: "2026-08-22", published: true });

  // Device B opens portal and hydrates
  await deviceB.hydrate();

  test("Student Device B successfully loaded the announcement created by Admin Device A", deviceB.announcements.some(a => a.id === examAnn.id), "Found on Device B");

  // --------------------------------------------------------------------------------------------
  // SCENARIO 6: Concurrent Admin Updates (Admin A modifies item 1, Admin B modifies item 2)
  // --------------------------------------------------------------------------------------------
  console.log("\n📌 Scenario 6: Concurrent Multi-Admin Row-Level Isolation...");
  const item1 = await deviceA.addAnnouncement({ title: "Item 1", content: "1", category: "news", date: "2026-08-22", published: true });
  const item2 = await deviceA.addAnnouncement({ title: "Item 2", content: "2", category: "news", date: "2026-08-22", published: true });

  const adminA = new MockAdminClient(cloud);
  const adminB = new MockAdminClient(cloud);
  await adminA.hydrate();
  await adminB.hydrate();

  // Admin A updates Item 1, Admin B updates Item 2 concurrently
  await Promise.all([
    adminA.updateAnnouncement(item1.id, { content: "Admin A updated item 1" }),
    adminB.updateAnnouncement(item2.id, { content: "Admin B updated item 2" })
  ]);

  test("Admin A's update persisted in cloud", cloud.announcements.get(item1.id)?.content === "Admin A updated item 1", "Item 1 updated");
  test("Admin B's update persisted in cloud without overwriting Item 1", cloud.announcements.get(item2.id)?.content === "Admin B updated item 2", "Item 2 updated");

  // --------------------------------------------------------------------------------------------
  // SCENARIO 7: Network Failure Handling (Cache not corrupted, graceful local retention)
  // --------------------------------------------------------------------------------------------
  console.log("\n📌 Scenario 7: Network Failure Handling (Local state & cache preserved)...");
  cloud.shouldFail = true; // Simulate network outage
  const offlineAdmin = new MockAdminClient(cloud);
  offlineAdmin.localStorage["su_announcements"] = JSON.stringify([{ id: "ann-cached", title: "Cached offline", content: "Ok", category: "news", date: "2026-08-22", published: true }]);

  await offlineAdmin.hydrate();
  test("Local cache intact during network outage", offlineAdmin.announcements.length === 1 && offlineAdmin.announcements[0].id === "ann-cached", "Cache preserved");
  cloud.shouldFail = false;

  // --------------------------------------------------------------------------------------------
  // SCENARIO 8: Zero Unnecessary Writes during Hydration (Read-Only SELECTs)
  // --------------------------------------------------------------------------------------------
  console.log("\n📌 Scenario 8: Zero Unnecessary Writes during Hydration...");
  const callCountBeforeRead = cloud.networkCalls.length;
  const reader = new MockAdminClient(cloud);
  await reader.hydrate();

  const writeCalls = cloud.networkCalls.slice(callCountBeforeRead).filter(c => c.type === "INSERT" || c.type === "UPDATE" || c.type === "UPSERT");
  test("Hydration performed 0 write/upsert operations (Strict Read-Only)", writeCalls.length === 0, `Write calls during hydration: ${writeCalls.length}`);

  console.log("\n================================================================================");
  console.log(`📊 TEST SUMMARY: Total: ${totalTests} | Passed: ${passedTests} | Failed: ${totalTests - passedTests}`);
  console.log("================================================================================\n");

  if (totalTests !== passedTests) {
    process.exit(1);
  }
}

runAdminCloudSyncTests();
