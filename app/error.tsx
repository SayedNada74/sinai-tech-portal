"use client";

import { useEffect } from"react";
import Link from"next/link";
import { Button } from"@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from"lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // SECURITY: Do not expose full stack traces in production browser console
    if (process.env.NODE_ENV === "production") {
      console.error("App error:", error.message);
    } else {
      console.error("App error:", error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col items-center justify-center p-6 text-center" dir="rtl">
      <div className="space-y-6 max-w-md mx-auto">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20 shadow-md">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">حدث خطأ غير متوقع في العملية</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            تم تسجيل الخطأ بواسطة النظام. يمكنك إعادة محاولة العملية أو العودة للرئيسية.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button onClick={() => reset()} className="gap-2 text-xs font-bold shadow-md">
            <RefreshCw className="h-4 w-4" />
            <span>إعادة المحاولة والتنشيط</span>
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" className="w-full sm:w-auto gap-2 text-xs font-bold">
              <Home className="h-4 w-4" />
              <span>لوحة التحكم</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
