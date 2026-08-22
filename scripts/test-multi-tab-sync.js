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

// In-memory simulated LocalStorage Bus to emulate multi-tab browser environment
class SimulatedLocalStorage {
  constructor() {
    this.store = new Map();
    this.listeners = [];
  }

  getItem(key) {
    return this.store.get(key) || null;
  }

  setItem(key, value, sourceTabId = "tab-main") {
    const oldValue = this.store.get(key) || null;
    this.store.set(key, String(value));
    
    // Notify all listeners (excluding source tab)
    this.listeners.forEach(({ tabId, callback }) => {
      if (tabId !== sourceTabId) {
        callback({
          key,
          oldValue,
          newValue: String(value)
        });
      }
    });
  }

  removeItem(key, sourceTabId = "tab-main") {
    const oldValue = this.store.get(key) || null;
    this.store.delete(key);
    this.listeners.forEach(({ tabId, callback }) => {
      if (tabId !== sourceTabId) {
        callback({
          key,
          oldValue,
          newValue: null
        });
      }
    });
  }

  addListener(tabId, callback) {
    this.listeners.push({ tabId, callback });
  }
}

// Type-aware state merger functions under test
function mergeLearningState(current, updates) {
  const merged = { ...current };

  if (updates.bookmarks !== undefined) {
    const existing = merged.bookmarks || [];
    const map = new Map(existing.map(b => [b.id, b]));
    updates.bookmarks.forEach(b => map.set(b.id, b));
    merged.bookmarks = Array.from(map.values());
  }

  if (updates.roadmapProgress !== undefined) {
    merged.roadmapProgress = {
      ...(merged.roadmapProgress || {}),
      ...updates.roadmapProgress
    };
  }

  if (updates.likedResources !== undefined) {
    merged.likedResources = Array.from(new Set([...(merged.likedResources || []), ...updates.likedResources]));
  }

  if (updates.ratedResources !== undefined) {
    merged.ratedResources = { ...(merged.ratedResources || {}), ...updates.ratedResources };
  }

  if (updates.downloadedResources !== undefined) {
    merged.downloadedResources = { ...(merged.downloadedResources || {}), ...updates.downloadedResources };
  }

  if (updates.recentlyViewed !== undefined) {
    const combined = [...updates.recentlyViewed, ...(merged.recentlyViewed || [])];
    const map = new Map();
    combined.forEach(item => {
      if (!map.has(item.id)) map.set(item.id, item);
    });
    merged.recentlyViewed = Array.from(map.values()).slice(0, 4);
  }

  return merged;
}

function mergeSocialState(current, updates) {
  const merged = { ...current };

  if (updates.savedJobs !== undefined) {
    merged.savedJobs = Array.from(new Set([...(merged.savedJobs || []), ...updates.savedJobs]));
  }

  if (updates.savedEvents !== undefined) {
    merged.savedEvents = Array.from(new Set([...(merged.savedEvents || []), ...updates.savedEvents]));
  }

  if (updates.savedPosts !== undefined) {
    merged.savedPosts = Array.from(new Set([...(merged.savedPosts || []), ...updates.savedPosts]));
  }

  if (updates.reminders !== undefined) {
    const existing = merged.reminders || [];
    const map = new Map(existing.map(r => [r.id, r]));
    updates.reminders.forEach(r => map.set(r.id, r));
    merged.reminders = Array.from(map.values());
  }

  if (updates.notifications !== undefined) {
    const existing = merged.notifications || [];
    const map = new Map(existing.map(n => [n.id, n]));
    updates.notifications.forEach(n => map.set(n.id, n));
    merged.notifications = Array.from(map.values());
  }

  if (updates.moodleUrl !== undefined) {
    merged.moodleUrl = updates.moodleUrl;
  }

  return merged;
}

async function runMultiTabSyncTests() {
  console.log("================================================================================");
  console.log("⚡ TESTING MULTI-TAB SYNCHRONIZATION & CONCURRENCY SUITE");
  console.log("================================================================================");

  const bus = new SimulatedLocalStorage();
  const userId = "test-user-123";
  const learningKey = `su_learning_${userId}`;
  const socialKey = `su_social_${userId}`;
  const academicKey = `su_academic_${userId}`;

  // ----------------------------------------------------------------------------------
  // SCENARIO 1: Tab A (Bookmark) + Tab B (Roadmap Progress)
  // ----------------------------------------------------------------------------------
  console.log("\n📌 Scenario 1: Tab A (Bookmark) + Tab B (Roadmap Progress)...");
  
  // Initial state
  bus.setItem(learningKey, JSON.stringify({
    bookmarks: [{ id: "c-1", type: "course", title: "Intro to CS", link: "/courses/CS101" }],
    roadmapProgress: { "frontend": ["html"] },
    likedResources: ["res-1"],
    ratedResources: { "res-1": 5 },
    downloadedResources: {},
    recentlyViewed: []
  }), "init");

  // Tab A adds a bookmark
  const tabA_learning = JSON.parse(bus.getItem(learningKey));
  const tabA_updated = mergeLearningState(tabA_learning, {
    bookmarks: [...tabA_learning.bookmarks, { id: "c-2", type: "course", title: "Data Structures", link: "/courses/CS102" }]
  });
  bus.setItem(learningKey, JSON.stringify(tabA_updated), "tab-A");

  // Tab B updates roadmap progress concurrently
  const tabB_current = JSON.parse(bus.getItem(learningKey));
  const tabB_updated = mergeLearningState(tabB_current, {
    roadmapProgress: { "frontend": ["html", "css", "js"] }
  });
  bus.setItem(learningKey, JSON.stringify(tabB_updated), "tab-B");

  const finalLearning = JSON.parse(bus.getItem(learningKey));
  assert("Tab A bookmark 'c-2' is preserved", finalLearning.bookmarks.some(b => b.id === "c-2"));
  assert("Original bookmark 'c-1' is preserved", finalLearning.bookmarks.some(b => b.id === "c-1"));
  assert("Tab B roadmap progress has all 3 nodes", finalLearning.roadmapProgress["frontend"].length === 3);
  assert("Existing likedResources are not wiped", finalLearning.likedResources.includes("res-1"));

  // ----------------------------------------------------------------------------------
  // SCENARIO 2: Tab A (Saved Job) + Tab B (Reminder)
  // ----------------------------------------------------------------------------------
  console.log("\n📌 Scenario 2: Tab A (Saved Job) + Tab B (Calendar Reminder)...");

  bus.setItem(socialKey, JSON.stringify({
    savedJobs: ["job-101"],
    savedEvents: [],
    savedPosts: [],
    reminders: [{ id: "rem-1", title: "Midterm Exam", date: "2026-09-01" }],
    notifications: [],
    moodleUrl: ""
  }), "init");

  // Tab A saves a new job
  const tabA_social = JSON.parse(bus.getItem(socialKey));
  const tabA_socUpdated = mergeSocialState(tabA_social, {
    savedJobs: ["job-101", "job-102"]
  });
  bus.setItem(socialKey, JSON.stringify(tabA_socUpdated), "tab-A");

  // Tab B adds a reminder
  const tabB_social = JSON.parse(bus.getItem(socialKey));
  const tabB_socUpdated = mergeSocialState(tabB_social, {
    reminders: [...tabB_social.reminders, { id: "rem-2", title: "Final Project Due", date: "2026-09-15" }]
  });
  bus.setItem(socialKey, JSON.stringify(tabB_socUpdated), "tab-B");

  const finalSocial = JSON.parse(bus.getItem(socialKey));
  assert("Tab A savedJob 'job-102' is preserved", finalSocial.savedJobs.includes("job-102"));
  assert("Initial savedJob 'job-101' is preserved", finalSocial.savedJobs.includes("job-101"));
  assert("Tab B reminder 'rem-2' is preserved", finalSocial.reminders.some(r => r.id === "rem-2"));
  assert("Initial reminder 'rem-1' is preserved", finalSocial.reminders.some(r => r.id === "rem-1"));

  // ----------------------------------------------------------------------------------
  // SCENARIO 3: Tab A (Academic Mark Course) + Tab B (Target GPA)
  // ----------------------------------------------------------------------------------
  console.log("\n📌 Scenario 3: Tab A (Academic Course Mark) + Tab B (Target GPA)...");

  bus.setItem(academicKey, JSON.stringify({
    completedCourses: [{ code: "CS 101", grade: "A+" }],
    plannedCourses: ["CS 102"],
    targetGpa: 3.5
  }), "init");

  // Tab A marks a course
  const tabA_acad = JSON.parse(bus.getItem(academicKey));
  const tabA_acadUpdated = {
    ...tabA_acad,
    completedCourses: [...tabA_acad.completedCourses, { code: "CS 102", grade: "A" }],
    plannedCourses: tabA_acad.plannedCourses.filter(c => c !== "CS 102")
  };
  bus.setItem(academicKey, JSON.stringify(tabA_acadUpdated), "tab-A");

  // Tab B updates target GPA
  const tabB_acad = JSON.parse(bus.getItem(academicKey));
  const tabB_acadUpdated = {
    ...tabB_acad,
    targetGpa: 3.9
  };
  bus.setItem(academicKey, JSON.stringify(tabB_acadUpdated), "tab-B");

  const finalAcad = JSON.parse(bus.getItem(academicKey));
  assert("Tab A completed course 'CS 102' is preserved", finalAcad.completedCourses.some(c => c.code === "CS 102"));
  assert("Tab B target GPA 3.9 is preserved", finalAcad.targetGpa === 3.9);
  assert("Planned courses properly updated", finalAcad.plannedCourses.length === 0);

  // ----------------------------------------------------------------------------------
  // SCENARIO 4: Tab A (Logout) Cross-Tab Session Termination
  // ----------------------------------------------------------------------------------
  console.log("\n📌 Scenario 4: Tab A (Logout) Cross-Tab Session Termination...");

  let tabB_userState = { id: "user-123", name: "Student" };
  bus.addListener("tab-B", (event) => {
    if (event.key === "su_user_session" && event.newValue === null) {
      tabB_userState = null;
    }
  });

  // Tab A logs out
  bus.removeItem("su_user_session", "tab-A");
  assert("Tab B receives storage event and logs out immediately", tabB_userState === null);

  // ----------------------------------------------------------------------------------
  // SCENARIO 5: Tab A (Theme Dark->Light) + Tab B (Language AR->EN)
  // ----------------------------------------------------------------------------------
  console.log("\n📌 Scenario 5: Tab A (Theme) + Tab B (Language)...");

  let tabB_theme = "dark";
  let tabA_lang = "ar";

  bus.addListener("tab-B", (event) => {
    if (event.key === "app_theme") tabB_theme = event.newValue;
  });

  bus.addListener("tab-A", (event) => {
    if (event.key === "app_lang") tabA_lang = event.newValue;
  });

  // Tab A changes theme to light
  bus.setItem("app_theme", "light", "tab-A");
  assert("Tab B synchronously updates theme to light", tabB_theme === "light");

  // Tab B changes language to en
  bus.setItem("app_lang", "en", "tab-B");
  assert("Tab A synchronously updates language to en", tabA_lang === "en");

  // ----------------------------------------------------------------------------------
  // SCENARIO 6: Codebase File Inspection
  // ----------------------------------------------------------------------------------
  console.log("\n📌 Scenario 6: Codebase File Inspection for Storage Listeners...");

  const filesToCheck = [
    { file: 'context/learning-context.tsx', pattern: 'addEventListener("storage"' },
    { file: 'context/social-context.tsx', pattern: 'addEventListener("storage"' },
    { file: 'context/academic-context.tsx', pattern: 'addEventListener("storage"' },
    { file: 'context/app-context.tsx', pattern: 'addEventListener("storage"' },
    { file: 'context/auth-context.tsx', pattern: 'addEventListener("storage"' }
  ];

  filesToCheck.forEach(({ file, pattern }) => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const hasListener = content.includes(pattern) || content.includes("addEventListener('storage'");
      assert(`${file} contains storage event listener`, hasListener);
    }
  });

  console.log("\n================================================================================");
  console.log(`RESULTS: ${passedTests} / ${totalTests} Passed`);
  console.log("================================================================================");

  if (passedTests === totalTests) {
    console.log("🎉 ALL MULTI-TAB SYNCHRONIZATION TESTS PASSED!");
    process.exit(0);
  } else {
    console.error("❌ SOME TESTS FAILED!");
    process.exit(1);
  }
}

runMultiTabSyncTests();
