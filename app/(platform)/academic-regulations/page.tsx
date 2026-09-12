import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "اللائحة الأكاديمية | نظام الساعات المعتمدة ومتطلبات التخرج - كلية تكنولوجيا المعلومات جامعة سيناء",
  description: "اللائحة الأكاديمية الرسمية لكلية تكنولوجيا المعلومات وعلوم الحاسب بجامعة سيناء: نظام الساعات المعتمدة، متطلبات التخرج 144 ساعة معتمدة، جدول التقديرات والنقاط من 4.0، الإنذار الأكاديمي، مرتبة الشرف، قواعد الحضور والغياب، وتوزيع الدرجات.",
  keywords: ["لائحة حاسبات جامعة سيناء", "نظام الساعات المعتمدة", "متطلبات التخرج جامعة سيناء", "144 ساعة معتمدة", "جدول التقديرات", "الإنذار الأكاديمي جامعة سيناء", "مرتبة الشرف", "GPA Scale Sinai University", "Academic Regulations"],
  alternates: {
    canonical: "https://sinai-tech-portal.vercel.app/academic-regulations",
  },
  openGraph: {
    title: "اللائحة الأكاديمية - كلية تكنولوجيا المعلومات جامعة سيناء",
    description: "نظام الساعات المعتمدة، متطلبات التخرج 144 ساعة، جدول التقديرات والنقاط، الإنذار الأكاديمي، ومرتبة الشرف لطلاب كلية تكنولوجيا المعلومات بجامعة سيناء.",
    url: "https://sinai-tech-portal.vercel.app/academic-regulations",
    type: "article",
  },
};

const gradeScale = [
  { grade: "A+", points: "4.0", percentage: "95% فأكثر", color: "text-emerald-600 dark:text-emerald-400" },
  { grade: "A", points: "3.8", percentage: "90% - أقل من 95%", color: "text-emerald-600 dark:text-emerald-400" },
  { grade: "A-", points: "3.6", percentage: "85% - أقل من 90%", color: "text-emerald-500 dark:text-emerald-400" },
  { grade: "B+", points: "3.3", percentage: "80% - أقل من 85%", color: "text-sky-600 dark:text-sky-400" },
  { grade: "B", points: "3.0", percentage: "75% - أقل من 80%", color: "text-sky-600 dark:text-sky-400" },
  { grade: "C+", points: "2.7", percentage: "70% - أقل من 75%", color: "text-amber-600 dark:text-amber-400" },
  { grade: "C", points: "2.4", percentage: "65% - أقل من 70%", color: "text-amber-600 dark:text-amber-400" },
  { grade: "D+", points: "2.0", percentage: "60% - أقل من 65%", color: "text-orange-600 dark:text-orange-400" },
  { grade: "F", points: "0.0", percentage: "أقل من 60%", color: "text-red-600 dark:text-red-400" },
];

const creditRequirements = [
  { category: "متطلبات الجامعة", required: 12, elective: 0, total: 12 },
  { category: "متطلبات الكلية (إجباري)", required: 66, elective: 0, total: 66 },
  { category: "متطلبات الكلية (اختياري)", required: 0, elective: 6, total: 6 },
  { category: "متطلبات التخصص (إجباري)", required: 45, elective: 0, total: 45 },
  { category: "متطلبات التخصص (اختياري)", required: 0, elective: 15, total: 15 },
];

export default function AcademicRegulationsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "اللائحة الأكاديمية - كلية تكنولوجيا المعلومات وعلوم الحاسب بجامعة سيناء",
    "description": "اللائحة الأكاديمية الرسمية لنظام الساعات المعتمدة ومتطلبات التخرج والتقديرات والإنذار الأكاديمي",
    "author": { "@type": "EducationalOrganization", "name": "كلية تكنولوجيا المعلومات وعلوم الحاسب - جامعة سيناء" },
    "publisher": { "@id": "https://sinai-tech-portal.vercel.app/#organization" },
    "mainEntityOfPage": "https://sinai-tech-portal.vercel.app/academic-regulations",
    "inLanguage": "ar",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li><Link href="/" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">الرئيسية</Link></li>
            <li className="text-zinc-300 dark:text-zinc-600">/</li>
            <li className="text-zinc-800 dark:text-zinc-200">اللائحة الأكاديمية</li>
          </ol>
        </nav>

        {/* Page Title */}
        <header className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 leading-tight">
            اللائحة الأكاديمية لكلية تكنولوجيا المعلومات وعلوم الحاسب
          </h1>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
            الدليل الرسمي الشامل لنظام الساعات المعتمدة ومتطلبات التخرج وجدول التقديرات والنقاط والإنذار الأكاديمي وقواعد الحضور والغياب بجامعة سيناء — فرع القنطرة.
          </p>
        </header>

        {/* Quick Navigation */}
        <nav className="mb-10 p-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-200/50 dark:border-sky-800/30">
          <h2 className="text-sm font-bold text-sky-800 dark:text-sky-300 mb-3">📋 محتويات الصفحة</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs font-semibold">
            {[
              { href: "#credit-hours", label: "نظام الساعات المعتمدة" },
              { href: "#graduation-requirements", label: "متطلبات التخرج (144 ساعة)" },
              { href: "#course-load", label: "العبء الدراسي والتسجيل" },
              { href: "#grading-scale", label: "نظام التقويم والنقاط" },
              { href: "#gpa-calculation", label: "حساب المعدل التراكمي (GPA)" },
              { href: "#academic-warning", label: "الإنذار الأكاديمي والفصل" },
              { href: "#attendance", label: "قواعد المواظبة والغياب" },
              { href: "#grade-distribution", label: "توزيع درجات المقرر" },
              { href: "#honors", label: "مرتبة الشرف وقائمة الشرف" },
            ].map((item) => (
              <li key={item.href}>
                <a href={item.href} className="block p-2 rounded-lg hover:bg-sky-100/70 dark:hover:bg-sky-900/30 text-sky-700 dark:text-sky-400 transition-colors">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* === Section 1: Credit Hours System === */}
        <section id="credit-hours" className="mb-12 scroll-mt-24">
          <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            نظام الساعات المعتمدة
          </h2>
          <div className="prose-sm text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-3">
            <p>تعتمد كلية تكنولوجيا المعلومات وعلوم الحاسب بجامعة سيناء فرع القنطرة نظام <strong>الساعات المعتمدة</strong> (Credit Hours System) في الدراسة، وهو النظام المطبق في الجامعات المتقدمة عالمياً.</p>
            <p>يقوم نظام الساعات المعتمدة على أساس دراسة الطالب مجموعة من المقررات محددة بساعات معتمدة وفقاً للائحة يحصل بها على الشهادة الجامعية في تخصصه.</p>
            <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-100 mt-4">مزايا نظام الساعات المعتمدة</h3>
            <ul className="list-disc list-inside space-y-1.5 mr-2">
              <li>حرية الطالب في اختيار المواد التي يرغب في دراستها كل فصل بمساعدة مرشده الأكاديمي.</li>
              <li>حرية الطالب في تخفيض عدد المواد إذا وُجدت لديه ظروف تستدعي ذلك.</li>
              <li>إمكانية زيادة الساعات المعتمدة إذا حصل الطالب على معدل تراكمي مرتفع (3.0 أو أعلى).</li>
              <li>دراسة مواد في الفصل الصيفي للتخفيف من العبء أو لتحسين المعدل.</li>
              <li>سهولة التحويل إلى أي جامعة أجنبية تطبق ذات النظام.</li>
              <li>إمكانية إنهاء الدراسة في أقل من المدة النمطية (4 سنوات).</li>
            </ul>
          </div>
        </section>

        {/* === Section 2: Graduation Requirements === */}
        <section id="graduation-requirements" className="mb-12 scroll-mt-24">
          <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            متطلبات التخرج — 144 ساعة معتمدة
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">يجب على الطالب إتمام 144 ساعة معتمدة للحصول على درجة البكالوريوس، موزعة كالتالي:</p>
          <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
                  <th className="px-4 py-2.5 text-right font-bold">الفئة</th>
                  <th className="px-4 py-2.5 text-center font-bold">إجباري</th>
                  <th className="px-4 py-2.5 text-center font-bold">اختياري</th>
                  <th className="px-4 py-2.5 text-center font-bold">الإجمالي</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {creditRequirements.map((row) => (
                  <tr key={row.category} className="text-zinc-700 dark:text-zinc-300">
                    <td className="px-4 py-2.5 font-semibold">{row.category}</td>
                    <td className="px-4 py-2.5 text-center">{row.required || "—"}</td>
                    <td className="px-4 py-2.5 text-center">{row.elective || "—"}</td>
                    <td className="px-4 py-2.5 text-center font-bold">{row.total}</td>
                  </tr>
                ))}
                <tr className="bg-sky-50/60 dark:bg-sky-950/20 font-black text-sky-800 dark:text-sky-300">
                  <td className="px-4 py-2.5">إجمالي متطلبات التخرج</td>
                  <td className="px-4 py-2.5 text-center">117</td>
                  <td className="px-4 py-2.5 text-center">27</td>
                  <td className="px-4 py-2.5 text-center">144</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">لغة الدراسة الأساسية هي اللغة الإنجليزية، ويكون أداء الامتحان باللغة الإنجليزية.</p>
        </section>

        {/* === Section 3: Course Load === */}
        <section id="course-load" className="mb-12 scroll-mt-24">
          <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            العبء الدراسي والتسجيل
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {[
              { label: "الحد الأدنى", value: "12", unit: "ساعة / فصل", color: "border-amber-300 dark:border-amber-700" },
              { label: "العبء العادي", value: "18", unit: "ساعة / فصل", color: "border-sky-300 dark:border-sky-700" },
              { label: "الحد الأقصى", value: "21", unit: "ساعة / فصل", color: "border-emerald-300 dark:border-emerald-700" },
            ].map((item) => (
              <div key={item.label} className={`p-4 rounded-xl bg-white dark:bg-zinc-900 border-2 ${item.color} text-center`}>
                <div className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{item.value}</div>
                <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mt-1">{item.unit}</div>
                <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>
          <div className="text-sm text-zinc-700 dark:text-zinc-300 space-y-2 leading-relaxed">
            <p>• <strong>الفصل الصيفي:</strong> يجوز تسجيل حتى 9 ساعات معتمدة (12 ساعة للطالب الخريج)، ومدته 8 أسابيع دراسية بساعات مضاعفة.</p>
            <p>• يجوز للطالب تسجيل الحد الأقصى إذا كان معدله التراكمي 3.0 أو أعلى وموافقة المرشد الأكاديمي.</p>
            <p>• <strong>التسجيل المتأخر:</strong> يجوز التسجيل خلال الأسبوع الأول من بدء الدراسة بموافقة المرشد الأكاديمي ورئيس مجلس القسم.</p>
          </div>
        </section>

        {/* === Section 4: Grading Scale === */}
        <section id="grading-scale" className="mb-12 scroll-mt-24">
          <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            نظام التقويم والنقاط (Grading Scale)
          </h2>
          <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
                  <th className="px-4 py-2.5 text-center font-bold">التقدير</th>
                  <th className="px-4 py-2.5 text-center font-bold">النقاط</th>
                  <th className="px-4 py-2.5 text-center font-bold">النسبة المئوية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {gradeScale.map((row) => (
                  <tr key={row.grade} className="text-zinc-700 dark:text-zinc-300">
                    <td className={`px-4 py-2 text-center font-black text-base ${row.color}`}>{row.grade}</td>
                    <td className="px-4 py-2 text-center font-bold">{row.points}</td>
                    <td className="px-4 py-2 text-center text-xs">{row.percentage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">الحد الأدنى للنجاح في المقرر الدراسي هو 60% من الدرجة النهائية.</p>
        </section>

        {/* === Section 5: GPA Calculation === */}
        <section id="gpa-calculation" className="mb-12 scroll-mt-24">
          <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            حساب المعدل التراكمي (GPA)
          </h2>
          <div className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-3">
            <p>يتم حساب المعدل التراكمي (GPA) بضرب قيمة تقدير كل مقرر دراسي (النقاط) في عدد الساعات المعتمدة لهذا المقرر، ثم جمع نقاط كل المقررات، ثم قسمة المجموع على إجمالي الساعات المسجلة:</p>
            <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-center font-bold text-base text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800">
              المعدل التراكمي = مجموع (نقاط المقرر × ساعات المقرر) ÷ إجمالي الساعات المسجلة
            </div>
            <p>
              يمكنك حساب معدلك التراكمي والفصلي باستخدام{" "}
              <Link href="/gpa" className="text-sky-600 dark:text-sky-400 font-bold hover:underline">حاسبة الـ GPA</Link>
              {" "}المدمجة في المنصة.
            </p>
          </div>
        </section>

        {/* === Section 6: Academic Warning === */}
        <section id="academic-warning" className="mb-12 scroll-mt-24">
          <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            الإنذار الأكاديمي والفصل
          </h2>
          <div className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-3">
            <div className="p-4 rounded-xl bg-red-50/60 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/30">
              <p className="font-bold text-red-800 dark:text-red-300 mb-2">⚠️ شروط الإنذار الأكاديمي</p>
              <p>إذا انخفض المعدل التراكمي للطالب عن <strong>2.0 نقطة</strong>، يوضع تحت الإنذار الأكاديمي ويتم إخطاره رسمياً بذلك.</p>
            </div>
            <p>يُعطى الطالب فرصة <strong>فصلين دراسيين</strong> (ليس منهما الفصل الصيفي) لتعديل وضعه ليصبح معدله التراكمي 2.0 أو أكثر.</p>
            <p>يُفصل الطالب إذا لم يستطع رفع معدله التراكمي خلال <strong>أربع فصول متتالية</strong>. يجوز لمجلس الكلية منح الطالب فرصة استثنائية بعذر مقبول.</p>
          </div>
        </section>

        {/* === Section 7: Attendance === */}
        <section id="attendance" className="mb-12 scroll-mt-24">
          <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            قواعد المواظبة والغياب
          </h2>
          <div className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-3">
            <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30">
              <p className="font-bold text-amber-800 dark:text-amber-300 mb-1">📋 نسبة الحضور المطلوبة: 75% على الأقل</p>
              <p className="text-xs text-amber-700 dark:text-amber-400">الدراسة بالكلية نظامية ولا يجوز فيها الانتساب الدراسي.</p>
            </div>
            <ul className="list-disc list-inside space-y-1.5 mr-2">
              <li>يتطلب دخول الطالب للامتحان النهائي تحقيق نسبة حضور لا تقل عن <strong>75%</strong> من المحاضرات في كل مقرر.</li>
              <li>إذا تجاوزت نسبة غياب الطالب <strong>25%</strong> بدون عذر مقبول، يحق لمجلس الكلية حرمانه من دخول الامتحان النهائي ويُعطى درجة &quot;صفر&quot;.</li>
              <li>الطالب الذي يتغيب عن الامتحان النهائي بدون عذر مقبول يُعطى درجة &quot;صفر&quot; ويُعد راسباً في هذا المقرر.</li>
              <li>يُحتسب للطالب تقدير &quot;غير مكتمل&quot; إذا تقدم بعذر قهري يقبله مجلس الكلية خلال يومين من الامتحانات النهائية.</li>
            </ul>
          </div>
        </section>

        {/* === Section 8: Grade Distribution === */}
        <section id="grade-distribution" className="mb-12 scroll-mt-24">
          <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            توزيع درجات المقرر
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 mb-2">المقرر العادي (100 درجة)</h3>
              <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                <li>• <strong>أعمال فصلية:</strong> 40%</li>
                <li>• <strong>الامتحان النهائي:</strong> 60% </li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200 mb-2">مادة المشروع</h3>
              <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                <li>• <strong>أعمال سنة:(امتحان عملي او بروجكت ب 10 او 15)</strong> 40%</li>
                <li>• <strong>الامتحان النهائي:</strong> 60%</li>
              </ul>
            </div>
          </div>
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">مدة الامتحان التحريري 3 ساعات، ماعدا مقررات&quot;حقوق الإنسان وتاريخ سيناء&quot; فمدتهم ساعتان فقط.</p>
        </section>

        {/* === Section 9: Honors === */}
        <section id="honors" className="mb-12 scroll-mt-24">
          <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 mb-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
            مرتبة الشرف وقائمة الشرف
          </h2>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 text-center">
                <div className="text-lg font-black text-amber-700 dark:text-amber-400">3.8+</div>
                <div className="text-xs font-bold text-amber-600 dark:text-amber-500 mt-1">مرتبة الشرف الأولى</div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-100/60 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50 text-center">
                <div className="text-lg font-black text-zinc-700 dark:text-zinc-300">3.6+</div>
                <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mt-1">مرتبة الشرف الثانية</div>
              </div>
              <div className="p-4 rounded-xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-200/50 dark:border-sky-800/30 text-center">
                <div className="text-lg font-black text-sky-700 dark:text-sky-400">3.0+</div>
                <div className="text-xs font-bold text-sky-600 dark:text-sky-500 mt-1">قائمة شرف العميد</div>
              </div>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">شرط الحصول على مرتبة الشرف: ألا يكون الطالب قد رسب في أي مقرر درسه، مع الحصول على تقدير لا يقل عن &quot;جيد جداً&quot; في كل مستوى دراسي.</p>
          </div>
        </section>

        {/* === Footer CTA === */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-50 to-indigo-50/50 dark:from-sky-950/30 dark:to-indigo-950/20 border border-sky-200/50 dark:border-sky-800/30 text-center">
          <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-200 mb-2">أدوات أكاديمية متكاملة</h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-4">استخدم أدوات المنصة لتتبع تقدمك الأكاديمي بناءً على هذه اللائحة الرسمية.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/gpa" className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors">حاسبة الـ GPA</Link>
            <Link href="/courses" className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-900 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-white text-xs font-bold transition-colors">دليل المقررات</Link>
            <Link href="/study-plan" className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold transition-colors">الخطة الدراسية</Link>
          </div>
        </div>
      </div>
    </>
  );
}
