"use client";

import * as React from "react";
import { useApp } from "@/context/app-context";
import { useAcademic } from "@/context/academic-context";
import { PERIODS, Course } from "@/lib/courses-data";
import { useAdmin } from "@/context/admin-context";
import { useAuth } from "@/context/auth-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PERIODS_EN: Record<string, string> = {
  "year-1-sem-1": "Year 1 - Semester 1",
  "year-1-sem-2": "Year 1 - Semester 2",
  "year-2-sem-1": "Year 2 - Semester 1",
  "year-2-sem-2": "Year 2 - Semester 2",
  "year-3-sem-1": "Year 3 - Semester 1",
  "year-3-sem-2": "Year 3 - Semester 2",
  "year-4-sem-1": "Year 4 - Semester 1",
  "year-4-sem-2": "Year 4 - Semester 2",
};

export default function PlannerPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "super-admin";
  const { t, lang, dir } = useApp();
  const { courses } = useAdmin();
  const {
    completedCourses,
    plannedCourses,
    completedCredits,
    remainingCredits,
    graduationPercentage,
    isCompleted,
    isPlanned,
    markCompleted,
    unmarkCompleted,
    markPlanned,
    unmarkPlanned,
    removeCourse
  } = useAcademic();

  const [expandedPeriod, setExpandedPeriod] = React.useState<string>("year-1-sem-1");

  // Calculate planned credits
  const plannedCredits = React.useMemo(() => {
    return plannedCourses.reduce((sum, code) => {
      const course = courses.find((c) => c.code === code);
      return sum + (course ? course.credits : 0);
    }, 0);
  }, [plannedCourses, courses]);

  // Group courses by period
  const coursesByPeriod = React.useMemo(() => {
    const grouped: Record<string, Course[]> = {};
    Object.keys(PERIODS).forEach((p) => {
      grouped[p] = courses.filter((c) => c.period === p);
    });
    return grouped;
  }, [courses]);

  // Check if a course's prerequisites are met
  const checkPrerequisitesMet = React.useCallback((course: Course) => {
    if (course.prerequisites.length === 0) return { met: true, missing: [] };
    const missing = course.prerequisites.filter((pre) => !isCompleted(pre));
    return {
      met: missing.length === 0,
      missing
    };
  }, [completedCourses]);

  // Calculate planned load for the active expanded period
  const expandedPeriodLoad = React.useMemo(() => {
    const periodCourses = coursesByPeriod[expandedPeriod] || [];
    return periodCourses.reduce((sum, c) => {
      if (isPlanned(c.code)) return sum + c.credits;
      return sum;
    }, 0);
  }, [expandedPeriod, coursesByPeriod, plannedCourses]);

  // Recommended semester workload alert message
  const workloadFeedback = React.useMemo(() => {
    if (expandedPeriodLoad === 0) {
      return { text: t("لم تخطط لأي مساقات في هذا الفصل بعد.", "No courses planned for this semester yet."), color: "text-zinc-500" };
    }
    if (expandedPeriodLoad < 12) {
      return { text: t("العبء الدراسي خفيف جداً. نقترح تسجيل 12-18 ساعة معتمدة للترم الواحد.", "Course load is very light. We recommend 12-18 credit hours per semester."), color: "text-amber-600 dark:text-amber-400" };
    }
    if (expandedPeriodLoad > 18) {
      return { text: t("العبء الدراسي مرتفع جداً (أكثر من 18 ساعة معتمدة). يرجى التأكد من سماح لوائح الساعات المعتمدة لك بذلك.", "Course load is very heavy (over 18 credits). Please ensure your program regulations allow this."), color: "text-red-500 dark:text-red-400" };
    }
    return { text: t("عبء دراسي ممتاز ومقترح أكاديمياً (12-18 ساعة معتمدة).", "Excellent and recommended academic workload (12-18 credit hours)."), color: "text-green-600 dark:text-green-400" };
  }, [expandedPeriodLoad, t]);

  return (
    <div className="space-y-8" dir={dir}>
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
          {t("مخطط التسجيل والمواد الأكاديمية", "Academic Registration Planner")}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          {t(
            "خطط لمستقبلك الدراسي، وتتبع متطلبات التخرج وتجاوز المتطلبات السابقة للمقررات.",
            "Plan your academic future, track graduation requirements, and manage course prerequisites."
          )}
        </p>
      </div>

      {isAdmin && (
        <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between text-xs font-bold text-cyan-600 dark:text-cyan-400">
          <div className="flex items-center gap-2">
            <span>⚙️</span>
            <span>{t("معاينة بوضع مسؤول النظام (Admin View Mode): أنت تتصفح مخطط التسجيل لاختبار ومعاينة تجربة الطلاب.", "Admin View Mode: You are viewing the registration planner to preview student experience.")}</span>
          </div>
          <Badge className="bg-cyan-500 text-white text-[10px] shrink-0 font-mono">وضع المشرف</Badge>
        </div>
      )}

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                {t("التقدم نحو التخرج", "Graduation Progress")}
              </span>
              <span className="text-sm font-extrabold text-sky-600 dark:text-sky-400">{graduationPercentage}%</span>
            </div>
            <Progress value={graduationPercentage} className="h-2 bg-zinc-100 dark:bg-zinc-800" />
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block mt-2.5">
              {t("الهدف: إنجاز 144 ساعة معتمدة للتخرج بنجاح", "Goal: Complete 144 credit hours for graduation")}
            </span>
          </CardContent>
        </Card>

        <Card className="border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 rounded-xl">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-550 block">
                  {t("الساعات المنجزة", "Completed Hours")}
                </span>
                <span className="text-lg font-black text-zinc-800 dark:text-zinc-200">
                  {completedCredits} {t("ساعة معتمدة", "Credit Hours")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 rounded-xl">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-550 block">
                  {t("الساعات المخططة", "Planned Hours")}
                </span>
                <span className="text-lg font-black text-zinc-800 dark:text-zinc-200">
                  {plannedCredits} {t("ساعة معتمدة", "Credit Hours")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Semesters Roadmap timeline */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
            <Calendar className="h-4.5 w-4.5 text-zinc-450" />
            {t("الخطة الدراسية (8 فصول دراسية)", "Study Plan (8 Semesters)")}
          </h2>

          <div className="space-y-3">
            {Object.entries(PERIODS).map(([key, label]) => {
              const isOpen = expandedPeriod === key;
              const periodCourses = coursesByPeriod[key] || [];
              const completedInPeriod = periodCourses.filter((c) => isCompleted(c.code)).length;
              const plannedInPeriod = periodCourses.filter((c) => isPlanned(c.code)).length;

              return (
                <div
                  key={key}
                  className={`border rounded-2xl transition-all overflow-hidden ${
                    isOpen
                      ? "border-sky-500/30 bg-sky-500/2 dark:bg-sky-500/1"
                      : "border-zinc-200/60 bg-white dark:border-zinc-800/60 dark:bg-zinc-900 hover:border-zinc-300"
                  }`}
                >
                  {/* Period Header */}
                  <button
                    onClick={() => setExpandedPeriod(isOpen ? "" : key)}
                    className={`w-full p-4 flex justify-between items-center ${lang === "ar" ? "text-right" : "text-left"} cursor-pointer`}
                  >
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-50">
                        {lang === "ar" ? label : (PERIODS_EN[key] || label)}
                      </h4>
                      <div className="flex gap-2.5 mt-1 text-[10px] font-bold text-zinc-450 dark:text-zinc-500">
                        <span>{periodCourses.length} {t("مواد إجمالاً", "total courses")}</span>
                        <span>•</span>
                        <span className="text-green-600 dark:text-green-400">{completedInPeriod} {t("منجزة", "completed")}</span>
                        <span>•</span>
                        <span className="text-sky-600 dark:text-sky-400">{plannedInPeriod} {t("مخططة", "planned")}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {isOpen ? <ChevronUp className="h-4 w-4 text-zinc-450" /> : <ChevronDown className="h-4 w-4 text-zinc-450" />}
                    </div>
                  </button>

                  {/* Period Courses content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="border-t border-zinc-150/40 dark:border-zinc-800/40 overflow-hidden"
                      >
                        <div className="p-4 space-y-3.5">
                          {/* Workload feedback */}
                          <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-150 dark:border-zinc-800/60 rounded-xl text-xs">
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Info className="h-4 w-4 text-zinc-400 shrink-0" />
                              <span className="font-semibold text-zinc-500">
                                {t("مجموع الساعات المخططة للترم:", "Planned semester credit hours:")}
                              </span>
                              <span className="font-bold text-zinc-800 dark:text-zinc-200">
                                {expandedPeriodLoad} {t("ساعة", "hours")}
                              </span>
                            </div>
                            <span className="hidden sm:inline mx-1 text-zinc-300">|</span>
                            <span className={`text-[11px] font-bold ${workloadFeedback.color}`}>{workloadFeedback.text}</span>
                          </div>

                          {/* Courses table */}
                          <div className="space-y-3 pt-1">
                            {periodCourses.map((course) => {
                              const completed = isCompleted(course.code);
                              const planned = isPlanned(course.code);
                              const { met, missing } = checkPrerequisitesMet(course);

                              return (
                                <div
                                  key={course.code}
                                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                                    completed
                                      ? "bg-green-500/5 border-green-200 dark:bg-green-950/10 dark:border-green-900/30"
                                      : planned
                                      ? "bg-sky-500/5 border-sky-200 dark:bg-sky-950/10 dark:border-sky-900/30"
                                      : "bg-white border-zinc-150 dark:bg-zinc-950 dark:border-zinc-850"
                                  }`}
                                >
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-[9px] py-0">{course.code}</Badge>
                                      <span className="text-xs font-bold text-zinc-850 dark:text-zinc-150">
                                        {t(course.arabic, course.english)}
                                      </span>
                                    </div>
                                    <div className="flex gap-2.5 mt-1 text-[10px] text-zinc-400">
                                      <span>{course.credits} {t("ساعات معتمدة", "credit hours")}</span>
                                      {course.prerequisites.length > 0 && (
                                        <>
                                          <span>•</span>
                                          <span className="font-semibold">
                                            {t("المتطلبات السابقة:", "Prerequisites:")} {course.prerequisites.join(", ")}
                                          </span>
                                        </>
                                      )}
                                    </div>

                                    {/* Prerequisite warning alert */}
                                    {!met && planned && (
                                      <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-2 py-1 rounded-lg w-fit">
                                        <AlertTriangle className="h-3 w-3" />
                                        <span>
                                          {t(
                                            `تنبيه: يجب إتمام المقررات التالية أولاً: ${missing.join(", ")}`,
                                            `Warning: Complete these courses first: ${missing.join(", ")}`
                                          )}
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex gap-2 shrink-0 self-stretch sm:self-center w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-150/60 dark:border-zinc-850/60">
                                    <button
                                      onClick={() => completed ? unmarkCompleted(course.code) : markCompleted(course.code, "A")}
                                      className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border text-center ${
                                        completed
                                          ? "bg-green-600 border-green-600 text-white hover:bg-green-700"
                                          : "bg-transparent border-zinc-200 text-zinc-650 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                                      }`}
                                    >
                                      {completed ? t("منجزة ✓", "Done ✓") : t("تحديد كمنجزة", "Mark Done")}
                                    </button>
                                    <button
                                      onClick={() => planned ? unmarkPlanned(course.code) : markPlanned(course.code)}
                                      className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border text-center ${
                                        planned
                                          ? "bg-sky-600 border-sky-600 text-white hover:bg-sky-700"
                                          : "bg-transparent border-zinc-200 text-zinc-650 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                                      }`}
                                    >
                                      {planned ? t("مخططة ✓", "Planned ✓") : t("إضافة للجدول", "Add to Plan")}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestone info cards */}
        <div className="space-y-6">
          <Card className="border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-sky-600" />
                {t("المحطات الرئيسية للبرنامج الدراسي", "Key Program Milestones")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Milestone 1 */}
              <div className="flex gap-3 items-start pb-4 border-b border-zinc-100 dark:border-zinc-850">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  completedCredits >= 36 ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400" : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"
                }`}>
                  1
                </div>
                <div>
                  <h4 className="font-bold text-xs text-zinc-850 dark:text-zinc-100">
                    {t("سنة أولى وثانية (المستوى التأسيسي)", "Year 1 & 2 (Foundation Level)")}
                  </h4>
                  <p className="text-[10px] text-zinc-450 dark:text-zinc-550 mt-0.5">
                    {t(
                      `مكتمل عند إنجاز 36 ساعة معتمدة. حالة الطالب: ${completedCredits >= 36 ? "مكتمل ✓" : "قيد التنفيذ"}`,
                      `Complete at 36 credit hours. Status: ${completedCredits >= 36 ? "Complete ✓" : "In Progress"}`
                    )}
                  </p>
                </div>
              </div>

              {/* Milestone 2 */}
              <div className="flex gap-3 items-start pb-4 border-b border-zinc-100 dark:border-zinc-850">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  completedCredits >= 95 ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400" : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"
                }`}>
                  2
                </div>
                <div>
                  <h4 className="font-bold text-xs text-zinc-850 dark:text-zinc-100">
                    {t("البدء في مشروع تخرج IT (1)", "Start IT Graduation Project (1)")}
                  </h4>
                  <p className="text-[10px] text-zinc-450 dark:text-zinc-550 mt-0.5">
                    {t(
                      `يتطلب إنجاز 95 ساعة معتمدة للبدء بالتسجيل. حالة الطالب: ${completedCredits >= 95 ? "مؤهل ✓" : `متبقي له ${Math.max(0, 95 - completedCredits)} ساعة`}`,
                      `Requires 95 credit hours to register. Status: ${completedCredits >= 95 ? "Eligible ✓" : `${Math.max(0, 95 - completedCredits)} hours remaining`}`
                    )}
                  </p>
                </div>
              </div>

              {/* Milestone 3 */}
              <div className="flex gap-3 items-start">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  completedCredits >= 144 ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400" : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800"
                }`}>
                  3
                </div>
                <div>
                  <h4 className="font-bold text-xs text-zinc-850 dark:text-zinc-100">
                    {t("أهلية التخرج النهائية", "Final Graduation Eligibility")}
                  </h4>
                  <p className="text-[10px] text-zinc-450 dark:text-zinc-550 mt-0.5">
                    {t(
                      `تتطلب إنجاز 144 ساعة معتمدة ومعدل تراكمي 2.0 على الأقل. حالة الطالب: ${completedCredits >= 144 ? "مؤهل للتخرج 🎉" : `متبقي له ${remainingCredits} ساعة`}`,
                      `Requires 144 credit hours and a minimum 2.0 GPA. Status: ${completedCredits >= 144 ? "Eligible for Graduation 🎉" : `${remainingCredits} hours remaining`}`
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
