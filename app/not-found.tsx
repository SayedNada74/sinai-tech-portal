"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight, Home, Compass, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col items-center justify-center p-6 text-center" dir="rtl">
      {/* Background Subtle Glow */}
      <div className="absolute w-72 h-72 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative space-y-6 max-w-md mx-auto">
        {/* Logo Icon */}
        <div className="mx-auto h-16 w-16 rounded-2xl bg-violet-600 flex items-center justify-center text-white shadow-xl shadow-violet-600/20">
          <GraduationCap className="h-9 w-9" />
        </div>

        {/* 404 Big Badge */}
        <div className="space-y-2">
          <span className="text-6xl font-black tracking-tight text-violet-600 dark:text-violet-400 block">404</span>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">الصفحة غير موجودة أو تم نقلها</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            عذراً، الرابط الذي تحاول الوصول إليه غير موجود أو تم تغيير مساره بالدليل الأكاديمي.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button className="w-full gap-2 text-xs font-bold shadow-md">
              <Home className="h-4 w-4" />
              <span>العودة للوحة الطالب</span>
            </Button>
          </Link>
          <Link href="/courses" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full gap-2 text-xs font-bold">
              <Compass className="h-4 w-4" />
              <span>دليل المقررات</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
