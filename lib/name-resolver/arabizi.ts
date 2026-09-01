import { CanonicalNameEntry, ARABIC_CANONICAL_MAP } from "./dictionary";
import { isArabiziText, normalizeArabicName, normalizeEnglishName } from "./normalization";
import { resolveCompoundName } from "./compound";

const ARABIZI_EXACT_MAP: Record<string, string> = {
  "3mr": "عمر",
  "3li": "علي",
  "7assan": "حسن",
  "7asan": "حسن",
  "7ossam": "حسام",
  "7usam": "حسام",
  "5aled": "خالد",
  "5alid": "خالد",
  "9alah": "صلاح",
  "3bdallah": "عبد الله",
  "3bd allah": "عبد الله",
  "3bd el rahman": "عبد الرحمن",
  "3bd elrahman": "عبد الرحمن",
  "3bdalrahman": "عبد الرحمن",
  "3bdelrahman": "عبد الرحمن",
  "3bd el aziz": "عبد العزيز",
  "3bdelaziz": "عبد العزيز",
  "5alil": "خليل",
  "7ussein": "حسين",
  "7ussain": "حسين",
  "7afiz": "حافظ",
  "7amza": "حمزة",
  "7amad": "حماد",
  "7amed": "حامد",
  "7atym": "حاتم",
  "7atem": "حاتم",
  "7any": "هاني",
  "7ani": "هاني",
  "3bdal": "عبد ال",
  "3bdel": "عبد ال",
  "3adel": "عادل",
  "3adly": "عدلي",
  "3bd": "عبد",
  "3amr": "عمرو",
  "3mar": "عمار",
  "3sam": "عصام",
  "3essam": "عصام",
  "3laa": "علاء",
  "3la": "علا",
  "3zza": "عزة",
  "3bbas": "عباس",
  "3bas": "عباس",
  "3lma": "علماء",
  "5adiga": "خديجة",
  "5adija": "خديجة",
  "7abiba": "حبيبة",
  "7aneen": "حنين",
  "7anin": "حنين",
  "7ana": "حنا",
  "7annan": "حنان",
  "7anan": "حنان",
  "7ala": "حلا",
  "7aleema": "حليمة",
  "7alima": "حليمة",
  "8ada": "غادة",
  "8ali": "غالي",
  "8aly": "غالي",
  "8anim": "غانم",
  "8azi": "غازي"
};

export function resolveArabiziName(input: string): CanonicalNameEntry | null {
  if (!input || !isArabiziText(input)) return null;

  const normEn = normalizeEnglishName(input);

  // 1. Check exact Arabizi Map
  if (ARABIZI_EXACT_MAP[normEn]) {
    const arabicCanonical = ARABIZI_EXACT_MAP[normEn];
    const compound = resolveCompoundName(arabicCanonical);
    if (compound) return compound;

    const normAr = normalizeArabicName(arabicCanonical);
    if (ARABIC_CANONICAL_MAP.has(normAr)) {
      return ARABIC_CANONICAL_MAP.get(normAr)!;
    }
  }

  // 2. Transliterate Arabizi numbers to Arabic letters
  let converted = normEn;
  converted = converted
    .replace(/3bd\s*el\s*/g, "عبد ال")
    .replace(/3bd\s*/g, "عبد ")
    .replace(/3/g, "ع")
    .replace(/7/g, "ح")
    .replace(/5/g, "خ")
    .replace(/9/g, "ص")
    .replace(/6/g, "ط")
    .replace(/8/g, "غ")
    .replace(/2/g, "أ");

  const compoundMatch = resolveCompoundName(converted);
  if (compoundMatch) return compoundMatch;

  const normArConverted = normalizeArabicName(converted);
  if (ARABIC_CANONICAL_MAP.has(normArConverted)) {
    return ARABIC_CANONICAL_MAP.get(normArConverted)!;
  }

  return null;
}
