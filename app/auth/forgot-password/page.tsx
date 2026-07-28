"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { GraduationCap, Mail, ArrowLeft, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [isSent, setIsSent] = React.useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulate delay
    setIsSending(false);
    setIsSent(true);
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
          <Link href="/" className="flex items-center gap-2.5 mb-4">
            <div className="h-10 w-10 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-lg">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="font-bold text-2xl text-zinc-900 dark:text-zinc-50">
              SU IT <span className="text-violet-600 dark:text-violet-400">Guide</span>
            </span>
          </Link>
        </div>

        <Card className="border border-zinc-200/80 bg-white/70 shadow-xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/60">
          <CardContent className="pt-8 pb-6 px-6">
            {!isSent ? (
              <>
                <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 text-center mb-3">استعادة كلمة المرور</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center leading-relaxed mb-6">
                  أدخل بريدك الإلكتروني الأكاديمي وسنرسل لك رابطاً لإعادة تعيين كلمة المرور الخاصة بك.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">البريد الإلكتروني</label>
                    <div className="relative">
                      <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <Input
                        type="email"
                        placeholder="name@sinai.edu.eg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pr-10"
                        disabled={isSending}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full gap-2" isLoading={isSending} disabled={isSending}>
                    <Send className="h-4 w-4" />
                    إرسال الرابط
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-green-50 dark:bg-green-950/40 flex items-center justify-center text-green-600 dark:text-green-400 mb-4 animate-bounce">
                  <Send className="h-6 w-6" />
                </div>
                <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">تم إرسال الرابط</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
                  لقد أرسلنا رابط إعادة تعيين كلمة المرور بنجاح. يرجى مراجعة صندوق الوارد والبريد غير الهام.
                </p>
                <Link href="/auth/reset-password?email=sayed@example.com">
                  <Button className="w-full">
                    الانتقال لتعيين كلمة مرور جديدة (محاكاة)
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
