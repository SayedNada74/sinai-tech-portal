"use client";

import * as React from "react";
import Link from "next/link";
import { useApp } from "@/context/app-context";
import { useLearning } from "@/context/learning-context";
import { useSocial } from "@/context/social-context";
import { useAdmin } from "@/context/admin-context";
import { ROADMAPS } from "@/lib/roadmaps-data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bookmark,
  Trash2,
  ArrowLeft,
  ArrowRight,
  BookmarkCheck,
  FileText,
  Compass,
  GraduationCap,
  Briefcase,
  CalendarDays,
  Building2,
  MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type TabType = "courses" | "resources" | "roadmaps" | "jobs" | "events";

export default function SavedItemsPage() {
  const { t, lang, dir } = useApp();
  const { courses, resources: adminResources } = useAdmin();
  const { bookmarks, toggleBookmark } = useLearning();
  const { careers, events, savedJobs, savedEvents, toggleSaveJob, toggleSaveEvent } = useSocial();

  const [activeTab, setActiveTab] = React.useState<TabType>("courses");

  const savedCourses = bookmarks.filter((b) => b.type === "course");
  const savedResources = bookmarks.filter((b) => b.type === "resource");
  const savedRoadmaps = bookmarks.filter((b) => b.type === "roadmap");
  const savedCareerItems = careers.filter((j) => savedJobs.includes(j.id));
  const savedEventItems = events.filter((e) => savedEvents.includes(e.id));

  const tabs: { id: TabType; label: string; icon: React.ElementType; count: number }[] = [
    { id: "courses", label: t("المواد", "Courses"), icon: GraduationCap, count: savedCourses.length },
    { id: "resources", label: t("الملفات", "Resources"), icon: FileText, count: savedResources.length },
    { id: "roadmaps", label: t("المسارات", "Roadmaps"), icon: Compass, count: savedRoadmaps.length },
    { id: "jobs", label: t("الوظائف", "Jobs & Careers"), icon: Briefcase, count: savedCareerItems.length },
    { id: "events", label: t("الفعاليات", "Events"), icon: CalendarDays, count: savedEventItems.length },
  ];

  const typesArabic: Record<string, { ar: string; en: string }> = {
    internship: { ar: "تدريب", en: "Internship" },
    remote: { ar: "عن بعد", en: "Remote" },
    "part-time": { ar: "جزئي", en: "Part-time" },
    freelance: { ar: "حر", en: "Freelance" },
    competition: { ar: "مسابقة", en: "Competition" },
    hackathon: { ar: "هاكاثون", en: "Hackathon" },
    scholarship: { ar: "منحة", en: "Scholarship" },
    training: { ar: "تدريبي", en: "Training" },
    graduate: { ar: "خريجين", en: "Graduate" }
  };

  const eventTypesArabic: Record<string, { ar: string; en: string }> = {
    workshop: { ar: "ورشة عمل", en: "Workshop" },
    seminar: { ar: "ندوة", en: "Seminar" },
    competition: { ar: "مسابقة", en: "Competition" },
    university: { ar: "حدث جامعي", en: "University Event" },
    fair: { ar: "ملتقى", en: "Fair" },
    meetup: { ar: "تجمع", en: "Meetup" }
  };

  const isRtl = dir === "rtl";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const EmptyState = ({ message, hint, href, cta }: { message: string; hint: string; href: string; cta: string }) => (
    <div className="col-span-full py-20 text-center space-y-4 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/60 rounded-3xl">
      <div className="mx-auto h-14 w-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
        <Bookmark className="h-7 w-7" />
      </div>
      <div className="space-y-1">
        <h3 className="font-extrabold text-sm text-zinc-950 dark:text-zinc-50">{message}</h3>
        <p className="text-xs text-zinc-450 dark:text-zinc-500 max-w-xs mx-auto leading-relaxed">{hint}</p>
      </div>
      <Link href={href}>
        <Button size="sm" variant="outline" className="mt-2 px-6 text-xs">
          {cta}
        </Button>
      </Link>
    </div>
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto" dir={dir}>
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
          <BookmarkCheck className="h-6.5 w-6.5 text-violet-550" />
          {t("العناصر المحفوظة", "Saved Items")}
        </h1>
        <p className="text-sm text-zinc-550 dark:text-zinc-400 mt-1">
          {t(
            "الوصول السريع لكل المواد الدراسية، الملفات، المسارات، الوظائف والفعاليات التي قمت بحفظها.",
            "Quick access to all your bookmarked courses, resources, roadmaps, jobs, and events."
          )}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-zinc-200 dark:border-zinc-850 gap-1 scrollbar-none pb-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-4 text-xs font-extrabold border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2 ${
                active
                  ? "border-violet-650 text-violet-650 dark:border-violet-450 dark:text-violet-400"
                  : "border-transparent text-zinc-450 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${active ? "bg-violet-100 text-violet-650 dark:bg-violet-950/40 dark:text-violet-400" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-450"}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content Panels */}
      <AnimatePresence mode="wait">

        {/* Saved Courses */}
        {activeTab === "courses" && (
          <motion.div key="courses" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedCourses.length > 0 ? (
              savedCourses.map((item) => {
                const detail = courses.find((c) => c.code === item.id);
                return (
                  <Card key={item.id} className="border border-zinc-200/50 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm flex flex-col justify-between">
                    <CardHeader className="pb-3 flex flex-row justify-between items-start space-y-0 gap-3">
                      <div>
                        <Badge variant="outline" className="text-[10px] font-bold py-0">{item.id}</Badge>
                        <CardTitle className="text-sm font-bold text-zinc-950 dark:text-zinc-100 mt-2.5 line-clamp-1">{item.title}</CardTitle>
                      </div>
                      <button onClick={() => toggleBookmark(item.id, "course", item.title, item.link)} className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20 text-zinc-400 transition-colors cursor-pointer" title={t("إزالة", "Remove")}>
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </CardHeader>
                    <CardContent className="pb-4 pt-1">
                      <p className="text-xs text-zinc-550 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                        {detail ? detail.description : t("مقرر دراسي محفوظ في لوحة التحكم الشخصية.", "Saved course in your personal dashboard.")}
                      </p>
                      <Link href={item.link}>
                        <Button size="sm" variant="outline" className="w-full text-xs font-bold gap-1.5 h-9">
                          {t("عرض تفاصيل المادة", "View Course Details")} <ArrowIcon className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <EmptyState
                message={t("لا توجد مواد محفوظة", "No saved courses")}
                hint={t("تصفح مستكشف المقررات وانقر حفظ للوصول السريع أوقات الدراسة.", "Browse the course explorer and click save for quick study access.")}
                href="/courses"
                cta={t("تصفح المقررات الدراسية", "Explore Courses")}
              />
            )}
          </motion.div>
        )}

        {/* Saved Resources */}
        {activeTab === "resources" && (
          <motion.div key="resources" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedResources.length > 0 ? (
              savedResources.map((item) => {
                const detail = adminResources.find((r) => r.id === item.id);
                return (
                  <Card key={item.id} className="border border-zinc-200/50 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm flex flex-col justify-between">
                    <CardHeader className="pb-3 flex flex-row justify-between items-start space-y-0 gap-3">
                      <div>
                        <Badge variant="outline" className="text-[9px] py-0">{detail ? detail.type.toUpperCase() : "FILE"}</Badge>
                        <CardTitle className="text-sm font-bold text-zinc-950 dark:text-zinc-100 mt-2.5 line-clamp-1">{item.title}</CardTitle>
                      </div>
                      <button onClick={() => toggleBookmark(item.id, "resource", item.title, item.link)} className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20 text-zinc-400 transition-colors cursor-pointer" title={t("إزالة", "Remove")}>
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </CardHeader>
                    <CardContent className="pb-4 pt-1">
                      <p className="text-xs text-zinc-550 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                        {detail ? detail.description : t("مصدر دراسي محفوظ للمراجعة.", "Saved study resource for revision.")}
                      </p>
                      <Link href="/resources">
                        <Button size="sm" variant="outline" className="w-full text-xs font-bold gap-1.5 h-9">
                          {t("عرض في مركز المصادر", "View in Resources Hub")} <ArrowIcon className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <EmptyState
                message={t("لا توجد ملفات أو مصادر محفوظة", "No saved files or resources")}
                hint={t("تصفح مركز الملخصات وأوراق الغش واحفظ ما تحتاجه وقت المراجعة.", "Browse summaries and cheat sheets to bookmark revision materials.")}
                href="/resources"
                cta={t("تصفح المصادر والملخصات", "Browse Resources")}
              />
            )}
          </motion.div>
        )}

        {/* Saved Roadmaps */}
        {activeTab === "roadmaps" && (
          <motion.div key="roadmaps" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedRoadmaps.length > 0 ? (
              savedRoadmaps.map((item) => {
                const mapDetail = ROADMAPS.find((m) => m.id === item.id);
                return (
                  <Card key={item.id} className="border border-zinc-200/50 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm flex flex-col justify-between">
                    <CardHeader className="pb-3 flex flex-row justify-between items-start space-y-0 gap-3">
                      <div>
                        <Badge variant="outline" className="text-[9px] py-0">ROADMAP</Badge>
                        <CardTitle className="text-sm font-bold text-zinc-950 dark:text-zinc-100 mt-2.5 line-clamp-1">{item.title}</CardTitle>
                      </div>
                      <button onClick={() => toggleBookmark(item.id, "roadmap", item.title, item.link)} className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20 text-zinc-400 transition-colors cursor-pointer" title={t("إزالة", "Remove")}>
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </CardHeader>
                    <CardContent className="pb-4 pt-1">
                      <p className="text-xs text-zinc-550 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                        {mapDetail ? mapDetail.description : t("خارطة طريق برمجية لتوجيه التعلم.", "Software roadmap guiding learning path.")}
                      </p>
                      <Link href={item.link}>
                        <Button size="sm" variant="outline" className="w-full text-xs font-bold gap-1.5 h-9">
                          {t("عرض خارطة الطريق", "View Roadmap")} <ArrowIcon className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <EmptyState
                message={t("لا توجد مسارات مهنية محفوظة", "No saved career roadmaps")}
                hint={t("احفظ مسارات Frontend أو Backend أو AI لمواصلة التعلم وتتبع تقدمك.", "Save Frontend, Backend, or AI roadmaps to track learning progress.")}
                href="/roadmaps"
                cta={t("تصفح مسارات خارطة الطريق", "Explore Roadmaps")}
              />
            )}
          </motion.div>
        )}

        {/* Saved Jobs */}
        {activeTab === "jobs" && (
          <motion.div key="jobs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedCareerItems.length > 0 ? (
              savedCareerItems.map((job) => (
                <Card key={job.id} className="border border-zinc-200/50 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm flex flex-col justify-between">
                  <CardHeader className="pb-3 flex flex-row justify-between items-start space-y-0 gap-3">
                    <div>
                      <Badge className="bg-violet-50 text-violet-650 dark:bg-violet-950/40 dark:text-violet-400 text-[10px] font-bold">
                        {typesArabic[job.type] ? t(typesArabic[job.type].ar, typesArabic[job.type].en) : job.type}
                      </Badge>
                      <CardTitle className="text-sm font-bold text-zinc-950 dark:text-zinc-100 mt-2">{job.title}</CardTitle>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-zinc-550 dark:text-zinc-400 font-semibold">
                        <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{job.company}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                      </div>
                    </div>
                    <button onClick={() => toggleSaveJob(job.id)} className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20 text-zinc-400 transition-colors cursor-pointer" title={t("إزالة", "Remove")}>
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </CardHeader>
                  <CardContent className="pb-4 pt-0">
                    <p className="text-xs text-zinc-550 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">{job.description}</p>
                    <a href={job.link} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="w-full text-xs font-bold gap-1.5 h-9">
                        {t("التقديم على الفرصة", "Apply to Opportunity")} <ArrowIcon className="h-3.5 w-3.5" />
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              ))
            ) : (
              <EmptyState
                message={t("لا توجد فرص وظيفية محفوظة", "No saved career opportunities")}
                hint={t("تصفح بوابة التوظيف واحفظ الفرص التي تهمك من تدريب ووظائف وهاكاثونات.", "Browse career portal and save internships, jobs, and hackathons.")}
                href="/careers"
                cta={t("تصفح بوابة التوظيف", "Explore Careers Portal")}
              />
            )}
          </motion.div>
        )}

        {/* Saved Events */}
        {activeTab === "events" && (
          <motion.div key="events" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {savedEventItems.length > 0 ? (
              savedEventItems.map((ev) => (
                <Card key={ev.id} className="border border-zinc-200/50 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm flex flex-col justify-between">
                  <CardHeader className="pb-3 flex flex-row justify-between items-start space-y-0 gap-3">
                    <div>
                      <Badge className="bg-indigo-50 text-indigo-650 dark:bg-indigo-950/40 dark:text-indigo-400 text-[10px] font-bold">
                        {eventTypesArabic[ev.type] ? t(eventTypesArabic[ev.type].ar, eventTypesArabic[ev.type].en) : ev.type}
                      </Badge>
                      <CardTitle className="text-sm font-bold text-zinc-950 dark:text-zinc-100 mt-2 leading-snug">{ev.title}</CardTitle>
                    </div>
                    <button onClick={() => toggleSaveEvent(ev.id)} className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20 text-zinc-400 transition-colors cursor-pointer" title={t("إزالة", "Remove")}>
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </CardHeader>
                  <CardContent className="pb-4 pt-0">
                    <p className="text-xs text-zinc-550 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-3">{ev.description}</p>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-450 font-semibold space-y-1.5 mb-4">
                      <div className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-zinc-400" />{ev.date}</div>
                      <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-zinc-400" />{ev.location}</div>
                    </div>
                    <Link href="/events">
                      <Button size="sm" variant="outline" className="w-full text-xs font-bold gap-1.5 h-9">
                        {t("عرض كل الفعاليات", "View All Events")} <ArrowIcon className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <EmptyState
                message={t("لا توجد فعاليات محفوظة", "No saved events")}
                hint={t("تصفح صفحة الفعاليات الطلابية واحفظ الورش والندوات التي تريد حضورها.", "Browse student events and bookmark workshops and seminars.")}
                href="/events"
                cta={t("تصفح الفعاليات والأنشطة", "Explore Events")}
              />
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
