"use client";

import { Logo } from "@/components/ui/logo";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useApp } from "@/context/app-context";
import { useSignupForm } from "@/context/signup-form-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { GraduationCap, Mail, Lock, User, Calendar, ShieldAlert, BookOpen, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

import { useToast } from "@/components/ui/toast";

export default function RegisterPage() {
  const { t, dir, lang } = useApp();
  const { toast } = useToast();
  const { register, isLoading } = useAuth();
  const { formData, setFormField, resetForm } = useSignupForm();

  const { nameAr, nameEn, email, studentId, level, department, password = "" } = formData;
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nameAr.trim() || !nameEn.trim() || !email.trim() || !password.trim()) {
      const errMsg = t("الرجاء ملء جميع الحقول المطلوبة (الاسم باللغتين والبريد وكلمة المرور).", "Please fill in all required fields (Both names, Email, Password).");
      setError(errMsg);
      toast(`⚠️ ${errMsg}`, "error");
      return;
    }

    const lowerEmail = email.trim().toLowerCase();
    if (!lowerEmail.endsWith("@su.edu.eg") && !lowerEmail.endsWith("@sinai.edu.eg")) {
      const errMsg = t("⚠️ يجب استخدام البريد الإلكتروني الجامعي الرسمي المعتمد لجامعة سيناء (username@su.edu.eg).", "⚠️ Must use official Sinai University email ending with @su.edu.eg.");
      setError(errMsg);
      toast(errMsg, "error");
      return;
    }

    const hasMinLen = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNum = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (!hasMinLen || !hasLetter || !hasNum || !hasSpecial) {
      const errMsg = t("⚠️ كلمة المرور ضعيفة. يجب أن تتكون من 8 خانات على الأقل وتتضمن حروفاً وأرقاماً ورموزاً مميزة (مثل !@#$).", "⚠️ Weak password. Must be at least 8 characters and include letters, numbers, and symbols.");
      setError(errMsg);
      toast(errMsg, "error");
      return;
    }

    try {
      const success = await register(nameAr.trim(), nameEn.trim(), email.trim(), password.trim(), level, department, studentId.trim());
      if (success === "requires_verification") {
        resetForm(); // Clean up form state on successful creation
        toast(t("📧 تم إرسال رابط التأكيد. يرجى مراجعة بريدك الإلكتروني.", "📧 Verification link sent. Please check your email."), "success");
        router.push("/auth/verify-email");
      } else if (success) {
        resetForm(); // Clean up form state on successful creation
        toast(t("🎉 تم إنشاء حسابك الجامعي بنجاح! مرحباً بك في منصة جامعة سيناء.", "🎉 Account created successfully! Welcome to Sinai University Portal."), "success");
        router.push("/dashboard");
      } else {
        const errMsg = t("⚠️ البريد الإلكتروني مسجل مسبقاً في منصة الجامعة. يرجى تسجيل الدخول إلى حسابك الحالي.", "⚠️ Email is already registered. Please sign in to your existing account.");
        setError(errMsg);
        toast(errMsg, "error");
      }
    } catch (err: any) {
      const errMsg = err?.message || t("حدث خطأ أثناء التسجيل. حاول مرة أخرى.", "An error occurred during registration.");
      setError(errMsg);
      toast(errMsg, "error");
    }
  };

  return (
    <div className="w-full flex flex-col items-center relative">
      {/* Background Decorative Glow */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <Logo size="xl" href="/" className="mb-3" />
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{t("إنشاء حساب جديد", "Create New Account")}</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 font-normal">{t("ابدأ رحلتك الأكاديمية الذكية اليوم", "Start your academic journey today")}</p>
        </div>

        <Card className="border border-zinc-200/80 bg-white/70 shadow-xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/60">
          <CardContent className="pt-6">
            {error && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200/50 dark:border-red-500/20 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Full Name (Arabic) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">الاسم الكامل (عربي)</label>
                  <div className="relative">
                    <User className={`absolute ${lang === "ar" ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400`} />
                    <Input
                      type="text"
                      placeholder="اسم الطالب"
                      value={nameAr}
                      onChange={(e) => setFormField("nameAr", e.target.value)}
                      className={lang === "ar" ? "pr-10 text-xs text-right" : "pl-10 text-xs text-right"}
                      disabled={isLoading}
                      dir="rtl"
                    />
                  </div>
                </div>

                {/* Full Name (English) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Full Name (English)</label>
                  <div className="relative">
                    <User className={`absolute ${lang === "ar" ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400`} />
                    <Input
                      type="text"
                      placeholder="Student Name"
                      value={nameEn}
                      onChange={(e) => setFormField("nameEn", e.target.value)}
                      className={lang === "ar" ? "pr-10 text-xs text-left" : "pl-10 text-xs text-left"}
                      disabled={isLoading}
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("البريد الإلكتروني الجامعي", "University Email")}</label>
                <div className="relative">
                  <Mail className={`absolute ${lang === "ar" ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400`} />
                  <Input
                    type="email"
                    placeholder="username@su.edu.eg"
                    value={email}
                    onChange={(e) => setFormField("email", e.target.value)}
                    className={lang === "ar" ? "pr-10 text-xs" : "pl-10 text-xs"}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Academic Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("الفرقة الدراسية", "Academic Level")}</label>
                <div className="relative">
                  <Calendar className={`absolute ${lang === "ar" ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none`} />
                  <select
                    value={level}
                    onChange={(e) => setFormField("level", e.target.value)}
                    disabled={isLoading}
                    className={`w-full h-11 ${lang === "ar" ? "pr-10 pl-3" : "pl-10 pr-3"} rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-all cursor-pointer appearance-none`}
                  >
                    <option value="الفرقة الأولى">{t("الفرقة الأولى (سنة أولى)", "Year 1 (Freshman)")}</option>
                    <option value="الفرقة الثانية">{t("الفرقة الثانية (سنة ثانية)", "Year 2 (Sophomore)")}</option>
                    <option value="الفرقة الثالثة">{t("الفرقة الثالثة (سنة ثالثة)", "Year 3 (Junior)")}</option>
                    <option value="الفرقة الرابعة">{t("الفرقة الرابعة (سنة رابعة)", "Year 4 (Senior)")}</option>
                  </select>
                </div>
              </div>

              {/* Student ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("الرقم الجامعي (ID)", "Student ID")}</label>
                <div className="relative">
                  <User className={`absolute ${lang === "ar" ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400`} />
                  <Input
                    type="text"
                    placeholder={t("الرقم الجامعي الخاص بك", "Your Student ID")}
                    value={studentId}
                    onChange={(e) => setFormField("studentId", e.target.value)}
                    className={lang === "ar" ? "pr-10 text-xs" : "pl-10 text-xs"}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("كلمة المرور المعقدة", "Complex Password")}</label>
                <div className="relative">
                  <Lock className={`absolute ${lang === "ar" ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400`} />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setFormField("password", e.target.value)}
                    className={lang === "ar" ? "pr-10 pl-10 text-xs font-mono" : "pl-10 pr-10 text-xs font-mono"}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${lang === "ar" ? "left-3.5" : "right-3.5"} top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer p-0.5 rounded-lg`}
                    title={showPassword ? t("إخفاء كلمة المرور", "Hide password") : t("إظهار كلمة المرور", "Show password")}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-violet-500" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password Strength Requirement Indicators */}
                {password.length > 0 && (
                  <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 space-y-1 text-[10px] sm:text-[11px] mt-2">
                    <span className="font-bold text-zinc-500 block mb-1">{t("معايير كلمة المرور:", "Password Requirements:")}</span>
                    <div className="grid grid-cols-2 gap-1 font-extrabold">
                      <span className={password.length >= 8 ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400"}>
                        {password.length >= 8 ? "✓" : "○"} 8 أحرف على الأقل
                      </span>
                      <span className={/[a-zA-Z]/.test(password) ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400"}>
                        {/[a-zA-Z]/.test(password) ? "✓" : "○"} حروف إنجليزية (A-Z)
                      </span>
                      <span className={/[0-9]/.test(password) ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400"}>
                        {/[0-9]/.test(password) ? "✓" : "○"} أرقام (0-9)
                      </span>
                      <span className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400"}>
                        {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? "✓" : "○"} رموز مميزة (!@#$)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full mt-2 cursor-pointer font-bold" isLoading={isLoading} disabled={isLoading}>
                {t("إنشاء الحساب والتسجيل", "Create Account & Sign In")}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t border-zinc-100/50 py-4 dark:border-zinc-800/30">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {t("لديك حساب بالفعل؟", "Already have an account?")}{" "}
              <Link href="/auth/login" className="font-bold text-violet-600 hover:underline dark:text-violet-400">
                {t("سجل الدخول", "Sign in")}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
