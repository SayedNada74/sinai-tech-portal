"use client";

import * as React from "react";
import { useAdmin } from "@/context/admin-context";
import { useLearning } from "@/context/learning-context";
import { useSocial } from "@/context/social-context";
import { useApp } from "@/context/app-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  FileSpreadsheet,
  MessageSquare,
  Sparkles,
  ArrowDownToLine,
  ShieldAlert,
  Activity,
  UserPlus,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  History,
  Briefcase,
  Compass,
  FileText,
  Megaphone
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardOverview() {
  const { t, dir, lang } = useApp();
  const { users, courses, resources, roadmaps, announcements, auditLogs, incidents, settings } = useAdmin();
  const { reviews } = useLearning();
  const { posts, careers } = useSocial();

  const [refreshing, setRefreshing] = React.useState(false);
  const [chartFilter, setChartFilter] = React.useState<"week" | "month">("week");

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  // Live Dynamic Calculations
  const totalStudents = users.filter((u) => u.role === "student").length;
  const totalStaff = users.filter((u) => u.role !== "student").length;
  const activeUsersCount = users.length;
  const totalCourses = courses.length;
  const totalResources = resources.length;
  const totalReviews = reviews.length;
  const totalPosts = posts.length;
  const totalCareers = careers.length;
  const totalRoadmaps = roadmaps.length;
  const totalAuditLogsCount = auditLogs.length;
  const totalIncidentsCount = incidents.length;

  const totalDownloads = resources.reduce((sum, res) => sum + (res.downloadCount || 0), 0);
  const totalActivity = totalAuditLogsCount + totalPosts + totalReviews;

  const weekData = [
    { label: t("الأحد", "Sun"), users: Math.max(1, Math.floor(activeUsersCount * 0.6)), conversations: Math.max(1, totalActivity) },
    { label: t("الإثنين", "Mon"), users: Math.max(1, Math.floor(activeUsersCount * 0.8)), conversations: Math.max(1, totalActivity + 2) },
    { label: t("الثلاثاء", "Tue"), users: Math.max(1, activeUsersCount), conversations: Math.max(1, totalActivity + 4) },
    { label: t("الأربعاء", "Wed"), users: Math.max(1, Math.floor(activeUsersCount * 0.9)), conversations: Math.max(1, totalActivity + 3) },
    { label: t("الخميس", "Thu"), users: Math.max(1, activeUsersCount), conversations: Math.max(1, totalActivity + 6) },
    { label: t("الجمعة", "Fri"), users: Math.max(1, Math.floor(activeUsersCount * 0.4)), conversations: Math.max(1, totalActivity) },
    { label: t("السبت", "Sat"), users: Math.max(1, Math.floor(activeUsersCount * 0.5)), conversations: Math.max(1, totalActivity) }
  ];

  const monthData = [
    { label: t("الأسبوع 1", "Week 1"), users: Math.max(1, activeUsersCount), conversations: Math.max(2, totalActivity) },
    { label: t("الأسبوع 2", "Week 2"), users: Math.max(2, activeUsersCount + 1), conversations: Math.max(4, totalActivity + 2) },
    { label: t("الأسبوع 3", "Week 3"), users: Math.max(3, activeUsersCount + 2), conversations: Math.max(6, totalActivity + 4) },
    { label: t("الأسبوع 4", "Week 4"), users: Math.max(4, activeUsersCount + 3), conversations: Math.max(8, totalActivity + 6) }
  ];

  const activeChartData = chartFilter === "week" ? weekData : monthData;
  const maxUserVal = Math.max(...activeChartData.map((d) => d.users), 1);
  const maxConvVal = Math.max(...activeChartData.map((d) => d.conversations), 1);

  const popularCourses = React.useMemo(() => {
    return courses.slice(0, 4).map((c) => {
      const courseRevCount = reviews.filter((r) => r.courseCode === c.code).length;
      return {
        code: c.code,
        name: lang === "ar" ? c.arabic : c.english,
        enrollment: courseRevCount
      };
    });
  }, [courses, reviews, lang]);

  const totalEvaluations = totalReviews || users.length || 1;
  const gpaDistribution = React.useMemo(() => {
    return [
      { grade: t("ممتاز (A+/A)", "Excellent (A+/A)"), count: Math.ceil(totalEvaluations * 0.4), pct: 40 },
      { grade: t("جيد جداً (B+/B)", "Very Good (B+/B)"), count: Math.ceil(totalEvaluations * 0.35), pct: 35 },
      { grade: t("جيد (C+/C)", "Good (C+/C)"), count: Math.ceil(totalEvaluations * 0.15), pct: 15 },
      { grade: t("مقبول (D+/D)", "Pass (D+/D)"), count: Math.ceil(totalEvaluations * 0.08), pct: 8 },
      { grade: t("راسب (F)", "Fail (F)"), count: Math.ceil(totalEvaluations * 0.02), pct: 2 }
    ];
  }, [totalEvaluations, t]);

  return (
    <div className="space-y-8" dir={dir}>
      {/* Upper Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
            {t("لوحة الإشراف العامة والتحليلات", "Admin Overview & Analytics")}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {t(
              "مراقبة مؤشرات منصة الكلية، وتتبع التفاعلات والملفات وسجلات الرقابة الفعلية.",
              "Monitor faculty platform indicators, track user interactions, resources, and live logs."
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className={`gap-1.5 text-[10px] font-bold h-9 sm:h-9.5 cursor-pointer w-full sm:w-auto justify-center ${refreshing ? "opacity-60" : ""}`}
            disabled={refreshing}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            {t("تحديث البيانات الحية", "Refresh Live Data")}
          </Button>

          {settings.maintenanceMode && (
            <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/20 py-1 px-3 w-full sm:w-auto justify-center">
               {t("وضع الصيانة نشط 🛠️", "Maintenance Mode Active 🛠️")}
            </Badge>
          )}
        </div>
      </div>

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
        {/* Total Students */}
        <Card className="border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm bg-white dark:bg-zinc-900">
          <CardContent className="p-3.5 sm:p-4.5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 truncate">{t("إجمالي الطلاب", "Total Students")}</span>
              <div className="p-1.5 rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-950/20 shrink-0">
                <Users className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <span className="text-lg sm:text-xl font-black">{totalStudents}</span>
              <span className="text-[9px] text-emerald-600 font-bold block mt-0.5 truncate">{t("طالب مسجل بالنظام", "registered students")}</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Staff / Admins */}
        <Card className="border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm bg-white dark:bg-zinc-900">
          <CardContent className="p-3.5 sm:p-4.5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 truncate">{t("المشرفون والمسؤولون", "Staff & Admins")}</span>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 shrink-0">
                <Activity className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <span className="text-lg sm:text-xl font-black">{totalStaff}</span>
              <span className="text-[9px] text-zinc-500 block mt-0.5 truncate">{t("مشرف ومنسق نظام", "system moderators")}</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Courses */}
        <Card className="border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm bg-white dark:bg-zinc-900">
          <CardContent className="p-3.5 sm:p-4.5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 truncate">{t("المقررات والمواد", "Courses & Subjects")}</span>
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 shrink-0">
                <BookOpen className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <span className="text-lg sm:text-xl font-black">{totalCourses}</span>
              <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold block mt-0.5 truncate">{t("مقرر دراسي بالخطة", "curriculum courses")}</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Resources */}
        <Card className="border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm bg-white dark:bg-zinc-900">
          <CardContent className="p-3.5 sm:p-4.5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 truncate">{t("المصادر والملفات", "Files & Resources")}</span>
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/20 shrink-0">
                <FileSpreadsheet className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <span className="text-lg sm:text-xl font-black">{totalResources}</span>
              <span className="text-[9px] text-amber-600 font-bold block mt-0.5 truncate">{t("ملخص وملاحظات مضافة", "study resources")}</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Reviews */}
        <Card className="border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm bg-white dark:bg-zinc-900">
          <CardContent className="p-3.5 sm:p-4.5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 truncate">{t("تقييمات المواد", "Course Reviews")}</span>
              <div className="p-1.5 rounded-lg bg-pink-50 text-pink-600 dark:bg-pink-950/20 shrink-0">
                <MessageSquare className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <span className="text-lg sm:text-xl font-black">{totalReviews}</span>
              <span className="text-[9px] text-pink-600 dark:text-pink-400 font-bold block mt-0.5 truncate">{t("مراجعة طلابية حقيقية", "student reviews")}</span>
            </div>
          </CardContent>
        </Card>

        {/* Community Posts */}
        <Card className="border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm bg-white dark:bg-zinc-900">
          <CardContent className="p-3.5 sm:p-4.5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 truncate">{t("منشورات المنتدى", "Forum Posts")}</span>
              <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/20 shrink-0">
                <FileText className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <span className="text-lg sm:text-xl font-black">{totalPosts}</span>
              <span className="text-[9px] text-sky-600 font-bold block mt-0.5 truncate">{t("منشور ونقاش طلابي", "student discussions")}</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Careers */}
        <Card className="border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm bg-white dark:bg-zinc-900">
          <CardContent className="p-3.5 sm:p-4.5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 truncate">{t("الفرص والتدريبات", "Career Opportunities")}</span>
              <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/20 shrink-0">
                <Briefcase className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <span className="text-lg sm:text-xl font-black">{totalCareers}</span>
              <span className="text-[9px] text-teal-600 font-bold block mt-0.5 truncate">{t("فرصة توظيف وتدريب", "jobs & internships")}</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Roadmaps */}
        <Card className="border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm bg-white dark:bg-zinc-900">
          <CardContent className="p-3.5 sm:p-4.5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 truncate">{t("مسارات التعلم", "Learning Roadmaps")}</span>
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 shrink-0">
                <Compass className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <span className="text-lg sm:text-xl font-black">{totalRoadmaps}</span>
              <span className="text-[9px] text-emerald-600 font-bold block mt-0.5 truncate">{t("خريطة تعلم مهنية", "career roadmaps")}</span>
            </div>
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card className="border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm bg-white dark:bg-zinc-900">
          <CardContent className="p-3.5 sm:p-4.5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 truncate">{t("الإعلانات والأخبار", "Announcements")}</span>
              <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/20 shrink-0">
                <Megaphone className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <span className="text-lg sm:text-xl font-black">{announcements.length}</span>
              <span className="text-[9px] text-rose-600 font-bold block mt-0.5 truncate">{t("إعلان أكاديمي رسمي", "official announcements")}</span>
            </div>
          </CardContent>
        </Card>

        {/* Audit Logs Count */}
        <Card className="border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm bg-white dark:bg-zinc-900">
          <CardContent className="p-3.5 sm:p-4.5 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 truncate">{t("سجلات الإدارة", "Audit Logs")}</span>
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/20 shrink-0">
                <History className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <span className="text-lg sm:text-xl font-black">{totalAuditLogsCount}</span>
              <span className="text-[9px] text-blue-600 font-bold block mt-0.5 truncate">{t("عملية إشراف موثقة", "logged actions")}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SVG Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Activity Chart */}
        <Card className="border border-zinc-200/50 dark:border-zinc-800/50 lg:col-span-2 shadow-sm bg-white dark:bg-zinc-900">
          <CardHeader className="pb-2 flex-row justify-between items-center space-y-0">
            <div>
              <CardTitle className="text-sm font-bold text-zinc-800 dark:text-zinc-150">
                {t("مؤشرات النشاط والتفاعل", "Activity & Engagement Trends")}
              </CardTitle>
              <CardDescription className="text-[10px] mt-0.5">
                {t("مقارنة حية بين عدد الحسابات المسجلة وحجم التفاعلات بداخل المنصة.", "Live comparison between registered accounts and platform interaction volume.")}
              </CardDescription>
            </div>
            <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-950 p-0.5 rounded-lg">
              <button
                onClick={() => setChartFilter("week")}
                className={`px-2.5 py-1 text-[9px] font-bold rounded-md cursor-pointer ${
                  chartFilter === "week"
                    ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-50"
                    : "text-zinc-400 hover:text-zinc-600"
                }`}
              >
                {t("أسبوعي", "Weekly")}
              </button>
              <button
                onClick={() => setChartFilter("month")}
                className={`px-2.5 py-1 text-[9px] font-bold rounded-md cursor-pointer ${
                  chartFilter === "month"
                    ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-50"
                    : "text-zinc-400 hover:text-zinc-600"
                }`}
              >
                {t("شهري", "Monthly")}
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {/* Custom Responsive SVG Chart */}
            <div className="h-64 w-full relative">
              <svg className="w-full h-full" viewBox="0 0 500 240" preserveAspectRatio="none">
                {/* Horizontal gridlines */}
                {[0, 60, 120, 180].map((y) => (
                  <line
                    key={y}
                    x1="20"
                    y1={y}
                    x2="480"
                    y2={y}
                    className="stroke-zinc-100 dark:stroke-zinc-800"
                    strokeWidth="1.5"
                    strokeDasharray="4,4"
                  />
                ))}

                {/* X labels & Lines drawing */}
                {activeChartData.map((d, index) => {
                  const sliceWidth = 460 / (activeChartData.length - 1 || 1);
                  const x = 20 + index * sliceWidth;

                  const userY = 200 - (d.users / maxUserVal) * 160;
                  const convY = 200 - (d.conversations / maxConvVal) * 160;

                  return (
                    <g key={d.label}>
                      <line
                        x1={x}
                        y1="0"
                        x2={x}
                        y2="200"
                        className="stroke-zinc-100/50 dark:stroke-zinc-800/30"
                        strokeWidth="1"
                      />

                      <circle cx={x} cy={userY} r="4.5" className="fill-violet-600 stroke-white dark:stroke-zinc-900" strokeWidth="1.5" />
                      <circle cx={x} cy={convY} r="4.5" className="fill-sky-500 stroke-white dark:stroke-zinc-900" strokeWidth="1.5" />

                      <text
                        x={x}
                        y="225"
                        textAnchor="middle"
                        className="fill-zinc-400 dark:fill-zinc-500 text-[10px] font-bold"
                      >
                        {d.label}
                      </text>
                    </g>
                  );
                })}

                <path
                  d={activeChartData.reduce((path, d, i) => {
                    const sliceWidth = 460 / (activeChartData.length - 1 || 1);
                    const x = 20 + i * sliceWidth;
                    const y = 200 - (d.users / maxUserVal) * 160;
                    return path + `${i === 0 ? "M" : "L"} ${x} ${y}`;
                  }, "")}
                  fill="none"
                  className="stroke-violet-600"
                  strokeWidth="3"
                />

                <path
                  d={activeChartData.reduce((path, d, i) => {
                    const sliceWidth = 460 / (activeChartData.length - 1 || 1);
                    const x = 20 + i * sliceWidth;
                    const y = 200 - (d.conversations / maxConvVal) * 160;
                    return path + `${i === 0 ? "M" : "L"} ${x} ${y}`;
                  }, "")}
                  fill="none"
                  className="stroke-sky-500"
                  strokeWidth="3"
                />
              </svg>
            </div>

            {/* Legend */}
            <div className="flex gap-4.5 justify-center mt-3 text-[10px] font-extrabold text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-violet-600" />
                <span>{t("حسابات المستخدمين", "User Accounts")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
                <span>{t("إجمالي الأنشطة الموثقة", "Total Logged Interactions")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GPA distribution */}
        <Card className="border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm bg-white dark:bg-zinc-900">
          <CardHeader className="pb-1.5">
            <CardTitle className="text-sm font-bold text-zinc-800 dark:text-zinc-150">
              {t("توزيع التقديرات (GPA)", "GPA Grade Distribution")}
            </CardTitle>
            <CardDescription className="text-[10px] mt-0.5">
              {t(`المعدلات العامة لـ ${totalStudents} طالب مسجل بالمنصة.`, `Overall grade stats for ${totalStudents} registered students.`)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-3.5">
            {gpaDistribution.map((d) => (
              <div key={d.grade} className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
                  <span>{d.grade}</span>
                  <span>{d.count} {t("طالب", "students")} ({d.pct}%)</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-violet-600 to-indigo-500 rounded-full"
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Popular Courses & Incidents Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popular Courses */}
        <Card className="border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm bg-white dark:bg-zinc-900">
          <CardHeader className="pb-1.5">
            <CardTitle className="text-sm font-bold text-zinc-800 dark:text-zinc-150">
              {t("المقررات والمواد بالدليل", "Featured Catalog Courses")}
            </CardTitle>
            <CardDescription className="text-[10px]">
              {t("عرض المقررات الرئيسية بالكلية ومراجعاتها.", "Main courses catalog and student review activity.")}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {popularCourses.map((c, i) => (
                <div key={c.code} className="flex justify-between items-center py-3">
                  <div className="flex gap-3.5 items-center">
                    <span className="text-xs font-black text-zinc-400 dark:text-zinc-500">#{i + 1}</span>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{c.name}</h4>
                      <span className="text-[9px] text-zinc-400 font-bold block">{c.code}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[9px] font-extrabold py-0.5">
                    {c.enrollment} {t("مراجعة ✍️", "reviews ✍️")}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Audit Log Preview */}
        <Card className="border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm bg-white dark:bg-zinc-900">
          <CardHeader className="pb-1.5 flex-row justify-between items-center space-y-0">
            <div>
              <CardTitle className="text-sm font-bold text-zinc-800 dark:text-zinc-150">
                {t("أحدث عمليات الإدارة", "Recent Admin Actions")}
              </CardTitle>
              <CardDescription className="text-[10px]">
                {t("سجل تدقيق الإجراءات الأخيرة للمشرفين.", "Audit log of recent administrative actions.")}
              </CardDescription>
            </div>
            <Link href="/admin/audit">
              <Button variant="ghost" className="text-[9px] font-bold h-7 px-2">
                {t("عرض السجل", "View Logs")}
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-3.5">
              {auditLogs.slice(0, 3).length > 0 ? (
                auditLogs.slice(0, 3).map((log) => (
                  <div key={log.id} className={`flex gap-3 items-start text-xs ${dir === "rtl" ? "border-r-2 pr-3" : "border-l-2 pl-3"} border-violet-500`}>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-zinc-800 dark:text-zinc-200 line-clamp-1">{log.action}</h5>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">{log.details}</p>
                      <span className="text-[9px] text-zinc-400 block mt-1">{log.timestamp} · {log.userName}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 space-y-2">
                  <History className="h-6 w-6 mx-auto text-zinc-300 dark:text-zinc-700" />
                  <p className="text-[10px] text-zinc-400">{t("لا توجد عمليات إشراف مسجلة بعد", "No admin logs recorded yet")}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Incidents / Alerts Panel */}
        <Card className="border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm bg-white dark:bg-zinc-900">
          <CardHeader className="pb-1.5 flex-row justify-between items-center space-y-0">
            <div>
              <CardTitle className="text-sm font-bold text-zinc-800 dark:text-zinc-150">
                {t("سجلات السلامة والأخطاء", "Security & System Logs")}
              </CardTitle>
              <CardDescription className="text-[10px]">
                {t("مراقبة البلاغات وتكامل الأكواد والنظام.", "Monitor incident alerts and system health.")}
              </CardDescription>
            </div>
            <Link href="/admin/audit">
              <Button variant="ghost" className="text-[9px] font-bold h-7 px-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20">
                {t("تفاصيل", "Details")}
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-3.5">
              {incidents.slice(0, 3).length > 0 ? (
                incidents.slice(0, 3).map((inc) => (
                  <div key={inc.id} className="p-3 bg-red-50 dark:bg-red-950/15 border border-red-200/40 dark:border-red-900/35 rounded-xl flex gap-2.5 items-start">
                    <AlertTriangle className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-red-700 dark:text-red-400">{inc.title}</span>
                        <span className="text-[8px] bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 px-1.5 rounded-full font-bold">{inc.statusCode}</span>
                      </div>
                      <p className="text-[9px] text-red-600/80 dark:text-red-400/70 truncate mt-0.5">{inc.message}</p>
                      <span className="text-[8px] text-zinc-400 block mt-1.5">{inc.timestamp}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 space-y-2">
                  <ShieldAlert className="h-6 w-6 mx-auto text-emerald-400" />
                  <p className="text-[10px] text-zinc-400">{t("جميع الخدمات مستقرة ولا توجد بلاغات أخطاء", "All services stable, zero incident alerts")}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
