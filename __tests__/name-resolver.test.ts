import {
  resolveName,
  resolveFullName,
  normalizeArabicName,
  normalizeEnglishName
} from "../lib/name-resolver";

export function runNameResolverTests() {
  console.log("=========================================");
  console.log("🧪 Production-Grade Arabic Name Resolver Test Suite");
  console.log("=========================================\n");

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

  // --- 1. Arabic Normalization Tests ---
  console.log("\n--- Phase 1: Arabic Normalization ---");
  assert(normalizeArabicName("أحمد") === "احمد", "Normalize Alef (أحمد)", "Expected 'احمد'");
  assert(normalizeArabicName("إحمد") === "احمد", "Normalize Alef (إحمد)", "Expected 'احمد'");
  assert(normalizeArabicName("إبراهيم") === "ابراهيم", "Normalize Ibrahim", "Expected 'ابراهيم'");

  const r1 = resolveName("أحمد");
  const r2 = resolveName("احمد");
  assert(r1.arabic === "أحمد" && r1.english === "Ahmed", "Resolve Canonical (أحمد)", `Got ${r1.arabic}/${r1.english}`);
  assert(r2.arabic === "أحمد" && r2.english === "Ahmed", "Resolve Normalized (احمد)", `Got ${r2.arabic}/${r2.english}`);

  // --- 2. English Aliases Tests ---
  console.log("\n--- Phase 2: English Aliases to Canonical Arabic ---");
  const mohamedSpellings = ["Mohamed", "Mohammed", "Muhammad", "Mohammad", "Mohamad", "Muhamed", "Mohd"];
  for (const name of mohamedSpellings) {
    const res = resolveName(name);
    assert(res.arabic === "محمد" && res.isKnownName, `Alias: ${name} -> محمد`, `Got ${res.arabic}`);
  }

  const youssefSpellings = ["Youssef", "Yousef", "Yusuf", "Yousif", "Youseph"];
  for (const name of youssefSpellings) {
    const res = resolveName(name);
    assert(res.arabic === "يوسف" && res.isKnownName, `Alias: ${name} -> يوسف`, `Got ${res.arabic}`);
  }

  const mostafaSpellings = ["Mostafa", "Mustafa", "Moustafa", "Mustapha"];
  for (const name of mostafaSpellings) {
    const res = resolveName(name);
    assert(res.arabic === "مصطفى" && res.isKnownName, `Alias: ${name} -> مصطفى`, `Got ${res.arabic}`);
  }

  assert(resolveName("Ahmed").arabic === "أحمد", "Alias: Ahmed -> أحمد", "Failed");
  assert(resolveName("Ahmad").arabic === "أحمد", "Alias: Ahmad -> أحمد", "Failed");
  assert(resolveName("Karim").arabic === "كريم", "Alias: Karim -> كريم", "Failed");
  assert(resolveName("Kareem").arabic === "كريم", "Alias: Kareem -> كريم", "Failed");

  // --- 3. Arabizi Tests ---
  console.log("\n--- Phase 3: Arabizi / Franco Resolution ---");
  assert(resolveName("3mr").arabic === "عمر" && resolveName("3mr").source === "arabizi", "Arabizi: 3mr -> عمر", "Failed");
  assert(resolveName("3li").arabic === "علي" && resolveName("3li").source === "arabizi", "Arabizi: 3li -> علي", "Failed");
  assert(resolveName("7assan").arabic === "حسن", "Arabizi: 7assan -> حسن", "Failed");
  assert(resolveName("7ossam").arabic === "حسام", "Arabizi: 7ossam -> حسام", "Failed");
  assert(resolveName("5aled").arabic === "خالد", "Arabizi: 5aled -> خالد", "Failed");
  assert(resolveName("9alah").arabic === "صلاح", "Arabizi: 9alah -> صلاح", "Failed");
  assert(resolveName("3bdallah").arabic === "عبد الله", "Arabizi: 3bdallah -> عبد الله", "Failed");
  assert(resolveFullName("3bd el rahman").arabic === "عبد الرحمن", "Arabizi: 3bd el rahman -> عبد الرحمن", "Failed");

  // --- 4. Compound Names Tests ---
  console.log("\n--- Phase 4: Compound Names ---");
  assert(resolveName("عبد الرحمن").arabic === "عبد الرحمن", "Compound: عبد الرحمن", "Failed");
  assert(resolveName("عبدالرحمن").arabic === "عبد الرحمن", "Compound: عبدالرحمن", "Failed");
  assert(resolveName("Abdelrahman").arabic === "عبد الرحمن", "Compound: Abdelrahman", "Failed");
  assert(resolveName("Abdel Rahman").arabic === "عبد الرحمن", "Compound: Abdel Rahman", "Failed");
  assert(resolveName("Abdul Rahman").arabic === "عبد الرحمن", "Compound: Abdul Rahman", "Failed");
  assert(resolveName("Abd El Rahman").arabic === "عبد الرحمن", "Compound: Abd El Rahman", "Failed");
  assert(resolveName("Abdullah").arabic === "عبد الله", "Compound: Abdullah", "Failed");

  // --- 5. User Screenshot Names Tests (Fixing Mangled Names) ---
  console.log("\n--- Phase 5: User Screenshot Names (No Mangled Arabic) ---");

  // Screenshot 1: Mohamed Sherif Ahmed Abdelhamid -> محمد شريف أحمد عبد الحميد
  const s1 = resolveFullName("Mohamed Sherif Ahmed Abdelhamid");
  assert(s1.arabic === "محمد شريف أحمد عبد الحميد", "Screenshot 1: Mohamed Sherif Ahmed Abdelhamid", `Got '${s1.arabic}'`);

  // Screenshot 2: Mohamed Khaled Sabry Saad -> محمد خالد صبري سعد
  const s2 = resolveFullName("Mohamed Khaled Sabry Saad");
  assert(s2.arabic === "محمد خالد صبري سعد", "Screenshot 2: Mohamed Khaled Sabry Saad", `Got '${s2.arabic}'`);

  // Screenshot 3 Card 1: Rana Samy Hamed Abdo -> رنا سامي حامد عبده
  const s3_1 = resolveFullName("Rana Samy Hamed Abdo");
  assert(s3_1.arabic === "رنا سامي حامد عبده", "Screenshot 3-1: Rana Samy Hamed Abdo", `Got '${s3_1.arabic}'`);

  // Screenshot 3 Card 2: Mostafa El-Tayeb Saad El-Tayeb -> مصطفى الطيب سعد الطيب
  const s3_2 = resolveFullName("Mostafa El-Tayeb Saad El-Tayeb");
  assert(s3_2.arabic === "مصطفى الطيب سعد الطيب", "Screenshot 3-2: Mostafa El-Tayeb Saad El-Tayeb", `Got '${s3_2.arabic}'`);

  // Screenshot 3 Card 3: Ahmed Mohamed Ahmed Akrab -> أحمد محمد أحمد عقرب
  const s3_3 = resolveFullName("Ahmed Mohamed Ahmed Akrab");
  assert(s3_3.arabic === "أحمد محمد أحمد عقرب", "Screenshot 3-3: Ahmed Mohamed Ahmed Akrab", `Got '${s3_3.arabic}'`);

  // New Screenshot 1: Ahmed Tawfik Abdelmoneim -> أحمد توفيق عبد المنعم
  const ns1 = resolveFullName("Ahmed Tawfik Abdelmoneim");
  assert(ns1.arabic === "أحمد توفيق عبد المنعم", "New Screenshot 1: Ahmed Tawfik Abdelmoneim", `Got '${ns1.arabic}'`);

  // New Screenshot 2: Mosab Ashraf Abdelwahab Ali -> مصعب أشرف عبد الوهاب علي
  const ns2 = resolveFullName("Mosab Ashraf Abdelwahab Ali");
  assert(ns2.arabic === "مصعب أشرف عبد الوهاب علي", "New Screenshot 2: Mosab Ashraf Abdelwahab Ali", `Got '${ns2.arabic}'`);

  // Phonetic Equivalence Tests (Mousab, Moussab, Musab -> مصعب)
  assert(resolveName("Mousab").arabic === "مصعب", "Mousab -> مصعب (Phonetic)", `Got '${resolveName("Mousab").arabic}'`);
  assert(resolveName("Moussab").arabic === "مصعب", "Moussab -> مصعب (Phonetic)", `Got '${resolveName("Moussab").arabic}'`);

  // Radical Fallback Test Cases (No mangled Arabic!)
  assert(resolveName("Khaled").arabic === "خالد", "Khaled -> خالد (NOT خاليد)", `Got '${resolveName("Khaled").arabic}'`);
  assert(resolveName("Abdelrahman").arabic === "عبد الرحمن", "Abdelrahman -> عبد الرحمن (NOT عبد الرحمان / عبد الرهمان)", `Got '${resolveName("Abdelrahman").arabic}'`);
  assert(resolveName("Abdelmoneim").arabic === "عبد المنعم", "Abdelmoneim -> عبد المنعم (NOT عبد المنيم / عبد المونيم)", `Got '${resolveName("Abdelmoneim").arabic}'`);
  assert(resolveFullName("Abdelrahmaan").arabic === "عبد الرحمن", "Abdelrahmaan -> عبد الرحمن (NOT عبد الرحمان)", `Got '${resolveFullName("Abdelrahmaan").arabic}'`);
  assert(resolveFullName("Abdelmoneem").arabic === "عبد المنعم", "Abdelmoneem -> عبد المنعم (NOT عبد المنيم)", `Got '${resolveFullName("Abdelmoneem").arabic}'`);

  // --- 6. Safety against False Matches ---
  console.log("\n--- Phase 6: Safety against False Matches ---");
  assert(!resolveName("test").isKnownName, "Noise: test", "Should not be known name");
  assert(!resolveName("admin").isKnownName, "Noise: admin", "Should not be known name");
  assert(!resolveName("randomxyz123").isKnownName, "Noise: randomxyz123", "Should not be known name");
  assert(!resolveName("123456").isKnownName, "Noise: 123456", "Should not be known name");

  console.log(`\n=========================================`);
  console.log(`📊 Test Summary: ${passed} Passed | ${failed} Failed`);
  console.log(`=========================================\n`);

  if (failed > 0) {
    throw new Error(`${failed} tests failed!`);
  }
}

// Run tests if executed directly
if (require.main === module) {
  runNameResolverTests();
}
