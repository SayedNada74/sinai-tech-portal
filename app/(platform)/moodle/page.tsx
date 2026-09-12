import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "دليل استخدام K-Moodle | نظام إدارة التعلم جامعة سيناء",
  description: "دليل شامل لاستخدام نظام K-Moodle لإدارة التعلم بجامعة سيناء: رابط الدخول، تسجيل الدخول بالبريد الجامعي @su.edu.eg، تسليم الواجبات، متابعة المحاضرات، والتواصل مع أعضاء هيئة التدريس.",
  keywords: ["Moodle جامعة سيناء", "K-Moodle", "نظام إدارة التعلم سيناء", "لينك مودل سيناء", "kmoodle.su.edu.eg", "K-Moodle Sinai University", "Moodle login"],
  alternates: {
    canonical: "https://sinai-tech-portal.vercel.app/moodle",
  },
};

const steps = [
  {
    title: "الدخول على رابط K-Moodle",
    description: "افتح المتصفح وادخل على الرابط الرسمي لنظام K-Moodle الخاص بجامعة سيناء.",
    detail: "https://kmoodle.su.edu.eg/",
    icon: "🌐",
  },
  {
    title: "تسجيل الدخول بالبريد الجامعي",
    description: "استخدم بريدك الإلكتروني الجامعي (@su.edu.eg) وكلمة المرور المخصصة لتسجيل الدخول.",
    detail: "username@su.edu.eg",
    icon: "🔑",
  },
  {
    title: "اختيار المقرر الدراسي",
    description: "بعد تسجيل الدخول، ستظهر لك قائمة بالمقررات الدراسية المسجلة لهذا الفصل. اختر المقرر المطلوب.",
    icon: "📚",
  },
  {
    title: "متابعة المحتوى والواجبات",
    description: "داخل كل مقرر ستجد المحاضرات والملفات والواجبات والاختبارات القصيرة (Quizzes) ومنتديات النقاش.",
    icon: "📝",
  },
  {
    title: "تسليم الواجبات",
    description: "اضغط على الواجب المطلوب، ثم ارفع الملف قبل الموعد النهائي (Deadline). تأكد من صيغة الملف المطلوبة.",
    icon: "📤",
  },
];

export default function MoodlePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6 text-xs font-medium text-zinc-500 dark:text-zinc-400">
        <ol className="flex items-center gap-1.5 flex-wrap">
          <li><Link href="/" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">الرئيسية</Link></li>
          <li className="text-zinc-300 dark:text-zinc-600">/</li>
          <li className="text-zinc-800 dark:text-zinc-200">دليل K-Moodle</li>
        </ol>
      </nav>

      {/* Page Title */}
      <header className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 leading-tight">
          دليل استخدام K-Moodle — نظام إدارة التعلم بجامعة سيناء
        </h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          نظام K-Moodle هو نظام إدارة التعلم الإلكتروني المعتمد بجامعة سيناء. يُستخدم لإدارة المحتوى الدراسي، تسليم الواجبات، متابعة المحاضرات، والتواصل مع أعضاء هيئة التدريس.
        </p>
      </header>

      {/* Quick Access */}
      <div className="mb-10 p-5 rounded-2xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-200/50 dark:border-sky-800/30">
        <h2 className="text-sm font-bold text-sky-800 dark:text-sky-300 mb-3">🔗 الدخول المباشر</h2>
        <a
          href="https://kmoodle.su.edu.eg/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold transition-colors"
        >
          فتح K-Moodle جامعة سيناء ↗
        </a>
        <p className="mt-2 text-xs text-sky-600 dark:text-sky-400 font-medium">https://kmoodle.su.edu.eg/</p>
      </div>

      {/* Steps */}
      <section className="mb-10">
        <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 mb-6">خطوات الاستخدام</h2>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-lg">
                {step.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
                  <span className="text-xs font-black text-sky-600 dark:text-sky-400">الخطوة {index + 1}</span>
                  <span className="text-zinc-300 dark:text-zinc-700">|</span>
                  {step.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">{step.description}</p>
                {step.detail && (
                  <code className="inline-block mt-2 px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-xs font-mono text-sky-700 dark:text-sky-400 border border-zinc-200 dark:border-zinc-700">
                    {step.detail}
                  </code>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Responsibilities */}
      <section className="mb-10">
        <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 mb-4">واجبات الطالب تجاه نظام K-Moodle</h2>
        <ul className="text-sm text-zinc-700 dark:text-zinc-300 space-y-2 leading-relaxed list-disc list-inside mr-2">
          <li>متابعة المحتوى المنشور من المحاضرات والملفات والإعلانات بشكل دوري.</li>
          <li>تسليم الواجبات والمشاريع في المواعيد المحددة.</li>
          <li>المشاركة في منتديات النقاش والأنشطة التفاعلية.</li>
          <li>الالتزام بأخلاقيات الاستخدام وعدم مشاركة بيانات الدخول مع أي شخص آخر.</li>
          <li>الإبلاغ عن أي مشكلة تقنية لإدارة تكنولوجيا المعلومات بالجامعة.</li>
        </ul>
      </section>

      {/* Related Links */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-50 to-indigo-50/50 dark:from-sky-950/30 dark:to-indigo-950/20 border border-sky-200/50 dark:border-sky-800/30 text-center">
        <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-200 mb-2">روابط مفيدة</h2>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <a href="https://kmoodle.su.edu.eg/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors">K-Moodle ↗</a>
          <a href="http://unicodesis.su.edu.eg/login" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-900 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-white text-xs font-bold transition-colors">Unicode SIS ↗</a>
          <Link href="/faq" className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-bold transition-colors">الأسئلة الشائعة</Link>
        </div>
      </div>
    </div>
  );
}
