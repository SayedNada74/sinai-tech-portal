import { CanonicalNameEntry, CANONICAL_NAMES } from "./dictionary";
import { normalizeArabicName, normalizeEnglishName } from "./normalization";

/**
 * Calculates Levenshtein Distance between two normalized strings.
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Calculates Normalized Similarity Score between 0.0 and 1.0.
 */
export function stringSimilarity(a: string, b: string): number {
  const normA = a.trim();
  const normB = b.trim();
  if (normA === normB) return 1.0;
  const maxLen = Math.max(normA.length, normB.length);
  if (maxLen === 0) return 1.0;

  const distance = levenshteinDistance(normA, normB);
  return 1.0 - distance / maxLen;
}

/**
 * Safely resolves a fuzzy match against canonical names.
 * Threshold defaults to 0.88 to prevent over-aggressive guessing.
 */
export function resolveFuzzyName(
  input: string,
  threshold = 0.88
): { entry: CanonicalNameEntry; similarity: number } | null {
  if (!input || input.trim().length < 3) return null;

  const normEn = normalizeEnglishName(input);
  const normAr = normalizeArabicName(input);

  let bestMatch: CanonicalNameEntry | null = null;
  let maxSimilarity = 0;

  for (const entry of CANONICAL_NAMES) {
    const targetEn = normalizeEnglishName(entry.english);
    const targetAr = normalizeArabicName(entry.arabic);

    const simEn = stringSimilarity(normEn, targetEn);
    const simAr = stringSimilarity(normAr, targetAr);
    const sim = Math.max(simEn, simAr);

    if (sim > maxSimilarity) {
      maxSimilarity = sim;
      bestMatch = entry;
    }
  }

  if (bestMatch && maxSimilarity >= threshold) {
    return { entry: bestMatch, similarity: maxSimilarity };
  }

  return null;
}
