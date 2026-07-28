export interface Course {
  code: string;
  english: string;
  arabic: string;
  credits: number;
  type: "required" | "elective";
  period: string;
  prerequisites: string[];
  difficulty: "easy" | "medium" | "hard";
  description: string;
  descriptionEn?: string;
  outcomes: string[];
  outcomesEn?: string[];
  department: "IT" | "CS" | "IS" | "MATH" | "HUMANITIES";
}

export const CATEGORIES: Record<string, string> = {
  Hu: "متطلبات الجامعة",
  Ma: "علوم أساسية (رياضيات)",
  St: "علوم أساسية (إحصاء)",
  CSW: "برمجيات وعلوم حاسب",
  ISD: "نظم المعلومات",
  INT: "تكنولوجيا المعلومات"
};

export const PERIODS: Record<string, string> = {
  "year-1-sem-1": "الفرقة الأولى - الفصل الأول",
  "year-1-sem-2": "الفرقة الأولى - الفصل الثاني",
  "year-2-sem-1": "الفرقة الثانية - الفصل الأول",
  "year-2-sem-2": "الفرقة الثانية - الفصل الثاني",
  "year-3-sem-1": "الفرقة الثالثة - الفصل الأول",
  "year-3-sem-2": "الفرقة الثالثة - الفصل الثاني",
  "year-4-sem-1": "الفرقة الرابعة - الفصل الأول",
  "year-4-sem-2": "الفرقة الرابعة - الفصل الثاني"
};

// Raw courses data from scrapped site index.html and data.js
const RAW_COURSES = [
  // Semester 1
  { code: "Hu 100", english: "Sinai History", arabic: "تاريخ سيناء", credits: 0, type: "required" as const, period: "year-1-sem-1", prerequisites: [] },
  { code: "Hu 110", english: "English Language", arabic: "اللغة الإنجليزية", credits: 3, type: "required" as const, period: "year-1-sem-1", prerequisites: [] },
  { code: "CSW 110", english: "Introduction to Computer & Internet Technology", arabic: "مقدمة في تكنولوجيا الحاسب والإنترنت", credits: 3, type: "required" as const, period: "year-1-sem-1", prerequisites: [] },
  { code: "St 120", english: "Statistics & Probability", arabic: "الاحتمالات والإحصاء", credits: 4, type: "required" as const, period: "year-1-sem-1", prerequisites: [] },
  { code: "Ma 111", english: "Calculus", arabic: "التفاضل والتكامل", credits: 4, type: "required" as const, period: "year-1-sem-1", prerequisites: [] },
  { code: "INT 110", english: "Introduction to Electronics", arabic: "مقدمة في الإلكترونيات", credits: 3, type: "required" as const, period: "year-1-sem-1", prerequisites: [] },

  // Semester 2
  { code: "ISD 100", english: "Introduction to Systems & Informatics", arabic: "مقدمة في النظم والمعلوماتية", credits: 3, type: "required" as const, period: "year-1-sem-2", prerequisites: [] },
  { code: "CSW 232", english: "Computer Programming (1)", arabic: "برمجة الحاسب (1)", credits: 4, type: "required" as const, period: "year-1-sem-2", prerequisites: ["CSW 110"] },
  { code: "CSW 121", english: "Logic Design", arabic: "تصميم المنطق", credits: 3, type: "required" as const, period: "year-1-sem-2", prerequisites: ["INT 110"] },
  { code: "Hu 230", english: "Communication Skills", arabic: "مهارات الاتصال", credits: 1, type: "required" as const, period: "year-1-sem-2", prerequisites: [] },
  { code: "Ma 110", english: "Linear Algebra", arabic: "الجبر الخطي", credits: 3, type: "required" as const, period: "year-1-sem-2", prerequisites: [] },
  { code: "Hu 111", english: "Composition & Technical Writing", arabic: "التعبير والكتابة الفنية", credits: 3, type: "required" as const, period: "year-1-sem-2", prerequisites: [] },
  { code: "Hu 194", english: "Human Rights", arabic: "حقوق الإنسان", credits: 0, type: "required" as const, period: "year-1-sem-2", prerequisites: [] },

  // Semester 3
  { code: "CSW 221", english: "Data Structures", arabic: "هياكل البيانات", credits: 3, type: "required" as const, period: "year-2-sem-1", prerequisites: ["Ma 110"] },
  { code: "CSW 241", english: "File Organization & Processing", arabic: "تنظيم ومعالجة الملفات", credits: 3, type: "required" as const, period: "year-2-sem-1", prerequisites: ["CSW 110"] },
  { code: "CSW 263", english: "Software Engineering", arabic: "هندسة البرمجيات", credits: 3, type: "required" as const, period: "year-2-sem-1", prerequisites: ["CSW 232"] },
  { code: "CSW 234", english: "Computer Programming (2)", arabic: "برمجة الحاسب (2)", credits: 4, type: "required" as const, period: "year-2-sem-1", prerequisites: ["CSW 232"] },
  { code: "Ma 212", english: "Discrete Mathematics", arabic: "الرياضيات المتقطعة", credits: 4, type: "required" as const, period: "year-2-sem-1", prerequisites: ["Ma 110"] },
  { code: "Hu 213", english: "Creative Thinking", arabic: "التفكير الابتكاري", credits: 3, type: "required" as const, period: "year-2-sem-1", prerequisites: [] },

  // Semester 4
  { code: "CSW 242", english: "Operating Systems (1)", arabic: "نظم التشغيل (1)", credits: 3, type: "required" as const, period: "year-2-sem-2", prerequisites: ["CSW 241"] },
  { code: "ISD 220", english: "Introduction to Operations Research", arabic: "مقدمة في بحوث العمليات", credits: 4, type: "required" as const, period: "year-2-sem-2", prerequisites: ["Ma 110", "St 120"] },
  { code: "INT 232", english: "Computer Networks", arabic: "شبكات الحاسب", credits: 3, type: "required" as const, period: "year-2-sem-2", prerequisites: ["Ma 110"] },
  { code: "Hu 212", english: "Reading & Presentation Skills", arabic: "مهارات القراءة والتقديم", credits: 2, type: "required" as const, period: "year-2-sem-2", prerequisites: [] },
  { code: "ISD 242", english: "Database Systems", arabic: "نظم قواعد البيانات", credits: 3, type: "required" as const, period: "year-2-sem-2", prerequisites: ["CSW 221"] },
  { code: "CSW 225", english: "Computer Architecture", arabic: "عمارة الحاسب", credits: 3, type: "required" as const, period: "year-2-sem-2", prerequisites: ["CSW 110", "CSW 121"] },

  // Semester 5
  { code: "CSW 325", english: "Parallel Processing", arabic: "المعالجة المتوازية", credits: 3, type: "required" as const, period: "year-3-sem-1", prerequisites: ["CSW 225"] },
  { code: "INT 353", english: "Multimedia", arabic: "الوسائط المتعددة", credits: 3, type: "required" as const, period: "year-3-sem-1", prerequisites: ["CSW 225"] },
  { code: "CSW 351", english: "Artificial Intelligence", arabic: "الذكاء الاصطناعي", credits: 3, type: "required" as const, period: "year-3-sem-1", prerequisites: ["CSW 232"] },
  { code: "CSW 323", english: "Operating Systems (2)", arabic: "نظم التشغيل (2)", credits: 3, type: "required" as const, period: "year-3-sem-1", prerequisites: ["CSW 242"] },
  { code: "INT 341", english: "Web Technology", arabic: "تكنولوجيا الويب", credits: 3, type: "required" as const, period: "year-3-sem-1", prerequisites: ["CSW 110", "CSW 234"] },
  { code: "INT 351", english: "Computer Graphics", arabic: "رسوم الحاسب", credits: 3, type: "required" as const, period: "year-3-sem-1", prerequisites: ["CSW 234"] },

  // Semester 6
  { code: "INT 343", english: "Website Design & Implementation", arabic: "تصميم وتنفيذ مواقع الويب", credits: 3, type: "required" as const, period: "year-3-sem-2", prerequisites: ["INT 341", "CSW 335"] },
  { code: "INT 338", english: "Network-Based Multimedia", arabic: "الوسائط المتعددة الشبكية", credits: 3, type: "required" as const, period: "year-3-sem-2", prerequisites: ["INT 353", "INT 232"] },
  { code: "CSW 337", english: "Web Client Side Programming", arabic: "برمجة واجهة المستخدم للويب", credits: 3, type: "required" as const, period: "year-3-sem-2", prerequisites: ["CSW 234"] },
  { code: "CSW 335", english: "Programming for WWW", arabic: "برمجة الويب (WWW)", credits: 3, type: "required" as const, period: "year-3-sem-2", prerequisites: ["CSW 234"] },
  { code: "INT 349W", english: "WDT Project", arabic: "مشروع تطوير الويب والوسائط", credits: 3, type: "required" as const, period: "year-3-sem-2", prerequisites: [] },
  { code: "INT 330", english: "Data Communications", arabic: "اتصالات البيانات", credits: 3, type: "required" as const, period: "year-3-sem-2", prerequisites: ["Ma 110", "Ma 111"] },

  // Semester 7
  { code: "INT 421", english: "Digital Signal Processing", arabic: "معالجة الإشارات الرقمية", credits: 3, type: "required" as const, period: "year-4-sem-1", prerequisites: ["Ma 110", "Ma 111"] },
  { code: "INT 422", english: "Pattern Recognition", arabic: "التعرف على الأنماط", credits: 3, type: "required" as const, period: "year-4-sem-1", prerequisites: ["Ma 110", "Ma 111"] },
  { code: "INT 423", english: "Image Processing", arabic: "معالجة الصور", credits: 3, type: "required" as const, period: "year-4-sem-1", prerequisites: ["Ma 110"] },
  { code: "INT 453", english: "Digital Multimedia", arabic: "الوسائط المتعددة الرقمية", credits: 3, type: "required" as const, period: "year-4-sem-1", prerequisites: ["INT 353"] },
  { code: "INT 461", english: "Information Engineering", arabic: "هندسة المعلومات", credits: 3, type: "required" as const, period: "year-4-sem-1", prerequisites: ["INT 232"] },
  { code: "INT 498", english: "IT Project (1)", arabic: "مشروع تكنولوجيا المعلومات (1)", credits: 3, type: "required" as const, period: "year-4-sem-1", prerequisites: [] },

  // Semester 8
  { code: "INT 434", english: "Network Operations & Administration", arabic: "تشغيل وإدارة الشبكات", credits: 3, type: "required" as const, period: "year-4-sem-2", prerequisites: ["INT 232"] },
  { code: "INT 435", english: "Information & Networks Security", arabic: "أمن المعلومات والشبكات", credits: 3, type: "required" as const, period: "year-4-sem-2", prerequisites: ["INT 232"] },
  { code: "INT 433", english: "Broadband Network & Communication", arabic: "شبكات النطاق العريض والاتصالات", credits: 3, type: "required" as const, period: "year-4-sem-2", prerequisites: ["INT 232", "INT 330"] },
  { code: "INT 437", english: "Wireless & Mobile Networks", arabic: "الشبكات اللاسلكية والمحمول", credits: 3, type: "required" as const, period: "year-4-sem-2", prerequisites: ["INT 232"] },
  { code: "INT 489", english: "Selected Topics in IT", arabic: "موضوعات مختارة في تكنولوجيا المعلومات", credits: 3, type: "required" as const, period: "year-4-sem-2", prerequisites: [] },
  { code: "INT 499", english: "IT Project (2)", arabic: "مشروع تكنولوجيا المعلومات (2)", credits: 3, type: "required" as const, period: "year-4-sem-2", prerequisites: ["INT 498"] }
];

export const COURSES: Course[] = RAW_COURSES.map((c) => {
  // Determine department based on course code prefixes
  let department: Course["department"] = "IT";
  if (c.code.startsWith("Hu")) department = "HUMANITIES";
  else if (c.code.startsWith("Ma")) department = "MATH";
  else if (c.code.startsWith("St")) department = "MATH";
  else if (c.code.startsWith("CSW")) department = "CS";
  else if (c.code.startsWith("ISD")) department = "IS";

  // Determine difficulty
  let difficulty: Course["difficulty"] = "medium";
  if (c.credits === 0 || c.code.includes("100") || c.code.includes("110")) {
    difficulty = "easy";
  } else if (c.code.includes("3") || c.code.includes("4")) {
    difficulty = "hard";
  }

  // Realistic mock descriptions
  const description = `مقرر دراسي متخصص في ${c.arabic} (${c.english}) يهدف لتمكين الطالب من المفاهيم الأساسية والأدوات العملية الخاصة بالمجال وفق أحدث المناهج الأكاديمية بجامعة سيناء.`;
  const descriptionEn = `Specialized academic course in ${c.english} aimed at mastering core concepts and practical tools according to Sinai University curriculum.`;

  const outcomes = [
    `فهم المبادئ الأساسية لمقرر ${c.arabic}.`,
    `تطبيق المهارات المكتسبة في حل المشكلات التقنية والأكاديمية.`,
    "القدرة على العمل في فريق لتنفيذ مشاريع عملية تطبيقية.",
    "الاستعداد التام للمساقات الأكثر تقدمأً في السنوات اللاحقة."
  ];

  const outcomesEn = [
    `Understand foundational principles of ${c.english}.`,
    `Apply acquired technical skills to resolve academic and real-world problems.`,
    "Ability to work in teams on practical applied projects.",
    "Full preparation for advanced courses in subsequent academic years."
  ];

  return {
    ...c,
    difficulty,
    description,
    descriptionEn,
    outcomes,
    outcomesEn,
    department
  };
});
