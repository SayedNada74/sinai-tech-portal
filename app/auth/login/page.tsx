"use client";

import { Logo } from"@/components/ui/logo";
import * as React from"react";
import Link from"next/link";
import { useRouter } from"next/navigation";
import { useAuth } from"@/context/auth-context";
import { useApp } from"@/context/app-context";
import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from"@/components/ui/card";
import { GraduationCap, Mail, Lock, ShieldAlert, Eye, EyeOff, ArrowRight, ArrowLeft } from"lucide-react";
import { motion } from"framer-motion";

import { useToast } from"@/components/ui/toast";

export default function LoginPage() {
  const { t, dir, lang } = useApp();
  const { toast } = useToast();
  const { login, loginWithProvider, isLoading } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const [error, setError] = React.useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      const errMsg = t("الرجاء إدخال البريد الإلكتروني وكلمة المرور.","Please enter your email and password.");
      setError(errMsg);
      toast(`️ ${errMsg}`,"error");
      return;
    }

    try {
      const success = await login(email.trim(), password.trim(), rememberMe);
      if (success) {
        toast(t(" تم تسجيل الدخول بنجاح! مرحباً بك مجدداً."," Login successful! Welcome back."),"success");
        router.push("/dashboard");
      } else {
        const errMsg = t("البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى التأكد من البيانات.","Invalid email or password. Access denied.");
        setError(errMsg);
        toast(` ${errMsg}`,"error");
      }
    } catch (err: any) {
      let errMsg = err?.message || t("حدث خطأ أثناء الاتصال. حاول مرة أخرى.","An error occurred during sign in.");
      if (errMsg.toLowerCase().includes("fetch") || errMsg.toLowerCase().includes("network") || errMsg.toLowerCase().includes("timeout")) {
         errMsg = t("الخادم يواجه ضغطاً عالياً حالياً أو يوجد مشكلة في الاتصال. يرجى المحاولة بعد قليل.", "Server is experiencing high traffic or network issues. Please try again in a moment.");
      }
      setError(errMsg);
      toast(errMsg,"error");
    }
  };

  const handleProviderLogin = async (provider:"google" |"github") => {
    setError("");
    try {
      const success = await loginWithProvider(provider);
      if (success) {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(t("حدث خطأ أثناء تسجيل الدخول بالوسيط.","OAuth provider login failed."));
    }
  };

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
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <Logo size="xl" href="/" className="mb-3" />
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{t("مرحباً بك مجدداً","Welcome Back")}</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 font-normal">{t("سجل دخولك لمتابعة خطتك الأكاديمية","Sign in to access your academic dashboard")}</p>
        </div>

        <Card className="border border-zinc-200/80 bg-white/70 shadow-xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/60">
          <CardContent className="pt-6">
            {error && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200/50 dark:border-red-500/20 text-xs font-semibold text-red-600 dark:text-red-400 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
                {(error.includes("تأكيد") || error.toLowerCase().includes("confirm") || error.includes("التفعيل")) && (
                  <div className="pt-1 border-t border-red-200/40 dark:border-red-500/20">
                    <Link
                      href={`/auth/verify-email?email=${encodeURIComponent(email.trim() || "")}`}
                      className="inline-flex items-center gap-1 font-bold text-sky-600 dark:text-sky-400 hover:underline"
                    >
                      <span>{t("إعادة إرسال رابط التفعيل أو مراجعة الحساب ←", "Resend verification link or check account →")}</span>
                    </Link>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("البريد الإلكتروني","Email Address")}</label>
                <div className="relative">
                  <Mail className={`absolute ${lang === "ar" ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 input-icon pointer-events-none`} />
                  <Input
                    type="email"
                    placeholder="username@su.edu.eg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={lang === "ar" ? "pr-10" : "pl-10"}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("كلمة المرور","Password")}</label>
                  <Link href="/auth/forgot-password" className="text-xs font-semibold text-sky-600 hover:underline dark:text-sky-400">
                    {t("نسيت كلمة المرور؟","Forgot password?")}
                  </Link>
                </div>
                <div className="relative">
                  <Lock className={`absolute ${lang === "ar" ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 input-icon pointer-events-none`} />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={lang === "ar" ? "pr-10 pl-10" : "pl-10 pr-10"}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${lang === "ar" ? "left-3.5" : "right-3.5"} top-1/2 -translate-y-1/2 transition-colors cursor-pointer p-0.5 rounded-lg`}
                    title={showPassword ? t("إخفاء كلمة المرور","Hide password") : t("إظهار كلمة المرور","Show password")}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 input-icon text-sky-500" /> : <Eye className="h-4 w-4 input-icon" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-sky-600 focus:ring-sky-500 accent-sky-600 cursor-pointer"
                />
                <label htmlFor="rememberMe" className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 select-none cursor-pointer">
                  {t("تذكرني على هذا الجهاز","Remember me on this device")}
                </label>
              </div>

              <Button type="submit" className="w-full mt-2 cursor-pointer font-bold" isLoading={isLoading} disabled={isLoading}>
                {t("تسجيل الدخول","Sign In")}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2.5 text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
                  {t("أو سجل عبر","Or continue with")}
                </span>
              </div>
            </div>

            {/* Third-party providers */}
            <div className="grid grid-cols-2 gap-3.5">
              <Button
                variant="outline"
                className="w-full gap-2 h-10 cursor-pointer"
                onClick={() => handleProviderLogin("google")}
                disabled={isLoading}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2 h-10 cursor-pointer"
                onClick={() => handleProviderLogin("github")}
                disabled={isLoading}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub
              </Button>
            </div>
          </CardContent>

          <CardFooter className="justify-center border-t border-zinc-100/50 py-4 dark:border-zinc-800/30">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {t("ليس لديك حساب؟","Don't have an account?")}{""}
              <Link href="/auth/register" className="font-bold text-sky-600 hover:underline dark:text-sky-400">
                {t("إنشاء حساب جديد","Sign up")}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
