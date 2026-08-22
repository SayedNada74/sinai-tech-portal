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

async function inspectReviewsProduction() {
  console.log("================================================================================");
  console.log("🔍 LIVE PRODUCTION REVIEWS FORENSIC AUDIT (READ ONLY)");
  console.log("================================================================================");

  // 1. Inspect public.reviews table
  try {
    const { data: reviewsRows, error: reviewsErr } = await supabase
      .from("reviews")
      .select("*");

    if (reviewsErr) {
      console.log(`❌ Error querying public.reviews: ${reviewsErr.message}`);
    } else {
      console.log(`✅ public.reviews table row count: ${reviewsRows.length}`);
      if (reviewsRows.length > 0) {
        console.log(`📋 Sample Review Row:`, JSON.stringify(reviewsRows[0], null, 2));
      } else {
        console.log(`ℹ️ public.reviews table is currently EMPTY in production (0 rows).`);
      }
    }
  } catch (e) {
    console.error("Exception checking public.reviews:", e.message);
  }

  console.log("\n--------------------------------------------------------------------------------");
  console.log("👤 Inspecting profiles.learning_state.reviews across all profiles...");
  console.log("--------------------------------------------------------------------------------");

  // 2. Inspect profiles table
  try {
    const { data: profiles, error: profErr } = await supabase
      .from("profiles")
      .select("id, email, name, role, learning_state");

    if (profErr) {
      console.log(`❌ Error querying profiles: ${profErr.message}`);
    } else {
      console.log(`✅ Total profiles examined: ${profiles.length}`);
      let totalEmbeddedReviews = 0;
      let profilesWithReviews = [];

      for (const p of profiles) {
        let reviewsList = [];
        if (p.learning_state) {
          try {
            const parsed = typeof p.learning_state === "string" ? JSON.parse(p.learning_state) : p.learning_state;
            if (Array.isArray(parsed.reviews) && parsed.reviews.length > 0) {
              reviewsList = parsed.reviews;
              totalEmbeddedReviews += parsed.reviews.length;
              profilesWithReviews.push({
                email: p.email,
                name: p.name,
                reviewsCount: parsed.reviews.length,
                reviews: parsed.reviews
              });
            }
          } catch (e) {}
        }
      }

      console.log(`📊 Profiles containing embedded learning_state.reviews: ${profilesWithReviews.length}`);
      console.log(`📊 Total embedded reviews found: ${totalEmbeddedReviews}`);

      if (profilesWithReviews.length > 0) {
        console.log(`\n📋 Details of embedded reviews:`, JSON.stringify(profilesWithReviews, null, 2));
      } else {
        console.log(`ℹ️ No embedded reviews found inside any profile.learning_state!`);
      }
    }
  } catch (e) {
    console.error("Exception checking profiles:", e.message);
  }

  console.log("\n================================================================================");
  console.log("AUDIT FINISHED (READ ONLY)");
  console.log("================================================================================");
  process.exit(0);
}

inspectReviewsProduction();
