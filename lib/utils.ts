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

export function getLocalizedUserName(name: string | undefined | null, lang: "ar" | "en"): string {
  if (!name) return "";
  if (lang === "en") return name;

  // If already contains Arabic characters, return as is
  if (/[\u0600-\u06FF]/.test(name)) {
    return name;
  }

  // Transliterate English words to Arabic if matched
  const words = name.trim().split(/\s+/);
  const localizedWords = words.map((w) => {
    const clean = w.toLowerCase().replace(/[^a-z]/g, "");
    return NAME_MAP[clean] || w;
  });

  return localizedWords.join(" ");
}
