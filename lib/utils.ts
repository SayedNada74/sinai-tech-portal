import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  resolveName,
  resolveFullName,
  normalizeArabicName,
  normalizeEnglishName,
  transliterateArabicToEnglishFallback,
  transliterateEnglishToArabicFallback,
  isArabicText
} from "./name-resolver";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Re-export name resolver API for convenience
export * from "./name-resolver";

/**
 * Backward-compatible transliteration functions consuming the new engine.
 */
export function transliterateArabicWordToEnglish(word: string): string {
  if (!word) return "";
  const res = resolveFullName(word);
  return res.english || transliterateArabicToEnglishFallback(word);
}

export function transliterateEnglishWordToArabic(word: string): string {
  if (!word) return "";
  const res = resolveFullName(word);
  return res.arabic || transliterateEnglishToArabicFallback(word);
}

export function normalizeArabicText(text?: string | null): string {
  if (!text) return "";
  return normalizeArabicName(text);
}

export function matchesUserQuery(
  user: { name?: string; nameAr?: string; nameEn?: string; email?: string; studentId?: string; department?: string; level?: string },
  query: string
): boolean {
  if (!query || !query.trim()) return false;
  const q = query.trim().toLowerCase();
  const qNorm = normalizeArabicName(q);

  const fields = [
    user.name || "",
    user.nameAr || "",
    user.nameEn || "",
    user.email || "",
    user.email ? user.email.split("@")[0] : "",
    user.studentId || "",
    user.department || "",
    user.level || "",
  ];

  return fields.some((field) => {
    if (!field) return false;
    const fLower = field.toLowerCase();
    const fNorm = normalizeArabicName(fLower);
    return fLower.includes(q) || fNorm.includes(qNorm);
  });
}

/**
 * Primary name localization function consumed by the entire UI platform.
 */
export function getLocalizedUserName(
  userOrName: { name?: string; nameAr?: string; nameEn?: string; email?: string } | string | undefined | null,
  lang: "ar" | "en"
): string {
  if (!userOrName) return "";

  let nameAr = "";
  let nameEn = "";
  let rawName = "";
  let email = "";

  if (typeof userOrName === "object") {
    nameAr = (userOrName.nameAr || "").trim();
    nameEn = (userOrName.nameEn || "").trim();
    rawName = (userOrName.name || "").trim();
    email = (userOrName.email || "").trim();
  } else {
    rawName = userOrName.trim();
    if (isArabicText(rawName)) {
      nameAr = rawName;
    } else {
      nameEn = rawName;
    }
  }

  // Fallback to email username if rawName is empty
  if (!rawName && email) {
    rawName = email.split("@")[0] || "";
  }

  if (lang === "ar") {
    // 1. Explicit Arabic name with only Arabic characters
    if (nameAr && /^[\u0600-\u06FF\s]+$/.test(nameAr)) {
      return nameAr;
    }

    // 2. Resolve via Engine
    const target = nameAr || rawName || (nameEn && !nameEn.includes("@") ? nameEn : "");
    if (target) {
      const resolved = resolveFullName(target);
      if (resolved.arabic) {
        return resolved.arabic;
      }
    }

    return rawName || "طالب";
  } else {
    // 1. Explicit English name with only English characters
    if (nameEn && /^[a-zA-Z\s\.\-]+$/.test(nameEn) && !nameEn.includes("@")) {
      return nameEn;
    }

    // 2. Resolve via Engine
    const target = nameEn || rawName || nameAr;
    if (target) {
      const resolved = resolveFullName(target);
      if (resolved.english) {
        return resolved.english;
      }
    }

    return "Student";
  }
}

export function getAvatarFallback(avatar?: string, name?: string): string {
  if (avatar && avatar.length <= 2) return avatar;
  if (!name) return "??";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function isValidImageAvatar(avatar?: string): boolean {
  if (!avatar) return false;
  return avatar.startsWith("http") || avatar.startsWith("data:image/") || avatar.startsWith("blob:");
}
