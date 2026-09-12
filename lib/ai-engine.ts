import { COURSES, PERIODS, Course } from "@/lib/courses-data";
import { CustomSemesterData } from "@/lib/academic-calendar";
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
  faqs?: Array<{ question: string; answer: string; category: string }>;
  customSemesters?: CustomSemesterData[];
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
    "نظم التشغيل", "نظم تشغيل 1", "نظم التشغيل 1", "اوبريتنج", "اوبريتنج سيستم", "اوبريتنج 1", "او اس 1", "او اس",
    "operating systems", "operating system", "operating system 1", "os", "os1", "csw242"
  ],
  "CSW 323": [
    "نظم تشغيل 2", "نظم التشغيل 2", "اوبريتنج 2", "اوبريتنج سيستم 2", "او اس 2",
    "operating systems 2", "operating system 2", "os2", "csw323"
  ],
  "INT 232": [
    "شبكات", "شبكات الحاسب", "شبكات حاسب", "شبكات حاسوب", "شبكات كمبيوتر", "شبكات كومبيوتر", "شبكات 1",
    "نتورك", "نت ورك", "نيتورك", "نيت ورك", "نيتوورك", "نتوورك",
    "كومبيوتر نيتورك", "كمبيوتر نيتورك", "كومبيوتر نتورك", "كمبيوتر نتورك", "كمبيوتر نتوورك", "كومبيوتر نتوورك",
    "computer networks", "computer network", "network", "networks", "networking", "comp network", "int232"
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
    "عمارة الحاسب", "معمارية الحاسب", "كمبيوتر اركتيكتشر", "كومبيوتر اركتيكتشر", "كمبيوتر اركيتكتشر", "كومبيوتر اركيتكتشر", "اركيتكتشر", "اركتكتشر", "اركتكشر", "كمبيوتر ارك", "كومبيوتر ارك",
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
    "مقدمة في تكنولوجيا الحاسب والإنترنت", "مقدمة حاسب", "تكنولوجيا الحاسب والانترنت", "انترو كمبيوتر", "انترو كومبيوتر", "كمبيوتر تكنولوجي", "كومبيوتر تكنولوجي",
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
    "الوسائط المتعددة الشبكية", "وسائط شبكية", "نتورك مالتي ميديا", "نيتورك مالتي ميديا", "network based multimedia", "int338"
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
    "تشغيل وإدارة الشبكات", "ادارة شبكات", "تشغيل شبكات", "نتورك اوبريشنز", "نيتورك اوبريشنز", "network operations", "network operations & administration", "int434"
  ],
  "INT 435": [
    "أمن المعلومات والشبكات", "امن شبكات", "امن معلومات", "سيكيورتي", "نتورك سيكيورتي", "نيتورك سيكيورتي", "information & networks security", "network security", "int435"
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

  // 3. Alias Dictionary Match (Highest Accuracy for Arabic, Arabizi, and typos - Longest match wins)
  let bestAliasMatch: { course: Course; aliasLength: number } | null = null;
  const queryWords = normQuery.split(/\s+/);

  for (const [code, aliases] of Object.entries(COURSE_ALIASES)) {
    for (const alias of aliases) {
      const normAlias = normalizeText(alias);
      let matched = false;
      if (normAlias.length <= 3) {
        // Short aliases (e.g. "ds", "os", "ai", "db") MUST match as distinct words
        if (queryWords.includes(normAlias)) {
          matched = true;
        }
      } else {
        if (normQuery.includes(normAlias)) {
          matched = true;
        }
      }

      if (matched) {
        const found = COURSES.find((c) => c.code === code);
        if (found) {
          if (!bestAliasMatch || normAlias.length > bestAliasMatch.aliasLength) {
            bestAliasMatch = { course: found, aliasLength: normAlias.length };
          }
        }
      }
    }
  }

  if (bestAliasMatch) {
    return bestAliasMatch.course;
  }

  // 4. Tokenized Partial Matching (Excluding common conversational stop words)
  const stopWords = [
    "انا", "اي", "ايه", "كيف", "هل", "عايز", "عايزه", "عايزها", "اريد", "متي", "مادة", "ماده", "مواد",
    "كورسات", "كورس", "مقرر", "مقررات", "فاضلي", "بتاعي", "خاصتي", "كام", "دلوقتي",
    "عن", "من", "في", "علي", "الي", "يا", "لو", "جبت", "كنت", "جايب", "تقديري",
    "درجتي", "درجة", "تقدير", "كام", "فيه", "فيها", "ليه", "مش", "قادر", "اسجل", "تسجيل",
    "سجلت", "ما", "هو", "هي", "شروط", "متطلب", "متطلبات", "سنة", "ترم", "فصل", "اول", "تاني",
    "كلية", "كليه", "جامعة", "جامعه", "سيناء", "سينا", "برنامج", "قسم", "طالب",
    "دراسة", "دراسه", "امتحان", "امتحانات", "اختبار", "اختبارات", "حمام", "سباحة",
    "سباحه", "اولمبي", "اولمبيه", "مستشفى", "ملعب", "سكن", "مدينة", "مصاريف", "باص",
    "مواصلات", "كان", "عندي", "عندك", "توقع", "توقعات", "شات", "مساعد", "xyz", "abc", "words", "random",
    "علشان", "عشان", "محتاج", "محتاجه", "اخلص", "اخلصه", "اخلصها", "اخد", "اخذ", "اخده", "اكون", "لازم",
    "حاجه", "حاجة", "قبلها", "قبله", "قبليه", "بعدها", "بعده", "ينفع", "ممكن", "اعرف", "تقولي", "قلي",
    "اقولك", "تفتح", "بتفتح", "فاتحة", "فاتحه", "اسجلها", "اسجله", "تسجيلها", "تسجيله"
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
      studentStatusNotice = `\n\n> ℹ **حالتك الشخصية في هذه المادة**: لم تقم بتسجيل أو اجتياز هذا المقرر بعد في سجلك الأكاديمي.`;
    }
  }

  return `###  [${c.code}] ${c.arabic} (${c.english})

- ⏱ **عدد الساعات المعتمدة**: **${c.credits} ساعات**
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
  if (semesterGpa < 2.0) gpaBadge = "إنذار أكاديمي / بحاجة للتحسين ";
  else if (semesterGpa < 2.5) gpaBadge = "مقبول ";
  else if (semesterGpa < 3.0) gpaBadge = "جيد ";
  else if (semesterGpa < 3.6) gpaBadge = "جيد جداً ";

  let missingNote = "";
  if (missingGradeCourses.length > 0) {
    missingNote += `\n\n>  **ملاحظة**: توجد مواد مسجلة ولكن بدون رصد تقدير: ${missingGradeCourses.map((c) => c.code).join(", ")}.`;
  }
  if (uncompletedCourses.length > 0) {
    missingNote += `\n\n> ℹ **مواد متبقية في هذا الفصل**: ${uncompletedCourses.map((c) => `[${c.code}] ${c.arabic}`).join(", ")}.`;
  }

  return `###  المعدل الفصلي الحسابي الدقيق (Semester GPA)
####  **${periodTitle}**

لقد قمت بحساب الـ GPA الفصلي الخاص بك بناءً على المقررات المنجزة والمرصودة فعلياً في حسابك:

${courseBreakdown}

-  **المعدل الفصلي لهذا الترم (Semester GPA)**: **${semesterGpa.toFixed(2)} / 4.00** (${gpaBadge})
- ⏱ **إجمالي الساعات المحسوبة**: **${totalCredits}** ساعة معتمدة.
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
-  **النتيجة**: لا يمكن الوصول إلى معدل **${targetGpa.toFixed(2)}** في فصل دراسي واحد فقط، لأنك ستحتاج إلى معدل فصلي قدره **${requiredSemesterGpa.toFixed(2)}** (والحد الأقصى للنظام هو 4.00).
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
- ⏱ **العبء المفترض**: **${assumedNextSemesterCredits} ساعة** (5 مواد تقريباً).
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
  // 1. Comparison between Frontend and Backend ("ما الفرق بين مسار Frontend ومسار Backend وكيف أبدأ؟")
  const isComparison = 
    (matchesWords(norm, ["الفرق بين", "مقارنة", "ايه الفرق", "اختار"]) && 
     matchesWords(norm, ["frontend", "فرونت", "واجهات"]) && 
     matchesWords(norm, ["backend", "باك", "خلفية", "خوادم"])) ||
    matchesWords(norm, ["الفرق بين مسار frontend ومسار backend", "الفرق بين الفرونت والباك", "فرونت ولا باك", "frontend ولا backend"]);

  if (isComparison) {
    return `### ⚖️ مقارنة شاملة: مسار Frontend مقابل مسار Backend وكيف تبدأ؟

#### 🎨 1. تطوير واجهات المستخدم (Frontend Development):
- **ما هو؟**: بناء وتطوير كل ما يراه المستخدم ويتفاعل معه مباشرة في المتصفح أو التطبيق (الأزرار، القوائم، النماذج، الرسوم المتحركة، والتصميم المتجاوب مع الهواتف).
- **التقنيات الأساسية**: HTML5, CSS3, JavaScript (ES6+), React.js, Next.js, Tailwind CSS.
- **المقررات الجامعية المرتبطة في كليتنا**:
  - \`CSW 110\` (مقدمة في تكنولوجيا الحاسب والإنترنت)
  - \`INT 341\` (تكنولوجيا الويب)
  - \`CSW 337\` (برمجة واجهة المستخدم)
  - \`INT 343\` (تصميم وتنفيذ مواقع الويب)
- **يناسبك إذا**: كنت تحب التصميم، الإبداع البصري، وتجربة المستخدم (UI/UX)، وتفضل رؤية نتائج أسطر كودك فوراً على الشاشة.

---

#### ⚙️ 2. تطوير الأنظمة الخلفية وقواعد البيانات (Backend Development):
- **ما هو؟**: بناء "عقل ومحرك" النظام خلف الكواليس؛ منطق الأعمال (Business Logic)، الأمان، بناء الـ APIs، والاتصال بقواعد البيانات والسيرفرات ومعالجة البيانات الضخمة.
- **التقنيات الأساسية**: Node.js / Express, Python (FastAPI / Django), Java (Spring Boot), PostgreSQL, MongoDB, Docker.
- **المقررات الجامعية المرتبطة في كليتنا**:
  - \`CSW 234\` (برمجة الحاسب 2 - جافا)
  - \`CSW 221\` (هياكل البيانات)
  - \`ISD 242\` (نظم قواعد البيانات)
  - \`INT 232\` (شبكات الحاسب)
- **يناسبك إذا**: كنت تعشق حل المشكلات المعقدة، الخوارزميات، أمان البيانات، وتصميم هياكل السيرفرات وقواعد البيانات المستقرة.

---

#### 🚀 كيف تبدأ وتختار بينهما؟
1. **ابدأ بالـ Frontend أولاً**: يُنصح دائماً بالبدء بأساسيات الويب (HTML, CSS, JavaScript) لأنها تمنحك فهماً سريعاً لكيفية عمل الإنترنت وتمنحك ثقة عملية فورية.
2. **ثم انتقل للـ Backend**: بعد إتقان JavaScript و React، يمكنك تعلم Node.js وقواعد البيانات لتصبح مهندس برمجيات شاملاً (**Full-Stack Developer**)، وهو المسار الأكثر طلباً وتميزاً في سوق العمل!

> 💡 يمكنك تصفح الخرائط التفاعلية التفصيلية لكل مسار من صفحة **"مسارات التعلم (Roadmaps)"** وتتبع تقدمك العملي فيها!`;
  }

  // 2. Next Steps After React / Advanced Frontend ("انا ذاكرت فرونتاند ب React اخش في ايه دلوقتي؟")
  const isAfterReactQuery = 
    (matchesWords(norm, ["ذاكرت", "خلصت", "اتعلمت", "عارف", "بعد"]) && 
     matchesWords(norm, ["react", "رياكت"])) ||
    (matchesWords(norm, ["بعد الفرونت", "بعد فرونت", "خلصت فرونت", "خلصت frontend", "ذاكرت frontend", "ذاكرت فرونتاند"]) && 
     matchesWords(norm, ["اخش في ايه", "اخش على ايه", "اعمل ايه", "ايه بعد", "اكمل في ايه", "دلوقتي"]));

  if (isAfterReactQuery) {
    return `### 🚀 خارطة طريق المرحلة القادمة بعد إتقان React.js

ما شاء الله يا بطل! وصولك لمرحلة بناء الواجهات باستخدام **React.js** يعتبر إنجازاً ممتازاً ويضعك في فئة المطورين المتقدمين. إليك الخطوات المدروسة للانتقال لمستوى الاحتراف وسوق العمل:

---

#### 1️⃣ الخطوة الأولى: الاحتراف مع Next.js (الأهم لسوق العمل)
- **الهدف**: الانتقال من تطبيقات الصفحة الواحدة (SPA) إلى تطبيقات الويب المتكاملة مع **App Router** و **Server Components (RSC)**.
- **ما ستتعلمه**: الـ SSR (Server-Side Rendering)، تحسين محركات البحث (SEO)، والـ Server Actions وبناء Full-Stack APIs داخل نفس المشروع.
- **المقررات المرتبطة بالكلية**: \`INT 341\` (تكنولوجيا الويب) و \`CSW 337\` (برمجة واجهة المستخدم).

#### 2️⃣ الخطوة الثانية: إدارة الحالة والبيانات المتقدمة (State Management & Caching)
- أتقن **TanStack Query (React Query)** لإدارة الكاش وتدفق البيانات من الـ APIs باحترافية وسلاسة.
- تعلم **Zustand** كبديل عصري وخفيف للـ Redux لإدارة الحالة العامة للتطبيق.

#### 3️⃣ الخطوة الثالثة: كتابة كود موثوق بالـ TypeScript
- تحويل مشاريعك لكتابة آمنة من الأخطاء باستخدام **TypeScript**، حيث تطلبه معظم الشركات البرمجية كشرط إلزامي لأي مطور واجهات.

#### 4️⃣ الخطوة الرابعة: الانطلاق نحو الـ Full-Stack (الباك إند)
- تعلم بناء الـ REST APIs باستخدام **Node.js & Express** أو **NestJS**.
- التعامل مع قواعد البيانات الحديثة مثل **PostgreSQL** باستخدام **Prisma ORM** أو **Supabase**.

#### 5️⃣ الخطوة الخامسة: بناء مشاريع حقيقية متكاملة (Production-Ready Apps)
- لا تكتفِ بالمشاريع البسيطة! ابنِ مشروعاً حقيقياً متكاملاً يشمل:
  - نظام تسجيل دخول وحماية كامل (Authentication مع NextAuth / Supabase).
  - بوابة دفع إلكتروني (Stripe / Paymob).
  - لوحة تحكم تفاعلية مع رسوم بيانية (Recharts / Chart.js).

> 💡 **نصيحة ذهبية**: احرص على رفع مشاريعك على GitHub مع ملف توثيق (README) جذاب وعرض حي (Live Demo) على Vercel لتبهر أصحاب الأعمال ومسؤولي التوظيف!`;
  }

  // 3. General Roadmap Progress Query
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
- ⏱ **المدة الزمنية المقترحة**: **${nextNode.duration}**
-  **الهدف من هذه الخطوة**: ${nextNode.description}${relatedCoursesText}

>  يمكنك التوجه لصفحة **مسارات خارطة الطريق (Roadmaps)** لتحديث تقدمك ومشاهدة مصادر التعلم وروابط الدورات المعتمدة لهذه المرحلة!`;
  } else {
    statusText = `لديك نسبة تقدم **${percentage}%** في مسار **${roadmap.title}**.`;
  }

  return `###  مسار التعلم الأكاديمي والمهني: ${roadmap.title}

${statusText}`;
}

/**
 * Official University Regulations Reference (Based 100% on دليل_الطالب.md)
 */
export function handleUniversityRegulations(norm: string, studentContext?: StudentContext): string | null {
  // 1. Credit Hours / Academic Load (العبء الدراسي)
  if (matchesWords(norm, ["العبء الدراسي", "عبء", "ساعات التسجيل", "الحد الاقصي للساعات", "الحد الادني للساعات", "كم ساعه اسجل", "كم ساعة اسجل", "اقصي ساعات", "اقل ساعات"])) {
    return `###  لائحة العبء الدراسي والساعات المعتمدة (وفقاً لدليل الطالب - صفحة 14)

وفقاً للائحة الرسمية لجامعة سيناء:
- **الحد الأدنى للتسجيل بالفصل الدراسي**: **12 ساعة معتمدة** (ويجوز تخفيضه لـ 9 ساعات لعذر مقبول بموافقة المرشد وعميد الكلية).
- **الحد الأقصى للتسجيل بالفصل الدراسي**: **21 ساعة معتمدة** (يشترط معدل تراكمي $\ge$ 3.00 أو أن يتوقف تخرجه على ذلك).
- **العبء الاعتيادي للجامعة**: **18 ساعة معتمدة** في الفصلين الأول والثاني.
- **الفصل الدراسي الصيفي**: الحد الأقصى **9 ساعات معتمدة**، ويسمح للطالب الخريج بتسجيل **12 ساعة معتمدة**.`;
  }

  // 0. Admin FAQs Matching (Dynamic Admin Knowledge Base)
  if (studentContext?.faqs && studentContext.faqs.length > 0) {
    const matchedFaq = studentContext.faqs.find((f) => {
      const qNorm = normalizeText(f.question);
      const tokens = norm.split(/\s+/).filter((t) => t.length > 2);
      if (tokens.length === 0) return false;
      const matchCount = tokens.filter((t) => qNorm.includes(t)).length;
      return matchCount >= Math.min(2, tokens.length) || qNorm.includes(norm) || norm.includes(qNorm);
    });

    if (matchedFaq) {
      return `### 📌 الإجابة الرسمية المعتمدة من إدارة الكلية

> **السؤال**: ${matchedFaq.question}

${matchedFaq.answer}

---
*💡 تم استخراج هذه الإجابة مباشرة من دليل اللوائح والأسئلة الشائعة المعين من قبل إدارة المنصة.*`;
    }
  }

  // 2. Academic Warning & Probation (الإنذار الأكاديمي والفصل)
  if (matchesWords(norm, ["انذار اكاديمي", "الانذار الاكاديمي", "انذار", "بروبيشن", "probation", "فصل من الكلية", "متي افصل", "متى افصل", "شروط الانذار", "فصل اكاديمي"])) {
    return `### ⚠️ ضوابط الإنذار الأكاديمي والفصل (وفقاً لدليل الطالب - صفحة 16 و 17)

حسب المادة الرسمية بلائحة جامعة سيناء:
1. **شروط الإنذار**: يوضع الطالب تحت الإنذار الأكاديمي إذا انخفض معدله التراكمي (GPA) عن **2.00 / 4.00**.
2. **مهلة تعديل الوضع**: يُعطى الطالب فرصة **فصلين دراسيين** (ليس منهما الفصل الصيفي) لرفع معدله التراكمي إلى 2.00 أو أكثر.
3. **الفصل الأكاديمي**: يُفصل الطالب من الكلية إذا استمر معدله التراكمي أقل من 2.00 لمدة **أربعة فصول دراسية متتالية**، ويجوز لمجلس الكلية منح فرصة استثنائية أخيرة بعذر مقبول.
- ملاحظة هامة: الحد الأقصى لساعات التسجيل للطالب المنذر هو 12 ساعة فقط لتخفيف العبء.`;
  }

  // 2.5 Summer Term (الترم الصيفي)
  if (matchesWords(norm, ["ترم صيفي", "الترم الصيفي", "صيفي", "سمر كورس", "summer course", "سمر", "السمر"])) {
    return `### ☀️ نظام الفصل الدراسي الصيفي (Summer Semester)

الفصل الصيفي هو فصل دراسي مكثف واستثنائي:
- **الحد الأقصى للتسجيل**: **9 ساعات معتمدة** للطلاب العاديين، ويجوز رفعها إلى **12 ساعة معتمدة** للطلاب المتوقع تخرجهم في هذا الفصل فقط.
- **طبيعة الفصل**: مدته أقصر ومكثف مقارنة بالفصلين الأساسيين، ولا يُحتسب كفصل دراسي أساسي في مدد الإنذار الأكاديمي.
- **الغياب**: تنطبق عليه نفس نسبة الحرمان (25% من المحاضرات).`;
  }

  // 2.6 Medical Excuses (الأعذار الطبية)
  if (matchesWords(norm, ["عذر طبي", "تأجيل امتحان", "اجل امتحان", "لو تعبت", "مرض", "شهادة طبية", "اعذار", "عذر"])) {
    return `### 🩺 نظام الأعذار الطبية وتأجيل الامتحانات

في حالة المرض الشديد أو الظروف القاهرة:
- يجب تقديم **الشهادة الطبية المعتمدة** أو طلب العذر إلى إدارة الشئون الطبية أو عميد الكلية خلال **3 أيام** كحد أقصى من تاريخ الامتحان.
- لا يتم قبول الشهادات الطبية من عيادات خاصة غير معتمدة.
- في حالة قبول العذر لامتحان النهائي، تُرصد للطالب نتيجة "غير مكتمل" (Incomplete - I) ويمتحن في أول موعد متاح دون الرسوب بالمادة.
- بالنسبة للميدتيرم، يُرجع لقرار الدكتور المنسق للمادة إما بعقد امتحان تعويضي (Make-up) أو إعادة توزيع الدرجات.`;
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
    return `### 🎓 شروط ومتطلبات التخرج للبكالوريوس (وفقاً لدليل الطالب ولائحة الكلية)

للحصول على درجة البكالوريوس في تكنولوجيا المعلومات وعلوم الحاسب بجامعة سيناء:
1. **إتمام 144 ساعة معتمدة بنجاح** موزعة كالتالي:
   - **12 ساعة** متطلبات جامعة.
   - **72 ساعة** متطلبات كلية (66 إجبارية + 6 اختيارية).
   - **60 ساعة** متطلبات تخصص (45 إجبارية + 15 اختيارية).
2. تحقيق معدل تراكمي إجمالي (GPA) لا يقل عن **2.00 / 4.00**.
3. اجتياز دورة **التربية العسكرية** بنجاح (للطلاب الذكور).
4. اجتياز مشروعي التخرج (1 و 2) بنجاح.`;
  }

  // 5.5 Early Graduation / 3-Year Degree ("لو عاوز اتخرج في 3 سنين صعبه ولا ممكن؟", "التخرج المبكر")
  if (matchesWords(norm, [
    "3 سنين", "تلات سنين", "ثلاث سنين", "3 سنوات", "ثلاث سنوات", "تخرج مبكر", "التخرج المبكر",
    "اتخرج بدري", "اتخرج في اقل", "اتخرج في أقل", "انهاء الدراسة بدري"
  ]) || (matchesWords(norm, ["تخرج", "اتخرج", "اخلص"]) && matchesWords(norm, ["3 سنين", "3 سنوات", "تلات سنين", "ثلاث سنين", "بدري", "مبكر"]))) {
    return `### 🎓 التخرج المبكر في 3 سنوات (نظام الساعات المعتمدة بجامعة سيناء)

#### ❓ هل التخرج في 3 سنوات ممكن لائحياً؟
**نعم، ممكن نظرياً ولائحياً بنسبة 100%!** 👍
وفقاً للائحة نظام الساعات المعتمدة بالكلية (صفحة 14 و 18)، يحصل الطالب على درجة البكالوريوس بمجرد إتمام **144 ساعة معتمدة** بنجاح واستيفاء شروط التخرج، دون اشتراط قضاء 4 سنوات كاملة.

---

#### 🧮 الحسبة الأكاديمية للتخرج في 3 سنوات (6 فصول أساسية + فصول صيفية):
لإتمام 144 ساعة خلال 3 سنوات دراسية، ستحتاج للتوزيع التالي:
- **6 فصول دراسية اعتيادية**: تسجيل الحد الأقصى **21 ساعة معتمدة** في كل فصل = **126 ساعة معتمدة**.
- **فصلان صيفيان (Summer)**: تسجيل الحد الأقصى **9 ساعات معتمدة** في صيفين = **18 ساعة معتمدة**.
- **المجموع الإجمالي**: 126 + 18 = **144 ساعة معتمدة** (التخرج الكامل!).

---

#### ⚠️ هل الأمر "صعب" وما هي الشروط والتحديات الواقعية؟
**نعم، هو مسار يتطلب جهداً استثنائياً والتزاماً صارماً للأسباب التالية:**
1. **شرط الـ GPA المرتفع**: لكي يسمح لك المرشد الأكاديمي وعميد الكلية بتسجيل الحد الأقصى (21 ساعة في الترم)، **يشترط ألا يقل معدلك التراكمي عن 3.00 (جيد جداً مرتفع)**.
2. **سلسلة المتطلبات المسبقة (Prerequisites)**: مواد الحاسبات والبرمجيات مبنية كتسلسل هرمي (مثلاً: برمجة 1 ⬅️ برمجة 2 ⬅️ هياكل بيانات ⬅️ خوارزميات وذكاء اصطناعي)، لذا أي رسوب أو تعثر في مادة واحدة سيعطل فتح المواد اللاحقة.
3. **توفر المواد في الصيفي**: الكلية تطرح في الفصل الصيفي مواد محددة بناءً على رغبات الطلاب المسجلين، وقد لا تتوفر كل المواد التخصصية المتقدمة التي تحتاجها في الصيف.
4. **مشروع التخرج**: يشترط لتسجيل مشروع تخرج (1) إتمام 95-100 ساعة معتمدة بنجاح، والمشروع ينقسم لترمين منفصلين (ترم 1 وترم 2) لا يمكن دمجهما في ترم واحد أو في الصيفي.

---

#### 💡 البديل الأفضل والأكثر واقعية: "التخرج في 3 سنوات ونصف (3.5 سنوات)"
أكثر من 90% من الطلاب المتميزين الراغبين في التخرج المبكر يختارون التخرج في **3 سنوات ونصف (7 فصول أساسية + صيفي)**؛ حيث يمنحك عبئاً متزناً (18-19 ساعة بالترم) مع فرصة حقيقية للحفاظ على معدل امتياز (مرتبة الشرف) وتطبيق مشاريع عملية قوية لسوق العمل.`;
  }

  // 6. Graduation Project (مشروع التخرج)
  if (matchesWords(norm, ["مشروع التخرج", "تسجيل مشروع التخرج", "مشروع 1", "مشروع تخرج"])) {
    return `### 💡 ضوابط مشروع التخرج (وفقاً لدليل الطالب - صفحة 20)

- **شرط تسجيل مشروع التخرج**: يشترط أن يكون الطالب قد اجتاز بنجاح **95 ساعة معتمدة** على الأقل، ويكون مسجلاً في السنة الدراسية الرابعة.
- **نظام المشروع**: مشروع التخرج ينقسم لفصلين دراسيين (مشروع 1 في ترم 7، ومشروع 2 في ترم 8).
- **تقييم المشروع**: 40% على أساس المقررات الدراسية و 60% على أساس مناقشة وتقرير وعرض المشروع النهائي أمام لجنة تحكيم تضم محكماً خارجياً.`;
  }

  // 7. Honors List & Degrees (قائمة الشرف ومرتبة الشرف)
  if (matchesWords(norm, ["مرتبة الشرف", "قائمة الشرف", "الشرف الاولي", "الشرف الاولى", "شرف"])) {
    return `### 🏅 قواعد قائمة ومرتبة الشرف (وفقاً لدليل الطالب - صفحة 17 و 20)

- **قائمة شرف عميد الكلية (Honor List)**: يوضع فيها اسم الطالب بالفصل الدراسي إذا حقق معدلاً تراكمياً/فصلياً لا يقل عن **3.30 (جيد جداً)** مع تسجيل الحد الأقصى للعبء الدراسي ودون رسوب في أي مقرر.
- **مرتبة الشرف الأولى عند التخرج**: تمنح للطالب الذي يتخرج بمعدل تراكمي عام لا يقل عن **3.80 / 4.00** بشرط ألا يكون قد رسب في أي مقرر درسه طوال سنوات دراسته.
- **مرتبة الشرف الثانية عند التخرج**: تمنح للطالب الحاصل على معدل تراكمي عام بين **3.40 و 3.80** دون رسوب في أي مقرر.`;
  }

  // 7.5 Transfer & Specialization (التخصص والأقسام العلمية)
  if (matchesWords(norm, ["تخصص", "ادخل قسم ايه", "اتخصص", "الفرق بين الاقسام", "اقسام الكلية", "تكنولوجيا معلومات", "علوم حاسب", "نظم معلومات", "التخصصات", "التشعيب"])) {
    return `### 🏛️ التخصص الأكاديمي وأقسام الكلية

كلية تكنولوجيا المعلومات وعلوم الحاسب بجامعة سيناء تمنح البكالوريوس في 3 تخصصات دقيقة:
1. **علوم الحاسب (Computer Science - CS)**: يركز على الخوارزميات المتقدمة، الذكاء الاصطناعي، برمجة النظم ومعمارية الحواسيب.
2. **تكنولوجيا المعلومات (Information Technology - IT)**: يركز على الشبكات العريضة، إدارة السيرفرات، الوسائط المتعددة، وتطوير مواقع الويب والأمان.
3. **نظم المعلومات (Information Systems - IS)**: يركز على تحليل النظم التجارية، قواعد البيانات المتقدمة، والتكامل بين إدارة الأعمال والبرمجيات.

- **موعد التخصص**: يبدأ التخصص وتحديد القسم بدءاً من المستوى الثالث (الفرقة الثالثة) بناءً على رغبة الطالب والمعدل الأكاديمي.
- **للمزيد**: يمكنك تصفح قسم "التخصصات والأقسام" في المنصة لعرض فرص عمل كل قسم.`;
  }

  // 8. Grading System & Scale (سلم التقديرات وحساب الدرجات)
  if (matchesWords(norm, ["سلم التقديرات", "توزيع الدرجات", "نظام التقويم", "درجة النجاح", "اعمال السنة", "التقدير من كام", "نجاح من كام", "a+ من كام", "الميدتيرم", "الفاينال"])) {
    return `### 📊 نظام التقويم وسلّم الدرجات

- **توزيع درجات المقرر**: 40% أعمال فصلية (ميدتيرم، كويزات، مشاريع، عملي) + 60% اختبار نهائي (أو 50% تحريري + 10% عملي).
- **الحد الأدنى للنجاح**: الحصول على 50% من الدرجة الإجمالية للمقرر.

- **سلم التقديرات المعتمد (الـ GPA)**:
  - **A+** (4.00) | 90% فأكثر (ممتاز مرتفع)
  - **A** (3.80) | 90% - أقل من 95% (ممتاز)
  - **A-** (3.60) | 85% - أقل من 90% (ممتاز منخفض)
  - **B+** (3.30) | 80% - أقل من 85% (جيد جداً مرتفع)
  - **B** (3.00) | 75% - أقل من 80% (جيد جداً)
  - **C+** (2.70) | 70% - أقل من 75% (جيد مرتفع)
  - **C** (2.40) | 65% - أقل من 70% (جيد)
  - **D+ / D** (2.00) | 60% - أقل من 65% (مقبول - الحد الأدنى للنجاح)
  - **F** (0.00) | أقل من 60% (راسب)`;
  }

  // 9. General University Facilities & Life (Military, Transport, Training)
  if (matchesWords(norm, ["تربية عسكرية", "عسكرية", "التربية العسكرية"])) {
    return `### 🪖 دورة التربية العسكرية

التربية العسكرية شرط إلزامي لتخرج جميع الطلاب الذكور من الجامعات المصرية.
- **موعدها**: يمكن للطالب حضور الدورة في أي فترة (نصف العام أو آخر العام) ويفضل الانتهاء منها في السنتين الأولى أو الثانية.
- **مكان الانعقاد**: تُعقد بمقر الجامعة في العريش أو القنطرة حسب التنظيم ويتم الإعلان عن فتح التسجيل من خلال إدارة رعاية الشباب.
- **التخلف**: بدون اجتياز هذه الدورة، لن تستطيع استخراج شهادة التخرج حتى وإن أتممت كافة المواد بنجاح.`;
  }
  if (matchesWords(norm, ["تدريب صيفي", "تدريب ميداني", "انزل تدريب", "التدريب", "تدريب الجامعة", "internship", "summer internship"])) {
    return `### 💼 التدريب الصيفي / الميداني

التدريب الميداني هام لتعزيز الجانب العملي:
- توصي الكلية بإتمام فترة تدريب صيفي مدتها من 3 إلى 6 أسابيع في إحدى شركات التكنولوجيا قبل التخرج.
- أحياناً يتم إدراج التدريب الميداني كجزء من التقييم العملي أو كنقاط قوة إضافية للطلاب المتميزين.
- يفضل أن تبحث عن تدريب بعد انتهائك من السنة الثانية (الفرقة الثانية) أو الثالثة لتكون قد أسست نفسك في هياكل البيانات والبرمجة.`;
  }
  if (matchesWords(norm, ["مواصلات", "باصات", "الباصات", "باص", "سكن", "السكن", "المدينة الجامعية", "مدينة جامعية", "مصاريف", "المصاريف"])) {
    return `### 🚌 الاستفسارات الإدارية والمواصلات

- **المواصلات والباصات**: يتم تنظيم خطوط ومواعيد الباصات عبر قسم النقل بالجامعة. المواعيد تتغير فصلياً، يُرجى التوجه لمكتب الحركة لمعرفة جدول مسارات المحافظات (القاهرة، الإسماعيلية، بورسعيد، وغيرها).
- **السكن والمدينة الجامعية**: توفر الجامعة سكناً مجهزاً للطلبة والطالبات. التقديم يتم عبر إدارة السكن في بداية كل فصل دراسي وفقاً للأولوية والسعة.
- **المصاريف والإدارة المالية**: نظراً لأن المصاريف وخطط الدفع تتغير حسب سنة القبول والمنح، يُرجى التوجه لمكتب شئون الطلاب أو الحسابات للحصول على استمارة السداد الدقيقة.`;
  }

  return null;
}

/**
 * Handles questions about the student portal, tools, and Moodle
 */
export function handlePlatformNavigationQueries(norm: string): string | null {
  if (matchesWords(norm, ["مين عمل المنصة", "ايه المنصة دي", "المنصة دي ايه", "هل دي المنصة الرسمية", "الموقع ده ايه", "منصة الطلاب", "بوابة الطلاب", "الموقع الرسمي"])) {
    return `### 🌐 عن منصة طلاب تكنولوجيا المعلومات (Sinai Tech Portal)

هذه المنصة هي **مبادرة طلابية غير رسمية** تم بناؤها بواسطة فريق التطوير بالكلية لتسهيل حياة الطلاب الأكاديمية.
- **الهدف**: توفير أدوات ذكية مثل حاسبة الـ GPA، مخطط التسجيل، ومسارات التعلم في مكان واحد.
- **البيانات**: نعتمد على اللائحة الرسمية لكلية تكنولوجيا المعلومات وعلوم الحاسب بجامعة سيناء.
- **ملاحظة**: المنصة للاسترشاد والتسهيل، ولكن النظام الرسمي لاعتماد الدرجات هو نظام الكلية (Edu-Gate / Moodle).`;
  }

  if (matchesWords(norm, ["احسب gpa ازاي", "استخدم الحاسبة ازاي", "احسب معدلي ازاي", "حاسبة gpa", "احسب الجي بي اي"])) {
    return `### 🧮 كيفية استخدام حاسبة الـ GPA

لحساب معدلك التراكمي والفصلي:
1. توجه إلى صفحة **[حاسبة المعدل (GPA Simulator)](/gpa)** من القائمة.
2. يمكنك استخدام **المسار المنتظم** لحساب معدل فصل دراسي واحد وإضافته لسجلك.
3. أو استخدام **محاكي التوقع (What-If)** لتعرف التقديرات التي تحتاجها للوصول لمعدل تخرج معين.
- *تلميح*: قم بتحديث درجاتك في صفحة **الخطة الدراسية** لكي يتم سحبها تلقائياً في الحاسبة!`;
  }

  if (matchesWords(norm, ["المودل", "moodle", "نسيت باسورد المودل", "ادخل المودل ازاي", "الموديل", "موديل"])) {
    return `### 🎓 نظام التعلم الإلكتروني K-Moodle

المودل هو النظام الرسمي للجامعة لرفع التكليفات والتواصل مع الدكاترة:
- **كيفية الدخول**: عبر الرابط \`moodle.su.edu.eg\` باستخدام إيميلك الجامعي.
- **نسيان كلمة المرور**: إذا واجهت مشكلة في الدخول، يجب التوجه شخصياً لمهندسي الدعم الفني بالكلية (IT Support) لإعادة تعيين كلمة المرور.`;
  }

  if (matchesWords(norm, ["مخطط التسجيل", "ازاي اسجل", "اسجل مواد", "الخطة الدراسية", "خطة التسجيل"])) {
    return `### 🗓️ مخطط التسجيل والخطة الدراسية

- **الخطة الدراسية**: تعرض كافة مواد الكلية مقسمة حسب الفرق الدراسية. يمكنك منها تحديد المواد التي اجتزتها لإضافتها لسجلك.
- **مخطط التسجيل (Planner)**: أداة ذكية تساعدك في اختيار مواد الفصل القادم، وتنبيهك إذا كان هناك تعارض أو متطلب مسبق غير مجتاز، وحساب إجمالي العبء الدراسي قبل الذهاب للمرشد الأكاديمي.`;
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
    return "أهلاً بك! كيف يمكنني مساعدتك اليوم في خطتك الأكاديمية أو استفساراتك عن الكلية والمنصة؟";
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
        return `ℹ مقرر **[${followUpCourse.code}] ${followUpCourse.arabic}** مضاف في خطتك للتسجيل، ولكن **لا يوجد تقدير مسجل له حتى الآن**.`;
      }
      return ` مقرر **[${followUpCourse.code}] ${followUpCourse.arabic}** غير مسجل في خطتك أو سجلك الأكاديمي الحالي.`;
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
    else if (gpa < 2.0) gpaBadge = "إنذار أكاديمي / بحاجة لرفع المعدل ";
    else if (gpa < 2.5) gpaBadge = "مقبول ";
    else if (gpa < 3.0) gpaBadge = "جيد ";
    else if (gpa < 3.6) gpaBadge = "جيد جداً ";

    return `###  المعدل التراكمي الفعلي الخاص بك (Actual Academic GPA)

أهلاً بك ${name}! بناءً على السجل الأكاديمي الفعلي لحسابك بالمنصة:

-  **المعدل التراكمي الحالي (Cumulative GPA)**: **${gpa > 0 ? gpa.toFixed(2) : "0.00"} / 4.00** (${gpaBadge})
- ⏱ **الساعات المنجزة بنجاح**: **${completedCredits}** من أصل **144** ساعة معتمدة.
- 🎓 **نسبة الإنجاز للتخرج**: **${progress}%** (يتبقى لك **${remainingCredits}** ساعة معتمدة).

>  يمكنك استخدام ميزة محاكاة الـ What-If لمعرفة كيف سيرتفع معدلك إذا حصلت على تقديرات معينة الفصل القادم!`;
  }

  // 3.5 FLEXIBLE TERM GRADE INQUIRY (Using CustomSemesters data if available)
  const isSummerGradeInquiry = matchesWords(norm, ["جبت", "درجات", "تقدير", "تقديري", "كام", "نتيجتي"]) && matchesWords(norm, ["صيفي", "سمر", "summer"]);
  
  if (isSummerGradeInquiry && !findMatchingCourse(norm)) {
    // Try to find if they have a summer term in their flexible timeline
    if (studentContext?.customSemesters && studentContext.customSemesters.length > 0) {
      // Find the summer term (e.g. term === 'summer')
      // If the query mentions a specific year like 2025, try to match it
      const yearMatch = norm.match(/20\d{2}/);
      const targetYear = yearMatch ? parseInt(yearMatch[0], 10) : null;
      
      const summerTerms = studentContext.customSemesters.filter((s) => 
        s.term === "summer" && (!targetYear || s.year === targetYear || s.titleAr.includes(targetYear.toString()))
      );

      if (summerTerms.length > 0) {
        const targetSem = summerTerms[0];
        if (targetSem.courses && targetSem.courses.length > 0) {
          const coursesList = targetSem.courses.map(c => {
            const courseInfo = COURSES.find(item => item.code === c.code);
            return `- **[${c.code}] ${courseInfo ? courseInfo.arabic : c.code}**: تقدير **${c.grade}**`;
          }).join("\n");

          return `### ☀️ نتيجتك في ${targetSem.titleAr} (من المسار الفصلي المرن)
لقد قمت بتسجيل **${targetSem.courses.length}** مقررات في هذا الفصل:

${coursesList}

> 💡 **ملاحظة**: هذه البيانات تم استرجاعها من خطة "المسار الفصلي المرن" الخاصة بك.`;
        }
      }
    }

    // Fallback if no summer term found in flexible timeline
    return `### ℹ️ استعلام عن تقديرات الفصل الصيفي

عذراً، نظام المنصة الذكي يعتمد على **التقديرات النهائية للمواد المنجزة فقط**، ولم أتمكن من إيجاد فصل صيفي مسجل به مواد في "المسار الفصلي المرن" الخاص بك.

> 💡 **الحل**: يمكنك الانتقال إلى حاسبة الـ GPA (المسار الفصلي المرن) لتسجيل درجاتك الصيفية وسأتمكن من قراءتها لاحقاً، أو يمكنك سؤالي عن مادة محددة بالاسم (مثل: *"جبت كام في لوجيك ديزاين؟"*).`;
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

  // 5.5 COURSE ATTEMPT COUNT INQUIRY ("خدت مادة تاريخ سيناء كام مره؟")
  const isCourseCountInquiry = matchesWords(norm, ["كام مره", "كم مرة", "كام مرة", "كم مره"]) || (matchesWords(norm, ["خدتها", "اخدتها", "امتحنتها", "سجلتها"]) && matchesWords(norm, ["كام", "كم"]));
  
  if (isCourseCountInquiry) {
    const targetCourse = findMatchingCourse(query);
    if (targetCourse) {
      if (studentContext?.customSemesters && studentContext.customSemesters.length > 0) {
        const termsTaken = studentContext.customSemesters.filter(sem => sem.courses.some(c => c.code === targetCourse.code));
        
        if (termsTaken.length > 0) {
          const attemptsList = termsTaken.map((sem, index) => {
            const courseData = sem.courses.find(c => c.code === targetCourse.code);
            return `- **المحاولة ${index + 1}** في ${sem.titleAr}: تقدير **${courseData?.grade}**`;
          }).join("\n");
          
          return `### 📊 عدد مرات تسجيل مقرر [${targetCourse.code}] ${targetCourse.arabic}

حسب "المسار الفصلي المرن" الخاص بك، لقد قمت بتسجيل هذه المادة **${termsTaken.length}** مرات:

${attemptsList}

> 💡 **ملاحظة**: معدلك التراكمي يحسب دائماً بناءً على **أعلى تقدير** حصلت عليه من بين هذه المحاولات (مع مراعاة سقف التقدير إذا تجاوزت المحاولة الثانية).`;
        }
      }
      
      const completedRecord = studentContext?.completedCourses?.find((c) => c.code === targetCourse.code);
      if (completedRecord) {
        return `### ℹ️ استعلام عن محاولات مادة [${targetCourse.code}] ${targetCourse.arabic}

هذه المادة مسجلة بالفعل في خطتك الأساسية بتقدير نهائي **${completedRecord.grade}**.
ولكن لمعرفة "كم مرة" قمت بتسجيلها وتواريخ إعادتها بدقة، أحتاج منك إضافتها في **المسار الفصلي المرن** في الفصول التي امتحنتها فيها فعلياً، وسأخبرك بالتفاصيل!`;
      } else {
         return `### ℹ️ استعلام عن محاولات مادة [${targetCourse.code}] ${targetCourse.arabic}

هذه المادة غير مسجلة حالياً في أي فصل دراسي داخل خطتك المرنة، ولم تنجزها في خطتك الأساسية بعد.`;
      }
    }
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

      let flexRecord: { grade: string; semTitle: string } | null = null;
      if (!completedRecord && studentContext?.customSemesters) {
        for (const sem of studentContext.customSemesters) {
          const courseInSem = sem.courses?.find((c) => c.code === targetCourse.code);
          if (courseInSem && courseInSem.grade) {
            flexRecord = { grade: courseInSem.grade, semTitle: sem.titleAr };
          }
        }
      }

      if (completedRecord) {
        if (completedRecord.grade && completedRecord.grade.trim() !== "") {
          const gradeLabel = GRADE_LABELS[completedRecord.grade] || "";
          return `###  النتيجة الرسمية المسجلة لمقرر [${targetCourse.code}]
**${targetCourse.arabic} (${targetCourse.english})**

-  **التقدير المسجل لك**: **${completedRecord.grade}** (${gradeLabel})
- ⏱ **عدد الساعات المعتمدة للمقرر**: **${targetCourse.credits} ساعات**
-  **الفترة الدراسية**: ${PERIODS[targetCourse.period] || targetCourse.period}

>  هذا التقدير معتمد ومحتسب ضمن معدلك التراكمي الحالي (${studentContext?.cumulativeGpa?.toFixed(2) || "0.00"}).`;
        } else {
          return `### ℹ حالة مقرر [${targetCourse.code}] ${targetCourse.arabic}

المادة مسجلة ومدرجة بالفعل في سجلك الأكاديمي، **ولكن لا يوجد تقدير مرصود لها حالياً** في قاعدة البيانات. يرجى مراجعة صفحة الخطة الدراسية لتحديث الدرجة فور إعلانها.`;
        }
      } else if (flexRecord) {
        const gradeLabel = GRADE_LABELS[flexRecord.grade] || "";
        return `### 📊 النتيجة المسجلة لمقرر [${targetCourse.code}]
**${targetCourse.arabic} (${targetCourse.english})**

- 🎓 **التقدير المسجل لك**: **${flexRecord.grade}** (${gradeLabel})
- 🗓️ **الفصل الدراسي**: ${flexRecord.semTitle} (من المسار الفصلي المرن)
- ⏱️ **عدد الساعات المعتمدة للمقرر**: **${targetCourse.credits} ساعات**
- 📚 **الفترة الدراسية الأساسية**: ${PERIODS[targetCourse.period] || targetCourse.period}

> 💡 **ملاحظة**: هذا التقدير تم استرجاعه من خطة "المسار الفصلي المرن" الخاصة بك.`;
      } else if (isPlanned) {
        return `###  حالة مقرر [${targetCourse.code}] ${targetCourse.arabic}

هذا المقرر مضاف حالياً إلى **مخطط التسجيل الخاص بك**، ولم يتم رصد درجات له بعد لأنك لم تجتزه في الفصول السابقة.`;
      } else {
        return `###  حالة مقرر [${targetCourse.code}] ${targetCourse.arabic}

وفقاً لسجلك الأكاديمي وقاعدة البيانات المتاحة، **هذا المقرر غير موجود ضمن المواد التي قمت بتسجيلها أو دراستها في حسابك حتى الآن**.`;
      }
    }
  }

  // 6.5 ORDERED ACADEMIC HISTORY DUMP ("كل مادة خدتها بالترتيب", "موادي كلها بالترتيب")
  const isOrderedHistory = matchesWords(norm, ["بالترتيب", "ترتيب"]) && matchesWords(norm, ["كل ماده", "كل مادة", "كل المواد", "المواد كلها", "موادي", "سجلي"]);
  
  if (isOrderedHistory) {
    if (studentContext?.customSemesters && studentContext.customSemesters.length > 0) {
      let historyOutput = `### 📜 سجلك الأكاديمي التفصيلي (من المسار الفصلي المرن)\n\nإليك قائمة بجميع مقرراتك الدراسية مرتبة زمنياً حسب الفصول التي قمت بتسجيلها:\n\n`;
      let totalRegisteredCourses = 0;
      
      studentContext.customSemesters.forEach(sem => {
        if (sem.courses && sem.courses.length > 0) {
          historyOutput += `#### 🗓️ ${sem.titleAr} (${sem.courses.length} مواد)\n`;
          sem.courses.forEach(c => {
            const info = COURSES.find(item => item.code === c.code);
            const courseName = info ? info.arabic : c.code;
            historyOutput += `- **[${c.code}] ${courseName}**: تقدير **${c.grade}**\n`;
            totalRegisteredCourses++;
          });
          historyOutput += `\n`;
        }
      });
      
      if (totalRegisteredCourses === 0) {
        return `### ℹ️ سجلك الأكاديمي التفصيلي\n\nلقد قمت بإنشاء فصول دراسية في المسار المرن ولكنك لم تقم بتسجيل أي مواد بداخلها حتى الآن.`;
      }
      
      return historyOutput + `> 💡 **ملاحظة**: تم استخراج هذه البيانات بدقة بناءً على التسلسل الزمني الذي أدخلته في "المسار الفصلي المرن"، شاملة المواد المعادة والفصول الصيفية بالترتيب الصحيح.`;
    } else {
      return `### ℹ️ استعلام عن السجل الأكاديمي الترتيبي\n\nلعرض تاريخك الأكاديمي والمواد التي درستها **"بالترتيب"** الزمني الدقيق، أحتاج منك إعداد وتعبئة درجاتك في **المسار الفصلي المرن** (Flexible Timeline).\n\nبدون المسار المرن، تحتفظ المنصة بالتقديرات النهائية فقط. يمكنك سؤالي *"إيه المواد اللي خلصتها؟"* لعرض قائمة بنجاحاتك بدون ترتيب.`;
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

>  لمعرفة المواد الدقيقة المتبقية لك في خطتك الأكاديمية والمقررات التي تفتحها، يرجى التوجه لصفحة **"الخطة الدراسية والتقدم"** حيث يتم فرز وعرض المواد المتبقية بشكل تفاعلي.`;
  }

  // 10. ROADMAP INTELLIGENCE ("خلصت Frontend أعمل إيه بعد كده؟", "نسبة إنجازي في الـ Frontend")
  const roadmapResponse = handleRoadmapQuery(norm, studentContext);
  if (roadmapResponse) {
    return roadmapResponse;
  }

  // 11. UNIVERSITY REGULATIONS (دليل الطالب)
  const regResponse = handleUniversityRegulations(norm, studentContext);
  if (regResponse) {
    return regResponse;
  }

  // 11.5 PLATFORM & NAVIGATION QUERIES
  const platformResponse = handlePlatformNavigationQueries(norm);
  if (platformResponse) {
    return platformResponse;
  }

  // 11.8 BALANCED SEMESTER REGISTRATION PLAN ("اقترحلي خطة لتسجيل ترم متوازن", "خطة دراسية متوازنة")
  const isBalancedPlanQuery = 
    matchesWords(norm, ["ترم متوازن", "خطة متوازنة", "خطه متوازنه", "تسجيل ترم متوازن", "جدول متوازن", "خطة دراسية متوازنة", "خطه دراسيه متوازنه", "خطة تسجيل متوازنة", "خطة متوازنه"]) ||
    (matchesWords(norm, ["اقترحلي", "اقترح لي", "اقتراح", "ازاي اسجل", "كيف اسجل", "عايز خطة", "عايز خطه"]) && 
     matchesWords(norm, ["متوازن", "متوازنة", "متوازنه", "ترم", "فصل", "تسجيل"]));

  if (isBalancedPlanQuery) {
    const completedCredits = studentContext?.completedCredits || 0;

    let levelAdvice = "";
    if (completedCredits < 36) {
      levelAdvice = "أنت حالياً في مرحلة **المستوى التأسيسي (الفرقة الأولى/الثانية)**؛ الأولوية القصوى لك هي إنهاء المواد المفتاحية للرياضيات والبرمجة (مثل: `Ma 110`, `CSW 232`, `CSW 121`) لأنها تفتح جميع مقررات التخصص اللاحقة.";
    } else if (completedCredits < 95) {
      levelAdvice = "أنت في مرحلة **التعمق التخصصي (الفرقة الثانية/الثالثة)**؛ احرص على عدم الجمع بين أكثر من مادتين برمجيتين تحتويان على مشاريع أسبوعية ومعامل شاقة في نفس الفصل.";
    } else {
      levelAdvice = "أنت في مرحلة **التخرج والسنوات النهائية**؛ الأولوية لتسجيل مشروعي التخرج ومتبقي الساعات الإجبارية واستيفاء متطلبات القسم الدقيقة.";
    }

    return `### ⚖️ استراتيجية وخطة تسجيل فصل دراسي متوازن (15 - 18 ساعة معتمدة)

أهلاً بك يا **${studentContext?.userName || "طالبنا العزيز"}**! التوازن في تسجيل الفصل الدراسي هو السر الأهم للحفاظ على معدل تراكمي مرتفع (GPA $\\ge$ 3.5) بدون ضغط عصبي أثناء فترة الامتحانات وتسليم المشاريع.

---

#### 🧩 المعادلة الذهبية للترم المتوازن (5 إلى 6 مقررات):
1. 🔴 **مادتان ثقيلتان تخصصيتان (Heavy Core)**:
   - مواد برمجية متقدمة أو رياضيات تحتاج ممارسة دورية وحل تمارين مستمر (مثل: *هياكل البيانات، نظم التشغيل، الجبر الخطي*).
2. 🟡 **مادتان متوسطتان (Medium Load)**:
   - مواد نظرية وتطبيقية معتدلة العبء (مثل: *نظم قواعد البيانات، تكنولوجيا الويب، شبكات الحاسب*).
3. 🟢 **مادة أو مادتان متطلبات عامة وخفيفة (Light / Humanities)**:
   - مواد متطلبات الكلية والجامعة لرفع وتأمين المعدل (مثل: *اللغة الإنجليزية، مهارات الاتصال، التفكير الابتكاري، تاريخ سيناء*).

---

#### 💡 قواعد ذهبية لتفادي الفخاخ الشائعة:
- 🚫 **لا تجمع بين أكثر من مادتين لهما معامل ومشاريع كبرى تسليمها أسبوعي** (مثل الجمع بين برمجة متقدمة + ويب + رسوم حاسب في ترم واحد).
- 🔑 **أعطِ الأولوية للمواد المفتاحية (Prerequisites)**: إذا كانت هناك مادة تفتح 3 أو 4 مواد في الترم التالي، سجّلها دون تردد.
- ⏱️ **حجم العبء المناسب**: 
  - إذا كان معدلك أقل من 2.5: سجّل **15 ساعة (5 مواد)** لتركيز مجهودك ورفع معدلك.
  - إذا كان معدلك 3.0 فأكثر: يمكنك تسجيل **18 ساعة (6 مواد)** بارتياح تام.

---

#### 📌 نصيحة موجهة لمستواك الأكاديمي الحالي:
${levelAdvice}

> 🚀 **الخطوة التالية**: توجّه إلى صفحة **[مخطط التسجيل الذكي (Smart Planner)](/planner)**؛ حيث يقوم النظام بفحص شجرة متطلباتك واقتراح المواد الجاهزة للتسجيل لك بنقرة واحدة!`;
  }

  // 12. COURSE PREREQUISITES & ELIGIBILITY ("علشان اسجل ماده كومبيوتر نيتورك محتاج اخلص حاجه قبلها؟", "اقدر اسجل data structures؟", "شروط مادة كذا")
  const isPrereqInquiry = 
    matchesWords(norm, [
      "اقدر اسجل", "أقدر أسجل", "ينفع اسجل", "شروط تسجيل", "شروط مادة", "ليه مش قادر اسجل", "متطلبات مادة",
      "متطلبات", "متطلب", "المتطلب السابق", "متطلب سابق", "متطلب مسبق", "المتطلبات السابقة", "المتطلبات المسبقة",
      "شروط", "شروطها", "شروطه",
      "محتاج اخلص", "لازم اخلص", "لازم اكون مخلص", "اخلص ايه قبل", "اخلص حاجه قبلها", "اخلص حاجة قبلها",
      "حاجه قبلها", "حاجة قبلها", "قبلها ايه", "قبله ايه", "قبلها حاجه", "قبلها حاجة", "قبلها مادة", "قبلها ماده",
      "ايه اللي قبلها", "ايه اللي قبله", "ايه قبل", "ايه متطلب", "ايه شروط", "عايز اسجل", "علشان اسجل", "عشان اسجل"
    ]) ||
    ((matchesWords(norm, ["علشان اسجل", "عشان اسجل", "اسجل", "تسجيل"]) || matchesWords(norm, ["مادة", "ماده", "كورس", "مقرر"])) && 
     matchesWords(norm, ["قبلها", "قبله", "قبل", "محتاج", "لازم", "اخلص", "متطلب", "شروط"]));

  if (isPrereqInquiry) {
    const courseMatch = findMatchingCourse(query) || handleFollowUpContext(norm, history);
    if (courseMatch) {
      // Build a comprehensive map of courses passed by student with grade (excluding 'F')
      const studentPassedMap = new Map<string, string>();

      // From standard completedCourses
      if (studentContext?.completedCourses) {
        studentContext.completedCourses.forEach((c) => {
          if (c.grade && c.grade.trim().toUpperCase() !== "F") {
            studentPassedMap.set(c.code, c.grade);
          }
        });
      }

      // From Flexible Timeline customSemesters
      if (studentContext?.customSemesters) {
        studentContext.customSemesters.forEach((sem) => {
          sem.courses?.forEach((c) => {
            if (c.grade && c.grade.trim().toUpperCase() !== "F") {
              studentPassedMap.set(c.code, c.grade);
            }
          });
        });
      }

      // Case A: Course has NO prerequisites
      if (courseMatch.prerequisites.length === 0) {
        return `### 🟢 شروط تسجيل مقرر [${courseMatch.code}] ${courseMatch.arabic} (${courseMatch.english})

لا يا **${studentContext?.userName || "طالبنا العزيز"}**، **مش محتاج تخلص أي مادة قبلها**! 🎉
هذا المقرر **ليس له أي متطلب سابق (مادة مفتوحة)** في الخطة الدراسية للكلية.

- ⏱️ **عدد الساعات المعتمدة**: **${courseMatch.credits} ساعات**
- 📚 **المستوى المقترح**: ${PERIODS[courseMatch.period] || courseMatch.period}

> 💡 يمكنك تسجيل هذا المقرر مباشرة في أي فصل دراسي متاح فيه متى سمح عبئك الدراسي وجدولك الأكاديمي بذلك دون أي قيود متطلبات.`;
      }

      // Case B: Course HAS prerequisites
      const prereqDetails = courseMatch.prerequisites.map((pCode) => {
        const pCourse = COURSES.find((c) => c.code === pCode);
        const pName = pCourse ? `${pCourse.arabic} (${pCourse.english})` : pCode;
        const pCredits = pCourse ? `${pCourse.credits} ساعات` : "";
        const isPassed = studentPassedMap.has(pCode);
        const passedGrade = studentPassedMap.get(pCode);
        const statusBadge = isPassed
          ? `✅ **ناجح بتقدير (${passedGrade})**`
          : `❌ **لم تجتزها بعد في سجلك**`;

        return `- 📌 **[${pCode}] ${pName}** ${pCredits ? `(${pCredits})` : ""} ← ${statusBadge}`;
      }).join("\n");

      const missingPrereqs = courseMatch.prerequisites.filter((pCode) => !studentPassedMap.has(pCode));
      const allPassed = missingPrereqs.length === 0;

      if (allPassed) {
        return `### ✅ متطلبات وشروط تسجيل مقرر [${courseMatch.code}]
**${courseMatch.arabic} (${courseMatch.english})**

نعم، لتسجيل هذا المقرر، تنص اللائحة على ضرورة اجتياز **المتطلب السابق**:

${prereqDetails}

---

#### 🎉 موقفك الأكاديمي الحالي:
أنت **مستوفٍ لجميع المتطلبات والشروط المسبقة بنجاح**! 
لقد قمت باجتياز متطلب(ات) هذا المقرر، وبالتالي **يحق لك رسمياً تسجيل [${courseMatch.code}] ${courseMatch.arabic}** في جدول الفصل القادم بدون أي عائق أكاديمي. 🚀

> 💡 يمكنك التوجه إلى **"مخطط التسجيل الذكي"** لإدراج المادة في خطة جدولك القادم ومعاينة إجمالي الساعات.`;
      } else {
        const missingNames = missingPrereqs.map((pCode) => {
          const pCourse = COURSES.find((c) => c.code === pCode);
          return `**[${pCode}] ${pCourse ? pCourse.arabic : pCode}**`;
        }).join(" و ");

        return `### ⚠️ متطلبات وشروط تسجيل مقرر [${courseMatch.code}]
**${courseMatch.arabic} (${courseMatch.english})**

نعم، علشان تسجل مقرر **${courseMatch.arabic}**، تنص لائحة الكلية على ضرورة اجتياز **المتطلب السابق**:

${prereqDetails}

---

#### 🔒 موقفك الأكاديمي الحالي:
وفقاً لسجلك الأكاديمي، **لا يمكنك تسجيل هذه المادة حالياً** لأنك لم تجتز المتطلب السابق المطلوب (${missingNames}).

> ⚖️ **نص لائحة الكلية**: لا يجوز للطالب تسجيل مقرر دراسي قبل النجاح واجتياز متطلبه السابق، إلا في حالة تخرج الطالب وبموافقة القسم وعميد الكلية.`;
      }
    }
  }

  // 12.5 COURSE UNLOCKING INQUIRIES ("مادة الجبر الخطي بتفتح ايه؟", "شبكات الحاسب بتفتح ايه بعدها؟")
  const isUnlockInquiry = matchesWords(norm, [
    "بتفتح ايه", "تفتح ايه", "بيفتح ايه", "يفتح ايه", "بتفتحلي ايه", "تفتحلي ايه",
    "هيفتح ايه", "هيفتحلي ايه", "مادة مفتاحية", "مقررات بتفتحها", "بعدها ايه",
    "المواد المعتمدة عليها", "معتمد عليها", "افتح ايه بعدها", "افتح ايه لو", "تفتح مواد ايه"
  ]);

  if (isUnlockInquiry) {
    const courseMatch = findMatchingCourse(query) || handleFollowUpContext(norm, history);
    if (courseMatch) {
      const unlockedCourses = COURSES.filter((c) => c.prerequisites.includes(courseMatch.code));

      if (unlockedCourses.length === 0) {
        return `### ℹ️ المقررات المعتمدة على [${courseMatch.code}] ${courseMatch.arabic}

مقرر **[${courseMatch.code}] ${courseMatch.arabic} (${courseMatch.english})** هو **مقرر نهائي في مساره**، ولا توجد مقررات أخرى في الخطة الدراسية تشترط اجتيازه كمتطلب سابق إجباري لها.`;
      }

      const unlockedList = unlockedCourses.map((c) => {
        const periodLabel = PERIODS[c.period] || c.period;
        return `- 🔓 **[${c.code}] ${c.arabic} (${c.english})** — (${c.credits} ساعات) | ${periodLabel}`;
      }).join("\n");

      return `### 🔑 المقررات التي تفتحها مادة [${courseMatch.code}] ${courseMatch.arabic}

النجاح واجتياز مقرر **${courseMatch.arabic}** هو شرط أساسي لفتح وتسجيل **${unlockedCourses.length}** مقررات دراسية في الفصول التالية:

${unlockedList}

> 💡 **أهمية المادة**: تُعد هذه المادة من المقررات المفتاحية الهامة، واجتيازها من المحاولة الأولى يضمن لك فتح المواد المتقدمة في موعدها دون أي تعطل في الخطة الدراسية!`;
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
  return `### 🤔 أهلاً بك ${userName}! أنا مرشدك الأكاديمي والتقني الموثوق

لقد استلمت استفسارك: **"${query}"**، ولكني لم أتمكن من إيجاد إجابة دقيقة مطابقة في قاعدة بيانات اللوائح الخاصة بي.

لتتمكن من الحصول على إجابة، **حاول صياغة سؤالك بإحدى الطرق التالية**:
- 📚 **اللوائح**: *"شروط الإنذار الأكاديمي؟"*, *"الترم الصيفي؟"*, *"الغياب؟"*, *"التربية العسكرية؟"*
- 📊 **المعدل والدرجات**: *"الـ GPA بتاعي كام؟"*, *"جبت كام في الداتا ستراكشر؟"*, *"لو جبت A في 3 مواد معدلي هيبقى كام؟"*
- 🏛️ **الأقسام**: *"الفرق بين الأقسام؟"*, *"ادخل قسم ايه؟"*
- ⚙️ **المنصة**: *"ايه المنصة دي؟"*, *"ازاي احسب الـ GPA؟"*, *"المودل؟"*
- 💻 **مسارات التعلم**: *"خلصت Frontend أعمل إيه بعد كده؟"*

يرجى إعادة صياغة استفسارك بكلمات أوضح وسأكون سعيداً بإجابتك!`;
}

/**
 * General Computer Science and Technology Q&A
 */
function handleTechQuery(norm: string, rawQuery: string): string | null {
  if (matchesWords(norm, ["frontend", "واجهات", "فرونت"])) {
    return `###  مجال تطوير واجهات الويب (Frontend Development)

تطوير الواجهات هو التخصص المسؤول عن بناء الجزء البصري التفاعلي الذي يشاهده المستخدم في المتصفح.

-  **التقنيات الأساسية**: HTML5, CSS3, JavaScript (ES6+), React.js, Next.js, Tailwind CSS.
- 🎓 **المواد الأكاديمية المرتبطة بجامعة سيناء**:
  - \`INT 341\` (تكنولوجيا الويب)
  - \`CSW 337\` (برمجة واجهة المستخدم)
  - \`INT 343\` (تصميم وتنفيذ مواقع الويب)
-  **نصيحة البدء**: ابدأ بإتقان أساسيات JavaScript وتطبيق مشاريع عملية بسيطة قبل الانتقال لأطر العمل مثل React. يمكنك متابعة مسار الـ Frontend بالمنصة لمعاينة تقدمك خطوة بخطوة!`;
  }

  if (matchesWords(norm, ["backend", "خوادم", "باك ان", "باكاند"])) {
    return `###  مجال تطوير الأنظمة الخلفية وقواعد البيانات (Backend Development)

تطوير الخوادم هو التخصص المسؤول عن منطق البرمجة (Business Logic)، أمان البيانات، وبناء الـ RESTful APIs ومعالجة قواعد البيانات.

-  **التقنيات الأساسية**: Node.js (Express), Python (Django/FastAPI), Java (Spring Boot), PostgreSQL, MongoDB.
- 🎓 **المواد الأكاديمية المرتبطة**:
  - \`ISD 242\` (نظم قواعد البيانات)
  - \`CSW 221\` (هياكل البيانات)
  - \`CSW 234\` (برمجة الحاسب 2 - جافا)
-  **نصيحة البدء**: افهم جيداً كيفية تصميم الجداول العلاقاتية (Relational Databases) وكتابة استعلامات SQL الفعالة، ثم انتقل لبناء أول API خاص بك.`;
  }

  if (matchesWords(norm, ["ذكاء اصطناعي", "ai", "machine learning", "تعلم الالة", "data science"])) {
    return `###  مجال الذكاء الاصطناعي وعلم البيانات (AI & Data Science)

يهدف هذا المجال لبناء نماذج برمجية ذكية قادرة على التعلم من البيانات والتنبؤ والتعرف على الأنماط والصور.

-  **التقنيات الأساسية**: Python, NumPy, Pandas, Scikit-Learn, PyTorch, TensorFlow.
- 🎓 **المواد الأكاديمية المرتبطة**:
  - \`Ma 110\` (الجبر الخطي)
  - \`St 120\` (الاحتمالات والإحصاء)
  - \`CSW 351\` (الذكاء الاصطناعي)
  - \`INT 423\` (معالجة الصور الرقمية)
-  **نصيحة البدء**: تعمق في الجبر الخطي والاحتمالات، حيث أنها الأساس الرياضي لكل خوارزميات التعلم الآلي.`;
  }

  return null;
}
