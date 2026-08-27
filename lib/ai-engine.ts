import { COURSES, PERIODS, Course } from "./courses-data";
import { ROADMAPS, Roadmap, RoadmapNode } from "./roadmaps-data";

export interface AiMessage {
  role: "user" | "assistant";
  content: string;
}

export interface StudentContext {
  userName?: string;
  cumulativeGpa?: number;
  completedCredits?: number;
  remainingCredits?: number;
  graduationPercentage?: number;
  completedCourses?: Array<{ code: string; grade: string }>;
  plannedCourses?: string[];
  roadmapProgress?: Record<string, string[]>;
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0,
  "A": 3.8,
  "A-": 3.6,
  "B+": 3.3,
  "B": 3.0,
  "C+": 2.7,
  "C": 2.4,
  "D+": 2.0,
  "D": 2.0,
  "F": 0.0
};

export const GRADE_LABELS: Record<string, string> = {
  "A+": "ممتاز مرتفع",
  "A": "ممتاز",
  "A-": "ممتاز منخفض",
  "B+": "جيد جداً مرتفع",
  "B": "جيد جداً",
  "C+": "جيد مرتفع",
  "C": "جيد",
  "D+": "مقبول",
  "D": "مقبول",
  "F": "راسب"
};

/**
 * Normalizes text to handle typos, missing letters, diacritics, and Arabic/English/Arabizi variations
 */
export function normalizeText(text: string): string {
  if (!text) return "";
  let str = text.toLowerCase().trim();

  // Normalize Arabic letters
  str = str.replace(/[أإآآ]/g, "ا");
  str = str.replace(/ة/g, "ه");
  str = str.replace(/ى/g, "ي");
  str = str.replace(/ؤ/g, "و");
  str = str.replace(/ئ/g, "ي");
  str = str.replace(/[\u064B-\u0652]/g, ""); // Remove Tashkeel

  // Remove punctuation and symbols
  str = str.replace(/[?,.!،؛:\-_()"/\\|~*#^`+=]/g, " ");

  // Normalize repeated spaces
  str = str.replace(/\s+/g, " ");

  return str.trim();
}

/**
 * Checks if query contains any of target keywords
 */
export function matchesWords(normalizedQuery: string, keywords: string[]): boolean {
  return keywords.some((kw) => normalizedQuery.includes(normalizeText(kw)));
}

/**
 * Comprehensive dictionary of aliases, Arabic transliterations, Arabizi, and common typos
 * for all Faculty of Information Technology & Computer Science courses at Sinai University.
 */
export const COURSE_ALIASES: Record<string, string[]> = {
  "CSW 121": [
    "لوجيك ديزاين", "لوجيك", "لوجك", "لوجك ديزاين", "تصميم المنطق", "المنطق", "تصميم منطقي",
    "logic design", "logic desgin", "logic", "logc design", "logc", "digital logic", "csw121"
  ],
  "CSW 221": [
    "داتا ستراكشر", "داتا ستراكشرز", "داتا استركشر", "داتا استراكشر", "داتا ستراك", "هياكل البيانات",
    "تراكيب البيانات", "بنية البيانات", "بنيات البيانات", "data structure", "data structures",
    "data stucture", "data struct", "datastructure", "datastructures", "ds", "csw221"
  ],
  "CSW 232": [
    "برمجة 1", "برمجه 1", "برمجة الحاسب 1", "برمجة واحد", "سي بلس بلس", "بروجرامنج 1",
    "computer programming 1", "programming 1", "prog 1", "cp1", "c++", "csw232"
  ],
  "CSW 234": [
    "برمجة 2", "برمجه 2", "برمجة الحاسب 2", "برمجة اتنين", "جافا", "بروجرامنج 2",
    "computer programming 2", "programming 2", "prog 2", "cp2", "java", "csw234"
  ],
  "ISD 242": [
    "داتا بيز", "داتابيز", "قواعد البيانات", "نظم قواعد البيانات", "قواعد بيانات", "قواعد البيانات 1",
    "اس كيو ال", "database", "data base", "db", "databases", "database systems", "sql", "isd242"
  ],
  "CSW 242": [
    "نظم التشغيل", "نظم تشغيل 1", "نظم التشغيل 1", "اوبريتنج", "اوبريتنج سيستم", "اوبريتنج 1",
    "operating systems", "operating system", "operating system 1", "os", "os1", "csw242"
  ],
  "CSW 323": [
    "نظم تشغيل 2", "نظم التشغيل 2", "اوبريتنج 2", "اوبريتنج سيستم 2",
    "operating systems 2", "operating system 2", "os2", "csw323"
  ],
  "INT 232": [
    "شبكات", "شبكات الحاسب", "نتورك", "نت ورك", "شبكات 1", "شبكات حاسب",
    "computer networks", "network", "networks", "networking", "int232"
  ],
  "INT 341": [
    "تكنولوجيا الويب", "ويب", "ويب تكنولوجي", "تقنيات الويب", "الويب",
    "web technology", "web tech", "web", "int341"
  ],
  "INT 343": [
    "تصميم مواقع", "تصميم وتنفيذ مواقع الويب", "ويب ديزاين", "تصميم وتطوير المواقع",
    "website design", "web design", "website design & implementation", "int343"
  ],
  "CSW 337": [
    "برمجة واجهة المستخدم", "برمجة كلاينت", "كلاينت سايد", "فرونت اند اكاديمي",
    "web client side programming", "client side", "client side programming", "csw337"
  ],
  "CSW 335": [
    "برمجة الويب", "برمجة www", "برمجة الدبليو", "programming for www", "www", "csw335"
  ],
  "CSW 351": [
    "ذكاء اصطناعي", "ذكاء صناعي", "اي اي", "ai", "artificial intelligence", "csw351"
  ],
  "CSW 263": [
    "هندسة البرمجيات", "سوفت وير انجنيرنج", "سوفت وير", "software engineering", "software engineer", "se", "csw263"
  ],
  "CSW 225": [
    "عمارة الحاسب", "معمارية الحاسب", "كمبيوتر اركتيكتشر", "اركيتكتشر", "اركتكتشر",
    "computer architecture", "architecture", "arch", "csw225"
  ],
  "Ma 110": [
    "جبر خطي", "الجبر الخطي", "لينير", "لينير الجبرا", "linear algebra", "linear", "algebra", "ma110"
  ],
  "Ma 111": [
    "تفاضل وتكامل", "التفاضل والتكامل", "تفاضل", "تكامل", "كالكولاس", "calculus", "calc", "ma111"
  ],
  "Ma 212": [
    "رياضيات متقطعة", "رياضة متقطعة", "ديسكربت", "ديسكريت", "discrete mathematics", "discrete math", "discrete", "ma212"
  ],
  "St 120": [
    "احصاء واحتمالات", "احصاء", "احتمالات", "استاتستكس", "statistics & probability", "statistics", "probability", "stats", "st120"
  ],
  "Hu 100": [
    "تاريخ سيناء", "تاريخ سينا", "سيناريو سيناء", "sinai history", "hu100"
  ],
  "Hu 110": [
    "لغة انجليزية", "انجليزي", "انجليزي 1", "english language", "english", "hu110"
  ],
  "Hu 111": [
    "كتابة فنية", "تعبير وكتابة فنية", "تكنيكال رايتنج", "technical writing", "composition & technical writing", "hu111"
  ],
  "Hu 194": [
    "حقوق انسان", "حقوق الانسان", "هيومان رايتس", "human rights", "hu194"
  ],
  "Hu 213": [
    "تفكير ابتكاري", "تفكير ابداعي", "كرييتف ثينكنج", "creative thinking", "hu213"
  ],
  "Hu 230": [
    "مهارات اتصال", "مهارات تواصل", "كوميونيكيشن", "communication skills", "hu230"
  ],
  "Hu 212": [
    "مهارات قراءة وتقديم", "مهارات العرض", "بريزنتيشن", "reading & presentation skills", "presentation skills", "hu212"
  ],
  "ISD 100": [
    "مقدمة في النظم والمعلوماتية", "مقدمة نظم", "انفورماتكس", "نظم ومعلوماتية", "systems & informatics", "informatics", "isd100"
  ],
  "CSW 110": [
    "مقدمة في تكنولوجيا الحاسب والإنترنت", "مقدمة حاسب", "تكنولوجيا الحاسب والانترنت", "انترو كمبيوتر",
    "introduction to computer & internet technology", "computer technology", "csw110"
  ],
  "INT 110": [
    "مقدمة في الإلكترونيات", "الكترونيات", "الكترونكس", "مقدمة الكترونيات", "introduction to electronics", "electronics", "int110"
  ],
  "CSW 241": [
    "تنظيم ومعالجة الملفات", "تنظيم ملفات", "معالجة الملفات", "فايل اورجنايزيشن", "file organization & processing", "file organization", "csw241"
  ],
  "ISD 220": [
    "مقدمة في بحوث العمليات", "بحوث عمليات", "اوبريشن ريسيرش", "operations research", "or", "isd220"
  ],
  "CSW 325": [
    "المعالجة المتوازية", "معالجة متوازية", "باراليل بروسيسنج", "parallel processing", "parallel", "csw325"
  ],
  "INT 353": [
    "الوسائط المتعددة", "وسائط متعددة", "مالتي ميديا", "ملتيميديا", "multimedia", "int353"
  ],
  "INT 351": [
    "رسوم الحاسب", "كمبيوتر جرافيكس", "جرافيكس", "computer graphics", "graphics", "int351"
  ],
  "INT 349W": [
    "مشروع تطوير الويب والوسائط", "مشروع ويب", "مشروع wdt", "wdt project", "wdt", "int349w"
  ],
  "INT 330": [
    "اتصالات البيانات", "داتا كوميونيكيشن", "data communications", "data comm", "int330"
  ],
  "INT 338": [
    "الوسائط المتعددة الشبكية", "وسائط شبكية", "network based multimedia", "int338"
  ],
  "INT 421": [
    "معالجة الإشارات الرقمية", "معالجة اشارات", "dsp", "digital signal processing", "int421"
  ],
  "INT 422": [
    "التعرف على الأنماط", "تعرف على انماط", "باترن ريكوجنيشن", "pattern recognition", "int422"
  ],
  "INT 423": [
    "معالجة الصور", "معالجة الصور الرقمية", "امج بروسيسنج", "image processing", "int423"
  ],
  "INT 453": [
    "الوسائط المتعددة الرقمية", "وسائط رقمية", "digital multimedia", "int453"
  ],
  "INT 461": [
    "هندسة المعلومات", "انفورميشن انجنيرنج", "information engineering", "int461"
  ],
  "INT 498": [
    "مشروع تكنولوجيا المعلومات 1", "مشروع تخرج 1", "مشروع التخرج 1", "مشروع 1", "تخرج 1", "it project 1", "grad project 1", "int498"
  ],
  "INT 499": [
    "مشروع تكنولوجيا المعلومات 2", "مشروع تخرج 2", "مشروع التخرج 2", "مشروع 2", "تخرج 2", "it project 2", "grad project 2", "int499"
  ],
  "INT 434": [
    "تشغيل وإدارة الشبكات", "ادارة شبكات", "network operations", "network operations & administration", "int434"
  ],
  "INT 435": [
    "أمن المعلومات والشبكات", "امن شبكات", "امن معلومات", "سيكيورتي", "information & networks security", "network security", "int435"
  ],
  "INT 433": [
    "شبكات النطاق العريض والاتصالات", "شبكات النطاق العريض", "برودباند", "broadband network & communication", "broadband", "int433"
  ],
  "INT 437": [
    "الشبكات اللاسلكية والمحمول", "شبكات لاسلكية", "شبكات محمول", "وايرلس", "wireless & mobile networks", "wireless networks", "int437"
  ],
  "INT 489": [
    "مواضيع مختارة في تكنولوجيا المعلومات", "مواضيع مختارة", "توبيكس", "selected topics in it", "selected topics", "int489"
  ]
};

/**
 * Resolve Course from natural language query using aliases, code, Arabic title, and English title
 */
export function findMatchingCourse(query: string): Course | null {
  const normQuery = normalizeText(query);
  if (!normQuery) return null;

  // 1. Direct Code Matching (e.g. "csw 221" or "csw221" or "ma 110")
  const strippedQuery = normQuery.replace(/\s+/g, "");
  for (const c of COURSES) {
    const strippedCode = normalizeText(c.code).replace(/\s+/g, "");
    if (strippedQuery.includes(strippedCode)) {
      return c;
    }
  }

  // 2. Exact Title Match
  for (const c of COURSES) {
    const normAr = normalizeText(c.arabic);
    const normEn = normalizeText(c.english);
    if (normQuery.includes(normAr) || normQuery.includes(normEn)) {
      return c;
    }
  }

  // 3. Alias Dictionary Match (Highest Accuracy for Arabic, Arabizi, and typos)
  const queryWords = normQuery.split(/\s+/);
  for (const [code, aliases] of Object.entries(COURSE_ALIASES)) {
    for (const alias of aliases) {
      const normAlias = normalizeText(alias);
      if (normAlias.length <= 3) {
        // Short aliases (e.g. "ds", "os", "ai", "db") MUST match as distinct words
        if (queryWords.includes(normAlias)) {
          const found = COURSES.find((c) => c.code === code);
          if (found) return found;
        }
      } else {
        if (normQuery.includes(normAlias)) {
          const found = COURSES.find((c) => c.code === code);
          if (found) return found;
        }
      }
    }
  }

  // 4. Tokenized Partial Matching (Excluding common conversational stop words)
  const stopWords = [
    "انا", "اي", "ايه", "كيف", "هل", "عايز", "اريد", "متي", "مادة", "ماده", "مواد",
    "كورسات", "كورس", "مقرر", "مقررات", "فاضلي", "بتاعي", "خاصتي", "كام", "دلوقتي",
    "عن", "من", "في", "علي", "الي", "يا", "لو", "جبت", "كنت", "جايب", "تقديري",
    "درجتي", "درجة", "تقدير", "كام", "فيه", "فيها", "ليه", "مش", "قادر", "اسجل",
    "سجلت", "ما", "هو", "هي", "شروط", "متطلب", "سنة", "ترم", "فصل", "اول", "تاني",
    "كلية", "كليه", "جامعة", "جامعه", "سيناء", "سينا", "برنامج", "قسم", "طالب",
    "دراسة", "دراسه", "امتحان", "امتحانات", "اختبار", "اختبارات", "حمام", "سباحة",
    "سباحه", "اولمبي", "اولمبيه", "مستشفى", "ملعب", "سكن", "مدينة", "مصاريف", "باص",
    "مواصلات", "كان", "عندي", "عندك", "توقع", "توقعات", "شات", "مساعد", "xyz", "abc", "words", "random"
  ];
  const tokens = normQuery.split(/\s+/).filter((t) => t.length > 2 && !stopWords.includes(t) && !/^[0-9]+$/.test(t));

  if (tokens.length === 0) return null;

  let bestMatch: Course | null = null;
  let highestScore = 0;

  for (const c of COURSES) {
    const courseWords = normalizeText(`${c.arabic} ${c.english}`).split(/\s+/);
    const aliases = COURSE_ALIASES[c.code] || [];
    const aliasWords = aliases.flatMap((a) => normalizeText(a).split(/\s+/));
    const allWords = Array.from(new Set([...courseWords, ...aliasWords]));

    let score = 0;
    for (const token of tokens) {
      if (allWords.some((w) => w === token || (token.length >= 4 && w.length >= 4 && (w.startsWith(token) || token.startsWith(w))))) {
        score += 1;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = c;
    }
  }

  // Require at least 2 token matches if query has multiple tokens
  if (tokens.length >= 2) {
    return highestScore >= 2 ? bestMatch : null;
  } else if (tokens.length === 1 && highestScore >= 1) {
    const singleToken = tokens[0];
    if (bestMatch) {
      const courseWords = normalizeText(`${bestMatch.arabic} ${bestMatch.english}`).split(/\s+/);
      const aliases = COURSE_ALIASES[bestMatch.code] || [];
      const allWords = Array.from(new Set([...courseWords, ...aliases.flatMap((a) => normalizeText(a).split(/\s+/))]));
      if (allWords.some((w) => w === singleToken || (singleToken.length >= 5 && w.startsWith(singleToken)))) {
        return bestMatch;
      }
    }
  }

  return null;
}

/**
 * Check if the query is attempting to access another student's private data
 */
export function isPrivacyViolation(norm: string): boolean {
  // Check for other names or foreign student inquiries
  const otherPersons = [
    "احمد", "محمد", "محمود", "علي", "سارة", "ساره", "طالب تاني", "طالب اخر", "اي طالب تاني",
    "بيانات طالب", "زميلي", "صاحبي", "درجات حد", "طالب غيري", "طالب معين", "شخص تاني"
  ];
  const inquiryWords = ["كام", "جايب", "درجات", "درجة", "تقدير", "gpa", "معدل", "سجل", "بيانات", "اعرض", "هات"];

  const hasPerson = otherPersons.some((p) => norm.includes(p));
  const hasInquiry = inquiryWords.some((w) => norm.includes(w));
  const hasStudentId = /\b202[0-9]{4,6}\b/.test(norm);

  return (hasPerson && hasInquiry) || hasStudentId;
}

/**
 * Formats a detailed AI response for a specific course
 */
export function formatCourseResponse(c: Course, studentContext?: StudentContext): string {
  const periodLabel = PERIODS[c.period] || c.period;
  const prereqsText = c.prerequisites.length > 0
    ? c.prerequisites.map((p) => {
        const preCourse = COURSES.find((item) => item.code === p);
        return preCourse ? `**[${p}] ${preCourse.arabic}**` : `**[${p}]**`;
      }).join(", ")
    : "لا يوجد متطلب مسبق (مادة مفتوحة بالفرقة الأولى/التخصص).";

  const diffEmoji = c.difficulty === "hard" ? " مادة تخصصية تتطلب ممارسة دؤوبة" : c.difficulty === "medium" ? "🟡 مادة متوسطة الشدة" : "🟢 مادة سلسة ومباشرة";

  let studentStatusNotice = "";
  if (studentContext) {
    const completedInfo = studentContext.completedCourses?.find((item) => item.code === c.code);
    const isPlanned = studentContext.plannedCourses?.includes(c.code);

    if (completedInfo) {
      studentStatusNotice = `\n\n>  **حالتك الشخصية في هذه المادة**: لقد اجتزت هذا المقرر بالفعل ومسجل لك بتقدير **(${completedInfo.grade})**!`;
    } else if (isPlanned) {
      studentStatusNotice = `\n\n>  **حالتك الشخصية في هذه المادة**: هذه المادة مضافة في قائمة **المواد المخططة للتسجيل** لديك.`;
    } else {
      studentStatusNotice = `\n\n> ℹ️ **حالتك الشخصية في هذه المادة**: لم تقم بتسجيل أو اجتياز هذا المقرر بعد في سجلك الأكاديمي.`;
    }
  }

  return `###  [${c.code}] ${c.arabic} (${c.english})

- ⏱️ **عدد الساعات المعتمدة**: **${c.credits} ساعات**
-  **المستوى الأكاديمي**: **${periodLabel}**
-  **المتطلبات المسبقة**: ${prereqsText}
-  **مستوى الصعوبة**: ${diffEmoji}${studentStatusNotice}

####  نبذة عن المقرر والهدف التعليمي:
${c.description}

####  مخرجات التعلم المكتسبة (Outcomes):
${c.outcomes.map((o) => `- ${o}`).join("\n")}

####  استراتيجية التفوق واجتياز المقرر بتقدير ممتاز (A):
1. **المواظبة العملية**: احرص على تطبيق الأكواد والتمارين العملية في المعامل والمختبرات.
2. **استغلال المراجع**: زر صفحة [تفاصيل مقرر ${c.code}](/courses/${encodeURIComponent(c.code)}) لتنزيل أوراق الغش والمصادر المعتمدة ونماذج الامتحانات السابقة.
3. **مزامنة الجدول**: تأكد من عدم وجود تعارض مع المواد المتطلبة الأخرى من خلال **مخطط التسجيل الذكي**.`;
}

/**
 * Deterministic Semester GPA Calculator
 */
export function handleSemesterGpaQuery(norm: string, studentContext?: StudentContext): string | null {
  // Determine target period
  let yearNum = 0;
  let semNum = 0;

  if (norm.includes("سنه اولي") || norm.includes("سنة اولي") || norm.includes("سنة اولى") || norm.includes("سنه اولى") || norm.includes("الفرقة الاولي") || norm.includes("الفرقة الاولى") || norm.includes("year 1") || norm.includes("year1")) {
    yearNum = 1;
  } else if (norm.includes("سنه تانيه") || norm.includes("سنة تانية") || norm.includes("سنة ثانية") || norm.includes("سنه ثانية") || norm.includes("الفرقة الثانية") || norm.includes("الفرقة التانية") || norm.includes("year 2") || norm.includes("year2")) {
    yearNum = 2;
  } else if (norm.includes("سنه تالته") || norm.includes("سنة تالتة") || norm.includes("سنة ثالثة") || norm.includes("الفرقة الثالثة") || norm.includes("الفرقة التالتة") || norm.includes("year 3") || norm.includes("year3")) {
    yearNum = 3;
  } else if (norm.includes("سنه رابعه") || norm.includes("سنة رابعة") || norm.includes("الفرقة الرابعة") || norm.includes("year 4") || norm.includes("year4")) {
    yearNum = 4;
  }

  if (norm.includes("ترم اول") || norm.includes("الترم الاول") || norm.includes("فصل اول") || norm.includes("الفصل الاول") || norm.includes("sem 1") || norm.includes("sem1") || norm.includes("semester 1")) {
    semNum = 1;
  } else if (norm.includes("ترم تاني") || norm.includes("الترم التاني") || norm.includes("ترم ثاني") || norm.includes("الترم الثاني") || norm.includes("فصل تاني") || norm.includes("الفصل الثاني") || norm.includes("sem 2") || norm.includes("sem2") || norm.includes("semester 2")) {
    semNum = 2;
  }

  if (yearNum === 0 && semNum === 0) return null;

  // Default to sem 1 if user just said "سنة تانية جبت كام"
  if (semNum === 0 && yearNum > 0) semNum = 1;
  // Default to year 1 if user just said "الترم الاول جبت كام"
  if (yearNum === 0 && semNum > 0) yearNum = 1;

  const targetPeriod = `year-${yearNum}-sem-${semNum}`;
  const periodTitle = PERIODS[targetPeriod] || `السنة ${yearNum} - الفصل ${semNum}`;

  // Get courses belonging to this exact semester from catalog
  const semesterCourses = COURSES.filter((c) => c.period === targetPeriod);
  if (semesterCourses.length === 0) {
    return `لم يتم العثور على مقررات مدرجة في اللائحة لـ **${periodTitle}**.`;
  }

  const completedList = studentContext?.completedCourses || [];
  
  // Find which of these semester courses the student completed and has grades for
  const gradedCourses: Array<{ course: Course; grade: string; points: number }> = [];
  const missingGradeCourses: Course[] = [];
  const uncompletedCourses: Course[] = [];

  for (const sc of semesterCourses) {
    const studentRecord = completedList.find((c) => c.code === sc.code);
    if (studentRecord) {
      if (studentRecord.grade && GRADE_POINTS[studentRecord.grade] !== undefined) {
        gradedCourses.push({
          course: sc,
          grade: studentRecord.grade,
          points: GRADE_POINTS[studentRecord.grade]
        });
      } else {
        missingGradeCourses.push(sc);
      }
    } else {
      uncompletedCourses.push(sc);
    }
  }

  if (gradedCourses.length === 0) {
    return `###  المعدل الفصلي (Semester GPA) - ${periodTitle}

لم يتم العثور على أي تقديرات مسجلة لمواد **${periodTitle}** في سجلك الأكاديمي حتى الآن.

المقررات المطلوبة لهذا الفصل وفق خطة الكلية هي:
${semesterCourses.map((c) => `- **[${c.code}] ${c.arabic}** (${c.credits} ساعات)`).join("\n")}

>  يمكنك التوجه لصفحة **الخطة والتقدم** وتسجيل تقديرات المواد التي اجتزتها ليتم حساب الـ GPA الفصلي والتراكمي فوراً!`;
  }

  // Calculate Semester GPA deterministically: sum(gradePoints * credits) / sum(credits)
  let totalQualityPoints = 0;
  let totalCredits = 0;

  const courseBreakdown = gradedCourses.map(({ course, grade, points }) => {
    // Hu 100 has 0 credits, exclude from GPA calculation divisor
    if (course.credits > 0) {
      totalQualityPoints += points * course.credits;
      totalCredits += course.credits;
    }
    return `- **[${course.code}] ${course.arabic}**: تقدير **(${grade})** | ${course.credits} ساعات | نقاط: ${(points * course.credits).toFixed(1)}`;
  }).join("\n");

  const semesterGpa = totalCredits > 0 ? (totalQualityPoints / totalCredits) : 0;

  let gpaBadge = "ممتاز مرتفع ";
  if (semesterGpa < 2.0) gpaBadge = "إنذار أكاديمي / بحاجة للتحسين ️";
  else if (semesterGpa < 2.5) gpaBadge = "مقبول ️";
  else if (semesterGpa < 3.0) gpaBadge = "جيد ";
  else if (semesterGpa < 3.6) gpaBadge = "جيد جداً ";

  let missingNote = "";
  if (missingGradeCourses.length > 0) {
    missingNote += `\n\n> ️ **ملاحظة**: توجد مواد مسجلة ولكن بدون رصد تقدير: ${missingGradeCourses.map((c) => c.code).join(", ")}.`;
  }
  if (uncompletedCourses.length > 0) {
    missingNote += `\n\n> ℹ️ **مواد متبقية في هذا الفصل**: ${uncompletedCourses.map((c) => `[${c.code}] ${c.arabic}`).join(", ")}.`;
  }

  return `###  المعدل الفصلي الحسابي الدقيق (Semester GPA)
####  **${periodTitle}**

لقد قمت بحساب الـ GPA الفصلي الخاص بك بناءً على المقررات المنجزة والمرصودة فعلياً في حسابك:

${courseBreakdown}

-  **المعدل الفصلي لهذا الترم (Semester GPA)**: **${semesterGpa.toFixed(2)} / 4.00** (${gpaBadge})
- ⏱️ **إجمالي الساعات المحسوبة**: **${totalCredits}** ساعة معتمدة.
-  **طريقة الحساب**: (مجموع النقاط: ${totalQualityPoints.toFixed(1)}) ÷ (إجمالي الساعات: ${totalCredits}) = **${semesterGpa.toFixed(2)}**${missingNote}`;
}

/**
 * Deterministic What-If GPA Simulator
 */
export function handleWhatIfQuery(norm: string, studentContext?: StudentContext): string | null {
  if (!matchesWords(norm, ["لو جبت", "لو اخدت", "محتاج اجيب كام", "علشان اوصل", "علشان ارفع", "what if", "توقعات"])) {
    return null;
  }

  const currentGpa = studentContext?.cumulativeGpa ?? 0;
  const completedCredits = studentContext?.completedCredits ?? 0;
  const currentTotalPoints = currentGpa * completedCredits;

  // Case 1: Target GPA (e.g. "محتاج اجيب كام علشان اوصل 3" or "عاوز اوصل 3.5")
  const targetMatch = norm.match(/(?:اوصل|ارفع معدلي|اجيب|هدف)\s*(?:ل|الى|الي)?\s*([2-3]\.[0-9]{1,2}|[3-4](?:\.0)?)/);
  if (targetMatch && matchesWords(norm, ["محتاج", "كام علشان", "عاوز اوصل", "عايز اوصل"])) {
    const targetGpa = parseFloat(targetMatch[1]);
    const assumedNextSemesterCredits = 15; // Standard 15 hours load
    const newTotalCredits = completedCredits + assumedNextSemesterCredits;
    const requiredTotalPoints = targetGpa * newTotalCredits;
    const pointsNeeded = requiredTotalPoints - currentTotalPoints;
    const requiredSemesterGpa = pointsNeeded / assumedNextSemesterCredits;

    if (requiredSemesterGpa > 4.0) {
      return `###  محاكاة الوصول للمعدل المستهدف: ${targetGpa.toFixed(2)}

- معدلك التراكمي الحالي: **${currentGpa.toFixed(2)}** (منجز **${completedCredits}** ساعة).
- بافتراض تسجيلك لـ **15 ساعة** في الفصل القادم:
- ️ **النتيجة**: لا يمكن الوصول إلى معدل **${targetGpa.toFixed(2)}** في فصل دراسي واحد فقط، لأنك ستحتاج إلى معدل فصلي قدره **${requiredSemesterGpa.toFixed(2)}** (والحد الأقصى للنظام هو 4.00).
-  **التوصية**: ستحتاج إلى فصلين دراسيين بمعدلات تتراوح بين **A و A+** للوصول إلى هذا المعدل تدريجياً.`;
    }

    let neededGradeDesc = "امتياز مرتفع (A+)";
    if (requiredSemesterGpa <= 2.4) neededGradeDesc = "جيد (C)";
    else if (requiredSemesterGpa <= 2.7) neededGradeDesc = "جيد مرتفع (C+)";
    else if (requiredSemesterGpa <= 3.0) neededGradeDesc = "جيد جداً (B)";
    else if (requiredSemesterGpa <= 3.3) neededGradeDesc = "جيد جداً مرتفع (B+)";
    else if (requiredSemesterGpa <= 3.8) neededGradeDesc = "ممتاز (A)";

    return `###  محاكاة الوصول للمعدل المستهدف: ${targetGpa.toFixed(2)}

-  **معدلك الحالي**: **${currentGpa.toFixed(2)}** (إجمالي **${completedCredits}** ساعة).
- ⏱️ **العبء المفترض**: **${assumedNextSemesterCredits} ساعة** (5 مواد تقريباً).
-  **المعدل الفصلي المطلوب تحقيقه الترم القادم**: **${Math.max(0, requiredSemesterGpa).toFixed(2)} / 4.00**
-  **التقدير المستهدف في المواد القادمة**: بمتوسط تقديرات لا تقل عن **${neededGradeDesc}**.

>  **معادلة الحساب الحتمية**: ((النقاط الحالية: ${currentTotalPoints.toFixed(1)}) + (${assumedNextSemesterCredits} × ${requiredSemesterGpa.toFixed(2)})) ÷ (${newTotalCredits} ساعة) = **${targetGpa.toFixed(2)}**.`;
  }

  // Case 2: Grade simulation (e.g. "لو جبت A في 3 مواد" or "لو جبت امتياز")
  let simGrade = "A";
  let simPoints = 3.8;
  if (norm.includes("a+") || norm.includes("امتياز مرتفع")) {
    simGrade = "A+"; simPoints = 4.0;
  } else if (norm.includes("a-") || norm.includes("امتياز منخفض")) {
    simGrade = "A-"; simPoints = 3.6;
  } else if (norm.includes("b+") || norm.includes("جيد جدا مرتفع")) {
    simGrade = "B+"; simPoints = 3.3;
  } else if (norm.includes("b") || norm.includes("جيد جدا")) {
    simGrade = "B"; simPoints = 3.0;
  } else if (norm.includes("c+") || norm.includes("جيد مرتفع")) {
    simGrade = "C+"; simPoints = 2.7;
  } else if (norm.includes("c") || norm.includes("جيد")) {
    simGrade = "C"; simPoints = 2.4;
  }

  // Extract number of courses or hours
  let simCoursesCount = 3;
  const countMatch = norm.match(/([1-9]|10)\s*(?:مواد|مادة|مقررات)/);
  if (countMatch) {
    simCoursesCount = parseInt(countMatch[1]);
  }
  const simCredits = simCoursesCount * 3; // 3 hours each

  const newTotalPoints = currentTotalPoints + (simCredits * simPoints);
  const newTotalCredits = completedCredits + simCredits;
  const simulatedGpa = newTotalCredits > 0 ? (newTotalPoints / newTotalCredits) : 0;
  const diff = simulatedGpa - currentGpa;

  return `###  محاكاة الـ What-If التنبؤية الرياضية
>  *هذه نتيجة حسابية افتراضية مبنية على أرقام حسابك الحقيقية ولا تُعد تعديلاً لسجلك الفعلي.*

-  **معدلك وساعاتك الحالية**: **${currentGpa.toFixed(2)}** (${completedCredits} ساعة منجزة).
-  **السيناريو المفترض**: الحصول على تقدير **${simGrade} (${simPoints.toFixed(1)})** في **${simCoursesCount} مواد** (بإجمالي ${simCredits} ساعات معتمدة).
-  **المعدل التراكمي المتوقع (Projected GPA)**: **${simulatedGpa.toFixed(2)} / 4.00**
-  **التغير في المعدل**: ${diff >= 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2)} نقطة.

>  **تفاصيل المعادلة**: (نقاطك الحالية: ${currentTotalPoints.toFixed(1)} + نقاط المواد المفترضة: ${(simCredits * simPoints).toFixed(1)}) ÷ (إجمالي الساعات الجديدة: ${newTotalCredits}) = **${simulatedGpa.toFixed(2)}**.`;
}

/**
 * Roadmap Intelligence: queries real student roadmap progress and recommends next step
 */
export function handleRoadmapQuery(norm: string, studentContext?: StudentContext): string | null {
  if (!matchesWords(norm, ["frontend", "backend", "فرونت", "باك", "مسار", "مسارات", "roadmap", "رودماب", "خطوة جاية", "اخش علي ايه", "اخش على ايه", "اكمل ايه", "خلصت قد ايه", "وصلت لفين"])) {
    return null;
  }

  // Determine target roadmap
  let targetRoadmapId = "frontend";
  if (norm.includes("backend") || norm.includes("باك") || norm.includes("خوادم")) {
    targetRoadmapId = "backend";
  }

  const roadmap = ROADMAPS.find((r) => r.id === targetRoadmapId) || ROADMAPS[0];
  const userCompletedNodeIds = studentContext?.roadmapProgress?.[roadmap.id] || [];
  const totalNodesCount = roadmap.nodes.length;
  const completedCount = userCompletedNodeIds.length;
  const percentage = totalNodesCount > 0 ? Math.round((completedCount / totalNodesCount) * 100) : 0;

  // Find next uncompleted node
  const nextNode = roadmap.nodes.find((node) => !userCompletedNodeIds.includes(node.id));

  let statusText = "";
  if (percentage === 100) {
    statusText = ` **ما شاء الله! لقد أتممت 100% من مسار ${roadmap.title} بنجاح!**\n\nأنت الآن مؤهل تماماً لبناء مشاريع تخرج ومواقع احترافية متكاملة، وننصحك بالانتقال للمسار التالي (تطوير الأنظمة الخلفية Backend) لتعزيز مهارات الـ Full-Stack.`;
  } else if (nextNode) {
    const relatedCoursesText = nextNode.courseCodes && nextNode.courseCodes.length > 0
      ? `\n- 🎓 **المقررات الجامعية المرتبطة بالكلية**: ${nextNode.courseCodes.join(", ")}`
      : "";

    statusText = `-  **نسبة إنجازك الفعلية في المسار**: **${percentage}%** (${completedCount} من أصل ${totalNodesCount} مراحل مكتملة).
-  **خطوتك القادمة الموصى بها**: مرحلة **"${nextNode.label}"**
- ⏱️ **المدة الزمنية المقترحة**: **${nextNode.duration}**
-  **الهدف من هذه الخطوة**: ${nextNode.description}${relatedCoursesText}

>  يمكنك التوجه لصفحة **مسارات خارطة الطريق (Roadmaps)** لتحديث تقدمك ومشاهدة مصادر التعلم وروابط الدورات المعتمدة لهذه المرحلة!`;
  } else {
    statusText = `لديك نسبة تقدم **${percentage}%** في مسار **${roadmap.title}**.`;
  }

  return `### ️ مسار التعلم الأكاديمي والمهني: ${roadmap.title}

${statusText}`;
}

/**
 * Official University Regulations Reference (Based 100% on دليل_الطالب.md)
 */
export function handleUniversityRegulations(norm: string): string | null {
  // 1. Credit Hours / Academic Load (العبء الدراسي)
  if (matchesWords(norm, ["العبء الدراسي", "عبء", "ساعات التسجيل", "الحد الاقصي للساعات", "الحد الادني للساعات", "كم ساعه اسجل", "كم ساعة اسجل", "اقصي ساعات", "اقل ساعات"])) {
    return `###  لائحة العبء الدراسي والساعات المعتمدة (وفقاً لدليل الطالب - صفحة 14)

وفقاً للائحة الرسمية لجامعة سيناء:
- **الحد الأدنى للتسجيل بالفصل الدراسي**: **12 ساعة معتمدة** (ويجوز تخفيضه لـ 9 ساعات لعذر مقبول بموافقة المرشد وعميد الكلية).
- **الحد الأقصى للتسجيل بالفصل الدراسي**: **21 ساعة معتمدة** (يشترط معدل تراكمي $\ge$ 3.00 أو أن يتوقف تخرجه على ذلك).
- **العبء الاعتيادي للجامعة**: **18 ساعة معتمدة** في الفصلين الأول والثاني.
- **الفصل الدراسي الصيفي**: الحد الأقصى **9 ساعات معتمدة**، ويسمح للطالب الخريج بتسجيل **12 ساعة معتمدة**.`;
  }

  // 2. Academic Warning & Probation (الإنذار الأكاديمي والفصل)
  if (matchesWords(norm, ["انذار اكاديمي", "الانذار الاكاديمي", "انذار", "بروبيشن", "probation", "فصل من الكلية", "متي افصل", "متى افصل", "شروط الانذار"])) {
    return `###  ضوابط الإنذار الأكاديمي والفصل (وفقاً لدليل الطالب - صفحة 16 و 17)

حسب المادة الرسمية بلائحة جامعة سيناء:
1. **شروط الإنذار**: يوضع الطالب تحت الإنذار الأكاديمي إذا انخفض معدله التراكمي (GPA) عن **2.00 / 4.00**.
2. **مهلة تعديل الوضع**: يُعطى الطالب فرصة **فصلين دراسيين** (ليس منهما الفصل الصيفي) لرفع معدله التراكمي إلى 2.00 أو أكثر.
3. **الفصل الأكاديمي**: يُفصل الطالب من الكلية إذا استمر معدله التراكمي أقل من 2.00 لمدة **أربعة فصول دراسية متتالية**، ويجوز لمجلس الكلية منح فرصة استثنائية أخيرة بعذر مقبول.`;
  }

  // 3. Add, Drop, and Withdrawal (التسجيل والحذف والإضافة والانسحاب)
  if (matchesWords(norm, ["حذف واضافة", "الحذف والاضافة", "حذف مادة", "اضافة مادة", "انسحاب", "انسحب من مادة", "تقدير w", "drop", "withdraw"])) {
    return `###  قواعد الحذف والإضافة والانسحاب (وفقاً لدليل الطالب - صفحة 15 و 18)

تنص لائحة جامعة سيناء على المواعيد التالية:
- **فترة الإضافة (Add)**: خلال **الأسبوعين الأولين** من بدء الدراسة بتنسيق وموافقة المرشد الأكاديمي.
- **فترة الحذف (Drop)**: خلال فترة لا تتعدى **الأسبوع الرابع** من بدء الدراسة، وتُحذف المادة تماماً من السجل دون أن تظهر أو تحتسب رسوباً.
- **فترة الانسحاب (Withdraw)**: يجوز الانسحاب من مقرر حتى نهاية **الأسبوع الثامن** من بدء الدراسة مع رصد تقدير **منسحب (W)** ولا يعتبر الطالب راسباً (بشرط ألا يقل العبء الدراسي عن 9 ساعات).
- **الانسحاب بعد الأسبوع الثامن**: دون عذر قهري يقبله مجلس الكلية يُحتسب تقدير الطالب **راسب (F)**.`;
  }

  // 4. Attendance & Absence (المواظبة والغياب ونسب الحرمان)
  if (matchesWords(norm, ["غياب", "نسبة الغياب", "حرمان", "اتحرم من الامتحان", "حضور", "غيابي", "المواظبة"])) {
    return `###  شروط المواظبة والغياب (وفقاً لدليل الطالب - صفحة 15 و 31)

- الدراسة في كلية تكنولوجيا المعلومات وعلوم الحاسب **نظامية ولا يجوز فيها الانتساب**.
- **الحد الأدنى لنسبة الحضور**: **75%** من المحاضرات والدروس العملية لدخول الاختبار النهائي.
- **عقوبة تجاوز الغياب**: إذا تجاوزت نسبة غياب الطالب **25%** دون عذر رسمي مقبول، يحرم الطالب بقرار مجلس الكلية من دخول الامتحان النهائي للمقرر، ويُعطى درجة **صفر (F)** في الامتحان النهائي ويعد راسباً في المقرر.
- **الأعذار المرضية**: يجب تقديم الشهادة الطبية من وحدة حكومية معتمدة خلال **3 أيام** من تاريخ حدوث العذر.`;
  }

  // 5. Graduation Requirements (شروط التخرج)
  if (matchesWords(norm, ["شروط التخرج", "اتخرج ازاي", "متطلبات التخرج", "كام ساعه عشان اتخرج", "ساعات التخرج"])) {
    return `###  شروط ومتطلبات التخرج للبكالوريوس (وفقاً لدليل الطالب - صفحة 14 و 23)

للحصول على درجة البكالوريوس في تكنولوجيا المعلومات وعلوم الحاسب بجامعة سيناء:
1. **إتمام 144 ساعة معتمدة بنجاح** موزعة كالتالي:
   - **12 ساعة** متطلبات جامعة.
   - **72 ساعة** متطلبات كلية (66 إجبارية + 6 اختيارية).
   - **60 ساعة** متطلبات تخصص (45 إجبارية قسم + 15 اختيارية قسم).
2. تحقيق معدل تراكمي إجمالي (GPA) لا يقل عن **2.00 / 4.00**.
3. اجتياز دورة **التربية العسكرية** بنجاح (للطلاب الذكور - شرط أساسي لا يمكن التخرج دونه).
4. اجتياز فترة **التدريب الميداني الصيفي** المقررة من الكلية.
5. اجتياز مشروعي التخرج (1 و 2).`;
  }

  // 6. Graduation Project & Training (مشروع التخرج والتدريب الصيفي)
  if (matchesWords(norm, ["مشروع التخرج", "تسجيل مشروع التخرج", "مشروع 1", "مشروع تخرج", "تدريب ميداني", "تدريب صيفي"])) {
    return `###  ضوابط مشروع التخرج والتدريب (وفقاً لدليل الطالب - صفحة 20)

- **شرط تسجيل مشروع التخرج**: يشترط أن يكون الطالب قد اجتاز بنجاح **95 ساعة معتمدة** على الأقل، ويكون مسجلاً في السنة الدراسية الرابعة.
- **نظام المشروع**: مشروع التخرج ينقسم لفصلين دراسيين (مشروع 1 في ترم 7، ومشروع 2 في ترم 8).
- **تقييم المشروع**: 40% على أساس المقررات الدراسية و 60% على أساس مناقشة وتقرير وعرض المشروع النهائي أمام لجنة تحكيم تضم محكماً خارجياً.
- **التدريب الميداني**: يؤديه الطالب في الشركات المعتمدة (القرية الذكية وغيرها) ويعد اجتيازه شرطاً لازماً للتخرج.`;
  }

  // 7. Honors List & Degrees (قائمة الشرف ومرتبة الشرف)
  if (matchesWords(norm, ["مرتبة الشرف", "قائمة الشرف", "الشرف الاولي", "الشرف الاولى", "شرف"])) {
    return `###  قواعد قائمة ومرتبة الشرف (وفقاً لدليل الطالب - صفحة 17 و 20)

- **قائمة شرف عميد الكلية (Honor List)**: يوضع فيها اسم الطالب بالفصل الدراسي إذا حقق معدلاً تراكمياً/فصلياً لا يقل عن **3.30 (جيد جداً)** مع تسجيل الحد الأقصى للعبء الدراسي ودون رسوب في أي مقرر.
- **مرتبة الشرف الأولى عند التخرج**: تمنح للطالب الذي يتخرج بمعدل تراكمي عام لا يقل عن **3.80 / 4.00** بشرط ألا يكون قد رسب في أي مقرر درسه طوال سنوات دراسته.
- **مرتبة الشرف الثانية عند التخرج**: تمنح للطالب الحاصل على معدل تراكمي عام بين **3.40 و 3.80** دون رسوب في أي مقرر.`;
  }

  // 8. Grading System & Scale (سلم التقديرات وحساب الدرجات)
  if (matchesWords(norm, ["سلم التقديرات", "توزيع الدرجات", "نظام التقويم", "درجة النجاح", "اعمال السنة"])) {
    return `###  نظام التقويم وسلّم الدرجات (وفقاً لدليل الطالب - صفحة 16)

- **توزيع درجات المقرر**: 40% أعمال فصلية + 60% اختبار نهائي (أو 50% تحريري + 10% عملي).
- **الحد الأدنى للنجاح**: الحصول على 50% من الدرجة الإجمالية للمقرر.
- **سلم النقاط المعتمد**:
  - **A+** (4.00) | 90% فأكثر (ممتاز مرتفع)
  - **A** (3.80) | 90% - أقل من 95% (ممتاز)
  - **A-** (3.60) | 85% - أقل من 90% (ممتاز منخفض)
  - **B+** (3.30) | 80% - أقل من 85% (جيد جداً مرتفع)
  - **B** (3.00) | 75% - أقل من 80% (جيد جداً)
  - **C+** (2.70) | 70% - أقل من 75% (جيد مرتفع)
  - **C** (2.40) | 65% - أقل من 70% (جيد)
  - **D+ / D** (2.00) | 60% - أقل من 65% (مقبول - الحد الأدنى لاجتياز المقرر)
  - **F** (0.00) | أقل من 60% (راسب)`;
  }

  return null;
}

/**
 * Resolves follow-up query context using conversation history
 */
export function handleFollowUpContext(norm: string, history?: AiMessage[]): Course | null {
  if (!history || history.length === 0) return null;

  // Check if query is anaphoric / referring to previous topic
  const isFollowUp = matchesWords(norm, ["اللي بعدها", "المادة اللي بعدها", "اللي بعده", "الكورس اللي بعده", "في المادة دي", "في الكورس ده", "المادة دي", "المقرر ده", "والترم ده"]);
  if (!isFollowUp) return null;

  // Search backwards in history for the last mentioned course
  for (let i = history.length - 1; i >= 0; i--) {
    const msg = history[i];
    const match = findMatchingCourse(msg.content);
    if (match) {
      // If user asks "اللي بعدها", look for a course that has this course as a prerequisite!
      if (matchesWords(norm, ["اللي بعدها", "اللي بعده", "المادة اللي بعدها", "الكورس اللي بعده"])) {
        const nextCourse = COURSES.find((c) => c.prerequisites.includes(match.code));
        if (nextCourse) return nextCourse;
      }
      return match;
    }
  }

  return null;
}

/**
 * Main Deterministic AI Response Generator
 */
export function getAiResponse(
  query: string,
  studentContext?: StudentContext,
  history?: AiMessage[]
): string {
  const norm = normalizeText(query);
  if (!norm) {
    return "أهلاً بك! كيف يمكنني مساعدتك اليوم في خطتك الأكاديمية أو استفساراتك عن الكلية؟";
  }

  // 1. PRIVACY GUARD (Strict Isolation Check)
  if (isPrivacyViolation(norm)) {
    return ` **تنبيه الخصوصية وحماية البيانات الأكاديمية**

عذراً، وفقاً لسياسة الخصوصية وحماية بيانات الطلاب في منصة جامعة سيناء، **لا يمكنني الاستعلام عن أو إظهار درجات أو معدلات أي طالب آخر**. 

أنا مبرمج للتعامل حصرياً مع البيانات الأكاديمية الخاصة بحسابك أنت فقط. يمكنك سؤالي عن معدلك، درجات مقرراتك، أو خطتك الدراسية الشخصية في أي وقت!`;
  }

  // 2. CONVERSATIONAL FOLLOW-UP QUERY (Resolving context from previous messages)
  const followUpCourse = handleFollowUpContext(norm, history);
  if (followUpCourse) {
    // If they ask for their grade in that follow-up course
    if (matchesWords(norm, ["جبت كام", "جبت ايه", "تقديري", "درجتي", "جايب كام"])) {
      const comp = studentContext?.completedCourses?.find((c) => c.code === followUpCourse.code);
      if (comp) {
        return ` **تقديرك في مقرر [${followUpCourse.code}] ${followUpCourse.arabic}**:
لقد أنجزت هذا المقرر بالفعل وحصلت على تقدير **(${comp.grade})** (${GRADE_LABELS[comp.grade] || ""}).`;
      }
      const isPlan = studentContext?.plannedCourses?.includes(followUpCourse.code);
      if (isPlan) {
        return `ℹ️ مقرر **[${followUpCourse.code}] ${followUpCourse.arabic}** مضاف في خطتك للتسجيل، ولكن **لا يوجد تقدير مسجل له حتى الآن**.`;
      }
      return `️ مقرر **[${followUpCourse.code}] ${followUpCourse.arabic}** غير مسجل في خطتك أو سجلك الأكاديمي الحالي.`;
    }

    // Otherwise show details of the follow-up course
    return formatCourseResponse(followUpCourse, studentContext);
  }

  // 3. PERSONAL GPA QUERIES ("الـ GPA بتاعي كام؟", "معدلي كام؟", "أنا جايب كام؟")
  const isPersonalGpaQuery = matchesWords(norm, [
    "gpa بتاعي", "معدلي", "خاص بيا", "خاص بي", "بتاعي كام", "بتاعي", "خاصتي",
    "دلوقتي الخاص بيا", "كام دلوقتي", "جايب كام", "معدلي كام", "كم معدلي",
    "gpa الخاص بيا", "تقديري كام", "تقديري المباشر", "gpa بتاعي كام", "معدلي الحالي",
    "my gpa", "what is my gpa", "gpa beta3y"
  ]) || (norm.includes("كام") && (norm.includes("gpa") || norm.includes("معدل")));

  // Make sure it's not a semester query or what-if query
  const isSemesterGpa = matchesWords(norm, ["ترم", "فصل", "سنه", "سنة", "sem", "year"]);
  const isWhatIf = matchesWords(norm, ["لو جبت", "لو اخدت", "محتاج اجيب كام", "علشان اوصل", "what if"]);

  if (isPersonalGpaQuery && !isSemesterGpa && !isWhatIf) {
    const gpa = studentContext?.cumulativeGpa ?? 0;
    const completedCredits = studentContext?.completedCredits ?? 0;
    const remainingCredits = studentContext?.remainingCredits ?? (144 - completedCredits);
    const progress = studentContext?.graduationPercentage ?? Math.round((completedCredits / 144) * 100);
    const name = studentContext?.userName ? `يا **${studentContext.userName}**` : "";

    let gpaBadge = "ممتاز مرتفع ";
    if (gpa === 0) gpaBadge = "لم يتم احتساب درجات بعد";
    else if (gpa < 2.0) gpaBadge = "إنذار أكاديمي / بحاجة لرفع المعدل ️";
    else if (gpa < 2.5) gpaBadge = "مقبول ️";
    else if (gpa < 3.0) gpaBadge = "جيد ";
    else if (gpa < 3.6) gpaBadge = "جيد جداً ";

    return `###  المعدل التراكمي الفعلي الخاص بك (Actual Academic GPA)

أهلاً بك ${name}! بناءً على السجل الأكاديمي الفعلي لحسابك بالمنصة:

-  **المعدل التراكمي الحالي (Cumulative GPA)**: **${gpa > 0 ? gpa.toFixed(2) : "0.00"} / 4.00** (${gpaBadge})
- ⏱️ **الساعات المنجزة بنجاح**: **${completedCredits}** من أصل **144** ساعة معتمدة.
- 🎓 **نسبة الإنجاز للتخرج**: **${progress}%** (يتبقى لك **${remainingCredits}** ساعة معتمدة).

>  يمكنك استخدام ميزة محاكاة الـ What-If لمعرفة كيف سيرتفع معدلك إذا حصلت على تقديرات معينة الفصل القادم!`;
  }

  // 4. SEMESTER GPA ENGINE ("أنا جبت كام في الترم الأول سنة تانية؟")
  const semesterResponse = handleSemesterGpaQuery(norm, studentContext);
  if (semesterResponse) {
    return semesterResponse;
  }

  // 5. WHAT-IF GPA SIMULATOR ("لو جبت A في 3 مواد الـ GPA هيبقى كام؟")
  const whatIfResponse = handleWhatIfQuery(norm, studentContext);
  if (whatIfResponse) {
    return whatIfResponse;
  }

  // 6. SPECIFIC COURSE GRADE LOOKUP ("أنا جبت إيه في Data Structure؟", "تقديري في لوجيك ديزاين إيه؟")
  const isGradeInquiry = matchesWords(norm, [
    "جبت كام", "جبت ايه", "جبت إيه", "تقديري ايه", "تقديري إيه", "تقديري في", "تقديري ف",
    "درجتي في", "درجتي ف", "درجة مادة", "تقدير مادة", "عملت ايه في", "جايب كام في",
    "what did i get", "my grade in", "what grade did i get", "gebt kam"
  ]);

  if (isGradeInquiry) {
    const targetCourse = findMatchingCourse(query);
    if (targetCourse) {
      const completedRecord = studentContext?.completedCourses?.find((c) => c.code === targetCourse.code);
      const isPlanned = studentContext?.plannedCourses?.includes(targetCourse.code);

      if (completedRecord) {
        if (completedRecord.grade && completedRecord.grade.trim() !== "") {
          const gradeLabel = GRADE_LABELS[completedRecord.grade] || "";
          return `###  النتيجة الرسمية المسجلة لمقرر [${targetCourse.code}]
**${targetCourse.arabic} (${targetCourse.english})**

-  **التقدير المسجل لك**: **${completedRecord.grade}** (${gradeLabel})
- ⏱️ **عدد الساعات المعتمدة للمقرر**: **${targetCourse.credits} ساعات**
-  **الفترة الدراسية**: ${PERIODS[targetCourse.period] || targetCourse.period}

>  هذا التقدير معتمد ومحتسب ضمن معدلك التراكمي الحالي (${studentContext?.cumulativeGpa?.toFixed(2) || "0.00"}).`;
        } else {
          return `### ℹ️ حالة مقرر [${targetCourse.code}] ${targetCourse.arabic}

المادة مسجلة ومدرجة بالفعل في سجلك الأكاديمي، **ولكن لا يوجد تقدير مرصود لها حالياً** في قاعدة البيانات. يرجى مراجعة صفحة الخطة الدراسية لتحديث الدرجة فور إعلانها.`;
        }
      } else if (isPlanned) {
        return `###  حالة مقرر [${targetCourse.code}] ${targetCourse.arabic}

هذا المقرر مضاف حالياً إلى **مخطط التسجيل الخاص بك**، ولم يتم رصد درجات له بعد لأنك لم تجتزه في الفصول السابقة.`;
      } else {
        return `### ️ حالة مقرر [${targetCourse.code}] ${targetCourse.arabic}

وفقاً لسجلك الأكاديمي وقاعدة البيانات المتاحة، **هذا المقرر غير موجود ضمن المواد التي قمت بتسجيلها أو دراستها في حسابك حتى الآن**.`;
      }
    }
  }

  // 7. COMPLETED COURSES LIST
  if (matchesWords(norm, ["المواد اللي خلصتها", "المواد المنجزة", "كورساتي المكتملة", "انجزت ايه", "خلصت كام مادة", "موادي المكتملة", "المواد اللي نجحت فيها"])) {
    if (studentContext && studentContext.completedCourses && studentContext.completedCourses.length > 0) {
      const listText = studentContext.completedCourses.map((c) => {
        const info = COURSES.find((item) => item.code === c.code);
        const gradeText = c.grade ? `تقدير **(${c.grade})**` : "بدون تقدير مرصود";
        return `- **[${c.code}] ${info ? info.arabic : c.code}**: ${gradeText}`;
      }).join("\n");

      return `###  قائمة المقررات الدراسية المنجزة في حسابك

لقد قمت باجتياز **${studentContext.completedCourses.length}** مادة دراسية بنجاح:

${listText}

> 🎓 إجمالي الساعات المنجزة: **${studentContext.completedCredits} ساعة معتمدة**.`;
    } else {
      return `###  المقررات المنجزة بنجاح

لم تقم بتسجيل أي مواد منجزة بعد في حسابك. يمكنك الذهاب إلى صفحة **الخطة الدراسية والتقدم** واختيار المقررات التي اجتزتها ورصد تقديراتك لتحديث معدلك فوراً!`;
    }
  }

  // 8. PLANNED COURSES LIST
  if (matchesWords(norm, ["المواد المخططة", "المواد المسجلة", "جدولي المخطط", "خطتي القادمة"])) {
    if (studentContext && studentContext.plannedCourses && studentContext.plannedCourses.length > 0) {
      const listText = studentContext.plannedCourses.map((code) => {
        const info = COURSES.find((item) => item.code === code);
        return `- **[${code}] ${info ? info.arabic : code}** (${info ? info.credits : 3} ساعات)`;
      }).join("\n");

      return `###  قائمة المقررات المخططة للتسجيل القادم

لديك **${studentContext.plannedCourses.length}** مادة في مخطط التسجيل الخاص بك:

${listText}

>  يمكنك التوجه لصفحة **مخطط التسجيل الذكي** لتعديل جدولك ومعاينة العبء الدراسي المختار.`;
    } else {
      return `###  المقررات المخططة للتسجيل

لا توجد مواد مضافة لمخططك الحالي بعد. انتقل لصفحة **مخطط التسجيل الذكي** لاختيار المقررات التي تنوي تسجيلها الفصل القادم!`;
    }
  }

  // 9. REMAINING COURSES
  if (matchesWords(norm, ["فاضلي", "متبقي", "المتبقية", "ناقصلي", "المتبقي لي", "فاضل"])) {
    const completedCredits = studentContext?.completedCredits ?? 0;
    const remainingCredits = studentContext?.remainingCredits ?? (144 - completedCredits);

    return `###  المتبقي لك للتخرج

أنت الآن أتممت **${completedCredits}** ساعة معتمدة، ويتبقى لك **${remainingCredits}** ساعة للحصول على درجة البكالوريوس (من أصل 144 ساعة معتمدة).

> ️ لمعرفة المواد الدقيقة المتبقية لك في خطتك الأكاديمية والمقررات التي تفتحها، يرجى التوجه لصفحة **"الخطة الدراسية والتقدم"** حيث يتم فرز وعرض المواد المتبقية بشكل تفاعلي.`;
  }

  // 10. ROADMAP INTELLIGENCE ("خلصت Frontend أعمل إيه بعد كده؟", "نسبة إنجازي في الـ Frontend")
  const roadmapResponse = handleRoadmapQuery(norm, studentContext);
  if (roadmapResponse) {
    return roadmapResponse;
  }

  // 11. UNIVERSITY REGULATIONS (دليل الطالب)
  const regResponse = handleUniversityRegulations(norm);
  if (regResponse) {
    return regResponse;
  }

  // 12. COURSE PREREQUISITES & ELIGIBILITY ("اقدر اسجل data structures؟", "ليه مش قادر اسجل؟")
  if (matchesWords(norm, ["اقدر اسجل", "أقدر أسجل", "ينفع اسجل", "شروط تسجيل", "شروط مادة", "ليه مش قادر اسجل", "متطلبات مادة"])) {
    const courseMatch = findMatchingCourse(query);
    if (courseMatch) {
      if (courseMatch.prerequisites.length === 0) {
        return `###  شروط تسجيل [${courseMatch.code}] ${courseMatch.arabic}

هذا المقرر **لا يتطلب أي متطلب مسبق** (مادة مفتوحة بالفرقة الأولى/التخصص). يمكنك تسجيله مباشرة متى كان عبئك الدراسي يسمح بذلك.`;
      }

      const completedCodes = (studentContext?.completedCourses || []).map((c) => c.code);
      const missingPrereqs = courseMatch.prerequisites.filter((p) => !completedCodes.includes(p));

      if (missingPrereqs.length === 0) {
        return `###  الأهلية لتسجيل [${courseMatch.code}] ${courseMatch.arabic}

أنت **مستوفي لجميع المتطلبات المسبقة** لهذا المقرر:
- المتطلبات المسبقة: ${courseMatch.prerequisites.map((p) => `[${p}]`).join(", ")} (تم اجتيازها جميعاً بنجاح في حسابك).

>  يمكنك إضافة المقرر إلى **مخطط التسجيل الذكي** لتضمينه في جدول الفصل القادم.`;
      } else {
        const missingText = missingPrereqs.map((p) => {
          const pre = COURSES.find((item) => item.code === p);
          return `- **[${p}] ${pre ? pre.arabic : p}**`;
        }).join("\n");

        return `###  المتطلبات المسبقة غير مكتملة لمقرر [${courseMatch.code}] ${courseMatch.arabic}

وفقاً للائحة الكلية وسجلك الأكاديمي، **لا يمكنك تسجيل هذه المادة حالياً** لأنك لم تجتز المتطلب(ات) المسبقة التالية:

${missingText}

>  تنص لائحة الكلية على أنه لا يجوز للطالب تسجيل مقرر ما قبل النجاح في متطلبه السابق (إلا إذا كان تخرجه يتوقف على ذلك وبموافقة القسم وعميد الكلية).`;
      }
    }
  }

  // 13. DIRECT COURSE MATCH (General Info Card)
  const directCourse = findMatchingCourse(query);
  if (directCourse) {
    return formatCourseResponse(directCourse, studentContext);
  }

  // 14. GENERAL TECH TOPICS
  const techResponse = handleTechQuery(norm, query);
  if (techResponse) {
    return techResponse;
  }

  // 15. INTELLIGENT FACTUAL FALLBACK (Zero Hallucination)
  const userName = studentContext?.userName ? `يا **${studentContext.userName}**` : "";
  return `###  أهلاً بك ${userName}! أنا مرشدك الأكاديمي والتقني الموثوق

لقد استلمت استفسارك: **"${query}"**.

أنا مرتبط مباشرة ببيانات حسابك المسجلة بالمنصة وبلائحة الكلية الرسمية (**دليل الطالب**)، ويمكنك سؤالي عن:

-  **بياناتك وتقديراتك الفعلية**: *"الـ GPA بتاعي كام؟"* أو *"جبت كام في الداتا ستراكشر؟"*
-  **حساب الـ GPA الفصلي بدقة**: *"الترم الأول سنة تانية جبت كام؟"*
-  **محاكاة الـ What-If التنبؤية**: *"لو جبت A في 3 مواد معدلي هيبقى كام؟"*
- ️ **مسارات التعلم والخطوات القادمة**: *"خلصت Frontend أعمل إيه بعد كده؟"*
-  **لوائح الجامعة المعتمدة**: *"ما هي شروط الإنذار الأكاديمي؟"* أو *"الحد الأقصى للساعات للتسجيل؟"*
-  **شروط المقررات والأهلية**: *"أقدر أسجل شبكات الحاسب؟"*

يرجى توضيح استفسارك إذا كنت تقصد مادة محددة أو موضوعاً أكاديمياً وسأجيبك بدقة تامة!`;
}

/**
 * General Computer Science and Technology Q&A
 */
function handleTechQuery(norm: string, rawQuery: string): string | null {
  if (matchesWords(norm, ["frontend", "واجهات", "فرونت"])) {
    return `###  مجال تطوير واجهات الويب (Frontend Development)

تطوير الواجهات هو التخصص المسؤول عن بناء الجزء البصري التفاعلي الذي يشاهده المستخدم في المتصفح.

- ️ **التقنيات الأساسية**: HTML5, CSS3, JavaScript (ES6+), React.js, Next.js, Tailwind CSS.
- 🎓 **المواد الأكاديمية المرتبطة بجامعة سيناء**:
  - \`INT 341\` (تكنولوجيا الويب)
  - \`CSW 337\` (برمجة واجهة المستخدم)
  - \`INT 343\` (تصميم وتنفيذ مواقع الويب)
-  **نصيحة البدء**: ابدأ بإتقان أساسيات JavaScript وتطبيق مشاريع عملية بسيطة قبل الانتقال لأطر العمل مثل React. يمكنك متابعة مسار الـ Frontend بالمنصة لمعاينة تقدمك خطوة بخطوة!`;
  }

  if (matchesWords(norm, ["backend", "خوادم", "باك ان", "باكاند"])) {
    return `### ️ مجال تطوير الأنظمة الخلفية وقواعد البيانات (Backend Development)

تطوير الخوادم هو التخصص المسؤول عن منطق البرمجة (Business Logic)، أمان البيانات، وبناء الـ RESTful APIs ومعالجة قواعد البيانات.

- ️ **التقنيات الأساسية**: Node.js (Express), Python (Django/FastAPI), Java (Spring Boot), PostgreSQL, MongoDB.
- 🎓 **المواد الأكاديمية المرتبطة**:
  - \`ISD 242\` (نظم قواعد البيانات)
  - \`CSW 221\` (هياكل البيانات)
  - \`CSW 234\` (برمجة الحاسب 2 - جافا)
-  **نصيحة البدء**: افهم جيداً كيفية تصميم الجداول العلاقاتية (Relational Databases) وكتابة استعلامات SQL الفعالة، ثم انتقل لبناء أول API خاص بك.`;
  }

  if (matchesWords(norm, ["ذكاء اصطناعي", "ai", "machine learning", "تعلم الالة", "data science"])) {
    return `###  مجال الذكاء الاصطناعي وعلم البيانات (AI & Data Science)

يهدف هذا المجال لبناء نماذج برمجية ذكية قادرة على التعلم من البيانات والتنبؤ والتعرف على الأنماط والصور.

- ️ **التقنيات الأساسية**: Python, NumPy, Pandas, Scikit-Learn, PyTorch, TensorFlow.
- 🎓 **المواد الأكاديمية المرتبطة**:
  - \`Ma 110\` (الجبر الخطي)
  - \`St 120\` (الاحتمالات والإحصاء)
  - \`CSW 351\` (الذكاء الاصطناعي)
  - \`INT 423\` (معالجة الصور الرقمية)
-  **نصيحة البدء**: تعمق في الجبر الخطي والاحتمالات، حيث أنها الأساس الرياضي لكل خوارزميات التعلم الآلي.`;
  }

  return null;
}
