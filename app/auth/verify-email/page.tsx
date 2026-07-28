"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { GraduationCap, MailCheck, ArrowLeft, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your-email@sinai.edu.eg";
  const [isVerifying, setIsVerifying] = React.useState(false);
  const router = useRouter();

  const handleSimulateVerification = async () => {
    setIsVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate delay
    setIsVerifying(false);
    router.push("/dashboard");
  };

  return (
    <Card className="border border-zinc-200/80 bg-white/70 shadow-xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/60 text-center">
      <CardContent className="pt-8 pb-6 px-6">
        <div className="mx-auto h-16 w-16 rounded-full bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-6">
          <MailCheck className="h-9 w-9" />
        </div>

        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">تفقد بريدك الإلكتروني</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
          لقد أرسلنا رابط تأكيد إلى <span className="font-semibold text-zinc-800 dark:text-zinc-200">{email}</span>.
          يرجى فتح الرابط لتفعيل حسابك الأكاديمي.
        </p>

        <div className="space-y-3">
          <Button className="w-full gap-2 font-bold shadow-md" onClick={handleSimulateVerification} isLoading={isVerifying}>
            {isVerifying ? "جاري تفعيل الحساب وتوثيقه..." : "تفعيل الحساب والدخول للمنصة 🚀"}
          </Button>
          <Button variant="outline" className="w-full gap-2" disabled={isVerifying}>
            <RefreshCw className="h-4 w-4" />
            إعادة إرسال رابط التفعيل
          </Button>
        </div>
      </CardContent>

      <CardFooter className="justify-center border-t border-zinc-100/50 py-4 dark:border-zinc-800/30">
        <Link href="/auth/login" className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-violet-600 transition-colors dark:text-zinc-400 dark:hover:text-violet-400">
          <ArrowLeft className="h-3.5 w-3.5" />
          العودة لتسجيل الدخول
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-center items-center px-6 py-12 relative" dir="rtl">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 mb-4">
            <div className="h-10 w-10 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-lg">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="font-bold text-2xl text-zinc-900 dark:text-zinc-50">
              SU IT <span className="text-violet-600 dark:text-violet-400">Guide</span>
            </span>
          </Link>
        </div>

        <React.Suspense fallback={
          <Card className="border border-zinc-200/80 bg-white/70 shadow-xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/60 p-8 text-center">
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="h-8 w-8 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" />
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
