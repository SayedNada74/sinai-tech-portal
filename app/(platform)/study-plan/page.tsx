import type { Metadata } from "next";
import Link from "next/link";
import { COURSES, PERIODS } from "@/lib/courses-data";

export const metadata: Metadata = {
  title: "الخطة الدراسية | مواد كلية تكنولوجيا المعلومات جامعة سيناء — 4 سنوات",
  description: "الخطة الدراسية الكاملة لكلية تكنولوجيا المعلومات وعلوم الحاسب بجامعة سيناء: 4 سنوات دراسية (8 فصول) بإجمالي 144 ساعة معتمدة. شجرة المتطلبات السابقة ومواد كل فرقة وفصل دراسي.",
  keywords: ["خطة دراسية جامعة سيناء", "مواد حاسبات جامعة سيناء", "شجرة المتطلبات السابقة", "مواد الفرقة الأولى", "الخطة الأكاديمية", "Study Plan Sinai University", "Curriculum IT Faculty"],
  alternates: {
    canonical: "https://sinai-tech-portal.vercel.app/study-plan",
  },
};

const levels = [
  { level: 1, nameAr: "الفرقة الأولى", nameEn: "Year 1 — Freshman", semesters: ["year-1-sem-1", "year-1-sem-2"] },
  { level: 2, nameAr: "الفرقة الثانية", nameEn: "Year 2 — Sophomore", semesters: ["year-2-sem-1", "year-2-sem-2"] },
  { level: 3, nameAr: "الفرقة الثالثة", nameEn: "Year 3 — Junior", semesters: ["year-3-sem-1", "year-3-sem-2"] },
  { level: 4, nameAr: "الفرقة الرابعة", nameEn: "Year 4 — Senior", semesters: ["year-4-sem-1", "year-4-sem-2"] },
];

export default function StudyPlanPage() {
  const totalCredits = COURSES.reduce((sum, c) => sum + c.credits, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6 text-xs font-medium text-zinc-500 dark:text-zinc-400">
        <ol className="flex items-center gap-1.5 flex-wrap">
          <li><Link href="/" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">الرئيسية</Link></li>
          <li className="text-zinc-300 dark:text-zinc-600">/</li>
          <li className="text-zinc-800 dark:text-zinc-200">الخطة الدراسية</li>
        </ol>
      </nav>

      {/* Page Title */}
      <header className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 leading-tight">
          الخطة الدراسية — كلية تكنولوجيا المعلومات وعلوم الحاسب
        </h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          الخطة الدراسية الكاملة لبرنامج تكنولوجيا المعلومات بجامعة سيناء: 4 سنوات أكاديمية (8 فصول دراسية) بإجمالي <strong>{totalCredits > 0 ? totalCredits : 144} ساعة معتمدة</strong>. اختر الفرقة لعرض تفاصيل المقررات والمتطلبات السابقة.
        </p>
      </header>

      {/* Level Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {levels.map((level) => {
          const levelCourses = COURSES.filter((c) => level.semesters.includes(c.period));
          const levelCredits = levelCourses.reduce((sum, c) => sum + c.credits, 0);

          return (
            <Link
              key={level.level}
              href={`/study-plan/level-${level.level}`}
              className="group p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 hover:border-sky-300 dark:hover:border-sky-700 transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-lg font-black text-sky-600 dark:text-sky-400">
                  {level.level}
                </div>
                <div>
                  <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-100">{level.nameAr}</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{level.nameEn}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                <span>{levelCourses.length} مقرر</span>
                <span className="text-zinc-300 dark:text-zinc-700">|</span>
                <span>{levelCredits} ساعة معتمدة</span>
                <span className="text-zinc-300 dark:text-zinc-700">|</span>
                <span>فصلين دراسيين</span>
              </div>
              <div className="mt-3 text-xs font-bold text-sky-600 dark:text-sky-400 group-hover:underline">
                عرض تفاصيل المقررات →
              </div>
            </Link>
          );
        })}
      </div>

      {/* Summary */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-50 to-indigo-50/50 dark:from-sky-950/30 dark:to-indigo-950/20 border border-sky-200/50 dark:border-sky-800/30 text-center">
        <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-200 mb-2">ملخص متطلبات التخرج</h2>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-4">
          إجمالي {COURSES.length} مقرر دراسي | {totalCredits > 0 ? totalCredits : 144} ساعة معتمدة | 4 سنوات أكاديمية
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/academic-regulations" className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors">اللائحة الأكاديمية</Link>
          <Link href="/gpa" className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-900 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-white text-xs font-bold transition-colors">حاسبة الـ GPA</Link>
          <Link href="/departments" className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold transition-colors">الأقسام العلمية</Link>
        </div>
      </div>
    </div>
  );
}
