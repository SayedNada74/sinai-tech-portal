"use client";

import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import {
  Calculator,
  BookOpen,
  Bot,
  Users,
  ExternalLink,
  ShieldCheck,
  GraduationCap
} from "lucide-react";
import { useApp } from "@/context/app-context";
import { DeveloperCredit } from "@/components/ui/developer-credit";

export function Footer() {
  const { t, dir } = useApp();

  return (
    <footer
      className="relative bg-gradient-to-b from-zinc-50/50 via-zinc-100/40 to-zinc-100 dark:from-zinc-950/40 dark:via-zinc-950/80 dark:to-zinc-950 border-t border-zinc-200/70 dark:border-zinc-800/70 pt-12 pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors"
      dir={dir}
    >
      {/* Background Subtle Ambient Glow */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-full max-w-5xl h-64 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-sky-500/5 blur-3xl rounded-full"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        {/* Glassmorphic Chic Footer Container */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* Column 1: Brand & Identity (Span 5) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <Logo size="md" href="/" />
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20">
                  <GraduationCap className="h-3.5 w-3.5 text-sky-500" />
                  <span>{t("جامعة سيناء • كلية IT", "Sinai University • IT Faculty")}</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium max-w-md">
                {t(
                  "المنصة الأكاديمية الذكية لطلاب كلية تكنولوجيا المعلومات بجامعة سيناء لتتبع المقررات، حساب GPA، والتواصل الفعّال.",
                  "The unified smart academic portal for Sinai University IT students to manage courses, simulate GPA, and collaborate."
                )}
              </p>

              <div className="pt-1 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>{t("مُخصص ومؤمن لطلاب @su.edu.eg", "Secured exclusively for @su.edu.eg students")}</span>
              </div>
            </div>

            {/* Column 2: Academic Tools (Span 4) */}
            <div className="lg:col-span-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                {t("الأدوات الأكاديمية", "Academic Tools")}
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                <Link href="/gpa" className="group flex items-center gap-2 p-2 rounded-xl hover:bg-sky-500/5 dark:hover:bg-sky-500/10 text-zinc-600 hover:text-sky-600 dark:text-zinc-300 dark:hover:text-sky-400 transition-all">
                  <Calculator className="h-4 w-4 text-zinc-400 group-hover:text-sky-500 transition-colors" />
                  <span>{t("حاسبة الـ GPA", "GPA Calculator")}</span>
                </Link>
                <Link href="/courses" className="group flex items-center gap-2 p-2 rounded-xl hover:bg-sky-500/5 dark:hover:bg-sky-500/10 text-zinc-600 hover:text-sky-600 dark:text-zinc-300 dark:hover:text-sky-400 transition-all">
                  <BookOpen className="h-4 w-4 text-zinc-400 group-hover:text-sky-500 transition-colors" />
                  <span>{t("دليل المقررات", "Courses")}</span>
                </Link>
                <Link href="/directory" className="group flex items-center gap-2 p-2 rounded-xl hover:bg-sky-500/5 dark:hover:bg-sky-500/10 text-zinc-600 hover:text-sky-600 dark:text-zinc-300 dark:hover:text-sky-400 transition-all">
                  <Users className="h-4 w-4 text-zinc-400 group-hover:text-sky-500 transition-colors" />
                  <span>{t("دليل الطلاب", "Directory")}</span>
                </Link>
                <Link href="/ai-assistant" className="group flex items-center gap-2 p-2 rounded-xl hover:bg-sky-500/5 dark:hover:bg-sky-500/10 text-zinc-600 hover:text-sky-600 dark:text-zinc-300 dark:hover:text-sky-400 transition-all">
                  <Bot className="h-4 w-4 text-zinc-400 group-hover:text-sky-500 transition-colors" />
                  <span>{t("المرشد الذكي", "AI Advisor")}</span>
                </Link>
              </div>
            </div>

            {/* Column 3: University Portals & Help (Span 3) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                {t("بوابات الجامعة", "University Portals")}
              </h4>
              <div className="flex flex-col space-y-1.5 text-xs font-medium">
                <a
                  href="https://kmoodle.su.edu.eg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 p-1.5 text-zinc-600 hover:text-sky-600 dark:text-zinc-300 dark:hover:text-sky-400 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-400 group-hover:text-sky-500" />
                  <span>{t("بوابة K-Moodle", "K-Moodle Portal")}</span>
                </a>
                <a
                  href="http://unicodesis.su.edu.eg/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 p-1.5 text-zinc-600 hover:text-sky-600 dark:text-zinc-300 dark:hover:text-sky-400 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-400 group-hover:text-sky-500" />
                  <span>{t("نظام Unicode (SIS)", "Unicode SIS System")}</span>
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Divider inside card */}
          <div className="border-t border-zinc-200/70 dark:border-zinc-800/70 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            <p>© {new Date().getFullYear()} Sinai University IT Portal. {t("جميع الحقوق محفوظة.", "All rights reserved.")}</p>

            <DeveloperCredit variant="footer" />
          </div>
        </div>
      </div>
    </footer>
  );
}
