import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة | دليل طلاب كلية تكنولوجيا المعلومات جامعة سيناء",
  description: "إجابات شاملة على الأسئلة الشائعة لطلاب كلية تكنولوجيا المعلومات وعلوم الحاسب بجامعة سيناء: حساب GPA، متطلبات التخرج، الإنذار الأكاديمي، مرتبة الشرف، الفصل الصيفي، K-Moodle، والمتطلبات السابقة.",
  keywords: ["أسئلة شائعة جامعة سيناء", "دليل طلاب حاسبات", "كيف أحسب GPA", "متطلبات التخرج جامعة سيناء", "مرتبة الشرف سيناء", "الإنذار الأكاديمي", "FAQ Sinai University"],
  alternates: {
    canonical: "https://sinai-tech-portal.vercel.app/faq",
  },
};

const faqs = [
  {
    question: "كيف أحسب المعدل التراكمي (GPA) في جامعة سيناء؟",
    answer: "يتم حساب المعدل التراكمي بضرب نقاط تقدير كل مقرر في عدد ساعاته المعتمدة، ثم جمع كل النقاط وقسمتها على إجمالي الساعات المسجلة. يمكنك استخدام حاسبة الـ GPA المدمجة في المنصة لحساب معدلك بدقة وفق نظام النقاط الرسمي لجامعة سيناء (4.0).",
    link: "/gpa",
    linkText: "استخدم حاسبة الـ GPA",
  },
  {
    question: "كم عدد الساعات المعتمدة المطلوبة للتخرج من كلية تكنولوجيا المعلومات؟",
    answer: "يحتاج الطالب لإتمام 144 ساعة معتمدة للحصول على درجة البكالوريوس، موزعة كالتالي: 12 ساعة متطلبات جامعة، 72 ساعة متطلبات كلية (66 إجباري + 6 اختياري)، و60 ساعة متطلبات تخصص (45 إجباري + 15 اختياري).",
    link: "/academic-regulations#graduation-requirements",
    linkText: "اطلع على التفاصيل",
  },
  {
    question: "ما هي شروط الحصول على مرتبة الشرف؟",
    answer: "مرتبة الشرف الأولى تتطلب معدل تراكمي لا يقل عن 3.8 نقطة، ومرتبة الشرف الثانية تتطلب معدل لا يقل عن 3.6 نقطة. شرط أساسي: ألا يكون الطالب قد رسب في أي مقرر درسه، مع الحصول على تقدير لا يقل عن جيد جداً في كل مستوى دراسي.",
    link: "/academic-regulations#honors",
    linkText: "اقرأ المزيد عن مرتبة الشرف",
  },
  {
    question: "متى يحصل الطالب على إنذار أكاديمي؟",
    answer: "يوضع الطالب تحت الإنذار الأكاديمي إذا انخفض معدله التراكمي عن 2.0 نقطة. يُمنح فرصة فصلين دراسيين (ليس منهما الفصل الصيفي) لرفع معدله. يُفصل الطالب إذا لم يستطع رفع معدله خلال 4 فصول متتالية.",
    link: "/academic-regulations#academic-warning",
    linkText: "تفاصيل الإنذار الأكاديمي",
  },
  {
    question: "ما هي المتطلبات السابقة لمادة هياكل البيانات (Data Structures)؟",
    answer: "مادة هياكل البيانات (CSW 221) تتطلب اجتياز مادة الجبر الخطي (Ma 110) كمتطلب سابق. يمكنك الاطلاع على المتطلبات السابقة لجميع المواد من خلال دليل المقررات.",
    link: "/courses/csw-221",
    linkText: "تفاصيل مادة Data Structures",
  },
  {
    question: "كم ساعة يمكنني تسجيلها في الفصل الصيفي؟",
    answer: "الحد الأقصى للتسجيل في الفصل الصيفي هو 9 ساعات معتمدة للطلاب العاديين، و12 ساعة للطالب الخريج. مدة الفصل الصيفي 8 أسابيع دراسية بساعات مضاعفة.",
    link: "/academic-regulations#course-load",
    linkText: "العبء الدراسي والتسجيل",
  },
  {
    question: "ما هو الحد الأدنى لنسبة الحضور المطلوبة؟",
    answer: "يتطلب دخول الامتحان النهائي تحقيق نسبة حضور لا تقل عن 75% من المحاضرات في كل مقرر. إذا تجاوزت نسبة غياب الطالب 25% بدون عذر مقبول، يحق لمجلس الكلية حرمانه من دخول الامتحان النهائي.",
    link: "/academic-regulations#attendance",
    linkText: "قواعد الحضور والغياب",
  },
  {
    question: "ما هو رابط وطريقة الدخول على K-Moodle جامعة سيناء؟",
    answer: "نظام K-Moodle لإدارة التعلم متاح على الرابط https://kmoodle.su.edu.eg/. يتم الدخول باستخدام بريد الطالب الجامعي (@su.edu.eg). يُستخدم النظام لتسليم الواجبات والوصول لمحتوى المحاضرات والتواصل مع أعضاء هيئة التدريس.",
    link: "/moodle",
    linkText: "دليل استخدام Moodle",
  },
  {
    question: "كيف يتم توزيع درجات المقرر الدراسي؟",
    answer: "يتم تقييم كل مقرر من 100 درجة: 40% أعمال فصلية (assignments وquizzes ومشاركة)، و60% للامتحان النهائي (منها 10% امتحان عملي إن وُجد و50% امتحان تحريري). الحد الأدنى للنجاح في المقرر هو 50% من الدرجة النهائية.",
    link: "/academic-regulations#grade-distribution",
    linkText: "تفاصيل توزيع الدرجات",
  },
  {
    question: "هل يمكنني الاطلاع على الخطة الدراسية كاملة؟",
    answer: "نعم، يمكنك الاطلاع على الخطة الدراسية الكاملة للسنوات الأربع (8 فصول دراسية) مع تفاصيل كل مقرر وساعاته المعتمدة ومتطلباته السابقة من خلال صفحة الخطة الدراسية.",
    link: "/study-plan",
    linkText: "الخطة الدراسية الكاملة",
  },
];

export default function FAQPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          <ol className="flex items-center gap-1.5 flex-wrap">
            <li><Link href="/" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">الرئيسية</Link></li>
            <li className="text-zinc-300 dark:text-zinc-600">/</li>
            <li className="text-zinc-800 dark:text-zinc-200">الأسئلة الشائعة</li>
          </ol>
        </nav>

        {/* Page Title */}
        <header className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 leading-tight">
            الأسئلة الشائعة لطلاب كلية تكنولوجيا المعلومات — جامعة سيناء
          </h1>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
            إجابات شاملة وموثقة على أكثر الأسئلة الأكاديمية شيوعاً بين طلاب كلية تكنولوجيا المعلومات وعلوم الحاسب بجامعة سيناء.
          </p>
        </header>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden">
              <summary className="cursor-pointer px-5 py-4 flex items-start gap-3 text-sm font-bold text-zinc-800 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/80 transition-colors list-none [&::-webkit-details-marker]:hidden">
                <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center text-xs font-black">{index + 1}</span>
                <span className="flex-1">{faq.question}</span>
                <span className="shrink-0 mt-0.5 text-zinc-400 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <div className="px-5 pb-4 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{faq.answer}</p>
                {faq.link && (
                  <Link href={faq.link} className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline">
                    {faq.linkText} →
                  </Link>
                )}
              </div>
            </details>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-sky-50 to-indigo-50/50 dark:from-sky-950/30 dark:to-indigo-950/20 border border-sky-200/50 dark:border-sky-800/30 text-center">
          <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-200 mb-2">لم تجد إجابة لسؤالك؟</h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-4">اطلع على اللائحة الأكاديمية الكاملة أو استخدم المرشد الذكي.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/academic-regulations" className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors">اللائحة الأكاديمية</Link>
            <Link href="/courses" className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold transition-colors">دليل المقررات</Link>
          </div>
        </div>
      </div>
    </>
  );
}
