import { NameResolutionResult, FullNameResolutionResult } from "./types";
import {
  normalizeArabicName,
  normalizeEnglishName,
  sanitizeArabicNameOrthography,
  isArabicText,
  isArabiziText
} from "./normalization";
import {
  ARABIC_CANONICAL_MAP,
  ENGLISH_CANONICAL_MAP,
  ALIAS_MAP,
  CanonicalNameEntry
} from "./dictionary";
import { resolveCompoundName } from "./compound";
import { resolveArabiziName } from "./arabizi";
import { resolveFuzzyName } from "./fuzzy";
import {
  transliterateArabicToEnglishFallback,
  transliterateEnglishToArabicFallback
} from "./transliteration";

// Noise words in email usernames / handles to filter out if confidence is low
const NOISE_TOKENS = new Set([
  "test", "admin", "dev", "user", "student", "official", "mail", "gmail",
  "yahoo", "hotmail", "com", "edu", "eg", "su", "2022", "2023", "2024",
  "2025", "2026", "123", "1234", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"
]);

/**
 * Resolves a single name token through the layered pipeline.
 */
export function resolveName(input: string): NameResolutionResult {
  if (!input || !input.trim()) {
    return {
      input: "",
      arabic: null,
      english: null,
      normalized: "",
      source: "unknown",
      confidence: 0.0,
      isKnownName: false
    };
  }

  const raw = input.trim();
  const isAr = isArabicText(raw);

  if (isAr) {
    const normAr = normalizeArabicName(raw);

    // 1. Exact Canonical Match (Arabic)
    if (ARABIC_CANONICAL_MAP.has(normAr)) {
      const match = ARABIC_CANONICAL_MAP.get(normAr)!;
      return {
        input: raw,
        arabic: match.arabic,
        english: match.english,
        normalized: normAr,
        source: "exact",
        confidence: 1.0,
        isKnownName: true
      };
    }

    // 2. Compound Match (Arabic)
    const compound = resolveCompoundName(normAr);
    if (compound) {
      return {
        input: raw,
        arabic: compound.arabic,
        english: compound.english,
        normalized: normAr,
        source: "compound",
        confidence: 0.97,
        isKnownName: true
      };
    }

    // 3. Fuzzy Match (Arabic)
    const fuzzy = resolveFuzzyName(normAr, 0.88);
    if (fuzzy) {
      return {
        input: raw,
        arabic: fuzzy.entry.arabic,
        english: fuzzy.entry.english,
        normalized: normAr,
        source: "fuzzy",
        confidence: Number(fuzzy.similarity.toFixed(2)),
        isKnownName: true
      };
    }

    // 4. Deterministic Fallback Transliteration
    const fallbackEn = transliterateArabicToEnglishFallback(raw);
    return {
      input: raw,
      arabic: raw,
      english: fallbackEn,
      normalized: normAr,
      source: "fallback",
      confidence: 0.75,
      isKnownName: false
    };
  }

  // --- English / Latin / Arabizi Processing ---
  const normEn = normalizeEnglishName(raw);

  // Filter out standalone obvious noise
  if (NOISE_TOKENS.has(normEn)) {
    return {
      input: raw,
      arabic: null,
      english: null,
      normalized: normEn,
      source: "unknown",
      confidence: 0.0,
      isKnownName: false
    };
  }

  // 1. Exact Canonical Match (English)
  if (ENGLISH_CANONICAL_MAP.has(normEn)) {
    const match = ENGLISH_CANONICAL_MAP.get(normEn)!;
    return {
      input: raw,
      arabic: match.arabic,
      english: match.english,
      normalized: normEn,
      source: "exact",
      confidence: 1.0,
      isKnownName: true
    };
  }

  // 2. Alias Lookup
  if (ALIAS_MAP.has(normEn)) {
    const match = ALIAS_MAP.get(normEn)!;
    return {
      input: raw,
      arabic: match.arabic,
      english: match.english,
      normalized: normEn,
      source: "alias",
      confidence: 0.99,
      isKnownName: true
    };
  }

  // 3. Compound Name Resolution
  const compound = resolveCompoundName(normEn);
  if (compound) {
    return {
      input: raw,
      arabic: compound.arabic,
      english: compound.english,
      normalized: normEn,
      source: "compound",
      confidence: 0.97,
      isKnownName: true
    };
  }

  // 4. Arabizi Resolution
  if (isArabiziText(raw)) {
    const arabiziMatch = resolveArabiziName(raw);
    if (arabiziMatch) {
      return {
        input: raw,
        arabic: arabiziMatch.arabic,
        english: arabiziMatch.english,
        normalized: normEn,
        source: "arabizi",
        confidence: 0.95,
        isKnownName: true
      };
    }
  }

  // 5. Fuzzy Match (English)
  const fuzzy = resolveFuzzyName(normEn, 0.88);
  if (fuzzy) {
    return {
      input: raw,
      arabic: fuzzy.entry.arabic,
      english: fuzzy.entry.english,
      normalized: normEn,
      source: "fuzzy",
      confidence: Number(fuzzy.similarity.toFixed(2)),
      isKnownName: true
    };
  }

  // 6. Deterministic Fallback Transliteration
  const fallbackAr = transliterateEnglishToArabicFallback(raw);
  const formattedEn = normEn ? normEn.charAt(0).toUpperCase() + normEn.slice(1) : raw;

  return {
    input: raw,
    arabic: fallbackAr,
    english: formattedEn,
    normalized: normEn,
    source: "fallback",
    confidence: 0.75,
    isKnownName: false
  };
}

/**
 * Resolves full names containing multiple tokens or compound parts.
 */
export function resolveFullName(input: string): FullNameResolutionResult {
  if (!input || !input.trim()) {
    return {
      input: "",
      arabic: "",
      english: "",
      confidence: 0.0,
      isKnownName: false,
      tokens: []
    };
  }

  const raw = input.trim();

  // Check if entire input resolves as a known compound name first (e.g. "Abdel Rahman", "عبد الله")
  const fullCompound = resolveCompoundName(raw);
  if (fullCompound) {
    const res = resolveName(raw);
    return {
      input: raw,
      arabic: fullCompound.arabic,
      english: fullCompound.english,
      confidence: 0.97,
      isKnownName: true,
      tokens: [res]
    };
  }

  // Tokenize by spaces, dots, underscores, hyphens
  const rawTokens = raw
    .replace(/[._-]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  // Group tokens for compound prefixes like "عبد" / "Abd" / "Abdel"
  const groupedTokens: string[] = [];
  let idx = 0;

  while (idx < rawTokens.length) {
    const current = rawTokens[idx];
    const next = rawTokens[idx + 1];

    if (next && (current.toLowerCase() === "el" || current.toLowerCase() === "al")) {
      const elCombined = `${current}${next}`;
      const elRes = resolveName(elCombined);
      if (elRes.isKnownName || elRes.arabic) {
        groupedTokens.push(elCombined);
        idx += 2;
        continue;
      }
    }

    if (idx + 2 < rawTokens.length) {
      const combined3 = `${current} ${rawTokens[idx + 1]} ${rawTokens[idx + 2]}`;
      const compoundCheck3 = resolveCompoundName(combined3);
      if (compoundCheck3) {
        groupedTokens.push(combined3);
        idx += 3;
        continue;
      }
    }

    if (next) {
      const combined = `${current} ${next}`;
      const compoundCheck = resolveCompoundName(combined);
      if (compoundCheck) {
        groupedTokens.push(combined);
        idx += 2;
        continue;
      }
    }

    groupedTokens.push(current);
    idx++;
  }

  // Resolve each token individually
  const tokenResults: NameResolutionResult[] = [];
  const arParts: string[] = [];
  const enParts: string[] = [];
  let totalConfidence = 0;
  let knownCount = 0;

  for (const token of groupedTokens) {
    const res = resolveName(token);
    // Ignore low-confidence noise tokens in email handles unless it's the only token
    if (!res.isKnownName && NOISE_TOKENS.has(res.normalized) && groupedTokens.length > 1) {
      continue;
    }

    tokenResults.push(res);
    if (res.arabic && (arParts.length === 0 || arParts[arParts.length - 1] !== res.arabic)) {
      arParts.push(res.arabic);
    }
    if (res.english && (enParts.length === 0 || enParts[enParts.length - 1] !== res.english)) {
      enParts.push(res.english);
    }
    totalConfidence += res.confidence;
    if (res.isKnownName) knownCount++;
  }

  const avgConfidence =
    tokenResults.length > 0 ? Number((totalConfidence / tokenResults.length).toFixed(2)) : 0.0;
  const isOverallKnown = knownCount > 0 && knownCount >= Math.ceil(tokenResults.length / 2);

  const rawArabic = arParts.join(" ") || raw;
  const finalArabic = sanitizeArabicNameOrthography(rawArabic);

  return {
    input: raw,
    arabic: finalArabic,
    english: enParts.join(" ") || raw,
    confidence: avgConfidence,
    isKnownName: isOverallKnown,
    tokens: tokenResults
  };
}
