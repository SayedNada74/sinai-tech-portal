"use client";

import * as React from "react";
import Link from "next/link";
import { useApp } from "@/context/app-context";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Wrench,
  AlertTriangle,
  RefreshCw,
  LogOut,
  Mail,
  Sun,
  Moon,
  ShieldAlert,
  Sparkles,
  Clock,
  Lock,
  ArrowRight,
  Server
} from "lucide-react";
import { motion } from "framer-motion";

interface MaintenanceScreenProps {
  contactEmail?: string;
  siteName?: string;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export function MaintenanceScreen({
  contactEmail = "it.guide@sinai.edu.eg",
  siteName = "دليل ومرشد طلاب IT",
  isAuthenticated = false,
  onLogout
}: MaintenanceScreenProps) {
  const { t, lang, setLang, theme, setTheme, dir } = useApp();
  const [isChecking, setIsChecking] = React.useState(false);

  const handleRefresh = () => {
    setIsChecking(true);
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  return (
    <div
      className="min-h-screen w-full bg-gradient-to-b from-zinc-50 via-zinc-100/60 to-zinc-50 dark:from-zinc-950 dark:via-zinc-900/80 dark:to-zinc-950 flex flex-col justify-between font-sans selection:bg-amber-500/30"
      dir={dir}
    >
      {/* Top Navigation Bar */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Logo size="sm" href="/" />

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="px-3 py-1.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:border-amber-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-xs"
          >
            {lang === "ar" ? "English" : "العربية"}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="p-2 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm text-zinc-600 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-400 transition-all cursor-pointer shadow-xs"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-zinc-700" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-2xl"
        >
          <div className="relative rounded-3xl sm:rounded-[32px] border border-amber-500/30 dark:border-amber-500/20 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl p-6 sm:p-10 shadow-2xl shadow-amber-500/5 text-center overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute -top-24 -left-24 w-60 h-60 bg-amber-500/15 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-sky-500/15 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Glowing Icon Header */}
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="absolute inset-0 bg-amber-500/20 dark:bg-amber-500/30 rounded-3xl blur-xl animate-pulse" />
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Wrench className="h-10 w-10 sm:h-12 sm:w-12 animate-[spin_8s_linear_infinite]" />
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex justify-center mb-3">
              <Badge className="bg-amber-500/10 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-500/30 font-extrabold text-xs px-3 py-1 rounded-full gap-1.5 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                <span>{t("وضع الصيانة المجدولة مفعّل", "Scheduled Maintenance Active")}</span>
              </Badge>
            </div>

            {/* Main Titles */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight mb-3">
              {t("المنصة تحت الصيانة والتطوير حالياً", "Portal is Under Scheduled Maintenance")}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-lg mx-auto mb-6">
              {t(
                "نعتذر لطلابنا الأعزاء عن هذا التوقف المؤقت. يقوم الفريق التقني وإدارة الكلية حالياً بإجراء ترقيات هامة وتحديثات دورية على خوادم المنصة لتحسين الأداء وتأمين تجربة تعليمية فائقة.",
                "We apologize for the inconvenience. Our technical and administrative team is performing essential system upgrades and maintenance to ensure high performance and student data reliability."
              )}
            </p>

            {/* Operational Checklist Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-right" dir={dir}>
              <div className="p-3 rounded-2xl border border-zinc-200/70 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/40">
                <div className="flex items-center gap-2 mb-1">
                  <Server className="h-4 w-4 text-sky-500 shrink-0" />
                  <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200">
                    {t("ترقية الخوادم", "Servers")}
                  </span>
                </div>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  {t("جاري التطوير", "In Progress")}
                </span>
              </div>

              <div className="p-3 rounded-2xl border border-zinc-200/70 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/40">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldAlert className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200">
                    {t("حماية البيانات", "Security")}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {t("مؤمّنة بالكامل", "Protected")}
                </span>
              </div>

              <div className="p-3 rounded-2xl border border-zinc-200/70 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/40">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-amber-500 shrink-0" />
                  <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200">
                    {t("العودة المتوقعة", "Estimated Time")}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold">
                  {t("قريباً جداً", "Very Soon")}
                </span>
              </div>
            </div>

            {/* Contact Email Pill */}
            {contactEmail && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 text-xs text-zinc-600 dark:text-zinc-400 mb-6">
                <Mail className="h-3.5 w-3.5 text-zinc-500" />
                <span>{t("للتواصل الفوري:", "Contact Support:")}</span>
                <a
                  href={`mailto:${contactEmail}`}
                  className="font-bold text-sky-600 dark:text-sky-400 hover:underline font-mono"
                  dir="ltr"
                >
                  {contactEmail}
                </a>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                onClick={handleRefresh}
                disabled={isChecking}
                className="w-full sm:w-auto h-11 px-6 rounded-2xl font-extrabold text-xs gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
              >
                <RefreshCw className={`h-4 w-4 ${isChecking ? "animate-spin" : ""}`} />
                <span>{t("إعادة المحاولة والتحقق", "Check Status & Refresh")}</span>
              </Button>

              {isAuthenticated ? (
                <Button
                  onClick={onLogout}
                  variant="outline"
                  className="w-full sm:w-auto h-11 px-5 rounded-2xl font-bold text-xs gap-2 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  <LogOut className="h-4 w-4 text-zinc-500" />
                  <span>{t("تسجيل الخروج", "Sign Out")}</span>
                </Button>
              ) : (
                <Link href="/auth/login" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto h-11 px-5 rounded-2xl font-bold text-xs gap-2 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                  >
                    <Lock className="h-4 w-4 text-amber-500" />
                    <span>{t("دخول الإدارة والمشرفين", "Staff / Admin Sign In")}</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 text-center">
        <p className="text-[11px] text-zinc-500 dark:text-zinc-500 font-medium">
          {siteName} — {t("جامعة سيناء | جميع الحقوق محفوظة", "Sinai University | All rights reserved")} © 2026
        </p>
      </footer>
    </div>
  );
}
