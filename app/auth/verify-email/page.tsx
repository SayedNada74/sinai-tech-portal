"use client";

import { Logo } from "@/components/ui/logo";
import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { GraduationCap, MailCheck, ArrowLeft, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

import { useToast } from "@/components/ui/toast";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "بريدك الأكاديمي";
  const [isResending, setIsResending] = React.useState(false);
  const [cooldown, setCooldown] = React.useState(0);
  const { toast } = useToast();
  const router = useRouter();

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    if (!email || !email.includes("@")) {
      toast("يرجى التأكد من كتابة البريد الإلكتروني بشكل صحيح.", "error");
      return;
    }

    setIsResending(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.resend({
          type: "signup",
          email: email.trim().toLowerCase(),
        });
        if (error) throw error;
      }
      toast("تمت إعادة إرسال رابط التفعيل بنجاح. تفقد صندوق الوارد أو مجلد الرسائل غير المرغوب فيها (Spam).", "success");
      setCooldown(60); // 60s cooldown to protect SMTP limits
    } catch (err: any) {
      const msg = err?.message || "تعذر إعادة إرسال الرابط. يرجى المحاولة بعد قليل.";
      toast(msg, "error");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="border border-zinc-200/80 bg-white/70 shadow-xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/60 text-center">
      <CardContent className="pt-8 pb-6 px-6">
        <div className="mx-auto h-16 w-16 rounded-full bg-sky-50 dark:bg-sky-950/40 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-6">
          <MailCheck className="h-9 w-9" />
        </div>

        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">تفقد بريدك الإلكتروني</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
          لقد أرسلنا رابط تأكيد الحساب إلى:
          <br />
          <span className="font-semibold text-zinc-800 dark:text-zinc-200 dir-ltr inline-block mt-1 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg text-xs">
            {email}
          </span>
        </p>

        <div className="p-3.5 mb-6 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 text-start leading-relaxed">
          💡 <strong>ملاحظة:</strong> إذا لم تجد الرسالة في صندوق الوارد الرئيسي (Inbox)، يرجى فحص مجلد <strong>الرسائل غير المرغوب فيها (Spam / Junk)</strong>.
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full gap-2 font-medium"
            onClick={handleResend}
            disabled={isResending || cooldown > 0}
            isLoading={isResending}
          >
            <RefreshCw className={`h-4 w-4 ${isResending ? "animate-spin" : ""}`} />
            {cooldown > 0 ? `إعادة الإرسال بعد (${cooldown}) ثانية` : "إعادة إرسال رابط التفعيل"}
          </Button>

          <Button
            className="w-full gap-2 font-bold shadow-md"
            onClick={() => router.push("/auth/login")}
          >
            الذهاب لتسجيل الدخول
          </Button>
        </div>
      </CardContent>

      <CardFooter className="justify-center border-t border-zinc-100/50 py-4 dark:border-zinc-800/30">
        <Link href="/auth/login" className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-sky-600 transition-colors dark:text-zinc-400 dark:hover:text-sky-400">
          <ArrowLeft className="h-3.5 w-3.5" />
          العودة لتسجيل الدخول
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="w-full flex flex-col items-center relative">
      {/* Background Decorative Glow */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-sky-600/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Logo size="xl" href="/" className="mb-4" />
        </div>

        <React.Suspense fallback={
          <Card className="border border-zinc-200/80 bg-white/70 shadow-xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/60 p-8 text-center">
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="h-8 w-8 rounded-full border-2 border-sky-600 border-t-transparent animate-spin" />
              <p className="text-sm text-zinc-500 dark:text-zinc-400">جاري تحميل صفحة التحقق...</p>
            </div>
          </Card>
        }>
          <VerifyEmailContent />
        </React.Suspense>
      </motion.div>
    </div>
  );
}
