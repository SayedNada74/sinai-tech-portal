/**
 * Unicode and script normalization helpers for Arabic & English names.
 */

export function normalizeArabicName(input: string): string {
  if (!input) return "";

  return input
    .normalize("NFKC") // Standardize unicode
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // Remove zero-width characters
    .replace(/[\u064B-\u065F\u0670]/g, "") // Remove Tashkeel / diacritics
    .replace(/ـ/g, "") // Remove Tatweel (kashida)
    .replace(/[أإآٱ]/g, "ا") // Normalize all Alefs to bare Alef
    .replace(/ى/g, "ي") // Normalize Alef Maqsura to Ya (for lookup comparison)
    .replace(/ة/g, "ه") // Normalize Teh Marbuta to Heh (for comparison)
    .replace(/[^\u0600-\u06FF0-9a-zA-Z\s_\-\.]/g, " ") // Clean non-word punctuation
    .replace(/\s+/g, " ") // Collapse repeated spaces
    .trim();
}

/**
 * Ensures perfect Arabic orthography & spacing for names:
 * Fixes: "عبد الرحمان" -> "عبد الرحمن", "عبد المنيم" -> "عبد المنعم", "جابالله" -> "جاب الله"
 */
export function sanitizeArabicNameOrthography(text: string): string {
  if (!text) return "";

  return text
    .replace(/الرحمان/g, "الرحمن")
    .replace(/المنيم/g, "المنعم")
    .replace(/جابالله/g, "جاب الله")
    .replace(/جاب\s*اللات/g, "جاب الله")
    .replace(/عبدالله/g, "عبد الله")
    .replace(/عبدالرحمن/g, "عبد الرحمن")
    .replace(/عبدالرحيم/g, "عبد الرحيم")
    .replace(/عبدالعزيز/g, "عبد العزيز")
    .replace(/عبدالهادي/g, "عبد الهادي")
    .replace(/عبدالوهاب/g, "عبد الوهاب")
    .replace(/عبدالسلام/g, "عبد السلام")
    .replace(/عبدالغني/g, "عبد الغني")
    .replace(/عبدالقادر/g, "عبد القادر")
    .replace(/عبداللطيف/g, "عبد اللطيف")
    .replace(/عبدالناصر/g, "عبد الناصر")
    .replace(/عبدالعظيم/g, "عبد العظيم")
    .replace(/عبدالجواد/g, "عبد الجواد")
    .replace(/عبدالحكيم/g, "عبد الحكيم")
    .replace(/عبدالحليم/g, "عبد الحليم")
    .replace(/عبدالخالق/g, "عبد الخالق")
    .replace(/عبدالستار/g, "عبد الستار")
    .replace(/عبدالواحد/g, "عبد الواحد")
    .replace(/عبدالشافي/g, "عبد الشافي")
    .replace(/عبدالمنعم/g, "عبد المنعم")
    .replace(/عبدالحميد/g, "عبد الحميد")
    .replace(/عبدالفتاح/g, "عبد الفتاح")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeEnglishName(input: string): string {
  if (!input) return "";

  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // Strip diacritics / accents
    .toLowerCase()
    .replace(/['’`-]/g, " ") // Treat hyphens and apostrophes as boundaries/spaces
    .replace(/[^a-z0-9\s_\.]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function isArabicText(text: string): boolean {
  if (!text) return false;
  const clean = text.replace(/[\s0-9_\-\.]/g, "");
  if (!clean) return false;
  return /[\u0600-\u06FF]/.test(clean);
}

export function isArabiziText(text: string): boolean {
  if (!text) return false;
  const clean = text.trim();
  // Arabizi typically contains numbers (2,3,5,6,7,8,9) mixed with English letters
  return (
    /^[a-zA-Z2356789\s_\-\.]+$/.test(clean) &&
    /[2356789]/.test(clean) &&
    /[a-zA-Z]/.test(clean)
  );
}
