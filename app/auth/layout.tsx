"use client";

import * as React from "react";
import Link from "next/link";
import { useApp } from "@/context/app-context";
import { SignupFormProvider } from "@/context/signup-form-context";
import { ArrowRight, ArrowLeft, Sun, Moon, Globe } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { lang, setLang, theme, setTheme, t, dir } = useApp();
  const isDark = theme === "dark";

  return (
    <SignupFormProvider>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-between relative overflow-x-hidden" dir={dir}>
        {/* Top Header Controls Bar */}
        <header className="w-full px-3.5 sm:px-6 py-3.5 sm:py-6 flex items-center justify-between z-30 max-w-7xl mx-auto">
          {/* Back to Home Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:bg-zinc-100 dark:hover:bg-zinc-850 hover:border-sky-400 dark:hover:border-sky-600 transition-all cursor-pointer backdrop-blur-md"
          >
            {lang === "ar" ? <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-600 dark:text-sky-400" /> : <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-600 dark:text-sky-400" />}
            <span>{t("العودة للرئيسية", "Back to Home")}</span>
          </Link>

          {/* Language & Theme Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-zinc-700 dark:text-zinc-300 bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs hover:bg-zinc-100 dark:hover:bg-zinc-850 transition-all cursor-pointer backdrop-blur-md"
              title={t("تغيير اللغة", "Change Language")}
            >
              <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-600 dark:text-sky-400" />
              <span>{lang === "ar" ? "English" : "العربية"}</span>
            </button>

            {/* Theme Switcher */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              suppressHydrationWarning
              className="p-1.5 sm:p-2 text-zinc-700 dark:text-zinc-300 bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs hover:bg-zinc-100 dark:hover:bg-zinc-850 transition-all cursor-pointer backdrop-blur-md"
              title={t("تبديل مظهر الموقع", "Toggle Theme")}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-amber-500" />
              ) : (
                <Moon className="h-4 w-4 text-zinc-700" />
              )}
            </button>
          </div>
        </header>

        {/* Auth Content */}
        <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 pb-12 z-20">
          {children}
        </main>
      </div>
    </SignupFormProvider>
  );
}
