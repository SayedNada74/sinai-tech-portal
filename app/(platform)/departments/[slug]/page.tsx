import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COURSES, getCourseSlug, PERIODS } from "@/lib/courses-data";

interface DepartmentInfo {
  nameAr: string;
  nameEn: string;
  prefix: string[];
  department: string;
  descriptionAr: string;
  descriptionEn: string;
  careers: string[];
}

const DEPARTMENTS: Record<string, DepartmentInfo> = {
  "information-technology": {
    nameAr: "قسم تكنولوجيا المعلومات",
    nameEn: "Information Technology (IT)",
    prefix: ["INT"],
    department: "IT",
    descriptionAr: "يُعنى قسم تكنولوجيا المعلومات بدراسة الشبكات والاتصالات والوسائط المتعددة وأمن المعلومات ومعالجة الصور والإشارات الرقمية. يُعد القسم الطلاب لسوق العمل في مجالات إدارة الشبكات والأمن السيبراني وتكنولوجيا الويب.",
    descriptionEn: "The IT department focuses on networks, communications, multimedia, information security, image and signal processing. Prepares students for careers in network administration, cybersecurity, and web technologies.",
    careers: ["مهندس شبكات", "أخصائي أمن معلومات", "مطور ويب", "أخصائي وسائط متعددة", "مهندس اتصالات", "Network Engineer", "Cybersecurity Analyst"],
  },
  "computer-science": {
    nameAr: "قسم علوم الحاسب والبرمجيات",
    nameEn: "Computer Science (CS)",
    prefix: ["CSW"],
    department: "CS",
    descriptionAr: "يُعنى قسم علوم الحاسب بدراسة البرمجة وهياكل البيانات والخوارزميات وهندسة البرمجيات والذكاء الاصطناعي ونظم التشغيل والمعالجة المتوازية. يُعد القسم الطلاب لسوق العمل في مجالات تطوير البرمجيات والذكاء الاصطناعي.",
    descriptionEn: "The CS department covers programming, data structures, algorithms, software engineering, AI, operating systems, and parallel processing. Prepares students for software development and AI careers.",
    careers: ["مهندس برمجيات", "مطور تطبيقات", "باحث ذكاء اصطناعي", "مهندس نظم", "مطور ألعاب", "Software Engineer", "AI/ML Engineer"],
  },
  "information-systems": {
    nameAr: "قسم نظم المعلومات",
    nameEn: "Information Systems (IS)",
    prefix: ["ISD"],
    department: "IS",
    descriptionAr: "يُعنى قسم نظم المعلومات بدراسة قواعد البيانات وبحوث العمليات والمعلوماتية ونظم إدارة المعلومات. يُعد القسم الطلاب لسوق العمل في مجالات تحليل البيانات وإدارة قواعد البيانات وتحليل الأعمال.",
    descriptionEn: "The IS department focuses on databases, operations research, informatics, and information management systems. Prepares students for data analysis, database administration, and business analysis careers.",
    careers: ["محلل بيانات", "مدير قواعد بيانات", "محلل أعمال", "مطور نظم معلومات", "Data Analyst", "Database Administrator", "Business Analyst"],
  },
};

export function generateStaticParams() {
  return [
    { slug: "information-technology" },
    { slug: "computer-science" },
    { slug: "information-systems" },
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const dept = DEPARTMENTS[slug];
  if (!dept) return {};

  const deptCourses = COURSES.filter((c) => c.department === dept.department);

  return {
    title: `${dept.nameAr} | كلية تكنولوجيا المعلومات وعلوم الحاسب — جامعة سيناء`,
    description: `${dept.descriptionAr} ${deptCourses.length} مقرر دراسي بإجمالي ${deptCourses.reduce((s, c) => s + c.credits, 0)} ساعة معتمدة.`,
    keywords: [`${dept.nameAr} جامعة سيناء`, `قسم ${dept.nameEn}`, `مواد ${dept.nameAr}`, `${dept.department} courses Sinai University`],
    alternates: {
      canonical: `https://sinai-tech-portal.vercel.app/departments/${slug}`,
    },
  };
}

const PERIODS_AR: Record<string, string> = {
  "year-1-sem-1": "الفرقة الأولى - الفصل الأول",
  "year-1-sem-2": "الفرقة الأولى - الفصل الثاني",
  "year-2-sem-1": "الفرقة الثانية - الفصل الأول",
  "year-2-sem-2": "الفرقة الثانية - الفصل الثاني",
  "year-3-sem-1": "الفرقة الثالثة - الفصل الأول",
  "year-3-sem-2": "الفرقة الثالثة - الفصل الثاني",
  "year-4-sem-1": "الفرقة الرابعة - الفصل الأول",
  "year-4-sem-2": "الفرقة الرابعة - الفصل الثاني",
};

export default async function DepartmentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dept = DEPARTMENTS[slug];
  if (!dept) notFound();

  const deptCourses = COURSES.filter((c) => c.department === dept.department);
  const totalCredits = deptCourses.reduce((sum, c) => sum + c.credits, 0);

  // Group courses by period
  const coursesByPeriod = new Map<string, typeof deptCourses>();
  deptCourses.forEach((c) => {
    if (!coursesByPeriod.has(c.period)) coursesByPeriod.set(c.period, []);
    coursesByPeriod.get(c.period)!.push(c);
  });
  const sortedPeriods = Array.from(coursesByPeriod.keys()).sort();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://sinai-tech-portal.vercel.app/" },
      { "@type": "ListItem", "position": 2, "name": "الأقسام العلمية", "item": "https://sinai-tech-portal.vercel.app/departments" },
      { "@type": "ListItem", "position": 3, "name": dept.nameAr, "item": `https://sinai-tech-portal.vercel.app/departments/${slug}` },
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
            <li><Link href="/departments" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">الأقسام العلمية</Link></li>
            <li className="text-zinc-300 dark:text-zinc-600">/</li>
            <li className="text-zinc-800 dark:text-zinc-200">{dept.nameAr}</li>
          </ol>
        </nav>

        {/* Page Title */}
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 leading-tight">
            {dept.nameAr}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{dept.nameEn}</p>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">{dept.descriptionAr}</p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
            <div className="text-xl font-black text-sky-600 dark:text-sky-400">{deptCourses.length}</div>
            <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400">مقرر دراسي</div>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
            <div className="text-xl font-black text-sky-600 dark:text-sky-400">{totalCredits}</div>
            <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400">ساعة معتمدة</div>
          </div>
          <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
            <div className="text-xl font-black text-sky-600 dark:text-sky-400">{sortedPeriods.length}</div>
            <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400">فصل دراسي</div>
          </div>
        </div>

        {/* Courses by Period */}
        {sortedPeriods.map((period) => {
          const courses = coursesByPeriod.get(period)!;
          return (
            <section key={period} className="mb-8">
              <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-100 mb-3">
                {PERIODS_AR[period] || period}
              </h2>
              <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
                <table className="w-full text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
                      <th className="px-3 py-2 text-right font-bold">الكود</th>
                      <th className="px-3 py-2 text-right font-bold">اسم المقرر</th>
                      <th className="px-3 py-2 text-center font-bold">الساعات</th>
                      <th className="px-3 py-2 text-right font-bold">المتطلبات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {courses.map((course) => (
                      <tr key={course.code} className="text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/40">
                        <td className="px-3 py-2">
                          <Link href={`/courses/${getCourseSlug(course)}`} className="font-mono font-bold text-sky-600 dark:text-sky-400 hover:underline text-xs">
                            {course.code}
                          </Link>
                        </td>
                        <td className="px-3 py-2">
                          <div className="font-semibold text-xs">{course.arabic}</div>
                          <div className="text-[10px] text-zinc-500 dark:text-zinc-400">{course.english}</div>
                        </td>
                        <td className="px-3 py-2 text-center font-bold">{course.credits}</td>
                        <td className="px-3 py-2 text-[10px]">
                          {course.prerequisites.length > 0
                            ? course.prerequisites.join(", ")
                            : <span className="text-zinc-400">—</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}

        {/* Career Paths */}
        <section className="mb-8">
          <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-50 mb-3">مجالات العمل لخريجي القسم</h2>
          <div className="flex flex-wrap gap-2">
            {dept.careers.map((career) => (
              <span key={career} className="px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-900/20 border border-sky-200/50 dark:border-sky-800/30 text-xs font-bold text-sky-700 dark:text-sky-400">
                {career}
              </span>
            ))}
          </div>
        </section>

        {/* Related Links */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-50 to-indigo-50/50 dark:from-sky-950/30 dark:to-indigo-950/20 border border-sky-200/50 dark:border-sky-800/30 text-center">
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/study-plan" className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors">الخطة الدراسية الكاملة</Link>
            <Link href="/courses" className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-900 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-white text-xs font-bold transition-colors">جميع المقررات</Link>
            <Link href="/gpa" className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold transition-colors">حاسبة GPA</Link>
          </div>
        </div>
      </div>
    </>
  );
}
