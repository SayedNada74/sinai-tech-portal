import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const NAME_MAP: Record<string, string> = {
  sayed: "سيد",
  sed: "سيد",
  nada: "ندا",
  mahmoud: "محمود",
  mahmod: "محمود",
  ahmed: "أحمد",
  mohamed: "محمد",
  muhammad: "محمد",
  mohammed: "محمد",
  mustafa: "مصطفى",
  mostafa: "مصطفى",
  moustafa: "مصطفى",
  ebrahim: "إبراهيم",
  ibrahim: "إبراهيم",
  youssef: "يوسف",
  yousef: "يوسف",
  omar: "عمر",
  ali: "علي",
  aly: "علي",
  hassan: "حسن",
  hasan: "حسن",
  hussein: "حسين",
  hossam: "حسام",
  khaled: "خالد",
  tarek: "طارق",
  amr: "عمرو",
  karim: "كريم",
  kareem: "كريم",
  islam: "إسلام",
  eslam: "إسلام",
  hady: "هادي",
  mena: "مينا",
  mina: "مينا",
  bishoy: "بيشوي",
  kerollos: "كيرلس",
  george: "جورج",
  peter: "بيتر",
  mary: "مريم",
  mariam: "مريم",
  sara: "سارة",
  sarah: "سارة",
  nour: "نور",
  noor: "نور",
  heba: "هبة",
  marwa: "مروة",
  aya: "آية",
  dina: "دينا",
  mona: "منى",
  amira: "أميرة",
  eman: "إيمان",
  yasmine: "ياسمين",
  salma: "سلمى",
  reem: "ريم",
  habiba: "حبيبة",
  jana: "جنى",
  malak: "ملك",
  farida: "فريدة",
  menna: "منة",
  rawan: "روان",
  shahd: "شهد",
  radwa: "رضوى",
  dalia: "داليا",
  doaa: "دعاء",
  alaa: "علاء",
  ola: "علا",
  samir: "سمير",
  sameh: "سامح",
  samy: "سامي",
  sherif: "شريف",
  ashraf: "أشرف",
  ayman: "أيمن",
  tamer: "تامر",
  wael: "وائل",
  walid: "وليد",
  yasser: "ياسر",
  ziad: "زياد",
  zeyad: "زياد",
  seif: "سيف",
  saif: "سيف",
  zain: "زين",
  adam: "آدم",
  hamza: "حمزة",
  asser: "آسر",
  eyad: "إياد",
  belal: "بلال",
  bilal: "بلال",
  mazen: "مازن",
  mohaned: "مهند",
  anas: "أنس",
  malek: "مالك",
  yassin: "ياسين",
  marwan: "مروان",
  badr: "بدر",
  ramy: "رامي",
  ramez: "رامز",
  mohab: "مهاب",
  magdy: "مجدي",
  emad: "عماد",
  ehab: "إيهاب",
  medhat: "مدحت",
  nabil: "نبيل",
  adel: "عادل",
  saad: "سعد",
  gamal: "جمال",
  kamal: "كمال",
  gaber: "جابر",
  fathy: "فتحي",
  refaat: "رفعت",
  shawky: "شوقي",
  farouk: "فاروق",
  helmy: "حلمي",
  saeed: "سعيد"
};

// Comprehensive Reverse Map (Arabic -> English)
const AR_TO_EN_MAP: Record<string, string> = {
  "سيد": "Sayed",
  "ندا": "Nada",
  "محمود": "Mahmoud",
  "أحمد": "Ahmed",
  "احمد": "Ahmed",
  "محمد": "Mohamed",
  "مصطفى": "Mostafa",
  "إبراهيم": "Ibrahim",
  "ابراهيم": "Ibrahim",
  "يوسف": "Youssef",
  "عمر": "Omar",
  "علي": "Ali",
  "حسن": "Hassan",
  "حسين": "Hussein",
  "حسام": "Hossam",
  "خالد": "Khaled",
  "طارق": "Tarek",
  "عمرو": "Amr",
  "كريم": "Karim",
  "إسلام": "Islam",
  "اسلام": "Islam",
  "هادي": "Hady",
  "مينا": "Mina",
  "بيشوي": "Bishoy",
  "كيرلس": "Kerollos",
  "جورج": "George",
  "بيتر": "Peter",
  "مريم": "Mariam",
  "سارة": "Sara",
  "نور": "Nour",
  "هبة": "Heba",
  "مروة": "Marwa",
  "آية": "Aya",
  "ايه": "Aya",
  "دينا": "Dina",
  "منى": "Mona",
  "أميرة": "Amira",
  "اميرة": "Amira",
  "إيمان": "Eman",
  "ايمان": "Eman",
  "ياسمين": "Yasmine",
  "سلمى": "Salma",
  "ريم": "Reem",
  "حبيبة": "Habiba",
  "جنى": "Jana",
  "ملك": "Malak",
  "فريدة": "Farida",
  "منة": "Menna",
  "روان": "Rawan",
  "شهد": "Shahd",
  "رضوى": "Radwa",
  "داليا": "Dalia",
  "دعاء": "Doaa",
  "علاء": "Alaa",
  "علا": "Ola",
  "سمير": "Samir",
  "سامح": "Sameh",
  "سامي": "Samy",
  "شريف": "Sherif",
  "أشرف": "Ashraf",
  "اشرف": "Ashraf",
  "أيمن": "Ayman",
  "ايمن": "Ayman",
  "تامر": "Tamer",
  "وائل": "Wael",
  "وليد": "Walid",
  "ياسر": "Yasser",
  "زياد": "Ziad",
  "سيف": "Seif",
  "زين": "Zain",
  "آدم": "Adam",
  "ادم": "Adam",
  "حمزة": "Hamza",
  "آسر": "Asser",
  "اسر": "Asser",
  "إياد": "Eyad",
  "اياد": "Eyad",
  "بلال": "Belal",
  "مازن": "Mazen",
  "مهند": "Mohaned",
  "أنس": "Anas",
  "انس": "Anas",
  "مالك": "Malek",
  "ياسين": "Yassin",
  "مروان": "Marwan",
  "بدر": "Badr",
  "رامي": "Ramy",
  "رامز": "Ramez",
  "مهاب": "Mohab",
  "مجدي": "Magdy",
  "عماد": "Emad",
  "إيهاب": "Ehab",
  "ايهاب": "Ehab",
  "مدحت": "Medhat",
  "نبيل": "Nabil",
  "عادل": "Adel",
  "سعد": "Saad",
  "جمال": "Gamal",
  "كمال": "Kamal",
  "جابر": "Gaber",
  "فتحي": "Fathy",
  "رفعت": "Refaat",
  "شوقي": "Shawky",
  "فاروق": "Farouk",
  "حلمي": "Helmy",
  "سعيد": "Saeed",
  "عبدالله": "Abdullah",
  "عبد الله": "Abdullah",
  "عبدالرحمن": "Abdelrahman",
  "عبد الرحمن": "Abdelrahman",
  "صبري": "Sabry",
  "صبرى": "Sabry",
  "غني": "Ghaney",
  "غنى": "Ghaney",
  "طه": "Taha",
  "طاهر": "Taher",
  "صلاح": "Salah",
  "سلامة": "Salama",
  "سلامه": "Salama",
  "عطية": "Atia",
  "عطيه": "Atia",
  "حافظ": "Hafez",
  "مراد": "Morad",
  "محسن": "Mohsen",
  "فهمي": "Fahmy",
  "فهمى": "Fahmy",
  "حسني": "Hosny",
  "حسنى": "Hosny"
};

// Populate reverse map dynamically for any remaining entries
for (const [en, ar] of Object.entries(NAME_MAP)) {
  if (!AR_TO_EN_MAP[ar]) {
    AR_TO_EN_MAP[ar] = en.charAt(0).toUpperCase() + en.slice(1);
  }
}

export function transliterateArabicWordToEnglish(word: string): string {
  if (!word) return "";
  const clean = word.replace(/[^\u0600-\u06FF]/g, "");
  if (!clean) return word;

  if (AR_TO_EN_MAP[clean]) return AR_TO_EN_MAP[clean];
  if (AR_TO_EN_MAP[word]) return AR_TO_EN_MAP[word];

  let res = "";
  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    switch (char) {
      case "أ": case "إ": case "آ": case "ا": case "ء": case "ئ": case "ؤ":
        res += i === 0 ? "A" : "a";
        break;
      case "ب": res += i === 0 ? "B" : "b"; break;
      case "ت": case "ط": case "ة": res += i === 0 ? "T" : "t"; break;
      case "ث": res += i === 0 ? "Th" : "th"; break;
      case "ج": res += i === 0 ? "G" : "g"; break;
      case "ح": case "ه": res += i === 0 ? "H" : "h"; break;
      case "خ": res += i === 0 ? "Kh" : "kh"; break;
      case "د": case "ض": res += i === 0 ? "D" : "d"; break;
      case "ذ": case "ز": case "ظ": res += i === 0 ? "Z" : "z"; break;
      case "ر": res += i === 0 ? "R" : "r"; break;
      case "س": case "ص": res += i === 0 ? "S" : "s"; break;
      case "ش": res += i === 0 ? "Sh" : "sh"; break;
      case "ع": res += i === 0 ? "A" : "a"; break;
      case "غ": res += i === 0 ? "Gh" : "gh"; break;
      case "ف": res += i === 0 ? "F" : "f"; break;
      case "ق": case "ك": res += i === 0 ? "K" : "k"; break;
      case "ل": res += i === 0 ? "L" : "l"; break;
      case "م": res += i === 0 ? "M" : "m"; break;
      case "ن": res += i === 0 ? "N" : "n"; break;
      case "و": res += i === 0 ? "W" : "w"; break;
      case "ي": case "ى": res += i === 0 ? "Y" : "y"; break;
      default: res += char;
    }
  }

  if (res.length > 0) {
    return res.charAt(0).toUpperCase() + res.slice(1);
  }
  return word;
}

export function getLocalizedUserName(
  userOrName: { name?: string; nameAr?: string; nameEn?: string } | string | undefined | null,
  lang: "ar" | "en"
): string {
  if (!userOrName) return "";

  let nameAr = "";
  let nameEn = "";
  let rawName = "";

  if (typeof userOrName === "object") {
    nameAr = (userOrName.nameAr || "").trim();
    nameEn = (userOrName.nameEn || "").trim();
    rawName = (userOrName.name || "").trim();
  } else {
    rawName = userOrName.trim();
    if (/[\u0600-\u06FF]/.test(rawName)) {
      nameAr = rawName;
    } else {
      nameEn = rawName;
    }
  }

  if (lang === "ar") {
    // 1. Explicit Arabic name
    if (nameAr) return nameAr;

    // 2. Raw name already in Arabic
    if (rawName && /[\u0600-\u06FF]/.test(rawName)) return rawName;

    // 3. Transliterate English name into Arabic
    const candidate = nameEn || rawName;
    if (candidate) {
      const words = candidate.split(/\s+/).filter(Boolean);
      const converted = words.map((w) => {
        const clean = w.toLowerCase().replace(/[^a-z]/g, "");
        return NAME_MAP[clean] || w;
      });
      return converted.join(" ");
    }

    return "طالب";
  } else {
    // 1. Explicit English name
    if (nameEn) return nameEn;

    // 2. Raw name already in English (no Arabic characters)
    if (rawName && !/[\u0600-\u06FF]/.test(rawName) && /[a-zA-Z]/.test(rawName)) {
      return rawName;
    }

    // 3. Transliterate Arabic candidate into English
    const candidate = nameAr || rawName;
    if (candidate) {
      const words = candidate.split(/\s+/).filter(Boolean);
      const converted = words.map((w) => transliterateArabicWordToEnglish(w));
      return converted.join(" ");
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

