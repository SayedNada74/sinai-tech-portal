"use client";

import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import { GraduationCap, Globe, Mail } from "lucide-react";
import { useApp } from "@/context/app-context";
import { DeveloperCredit } from "@/components/ui/developer-credit";

export function Footer() {
  const { t, dir } = useApp();

  return (
    <footer className="bg-zinc-50 border-t border-zinc-200/60 dark:bg-zinc-950 dark:border-zinc-900 py-16 px-6" dir={dir}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Info Column */}
        <div className="md:col-span-2 flex flex-col space-y-4">
          <Logo size="md" href="/" />
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
            {t(
              "المنصة الذكية المتكاملة لطلاب تكنولوجيا المعلومات بجامعة سيناء لتتبع مسارهم الدراسي، وحساب وتوقع المعدل التراكمي بدقة، وتنظيم الجدول والتسجيل الأكاديمي.",
              "Comprehensive smart academic portal for Sinai University IT students to track curricula, simulate GPA, and plan registration."
            )}
          </p>
          <div className="flex items-center gap-4 pt-2">
            <a href="#" className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors">
              <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors">
              <Globe className="h-4.5 w-4.5" />
            </a>
            <a href="#" className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors">
              <Mail className="h-4.5 w-4.5" />
            </a>
          </div>
        </div>

        {/* Links Column */}
        <div>
          <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-4">
            {t("المنصة", "Platform")}
          </h4>
          <ul className="space-y-3">
            <li>
              <a href="#features" className="text-sm text-zinc-500 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors">
                {t("الميزات الذكية", "Smart Features")}
              </a>
            </li>
            <li>
              <a href="#stats" className="text-sm text-zinc-500 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors">
                {t("الإحصائيات", "Statistics")}
              </a>
            </li>
            <li>
              <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors">
                {t("لوحة التحكم", "Dashboard")}
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal Column */}
        <div>
          <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-4">
            {t("عن المشروع", "About Project")}
          </h4>
          <ul className="space-y-3">
            <li>
              <a href="#faq" className="text-sm text-zinc-500 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors">
                {t("الأسئلة الشائعة", "FAQ")}
              </a>
            </li>
            <li>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {t("برنامج تكنولوجيا المعلومات - جامعة سيناء", "IT Program - Sinai University")}
              </span>
            </li>
            <li>
              <span className="text-xs text-zinc-400 dark:text-zinc-500">
                {t("مشروع طلابي مخصص لمساعدة وتوجيه الطلاب", "Academic portal developed for IT student assistance")}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-zinc-200/60 dark:border-zinc-900 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-400 dark:text-zinc-500">
        <p>© {new Date().getFullYear()} SU IT Guide. {t("جميع الحقوق محفوظة.", "All rights reserved.")}</p>
        <DeveloperCredit variant="footer" />
        <p dir="ltr">Built with Next.js, Tailwind CSS & Framer Motion</p>
      </div>
    </footer>
  );
}
