"use client";

import * as React from "react";
import { useAuth } from "@/context/auth-context";
import { useApp } from "@/context/app-context";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { GraduationCap, User, Calendar, Save, Sparkles, CheckCircle2, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function CompleteProfileModal() {
  const { user, updateProfile } = useAuth();
  const { t, lang, dir } = useApp();
  const { toast } = useToast();

  const [name, setName] = React.useState("");
  const [level, setLevel] = React.useState("");
  const [studentId, setStudentId] = React.useState("");
  const [department, setDepartment] = React.useState("تكنولوجيا المعلومات وعلوم الحاسب (IT & CS)");
  const [isSaving, setIsSaving] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (user && (user.needsOnboarding || user.isProfileComplete === false)) {
      setName(user.name || "");
      setLevel(user.level || "");
      setStudentId(user.studentId || "");
      setDepartment(user.department || "تكنولوجيا المعلومات وعلوم الحاسب (IT & CS)");
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast(t("️ يرجى إدخال اسمك الكامل.", "️ Please enter your full name."), "error");
      return;
    }

    if (!level.trim()) {
      toast(t("️ يرجى اختيار وتحديد الفرقة الدراسية.", "️ Please select your academic year."), "error");
      return;
    }

    if (!studentId.trim()) {
      toast(t("️ يرجى إدخال رقمك الجامعي الأكاديمي.", "️ Please enter your Academic Student ID."), "error");
      return;
    }

    setIsSaving(true);
    try {
      const success = await updateProfile({
        name: name.trim(),
        level,
        studentId: studentId.trim(),
        department,
        isProfileComplete: true,
        needsOnboarding: false
      });

      if (success) {
        if (typeof window !== "undefined") {
          localStorage.setItem("su_prompt_complete_profile", "true");
          window.dispatchEvent(new Event("su_prompt_complete_profile_updated"));
        }
        toast(t("تم حفظ بياناتك بنجاح! يرجى استكمال باقي بياناتك في صفحة البروفايل.", "Details saved! Please complete your remaining details on the profile page."), "success");
        setIsOpen(false);
      }
    } catch (err: any) {
      if (err.message && err.message.includes("مسجل بالفعل")) {
        toast(err.message, "error");
      } else {
        toast(t("حدث خطأ أثناء حفظ البيانات.", "Error saving profile data."), "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" dir={dir}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full max-w-lg"
        >
          <Card className="border border-sky-500/30 bg-white/90 dark:bg-zinc-950/90 shadow-2xl backdrop-blur-xl overflow-y-auto max-h-[90vh] rounded-2xl">
            <div className="h-2 bg-gradient-to-r from-sky-600 via-cyan-500 to-amber-400" />

            <CardHeader className="text-center pt-6 pb-4 px-6">
              <div className="mx-auto h-14 w-14 rounded-2xl bg-sky-600/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3 ring-4 ring-sky-500/10">
                <GraduationCap className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 flex items-center justify-center gap-2">
                <span>{t("استكمال البيانات الأكاديمية", "Complete Academic Profile")}</span>
                <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
              </CardTitle>
              <CardDescription className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mt-1">
                {t("مرحباً بك في منصة جامعة سيناء! يرجى تحديث بياناتك الجامعية الرسمية ليتم تخصيص جدولك وخدماتك الأكاديمية بدقة.", "Welcome to Sinai University Portal! Please update your official academic details to personalize your portal services."
                )}
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 px-6 py-2">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    {t("الاسم الثلاثي / الكامل", "Full Student Name")}
                  </label>
                  <div className="relative">
                    <User className={`absolute ${lang === "ar" ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400`} />
                    <Input
                      type="text"
                      placeholder={t("أدخل اسمك الأكاديمي الكامل", "Enter your full academic name")}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={lang === "ar" ? "pr-10 text-xs" : "pl-10 text-xs"}
                      disabled={isSaving}
                      required
                    />
                  </div>
                </div>

                {/* Academic Level */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    {t("الفرقة الدراسية", "Academic Level")}
                  </label>
                  <div className="relative">
                    <Calendar className={`absolute ${lang === "ar" ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none`} />
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      disabled={isSaving}
                      className={`w-full h-11 ${lang === "ar" ? "pr-10 pl-3" : "pl-10 pr-3"} rounded-xl border border-zinc-200 bg-white text-xs font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-all cursor-pointer appearance-none`}
                      required
                    >
                      <option value="" disabled>{t("اختر الفرقة الدراسية...", "Select academic year...")}</option>
                      <option value="الفرقة الأولى">{t("الفرقة الأولى (سنة أولى)", "Year 1 (Freshman)")}</option>
                      <option value="الفرقة الثانية">{t("الفرقة الثانية (سنة ثانية)", "Year 2 (Sophomore)")}</option>
                      <option value="الفرقة الثالثة">{t("الفرقة الثالثة (سنة ثالثة)", "Year 3 (Junior)")}</option>
                      <option value="الفرقة الرابعة">{t("الفرقة الرابعة (سنة رابعة)", "Year 4 (Senior)")}</option>
                    </select>
                  </div>
                </div>

                {/* Student ID */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    {t("الرقم الجامعي (Student ID)", "Student Academic ID")}
                  </label>
                  <div className="relative">
                    <BookOpen className={`absolute ${lang === "ar" ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400`} />
                    <Input
                      type="text"
                      placeholder={t("مثال: 20230109", "e.g. 20230109")}
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className={lang === "ar" ? "pr-10 text-xs font-mono" : "pl-10 text-xs font-mono"}
                      disabled={isSaving}
                      required
                    />
                  </div>
                </div>

                {/* Department Info */}
                <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-700 dark:text-sky-300 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary dark:text-sky-400 shrink-0" />
                  <span>{t("البرنامج: تكنولوجيا المعلومات وعلوم الحاسب (IT & CS)", "Program: Information Technology & Computer Science (IT & CS)")}</span>
                </div>
              </CardContent>

              <CardFooter className="pt-4 pb-6 px-6">
                <Button
                  type="submit"
                  className="w-full gap-2 font-bold shadow-lg shadow-sky-500/25 bg-sky-600 hover:bg-sky-700 text-white rounded-xl h-11"
                  isLoading={isSaving}
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4" />
                  {t("حفظ واستكمال الملف", "Save & Proceed")}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
