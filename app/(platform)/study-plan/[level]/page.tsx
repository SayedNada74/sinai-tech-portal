import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COURSES, PERIODS, getCourseSlug } from "@/lib/courses-data";

const LEVEL_DATA: Record<string, { nameAr: string; nameEn: string; semesters: { id: string; nameAr: string; nameEn: string }[] }> = {
  "level-1": {
    nameAr: "الفرقة الأولى",
    nameEn: "Year 1 — Freshman",
    semesters: [
      { id: "year-1-sem-1", nameAr: "الفصل الدراسي الأول", nameEn: "Fall Semester" },
      { id: "year-1-sem-2", nameAr: "الفصل الدراسي الثاني", nameEn: "Spring Semester" },
    ],
  },
  "level-2": {
    nameAr: "الفرقة الثانية",
    nameEn: "Year 2 — Sophomore",
    semesters: [
      { id: "year-2-sem-1", nameAr: "الفصل الدراسي الأول", nameEn: "Fall Semester" },
      { id: "year-2-sem-2", nameAr: "الفصل الدراسي الثاني", nameEn: "Spring Semester" },
    ],
  },
  "level-3": {
    nameAr: "الفرقة الثالثة",
    nameEn: "Year 3 — Junior",
    semesters: [
      { id: "year-3-sem-1", nameAr: "الفصل الدراسي الأول", nameEn: "Fall Semester" },
      { id: "year-3-sem-2", nameAr: "الفصل الدراسي الثاني", nameEn: "Spring Semester" },
    ],
  },
  "level-4": {
    nameAr: "الفرقة الرابعة",
    nameEn: "Year 4 — Senior",
    semesters: [
      { id: "year-4-sem-1", nameAr: "الفصل الدراسي الأول", nameEn: "Fall Semester" },
      { id: "year-4-sem-2", nameAr: "الفصل الدراسي الثاني", nameEn: "Spring Semester" },
    ],
  },
};

export function generateStaticParams() {
  return [
    { level: "level-1" },
    { level: "level-2" },
    { level: "level-3" },
    { level: "level-4" },
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ level: string }> }): Promise<Metadata> {
  const { level } = await params;
  const data = LEVEL_DATA[level];
  if (!data) return {};

  const levelCourses = COURSES.filter((c) => data.semesters.some((s) => s.id === c.period));
  const courseNames = levelCourses.slice(0, 5).map((c) => c.arabic).join("، ");

  return {
    title: `مواد ${data.nameAr} | الخطة الدراسية — كلية تكنولوجيا المعلومات جامعة سيناء`,
    description: `مقررات ${data.nameAr} بكلية تكنولوجيا المعلومات وعلوم الحاسب جامعة سيناء: ${courseNames} وغيرها. ${levelCourses.length} مقرر بإجمالي ${levelCourses.reduce((s, c) => s + c.credits, 0)} ساعة معتمدة.`,
    keywords: [`مواد ${data.nameAr} جامعة سيناء`, `مقررات ${data.nameAr}`, `${data.nameEn} courses`, "خطة دراسية جامعة سيناء"],
    alternates: {
      canonical: `https://sinai-tech-portal.vercel.app/study-plan/${level}`,
    },
  };
}

export default async function StudyPlanLevelPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  const data = LEVEL_DATA[level];
  if (!data) notFound();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://sinai-tech-portal.vercel.app/" },
      { "@type": "ListItem", "position": 2, "name": "الخطة الدراسية", "item": "https://sinai-tech-portal.vercel.app/study-plan" },
      { "@type": "ListItem", "position": 3, "name": data.nameAr, "item": `https://sinai-tech-portal.vercel.app/study-plan/${level}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li><Link href="/" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">الرئيسية</Link></li>
            <li className="text-zinc-300 dark:text-zinc-600">/</li>
            <li><Link href="/study-plan" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">الخطة الدراسية</Link></li>
            <li className="text-zinc-300 dark:text-zinc-600">/</li>
            <li className="text-zinc-800 dark:text-zinc-200">{data.nameAr}</li>
          </ol>
        </nav>

        {/* Page Title */}
        <header className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 leading-tight">
            مقررات {data.nameAr} — كلية تكنولوجيا المعلومات جامعة سيناء
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{data.nameEn}</p>
        </header>

        {/* Semesters */}
        {data.semesters.map((semester) => {
          const semCourses = COURSES.filter((c) => c.period === semester.id);
          const semCredits = semCourses.reduce((sum, c) => sum + c.credits, 0);

          return (
            <section key={semester.id} className="mb-10">
              <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-50 mb-1">{semester.nameAr}</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">{semester.nameEn} • {semCourses.length} مقرر • {semCredits} ساعة معتمدة</p>

              <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
                      <th className="px-3 py-2.5 text-right font-bold">الكود</th>
                      <th className="px-3 py-2.5 text-right font-bold">اسم المقرر</th>
                      <th className="px-3 py-2.5 text-center font-bold">الساعات</th>
                      <th className="px-3 py-2.5 text-right font-bold">المتطلبات السابقة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {semCourses.map((course) => (
                      <tr key={course.code} className="text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/40">
                        <td className="px-3 py-2.5">
                          <Link href={`/courses/${getCourseSlug(course)}`} className="font-mono font-bold text-sky-600 dark:text-sky-400 hover:underline">
                            {course.code}
                          </Link>
                        </td>
                        <td className="px-3 py-2.5">
                          <Link href={`/courses/${getCourseSlug(course)}`} className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                            <div className="font-semibold">{course.arabic}</div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400">{course.english}</div>
                          </Link>
                        </td>
                        <td className="px-3 py-2.5 text-center font-bold">{course.credits}</td>
                        <td className="px-3 py-2.5 text-xs">
                          {course.prerequisites.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {course.prerequisites.map((prereq) => {
                                const prereqCourse = COURSES.find((c) => c.code === prereq);
                                return prereqCourse ? (
                                  <Link key={prereq} href={`/courses/${getCourseSlug(prereqCourse)}`} className="px-1.5 py-0.5 rounded-md bg-amber-100/60 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-mono font-bold hover:underline text-[10px]">
                                    {prereq}
                                  </Link>
                                ) : (
                                  <span key={prereq} className="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-mono text-[10px]">{prereq}</span>
                                );
                              })}
                            </div>
                          ) : (
                            <span className="text-zinc-400 dark:text-zinc-600">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}

        {/* Navigation Between Levels */}
        <div className="flex justify-between items-center pt-6 border-t border-zinc-200 dark:border-zinc-800">
          {level !== "level-1" ? (
            <Link href={`/study-plan/level-${parseInt(level.replace("level-", "")) - 1}`} className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline">
              ← الفرقة السابقة
            </Link>
          ) : <span />}
          {level !== "level-4" ? (
            <Link href={`/study-plan/level-${parseInt(level.replace("level-", "")) + 1}`} className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline">
              الفرقة التالية →
            </Link>
          ) : <span />}
        </div>
      </div>
    </>
  );
}
