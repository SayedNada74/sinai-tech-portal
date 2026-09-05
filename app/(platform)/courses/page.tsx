"use client";

import * as React from"react";
import Link from"next/link";
import { useApp } from"@/context/app-context";
import { useAcademic } from"@/context/academic-context";
import { useAdmin } from"@/context/admin-context";
import { useAuth } from"@/context/auth-context";
import { Course, PERIODS } from"@/lib/courses-data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from"@/components/ui/card";
import { Button } from"@/components/ui/button";
import { Badge } from"@/components/ui/badge";
import { Input } from"@/components/ui/input";
import { CoursesGridSkeleton } from"@/components/ui/skeleton";
import { Search, SlidersHorizontal, ArrowUpDown, Eye, Bookmark, CheckCircle, HelpCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthRequirementModal } from "@/components/auth-requirement-modal";
import { GuestNoticeBanner } from "@/components/guest-notice-banner";

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
  const { user, isAuthenticated, isLoading } = useAuth();
  const { t, lang, dir } = useApp();
  const { courses } = useAdmin();
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const {
    isCompleted,
    isPlanned,
    markCompleted,
    unmarkCompleted,
    markPlanned,
    unmarkPlanned,
    removeCourse
  } = useAcademic();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedDept, setSelectedDept] = React.useState<string>("ALL");
  const [selectedLevel, setSelectedLevel] = React.useState<string>("ALL");
  const [selectedDiff, setSelectedDiff] = React.useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("ALL");
  const [sortBy, setSortBy] = React.useState<string>("ACADEMIC");
  const [showFilters, setShowFilters] = React.useState(false);

  // Departments list helper
  const departments = [
    { value:"ALL", labelAr:"جميع الأقسام", labelEn:"All Departments" },
    { value:"IT", labelAr:"تكنولوجيا المعلومات (IT)", labelEn:"Information Technology (IT)" },
    { value:"CS", labelAr:"علوم الحاسب (CS)", labelEn:"Computer Science (CS)" },
    { value:"IS", labelAr:"نظم المعلومات (IS)", labelEn:"Information Systems (IS)" },
    { value:"MATH", labelAr:"العلوم الأساسية والرياضيات", labelEn:"Basic Sciences & Mathematics" },
    { value:"HUMANITIES", labelAr:"متطلبات الجامعة والإنسانيات", labelEn:"University & Humanities Requirements" }
  ];

  // Course Levels helper
  const levels = [
    { value:"ALL", labelAr:"جميع السنوات", labelEn:"All Years" },
    { value:"year-1", labelAr:"الفرقة الأولى", labelEn:"Year 1" },
    { value:"year-2", labelAr:"الفرقة الثانية", labelEn:"Year 2" },
    { value:"year-3", labelAr:"الفرقة الثالثة", labelEn:"Year 3" },
    { value:"year-4", labelAr:"الفرقة الرابعة", labelEn:"Year 4" }
  ];

  const periodOrder = ["year-1-sem-1","year-1-sem-2","year-2-sem-1","year-2-sem-2","year-3-sem-1","year-3-sem-2","year-4-sem-1","year-4-sem-2"
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

      const matchDept = selectedDept ==="ALL" || c.department === selectedDept;
      const matchLevel = selectedLevel ==="ALL" || c.period.startsWith(selectedLevel);
      const matchDiff = selectedDiff ==="ALL" || c.difficulty === selectedDiff;

      let matchStatus = true;
      if (selectedStatus ==="completed") matchStatus = isCompleted(c.code);
      else if (selectedStatus ==="planned") matchStatus = isPlanned(c.code);
      else if (selectedStatus ==="unstarted") matchStatus = !isCompleted(c.code) && !isPlanned(c.code);

      return matchQuery && matchDept && matchLevel && matchDiff && matchStatus;
    }).sort((a, b) => {
      if (sortBy ==="ACADEMIC_ASC") {
        const idxA = periodOrder.indexOf(a.period);
        const idxB = periodOrder.indexOf(b.period);
        const diff = (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
        if (diff !== 0) return diff;
        return a.code.localeCompare(b.code);
      }
      if (sortBy ==="CODE_ASC") return a.code.localeCompare(b.code);
      if (sortBy ==="NAME_ASC") return (lang ==="ar" ? a.arabic : a.english).localeCompare(lang ==="ar" ? b.arabic : b.english);
      if (sortBy ==="CREDITS_DESC") return b.credits - a.credits;
      if (sortBy ==="CREDITS_ASC") return a.credits - b.credits;
      if (sortBy ==="DIFFICULTY_ASC") {
        const order = { easy: 1, medium: 2, hard: 3 };
        return order[a.difficulty] - order[b.difficulty];
      }
      return 0;
    });
  }, [searchTerm, selectedDept, selectedLevel, selectedDiff, selectedStatus, sortBy, isCompleted, isPlanned, lang, courses]);

  if (isLoading) {
    return <CoursesGridSkeleton />;
  }

  return (
    <div className="space-y-8" dir={dir}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5">
            <Search className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            {t("مستكشف ودليل المواد","Course Explorer & Guide")}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {t("تصفح المقررات الدراسية لجميع أقسام تكنولوجيا المعلومات، ابحث، ورتب موادك.","Browse all IT faculty courses, search, filter, and organize your curriculum."
            )}
          </p>
        </div>
      </div>

      {/* Guest Mode Notification Banner */}
      <GuestNoticeBanner
        title={t("دليل المقررات مفتوح للجميع", "Open Course Catalog")}
        badge={t("تصفح واستكشف بحرية", "Free Access")}
        description={t(
          "استكشف كافة المقررات والمتطلبات السابقة. أنشئ حسابك الجامعي لتمييز المواد المنجزة وإضافتها لجدولك الأكاديمي.",
          "Explore all courses and prerequisites. Create your student account to track completed courses in your plan."
        )}
      />

      {/* Search & Sort Panel */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className={`absolute ${lang ==="ar" ?"right-3.5" :"left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400`} />
            <Input
              type="text"
              placeholder={t("ابحث برمز المادة، الاسم باللغة العربية أو الإنجليزية...","Search by course code, title..."
              )}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={lang ==="ar" ?"pr-10" :"pl-10"}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex-1 sm:flex-initial gap-2 text-xs font-bold cursor-pointer h-11 ${
                showFilters ?"border-sky-500 text-sky-600 bg-sky-50 dark:bg-sky-950/20" :""
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>{t("تصفية","Filters")}</span>
            </Button>

            {/* Sort Dropdown */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto h-11 pl-8 pr-3.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:ring-sky-500 transition-all duration-200 cursor-pointer appearance-none"
              >
                <option value="ACADEMIC_ASC">{t("الترتيب أكاديمياً","Academic Order")}</option>
                <option value="CODE_ASC">{t("الترتيب برمز المقرر","Sort by Code")}</option>
                <option value="NAME_ASC">{t("الترتيب هجائياً (أ-ي)","Sort Alphabetically (A-Z)")}</option>
                <option value="CREDITS_DESC">{t("الساعات (الأعلى أولاً)","Credits (Highest First)")}</option>
                <option value="CREDITS_ASC">{t("الساعات (الأقل أولاً)","Credits (Lowest First)")}</option>
                <option value="DIFFICULTY_ASC">{t("الصعوبة (السهل أولاً)","Difficulty (Easiest First)")}</option>
              </select>
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Extended Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height:"auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl shadow-sm overflow-hidden"
            >
              {/* Department */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("القسم الدراسي","Department")}</label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:ring-sky-500 cursor-pointer"
                >
                  {departments.map((d) => (
                    <option key={d.value} value={d.value}>{t(d.labelAr, d.labelEn)}</option>
                  ))}
                </select>
              </div>

              {/* Level */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("الفرقة الدراسية","Academic Year")}</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:ring-sky-500 cursor-pointer"
                >
                  {levels.map((l) => (
                    <option key={l.value} value={l.value}>{t(l.labelAr, l.labelEn)}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("مستوى الصعوبة","Difficulty Level")}</label>
                <select
                  value={selectedDiff}
                  onChange={(e) => setSelectedDiff(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:ring-sky-500 cursor-pointer"
                >
                  <option value="ALL">{t("جميع مستويات الصعوبة","All Difficulty Levels")}</option>
                  <option value="easy">{t("سهل","Easy")}</option>
                  <option value="medium">{t("متوسط","Medium")}</option>
                  <option value="hard">{t("صعب","Hard")}</option>
                </select>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("حالة المساق","Course Status")}</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:ring-sky-500 cursor-pointer"
                >
                  <option value="ALL">{t("جميع الحالات","All Statuses")}</option>
                  <option value="completed">{t("منجزة","Completed")}</option>
                  <option value="planned">{t("مخططة","Planned")}</option>
                  <option value="unstarted">{t("غير مسجلة","Not Registered")}</option>
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
                    ?"border-green-500/20 bg-green-500/[0.01]"
                    : planned
                    ?"border-sky-500/20 bg-sky-500/[0.01]"
                    :"border-zinc-200/50 dark:border-zinc-800/50"
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
                        course.difficulty ==="easy"
                          ?"bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400"
                          : course.difficulty ==="hard"
                          ?"bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400"
                          :"bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400"
                      }`}
                    >
                      {course.difficulty ==="easy" ? t("سهل","Easy") : course.difficulty ==="hard" ? t("صعب","Hard") : t("متوسط","Medium")}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-extrabold text-zinc-900 dark:text-zinc-50 mt-3.5 line-clamp-1">
                    {t(course.arabic, course.english)}
                  </CardTitle>
                  {lang ==="ar" && (
                    <CardDescription className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 line-clamp-1">
                      {course.english}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="pb-4 pt-1 flex-1 flex flex-col justify-between">
                  <p className="text-[13px] text-zinc-600 dark:text-zinc-300 leading-[1.65] line-clamp-3 mb-4.5 font-medium">
                    {lang ==="ar" ? course.description : (course.descriptionEn || course.description)}
                  </p>

                  <div className="flex justify-between items-center text-[11px] font-bold text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-850 pt-3">
                    <span>{course.credits} {t("ساعات معتمدة","Credit Hours")}</span>
                    <span>{lang ==="ar" ? (PERIODS[course.period] || course.period) : (PERIODS_EN[course.period] || course.period)}</span>
                  </div>
                </CardContent>

                {/* Footer Actions */}
                <div className="p-4 pt-0 flex gap-2 border-t border-transparent">
                  <Link href={`/courses/${course.code}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-[13px] font-bold gap-1.5 h-9">
                      <Eye className="h-4 w-4" />
                      {t("عرض التفاصيل","View Details")}
                    </Button>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      if (!isAuthenticated) {
                        setShowAuthModal(true);
                        return;
                      }
                      completed ? unmarkCompleted(course.code) : markCompleted(course.code, "A");
                    }}
                    className={`p-2.5 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                      completed
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                        : "border-emerald-500 dark:border-emerald-500/60 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400"
                    }`}
                    title={completed ? t("تراجع عن الإنجاز", "Undo Completion") : t("تحديد كمنجزة", "Mark as Completed")}
                  >
                    <CheckCircle className={`h-4.5 w-4.5 stroke-[2.4] ${completed ? "text-white fill-emerald-600" : "text-emerald-600 dark:text-emerald-400"}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!isAuthenticated) {
                        setShowAuthModal(true);
                        return;
                      }
                      planned ? unmarkPlanned(course.code) : markPlanned(course.code);
                    }}
                    className={`p-2.5 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                      planned
                        ? "bg-sky-600 border-sky-600 text-white shadow-md"
                        : "border-sky-500 dark:border-sky-500/60 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-600 dark:text-sky-400"
                    }`}
                    title={planned ? t("إلغاء الخطة", "Remove from Plan") : t("إضافة للمخطط الدراسي", "Add to Study Plan")}
                  >
                    <Bookmark className={`h-4.5 w-4.5 stroke-[2.4] ${planned ? "text-white fill-white" : "text-sky-600 dark:text-sky-400"}`} />
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
              {t("لا توجد مواد مطابقة لخيارات البحث","No courses match your search criteria")}
            </h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
              {t("تأكد من كتابة مصطلح بحث صحيح أو تغيير فلاتر التصفية المطبقة لإظهار المقررات الدراسية.","Make sure you entered a valid search term or adjust the applied filters to show courses."
              )}
            </p>
          </div>
        )}
      </div>

      {/* Auth Requirement Modal */}
      <AuthRequirementModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title={t("تسجيل الدخول مطلوب لإدارة مقرراتك", "Sign in required to manage courses")}
        description={t(
          "لتتمكن من تمييز المواد المنجزة وإضافتها لخطتك الدراسية ومتابعة الـ GPA، يرجى تسجيل الدخول أو إنشاء حساب جديد.",
          "To mark completed courses and add them to your study plan, please sign in or create a new account."
        )}
      />
    </div>
  );
}
