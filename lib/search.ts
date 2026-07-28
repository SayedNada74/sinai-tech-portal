import { Course } from "./courses-data";

export interface SearchResultItem {
  id: string;
  type: "page" | "item" | "action" | "section";
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  path: string;
  actionKey?: string; // For actions like toggle theme
}

// Arabic Text Normalization
export function normalizeSearchText(value: string): string {
  return value.toLowerCase().trim()
    .replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي")
    .replace(/ـ/g, "").replace(/\s+/g, " ");
}

// Get the score for a match
export function getSearchScore(normalizedQuery: string, normalizedText: string): number {
  if (normalizedText === normalizedQuery) return 100;
  if (normalizedText.startsWith(normalizedQuery)) return 70;
  if (normalizedText.includes(normalizedQuery)) return 40;
  return 0;
}

// Perform search
export function performSearch(
  query: string,
  courses: Course[],
  lang: "ar" | "en"
): { item: SearchResultItem; score: number }[] {
  const normQuery = normalizeSearchText(query);
  if (!normQuery) return [];

  // Static Index Items
  const staticIndex: SearchResultItem[] = [
    // Pages
    { id: "p-dashboard", type: "page", titleAr: "لوحة التحكم", titleEn: "Dashboard", descriptionAr: "الملخص الأكاديمي، ساعات التخرج والمهام", descriptionEn: "Academic highlights, graduation hours, and tasks", path: "/dashboard" },
    { id: "p-checklist", type: "page", titleAr: "الخطة الدراسية والتقدم", titleEn: "Curriculum Checklist & Progress", descriptionAr: "تسجيل وحفظ درجات المقررات وساعات الخطة", descriptionEn: "Track finished courses, grade entries, and graduation", path: "/departments" },
    { id: "p-planner", type: "page", titleAr: "مخطط التسجيل الذكي", titleEn: "Smart Registration Planner", descriptionAr: "اقتراح مواد الفصول وتنبيه المتطلبات المسبقة", descriptionEn: "Semester registration helper and prerequisite warnings", path: "/planner" },
    { id: "p-gpa", type: "page", titleAr: "حاسبة المعدل (GPA)", titleEn: "GPA Calculator & Simulator", descriptionAr: "حساب معدل الفصل وتوقع السيناريوهات المطلوبة", descriptionEn: "Calculate semester GPA and simulate Target GPA scenarios", path: "/gpa" },
    { id: "p-courses", type: "page", titleAr: "دليل ومستكشف المواد", titleEn: "Course Explorer & Guide", descriptionAr: "البحث عن متطلبات وتفاصيل المقررات الدراسية", descriptionEn: "Explore requirements and academic courses details", path: "/courses" },
    { id: "p-profile", type: "page", titleAr: "الملف الشخصي", titleEn: "Profile", descriptionAr: "بياناتك، مهاراتك وشاراتك الأكاديمية", descriptionEn: "Student profile, achievements, points, and badges", path: "/profile" },
    { id: "p-settings", type: "page", titleAr: "الإعدادات", titleEn: "Settings", descriptionAr: "المظهر، لغة المنصة وكلمة المرور", descriptionEn: "Theme configs, language options, and security", path: "/settings" },
    { id: "p-ai", type: "page", titleAr: "المرشد الذكي (AI)", titleEn: "AI Academic Assistant", descriptionAr: "طرح أسئلة حول اللوائح ومساعدة الدراسة", descriptionEn: "Chat with virtual guide about regulations and study tips", path: "/ai-assistant" },

    // Actions
    { id: "a-theme-light", type: "action", titleAr: "تفعيل المظهر المضيء", titleEn: "Switch to Light Theme", descriptionAr: "تغيير مظهر المنصة إلى الأبيض المضيء", descriptionEn: "Toggle light theme visual styling", path: "/settings", actionKey: "theme-light" },
    { id: "a-theme-dark", type: "action", titleAr: "تفعيل المظهر الداكن", titleEn: "Switch to Dark Theme", descriptionAr: "تغيير مظهر المنصة إلى الأسود الداكن", descriptionEn: "Toggle dark theme visual styling", path: "/settings", actionKey: "theme-dark" },
    { id: "a-lang-ar", type: "action", titleAr: "تغيير اللغة إلى العربية", titleEn: "Switch Language to Arabic", descriptionAr: "تحويل لغة واجهة النظام إلى العربية", descriptionEn: "Toggle default system language to Arabic", path: "/settings", actionKey: "lang-ar" },
    { id: "a-lang-en", type: "action", titleAr: "تغيير اللغة إلى الإنجليزية", titleEn: "Switch Language to English", descriptionAr: "تحويل لغة واجهة النظام إلى الإنجليزية", descriptionEn: "Toggle default system language to English", path: "/settings", actionKey: "lang-en" },
    { id: "a-logout", type: "action", titleAr: "تسجيل الخروج", titleEn: "Logout from Portal", descriptionAr: "إنهاء جلسة الدخول الحالية بأمان", descriptionEn: "Sign out of your student account securely", path: "/", actionKey: "logout" },

    // Sections
    { id: "s-deadlines", type: "section", titleAr: "مواعيد التسليم القادمة", titleEn: "Upcoming Moodle Deadlines", descriptionAr: "عرض الواجبات والاختبارات القادمة في لوحة التحكم", descriptionEn: "View assignments deadlines on dashboard", path: "/dashboard#deadlines" },
    { id: "s-milestones", type: "section", titleAr: "المحطات الرئيسية للبرنامج", titleEn: "Curriculum Milestones", descriptionAr: "تتبع متطلبات المستوى التأسيسي ومشروع التخرج", descriptionEn: "View level foundation limits and thesis rules", path: "/planner#milestones" }
  ];

  const results: { item: SearchResultItem; score: number }[] = [];

  // 1. Search Static Index
  staticIndex.forEach((item) => {
    const normTitleAr = normalizeSearchText(item.titleAr);
    const normTitleEn = normalizeSearchText(item.titleEn);
    const normDescAr = normalizeSearchText(item.descriptionAr);
    const normDescEn = normalizeSearchText(item.descriptionEn);

    const titleScore = Math.max(
      getSearchScore(normQuery, normTitleAr),
      getSearchScore(normQuery, normTitleEn)
    );

    const descScore = Math.max(
      getSearchScore(normQuery, normDescAr),
      getSearchScore(normQuery, normDescEn)
    ) * 0.6; // weight down description matches

    const maxScore = Math.max(titleScore, descScore);
    if (maxScore > 0) {
      results.push({ item, score: maxScore });
    }
  });

  // 2. Search Dynamic Courses Catalog
  courses.forEach((c) => {
    const normTitleAr = normalizeSearchText(c.arabic);
    const normTitleEn = normalizeSearchText(c.english);
    const normCode = normalizeSearchText(c.code);

    const codeScore = getSearchScore(normQuery, normCode) * 1.2; // code matches are highly relevant
    const titleScore = Math.max(
      getSearchScore(normQuery, normTitleAr),
      getSearchScore(normQuery, normTitleEn)
    );

    const maxScore = Math.max(codeScore, titleScore);
    if (maxScore > 0) {
      results.push({
        item: {
          id: `course-${c.code}`,
          type: "item",
          titleAr: `${c.code} - ${c.arabic}`,
          titleEn: `${c.code} - ${c.english}`,
          descriptionAr: `مقرر دراسي بقسم ${c.department} · ${c.credits} ساعات معتمدة`,
          descriptionEn: `Course under ${c.department} · ${c.credits} Credits`,
          path: `/courses/${c.code}`
        },
        score: maxScore
      });
    }
  });

  // Sort by score descending
  return results.sort((a, b) => b.score - a.score);
}
