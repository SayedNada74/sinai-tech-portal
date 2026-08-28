"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useApp } from "@/context/app-context";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, LogIn, UserPlus } from "lucide-react";

interface GuestNoticeBannerProps {
  title?: string;
  badge?: string;
  description?: string;
}

export function GuestNoticeBanner({
  title,
  badge,
  description,
}: GuestNoticeBannerProps) {
  const { user } = useAuth();
  const { t, dir } = useApp();

  if (user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-sky-600/10 via-cyan-600/10 to-blue-500/10 border border-sky-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
      dir={dir}
    >
      <div className="flex items-start sm:items-center gap-3.5">
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-600 flex items-center justify-center text-white shrink-0 shadow-md">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 flex flex-wrap items-center gap-2">
            <span>
              {title || t("وضع المعاينة كزائر (مفتوح للجميع)", "Guest Exploration Mode")}
            </span>
            <Badge className="bg-sky-500/20 text-sky-700 dark:text-sky-300 border-none text-[10px] font-bold">
              {badge || t("تصفح مجاني", "Free Access")}
            </Badge>
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
            {description ||
              t(
                "يمكنك استعراض محتوى الكلية والأدوات بحرية. لتسجيل موادك المنجزة، وحفظ درجاتك وتتبع الـ GPA الخاص بك، يمكنك تسجيل الدخول أو إنشاء حساب جديد.",
                "You can browse faculty content and tools freely. To record completed subjects, save your grades and track cumulative GPA, please sign in or register."
              )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
        <Link href="/auth/login" className="flex-1 sm:flex-none">
          <Button size="sm" variant="outline" className="w-full sm:w-auto text-xs font-bold rounded-xl h-9 border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            {t("تسجيل الدخول", "Sign In")}
          </Button>
        </Link>
        <Link href="/auth/register" className="flex-1 sm:flex-none">
          <Button size="sm" className="w-full sm:w-auto text-xs font-bold rounded-xl h-9 bg-sky-600 hover:bg-sky-700 text-white shadow-md">
            {t("إنشاء حساب", "Register")}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
