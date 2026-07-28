"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useApp } from "@/context/app-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { GraduationCap, Mail, Lock, User, Calendar, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const { t, dir, lang } = useApp();
  const { register, isLoading } = useAuth();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [studentId, setStudentId] = React.useState("");
  const [level, setLevel] = React.useState("الفرقة الأولى");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const department = "تكنولوجيا المعلومات وعلوم الحاسب";
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError(t("الرجاء ملء جميع الحقول المطلوبة (الاسم والبريد وكلمة المرور).", "Please fill in all required fields."));
      return;
    }

    try {
      const success = await register(name.trim(), email.trim(), password.trim(), level, department, studentId.trim());
      if (success) {
        // Direct seamless redirection to dashboard after successful registration!
        router.push("/dashboard");
      } else {
        setError(t("فشل إنشاء الحساب. البريد مسجل مسبقاً أو البيانات غير مكتملة.", "Registration failed. Email might already exist."));
      }
    } catch (err) {
      setError(t("حدث خطأ أثناء التسجيل. حاول مرة أخرى.", "An error occurred during registration."));
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-center items-center px-6 py-12 relative" dir={dir}>
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 mb-4">
            <div className="h-10 w-10 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-lg">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="font-bold text-2xl text-zinc-900 dark:text-zinc-50">
              SU IT <span className="text-violet-600 dark:text-violet-400">Guide</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{t("إنشاء حساب جديد", "Create New Account")}</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{t("ابدأ رحلتك الأكاديمية الذكية اليوم", "Start your academic journey today")}</p>
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
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("الاسم الكامل", "Full Name")}</label>
                <div className="relative">
                  <User className={`absolute ${lang === "ar" ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400`} />
                  <Input
                    type="text"
                    placeholder={t("اسم الطالب", "Student Name")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={lang === "ar" ? "pr-10 text-xs" : "pl-10 text-xs"}
                    disabled={isLoading}
                  />
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
                    onChange={(e) => setEmail(e.target.value)}
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
                    onChange={(e) => setLevel(e.target.value)}
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
                    onChange={(e) => setStudentId(e.target.value)}
                    className={lang === "ar" ? "pr-10 text-xs" : "pl-10 text-xs"}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("كلمة المرور", "Password")}</label>
                <div className="relative">
                  <Lock className={`absolute ${lang === "ar" ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400`} />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={lang === "ar" ? "pr-10 text-xs" : "pl-10 text-xs"}
                    disabled={isLoading}
                  />
                </div>
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
