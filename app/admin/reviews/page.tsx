"use client";

import * as React from "react";
import { useLearning, CourseReview } from "@/context/learning-context";
import { useSocial, CommunityPost } from "@/context/social-context";
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
  User,
  Shield,
  Pin,
  MessageCircle,
  ThumbsUp,
  Paperclip,
  Flame
} from "lucide-react";

export default function ReviewModerationPage() {
  const { t, dir, lang } = useApp();
  const { reviews } = useLearning();
  const { posts, deletePost, reportPost } = useSocial();
  const { logAction, courses } = useAdmin();

  const [activeTab, setActiveTab] = React.useState<"posts" | "reviews">("posts");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("ALL");
  const [courseFilter, setCourseFilter] = React.useState("ALL");
  const [reportedOnly, setReportedOnly] = React.useState(false);

  // Community Posts filtering
  const filteredPosts = React.useMemo(() => {
    return posts.filter((p) => {
      const q = searchTerm.toLowerCase().trim();
      const matchQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.authorEmail.toLowerCase().includes(q);

      const matchCategory = categoryFilter === "ALL" || p.category === categoryFilter;
      const matchReported = !reportedOnly || p.reported;

      return matchQ && matchCategory && matchReported;
    });
  }, [posts, searchTerm, categoryFilter, reportedOnly]);

  // Course Reviews filtering
  const filteredReviews = React.useMemo(() => {
    return reviews.filter((r) => {
      const q = searchTerm.toLowerCase().trim();
      const matchQ =
        !q ||
        r.courseCode.toLowerCase().includes(q) ||
        r.author.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q);

      const matchCourse = courseFilter === "ALL" || r.courseCode === courseFilter;
      return matchQ && matchCourse;
    });
  }, [reviews, searchTerm, courseFilter]);

  const handleDeletePost = (id: string, title: string, author: string) => {
    if (confirm(t(`هل أنت متأكد من حذف منشور الطالب "${author}" بعنوان [${title}] نهائياً؟`, `Permanently delete post "${title}" by ${author}?`))) {
      deletePost(id);
      logAction("حذف منشور بالمنتدى", `تم حذف منشور الطالب ${author} لعدم ملاءمته.`, "review");
    }
  };

  const handleDeleteReview = (id: string, author: string) => {
    if (confirm(t(`هل أنت متأكد من إزالة مراجعة الطالب "${author}" نهائياً؟`, `Permanently delete review by "${author}"?`))) {
      const storageKey = `su_learning_user-admin`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          parsed.reviews = (parsed.reviews || []).filter((r: any) => r.id !== id);
          localStorage.setItem(storageKey, JSON.stringify(parsed));
        } catch (e) {}
      }
      logAction("حذف مراجعة مقرر", `تم حذف مراجعة الطالب ${author} لعدم ملاءمتها.`, "review");
    }
  };

  const reportedPostsCount = React.useMemo(() => posts.filter((p) => p.reported).length, [posts]);

  return (
    <div className="space-y-6 animate-fade-in" dir={dir}>
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5">
            <Shield className="h-6 w-6 text-cyan-500" />
            {t("إدارة ورقابة المنتدى والتقييمات", "Community Forum & Reviews Moderation")}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {t(
              "لوحة التحكم الإدارية لمتابعة تدوينات الطلاب بالمنتدى وحذف المحتوى غير الملائم.",
              "Administrative control panel to monitor student posts, remove reported content, and moderate reviews."
            )}
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-bold py-1.5 px-3 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 gap-1.5">
            <MessageSquare className="h-3.5 w-3.5 text-cyan-500" />
            <span>{posts.length} {t("منشور طلابي", "Posts")}</span>
          </Badge>

          {reportedPostsCount > 0 && (
            <Badge className="text-xs font-bold py-1.5 px-3 bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 gap-1.5 animate-pulse">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>{reportedPostsCount} {t("مبلغ عنها 🚨", "Reported 🚨")}</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <button
          onClick={() => { setActiveTab("posts"); setSearchTerm(""); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === "posts"
              ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          <span>{t("منشورات المنتدى الطلابي", "Student Forum Posts")}</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">{posts.length}</span>
        </button>

        <button
          onClick={() => { setActiveTab("reviews"); setSearchTerm(""); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeTab === "reviews"
              ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
              : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          }`}
        >
          <Star className="h-4 w-4" />
          <span>{t("مراجعات وتقييمات المواد", "Course Reviews")}</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">{reviews.length}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <Card className="border border-zinc-200/50 bg-white dark:bg-zinc-900 shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className={`absolute ${lang === "ar" ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400`} />
            <Input
              type="text"
              placeholder={
                activeTab === "posts"
                  ? t("ابحث بنص المنشور، اسم الكاتب، أو الإيميل...", "Search post text, author name, or email...")
                  : t("ابحث بكود المادة، اسم الطالب، أو نص التعليق...", "Search by course code, student name, or comment...")
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={lang === "ar" ? "pr-10" : "pl-10"}
            />
          </div>

          {activeTab === "posts" ? (
            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-150 cursor-pointer"
              >
                <option value="ALL">{t("جميع الاقسام 💬", "All Categories 💬")}</option>
                <option value="General Discussion">General Discussion</option>
                <option value="Study Help">Study Help</option>
                <option value="Programming">Programming</option>
                <option value="AI">AI</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Career Advice">Career Advice</option>
              </select>

              <Button
                variant={reportedOnly ? "destructive" : "outline"}
                size="sm"
                onClick={() => setReportedOnly(!reportedOnly)}
                className="h-10 text-xs font-bold gap-1.5 cursor-pointer"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                {t("المبلغ عنها فقط", "Reported Only")}
              </Button>
            </div>
          ) : (
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
          )}
        </CardContent>
      </Card>

      {/* Tab 1: Community Posts List */}
      {activeTab === "posts" && (
        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Card key={post.id} className={`border bg-white dark:bg-zinc-900 shadow-sm p-5 space-y-4 transition-all ${post.reported ? "border-red-500/40 bg-red-500/[0.02]" : "border-zinc-200/60 dark:border-zinc-800/60"}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-black text-sm">
                      {post.avatar || "🎓"}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-50">{post.author}</h4>
                        <span className="text-[10px] text-zinc-400 font-mono">({post.authorEmail})</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">{post.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] font-bold border-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                      {post.category}
                    </Badge>

                    {post.reported && (
                      <Badge className="bg-red-500 text-white text-[10px] font-bold gap-1 animate-pulse">
                        <AlertTriangle className="h-3 w-3" />
                        {t("بلاغ مخالفة 🚨", "Reported 🚨")}
                      </Badge>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePost(post.id, post.title, post.author)}
                      className="text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 h-8 px-2.5 cursor-pointer gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {t("حذف المنشور", "Delete Post")}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                </div>

                {/* Footer metadata */}
                <div className="flex items-center justify-between pt-2 text-[11px] text-zinc-400 font-semibold border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3.5 w-3.5 text-zinc-400" />
                      {post.likes.length} {t("إعجاب", "Likes")}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5 text-zinc-400" />
                      {post.comments.length} {t("تعليق", "Comments")}
                    </span>
                  </div>

                  {post.attachmentName && (
                    <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-bold">
                      <Paperclip className="h-3.5 w-3.5" />
                      {post.attachmentName}
                    </span>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <div className="py-12 text-center text-xs text-zinc-400 space-y-2">
              <HelpCircle className="h-8 w-8 mx-auto text-zinc-300 dark:text-zinc-700" />
              <p>{t("لا توجد منشورات بالمنتدى مطابقة لخيارات التصفية", "No forum posts match search filter")}</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Course Reviews List */}
      {activeTab === "reviews" && (
        <div className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((rev) => (
              <Card key={rev.id} className="border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm p-4 space-y-3">
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
                      className="text-[10px] font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 h-8 px-2 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {t("حذف التقييم", "Delete Review")}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
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
            <div className="py-12 text-center text-xs text-zinc-400 space-y-2">
              <HelpCircle className="h-8 w-8 mx-auto text-zinc-300 dark:text-zinc-700" />
              <p>{t("لا توجد تقييمات مطابقة لخيارات التصفية", "No student reviews match search filter")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
