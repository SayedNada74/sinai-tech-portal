"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/app-context";
import { Button } from "@/components/ui/button";
import { Lock, LogIn, UserPlus, X, Sparkles, CheckCircle } from "lucide-react";

interface AuthRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function AuthRequirementModal({
  isOpen,
  onClose,
  title,
  description,
}: AuthRequirementModalProps) {
  const { t, dir, lang } = useApp();
  const isRtl = dir === "rtl";

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative z-10 w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl shadow-2xl overflow-hidden ${
              isRtl ? "text-right" : "text-left"
            }`}
            dir={dir}
          >
            {/* Top decorative glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-sky-500/20 dark:bg-sky-500/30 rounded-full blur-3xl pointer-events-none" />

            {/* Header / Close button */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400">
                  {t("حساب الطالب الجامعي", "Student Portal Account")}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title={t("إغلاق", "Close")}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body Content */}
            <div className="p-6 sm:p-7 space-y-5 text-center sm:text-start">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="h-14 w-14 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200/60 dark:border-sky-800/50 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0 shadow-inner">
                  <Lock className="h-7 w-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base sm:text-lg font-black text-zinc-950 dark:text-white leading-tight">
                    {title ||
                      t(
                        "تسجيل الدخول مطلوب لحفظ تقدمك",
                        "Sign In Required to Save Progress"
                      )}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {description ||
                      t(
                        "أنت تتصفح المنصة حالياً كزائر. لتتمكن من تسجيل المواد المنجزة، وحفظ تقديراتك واحتساب الـ GPA وتتبع شجرة التخرج، يرجى تسجيل الدخول أو إنشاء حساب جديد.",
                        "You are currently browsing as a guest. To check off completed subjects, record your grades, calculate cumulative GPA and track graduation, please sign in or register."
                      )}
                  </p>
                </div>
              </div>

              {/* Feature Highlights */}
              <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800/60 space-y-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{t("حفظ درجاتك ومقرراتك المنجزة بشكل دائم", "Permanent cloud saving of grades & courses")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{t("حساب وتوقع المعدل التراكمي بدقة للائحة الكلية", "Accurate GPA calculation & graduation forecasting")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{t("مزامنة تقويم Moodle واستشارات الـ AI", "Moodle calendar auto-sync & AI advisor access")}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                <Link href="/auth/login" className="block w-full">
                  <Button className="w-full h-11 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-lg shadow-sky-500/20 gap-2 text-sm">
                    <LogIn className="h-4 w-4" />
                    {t("تسجيل الدخول إلى حسابك", "Sign In to Your Account")}
                  </Button>
                </Link>

                <Link href="/auth/register" className="block w-full">
                  <Button variant="outline" className="w-full h-11 rounded-xl font-bold border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 gap-2 text-sm">
                    <UserPlus className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                    {t("إنشاء حساب طالب جديد", "Create New Student Account")}
                  </Button>
                </Link>

                <div className="text-center pt-2">
                  <button
                    onClick={onClose}
                    className="text-xs font-semibold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                  >
                    {t("متابعة التصفح كزائر (وضع القراءة)", "Continue browsing as guest (Read-only)")}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
