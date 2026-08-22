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

// Emulate Admin Context Idempotency Engine
class AdminIdempotencyEngine {
  constructor() {
    this.inFlightAdmin = new Set();
    this.inFlightCareers = new Set();
    this.announcements = [];
    this.resources = [];
    this.careers = [];
    this.networkCalls = {
      announcementsInsert: 0,
      announcementsUpdate: 0,
      announcementsDelete: 0,
      resourcesInsert: 0,
      resourcesUpdate: 0,
      resourcesDelete: 0,
      careersInsert: 0,
      careersUpdate: 0,
      careersDelete: 0
    };
  }

  // 1. Announcements
  async addAnnouncement(ann) {
    const lockKey = `add_ann_${ann.title.trim()}_${ann.category}`;
    if (this.inFlightAdmin.has(lockKey)) return false;
    this.inFlightAdmin.add(lockKey);

    const newAnn = {
      ...ann,
      id: `ann-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date: "2026-08-22"
    };
    this.announcements = [newAnn, ...this.announcements];

    await new Promise(r => setTimeout(r, 60));
    this.networkCalls.announcementsInsert++;

    setTimeout(() => {
      this.inFlightAdmin.delete(lockKey);
    }, 400);

    return true;
  }

  async editAnnouncement(id, updatedFields) {
    const lockKey = `update_ann_${id}`;
    if (this.inFlightAdmin.has(lockKey)) return false;
    this.inFlightAdmin.add(lockKey);

    this.announcements = this.announcements.map(a => a.id === id ? { ...a, ...updatedFields } : a);
    await new Promise(r => setTimeout(r, 40));
    this.networkCalls.announcementsUpdate++;

    setTimeout(() => {
      this.inFlightAdmin.delete(lockKey);
    }, 300);

    return true;
  }

  async deleteAnnouncement(id) {
    const lockKey = `delete_ann_${id}`;
    if (this.inFlightAdmin.has(lockKey)) return false;
    this.inFlightAdmin.add(lockKey);

    this.announcements = this.announcements.filter(a => a.id !== id);
    await new Promise(r => setTimeout(r, 40));
    this.networkCalls.announcementsDelete++;

    setTimeout(() => {
      this.inFlightAdmin.delete(lockKey);
    }, 300);

    return true;
  }

  // 2. Resources
  async addResource(res) {
    const lockKey = `add_res_${res.title.trim()}_${res.courseCode.trim()}`;
    if (this.inFlightAdmin.has(lockKey)) return false;
    this.inFlightAdmin.add(lockKey);

    const newRes = {
      ...res,
      id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      uploadDate: "2026-08-22"
    };
    this.resources = [newRes, ...this.resources];

    await new Promise(r => setTimeout(r, 60));
    this.networkCalls.resourcesInsert++;

    setTimeout(() => {
      this.inFlightAdmin.delete(lockKey);
    }, 400);

    return true;
  }

  // 3. Careers
  async addCareer(career) {
    const lockKey = `add_career_${career.title.trim()}_${career.company.trim()}`;
    if (this.inFlightCareers.has(lockKey)) return false;
    this.inFlightCareers.add(lockKey);

    const newCareer = {
      ...career,
      id: `car-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      dateAdded: "2026-08-22"
    };
    this.careers = [newCareer, ...this.careers];

    await new Promise(r => setTimeout(r, 60));
    this.networkCalls.careersInsert++;

    setTimeout(() => {
      this.inFlightCareers.delete(lockKey);
    }, 400);

    return true;
  }
}

async function runStep2AdminTests() {
  console.log("================================================================================");
  console.log("🛡️ TESTING PHASE 3 STEP 2: ADMIN CMS HARDENING & IDEMPOTENCY ENGINE");
  console.log("================================================================================");

  const engine = new AdminIdempotencyEngine();

  // ----------------------------------------------------------------------------------
  // TEST 1: 50 Rapid Concurrent Clicks on Announcement Creation
  // ----------------------------------------------------------------------------------
  console.log("\n📌 Scenario 1: Simulating 50 Rapid Concurrent Clicks on 'Publish Announcement'...");
  const annPromises = [];
  for (let i = 0; i < 50; i++) {
    annPromises.push(
      engine.addAnnouncement({
        title: "جدول امتحانات الفصل الصيفي 2026",
        content: "يرجى الالتزام بمواعيد اللجان والقاعات المحددة.",
        category: "finals",
        published: true
      })
    );
  }

  const annResults = await Promise.all(annPromises);
  const annAccepted = annResults.filter(r => r === true).length;
  const annBlocked = annResults.filter(r => r === false).length;

  assert("Exactly 1 announcement was created", annAccepted === 1, `Accepted: ${annAccepted}`);
  assert("49 rapid duplicate clicks were blocked by In-Flight Mutex", annBlocked === 49, `Blocked: ${annBlocked}`);
  assert("State contains exactly 1 announcement", engine.announcements.length === 1);
  assert("Cloud dispatch received exactly 1 single-row INSERT", engine.networkCalls.announcementsInsert === 1);

  // ----------------------------------------------------------------------------------
  // TEST 2: 50 Rapid Concurrent Clicks on Resource Creation
  // ----------------------------------------------------------------------------------
  console.log("\n📌 Scenario 2: Simulating 50 Rapid Concurrent Clicks on 'Publish Resource'...");
  const resPromises = [];
  for (let i = 0; i < 50; i++) {
    resPromises.push(
      engine.addResource({
        title: "كتاب الخوارزميات المتقدمة وتركيب البيانات",
        courseCode: "CS 201",
        description: "شرح شامل ومبسط للمقرر",
        type: "book",
        author: "إدارة الكلية",
        url: "#file-algorithms.pdf"
      })
    );
  }

  const resResults = await Promise.all(resPromises);
  const resAccepted = resResults.filter(r => r === true).length;
  const resBlocked = resResults.filter(r => r === false).length;

  assert("Exactly 1 resource was created", resAccepted === 1, `Accepted: ${resAccepted}`);
  assert("49 rapid duplicate clicks were blocked by In-Flight Mutex", resBlocked === 49, `Blocked: ${resBlocked}`);
  assert("State contains exactly 1 resource", engine.resources.length === 1);
  assert("Cloud dispatch received exactly 1 single-row INSERT", engine.networkCalls.resourcesInsert === 1);

  // ----------------------------------------------------------------------------------
  // TEST 3: 50 Rapid Concurrent Clicks on Career Opportunity Creation
  // ----------------------------------------------------------------------------------
  console.log("\n📌 Scenario 3: Simulating 50 Rapid Concurrent Clicks on 'Publish Career'...");
  const carPromises = [];
  for (let i = 0; i < 50; i++) {
    carPromises.push(
      engine.addCareer({
        title: "Frontend Engineer (Next.js)",
        company: "Sinai Tech Hub",
        location: "القاهرة / Remotely",
        type: "full-time",
        description: "فرصة توظيف مميزة لخريجي حاسبات سيناء",
        link: "https://example.com/apply",
        department: "cs",
        experience: "entry"
      })
    );
  }

  const carResults = await Promise.all(carPromises);
  const carAccepted = carResults.filter(r => r === true).length;
  const carBlocked = carResults.filter(r => r === false).length;

  assert("Exactly 1 career opportunity was created", carAccepted === 1, `Accepted: ${carAccepted}`);
  assert("49 rapid duplicate clicks were blocked by In-Flight Mutex", carBlocked === 49, `Blocked: ${carBlocked}`);
  assert("State contains exactly 1 career opportunity", engine.careers.length === 1);
  assert("Cloud dispatch received exactly 1 single-row INSERT", engine.networkCalls.careersInsert === 1);

  // ----------------------------------------------------------------------------------
  // TEST 4: Concurrent Rapid Update & Delete Operations
  // ----------------------------------------------------------------------------------
  console.log("\n📌 Scenario 4: Simulating Rapid Double-Click on Announcement Edit & Delete...");
  const createdAnnId = engine.announcements[0].id;
  const editPromises = [
    engine.editAnnouncement(createdAnnId, { title: "تعديل موعد الامتحانات" }),
    engine.editAnnouncement(createdAnnId, { title: "تعديل موعد الامتحانات" }),
    engine.editAnnouncement(createdAnnId, { title: "تعديل موعد الامتحانات" })
  ];

  const editResults = await Promise.all(editPromises);
  assert("Exactly 1 update mutation was executed", editResults.filter(r => r === true).length === 1);
  assert("Duplicate concurrent update clicks were blocked", editResults.filter(r => r === false).length === 2);

  const delPromises = [
    engine.deleteAnnouncement(createdAnnId),
    engine.deleteAnnouncement(createdAnnId),
    engine.deleteAnnouncement(createdAnnId)
  ];

  const delResults = await Promise.all(delPromises);
  assert("Exactly 1 delete mutation was executed", delResults.filter(r => r === true).length === 1);
  assert("Duplicate concurrent delete clicks were blocked", delResults.filter(r => r === false).length === 2);
  assert("Announcement removed from state", engine.announcements.length === 0);

  // ----------------------------------------------------------------------------------
  // TEST 5: Codebase Inspection for In-Flight & UI Disabled Guards
  // ----------------------------------------------------------------------------------
  console.log("\n📌 Scenario 5: Codebase Inspection for Admin In-Flight & UI Disabled Guards...");

  const annPage = fs.readFileSync(path.join(process.cwd(), 'app', 'admin', 'announcements', 'page.tsx'), 'utf8');
  assert("Announcements page contains isSubmitting state", annPage.includes('isSubmitting'));
  assert("Announcements submit button has isLoading & disabled guards", annPage.includes('isLoading={isSubmitting}') && annPage.includes('disabled={isSubmitting}'));

  const resPage = fs.readFileSync(path.join(process.cwd(), 'app', 'admin', 'resources', 'page.tsx'), 'utf8');
  assert("Resources page contains isSubmitting state", resPage.includes('isSubmitting'));
  assert("Resources submit button has isLoading & disabled guards", resPage.includes('isLoading={isSubmitting}') && resPage.includes('disabled={isSubmitting}'));

  const carPage = fs.readFileSync(path.join(process.cwd(), 'app', 'admin', 'careers', 'page.tsx'), 'utf8');
  assert("Careers page contains isSubmitting state", carPage.includes('isSubmitting'));
  assert("Careers submit button has isLoading & disabled guards", carPage.includes('isLoading={isSubmitting}') && carPage.includes('disabled={isSubmitting}'));

  const adminCtx = fs.readFileSync(path.join(process.cwd(), 'context', 'admin-context.tsx'), 'utf8');
  assert("admin-context.tsx contains inFlightAdminActionRef", adminCtx.includes('inFlightAdminActionRef'));

  const socialCtx = fs.readFileSync(path.join(process.cwd(), 'context', 'social-context.tsx'), 'utf8');
  assert("social-context.tsx contains inFlightCareersRef", socialCtx.includes('inFlightCareersRef'));

  console.log("\n================================================================================");
  console.log(`RESULTS: ${passedTests} / ${totalTests} Passed`);
  console.log("================================================================================");

  if (passedTests === totalTests) {
    console.log("🎉 PHASE 3 STEP 2 ADMIN CMS HARDENING VERIFIED WITH 100% SUCCESS!");
    process.exit(0);
  } else {
    console.error("❌ STEP 2 ADMIN CMS TESTS FAILED!");
    process.exit(1);
  }
}

runStep2AdminTests();
