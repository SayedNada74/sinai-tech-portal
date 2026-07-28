import { COURSES, PERIODS, Course } from "./courses-data";

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
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Normalizes text to handle typos, missing letters, diacritics, and Arabic/English variations
 */
function normalizeText(text: string): string {
  if (!text) return "";
  let str = text.toLowerCase().trim();

  // Normalize Arabic letter variations
  str = str.replace(/[أإآآ]/g, "ا");
  str = str.replace(/ة/g, "ه");
  str = str.replace(/ى/g, "ي");
  str = str.replace(/ؤ/g, "و");
  str = str.replace(/ئ/g, "ي");
  str = str.replace(/[\u064B-\u0652]/g, ""); // Remove Arabic diacritics (Harakat)

  // Remove special symbols
  str = str.replace(/[?,.!،؛:-_()"]/g, " ");

  return str;
}

/**
 * Checks if query contains any of target keywords
 */
function matchesWords(normalizedQuery: string, keywords: string[]): boolean {
  return keywords.some((kw) => normalizedQuery.includes(normalizeText(kw)));
}

/**
 * Find matching course from COURSES database using code, Arabic, or English title
 */
function findMatchingCourse(query: string): Course | null {
  const normQuery = normalizeText(query);
  if (!normQuery) return null;

  // 1. Direct Code or Exact Title Match
  for (const c of COURSES) {
    const normCode = normalizeText(c.code);
    const normAr = normalizeText(c.arabic);
    const normEn = normalizeText(c.english);

    if (
      normQuery.includes(normCode) ||
      normQuery.includes(normAr) ||
      normQuery.includes(normEn) ||
      normAr.includes(normQuery) ||
      normEn.includes(normQuery)
    ) {
      return c;
    }
  }

  // 2. Tokenized Fuzzy Keyword Match (e.g., "data structure", "هياكل", "شبكات", "برمجة 2", "قواعد بيانات")
  const tokens = normQuery.split(/\s+/).filter((t) => t.length > 2);
  let bestMatch: Course | null = null;
  let highestScore = 0;

  for (const c of COURSES) {
    const courseText = normalizeText(`${c.code} ${c.arabic} ${c.english}`);
    let score = 0;

    for (const token of tokens) {
      if (courseText.includes(token)) {
        score += 1;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = c;
    }
  }

  return highestScore > 0 ? bestMatch : null;
}

/**
 * Formats a detailed AI response for a specific course, including student's current status if available
 */
function formatCourseResponse(c: Course, studentContext?: StudentContext): string {
  const periodLabel = PERIODS[c.period] || c.period;
  const prereqsText = c.prerequisites.length > 0
    ? c.prerequisites.map((p) => {
        const preCourse = COURSES.find((item) => item.code === p);
        return preCourse ? `**[${p}] ${preCourse.arabic}**` : `**[${p}]**`;
      }).join(", ")
    : "لا يوجد متطلب مسبق (مادة مفتوحة بالفرقة الأولى/التخصص).";

  const diffEmoji = c.difficulty === "hard" ? "🔴 مادة تخصصية تتطلب ممارسة دؤوبة" : c.difficulty === "medium" ? "🟡 مادة متوسطة الشدة" : "🟢 مادة سلسة ومباشرة";

  // Check if student completed or planned this course
  let studentStatusNotice = "";
  if (studentContext) {
    const completedInfo = studentContext.completedCourses?.find((item) => item.code === c.code);
    const isPlanned = studentContext.plannedCourses?.includes(c.code);

    if (completedInfo) {
      studentStatusNotice = `\n\n> 🎉 **حالتك الشخصية في هذه المادة**: أنجزت هذا المقرر بنجاح بتقدير **(${completedInfo.grade})**!`;
    } else if (isPlanned) {
      studentStatusNotice = `\n\n> 📌 **حالتك الشخصية في هذه المادة**: هذه المادة مضافة في قائمة **المواد المخططة للتسجيل** لديك.`;
    }
  }

  return `### 📚 [${c.code}] ${c.arabic} (${c.english})

- ⏱️ **عدد الساعات المعتمدة**: **${c.credits} ساعات**
- 📅 **المستوى الأكاديمي**: **${periodLabel}**
- 🔗 **المتطلبات المسبقة**: ${prereqsText}
- 📊 **مستوى الصعوبة**: ${diffEmoji}${studentStatusNotice}

#### 📖 نبذة عن المقرر والهدف التعليمي:
${c.description}

#### 🎯 مخرجات التعلم المكتسبة (Outcomes):
${c.outcomes.map((o) => `- ${o}`).join("\n")}

#### 💡 استراتيجية التفوق واجتياز المقرر بتقدير ممتاز (A):
1. **المواظبة العملية**: احرص على تطبيق الأكواد والتمارين العملية في المعامل والمختبرات.
2. **استغلال المراجع**: زر صفحة [تفاصيل مقرر ${c.code}](/courses/${encodeURIComponent(c.code)}) لتنزيل أوراق الغش والمصادر المعتمدة ونماذج الامتحانات السابقة.
3. **مزامنة الجدول**: تأكد من عدم وجود تعارض مع المواد المتطلبة الأخرى من خلال **مخطط التسجيل الذكي**.`;
}

/**
 * Technical / Computer Science Q&A Engine for general tech queries
 */
function handleTechQuery(norm: string, rawQuery: string): string | null {
  if (matchesWords(norm, ["frontend", "واجهات", "فرونت"])) {
    return `### 💻 مجال تطوير واجهات الويب (Frontend Development)

تطوير الواجهات هو التخصص المسؤول عن بناء الجزء البصري التفاعلي الذي يشاهده المستخدم في المتصفح.

- 🛠️ **التقنيات الأساسية**: HTML5, CSS3, JavaScript (ES6+), React.js, Next.js, Tailwind CSS.
- 🎓 **المواد الأكاديمية المرتبطة بجامعة سيناء**:
  - \`INT 341\` (تكنولوجيا الويب)
  - \`CSW 337\` (برمجة واجهة المستخدم)
  - \`INT 343\` (تصميم وتنفيذ مواقع الويب)
- 🚀 **نصيحة البدء**: ابدأ بإتقان أساسيات JavaScript وتطبيق مشاريع عملية بسيطة قبل الانتقال لأطر العمل مثل React. يمكنك تصفح **مسار الـ Frontend** المتاح بالمنصة!`;
  }

  if (matchesWords(norm, ["backend", "خوادم", "باك ان", "باكاند"])) {
    return `### ⚙️ مجال تطوير الخوادم وقواعد البيانات (Backend Development)

تطوير الخوادم هو التخصص المسؤول عن المنطق البرمجي (Business Logic)، أمان البيانات، وبناء الـ RESTful APIs ومعالجة قواعد البيانات.

- 🛠️ **التقنيات الأساسية**: Node.js (Express), Python (Django/FastAPI), Java (Spring Boot), PostgreSQL, MongoDB.
- 🎓 **المواد الأكاديمية المرتبطة**:
  - \`ISD 242\` (نظم قواعد البيانات)
  - \`CSW 221\` (هياكل البيانات)
  - \`CSW 234\` (برمجة الحاسب 2 - جافا)
- 🚀 **نصيحة البدء**: افهم جيداً كيفية تصميم الجداول العلاقاتية (Relational Databases) وكتابة استعلامات SQL الفعالة، ثم انتقل لبناء أول API خاص بك.`;
  }

  if (matchesWords(norm, ["ذكاء اصطناعي", "ai", "machine learning", "تعلم الالة", "data science"])) {
    return `### 🤖 مجال الذكاء الاصطناعي وعلم البيانات (AI & Data Science)

يهدف هذا المجال لبناء نماذج برمجية ذكية قادرة على التعلم من البيانات والتنبؤ والتعرف على الأنماط والصور.

- 🛠️ **التقنيات الأساسية**: Python, NumPy, Pandas, Scikit-Learn, PyTorch, TensorFlow.
- 🎓 **المواد الأكاديمية المرتبطة**:
  - \`Ma 110\` (الجبر الخطي)
  - \`St 120\` (الاحتمالات والإحصاء)
  - \`CSW 351\` (الذكاء الاصطناعي)
  - \`INT 423\` (معالجة الصور الرقمية)
- 🚀 **نصيحة البدء**: تعمق في الجبر الخطي والاحتمالات، حيث أنها الأساس الرياضياتي لكل خوارزميات التعلم العميق.`;
  }

  if (matchesWords(norm, ["python", "جافا", "java", "c++", "cpp", "javascript", "js", "لغة برمجة", "لغات برمجة"])) {
    return `### 💻 دليل اختيار لغات البرمجة واكتساب المهارات

تختلف لغة البرمجة حسب المجال الأكاديمي والمهني الذي تستهدفه:

1. **JavaScript / TypeScript**: اللغة الأولى للويب (Frontend & Backend).
2. **Python**: الأفضل للذكاء الاصطناعي، تحليلات البيانات، والسكربتات السريعة.
3. **Java / C++**: الأقوى في فهم هياكل البيانات، إدارة الذاكرة، وأنظمة التشغيل الأكاديمية (مستخدمة في مقررات \`CSW 232\` و \`CSW 234\`).

> 💡 في مرحلة الكلية، لا تقلق بشأن عدد اللغات التي تعرفها؛ ركز على إتقان المفاهيم الأساسية (OOP, Data Structures, Problem Solving) وسيكون انتقالك لأي لغة جديدة أمراً بغاية السهولة!`;
  }

  return null;
}

/**
 * Main Dynamic AI Response Generator connected live to Student Context
 */
export function getAiResponse(query: string, studentContext?: StudentContext): string {
  const norm = normalizeText(query);

  // A. Check for Personal Live Student Data Queries (GPA, My Completed Courses, My Progress, Follow-up Questions)
  const isPersonalGpaQuery = matchesWords(norm, [
    "gpa بتاعي", "معدلي", "خاص بيا", "خاص بي", "بتاعي كام", "بتاعي", "خاصتي",
    "دلوقتي الخاص بيا", "كام دلوقتي", "جايب كام", "معدلي كام", "كم معدلي",
    "gpa الخاص بيا", "تقديري كام", "تقديري المباشر"
  ]) || (norm.includes("كام") && (norm.includes("gpa") || norm.includes("معدل") || norm.includes("الخاص بيا")));

  if (isPersonalGpaQuery) {
    const gpa = studentContext?.cumulativeGpa ?? 0;
    const completedCredits = studentContext?.completedCredits ?? 0;
    const remainingCredits = studentContext?.remainingCredits ?? (144 - completedCredits);
    const progress = studentContext?.graduationPercentage ?? Math.round((completedCredits / 144) * 100);
    const name = studentContext?.userName || "عزيزي الطالب";

    let gpaBadge = "ممتاز مرتفع 🚀";
    if (gpa < 2.0) gpaBadge = "جديد / بحاجة لرفع المعدل ⚠️";
    else if (gpa < 2.5) gpaBadge = "مقبول ⭐️";
    else if (gpa < 3.0) gpaBadge = "جيد 👍";
    else if (gpa < 3.6) gpaBadge = "جيد جداً 🌟";

    return `### 📊 المعدل التراكمي المباشر الخاص بك (Live Academic Profile)

أهلاً بك يا **${name}**! بناءً على بيانات حسابك المسجلة مباشرة بالمنصة:

- 🎯 **المعدل التراكمي الحالي (GPA)**: **${gpa > 0 ? gpa.toFixed(2) : "0.00"}** (${gpaBadge})
- ⏱️ **الساعات المنجزة بنجاح**: **${completedCredits}** من أصل **144** ساعة معتمدة.
- 🎓 **نسبة التقدم الإجمالي للتخرج**: **${progress}%** (متبقي لك **${remainingCredits}** ساعة للحصول على البكالوريوس).

#### 🚀 نصيحة مخصصة لرفع معدلك الحالي (${gpa > 0 ? gpa.toFixed(2) : "0.00"}):
- لتحقيق قفزة نوعية في معدلك التراكمي، استهدف الحصول على تقديرات **A / A+** في المواد المتبقية من فئة الـ 3 و 4 ساعات معتمدة.
- يمكنك استخدام **محاكي المعدل (What-If Simulator)** في صفحة **حاسبة المعدل** لمعاينة تأثير الدرجات المتوقعة فوراً على معدلك التراكمي!`;
  }

  // Check for Personal Completed Courses Query
  if (matchesWords(norm, ["المواد اللي خلصتها", "كورساتي المكتملة", "انجزت ايه", "خلصت كام مادة", "موادي المكتملة"])) {
    if (studentContext && studentContext.completedCourses && studentContext.completedCourses.length > 0) {
      const listText = studentContext.completedCourses.map((c) => {
        const info = COURSES.find((item) => item.code === c.code);
        return `- **[${c.code}] ${info ? info.arabic : c.code}**: تقدير **(${c.grade})**`;
      }).join("\n");

      return `### 📜 قائمة المقررات الدراسية المنجزة بنجاح

لقد أتممت بنجاح **${studentContext.completedCourses.length}** مادة دراسية:

${listText}

> 🎓 المجموع الحالي للساعات المنجزة: **${studentContext.completedCredits} ساعة**. يمكنك دائماً متابعة وتحديث تقديراتك من صفحة **الخطة الدراسية والتقدم**.`;
    } else {
      return `### 📜 المقررات المنجزة بنجاح

لم تقم بتحديد أي مواد منجزة بعد في حسابك. يمكنك الذهاب إلى صفحة **الخطة الدراسية والتقدم** وضع علامة صح (✔) أمام المواد التي اجتزتها لتحديث معدلك والساعات المنجزة فوراً!`;
    }
  }

  // Check for Personal Planned Courses Query
  if (matchesWords(norm, ["المواد المخططة", "المواد المسجلة", "جدولي المخطط", "خطتي القادمة"])) {
    if (studentContext && studentContext.plannedCourses && studentContext.plannedCourses.length > 0) {
      const listText = studentContext.plannedCourses.map((code) => {
        const info = COURSES.find((item) => item.code === code);
        return `- **[${code}] ${info ? info.arabic : code}** (${info ? info.credits : 3} ساعات)`;
      }).join("\n");

      return `### 📌 قائمة المقررات المخططة للتسجيل القادم

لديك **${studentContext.plannedCourses.length}** مادة مضافة إلى مخطط التسجيل الخاص بك:

${listText}

> 💡 يمكنك التوجه فوراً لصفحة **مخطط التسجيل الذكي** لتعديل جدولك ومعاينة العبء الدراسي.`;
    } else {
      return `### 📌 المقررات المخططة للتسجيل

لا توجد مواد مضافة لمخططك الحالي بعد. انتقل لصفحة **مخطط التسجيل الذكي** لإضافة المقررات التي تنوي تسجيلها الفصل القادم!`;
    }
  }

  // B. Try to find a matching course in the faculty database
  const courseMatch = findMatchingCourse(query);
  if (courseMatch) {
    return formatCourseResponse(courseMatch, studentContext);
  }

  // C. Try General Computer Science / Technology Q&A
  const techResponse = handleTechQuery(norm, query);
  if (techResponse) {
    return techResponse;
  }

  // D. General Academic Guidance Topics
  if (matchesWords(norm, ["متطلب", "متطلبات", "شروط", "شرط", "فتح", "مغلقة", "مغلقه", "مفتاح", "prereq", "prerequisite"])) {
    return `### 🔗 اللائحة الأكاديمية للمتطلبات المسبقة (جامعة سيناء)

إليك أهم سلاسل المتطلبات المسبقة الإجبارية التي تحكم تسجيل باقي المقررات:

1. **[CSW 234] برمجة الحاسب (2)** ⬅️ متطلبها: **[CSW 232] برمجة (1)**.
2. **[CSW 221] هياكل البيانات** ⬅️ متطلبها: **[Ma 110] الجبر الخطي**.
3. **[ISD 242] نظم قواعد البيانات** ⬅️ متطلبها: **[CSW 221] هياكل البيانات**.
4. **[INT 341] تكنولوجيا الويب** ⬅️ متطلبها: **[CSW 234] برمجة (2)**.
5. **[CSW 325] المعالجة المتوازية** ⬅️ متطلبها: **[CSW 225] عمارة الحاسب**.
6. **[INT 499] مشروع التخرج (2)** ⬅️ متطلبه: **[INT 498] مشروع (1)**.

> 💡 اسألني عن اسم أي مادة محددة (مثل *"مادة data structure"* أو *"مادة الشبكات"*) وسأعرض لك متطلباتها وتفاصيلها فوراً!`;
  }

  if (matchesWords(norm, ["gpa", "معدل", "المعدل", "تراكمي", "فصلي", "احسب", "حساب", "ارفع", "يرتفع", "تقدير", "نقاط", "انذار", "امتياز"])) {
    const liveGpaText = studentContext && (studentContext.cumulativeGpa ?? 0) > 0
      ? `\n\n> 🎯 **معدلك التراكمي المسجل حالياً في المنصة هو: ${studentContext.cumulativeGpa?.toFixed(2)}**`
      : "";

    return `### 📊 حساب الـ GPA واستراتيجية رفع المعدل التراكمي${liveGpaText}

يتم حساب المعدل في جامعة سيناء بناءً على نظام الساعات المعتمدة والنقاط من **4.00**:

- **A+ / A (4.00)** | ممتاز
- **B+ (3.50) / B (3.00)** | جيد جداً
- **C+ (2.50) / C (2.00)** | جيد إلى مقبول
- **D (1.00)** | الحد الأدنى للنجاح
- **F (0.00)** | رسوب وإعادة للمقرر

#### 🚀 خطتك لرفع الـ GPA الترم القادم:
- سجل مواد اختيارية عامة (HU Courses) لرفع التقدير التراكمي.
- توجه لصفحة **حاسبة المعدل** بالمنصة واستخدم **محاكي الـ What-If** لتحديد الدرجات المطلوبة بالضبط.`;
  }

  if (matchesWords(norm, ["خطة", "خطه", "تسجيل", "سجل", "جدول", "ساعات", "ساعه", "عبء", "ترم", "فصل", "سنة", "سنه"])) {
    return `### 📅 خطة تسجيل جدول دراسي متوازن (15-18 ساعة)

نقترح توزيع جدولك الأكاديمي كالتالي:

- **2 مادة تخصصية برمجية** (مثل برمجة 2 + هياكل بيانات).
- **1 مادة شبكات أو قواعد بيانات** (مثل نظم قواعد البيانات).
- **1 مادة رياضيات أو علوم أساسية** (مثل الرياضيات المتقطعة).
- **1 مادة اختيارية إنسانية** (مثل التفكير الابتكاري لرفع المعدل).

> 💡 توجه إلى **مخطط التسجيل الذكي** لتطبيق خطتك ومراجعة الساعات المتبقية.`;
  }

  if (matchesWords(norm, ["مسار", "مسارات", "تعلم", "شغل", "وظيفة", "وظايف", "فرونت", "باك", "ذكاء", "ai", "frontend", "backend", "roadmap", "تدريب"])) {
    return `### 🎯 ربط المقررات بمسارات التوظيف في سوق العمل

تقدم لك المنصة خراط طريق مهنية تربط مواد الكلية بالمهارات المطلوبة:

1. **Frontend Web Developer**: ربط مادة \`INT 341\` و \`CSW 337\` بـ React و Next.js.
2. **Backend Web Developer**: ربط قواعد البيانات \`ISD 242\` وهياكل البيانات \`CSW 221\` بـ Node.js / Express.
3. **AI & Data Engineering**: ربط الجبر الخطي \`Ma 110\` والذكاء الاصطناعي \`CSW 351\` بـ Python و Machine Learning.

> 🗺️ تصفح التفاصيل الكاملة في صفحة **مسارات خارطة الطريق (Roadmaps)**.`;
  }

  // E. Fallback Intelligent Dynamic Assistant Response
  const userName = studentContext?.userName ? `يا **${studentContext.userName}**` : "";
  return `### 🤖 أهلاً بك ${userName}! أنا مرشدك الأكاديمي والتقني الذكي

لقد استلمت استفسارك: **"${query}"**.

أنا مرتبط مباشرة ببيانات حسابك بالمنصة وبقواعد علوم الحاسب والتكنولوجيا، ويمكنك سؤالي عن:

- 📊 **بياناتك الشخصية المباشرة**: *"الـ GPA بتاعي كام دلوقتي؟"* أو *"ما هي المواد التي أنجزتها؟"*
- 📚 **استفسار عن أي مادة**: *"مادة data structure"* أو *"مادة الشبكات"* أو *"CSW 234"*
- 💻 **الأسئلة التقنية والبرمجية**: *"ما الفرق بين Frontend و Backend؟"* أو *"ما هي أفضل لغة لتعلم الذكاء الاصطناعي؟"*
- 🔗 **المتطلبات ولائحة الكلية**: *"ما هي شروط تكنولوجيا الويب؟"*

اكتب أي سؤال تفكر فيه وسأجيبك بدقة ووضوح!`;
}
