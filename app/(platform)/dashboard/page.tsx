"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useApp } from "@/context/app-context";
import { useAcademic } from "@/context/academic-context";
import { useLearning } from "@/context/learning-context";
import { useAdmin } from "@/context/admin-context";
import { useSocial } from "@/context/social-context";
import { ROADMAPS } from "@/lib/roadmaps-data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { CountUp } from "@/components/ui/count-up";
import { ShinyText } from "@/components/ui/shiny-text";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DashboardSkeleton } from "@/components/ui/skeleton";
import {
  GraduationCap,
  Shield,
  Activity,
  Sparkles,
  Calendar,
  BookOpen,
  Calculator,
  Compass,
  History,
  FolderHeart,
  ExternalLink,
  User,
  Settings,
  AlertTriangle,
  Bookmark,
  ChevronLeft
} from "lucide-react";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const { courses, users: adminUsers } = useAdmin();
  const { t, dir, lang, userRole, userName } = useApp();
  const { reminders } = useSocial();

  const {
    cumulativeGpa,
    completedCredits,
    completedCourses,
    plannedCourses
  } = useAcademic();

  const {
    bookmarks,
    recentlyViewed,
    getRoadmapProgressPercentage
  } = useLearning();

  const isRtl = dir === "rtl";

  const gpaDescription = React.useMemo(() => {
    if (cumulativeGpa === 0) return t("طالب جديد", "New Student");
    if (cumulativeGpa >= 3.6) return t("امتياز مرتفع 🚀", "Excellent 🚀");
    if (cumulativeGpa >= 3.0) return t("جيد جداً 👍", "Very Good 👍");
    if (cumulativeGpa >= 2.5) return t("جيد ⭐️", "Good ⭐️");
    if (cumulativeGpa >= 2.0) return t("مقبول", "Pass");
    return t("ضعيف", "Poor");
  }, [cumulativeGpa, t]);

  const isAdmin = userRole === "admin" || userRole === "super-admin" || userRole === "moderator";

  const stats = isAdmin
    ? [
        {
          label: t("إجمالي الأعضاء والطلاب المسجلين", "Total Platform Users"),
          value: `${adminUsers.length || 4}`,
          description: t("حساب أكاديمي نشط", "Active Accounts"),
          icon: Shield,
          color: "text-cyan-500"
        },
        {
          label: t("إجمالي خطة المقررات الكلية", "Faculty Curriculum Courses"),
          value: `${courses.length}`,
          description: t("مقرر دراسي بالكلية", "Faculty Courses"),
          icon: BookOpen,
          color: "text-sky-500"
        },
        {
          label: t("حالة السيرفر والخدمات الحية", "System Operational Health"),
          value: "100%",
          description: t("🟢 جميع الخدمات متصلة", "🟢 All Systems Online"),
          icon: Activity,
          color: "text-emerald-500"
        }
      ]
    : [
        {
          label: t("المعدل التراكمي (GPA)", "Cumulative GPA"),
          value: cumulativeGpa > 0 ? cumulativeGpa.toFixed(2) : "0.00",
          description: gpaDescription,
          icon: Calculator,
          color: "text-cyan-500"
        },
        {
          label: t("الساعات المنجزة", "Completed Credits"),
          value: `${completedCredits} / 144`,
          description: t("ساعة معتمدة", "Credits"),
          icon: GraduationCap,
          color: "text-sky-500"
        },
        {
          label: t("المواد المتبقية للتخرج", "Remaining Courses"),
          value: `${courses.length - completedCourses.length}`,
          description: t("مقرر دراسي", "Courses"),
          icon: BookOpen,
          color: "text-teal-500"
        }
      ];

  // Dynamic deadlines pulled from the Calendar reminders context
  const deadlines = React.useMemo(() => {
    return reminders.map(r => ({
      title: r.title,
      date: r.date,
      type: r.type,
      link: r.type === "assignment" ? "https://kmoodle.su.edu.eg/" : "#"
    }));
  }, [reminders]);

  // AI Suggestions engine based on student academic data
  const aiSuggestions = React.useMemo(() => {
    const suggestions: string[] = [];
    if (cumulativeGpa === 0) {
      suggestions.push(
        t(
          "مرحباً بك! ابدأ بإضافة مواد الترم الأول في حاسبة الـ GPA لتوقع درجاتك.",
          "Welcome! Start by adding your first-semester courses in the GPA calculator to predict your grades."
        )
      );
    } else if (cumulativeGpa < 3.0) {
      suggestions.push(
        t(
          "معدلك الحالي أقل من 3.0. ننصحك بالتركيز على المواد الاختيارية السهلة في الفصول القادمة لرفع المعدل.",
          "Your current GPA is below 3.0. We recommend focusing on easier elective courses in coming semesters to boost it."
        )
      );
    } else {
      suggestions.push(
        t(
          "أداء رائع! استمر على هذا المستوى للمحافظة على ترتيب متقدم على الدفعة.",
          "Great performance! Keep it up to maintain a high rank among your colleagues."
        )
      );
    }

    // Roadmap recommendations
    const completedITCodes = completedCourses.map(c => c.code);
    if (completedITCodes.includes("CSW 232")) {
      suggestions.push(
        t(
          "لقد أنهيت متطلب 'برمجة 1'. ننصحك بالبدء في مسار 'Frontend Development' والتعرف على أساسيات الويب.",
          "You have finished 'Programming 1'. We recommend starting the Frontend Web development roadmap."
        )
      );
    }
    if (completedITCodes.includes("ISD 242")) {
      suggestions.push(
        t(
          "قمت باجتياز 'قواعد البيانات'. يمكنك تصفح مسار 'Backend Development' لتطوير خوادم الويب.",
          "You have passed 'Database Systems'. You can now check out the Backend Web development roadmap."
        )
      );
    }

    return suggestions;
  }, [cumulativeGpa, completedCourses, t]);

  // Check if any planned course lacks completed prerequisites
  const prerequisiteAlerts = React.useMemo(() => {
    const alerts: string[] = [];
    plannedCourses.forEach((code) => {
      const course = courses.find((c) => c.code === code);
      if (course && course.prerequisites.length > 0) {
        const missing = course.prerequisites.filter(
          (pre) => !completedCourses.some((c) => c.code === pre)
        );
        if (missing.length > 0) {
          alerts.push(
            t(
              `المقرر المخطط [${course.code} - ${course.arabic}] يتطلب إتمام متطلب: ${missing.join(", ")}`,
              `Planned course [${course.code} - ${course.english}] requires completing prerequisites: ${missing.join(", ")}`
            )
          );
        }
      }
    });
    return alerts;
  }, [plannedCourses, completedCourses, courses, t]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8" dir={dir}>
      {/* Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-600 to-teal-600 p-5 sm:p-8 md:p-10 text-white shadow-xl">
        <div className="absolute -top-10 -left-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <Badge variant="secondary" className="bg-white/20 text-white dark:bg-white/20 dark:text-white border-transparent mb-3 backdrop-blur-md">
              {t("نسخة 2.0 ✨", " Version 2.0 ✨")}
            </Badge>
            <h1 className="text-2xl sm:text-4xl md:text-4xl lg:text-5xl font-black tracking-tight mb-2.5">
              {lang === "ar"
                ? `أهلاً بك، ${userName.split(" ")[0]} 👋`
                : `Welcome, ${userName.split(" ")[0]} 👋`}
            </h1>
            <p className="text-xs sm:text-sm text-cyan-100 max-w-xl leading-relaxed">
              {isAdmin
                ? t(
                    "تصفح لوحة التحكم والرقابة الإدارية الشاملة لتفقد حالة النظام ومتابعة حركة الطلاب والتحديثات الحية.",
                    "Inspect the admin control panel to manage platform users, faculty courses, and operational health."
                  )
                : t(
                    "هذه هي لوحة تحكم الطالب الذكية. هنا يمكنك تتبع تقدمك الدراسي، تخطيط فصولك القادمة، والتفاعل مع التحديثات المباشرة.",
                    "This is your smart student dashboard. Here you can track your academic progress, plan future semesters, and interact with dynamic updates."
                  )}
            </p>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap gap-2.5 shrink-0 w-full sm:w-auto">
            <Link href="/profile" className="flex-1 sm:flex-initial">
              <Button size="sm" variant="secondary" className="w-full sm:w-auto bg-white text-cyan-950 hover:bg-cyan-50 dark:bg-white dark:text-cyan-950 dark:hover:bg-cyan-100 font-extrabold border-transparent shadow-md text-xs cursor-pointer">
                {t("تعديل الملف الشخصي", "Edit Profile")}
              </Button>
            </Link>
            <Link href="/settings" className="flex-1 sm:flex-initial">
              <Button size="sm" variant="outline" className="w-full sm:w-auto border-white/40 text-white hover:bg-white/10 dark:border-white/40 dark:text-white dark:hover:bg-white/10 font-bold text-xs cursor-pointer">
                {t("الإعدادات", "Settings")}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Prerequisite Alert Banner */}
      {prerequisiteAlerts.length > 0 && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 rounded-2xl flex items-start gap-3 text-xs leading-relaxed font-semibold">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold">{t("تحذير المتطلبات الأكاديمية السابقة:", "Academic Prerequisites Warning:")}</h4>
            <ul className="list-disc pr-4 space-y-1">
              {prerequisiteAlerts.map((alert, idx) => (
                <li key={idx}>{alert}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Academic Highlights & Stats with ReactBits SpotlightCard & CountUp */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const spotlightColors = [
            "rgba(6, 182, 212, 0.35)",  // Cyan for GPA
            "rgba(2, 132, 199, 0.35)",  // Sinai Tech Blue for Credits
            "rgba(20, 184, 166, 0.35)"  // Teal for Remaining Courses
          ];
          return (
            <SpotlightCard
              key={idx}
              className="border border-zinc-200/70 dark:border-zinc-800/80 shadow-sm hover:border-sky-500/50 dark:hover:border-sky-400/50 hover:shadow-lg hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 cursor-default"
              spotlightColor={spotlightColors[idx % spotlightColors.length]}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl">
                    <Icon className={`h-5.5 w-5.5 ${stat.color}`} />
                  </div>
                  <Badge variant="outline" className="text-[10px] font-bold py-0.5 px-2 rounded-lg border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white bg-zinc-100/80 dark:bg-zinc-800/40">
                    {t("محدث", "Updated")}
                  </Badge>
                </div>
                <h3 className="text-xs font-bold text-zinc-900 dark:text-white">{stat.label}</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
                    {idx === 0 ? (
                      cumulativeGpa > 0 ? (
                        <CountUp to={cumulativeGpa} decimals={2} duration={1.5} />
                      ) : (
                        "0.00"
                      )
                    ) : idx === 1 ? (
                      <>
                        <CountUp to={completedCredits} duration={1.5} />
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold"> / 144</span>
                      </>
                    ) : (
                      <CountUp to={courses.length - completedCourses.length} duration={1.5} />
                    )}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-200">{stat.description}</span>
                </div>
              </div>
            </SpotlightCard>
          );
        })}
      </div>

      {/* Two Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

        {/* Main/Right Side Columns */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">

          {/* Quick Actions */}
          <Card className="card border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                {t("إجراءات سريعة", "Quick Actions")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {isAdmin ? (
                  <>
                    <Link href="/admin/users" className="block">
                      <SpotlightCard className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 text-center hover:border-cyan-500 dark:hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group" spotlightColor="rgba(6, 182, 212, 0.35)">
                        <Shield className="h-6 w-6 text-cyan-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-zinc-700 dark:text-white">{t("إدارة الاعضاء", "Manage Users")}</span>
                      </SpotlightCard>
                    </Link>
                    <Link href="/admin/courses" className="block">
                      <SpotlightCard className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 text-center hover:border-sky-500 dark:hover:border-sky-400 hover:shadow-lg hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group" spotlightColor="rgba(2, 132, 199, 0.35)">
                        <BookOpen className="h-6 w-6 text-sky-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-zinc-700 dark:text-white">{t("إدارة المقررات", "Manage Courses")}</span>
                      </SpotlightCard>
                    </Link>
                    <Link href="/admin/audit" className="block">
                      <SpotlightCard className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 text-center hover:border-teal-500 dark:hover:border-teal-400 hover:shadow-lg hover:shadow-teal-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group" spotlightColor="rgba(20, 184, 166, 0.35)">
                        <History className="h-6 w-6 text-teal-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-zinc-700 dark:text-white">{t("سجلات الأمان", "Audit Trail")}</span>
                      </SpotlightCard>
                    </Link>
                    <Link href="/profile" className="block">
                      <SpotlightCard className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 text-center hover:border-amber-500 dark:hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group" spotlightColor="rgba(245, 158, 11, 0.35)">
                        <User className="h-6 w-6 text-amber-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-zinc-700 dark:text-white">{t("الملف الإداري", "Admin Profile")}</span>
                      </SpotlightCard>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/profile" className="block">
                      <SpotlightCard className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 text-center hover:border-cyan-500 dark:hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group" spotlightColor="rgba(6, 182, 212, 0.35)">
                        <User className="h-6 w-6 text-cyan-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-zinc-700 dark:text-white">{t("الملف الشخصي", "Profile")}</span>
                      </SpotlightCard>
                    </Link>
                    <Link href="/settings" className="block">
                      <SpotlightCard className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 text-center hover:border-sky-500 dark:hover:border-sky-400 hover:shadow-lg hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group" spotlightColor="rgba(2, 132, 199, 0.35)">
                        <Settings className="h-6 w-6 text-sky-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-zinc-700 dark:text-white">{t("الإعدادات", "Settings")}</span>
                      </SpotlightCard>
                    </Link>
                    <Link href="/gpa" className="block">
                      <SpotlightCard className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 text-center hover:border-teal-500 dark:hover:border-teal-400 hover:shadow-lg hover:shadow-teal-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group" spotlightColor="rgba(20, 184, 166, 0.35)">
                        <Calculator className="h-6 w-6 text-teal-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-zinc-700 dark:text-white">{t("حاسبة المعدل", "GPA Calc")}</span>
                      </SpotlightCard>
                    </Link>
                    <a href="https://kmoodle.su.edu.eg/" target="_blank" rel="noopener noreferrer" className="block">
                      <SpotlightCard className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 text-center hover:border-amber-500 dark:hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group" spotlightColor="rgba(245, 158, 11, 0.35)">
                        <ExternalLink className="h-6 w-6 text-amber-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-zinc-700 dark:text-white">{t("مودل سيناء", "SU Moodle")}</span>
                      </SpotlightCard>
                    </a>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions widget */}
          <Card className="card border border-cyan-500/20 bg-gradient-to-br from-cyan-500/[0.03] to-teal-500/[0.03] shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-cyan-500 fill-cyan-500/10" />
                <CardTitle className="text-xs font-black uppercase tracking-wider text-cyan-400">
                  {t("توصيات ومقترحات الذكاء الاصطناعي الأكاديمية", "Academic AI Advisor Suggestions")}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3.5 pt-2">
              {aiSuggestions.map((suggestion, idx) => (
                <div key={idx} className="flex gap-2.5 items-start text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0 shadow-[0_0_4px_rgba(6,182,212,0.6)]" />
                  <span>{suggestion}</span>
                </div>
              ))}
              <div className="pt-2">
                <Link href="/ai-assistant">
                  <Button size="sm" className="btn-primary text-[10px] font-bold h-8.5 px-4 shadow-md">
                    {t("محادثة المساعد الأكاديمي", "Consult Academic AI Advisor")}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Active Roadmaps progress tracking */}
          <Card className="card border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-black uppercase tracking-wider text-zinc-900 dark:text-white flex items-center gap-2">
                <Compass className="h-5 w-5 text-sky-500" />
                {t("متابعة تقدم خارطة الطريق المهنية", "Career Roadmap Progress Tracking")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ROADMAPS.map((map) => {
                const percent = getRoadmapProgressPercentage(map.id, map.nodes.length);
                return (
                  <div key={map.id} className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-zinc-900 dark:text-white font-bold">{map.title}</span>
                      <span className="text-cyan-500">{percent}%</span>
                    </div>
                    <Progress value={percent} className="h-1.5 bg-zinc-100 dark:bg-zinc-800" />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Recently Viewed list */}
          <Card className="card border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <History className="h-4.5 w-4.5 text-zinc-900 dark:text-white" />
                <CardTitle className="text-sm font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                  {t("المشاهدة والمراجعة الأخيرة", "Recently Reviewed")}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentlyViewed.length > 0 ? (
                recentlyViewed.map((item) => (
                  <Link href={item.path} key={item.id} className="block p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100/50 dark:bg-zinc-900/40 border border-zinc-150/10 dark:border-zinc-850/30 transition-colors">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <div className="flex items-center gap-2.5">
                        <Badge variant="outline" className="text-[8px] py-0 px-1 border-zinc-200/10 text-zinc-900 dark:text-white">{item.type.toUpperCase()}</Badge>
                        <span className="text-zinc-900 dark:text-white font-bold">{item.title}</span>
                      </div>
                      <span className="text-zinc-400 dark:text-zinc-200">→</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-zinc-600 dark:text-zinc-200 font-medium">
                  {t("لا توجد مقررات أو ملفات تمت مراجعتها مؤخراً.", "No recently reviewed courses or resources.")}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Left Side Columns */}
        <div className="space-y-8">
          {/* Upcoming Deadlines */}
          <Card className="card border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm" id="deadlines">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4.5 w-4.5 text-zinc-900 dark:text-white" />
                <CardTitle className="text-sm font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                  {t("مواعيد تسليم قادمة", "Upcoming Deadlines")}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3.5">
              {deadlines.length > 0 ? (
                deadlines.map((dl, idx) => (
                  <a
                    key={idx}
                    href={dl.link}
                    target={dl.link.startsWith("http") ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="block p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100/50 dark:bg-zinc-900/40 border border-zinc-150/10 dark:border-zinc-850/30 transition-colors"
                  >
                    <div className="flex justify-between items-start gap-2 mb-1.5 text-xs font-semibold">
                      <span className="text-zinc-900 dark:text-white font-bold line-clamp-1">{dl.title}</span>
                      {dl.type === "assignment" ? (
                        <Badge className="bg-amber-500/10 text-amber-500 border-transparent text-[8px] font-bold px-1.5 py-0 shrink-0">
                          {t("واجب", "Task")}
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/10 text-red-500 border-transparent text-[8px] font-bold px-1.5 py-0 shrink-0">
                          {t("اختبار", "Exam")}
                        </Badge>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-300">{dl.date}</span>
                  </a>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-zinc-600 dark:text-zinc-200 font-medium">
                  {t("لا توجد مواعيد تسليم قادمة.", "No upcoming deadlines.")}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Continue Learning widget */}
          <Card className="card border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4.5 w-4.5 text-zinc-900 dark:text-white" />
                <CardTitle className="text-sm font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                  {t("متابعة الدراسة", "Continue Learning")}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-xl border border-dashed border-zinc-350 dark:border-zinc-800 text-center">
                <p className="text-xs text-zinc-700 dark:text-zinc-200 leading-relaxed mb-3.5">
                  {t(
                    "تصفح مستكشف المواد الأكاديمية لإكمال أو إضافة مقررات دراسية لخطتك.",
                    "Explore the courses directory to plan or complete academic subjects."
                  )}
                </p>
                <Link href="/courses">
                  <Button size="sm" variant="outline" className="text-xs h-8">
                    {t("مستكشف المواد الدراسي", "Course Explorer")}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Saved Items Box */}
          <Card className="card border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FolderHeart className="h-4.5 w-4.5 text-zinc-900 dark:text-white" />
                <CardTitle className="text-sm font-black uppercase tracking-wider text-zinc-900 dark:text-white">
                  {t("المحفوظات الشخصية", "Personal Bookmarks")}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {bookmarks.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-zinc-900 dark:text-white">
                    {t(
                      `لديك ${bookmarks.length} عناصر محفوظة في المنصة.`,
                      `You have ${bookmarks.length} bookmarked items in portal.`
                    )}
                  </div>
                  <Link href="/saved-items">
                    <Button size="sm" variant="outline" className="w-full text-xs h-8">
                      {t("عرض جميع المحفوظات", "View All Bookmarks")}
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <span className="text-xs text-zinc-600 dark:text-zinc-200 font-medium">
                    {t("لا يوجد مصادر محفوظة حالياً.", "No current bookmarked items.")}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
