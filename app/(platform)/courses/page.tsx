"use client";

import * as React from "react";
import Link from "next/link";
import { useApp } from "@/context/app-context";
import { useAcademic } from "@/context/academic-context";
import { useAdmin } from "@/context/admin-context";
import { useAuth } from "@/context/auth-context";
import { Course, PERIODS } from "@/lib/courses-data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, ArrowUpDown, Eye, Bookmark, CheckCircle, HelpCircle, Sparkles } from "lucide-react";
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

export default function CoursesPage() {
  const { user } = useAuth();
  const { t, lang, dir } = useApp();
  const { courses } = useAdmin();
  const {
    isCompleted,
    isPlanned,
    markCompleted,
    markPlanned,
    removeCourse
  } = useAcademic();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedDept, setSelectedDept] = React.useState<string>("ALL");
  const [selectedLevel, setSelectedLevel] = React.useState<string>("ALL");
  const [selectedDiff, setSelectedDiff] = React.useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("ALL");
  const [sortBy, setSortBy] = React.useState<string>("CODE_ASC");
  const [showFilters, setShowFilters] = React.useState(false);

  // Departments list helper
  const departments = [
    { value: "ALL", labelAr: "جميع الأقسام", labelEn: "All Departments" },
    { value: "IT", labelAr: "تكنولوجيا المعلومات (IT)", labelEn: "Information Technology (IT)" },
    { value: "CS", labelAr: "علوم الحاسب (CS)", labelEn: "Computer Science (CS)" },
    { value: "IS", labelAr: "نظم المعلومات (IS)", labelEn: "Information Systems (IS)" },
    { value: "MATH", labelAr: "العلوم الأساسية والرياضيات", labelEn: "Basic Sciences & Mathematics" },
    { value: "HUMANITIES", labelAr: "متطلبات الجامعة والإنسانيات", labelEn: "University & Humanities Requirements" }
  ];

  // Course Levels helper
  const levels = [
    { value: "ALL", labelAr: "جميع السنوات", labelEn: "All Years" },
    { value: "year-1", labelAr: "الفرقة الأولى", labelEn: "Year 1" },
    { value: "year-2", labelAr: "الفرقة الثانية", labelEn: "Year 2" },
    { value: "year-3", labelAr: "الفرقة الثالثة", labelEn: "Year 3" },
    { value: "year-4", labelAr: "الفرقة الرابعة", labelEn: "Year 4" }
  ];

  const periodOrder = [
    "year-1-sem-1",
    "year-1-sem-2",
    "year-2-sem-1",
    "year-2-sem-2",
    "year-3-sem-1",
    "year-3-sem-2",
    "year-4-sem-1",
    "year-4-sem-2"
  ];

  // Filtering & Sorting Logic
  const filteredCourses = React.useMemo(() => {
    return courses.filter((c) => {
      const query = searchTerm.toLowerCase().trim();
      const matchQuery =
        !query ||
        c.code.toLowerCase().includes(query) ||
        c.arabic.toLowerCase().includes(query) ||
        c.english.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query);

      const matchDept = selectedDept === "ALL" || c.department === selectedDept;
      const matchLevel = selectedLevel === "ALL" || c.period.startsWith(selectedLevel);
      const matchDiff = selectedDiff === "ALL" || c.difficulty === selectedDiff;

      let matchStatus = true;
      if (selectedStatus === "completed") matchStatus = isCompleted(c.code);
      else if (selectedStatus === "planned") matchStatus = isPlanned(c.code);
      else if (selectedStatus === "unstarted") matchStatus = !isCompleted(c.code) && !isPlanned(c.code);

      return matchQuery && matchDept && matchLevel && matchDiff && matchStatus;
    }).sort((a, b) => {
      if (sortBy === "ACADEMIC_ASC") {
        const idxA = periodOrder.indexOf(a.period);
        const idxB = periodOrder.indexOf(b.period);
        const diff = (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
        if (diff !== 0) return diff;
        return a.code.localeCompare(b.code);
      }
      if (sortBy === "CODE_ASC") return a.code.localeCompare(b.code);
      if (sortBy === "NAME_ASC") return (lang === "ar" ? a.arabic : a.english).localeCompare(lang === "ar" ? b.arabic : b.english);
      if (sortBy === "CREDITS_DESC") return b.credits - a.credits;
      if (sortBy === "CREDITS_ASC") return a.credits - b.credits;
      if (sortBy === "DIFFICULTY_ASC") {
        const order = { easy: 1, medium: 2, hard: 3 };
        return order[a.difficulty] - order[b.difficulty];
      }
      return 0;
    });
  }, [searchTerm, selectedDept, selectedLevel, selectedDiff, selectedStatus, sortBy, isCompleted, isPlanned, lang, courses]);

  return (
    <div className="space-y-8" dir={dir}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
            {t("مستكشف ودليل المواد", "Course Explorer & Guide")}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {t(
              "تصفح المقررات الدراسية لجميع أقسام تكنولوجيا المعلومات، ابحث، ورتب موادك.",
              "Browse all IT faculty courses, search, filter, and organize your curriculum."
            )}
          </p>
        </div>
      </div>

      {/* Guest Mode Notification Banner */}
      {!user && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-violet-600/10 via-indigo-600/10 to-cyan-500/10 border border-violet-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
        >
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 flex flex-wrap items-center gap-2">
                <span>{t("دليل المقررات مفتوح للجميع", "Open Course Catalog")}</span>
                <Badge className="bg-violet-500/20 text-violet-700 dark:text-violet-300 border-none text-[10px] font-bold">
                  {t("تصفح واستكشف بحرية ⚡", "Free Access ⚡")}
                </Badge>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                {t(
                  "استكشف كافة المقررات والمتطلبات السابقة. أنشئ حسابك الجامعي لتمييز المواد المنجزة وإضافتها لجدولك الأكاديمي.",
                  "Explore all courses and prerequisites. Create your student account to track completed courses in your plan."
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <Link href="/auth/login" className="flex-1 sm:flex-none">
              <Button size="sm" variant="outline" className="w-full sm:w-auto text-xs font-bold rounded-xl h-9">
                {t("تسجيل الدخول", "Sign In")}
              </Button>
            </Link>
            <Link href="/auth/register" className="flex-1 sm:flex-none">
              <Button size="sm" className="w-full sm:w-auto text-xs font-bold rounded-xl h-9 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md">
                {t("إنشاء حساب 🚀", "Register 🚀")}
              </Button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Search & Sort Panel */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className={`absolute ${lang === "ar" ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400`} />
            <Input
              type="text"
              placeholder={t(
                "ابحث برمز المادة، الاسم باللغة العربية أو الإنجليزية...",
                "Search by course code, title..."
              )}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={lang === "ar" ? "pr-10" : "pl-10"}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`gap-2 text-xs font-bold cursor-pointer h-11 ${
                showFilters ? "border-violet-500 text-violet-600 bg-violet-50 dark:bg-violet-950/20" : ""
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              {t("تصفية المتقدمة", "Advanced Filters")}
            </Button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-11 pl-8 pr-3.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:ring-violet-500 transition-all duration-200 cursor-pointer appearance-none"
              >
                <option value="ACADEMIC_ASC">{t("الترتيب أكاديمياً", "Academic Order")}</option>
                <option value="CODE_ASC">{t("الترتيب برمز المقرر", "Sort by Code")}</option>
                <option value="NAME_ASC">{t("الترتيب هجائياً (أ-ي)", "Sort Alphabetically (A-Z)")}</option>
                <option value="CREDITS_DESC">{t("الساعات (الأعلى أولاً)", "Credits (Highest First)")}</option>
                <option value="CREDITS_ASC">{t("الساعات (الأقل أولاً)", "Credits (Lowest First)")}</option>
                <option value="DIFFICULTY_ASC">{t("الصعوبة (السهل أولاً)", "Difficulty (Easiest First)")}</option>
              </select>
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Extended Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl shadow-sm overflow-hidden"
            >
              {/* Department */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("القسم الدراسي", "Department")}</label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:ring-violet-500 cursor-pointer"
                >
                  {departments.map((d) => (
                    <option key={d.value} value={d.value}>{t(d.labelAr, d.labelEn)}</option>
                  ))}
                </select>
              </div>

              {/* Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("الفرقة الدراسية", "Academic Year")}</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:ring-violet-500 cursor-pointer"
                >
                  {levels.map((l) => (
                    <option key={l.value} value={l.value}>{t(l.labelAr, l.labelEn)}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("مستوى الصعوبة", "Difficulty Level")}</label>
                <select
                  value={selectedDiff}
                  onChange={(e) => setSelectedDiff(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:ring-violet-500 cursor-pointer"
                >
                  <option value="ALL">{t("جميع مستويات الصعوبة", "All Difficulty Levels")}</option>
                  <option value="easy">{t("سهل 🟢", "Easy 🟢")}</option>
                  <option value="medium">{t("متوسط 🟡", "Medium 🟡")}</option>
                  <option value="hard">{t("صعب 🔴", "Hard 🔴")}</option>
                </select>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("حالة المساق", "Course Status")}</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:ring-violet-500 cursor-pointer"
                >
                  <option value="ALL">{t("جميع الحالات", "All Statuses")}</option>
                  <option value="completed">{t("منجزة ✓", "Completed ✓")}</option>
                  <option value="planned">{t("مخططة 📅", "Planned 📅")}</option>
                  <option value="unstarted">{t("غير مسجلة 🔓", "Not Registered 🔓")}</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => {
            const completed = isCompleted(course.code);
            const planned = isPlanned(course.code);

            return (
              <Card
                key={course.code}
                className={`border bg-white dark:bg-zinc-900 shadow-sm flex flex-col justify-between hover:scale-[1.01] hover:shadow-md transition-all duration-200 ${
                  completed
                    ? "border-green-500/20 bg-green-500/[0.01]"
                    : planned
                    ? "border-violet-500/20 bg-violet-500/[0.01]"
                    : "border-zinc-200/50 dark:border-zinc-800/50"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2.5">
                    <Badge variant="outline" className="text-[10px] font-bold py-0.5 px-2.5 shrink-0">
                      {course.code}
                    </Badge>

                    {/* Difficulty Badge */}
                    <Badge
                      className={`text-[9px] py-0 px-2 border-transparent ${
                        course.difficulty === "easy"
                          ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400"
                          : course.difficulty === "hard"
                          ? "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400"
                          : "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400"
                      }`}
                    >
                      {course.difficulty === "easy" ? t("سهل", "Easy") : course.difficulty === "hard" ? t("صعب", "Hard") : t("متوسط", "Medium")}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-50 mt-3.5 line-clamp-1">
                    {t(course.arabic, course.english)}
                  </CardTitle>
                  {lang === "ar" && (
                    <CardDescription className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 line-clamp-1">
                      {course.english}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="pb-4 pt-1 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed line-clamp-3 mb-4.5">
                    {lang === "ar" ? course.description : (course.descriptionEn || course.description)}
                  </p>

                  <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-850 pt-3">
                    <span>{course.credits} {t("ساعات معتمدة", "Credit Hours")}</span>
                    <span>{lang === "ar" ? (PERIODS[course.period] || course.period) : (PERIODS_EN[course.period] || course.period)}</span>
                  </div>
                </CardContent>

                {/* Footer Actions */}
                <div className="p-4 pt-0 flex gap-2 border-t border-transparent">
                  <Link href={`/courses/${course.code}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs font-bold gap-1.5 h-9">
                      <Eye className="h-3.5 w-3.5" />
                      {t("عرض التفاصيل", "View Details")}
                    </Button>
                  </Link>

                  <button
                    onClick={() => completed ? removeCourse(course.code) : markCompleted(course.code, "A")}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                      completed
                        ? "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                        : "border-emerald-500/40 dark:border-emerald-500/40 bg-emerald-500/10 dark:bg-emerald-500/15 hover:bg-emerald-500/20 dark:hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 hover:border-emerald-600 dark:hover:border-emerald-400"
                    }`}
                    title={completed ? t("تراجع عن الإنجاز", "Undo Completion") : t("تحديد كمنجزة", "Mark as Completed")}
                  >
                    <CheckCircle className={`h-4 w-4 stroke-[2.4] ${completed ? "text-white" : "text-emerald-600 dark:text-emerald-400"}`} />
                  </button>

                  <button
                    onClick={() => planned ? removeCourse(course.code) : markPlanned(course.code)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                      planned
                        ? "bg-violet-600 border-violet-600 text-white hover:bg-violet-700 shadow-sm"
                        : "border-violet-500/40 dark:border-violet-500/40 bg-violet-500/10 dark:bg-violet-500/15 hover:bg-violet-500/20 dark:hover:bg-violet-500/25 text-violet-600 dark:text-violet-400 hover:border-violet-600 dark:hover:border-violet-400"
                    }`}
                    title={planned ? t("إلغاء الخطة", "Remove from Plan") : t("إضافة للمخطط الدراسي", "Add to Study Plan")}
                  >
                    <Bookmark className={`h-4 w-4 stroke-[2.4] ${planned ? "text-white fill-white" : "text-violet-600 dark:text-violet-400"}`} />
                  </button>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center space-y-3.5">
            <div className="mx-auto h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-250">
              {t("لا توجد مواد مطابقة لخيارات البحث", "No courses match your search criteria")}
            </h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
              {t(
                "تأكد من كتابة مصطلح بحث صحيح أو تغيير فلاتر التصفية المطبقة لإظهار المقررات الدراسية.",
                "Make sure you entered a valid search term or adjust the applied filters to show courses."
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
