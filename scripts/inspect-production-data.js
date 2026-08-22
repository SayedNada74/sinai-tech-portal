// ==============================================================================================
// 🔬 Empirical Inspection Script: Query Live Production Supabase Database
// Reads actual schema and rows to verify P0/P1 claims with real evidence.
// ==============================================================================================

const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const envFile = fs.readFileSync(path.join(__dirname, "../.env.local"), "utf-8");
const env = {};
envFile.split("\n").forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#")) {
    const [k, ...v] = trimmed.split("=");
    if (k && v) env[k.trim()] = v.join("=").trim();
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function inspectProductionData() {
  console.log("================================================================================");
  console.log("🔬 LIVE PRODUCTION DATABASE EMPIRICAL DATA INSPECTION");
  console.log("================================================================================\n");

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
      const { data, error, count } = await supabase
        .from(tbl)
        .select("*", { count: "exact" });

      if (error) {
        console.log(`❌ Table [${tbl}]: Error -> ${error.code} : ${error.message}`);
      } else {
        console.log(`✅ Table [${tbl}]: Total Rows: ${data.length}`);
        if (data.length > 0) {
          console.log(`   Sample Keys:`, Object.keys(data[0]));
          console.log(`   Sample Data (Row 1):`, JSON.stringify(data[0], null, 2).slice(0, 300) + "...\n");
        } else {
          console.log(`   (Table is currently empty in production)\n`);
        }
      }
    } catch (e) {
      console.error(`❌ Table [${tbl}]: Exception -> ${e.message}\n`);
    }
  }

  // Inspect profiles learning_state and social_state specifically
  try {
    const { data: profs } = await supabase.from("profiles").select("id, email, learning_state, social_state, privacy_settings");
    console.log("--------------------------------------------------------------------------------");
    console.log("👤 Profiles Learning/Social State Inspection:");
    if (profs && profs.length > 0) {
      profs.forEach((p, idx) => {
        console.log(`Profile ${idx + 1} (${p.email || p.id}):`);
        console.log(`  learning_state type: ${typeof p.learning_state}, length/content:`, JSON.stringify(p.learning_state)?.slice(0, 150));
        console.log(`  social_state type: ${typeof p.social_state}, length/content:`, JSON.stringify(p.social_state)?.slice(0, 150));
      });
    }
  } catch (e) {
    console.error("Error inspecting profile states:", e.message);
  }
}

inspectProductionData();
