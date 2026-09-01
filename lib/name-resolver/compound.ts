import { CanonicalNameEntry } from "./dictionary";
import { normalizeArabicName, normalizeEnglishName } from "./normalization";

// Compound mappings for "عبد" names
const COMPOUND_ARABIC_MAP: Record<string, CanonicalNameEntry> = {
  "عبد الله": { arabic: "عبد الله", english: "Abdullah", category: "male" },
  "عبدالله": { arabic: "عبد الله", english: "Abdullah", category: "male" },
  "عبد الرحمن": { arabic: "عبد الرحمن", english: "Abdelrahman", category: "male" },
  "عبدالرحمن": { arabic: "عبد الرحمن", english: "Abdelrahman", category: "male" },
  "عبد الرحيم": { arabic: "عبد الرحيم", english: "Abdelrahim", category: "male" },
  "عبدالرحيم": { arabic: "عبد الرحيم", english: "Abdelrahim", category: "male" },
  "عبد العزيز": { arabic: "عبد العزيز", english: "Abdelaziz", category: "male" },
  "عبدالعزيز": { arabic: "عبد العزيز", english: "Abdelaziz", category: "male" },
  "عبد الهادي": { arabic: "عبد الهادي", english: "Abdelhady", category: "male" },
  "عبدالهادي": { arabic: "عبد الهادي", english: "Abdelhady", category: "male" },
  "عبد الوهاب": { arabic: "عبد الوهاب", english: "Abdelwahab", category: "male" },
  "عبدالوهاب": { arabic: "عبد الوهاب", english: "Abdelwahab", category: "male" },
  "عبد السلام": { arabic: "عبد السلام", english: "Abdelsalam", category: "male" },
  "عبدالسلام": { arabic: "عبد السلام", english: "Abdelsalam", category: "male" },
  "عبد الغني": { arabic: "عبد الغني", english: "Abdelghany", category: "male" },
  "عبدالغني": { arabic: "عبد الغني", english: "Abdelghany", category: "male" },
  "عبد القادر": { arabic: "عبد القادر", english: "Abdelkader", category: "male" },
  "عبدالقادر": { arabic: "عبد القادر", english: "Abdelkader", category: "male" },
  "عبد اللطيف": { arabic: "عبد اللطيف", english: "Abdellatif", category: "male" },
  "عبداللطيف": { arabic: "عبد اللطيف", english: "Abdellatif", category: "male" },
  "عبد الناصر": { arabic: "عبد الناصر", english: "Abdelnasser", category: "male" },
  "عبدالناصر": { arabic: "عبد الناصر", english: "Abdelnasser", category: "male" },
  "عبد العظيم": { arabic: "عبد العظيم", english: "Abdelazim", category: "male" },
  "عبدالعظيم": { arabic: "عبد العظيم", english: "Abdelazim", category: "male" },
  "عبد الجواد": { arabic: "عبد الجواد", english: "Abdelgawad", category: "male" },
  "عبدالجواد": { arabic: "عبد الجواد", english: "Abdelgawad", category: "male" },
  "عبد الحكيم": { arabic: "عبد الحكيم", english: "Abdelhakim", category: "male" },
  "عبدالحكيم": { arabic: "عبد الحكيم", english: "Abdelhakim", category: "male" },
  "عبد الحليم": { arabic: "عبد الحليم", english: "Abdelhalim", category: "male" },
  "عبدالحليم": { arabic: "عبد الحليم", english: "Abdelhalim", category: "male" },
  "عبد الخالق": { arabic: "عبد الخالق", english: "Abdelkhalek", category: "male" },
  "عبدالخالق": { arabic: "عبد الخالق", english: "Abdelkhalek", category: "male" },
  "عبد الستار": { arabic: "عبد الستار", english: "Abdelsattar", category: "male" },
  "عبدالستار": { arabic: "عبد الستار", english: "Abdelsattar", category: "male" },
  "عبد الواحد": { arabic: "عبد الواحد", english: "Abdelwahed", category: "male" },
  "عبدالواحد": { arabic: "عبد الواحد", english: "Abdelwahed", category: "male" },
  "عبد الشافي": { arabic: "عبد الشافي", english: "Abdelshafy", category: "male" },
  "عبدالشافي": { arabic: "عبد الشافي", english: "Abdelshafy", category: "male" },
  "عبد المنعم": { arabic: "عبد المنعم", english: "Abdelmoneim", category: "male" },
  "عبدالمنعم": { arabic: "عبد المنعم", english: "Abdelmoneim", category: "male" }
};

const COMPOUND_ENGLISH_ALIASES: Record<string, CanonicalNameEntry> = {
  // Abdullah
  abdullah: COMPOUND_ARABIC_MAP["عبد الله"],
  abdallah: COMPOUND_ARABIC_MAP["عبد الله"],
  "abd allah": COMPOUND_ARABIC_MAP["عبد الله"],

  // Abdelrahman
  abdelrahman: COMPOUND_ARABIC_MAP["عبد الرحمن"],
  abdulrahman: COMPOUND_ARABIC_MAP["عبد الرحمن"],
  abdelrhman: COMPOUND_ARABIC_MAP["عبد الرحمن"],
  abdelrahmaan: COMPOUND_ARABIC_MAP["عبد الرحمن"],
  "abdel rahman": COMPOUND_ARABIC_MAP["عبد الرحمن"],
  "abd el rahman": COMPOUND_ARABIC_MAP["عبد الرحمن"],
  "abd-el-rahman": COMPOUND_ARABIC_MAP["عبد الرحمن"],
  "abdul rahman": COMPOUND_ARABIC_MAP["عبد الرحمن"],
  "3bd el rahman": COMPOUND_ARABIC_MAP["عبد الرحمن"],
  "3bd elrahman": COMPOUND_ARABIC_MAP["عبد الرحمن"],
  "3bdelrahman": COMPOUND_ARABIC_MAP["عبد الرحمن"],
  "3bdallah": COMPOUND_ARABIC_MAP["عبد الله"],
  "3bd allah": COMPOUND_ARABIC_MAP["عبد الله"],
  "3bd el aziz": COMPOUND_ARABIC_MAP["عبد العزيز"],
  "3bdelaziz": COMPOUND_ARABIC_MAP["عبد العزيز"],

  // Abdelrahim
  abdelrahim: COMPOUND_ARABIC_MAP["عبد الرحيم"],
  "abdel rahim": COMPOUND_ARABIC_MAP["عبد الرحيم"],

  // Abdelaziz
  abdelaziz: COMPOUND_ARABIC_MAP["عبد العزيز"],
  abdelazeez: COMPOUND_ARABIC_MAP["عبد العزيز"],
  abdulaziz: COMPOUND_ARABIC_MAP["عبد العزيز"],
  "abdel aziz": COMPOUND_ARABIC_MAP["عبد العزيز"],
  "abdel azeez": COMPOUND_ARABIC_MAP["عبد العزيز"],

  // Abdelhady
  abdelhady: COMPOUND_ARABIC_MAP["عبد الهادي"],
  abdelhadi: COMPOUND_ARABIC_MAP["عبد الهادي"],
  "abdel hady": COMPOUND_ARABIC_MAP["عبد الهادي"],

  // Abdelwahab
  abdelwahab: COMPOUND_ARABIC_MAP["عبد الوهاب"],
  "abdel wahab": COMPOUND_ARABIC_MAP["عبد الوهاب"],

  // Abdelsalam
  abdelsalam: COMPOUND_ARABIC_MAP["عبد السلام"],
  "abdel salam": COMPOUND_ARABIC_MAP["عبد السلام"],

  // Abdelghany
  abdelghany: COMPOUND_ARABIC_MAP["عبد الغني"],
  abdelghani: COMPOUND_ARABIC_MAP["عبد الغني"],

  // Abdelkader
  abdelkader: COMPOUND_ARABIC_MAP["عبد القادر"],
  abdelqader: COMPOUND_ARABIC_MAP["عبد القادر"],

  // Abdelnasser
  abdelnasser: COMPOUND_ARABIC_MAP["عبد الناصر"],

  // Abdelazim
  abdelazim: COMPOUND_ARABIC_MAP["عبد العظيم"],
  abdelazeem: COMPOUND_ARABIC_MAP["عبد العظيم"],

  // Abdelgawad
  abdelgawad: COMPOUND_ARABIC_MAP["عبد الجواد"],

  // Abdelhakim
  abdelhakim: COMPOUND_ARABIC_MAP["عبد الحكيم"],
  abdelhakeem: COMPOUND_ARABIC_MAP["عبد الحكيم"],

  // Abdelhalim
  abdelhalim: COMPOUND_ARABIC_MAP["عبد الحليم"],

  // Abdelkhalek
  abdelkhalek: COMPOUND_ARABIC_MAP["عبد الخالق"],

  // Abdelwahed
  abdelwahed: COMPOUND_ARABIC_MAP["عبد الواحد"],

  // Abdelshafy
  abdelshafy: COMPOUND_ARABIC_MAP["عبد الشافي"],
  abdelshafi: COMPOUND_ARABIC_MAP["عبد الشافي"],

  // Abdelmoneim
  abdelmoneim: COMPOUND_ARABIC_MAP["عبد المنعم"],
  abdelmonem: COMPOUND_ARABIC_MAP["عبد المنعم"]
};

// Pre-calculated normalized maps
const NORM_COMPOUND_ARABIC = new Map<string, CanonicalNameEntry>();
const NORM_COMPOUND_ENGLISH = new Map<string, CanonicalNameEntry>();

for (const [key, entry] of Object.entries(COMPOUND_ARABIC_MAP)) {
  NORM_COMPOUND_ARABIC.set(normalizeArabicName(key), entry);
}

for (const [key, entry] of Object.entries(COMPOUND_ENGLISH_ALIASES)) {
  NORM_COMPOUND_ENGLISH.set(normalizeEnglishName(key), entry);
}

export function resolveCompoundName(input: string): CanonicalNameEntry | null {
  if (!input) return null;
  const normAr = normalizeArabicName(input);
  if (NORM_COMPOUND_ARABIC.has(normAr)) {
    return NORM_COMPOUND_ARABIC.get(normAr)!;
  }

  const normEn = normalizeEnglishName(input);
  if (NORM_COMPOUND_ENGLISH.has(normEn)) {
    return NORM_COMPOUND_ENGLISH.get(normEn)!;
  }

  return null;
}
