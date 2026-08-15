"use client";

import { Logo } from "@/components/ui/logo";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { GraduationCap, Lock, ArrowLeft, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isResetting, setIsResetting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("الرجاء تعبئة كافة الحقول.");
      return;
    }

    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }

    setIsResetting(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error: updateErr } = await supabase.auth.updateUser({ password });
        if (updateErr) {
          setError(updateErr.message);
          setIsResetting(false);
          return;
        }
      } catch (err: any) {
        console.warn("Supabase updateUser password error:", err);
      }
    } else {
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    setIsResetting(false);
    setIsSuccess(true);
  };

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
          <Logo size="xl" href="/" className="mb-4" />
        </div>

        <Card className="border border-zinc-200/80 bg-white/70 shadow-xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/60">
          <CardContent className="pt-8 pb-6 px-6">
            {!isSuccess ? (
              <>
                <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 text-center mb-3">إعادة تعيين كلمة المرور</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center leading-relaxed mb-6">
                  الرجاء إدخال كلمة المرور الجديدة وتأكيدها.
                </p>

                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200/50 dark:border-red-500/20 text-xs text-red-600 dark:text-red-400">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">كلمة المرور الجديدة</label>
                    <div className="relative">
                      <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10"
                        disabled={isResetting}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">تأكيد كلمة المرور</label>
                    <div className="relative">
                      <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pr-10"
                        disabled={isResetting}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full mt-2" isLoading={isResetting} disabled={isResetting}>
                    تحديث كلمة المرور
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-green-50 dark:bg-green-950/40 flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">تم تحديث كلمة المرور</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
                  لقد تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول باستخدام البيانات الجديدة.
                </p>
                <Link href="/auth/login">
                  <Button className="w-full">
                    تسجيل الدخول
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>

          <CardFooter className="justify-center border-t border-zinc-100/50 py-4 dark:border-zinc-800/30">
            <Link href="/auth/login" className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-violet-600 transition-colors dark:text-zinc-400 dark:hover:text-violet-400">
              <ArrowLeft className="h-3.5 w-3.5" />
              العودة لتسجيل الدخول
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
