"use client";

import * as React from"react";
import { useApp } from"@/context/app-context";
import { useAcademic, GRADE_POINTS, GRADE_OPTIONS, GRADE_LABELS } from"@/context/academic-context";
import { useAdmin } from"@/context/admin-context";
import { useAuth } from"@/context/auth-context";
import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from"@/components/ui/card";
import { Badge } from"@/components/ui/badge";
import { SpotlightCard } from"@/components/ui/spotlight-card";
import { Calculator, TrendingUp, Plus, Trash2, RefreshCw, Save, CheckCircle2, AlertCircle, AlertTriangle, Printer, Sparkles, ArrowRight, ArrowLeft } from"lucide-react";
import Link from"next/link";
import { useToast } from"@/components/ui/toast";
import { motion, AnimatePresence } from"framer-motion";
import { AnimatedNumber } from"@/components/ui/animated-number";
import { GradeSelect } from"@/components/ui/grade-select";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { getLocalizedUserName } from "@/lib/utils";

interface SemesterCourseInput {
  id: string;
  code: string;
  credits: number;
  grade: string;
}

export default function GpaPage() {
  const { user } = useAuth();
  const isAdmin = user?.role ==="admin" || user?.role ==="super-admin";
  const { t, lang, dir } = useApp();
  const { toast } = useToast();
  const { courses } = useAdmin();
  const {
    cumulativeGpa,
    completedCredits,
    remainingCredits,
    targetGpa,
    setTargetGpa,
    markCompleted
  } = useAcademic();

  const handlePrintReport = () => {
    toast(t("جاري تجهيز التقرير للطباعة والتصدير...","Preparing report for export & printing..."),"info");
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const [activeTab, setActiveTab] = useLocalStorage<"calculator" |"predictor">("su_gpa_active_tab","calculator");

  // --- Semester GPA Calculator States ---
  const [calcCourses, setCalcCourses] = useLocalStorage<SemesterCourseInput[]>("su_gpa_calc_courses", []);
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const addCalcRow = () => {
    setCalcCourses([
      ...calcCourses,
      { id: Math.random().toString(36).substring(2, 9), code:"", credits: 3, grade:"B" }
    ]);
  };

  const removeCalcRow = (id: string) => {
    setCalcCourses(calcCourses.filter((row) => row.id !== id));
  };

  const updateCalcRow = (id: string, field: keyof SemesterCourseInput, value: any) => {
    setCalcCourses(
      calcCourses.map((row) => {
        if (row.id === id) {
          const updated = { ...row, [field]: value };
          if (field ==="code" && value) {
            const course = courses.find((c) => c.code === value);
            if (course) {
              updated.credits = course.credits;
            }
          }
          return updated;
        }
        return row;
      })
    );
  };

  const semesterGpa = React.useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;
    calcCourses.forEach((c) => {
      const pts = GRADE_POINTS[c.grade] ?? 0;
      totalPoints += pts * c.credits;
      totalCredits += c.credits;
    });
    if (totalCredits === 0) return 0;
    return Math.round((totalPoints / totalCredits) * 100) / 100;
  }, [calcCourses]);

  const totalSemesterCredits = React.useMemo(() => {
    return calcCourses.reduce((sum, c) => sum + c.credits, 0);
  }, [calcCourses]);

  const handleSaveToCompleted = () => {
    if (!user) {
      toast(
        t(" يرجى تسجيل الدخول أو إنشاء حسابك لحفظ ومزامنة درجاتك في سجلك الأكاديمي."," Please sign in or create an account to save & sync your grades to your academic profile."
        ),"info"
      );
      return;
    }
    calcCourses.forEach((c) => {
      if (c.code) {
        markCompleted(c.code, c.grade);
      }
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const resetCalculator = () => {
    setCalcCourses([]);
  };

  // --- Predictor Simulator Calculations ---
  const requiredGpa = React.useMemo(() => {
    if (remainingCredits <= 0) return 0;
    const totalPointsTarget = targetGpa * 144;
    const currentPoints = cumulativeGpa * completedCredits;
    const needed = (totalPointsTarget - currentPoints) / remainingCredits;
    return Math.round(needed * 100) / 100;
  }, [cumulativeGpa, completedCredits, remainingCredits, targetGpa]);

  const predictorStatus = React.useMemo(() => {
    if (remainingCredits <= 0) {
      return { type:"info", text: t("لقد أتممت بالفعل جميع الساعات المطلوبة للتخرج!","You have completed all required graduation credits!") };
    }
    if (requiredGpa > 4.0) {
      return {
        type:"error",
        text: t(
          `المعدل المطلوب هو ${requiredGpa}. من الناحية الرياضية، لا يمكنك الوصول للمعدل المستهدف (${targetGpa}) حتى لو حصلت على امتياز مرتفع A+ في جميع المواد المتبقية.`,
          `Required GPA is ${requiredGpa}. Mathematically impossible to reach target (${targetGpa}) even with A+ in all remaining courses.`
        )
      };
    }
    if (requiredGpa < 0) {
      return {
        type:"success",
        text: t(
          `المعدل المطلوب هو 0.00! لقد حققت بالفعل أو تجاوزت متطلبات معدل التخرج المستهدف الخاص بك بمعدلك الحالي!`,
          `Required GPA is 0.00! You have already met or exceeded your target graduation GPA!`
        )
      };
    }
    if (requiredGpa > 3.4) {
      return {
        type:"warning",
        text: t(
          `المعدل المطلوب هو ${requiredGpa}. هذا يتطلب منك مجهوداً كبيراً جداً والحصول على امتياز (A) في أغلب المواد المتبقية.`,
          `Required GPA is ${requiredGpa}. This requires high effort and obtaining (A) in most remaining courses.`
        )
      };
    }
    return {
      type:"success",
      text: t(
        `المعدل المطلوب هو ${requiredGpa}. يمكنك تحقيق هدفك بمستوى دراسي جيد جداً (متوسط درجات B+ إلى A-) في المواد المتبقية.`,
        `Required GPA is ${requiredGpa}. You can easily achieve your goal with a solid (B+ to A-) average in remaining courses.`
      )
    };
  }, [requiredGpa, targetGpa, remainingCredits, t]);

  const isRtl = dir ==="rtl";

  return (
    <>
      <div className="space-y-8 print:hidden" dir={dir}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5">
            <Calculator className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            {t("حساب وتوقع المعدل التراكمي (GPA)","GPA Calculator & Simulator")}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {t("احسب معدلك الفصلي الحالي، أو خطط وتوقع السيناريوهات المطلوبة لتحقيق معدلك المستهدف.","Calculate your semester GPA or simulate target scenarios to reach your goal."
            )}
          </p>
        </div>

        <Button onClick={handlePrintReport} variant="outline" className="gap-2 text-xs font-bold shadow-sm self-start sm:self-auto cursor-pointer">
          <Printer className="h-4 w-4 text-primary dark:text-sky-400" />
          <span>{t("تصدير / طباعة التقرير (PDF)","Export / Print PDF Report")}</span>
        </Button>
      </div>

      {/* Guest Mode Notification Banner */}
      {!user && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-sky-600/10 via-cyan-600/10 to-blue-500/10 border border-sky-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
        >
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 flex flex-wrap items-center gap-2">
                <span>{t("وضع التجربة والاستخدام السريع للزوار","Guest & Free Exploration Mode")}</span>
                <Badge className="bg-sky-500/20 text-sky-700 dark:text-sky-300 border-none text-[10px] font-bold">
                  {t("مفتوح بالكامل بدون تسجيل","Fully Open & Free")}
                </Badge>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                {t("احسب وتوقع معدلك الفصلي والتراكمي فوراً! لحفظ ومزامنة درجاتك تلقائياً في خطتك الدراسية، يمكنك إنشاء حسابك الجامعي.","Calculate and simulate your GPA instantly! Create your university account to automatically save your curriculum record."
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <Link href="/auth/login" className="flex-1 sm:flex-none">
              <Button size="sm" variant="outline" className="w-full sm:w-auto text-xs font-bold rounded-xl h-9">
                {t("تسجيل الدخول","Sign In")}
              </Button>
            </Link>
            <Link href="/auth/register" className="flex-1 sm:flex-none">
              <Button size="sm" className="w-full sm:w-auto text-xs font-bold rounded-xl h-9 bg-sky-600 hover:bg-sky-700 text-white shadow-md">
                {t("إنشاء حساب","Register")}
              </Button>
            </Link>
          </div>
        </motion.div>
      )}

      {isAdmin && (
        <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between text-xs font-bold text-cyan-600 dark:text-cyan-400">
          <div className="flex items-center gap-2">
            <span>️</span>
            <span>{t("معاينة بوضع مسؤول النظام (Admin View Mode): هذه حاسبة معدل افتراضية لاختبار تجربة الطلاب.","Admin View Mode: This is a preview of the GPA calculator tool for testing student experience.")}</span>
          </div>
          <Badge className="bg-cyan-500 text-white text-[10px] shrink-0 font-mono">وضع المشرف</Badge>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-3 sm:gap-6 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("calculator")}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab ==="calculator"
              ?"border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400"
              :"border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          }`}
        >
          <span className="flex items-center gap-2">
            <Calculator className="h-4.5 w-4.5" />
            {t("حاسبة المعدل الفصلي","Semester GPA Calculator")}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("predictor")}
          className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab ==="predictor"
              ?"border-sky-600 text-sky-600 dark:border-sky-400 dark:text-sky-400"
              :"border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
          }`}
        >
          <span className="flex items-center gap-2">
            <TrendingUp className="h-4.5 w-4.5" />
            {t("محاكي التوقع التراكمي (What-If)","GPA Target Simulator (What-If)")}
          </span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab ==="calculator" ? (
          <motion.div
            key="calculator"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Input Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 shadow-sm">
                <CardHeader className="pb-3 border-b border-zinc-150 dark:border-zinc-800/60 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <CardTitle className="text-base font-bold">{t("مواد الفصل الدراسي","Semester Courses")}</CardTitle>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button variant="outline" size="sm" onClick={resetCalculator} className="flex-1 sm:flex-initial gap-1 text-xs h-9">
                        <RefreshCw className="h-3.5 w-3.5" />
                        {t("إعادة تعيين","Reset")}
                      </Button>
                      <Button size="sm" onClick={addCalcRow} className="flex-1 sm:flex-initial gap-1 text-xs h-9">
                        <Plus className="h-3.5 w-3.5" />
                        {t("إضافة مادة","Add Course")}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {calcCourses.length > 0 ? (
                    <>
                      <div className="hidden sm:grid grid-cols-12 gap-4 text-xs font-bold text-zinc-400 pb-2 border-b border-zinc-100 dark:border-zinc-850">
                        <div className="col-span-6">{t("المادة الدراسية","Course")}</div>
                        <div className="col-span-3 text-center">{t("الساعات","Credits")}</div>
                        <div className="col-span-2 text-center">{t("التقدير المتوقع","Grade")}</div>
                        <div className="col-span-1"></div>
                      </div>

                      {calcCourses.map((row) => (
                        <div key={row.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center border-b border-zinc-100/50 dark:border-zinc-850/40 pb-3 sm:pb-0 sm:border-0">
                          {/* Course Selection */}
                          <div className="col-span-12 sm:col-span-6">
                            <label className="text-[10px] font-bold text-zinc-400 sm:hidden block mb-1">{t("المادة","Course")}</label>
                            <select
                              value={row.code}
                              onChange={(e) => updateCalcRow(row.id,"code", e.target.value)}
                              className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:ring-sky-500 transition-all duration-200 cursor-pointer"
                            >
                              <option value="">{t("-- اختر مقرر دراسي --","-- Select a course --")}</option>
                              {courses.map((course) => (
                                <option key={course.code} value={course.code}>
                                  {course.code} - {t(course.arabic, course.english)} ({course.credits} {t("ساعة","cr")})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Credit Hours */}
                          <div className="col-span-6 sm:col-span-3">
                            <label className="text-[10px] font-bold text-zinc-400 sm:hidden block mb-1">{t("عدد الساعات","Credits")}</label>
                            <Input
                              type="number"
                              min={0}
                              max={6}
                              value={row.credits}
                              onChange={(e) => updateCalcRow(row.id,"credits", parseInt(e.target.value) || 0)}
                              className="text-center"
                            />
                          </div>

                          {/* Grade */}
                          <div className="col-span-6 sm:col-span-2">
                            <label className="text-[10px] font-bold text-zinc-400 sm:hidden block mb-1">{t("التقدير","Grade")}</label>
                            <GradeSelect
                              value={row.grade}
                              onChange={(val) => updateCalcRow(row.id,"grade", val)}
                              options={GRADE_OPTIONS}
                              className="w-full h-11"
                            />
                          </div>

                          {/* Actions */}
                          <div className="col-span-12 sm:col-span-1 text-center">
                            <button
                              onClick={() => removeCalcRow(row.id)}
                              className="p-2.5 rounded-xl border border-zinc-200 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:border-zinc-800 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="py-12 text-center text-zinc-400 dark:text-zinc-550 space-y-3">
                      <Calculator className="h-9 w-9 mx-auto text-primary dark:text-zinc-700" />
                      <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
                        {t("لا توجد مواد مضافة حالياً. اضغط على'إضافة مادة' للبدء بحساب معدلك.","No courses added yet. Click'Add Course' to calculate GPA.")}
                      </p>
                      <Button size="sm" onClick={addCalcRow} className="gap-1.5 text-xs font-bold px-5">
                        <Plus className="h-4 w-4" />
                        {t("إضافة مادة جديدة","Add New Course")}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Save widget */}
              <div className="flex flex-col sm:flex-row justify-between items-center p-5 bg-sky-50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/30 rounded-2xl gap-4">
                <div>
                  <h4 className="font-bold text-sm text-zinc-850 dark:text-zinc-100">
                    {t("حفظ الدرجات للملف الشخصي","Save Grades to Profile")}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {t("احفظ المواد المختارة فوراً في سجلك الأكاديمي المنجز لتنعكس في إحصائيات لوحة التحكم ومخطط المواد.","Save chosen courses to your academic record to update dashboard statistics and checklist."
                    )}
                  </p>
                </div>
                <Button onClick={handleSaveToCompleted} className="gap-2 shrink-0 font-bold">
                  <Save className="h-4.5 w-4.5" />
                  {t("مزامنة المواد المنجزة","Sync Completed Courses")}
                </Button>
              </div>

              {savedSuccess && (
                <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400 text-xs font-semibold flex items-center gap-2.5">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>{t("تم بنجاح تحديث ومزامنة سجلك الأكاديمي في قاعدة البيانات!","Academic record updated & synced successfully!")}</span>
                </div>
              )}
            </div>

            {/* Results Sidebar with ReactBits SpotlightCard */}
            <div>
              <SpotlightCard className="border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm text-center" spotlightColor="rgba(2, 132, 199, 0.22)">
                <div className="pt-8 pb-6 px-6">
                  <h3 className="text-zinc-900 dark:text-white font-bold text-sm">
                    {t("المعدل الفصلي المتوقع","Expected Semester GPA")}
                  </h3>
                  <div className="text-5xl font-black text-zinc-950 dark:text-white mt-4.5">
                    <AnimatedNumber value={semesterGpa} decimals={2} />
                  </div>
                  <Badge className="mt-3 bg-zinc-100 text-zinc-900 border-zinc-300 text-xs py-1 px-3 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700">
                    {semesterGpa >= 3.4
                      ? t("جيد جداً مرتفع","High Distinction")
                      : semesterGpa >= 2.8
                      ? t("جيد جداً","Very Good")
                      : t("مقبول","Passing")}
                  </Badge>

                  <div className={`grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-850 ${isRtl ?"text-right" :"text-left"}`}>
                    <div>
                      <span className="text-[10px] font-bold text-zinc-700 dark:text-white block">{t("إجمالي الساعات","Total Credits")}</span>
                      <span className="text-base font-bold text-zinc-950 dark:text-white">{totalSemesterCredits} {t("ساعة","Hours")}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-zinc-700 dark:text-white block">{t("النقاط المقدرة","Quality Points")}</span>
                      <span className="text-base font-bold text-zinc-950 dark:text-white">
                        {calcCourses.reduce((sum, c) => sum + (GRADE_POINTS[c.grade] ?? 0) * c.credits, 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="predictor"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Simulation Controls */}
            <div className="lg:col-span-2 space-y-6">
              {/* Guest Warning for What-If Simulator */}
              {!user && (
                <div className="p-4.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black">
                        {t("️ تنبيه: محاكي التوقع التراكمي (What-If) يحتاج إلى سجل موادك المكتملة","️ Notice: What-If Simulator works best with your completed course history"
                        )}
                      </h4>
                      <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-1 leading-relaxed">
                        {t("لكي يحسب النظام التقدير والدرجات المطلوبة للتخرج بدقة 100%، يفضّل تسجيل الدخول لكي يعرف النظام عدد الساعات والمواد التي اجتزتها بالفعل في خطتك الدراسية.","For 100% accurate graduation predictions, sign in so the system knows your exact completed credits and past grades."
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    <Link href="/auth/login" className="flex-1 sm:flex-none">
                      <Button size="sm" variant="outline" className="w-full sm:w-auto text-xs font-bold rounded-xl border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10">
                        {t("تسجيل الدخول","Sign In")}
                      </Button>
                    </Link>
                    <Link href="/auth/register" className="flex-1 sm:flex-none">
                      <Button size="sm" className="w-full sm:w-auto text-xs font-bold rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-md">
                        {t("إنشاء حساب","Register")}
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              <Card className="border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-bold">{t("تحديد المعدل المستهدف","Set Target GPA")}</CardTitle>
                  <CardDescription className="text-xs">{t("استخدم المنزلق لتحديد المعدل التراكمي (GPA) الذي تود التخرج به.","Use slider to set target graduation GPA.")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-zinc-650 dark:text-zinc-400">{t("المعدل المستهدف عند التخرج:","Target GPA at graduation:")}</span>
                      <span className="text-lg text-sky-600 dark:text-sky-400 font-extrabold">{targetGpa.toFixed(2)}</span>
                    </div>

                    <input
                      type="range"
                      min="2.00"
                      max="4.00"
                      step="0.05"
                      value={targetGpa}
                      onChange={(e) => setTargetGpa(parseFloat(e.target.value))}
                      className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-600"
                    />

                    <div className="flex justify-between text-[10px] font-bold text-zinc-400">
                      <span>2.00 {t("مقبول","Good")}</span>
                      <span>3.00 {t("جيد جداً","Very Good")}</span>
                      <span>4.00 {t("امتياز مرتفع","High Distinction")}</span>
                    </div>
                  </div>

                  <div className={`p-4.5 rounded-2xl border text-xs leading-relaxed font-semibold flex gap-3 ${
                    predictorStatus.type ==="success"
                      ?"bg-green-50 border-green-200 text-green-700 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400"
                      : predictorStatus.type ==="error"
                      ?"bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"
                      :"bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400"
                  }`}>
                    {predictorStatus.type ==="success" && <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />}
                    {predictorStatus.type ==="error" && <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />}
                    {predictorStatus.type ==="warning" && <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />}
                    <span>{predictorStatus.text}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Simulation Results Summary with ReactBits SpotlightCard */}
            <div>
              <SpotlightCard className="border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm text-center" spotlightColor="rgba(6, 182, 212, 0.15)">
                <div className="pt-8 pb-6 px-6">
                  <h3 className="text-zinc-900 dark:text-white font-bold text-sm">
                    {t("المعدل المطلوب في الساعات المتبقية","Required GPA in Remaining Hours")}
                  </h3>
                  <div className="text-5xl font-black text-zinc-950 dark:text-white mt-4.5">
                    {requiredGpa <= 0 ?"0.00" : requiredGpa > 4.0 ?"A+" : requiredGpa.toFixed(2)}
                  </div>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-300 mt-2.5">
                    ({t(`مستند إلى معدلك الحالي ${cumulativeGpa.toFixed(2)} وإتمامك ${completedCredits} ساعة`, `Based on current GPA ${cumulativeGpa.toFixed(2)} & ${completedCredits} credits`)})
                  </p>

                  <div className={`mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-850 ${isRtl ?"text-right" :"text-left"} space-y-4`}>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-700 dark:text-white font-bold">{t("الساعات المنجزة:","Completed Credits:")}</span>
                      <span className="font-bold text-zinc-950 dark:text-white">{completedCredits} / 144</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-700 dark:text-white font-bold">{t("الساعات المتبقية للتخرج:","Remaining Credits:")}</span>
                      <span className="font-bold text-zinc-950 dark:text-white">{remainingCredits} {t("ساعة","Hours")}</span>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      {/* Official Print & PDF Export Document Layout */}
      <div className="hidden print:block text-black p-6 space-y-6 bg-white font-sans w-full leading-relaxed" dir={dir}>
        {/* Document Header */}
        <div className="flex justify-between items-center border-b-2 border-black pb-4">
          <div className="space-y-1">
            <h1 className="text-xl font-black">
              {t("جامعة سيناء — Sinai University","Sinai University")}
            </h1>
            <h2 className="text-sm font-bold">
              {t("كلية الحاسبات وتكنولوجيا المعلومات (SU IT Guide)","Faculty of Computers & Information Technology (SU IT Guide)")}
            </h2>
            <p className="text-xs text-gray-700 font-semibold">
              {t("السجل والتقرير الأكاديمي الموحد للطلاب (Official Academic Transcript Summary)","Official Academic Transcript Summary")}
            </p>
          </div>
          <div className={`${isRtl ?"text-left" :"text-right"} text-xs space-y-1 font-bold`}>
            <p>{t("تاريخ التصدير:","Export Date:")} {new Date().toLocaleDateString(lang ==="ar" ?"ar-EG" :"en-US")}</p>
            <p className="text-gray-600">
              {t("نوع المستند: التقرير الفصلي والتراكمي","Document Type: Semester & Cumulative Report")}
            </p>
          </div>
        </div>

        {/* Student Metadata Box */}
        <div className="grid grid-cols-2 gap-4 border border-black p-4 rounded-xl text-xs bg-gray-50">
          <div>
            <span className="font-bold text-gray-700">{t("اسم الطالب:","Student Name:")} </span>
            <span className="font-black text-black">{user ? getLocalizedUserName(user, lang) : t("طالب زائر (تقرير تجريبي)","Guest Student (Trial Report)")}</span>
          </div>
          <div>
            <span className="font-bold text-gray-700">{t("الرقم الجامعي (ID):","Student ID:")} </span>
            <span className="font-black text-black">{user?.studentId || t("غير مسجل (حساب زائر)","Unregistered (Guest)")}</span>
          </div>
          <div>
            <span className="font-bold text-gray-700">{t("التخصص / القسم الأكاديمي:","Department / Major:")} </span>
            <span className="font-black text-black">{user?.department || t("تكنولوجيا المعلومات وعلوم الحاسب (IT & CS)","Information Technology & CS")}</span>
          </div>
          <div>
            <span className="font-bold text-gray-700">{t("المستوى:","Level / Year:")} </span>
            <span className="font-black text-black">{user?.level || t("تقرير استرشادي فصلي","Guidance & Simulation Report")}</span>
          </div>
        </div>

        {/* Academic Stats Box */}
        <div className="grid grid-cols-4 gap-3 text-center text-xs">
          <div className="border border-black p-3 rounded-xl bg-gray-50">
            <span className="block font-bold text-gray-600 mb-1">{t("المعدل التراكمي الفعلي","Cumulative GPA")}</span>
            <span className="text-xl font-black">{cumulativeGpa.toFixed(2)}</span>
          </div>
          <div className="border border-black p-3 rounded-xl bg-gray-50">
            <span className="block font-bold text-gray-600 mb-1">{t("الساعات المستكملة","Completed Credits")}</span>
            <span className="text-xl font-black">{completedCredits} / 144</span>
          </div>
          <div className="border border-black p-3 rounded-xl bg-gray-50">
            <span className="block font-bold text-gray-600 mb-1">{t("الساعات المتبقية","Remaining Credits")}</span>
            <span className="text-xl font-black">{remainingCredits} {t("ساعة","cr")}</span>
          </div>
          <div className="border border-black p-3 rounded-xl bg-gray-50">
            <span className="block font-bold text-gray-600 mb-1">{t("المعدل الفصلي الحالي","Semester GPA")}</span>
            <span className="text-xl font-black">{semesterGpa}</span>
          </div>
        </div>

        {/* Courses Grade Table */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold border-b border-black pb-1">
            {t("بيان درجات ومواد التقرير الحالي:","Current Semester Course Grades:")}
          </h3>
          <table className={`w-full ${isRtl ?"text-right" :"text-left"} text-xs border-collapse border border-black`}>
            <thead>
              <tr className="bg-gray-100 border-b border-black font-bold">
                <th className={`p-2.5 ${isRtl ?"border-l" :"border-r"} border-black`}>#</th>
                <th className={`p-2.5 ${isRtl ?"border-l" :"border-r"} border-black`}>{t("رمز المقرر","Course Code")}</th>
                <th className={`p-2.5 ${isRtl ?"border-l" :"border-r"} border-black`}>{t("اسم المادة الدراسية","Course Name")}</th>
                <th className={`p-2.5 ${isRtl ?"border-l" :"border-r"} border-black`}>{t("الساعات","Credits")}</th>
                <th className={`p-2.5 ${isRtl ?"border-l" :"border-r"} border-black`}>{t("التقدير المتوقع","Grade")}</th>
                <th className="p-2.5">{t("النقاط المكتسبة","Quality Points")}</th>
              </tr>
            </thead>
            <tbody>
              {calcCourses.map((c, idx) => {
                const found = courses.find((co) => co.code === c.code);
                const pts = (GRADE_POINTS[c.grade] || 0) * (c.credits || 0);
                return (
                  <tr key={c.id} className="border-b border-black">
                    <td className={`p-2.5 ${isRtl ?"border-l" :"border-r"} border-black font-bold`}>{idx + 1}</td>
                    <td className={`p-2.5 ${isRtl ?"border-l" :"border-r"} border-black font-black`}>{c.code || t("مقرر فصلي","Semester Course")}</td>
                    <td className={`p-2.5 ${isRtl ?"border-l" :"border-r"} border-black font-semibold`}>{found ? t(found.arabic, found.english) : t("مقرر اختياري/إجباري","Elective/Core Course")}</td>
                    <td className={`p-2.5 ${isRtl ?"border-l" :"border-r"} border-black font-bold`}>{c.credits}</td>
                    <td className={`p-2.5 ${isRtl ?"border-l" :"border-r"} border-black font-black`}>{c.grade} ({GRADE_LABELS[c.grade] ||""})</td>
                    <td className="p-2.5 font-black">{pts.toFixed(1)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Sign-off Verification Footer */}
        <div className="pt-8 border-t border-black flex justify-between items-end text-[10px] text-gray-700">
          <div>
            <p className="font-bold">{t("تنبيه رسمي:","Official Notice:")}</p>
            <p>{t("هذا المستند التوضيحي مستخرج آلياً وموثق عبر دليل ومرشد طلاب الحاسبات (SU IT Guide).","This official transcript summary is automatically generated and verified via SU IT Guide.")}</p>
            <p>Verification URL: su-it-guide.vercel.app</p>
          </div>
          <div className="text-center space-y-1">
            <p className="font-bold">{t("اعتماد وتوثيق النظام الأكاديمي","Academic System Verification & Endorsement")}</p>
            <div className="w-32 h-12 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center font-bold text-[9px] text-gray-500">
              {t("[ ختم التوثيق الإلكتروني ]","[ Digital Seal & Verification ]")}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
