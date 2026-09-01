import { normalizeArabicName, normalizeEnglishName } from "./normalization";

export interface CanonicalNameEntry {
  arabic: string;
  english: string;
  category?: "male" | "female" | "general";
}

// Substantial Canonical Dictionary (Male & Female Common Egyptian and Arab Names)
export const CANONICAL_NAMES: CanonicalNameEntry[] = [
  // --- MALE NAMES ---
  { arabic: "محمد", english: "Mohamed", category: "male" },
  { arabic: "أحمد", english: "Ahmed", category: "male" },
  { arabic: "محمود", english: "Mahmoud", category: "male" },
  { arabic: "مصطفى", english: "Mostafa", category: "male" },
  { arabic: "إبراهيم", english: "Ibrahim", category: "male" },
  { arabic: "يوسف", english: "Youssef", category: "male" },
  { arabic: "عمر", english: "Omar", category: "male" },
  { arabic: "علي", english: "Ali", category: "male" },
  { arabic: "حسن", english: "Hassan", category: "male" },
  { arabic: "حسين", english: "Hussein", category: "male" },
  { arabic: "حسام", english: "Hossam", category: "male" },
  { arabic: "خالد", english: "Khaled", category: "male" },
  { arabic: "طارق", english: "Tarek", category: "male" },
  { arabic: "عمرو", english: "Amr", category: "male" },
  { arabic: "كريم", english: "Karim", category: "male" },
  { arabic: "إسلام", english: "Islam", category: "male" },
  { arabic: "هادي", english: "Hady", category: "male" },
  { arabic: "سامر", english: "Samer", category: "male" },
  { arabic: "سمير", english: "Samir", category: "male" },
  { arabic: "سامح", english: "Sameh", category: "male" },
  { arabic: "سامي", english: "Samy", category: "male" },
  { arabic: "شريف", english: "Sherif", category: "male" },
  { arabic: "أشرف", english: "Ashraf", category: "male" },
  { arabic: "أيمن", english: "Ayman", category: "male" },
  { arabic: "تامر", english: "Tamer", category: "male" },
  { arabic: "وائل", english: "Wael", category: "male" },
  { arabic: "وليد", english: "Walid", category: "male" },
  { arabic: "ياسر", english: "Yasser", category: "male" },
  { arabic: "زياد", english: "Ziad", category: "male" },
  { arabic: "سيف", english: "Seif", category: "male" },
  { arabic: "زين", english: "Zain", category: "male" },
  { arabic: "آدم", english: "Adam", category: "male" },
  { arabic: "حمزة", english: "Hamza", category: "male" },
  { arabic: "آسر", english: "Asser", category: "male" },
  { arabic: "إياد", english: "Eyad", category: "male" },
  { arabic: "بلال", english: "Belal", category: "male" },
  { arabic: "مازن", english: "Mazen", category: "male" },
  { arabic: "مهند", english: "Mohaned", category: "male" },
  { arabic: "أنس", english: "Anas", category: "male" },
  { arabic: "مالك", english: "Malek", category: "male" },
  { arabic: "ياسين", english: "Yassin", category: "male" },
  { arabic: "مروان", english: "Marwan", category: "male" },
  { arabic: "بدر", english: "Badr", category: "male" },
  { arabic: "رامي", english: "Ramy", category: "male" },
  { arabic: "رامز", english: "Ramez", category: "male" },
  { arabic: "مهاب", english: "Mohab", category: "male" },
  { arabic: "مجدي", english: "Magdy", category: "male" },
  { arabic: "عماد", english: "Emad", category: "male" },
  { arabic: "إيهاب", english: "Ehab", category: "male" },
  { arabic: "مدحت", english: "Medhat", category: "male" },
  { arabic: "نبيل", english: "Nabil", category: "male" },
  { arabic: "عادل", english: "Adel", category: "male" },
  { arabic: "سعد", english: "Saad", category: "male" },
  { arabic: "جمال", english: "Gamal", category: "male" },
  { arabic: "كمال", english: "Kamal", category: "male" },
  { arabic: "جابر", english: "Gaber", category: "male" },
  { arabic: "فتحي", english: "Fathy", category: "male" },
  { arabic: "رفعت", english: "Refaat", category: "male" },
  { arabic: "شوقي", english: "Shawky", category: "male" },
  { arabic: "فاروق", english: "Farouk", category: "male" },
  { arabic: "حلمي", english: "Helmy", category: "male" },
  { arabic: "سعيد", english: "Saeed", category: "male" },
  { arabic: "صلاح", english: "Salah", category: "male" },
  { arabic: "طه", english: "Taha", category: "male" },
  { arabic: "طاهر", english: "Taher", category: "male" },
  { arabic: "مراد", english: "Morad", category: "male" },
  { arabic: "محسن", english: "Mohsen", category: "male" },
  { arabic: "فهمي", english: "Fahmy", category: "male" },
  { arabic: "حسني", english: "Hosny", category: "male" },
  { arabic: "صبري", english: "Sabry", category: "male" },
  { arabic: "عبد الله", english: "Abdullah", category: "male" },
  { arabic: "عبد الرحمن", english: "Abdelrahman", category: "male" },
  { arabic: "عبد الرحيم", english: "Abdelrahim", category: "male" },
  { arabic: "عبد العزيز", english: "Abdelaziz", category: "male" },
  { arabic: "عبد الهادي", english: "Abdelhady", category: "male" },
  { arabic: "ناصر", english: "Nasser", category: "male" },
  { arabic: "باسم", english: "Bassem", category: "male" },
  { arabic: "بسام", english: "Bassam", category: "male" },
  { arabic: "بهاء", english: "Bahaa", category: "male" },
  { arabic: "فادي", english: "Fady", category: "male" },
  { arabic: "فارس", english: "Fares", category: "male" },
  { arabic: "فؤاد", english: "Fouad", category: "male" },
  { arabic: "ماجد", english: "Maged", category: "male" },
  { arabic: "مهدي", english: "Mahdy", category: "male" },
  { arabic: "يحيى", english: "Yehia", category: "male" },
  { arabic: "يونس", english: "Younis", category: "male" },
  { arabic: "زكريا", english: "Zakaria", category: "male" },
  { arabic: "أيوب", english: "Ayoub", category: "male" },
  { arabic: "معاذ", english: "Moaz", category: "male" },
  { arabic: "معين", english: "Moeen", category: "male" },
  { arabic: "رؤوف", english: "Raouf", category: "male" },
  { arabic: "رجب", english: "Ragab", category: "male" },
  { arabic: "راضي", english: "Rady", category: "male" },
  { arabic: "رضا", english: "Reda", category: "male" },
  { arabic: "أسامة", english: "Osama", category: "male" },
  { arabic: "سالم", english: "Salem", category: "male" },
  { arabic: "سليم", english: "Selim", category: "male" },
  { arabic: "محفوظ", english: "Mahfouz", category: "male" },
  { arabic: "السيد", english: "Elsayed", category: "male" },
  { arabic: "سيد", english: "Sayed", category: "male" },
  { arabic: "الشحات", english: "Elshahat", category: "male" },
  { arabic: "بدوي", english: "Badawy", category: "male" },
  { arabic: "متولي", english: "Metwally", category: "male" },
  { arabic: "دسوقي", english: "Desouky", category: "male" },
  { arabic: "قنديل", english: "Kandil", category: "male" },
  { arabic: "علام", english: "Allam", category: "male" },
  { arabic: "عزام", english: "Azzam", category: "male" },
  { arabic: "مرسي", english: "Morsy", category: "male" },
  { arabic: "رضوان", english: "Radwan", category: "male" },
  { arabic: "شعبان", english: "Shaaban", category: "male" },
  { arabic: "رمضان", english: "Ramadan", category: "male" },
  { arabic: "صبحي", english: "Sobhy", category: "male" },
  { arabic: "لطفي", english: "Lotfy", category: "male" },
  { arabic: "خليل", english: "Khalil", category: "male" },
  { arabic: "صالح", english: "Saleh", category: "male" },
  { arabic: "شادي", english: "Shady", category: "male" },
  { arabic: "فرج", english: "Farag", category: "male" },
  { arabic: "فوزي", english: "Fawzy", category: "male" },
  { arabic: "حافظ", english: "Hafez", category: "male" },
  { arabic: "حامد", english: "Hamed", category: "male" },
  { arabic: "حمدي", english: "Hamdy", category: "male" },
  { arabic: "هاشم", english: "Hashem", category: "male" },
  { arabic: "حاتم", english: "Hatem", category: "male" },
  { arabic: "حازم", english: "Hazem", category: "male" },
  { arabic: "هاني", english: "Hany", category: "male" },
  { arabic: "هلال", english: "Helal", category: "male" },
  { arabic: "مبروك", english: "Mabrouk", category: "male" },
  { arabic: "مكرم", english: "Makram", category: "male" },
  { arabic: "ممدوح", english: "Mamdouh", category: "male" },
  { arabic: "منصور", english: "Mansour", category: "male" },
  { arabic: "موسى", english: "Mousa", category: "male" },
  { arabic: "ناجي", english: "Nagy", category: "male" },
  { arabic: "رأفت", english: "Raafat", category: "male" },
  { arabic: "ربيع", english: "Rabie", category: "male" },
  { arabic: "رشاد", english: "Rashad", category: "male" },
  { arabic: "راشد", english: "Rashed", category: "male" },
  { arabic: "رزق", english: "Rizk", category: "male" },
  { arabic: "صفوت", english: "Safwat", category: "male" },
  { arabic: "صقر", english: "Sakr", category: "male" },
  { arabic: "سلام", english: "Sallam", category: "male" },
  { arabic: "ثروت", english: "Tharwat", category: "male" },
  { arabic: "سلطان", english: "Sultan", category: "male" },
  { arabic: "ثابت", english: "Thabet", category: "male" },
  { arabic: "وهبة", english: "Wahba", category: "male" },
  { arabic: "يسري", english: "Yousry", category: "male" },
  { arabic: "زكي", english: "Zaky", category: "male" },
  { arabic: "زايد", english: "Zayed", category: "male" },
  { arabic: "زيدان", english: "Zidan", category: "male" },
  { arabic: "شكري", english: "Shoukry", category: "male" },
  { arabic: "صادق", english: "Sadek", category: "male" },
  { arabic: "توفيق", english: "Tawfik", category: "male" },
  { arabic: "مصعب", english: "Mosab", category: "male" },
  { arabic: "منعم", english: "Moneim", category: "male" },
  { arabic: "جاب الله", english: "Gaballah", category: "male" },
  { arabic: "سليمان", english: "Soliman", category: "male" },
  { arabic: "جمعة", english: "Gomaa", category: "male" },
  { arabic: "شفيق", english: "Shafik", category: "male" },
  { arabic: "رفيق", english: "Rafik", category: "male" },
  { arabic: "وجدي", english: "Wagdy", category: "male" },
  { arabic: "رمزي", english: "Ramzy", category: "male" },
  { arabic: "عزمي", english: "Azmy", category: "male" },
  { arabic: "أنور", english: "Anwar", category: "male" },
  { arabic: "أنيس", english: "Anis", category: "male" },
  { arabic: "كامل", english: "Kamel", category: "male" },
  { arabic: "عزت", english: "Ezzat", category: "male" },
  { arabic: "طلعت", english: "Talaat", category: "male" },
  { arabic: "عبده", english: "Abdo", category: "male" },
  { arabic: "الطيب", english: "El-Tayeb", category: "male" },
  { arabic: "عقرب", english: "Akrab", category: "male" },
  { arabic: "عبد الحميد", english: "Abdelhamid", category: "male" },
  { arabic: "عاطف", english: "Atef", category: "male" },
  { arabic: "المصري", english: "Elmasry", category: "male" },
  { arabic: "النجار", english: "Elnaggar", category: "male" },
  { arabic: "الجوهري", english: "Elgohary", category: "male" },
  { arabic: "الهواري", english: "Elhawary", category: "male" },
  { arabic: "الشامي", english: "Elshamy", category: "male" },

  // --- FEMALE NAMES ---
  { arabic: "مريم", english: "Maryam", category: "female" },
  { arabic: "سارة", english: "Sarah", category: "female" },
  { arabic: "نور", english: "Nour", category: "female" },
  { arabic: "هبة", english: "Heba", category: "female" },
  { arabic: "مروة", english: "Marwa", category: "female" },
  { arabic: "آية", english: "Aya", category: "female" },
  { arabic: "دينا", english: "Dina", category: "female" },
  { arabic: "منى", english: "Mona", category: "female" },
  { arabic: "أميرة", english: "Amira", category: "female" },
  { arabic: "إيمان", english: "Eman", category: "female" },
  { arabic: "ياسمين", english: "Yasmine", category: "female" },
  { arabic: "سلمى", english: "Salma", category: "female" },
  { arabic: "ريم", english: "Reem", category: "female" },
  { arabic: "حبيبة", english: "Habiba", category: "female" },
  { arabic: "جنى", english: "Jana", category: "female" },
  { arabic: "جنة", english: "Janna", category: "female" },
  { arabic: "ملك", english: "Malak", category: "female" },
  { arabic: "فريدة", english: "Farida", category: "female" },
  { arabic: "منة", english: "Menna", category: "female" },
  { arabic: "روان", english: "Rawan", category: "female" },
  { arabic: "شهد", english: "Shahd", category: "female" },
  { arabic: "رضوى", english: "Radwa", category: "female" },
  { arabic: "داليا", english: "Dalia", category: "female" },
  { arabic: "دعاء", english: "Doaa", category: "female" },
  { arabic: "علا", english: "Ola", category: "female" },
  { arabic: "ندى", english: "Nada", category: "female" },
  { arabic: "رانيا", english: "Rania", category: "female" },
  { arabic: "ريهام", english: "Reham", category: "female" },
  { arabic: "نورا", english: "Noura", category: "female" },
  { arabic: "نورهان", english: "Nourhan", category: "female" },
  { arabic: "يارا", english: "Yara", category: "female" },
  { arabic: "ليلى", english: "Laila", category: "female" },
  { arabic: "لمياء", english: "Lamia", category: "female" },
  { arabic: "لبنى", english: "Lobna", category: "female" },
  { arabic: "مي", english: "Mai", category: "female" },
  { arabic: "ميرنا", english: "Mirna", category: "female" },
  { arabic: "نادين", english: "Nadine", category: "female" },
  { arabic: "نادية", english: "Nadia", category: "female" },
  { arabic: "أسماء", english: "Asmaa", category: "female" },
  { arabic: "أمل", english: "Amal", category: "female" },
  { arabic: "أماني", english: "Amani", category: "female" },
  { arabic: "ابتسام", english: "Ebtesam", category: "female" },
  { arabic: "إسراء", english: "Esraa", category: "female" },
  { arabic: "بسمة", english: "Basma", category: "female" },
  { arabic: "بشرى", english: "Boushrah", category: "female" },
  { arabic: "حنين", english: "Haneen", category: "female" },
  { arabic: "شيماء", english: "Shaimaa", category: "female" },
  { arabic: "تسنيم", english: "Tasneem", category: "female" },
  { arabic: "رقية", english: "Roqaya", category: "female" },
  { arabic: "زينب", english: "Zainab", category: "female" },
  { arabic: "سما", english: "Sama", category: "female" },
  { arabic: "سماح", english: "Samah", category: "female" },
  { arabic: "منار", english: "Manar", category: "female" },
  { arabic: "منال", english: "Manal", category: "female" },
  { arabic: "مرام", english: "Maram", category: "female" },
  { arabic: "هدى", english: "Hoda", category: "female" },
  { arabic: "صفاء", english: "Safaa", category: "female" },
  { arabic: "صباح", english: "Sabah", category: "female" },
  { arabic: "سمية", english: "Somaya", category: "female" },
  { arabic: "فرح", english: "Farah", category: "female" },
  { arabic: "فاطمة", english: "Fatma", category: "female" },
  { arabic: "رحمة", english: "Rahma", category: "female" },
  { arabic: "رنا", english: "Rana", category: "female" },
  { arabic: "لارا", english: "Lara", category: "female" },
  { arabic: "كارول", english: "Carole", category: "female" },
  { arabic: "كريستين", english: "Christine", category: "female" },
  { arabic: "كريستينا", english: "Christina", category: "female" },
  { arabic: "شروق", english: "Shorouk", category: "female" },
  { arabic: "إلهام", english: "Elham", category: "female" },
  { arabic: "أحلام", english: "Ahlam", category: "female" },
  { arabic: "سهيلة", english: "Sohaila", category: "female" },
  { arabic: "نجلاء", english: "Naglaa", category: "female" }
];

// Comprehensive English Spelling Aliases mapping to Canonical Entry
export const ENGLISH_ALIASES: Record<string, string> = {
  // Mohamed
  mohamed: "محمد",
  mohammed: "محمد",
  muhammad: "محمد",
  mohammad: "محمد",
  mohamad: "محمد",
  muhamed: "محمد",
  mohd: "محمد",

  // Abdo
  abdo: "عبده",
  abdoo: "عبده",
  abduh: "عبده",

  // Saad / Sad
  sad: "سعد",
  saad: "سعد",

  // Tayeb / El-Tayeb
  tayeb: "الطيب",
  eltayeb: "الطيب",
  "el-tayeb": "الطيب",
  taiyeb: "الطيب",
  tayib: "الطيب",
  etayeb: "الطيب",
  eltayib: "الطيب",

  // Akrab
  akrab: "عقرب",
  akrob: "عقرب",

  // Abdelhamid
  abdelhamid: "عبد الحميد",
  abdelhameed: "عبد الحميد",
  abdulhamid: "عبد الحميد",
  abdilhamid: "عبد الحميد",

  // Abdelrahman
  abdalrahman: "عبد الرحمن",
  abdelrahman: "عبد الرحمن",
  abdulrahman: "عبد الرحمن",
  abdelrhman: "عبد الرحمن",

  // Atef
  atef: "عاطف",
  atif: "عاطف",

  // Tawfik
  tawfik: "توفيق",
  tawfeek: "توفيق",
  tawfiq: "توفيق",
  tawfeq: "توفيق",
  tawfek: "توفيق",

  // Mosab
  mosab: "مصعب",
  musab: "مصعب",
  mosaab: "مصعب",

  // Moneim
  moneim: "منعم",
  monem: "منعم",
  moneem: "منعم",

  // Gaballah
  gaballah: "جاب الله",
  gaballa: "جاب الله",
  jaballah: "جاب الله",
  jaballa: "جاب الله",

  // Soliman
  soliman: "سليمان",
  suleiman: "سليمان",
  sulaiman: "سليمان",

  // Gomaa
  gomaa: "جمعة",
  jumaa: "جمعة",
  goma: "جمعة",

  // Shafik
  shafik: "شفيق",
  shafeek: "شفيق",

  // Wagdy
  wagdy: "وجدي",
  wajdy: "وجدي",

  // Ramzy
  ramzy: "رمزي",
  ramzi: "رمزي",

  // Youssef
  youssef: "يوسف",
  yousef: "يوسف",
  yusuf: "يوسف",
  yousif: "يوسف",
  youseph: "يوسف",
  yousseph: "يوسف",

  // Mostafa
  mostafa: "مصطفى",
  mustafa: "مصطفى",
  moustafa: "مصطفى",
  mustapha: "مصطفى",
  mostapha: "مصطفى",

  // Ibrahim
  ibrahim: "إبراهيم",
  ebrahim: "إبراهيم",
  ibraheem: "إبراهيم",
  ebraheem: "إبراهيم",

  // Ahmed
  ahmed: "أحمد",
  ahmad: "أحمد",

  // Karim
  karim: "كريم",
  kareem: "كريم",
  karem: "كريم",

  // Seif
  seif: "سيف",
  saif: "سيف",
  sayf: "سيف",

  // Ziad
  ziad: "زياد",
  zeyad: "زياد",
  ziyad: "زياد",

  // Sherif
  sherif: "شريف",
  sharif: "شريف",
  shereef: "شريف",

  // Hassan
  hassan: "حسن",
  hasan: "حسن",
  hassane: "حسن",

  // Hussein
  hussein: "حسين",
  hussain: "حسين",
  husain: "حسين",
  hossain: "حسين",

  // Yassin
  yassin: "ياسين",
  yasin: "ياسين",
  yassine: "ياسين",
  yaseen: "ياسين",

  // Yasser
  yasser: "ياسر",
  yasir: "ياسر",
  yaser: "ياسر",

  // Osama
  osama: "أسامة",
  oussama: "أسامة",
  usama: "أسامة",

  // Salem
  salem: "سالم",
  selim: "سليم",
  saleem: "سليم",

  // Mahfouz
  mahfouz: "محفوظ",
  mahfooz: "محفوظ",

  // Sayed
  sayed: "سيد",
  sed: "سيد",
  elsayed: "السيد",

  // Mahmoud
  mahmoud: "محمود",
  mahmod: "محمود",
  mahmood: "محمود",

  // Amr
  amr: "عمرو",
  amer: "عمرو",

  // Hady
  hady: "هادي",
  hadi: "هادي",

  // Mina
  mina: "مينا",
  mena: "مينا",

  // Bishoy
  bishoy: "بيشوي",
  beshoy: "بيشوي",

  // Kerollos
  kerollos: "كيرلس",
  kirollos: "كيرلس",

  // Sarah
  sarah: "سارة",
  sara: "سارة",

  // Maryam
  maryam: "مريم",
  mariam: "مريم",
  mary: "مريم",

  // Esraa
  esraa: "إسراء",
  israa: "إسراء",

  // Shaimaa
  shaimaa: "شيماء",
  shaymaa: "شيماء",

  // Naglaa
  naglaa: "نجلاء",
  najlaa: "نجلاء"
};

// O(1) Pre-calculated Fast Lookup Maps
export const ARABIC_CANONICAL_MAP = new Map<string, CanonicalNameEntry>();
export const ENGLISH_CANONICAL_MAP = new Map<string, CanonicalNameEntry>();
export const ALIAS_MAP = new Map<string, CanonicalNameEntry>();

// Initialize maps once at runtime
for (const entry of CANONICAL_NAMES) {
  const normAr = normalizeArabicName(entry.arabic);
  const normEn = normalizeEnglishName(entry.english);

  if (!ARABIC_CANONICAL_MAP.has(normAr)) {
    ARABIC_CANONICAL_MAP.set(normAr, entry);
  }
  if (!ENGLISH_CANONICAL_MAP.has(normEn)) {
    ENGLISH_CANONICAL_MAP.set(normEn, entry);
  }
}

for (const [aliasEn, canonicalAr] of Object.entries(ENGLISH_ALIASES)) {
  const normAlias = normalizeEnglishName(aliasEn);
  const normAr = normalizeArabicName(canonicalAr);
  const canonicalEntry = ARABIC_CANONICAL_MAP.get(normAr);

  if (canonicalEntry) {
    ALIAS_MAP.set(normAlias, canonicalEntry);
  }
}
