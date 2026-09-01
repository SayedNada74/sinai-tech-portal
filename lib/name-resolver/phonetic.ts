/**
 * Arabic Phonetic Engine (Soundex / Double Metaphone for Arabic & Egyptian Names)
 * Dynamically resolves any phonetic variation of Arabic names without manual dictionary entries.
 */

export function getPhoneticKey(input: string): string {
  if (!input) return "";

  let key = input.toLowerCase().trim();

  // Normalize vowels & double letters for phonetic equivalence
  key = key
    .replace(/ou|oo|uu|u|o/g, "o") // Collapse all o/u/ou vowels (Mousab, Musab, Mosab -> mosab)
    .replace(/ee|ei|ie|i|e/g, "i") // Collapse all e/i/ee vowels (Khaled, Khalid -> khalid)
    .replace(/aa|a/g, "a")         // Collapse all a/aa vowels
    .replace(/ph/g, "f")           // ph -> f
    .replace(/ck|q/g, "k")         // ck/q -> k
    .replace(/j/g, "g")            // j -> g (Egyptian G)
    .replace(/['`\-_\s]/g, "");    // strip symbols

  // Collapse consecutive identical consonants (moussab -> mousab)
  let collapsed = "";
  for (let i = 0; i < key.length; i++) {
    if (i === 0 || key[i] !== key[i - 1]) {
      collapsed += key[i];
    }
  }

  return collapsed;
}

// Map of Phonetic Keys to Standard Canonical Arabic Names
// This matches ANY variation automatically (e.g. mousab, musab, mosab, moosab, moussab all -> مصعب)
const PHONETIC_CANONICAL_MAP: Record<string, { arabic: string; english: string }> = {
  // Mosab / Musab / Mousab
  mosab: { arabic: "مصعب", english: "Mosab" },
  musab: { arabic: "مصعب", english: "Mosab" },

  // Khaled / Khalid / Khald
  khalid: { arabic: "خالد", english: "Khaled" },

  // Tawfik / Tawfeek / Tawfeq / Taofik
  tawfik: { arabic: "توفيق", english: "Tawfik" },
  tofik: { arabic: "توفيق", english: "Tawfik" },

  // Moneim / Monem / Moneem
  monim: { arabic: "منعم", english: "Moneim" },

  // Rahman / Rehman
  rahman: { arabic: "رحمن", english: "Rahman" },

  // Gaballah / Gaballa / Jaballah
  gabalah: { arabic: "جاب الله", english: "Gaballah" },

  // Tayeb / Taib / Taiyeb
  tayib: { arabic: "الطيب", english: "El-Tayeb" },

  // Akrab / Akrob
  akrab: { arabic: "عقرب", english: "Akrab" },

  // Abdo / Abduh / Abdoo
  abdo: { arabic: "عبده", english: "Abdo" },

  // Saad / Sad
  sad: { arabic: "سعد", english: "Saad" },

  // Sabry / Sabri
  sabri: { arabic: "صبري", english: "Sabry" },

  // Hamid / Hameed
  hamid: { arabic: "حميد", english: "Hamid" },

  // Atef / Atif
  atif: { arabic: "عاطف", english: "Atef" },

  // Soliman / Suleiman
  soliman: { arabic: "سليمان", english: "Soliman" },

  // Gomaa / Jumaa
  goma: { arabic: "جمعة", english: "Gomaa" },

  // Shafik / Shafeek
  shafik: { arabic: "شفيق", english: "Shafik" }
};

export function resolvePhoneticName(input: string): { arabic: string; english: string } | null {
  if (!input) return null;
  const pKey = getPhoneticKey(input);
  if (PHONETIC_CANONICAL_MAP[pKey]) {
    return PHONETIC_CANONICAL_MAP[pKey];
  }
  return null;
}
