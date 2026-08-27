"use client";

import * as React from "react";
import { useApp } from "@/context/app-context";
import { useSocial, CareerOpportunity } from "@/context/social-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  MapPin,
  Building2,
  Bookmark,
  BookmarkCheck,
  Search,
  ExternalLink,
  SlidersHorizontal,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CareersPage() {
  const { t, lang, dir } = useApp();
  const { careers, toggleSaveJob, isJobSaved } = useSocial();

  const [search, setSearch] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<string>("all");
  const [selectedExp, setSelectedExp] = React.useState<string>("all");
  const [selectedDept, setSelectedDept] = React.useState<string>("all");
  const [showFilters, setShowFilters] = React.useState(false);

  const typesArabic: Record<string, { ar: string; en: string }> = {
    all: { ar: "كل الفرص", en: "All Opportunities" },
    internship: { ar: "تدريب عملي", en: "Internship" },
    remote: { ar: "وظيفة عن بعد", en: "Remote Job" },
    "part-time": { ar: "دوام جزئي", en: "Part-Time" },
    freelance: { ar: "عمل حر", en: "Freelance" },
    graduate: { ar: "برامج خريجين", en: "Graduate Program" },
    competition: { ar: "مسابقات وتحديات", en: "Competition" },
    hackathon: { ar: "هاكاثون", en: "Hackathon" },
    scholarship: { ar: "منح دراسية", en: "Scholarship" },
    training: { ar: "برامج تدريبية", en: "Training Program" }
  };

  const experienceArabic: Record<string, { ar: string; en: string }> = {
    all: { ar: "جميع المستويات", en: "All Levels" },
    entry: { ar: "مبتدئ (Entry)", en: "Entry Level" },
    mid: { ar: "متوسط (Mid)", en: "Mid Level" },
    senior: { ar: "متقدم (Senior)", en: "Senior Level" }
  };

  const deptsArabic: Record<string, { ar: string; en: string }> = {
    all: { ar: "كل الأقسام", en: "All Departments" },
    IT: { ar: "تكنولوجيا المعلومات (IT)", en: "Information Technology (IT)" },
    CS: { ar: "علوم الحاسب (CS)", en: "Computer Science (CS)" },
    IS: { ar: "نظم المعلومات (IS)", en: "Information Systems (IS)" }
  };

  const filteredCareers = careers.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase());

    const matchesType = selectedType === "all" || job.type === selectedType;
    const matchesExp = selectedExp === "all" || job.experience === selectedExp;
    const matchesDept = selectedDept === "all" || job.department === selectedDept || job.department === "all";

    return matchesSearch && matchesType && matchesExp && matchesDept;
  });

  const isRtl = dir === "rtl";

  return (
    <div className="space-y-8 max-w-5xl mx-auto" dir={dir}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-950 dark:text-zinc-50">
            {t("بوابة التدريب والتوظيف الأكاديمي", "Academic Internship & Careers Portal")}
          </h1>
          <p className="text-sm text-zinc-550 dark:text-zinc-400 mt-1">
            {t(
              "اكتشف فرص التدريب الصيفي، الوظائف، المنح والهاكاثونات الموجهة لطلاب الحاسبات وتقنية المعلومات.",
              "Discover summer internships, job openings, scholarships, and hackathons for IT students."
            )}
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <Card className="border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm">
        <CardContent className="p-4 md:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className={`absolute ${isRtl ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-400`} />
              <Input
                type="text"
                placeholder={t(
                  "ابحث عن المسمى الوظيفي، الشركة، الكلمات المفتاحية...",
                  "Search job title, company, keywords..."
                )}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={isRtl ? "pr-10" : "pl-10"}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 h-11 shrink-0 px-5 border-zinc-200/60 dark:border-zinc-800/60"
            >
              <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
              <span>{t("تصفية متقدمة", "Advanced Filter")}</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </Button>
          </div>

          {/* Advanced filters dropdown */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3.5 border-t border-zinc-100 dark:border-zinc-800"
              >
                {/* Type Filter */}
                <div className={`space-y-1.5 ${isRtl ? "text-right" : "text-left"}`}>
                  <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
                    {t("نوع الفرصة", "Opportunity Type")}
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-850 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 cursor-pointer"
                  >
                    {Object.entries(typesArabic).map(([k, v]) => (
                      <option key={k} value={k}>{t(v.ar, v.en)}</option>
                    ))}
                  </select>
                </div>

                {/* Experience Level Filter */}
                <div className={`space-y-1.5 ${isRtl ? "text-right" : "text-left"}`}>
                  <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
                    {t("مستوى الخبرة", "Experience Level")}
                  </label>
                  <select
                    value={selectedExp}
                    onChange={(e) => setSelectedExp(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-855 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 cursor-pointer"
                  >
                    {Object.entries(experienceArabic).map(([k, v]) => (
                      <option key={k} value={k}>{t(v.ar, v.en)}</option>
                    ))}
                  </select>
                </div>

                {/* Department Filter */}
                <div className={`space-y-1.5 ${isRtl ? "text-right" : "text-left"}`}>
                  <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
                    {t("التخصص / القسم", "Major / Department")}
                  </label>
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-855 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 cursor-pointer"
                  >
                    {Object.entries(deptsArabic).map(([k, v]) => (
                      <option key={k} value={k}>{t(v.ar, v.en)}</option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Jobs List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredCareers.length > 0 ? (
            filteredCareers.map((job) => {
              const saved = isJobSaved(job.id);
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="h-full border border-zinc-200/50 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
                    {/* Decorative side color border */}
                    <div className={`absolute top-0 ${isRtl ? "right-0" : "left-0"} bottom-0 w-1 bg-sky-600/80 group-hover:bg-sky-600 transition-colors`} />

                    <CardHeader className={`pb-3 ${isRtl ? "text-right" : "text-left"}`}>
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1.5">
                          <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400 text-[10px] px-2.5 py-0.5 rounded-md font-bold">
                            {typesArabic[job.type] ? t(typesArabic[job.type].ar, typesArabic[job.type].en) : job.type}
                          </Badge>
                          <CardTitle className="text-base font-extrabold text-zinc-950 dark:text-zinc-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors mt-2">
                            {job.title}
                          </CardTitle>
                        </div>
                        
                        {/* Bookmark Button */}
                        <button
                          onClick={() => toggleSaveJob(job.id)}
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            saved
                              ? "bg-sky-50 border-sky-200 text-sky-600 dark:bg-sky-950/40 dark:border-sky-850 dark:text-sky-400"
                              : "bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-400 dark:bg-zinc-950 dark:border-zinc-800 dark:hover:bg-zinc-850"
                          }`}
                          title={saved ? t("إزالة من المحفوظات", "Remove Bookmark") : t("حفظ الفرصة", "Bookmark Opportunity")}
                        >
                          {saved ? <BookmarkCheck className="h-4.5 w-4.5" /> : <Bookmark className="h-4.5 w-4.5" />}
                        </button>
                      </div>

                      {/* Company Name and Location */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-550 dark:text-zinc-400 mt-3 font-semibold">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5 text-zinc-400" />
                          {job.company}
                        </span>
                        <span className="text-zinc-350 dark:text-zinc-700">|</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                          {job.location}
                        </span>
                      </div>
                    </CardHeader>

                    {/* Job Details */}
                    <CardContent className={`space-y-4 pt-0 ${isRtl ? "text-right" : "text-left"} flex-1 flex flex-col justify-between`}>
                      <p className="text-xs text-zinc-650 dark:text-zinc-350 leading-relaxed line-clamp-3">
                        {job.description}
                      </p>

                      <div className="space-y-4 mt-4">
                        {/* Meta Badges */}
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-850">
                          <span className="text-[10px] font-bold px-2 py-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800 rounded-md text-zinc-600 dark:text-zinc-400">
                            {experienceArabic[job.experience] ? t(experienceArabic[job.experience].ar, experienceArabic[job.experience].en) : job.experience}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800 rounded-md text-zinc-600 dark:text-zinc-400">
                            {deptsArabic[job.department] ? t(deptsArabic[job.department].ar, deptsArabic[job.department].en) : job.department}
                          </span>
                          <span className={`text-[10px] text-zinc-400 dark:text-zinc-500 ${isRtl ? "mr-auto" : "ml-auto"} mt-1`}>
                            {t(`أضيف في: ${job.dateAdded}`, `Added: ${job.dateAdded}`)}
                          </span>
                        </div>

                        {/* Apply CTA */}
                        <a
                          href={job.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full"
                        >
                          <Button className="w-full flex items-center justify-center gap-2 text-xs font-bold shadow-sm" variant="secondary">
                            <span>{t("التقديم على الفرصة", "Apply for Position")}</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/60 rounded-3xl space-y-4">
              <Briefcase className="h-12 w-12 mx-auto text-zinc-300" />
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-zinc-950 dark:text-zinc-50">
                  {t("لا توجد نتائج مطابقة", "No matching results")}
                </h3>
                <p className="text-xs text-zinc-450 dark:text-zinc-500">
                  {t("جرب تعديل الكلمات الدلالية أو الفلاتر للعثور على فرص ملائمة.", "Try adjusting your search terms or filters to find opportunities.")}
                </p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
