"use client";

import * as React from "react";
import { useLearning, CourseReview } from "@/context/learning-context";
import { useAdmin } from "@/context/admin-context";
import { useApp } from "@/context/app-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  Search,
  Check,
  X,
  Star,
  Trash2,
  AlertTriangle,
  BookmarkCheck,
  HelpCircle,
  Clock,
  User
} from "lucide-react";

export default function ReviewModerationPage() {
  const { t, dir, lang } = useApp();
  const { reviews } = useLearning();
  const { logAction, courses } = useAdmin();

  const [reviewsList, setReviewsList] = React.useState<CourseReview[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [courseFilter, setCourseFilter] = React.useState("ALL");

  React.useEffect(() => {
    setReviewsList(reviews);
  }, [reviews]);

  const handleDeleteReview = (id: string, author: string) => {
    if (confirm(t(`هل أنت متأكد من إزالة مراجعة الطالب "${author}" نهائياً؟`, `Permanently delete review by "${author}"?`))) {
      const updated = reviewsList.filter((r) => r.id !== id);
      setReviewsList(updated);

      const storageKey = `su_learning_user-admin`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          parsed.reviews = updated;
          localStorage.setItem(storageKey, JSON.stringify(parsed));
        } catch (e) {}
      }

      logAction("حذف مراجعة مقرر", `تم حذف مراجعة الطالب ${author} لعدم ملاءمتها.`, "review");
      alert(t("🗑️ تم حذف تقييم الطالب بنجاح.", "🗑️ Student review deleted successfully."));
    }
  };

  const filteredReviews = React.useMemo(() => {
    return reviewsList.filter((r) => {
      const q = searchTerm.toLowerCase().trim();
      const matchQ =
        !q ||
        r.courseCode.toLowerCase().includes(q) ||
        r.author.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q);

      const matchCourse = courseFilter === "ALL" || r.courseCode === courseFilter;
      return matchQ && matchCourse;
    });
  }, [reviewsList, searchTerm, courseFilter]);

  return (
    <div className="space-y-6 animate-fade-in" dir={dir}>
      {/* Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
          {t("رقابة ومراجعة تقييمات الطلاب", "Student Reviews Moderation & Audit")}
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          {t(
            "مراجعة النصائح والتقييمات المرفوعة من الطلاب وحذف التقييمات المخالفة لقواعد السلوك.",
            "Review student feedback and tips, approve ratings, and moderate inappropriate comments."
          )}
        </p>
      </div>

      {/* Controls */}
      <Card className="border border-zinc-200/50 bg-white dark:bg-zinc-900 shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className={`absolute ${lang === "ar" ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400`} />
            <Input
              type="text"
              placeholder={t("ابحث بكود المادة، اسم الطالب، أو نص التعليق...", "Search by course code, student name, or comment...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={lang === "ar" ? "pr-10" : "pl-10"}
            />
          </div>

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-150 cursor-pointer"
          >
            <option value="ALL">{t("جميع المقررات 📚", "All Courses 📚")}</option>
            {courses.map((c) => (
              <option key={c.code} value={c.code}>{c.code} - {t(c.arabic, c.english)}</option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((rev) => (
            <Card key={rev.id} className="border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold text-xs">
                    {rev.author[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-50">{rev.author}</h4>
                    <span className="text-[10px] text-zinc-400 block">{rev.date} · {t("المادة:", "Course:")} <strong className="text-zinc-700 dark:text-zinc-300 font-mono">{rev.courseCode}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`h-3.5 w-3.5 ${star <= rev.rating ? "fill-amber-400 text-amber-400" : "text-zinc-200 dark:text-zinc-800"}`} />
                    ))}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteReview(rev.id, rev.author)}
                    className="text-[10px] text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 h-8 px-2 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {t("حذف التقييم", "Delete Review")}
                  </Button>
                </div>
              </div>

              <div className="pt-3 space-y-2 text-xs">
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-semibold">
                  {rev.comment}
                </p>
                <p className="p-3 bg-violet-500/[0.04] border border-violet-500/10 rounded-xl text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  <span className="text-violet-600 dark:text-violet-400 font-bold block mb-0.5">💡 {t("النصيحة الأكاديمية للمذاكرة:", "Study Tip:")}</span>
                  {rev.tips}
                </p>
              </div>
            </Card>
          ))
        ) : (
          <div className="py-12 text-center text-xs text-zinc-400">
            {t("لا توجد تقييمات مطابقة لخيارات التصفية", "No student reviews match search filter")}
          </div>
        )}
      </div>
    </div>
  );
}
