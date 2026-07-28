"use client";

import * as React from "react";
import Link from "next/link";
import { useApp } from "@/context/app-context";
import { ROADMAPS, Roadmap, RoadmapNode } from "@/lib/roadmaps-data";
import { useLearning } from "@/context/learning-context";
import { useAdmin } from "@/context/admin-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Compass,
  Clock,
  BookOpen,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  PlayCircle,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RoadmapsPage() {
  const { t, lang, dir } = useApp();
  const { roadmaps = ROADMAPS } = useAdmin();
  const {
    toggleBookmark,
    isBookmarked,
    toggleRoadmapNode,
    isRoadmapNodeCompleted,
    getRoadmapProgressPercentage,
    addRecentlyViewed
  } = useLearning();

  const [activeRoadmapId, setActiveRoadmapId] = React.useState<string>("frontend");

  const currentRoadmap = React.useMemo(() => {
    return roadmaps.find((r) => r.id === activeRoadmapId) || roadmaps[0] || ROADMAPS[0];
  }, [roadmaps, activeRoadmapId]);

  const progressPercentage = React.useMemo(() => {
    return getRoadmapProgressPercentage(currentRoadmap.id, currentRoadmap.nodes.length);
  }, [currentRoadmap, getRoadmapProgressPercentage]);

  const handleNodeToggle = (nodeId: string) => {
    toggleRoadmapNode(currentRoadmap.id, nodeId);
    const title = lang === "ar" ? currentRoadmap.title : (currentRoadmap.titleEn || currentRoadmap.title);
    addRecentlyViewed(currentRoadmap.id, "roadmap", title, "/roadmaps");
  };

  const bookmarked = isBookmarked(currentRoadmap.id);
  const isRtl = dir === "rtl";

  return (
    <div className="space-y-8 animate-fade-in" dir={dir}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
            {t("مسارات وخارطة طريق التعلّم المهنية", "Professional Career Roadmaps")}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {t(
              "خرائط طريق تفاعلية تربط مناهج الكلية بمتطلبات المهن وسوق العمل البرمجي الفعلي.",
              "Interactive roadmaps connecting university curricula with real-world career requirements."
            )}
          </p>
        </div>
      </div>

      {/* Select buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {roadmaps.map((r) => {
          const percentage = getRoadmapProgressPercentage(r.id, r.nodes.length);
          const roadmapTitle = lang === "ar" ? r.title : (r.titleEn || r.title);
          return (
            <button
              key={r.id}
              onClick={() => setActiveRoadmapId(r.id)}
              className={`p-4 rounded-2xl border ${isRtl ? "text-right" : "text-left"} transition-all cursor-pointer flex flex-col justify-between h-28 ${
                activeRoadmapId === r.id
                  ? "border-violet-500 bg-violet-500/5 text-violet-600 dark:bg-violet-950/20 dark:text-violet-400 shadow-sm"
                  : "border-zinc-200/60 bg-white dark:border-zinc-800/60 dark:bg-zinc-900 text-zinc-700 hover:border-zinc-300 dark:text-zinc-300"
              }`}
            >
              <div>
                <span className="text-[10px] font-bold text-zinc-400 block mb-1">
                  {t("مسار مهني مقترح", "Suggested Career Path")}
                </span>
                <span className="text-xs sm:text-sm font-extrabold line-clamp-1">{roadmapTitle}</span>
              </div>
              <div className="w-full mt-3">
                <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mb-1">
                  <span>{t("نسبة الإكمال:", "Completion:")}</span>
                  <span>{percentage}%</span>
                </div>
                <Progress value={percentage} className="h-1 bg-zinc-150 dark:bg-zinc-800" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Roadmap Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Vertical Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 gap-4 space-y-0">
              <div>
                <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                  {lang === "ar" ? currentRoadmap.title : (currentRoadmap.titleEn || currentRoadmap.title)}
                </CardTitle>
                <CardDescription className="text-xs mt-1 text-zinc-500 dark:text-zinc-400">
                  {lang === "ar" ? currentRoadmap.description : (currentRoadmap.descriptionEn || currentRoadmap.description)}
                </CardDescription>
              </div>

              <button
                onClick={() => {
                  const title = lang === "ar" ? currentRoadmap.title : (currentRoadmap.titleEn || currentRoadmap.title);
                  toggleBookmark(currentRoadmap.id, "roadmap", title, `/roadmaps`);
                }}
                className="p-2 rounded-xl border border-zinc-200 text-zinc-400 hover:text-violet-600 dark:border-zinc-800 dark:hover:bg-zinc-950 cursor-pointer shrink-0"
                title={bookmarked ? t("إلغاء الحفظ", "Remove Bookmark") : t("حفظ المسار", "Bookmark Roadmap")}
              >
                {bookmarked ? (
                  <BookmarkCheck className="h-4.5 w-4.5 text-violet-600 dark:text-violet-400" />
                ) : (
                  <Bookmark className="h-4.5 w-4.5" />
                )}
              </button>
            </CardHeader>

            <CardContent className="pt-6 relative">
              {/* Timeline Vertical Line */}
              <div className={`absolute ${isRtl ? "right-9" : "left-9"} top-8 bottom-8 w-0.5 bg-zinc-100 dark:bg-zinc-800/80 pointer-events-none`} />

              <div className="space-y-8">
                {currentRoadmap.nodes.map((node, index) => {
                  const nodeCompleted = isRoadmapNodeCompleted(currentRoadmap.id, node.id);
                  const nodeLabel = lang === "ar" ? node.label : (node.labelEn || node.label);
                  const nodeDesc = lang === "ar" ? node.description : (node.descriptionEn || node.description);
                  const nodeDuration = lang === "ar" ? node.duration : (node.durationEn || node.duration);

                  return (
                    <div key={node.id} className="flex gap-6 items-start relative z-10">
                      {/* Node Bullet Checkbox */}
                      <button
                        onClick={() => handleNodeToggle(node.id)}
                        className={`h-7.5 w-7.5 rounded-full flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
                          nodeCompleted
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "bg-white border-zinc-300 hover:border-violet-500 text-transparent dark:bg-zinc-950 dark:border-zinc-800"
                        }`}
                      >
                        {nodeCompleted ? <CheckCircle2 className="h-4.5 w-4.5" /> : <div className="h-2 w-2 rounded-full bg-zinc-200 dark:bg-zinc-800" />}
                      </button>

                      {/* Node Details Card */}
                      <div className="flex-1 p-4.5 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-850/40 rounded-2xl space-y-3">
                        <div className="flex flex-wrap justify-between items-start gap-2.5">
                          <div>
                            <span className="text-[9px] font-bold text-violet-600 dark:text-violet-400 block">
                              {t("المرحلة", "Stage")} {index + 1}
                            </span>
                            <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">{nodeLabel}</h4>
                          </div>
                          <Badge variant="outline" className="text-[9px] py-0 font-bold">{nodeDuration}</Badge>
                        </div>

                        <p className="text-[11px] text-zinc-600 dark:text-zinc-350 leading-relaxed">
                          {nodeDesc}
                        </p>

                        {/* Connected university courses */}
                        {node.courseCodes && node.courseCodes.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2 border-t border-zinc-200/60 dark:border-zinc-800/60 pt-3">
                            <span className="text-[9px] font-bold text-zinc-400">
                              {t("مقررات مرتبطة في الكلية:", "Related university courses:")}
                            </span>
                            {node.courseCodes.map((code) => (
                              <Link href={`/courses/${code}`} key={code}>
                                <Badge className="bg-zinc-200/60 text-zinc-700 hover:bg-violet-100 hover:text-violet-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-violet-950/40 text-[8px] py-0 cursor-pointer font-mono">
                                  {code}
                                </Badge>
                              </Link>
                            ))}
                          </div>
                        )}

                        {/* Recommended study materials */}
                        <div className="space-y-1.5 pt-2">
                          <span className="text-[9px] font-bold text-zinc-400 block">
                            {t("مصادر مقترحة للتعلم:", "Recommended learning resources:")}
                          </span>
                          <div className="space-y-1">
                            {node.resources.map((res, rIdx) => {
                              const resTitle = lang === "ar" ? res.title : (res.titleEn || res.title);
                              return (
                                <a
                                  key={rIdx}
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-700 hover:text-violet-600 dark:text-zinc-300 dark:hover:text-violet-400 transition-colors"
                                >
                                  <PlayCircle className="h-3.5 w-3.5 text-zinc-400" />
                                  <span>{resTitle}</span>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 shadow-sm text-center">
            <CardContent className="pt-8 pb-6">
              <h3 className="text-zinc-600 dark:text-zinc-400 font-bold text-sm">
                {t("معدل تقدمك الإجمالي", "Your Overall Progress")}
              </h3>
              <div className="text-5xl font-black text-violet-600 dark:text-violet-400 mt-4.5">
                {progressPercentage}%
              </div>
              <Badge className="mt-3 bg-violet-50 text-violet-600 border-transparent text-xs py-1 px-3 dark:bg-violet-950/40 dark:text-violet-400 font-bold">
                {progressPercentage === 100
                  ? t("مكتمل بالكامل 👑", "Fully Complete 👑")
                  : progressPercentage >= 50
                  ? t("تقدم رائع 👍", "Great Progress 👍")
                  : t("قيد البداية", "Getting Started")}
              </Badge>

              <div className={`mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 ${isRtl ? "text-right" : "text-left"} space-y-4`}>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {t("مدة المسار الكلية:", "Total Roadmap Duration:")}
                  </span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">
                    {lang === "ar" ? currentRoadmap.duration : (currentRoadmap.durationEn || currentRoadmap.duration)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {t("المراحل المكتملة:", "Completed Stages:")}
                  </span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">
                    {(currentRoadmap.nodes.filter(n => isRoadmapNodeCompleted(currentRoadmap.id, n.id))).length} {t("من", "of")} {currentRoadmap.nodes.length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
