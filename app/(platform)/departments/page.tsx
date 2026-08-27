"use client";

import * as React from "react";
import { useApp } from "@/context/app-context";
import { useAcademic, GRADE_OPTIONS } from "@/context/academic-context";
import { useAdmin } from "@/context/admin-context";
import { PERIODS } from "@/lib/courses-data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { GradeSelect } from "@/components/ui/grade-select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { CountUp } from "@/components/ui/count-up";
import { BookOpen, GraduationCap, Award, CheckSquare, Square, Star, Bookmark, Info, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

export default function CurriculumProgressChecklist() {
  const { lang, t, dir } = useApp();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "super-admin" || user?.role === "moderator";
  const { courses } = useAdmin();
  
  const {
    completedCredits,
    remainingCredits,
    graduationPercentage,
    cumulativeGpa,
    markCompleted,
    unmarkCompleted,
    markPlanned,
    unmarkPlanned,
    removeCourse,
    isCompleted,
    isPlanned,
    getCourseGrade
  } = useAcademic();

  // Course prefix reference legend data
  const prefixLegend = [
    { prefix: "CSW", nameAr: "علوم الحاسب والبرمجيات", nameEn: "Computer Science & Web", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/40" },
    { prefix: "INT", nameAr: "تكنولوجيا المعلومات والشبكات", nameEn: "Information Technology & Networks", color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/40" },
    { prefix: "ISD", nameAr: "نظم المعلومات وقواعد البيانات", nameEn: "Information Systems & Data", color: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800/40" },
    { prefix: "HU", nameAr: "المواد العامة والإنسانية", nameEn: "Humanities & General Courses", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40" },
    { prefix: "BS / MATH", nameAr: "العلوم الأساسية والرياضيات", nameEn: "Basic Sciences & Mathematics", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40" }
  ];

  // Filter courses for a given semester period
  const getCoursesForPeriod = React.useCallback((period: string) => {
    return courses.filter((c) => c.period === period);
  }, [courses]);

  // Handle checking/unchecking a course
  const handleCheckCourse = (code: string, checked: boolean) => {
    if (checked) {
      markCompleted(code, ""); // Start with empty grade
    } else {
      unmarkCompleted(code);
    }
  };

  // List of semesters in English
  const PERIODS_EN: Record<string, string> = {
    "year-1-sem-1": "Year 1 - Semester 1",
    "year-1-sem-2": "Year 1 - Semester 2",
    "year-2-sem-1": "Year 2 - Semester 1",
    "year-2-sem-2": "Year 2 - Semester 2",
    "year-3-sem-1": "Year 3 - Semester 1",
    "year-3-sem-2": "Year 3 - Semester 2",
    "year-4-sem-1": "Year 4 - Semester 1",
    "year-4-sem-2": "Year 4 - Semester 2"
  };

  const isRtl = dir === "rtl";

  return (
    <div className="space-y-8" dir={dir}>
      {isAdmin && (
        <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between text-xs font-bold text-cyan-600 dark:text-cyan-400">
          <div className="flex items-center gap-2">
            <span>⚙️</span>
            <span>{t("معاينة بوضع مسؤول النظام (Admin View Mode): هذه معاينة لخطة المقررات الخاصة بالطلاب.", "Admin View Mode: This is a preview of the student curriculum checklist.")}</span>
          </div>
          <Badge className="bg-cyan-500 text-white text-[10px] shrink-0 font-mono">وضع المشرف</Badge>
        </div>
      )}

      {/* Header section */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
          {t("الخطة الدراسية العامة والتقدم الأكاديمي", "General Curriculum Plan & Progress")}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          {t(
            "تصفح كافة مقررات الكلية، حدد المواد المنجزة وسجل تقديراتك لمتابعة معدلك التراكمي ونسب التخرج بشكل فوري.",
            "Browse all faculty courses, check completed subjects and select grades to update your cumulative GPA instantly."
          )}
        </p>
      </div>

      {/* Dynamic Summary Cards with ReactBits SpotlightCard & CountUp */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* GPA Box */}
        <SpotlightCard className="card border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm text-center" spotlightColor="rgba(139, 92, 246, 0.15)">
          <div className="p-6">
            <span className="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-wider block">
              {t("المعدل التراكمي الحالي (GPA)", "Current Cumulative GPA")}
            </span>
            <div className="text-4xl font-black text-zinc-950 dark:text-white mt-2.5">
              {cumulativeGpa > 0 ? (
                <CountUp to={cumulativeGpa} decimals={2} duration={1.2} />
              ) : (
                "0.00"
              )}
            </div>
            <Badge variant="outline" className="mt-2.5 border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 bg-zinc-100/80 dark:bg-zinc-800/40 text-[9px] font-bold py-0.5 px-2">
              {cumulativeGpa >= 3.6 
                ? t("امتياز مرتفع 🚀", "Excellent (High) 🚀") 
                : cumulativeGpa >= 3.0 
                ? t("جيد جداً 👍", "Very Good 👍")
                : cumulativeGpa >= 2.0
                ? t("مقبول ⭐️", "Good ⭐️")
                : t("جديد / لم يبدأ بعد", "New / Not Started")}
            </Badge>
          </div>
        </SpotlightCard>

        {/* Credits Hours Completed */}
        <SpotlightCard className="card border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm text-center" spotlightColor="rgba(99, 102, 241, 0.15)">
          <div className="p-6">
            <span className="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-wider block">
              {t("الساعات المنجزة بنجاح", "Completed Credit Hours")}
            </span>
            <div className="text-4xl font-black text-zinc-950 dark:text-white mt-2.5">
              <CountUp to={completedCredits} duration={1.4} /> <span className="text-xs text-zinc-600 dark:text-zinc-300">/ 144</span>
            </div>
            <span className="text-[10px] text-zinc-700 dark:text-zinc-200 mt-2.5 block font-bold">
              {t(`متبقي للتخرج: ${remainingCredits} ساعة معتمدة`, `${remainingCredits} credits remaining for graduation`)}
            </span>
          </div>
        </SpotlightCard>

        {/* Graduation Percent Tracker */}
        <SpotlightCard className="card border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex flex-col justify-center" spotlightColor="rgba(16, 185, 129, 0.15)">
          <div className="px-6 py-6 flex flex-col justify-center h-full">
            <div className="flex justify-between items-center mb-2.5 text-xs font-bold">
              <span className="text-zinc-900 dark:text-white font-bold">{t("التقدم الإجمالي للتخرج", "Overall Graduation Progress")}</span>
              <span className="text-sky-600 dark:text-sky-400 font-black">
                <CountUp to={graduationPercentage} suffix="%" duration={1.4} />
              </span>
            </div>
            <Progress value={graduationPercentage} className="h-2 bg-zinc-150 dark:bg-zinc-800" />
            <span className="text-[9px] text-zinc-700 dark:text-zinc-300 mt-2 leading-tight font-medium">
              {t("النسبة المحسوبة بناءً على الساعات المسجلة في الخطة المنجزة.", "Percentage calculated from completed credit hours.")}
            </span>
          </div>
        </SpotlightCard>
      </div>

      {/* Course Code Prefix Reference Legend Box */}
      <Card className="border border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/60 shadow-sm">
        <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-850">
          <CardTitle className="text-xs font-black uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
            <Info className="h-4 w-4 text-sky-600" />
            <span>{t("دليل رموز وأكواد المقررات الأكاديمية", "Academic Course Code Reference Legend")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {prefixLegend.map((item) => (
              <div
                key={item.prefix}
                className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 font-semibold ${item.color}`}
              >
                <span className="font-mono font-black text-xs px-2 py-0.5 rounded-md bg-white/60 dark:bg-zinc-950/60 shadow-xs shrink-0">
                  {item.prefix}
                </span>
                <span className="truncate">{t(item.nameAr, item.nameEn)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main checklist timeline (Semesters list) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-black text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="h-4.5 w-4.5 text-zinc-400" />
              {t("الجدول الأكاديمي المقسم بالفصول", "Semester Curriculum Checklist")}
            </h3>

            <div className="space-y-5">
              {Object.entries(PERIODS).map(([periodKey, periodLabel]) => {
                const periodCourses = getCoursesForPeriod(periodKey);
                const periodCredits = periodCourses.reduce((sum, c) => sum + c.credits, 0);

                if (periodCourses.length === 0) return null;

                return (
                  <Card key={periodKey} className="card border border-zinc-200/50 dark:border-zinc-800/40 overflow-hidden shadow-sm">
                    {/* Semester Header */}
                    <div className="py-3 px-4 bg-zinc-50/50 dark:bg-zinc-900/30 border-b border-zinc-100 dark:border-zinc-850 flex items-center justify-between">
                      <h4 className="font-extrabold text-xs text-zinc-850 dark:text-zinc-200">
                        {lang === "ar" ? periodLabel : PERIODS_EN[periodKey]}
                      </h4>
                      <Badge className="bg-cyan-500/10 text-cyan-400 border-transparent text-[9px] font-bold">
                        {periodCredits} {t("ساعة معتمدة", "Credits")}
                      </Badge>
                    </div>

                    {/* Courses Checklist Rows */}
                    <div className="divide-y divide-zinc-150/10 dark:divide-zinc-850">
                      {periodCourses.map((c) => {
                        const completed = isCompleted(c.code);
                        const planned = isPlanned(c.code);
                        const currentGrade = getCourseGrade(c.code) || "";

                        return (
                          <div
                            key={c.code}
                            className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 transition-colors duration-200 ${
                              completed
                                ? "bg-green-500/[0.02]"
                                : planned
                                ? "bg-cyan-500/[0.01]"
                                : ""
                            }`}
                          >
                            {/* Checkbox and Course description */}
                            <div className="flex items-start gap-3 min-w-0">
                              {/* Styled Custom Checkbox */}
                              <button
                                onClick={() => handleCheckCourse(c.code, !completed)}
                                className={`mt-0.5 rounded-md p-0.5 transition-colors cursor-pointer border ${
                                  completed
                                    ? "bg-green-600 border-green-600 text-white"
                                    : "border-zinc-300 dark:border-zinc-700 text-transparent hover:border-zinc-400"
                                }`}
                              >
                                {completed ? (
                                  <CheckSquare className="h-4.5 w-4.5 shrink-0" />
                                ) : (
                                  <Square className="h-4.5 w-4.5 shrink-0" />
                                )}
                              </button>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Link
                                    href={`/courses/${c.code}`}
                                    className="text-xs font-bold text-zinc-700 dark:text-zinc-200 hover:text-cyan-400 hover:underline transition-colors truncate"
                                  >
                                    {t(c.arabic, c.english)}
                                  </Link>
                                  {/* Code Badge Next to Title */}
                                  <span className="text-[10px] font-mono font-black text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200/60 dark:border-cyan-800/40 px-2 py-0.5 rounded-md shrink-0">
                                    {c.code}
                                  </span>
                                </div>
                                <span className="text-[10px] text-zinc-400 block mt-0.5">
                                  {lang === "ar" ? c.english : c.arabic}
                                </span>

                                {/* Prerequisites list */}
                                {c.prerequisites.length > 0 && (
                                  <span className="text-[9px] font-bold text-zinc-500 block mt-1 leading-none">
                                    {t("المتطلبات السابقة:", "Prerequisites:")} {c.prerequisites.join(", ")}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Actions (Credits, Grade Selector, Planned toggle) */}
                            <div className={`flex items-center gap-2.5 sm:gap-3 shrink-0 w-full sm:w-auto pt-2.5 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-850/60 justify-between ${
                              isRtl ? "sm:mr-auto sm:justify-end" : "sm:ml-auto sm:justify-start"
                            }`}>
                              <span className="text-[10px] font-bold text-zinc-450 bg-zinc-100 dark:bg-zinc-850 px-2 py-1 rounded-xl">
                                {c.credits} {t("ساعة", "Hours")}
                              </span>

                              <GradeSelect
                                value={completed ? currentGrade : ""}
                                onChange={(val) => {
                                  markCompleted(c.code, val);
                                }}
                                options={GRADE_OPTIONS}
                                disabled={false}
                                className="h-8 w-[75px]"
                              />

                              {/* Planned bookmark toggle */}
                              <button
                                onClick={() => planned ? unmarkPlanned(c.code) : markPlanned(c.code)}
                                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                  planned
                                    ? "bg-sky-600 border-sky-600 text-white"
                                    : "border-zinc-250 text-zinc-400 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                                }`}
                                title={planned ? t("إلغاء المخطط", "Cancel planned") : t("إضافة للمخطط", "Bookmark as planned")}
                              >
                                <Bookmark className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar specs details */}
        <div className="space-y-6">
          <Card className="card border border-zinc-200/50 dark:border-zinc-800/40">
            <CardHeader className="pb-3 border-b border-zinc-150/10 dark:border-zinc-850">
              <CardTitle className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <GraduationCap className="h-4.5 w-4.5" />
                {t("متطلبات التخرج العامة للكلية", "General Graduation Requirements")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3.5">
                {[
                  t("إتمام 144 ساعة معتمدة بنجاح من كافة الفصول.", "Successfully complete 144 credit hours across all semesters."),
                  t("اجتياز مشروع التخرج 1 و 2 بتقدير D على الأقل.", "Pass Graduation Project 1 & 2 with grade D or higher."),
                  t("إتمام فترة التدريب الصيفي الميداني المعتمدة بنجاح.", "Complete approved summer practical field training."),
                  t("الحصول على معدل تراكمي (GPA) لا يقل عن 2.00 عند التخرج.", "Maintain a cumulative GPA of at least 2.00 upon graduation.")
                ].map((req, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start text-xs text-zinc-650 dark:text-zinc-450 leading-relaxed font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0 shadow-[0_0_4px_rgba(6,182,212,0.6)]" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="card border border-zinc-200/50 dark:border-zinc-800/40">
            <CardHeader className="pb-3 border-b border-zinc-150/10 dark:border-zinc-850">
              <CardTitle className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Award className="h-4.5 w-4.5" />
                {t("توزيع الساعات المعتمدة الكلي", "Total Credit Hours Distribution")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-xs font-bold text-zinc-650 dark:text-zinc-450">
              <div className="flex justify-between items-center">
                <span>{t("ساعات المقررات الأساسية والتخصصية:", "Core & Major Credits:")}</span>
                <span className="text-zinc-800 dark:text-zinc-100">126 {t("ساعة", "Hours")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{t("ساعات المقررات الاختيارية الإنسانية والعامة:", "Elective & General Credits:")}</span>
                <span className="text-zinc-800 dark:text-zinc-100">18 {t("ساعة", "Hours")}</span>
              </div>
              <div className="border-t border-zinc-150/10 dark:border-zinc-900 pt-3.5 flex justify-between items-center text-sm font-black text-cyan-400">
                <span>{t("المجموع الكلي المطلوب:", "Total Required Credits:")}</span>
                <span>144 {t("ساعة", "Hours")}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
