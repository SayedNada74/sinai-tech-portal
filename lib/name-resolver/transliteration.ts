import { isArabicText } from "./normalization";

const AR_TO_EN_LETTER_MAP: Record<string, string> = {
  "أ": "A", "إ": "I", "آ": "A", "ا": "A", "ء": "A", "ئ": "E", "ؤ": "O",
  "ب": "B", "ت": "T", "ث": "Th", "ج": "G", "ح": "H", "خ": "Kh",
  "د": "D", "ذ": "Z", "ر": "R", "ز": "Z", "س": "S", "ش": "Sh",
  "ص": "S", "ض": "D", "ط": "T", "ظ": "Z", "ع": "A", "غ": "Gh",
  "ف": "F", "ق": "K", "ك": "K", "ل": "L", "م": "M", "ن": "N",
  "ه": "H", "ة": "T", "و": "W", "ي": "Y", "ى": "Y"
};

export function transliterateArabicToEnglishFallback(word: string): string {
  if (!word) return "";
  const clean = word.replace(/[^\u0600-\u06FF]/g, "");
  if (!clean) return word;

  let res = "";
  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    const letter = AR_TO_EN_LETTER_MAP[char];
    if (letter) {
      res += i === 0 ? letter : letter.toLowerCase();
    } else {
      res += char;
    }
  }

  if (res.length > 0) {
    return res.charAt(0).toUpperCase() + res.slice(1);
  }
  return word;
}

export function transliterateEnglishToArabicFallback(word: string): string {
  if (!word) return "";
  let clean = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!clean) return word;

  let prefix = "";

  // 1. Handle common Arabic prefixes at the start of words
  if (
    clean.startsWith("abdel") ||
    clean.startsWith("abdal") ||
    clean.startsWith("abdul") ||
    clean.startsWith("abdil")
  ) {
    prefix = "عبد ال";
    clean = clean.substring(5);
  } else if (clean.startsWith("abd")) {
    prefix = "عبد ";
    clean = clean.substring(3);
  } else if (clean.startsWith("el") || clean.startsWith("al")) {
    prefix = "ال";
    clean = clean.substring(2);
  }

  if (!clean) return prefix.trim();

  // 2. Specific morphological pattern overrides for root words
  if (clean === "khaled" || clean === "khalid") return prefix + "خالد";
  if (clean === "rahman" || clean === "rahmaan" || clean === "rehman") return prefix + "رحمن";
  if (clean === "rahim" || clean === "raheem") return prefix + "رحيم";
  if (clean === "moneim" || clean === "monem" || clean === "moneem") return prefix + "منعم";
  if (clean === "hamid" || clean === "hameed") return prefix + "حميد";
  if (clean === "aziz" || clean === "azeez") return prefix + "عزيز";
  if (clean === "wahab" || clean === "wahhab") return prefix + "وهاب";
  if (clean === "salam" || clean === "salaam") return prefix + "سلام";
  if (clean === "ghany" || clean === "ghani") return prefix + "غني";
  if (clean === "kader" || clean === "qader") return prefix + "قادر";
  if (clean === "latif" || clean === "lateef") return prefix + "لطيف";
  if (clean === "nasser" || clean === "nasr") return prefix + "ناصر";
  if (clean === "azim" || clean === "azeem") return prefix + "عظيم";
  if (clean === "gawad" || clean === "jawad") return prefix + "جواد";
  if (clean === "hakim" || clean === "hakeem") return prefix + "حكيم";
  if (clean === "halim" || clean === "haleem") return prefix + "حليم";
  if (clean === "khalek" || clean === "khaleq") return prefix + "خالق";
  if (clean === "wahed") return prefix + "واحد";
  if (clean === "shafy" || clean === "shafi") return prefix + "شافي";
  if (clean === "sattar") return prefix + "ستار";
  if (clean === "fatah" || clean === "fattah") return prefix + "فتاح";
  if (clean === "magid" || clean === "majeed") return prefix + "مجيد";
  if (clean === "baset") return prefix + "باسط";

  // General Morphological Phonetic Converter
  let res = "";
  let i = 0;

  while (i < clean.length) {
    const two = clean.substring(i, i + 2);
    const three = clean.substring(i, i + 3);

    if (three === "eim" || three === "eem") {
      res += "يم"; i += 3;
    }
    else if (two === "kh") { res += "خ"; i += 2; }
    else if (two === "sh") { res += "ش"; i += 2; }
    else if (two === "th") { res += "ث"; i += 2; }
    else if (two === "gh") { res += "غ"; i += 2; }
    else if (two === "ph") { res += "ف"; i += 2; }
    else if (two === "rh") { res += "رح"; i += 2; }
    else if (two === "hm") { res += "حم"; i += 2; }
    else if (two === "ee") { res += "ي"; i += 2; }
    else if (two === "oo") { res += "و"; i += 2; }
    else if (two === "ou") { res += "و"; i += 2; }
    else if (two === "aa") { res += "ا"; i += 2; }
    else {
      const char = clean[i];
      const isFirst = res.length === 0;
      const isLast = i === clean.length - 1;
      const prevChar = i > 0 ? clean[i - 1] : "";
      const nextChar = i < clean.length - 1 ? clean[i + 1] : "";

      switch (char) {
        case "a":
          res += isFirst ? "أ" : "ا";
          break;
        case "b": res += "ب"; break;
        case "c": res += "ك"; break;
        case "d": res += "د"; break;
        case "e":
          if (isFirst) res += "إ";
          else if (isLast) res += "ه";
          else if (prevChar === "e" || nextChar === "e") res += "ي";
          // Skip internal short e (e.g., Khaled -> خالد, Mazen -> مازن)
          break;
        case "f": res += "ف"; break;
        case "g": res += "ج"; break;
        case "h":
          if (isFirst || prevChar === "r" || prevChar === "m" || prevChar === "s" || prevChar === "d" || prevChar === "t" || prevChar === "z" || isLast) {
            res += "ح";
          } else {
            res += "ه";
          }
          break;
        case "i":
          if (isFirst) res += "إ";
          else if (isLast) res += "ي";
          else if (prevChar === "i") res += "ي";
          else res += "ي";
          break;
        case "j": res += "ج"; break;
        case "k": res += "ك"; break;
        case "l": res += "ل"; break;
        case "m": res += "م"; break;
        case "n": res += "ن"; break;
        case "o":
          if (isFirst) res += "أو";
          else if (isLast) res += "ه";
          else if (prevChar === "o" || nextChar === "o") res += "و";
          // Skip internal short o (e.g. Mosab -> مصعب)
          break;
        case "p": res += "ب"; break;
        case "q": res += "ق"; break;
        case "r": res += "ر"; break;
        case "s": res += "س"; break;
        case "t": res += "ت"; break;
        case "u":
          if (isFirst) res += "أو";
          else if (isLast) res += "و";
          else if (prevChar === "u" || nextChar === "u") res += "و";
          break;
        case "v": res += "ف"; break;
        case "w": res += "و"; break;
        case "x": res += "كس"; break;
        case "y": res += "ي"; break;
        case "z": res += "ز"; break;
        default: res += char;
      }
      i++;
    }
  }

  return prefix + res;
}
