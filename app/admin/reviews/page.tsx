"use client";

import * as React from"react";
import Link from"next/link";
import { useLearning, CourseReview } from"@/context/learning-context";
import { useSocial, CommunityPost } from"@/context/social-context";
import { useAdmin } from"@/context/admin-context";
import { useApp } from "@/context/app-context";
import { getLocalizedUserName } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from"@/components/ui/card";
import { Badge } from"@/components/ui/badge";
import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
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
  Flame,
  ChevronDown,
  ChevronUp,
  CornerDownLeft,
  Users as UsersIcon
} from"lucide-react";

export default function ReviewModerationPage() {
  const { t, dir, lang } = useApp();
  const { reviews, deleteReview } = useLearning();
  const { posts, deletePost, reportPost, deleteComment, deleteReply } = useSocial();
  const { logAction, courses, users } = useAdmin();

  const [activeTab, setActiveTab] = React.useState<"posts" |"reviews">("posts");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("ALL");
  const [courseFilter, setCourseFilter] = React.useState("ALL");
  const [reportedOnly, setReportedOnly] = React.useState(false);

  // Expanded states for moderation inspection
  const [expandedComments, setExpandedComments] = React.useState<Record<string, boolean>>({});
  const [expandedLikes, setExpandedLikes] = React.useState<Record<string, boolean>>({});

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleLikes = (postId: string) => {
    setExpandedLikes(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const getAuthorDisplayName = (authorEmail?: string, fallbackAuthor?: string) => {
    const target = users.find(u => u.email?.toLowerCase().trim() === authorEmail?.toLowerCase().trim());
    let raw = "";
    if (target) {
      raw = getLocalizedUserName(target, lang);
    } else {
      raw = getLocalizedUserName(fallbackAuthor, lang);
    }
    const parts = raw.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0]} ${parts[1]}`;
    }
    return raw || (lang === "ar" ? "طالب" : "Student");
  };

  const renderAvatar = (avatar: string | undefined, fallback: string ="") => {
    const isImg = avatar && (avatar.startsWith("data:image/") || avatar.startsWith("http"));
    if (isImg) {
      return <img src={avatar} alt="" className="h-full w-full object-cover rounded-lg" />;
    }
    return <span>{avatar || fallback}</span>;
  };

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

      const matchCategory = categoryFilter ==="ALL" || p.category === categoryFilter;
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

      const matchCourse = courseFilter ==="ALL" || r.courseCode === courseFilter;
      return matchQ && matchCourse;
    });
  }, [reviews, searchTerm, courseFilter]);

  const handleDeletePost = (id: string, title: string, author: string) => {
    if (confirm(t(`هل أنت متأكد من حذف منشور الطالب"${author}" بعنوان [${title}] نهائياً؟`, `Permanently delete post"${title}" by ${author}?`))) {
      deletePost(id);
      logAction("حذف منشور بالمنتدى", `تم حذف منشور الطالب ${author} لعدم ملاءمته.`,"review");
    }
  };

  const handleDeleteComment = (postId: string, commentId: string, author: string) => {
    if (confirm(t(`هل تريد بالتأكيد حذف تعليق الطالب"${author}"؟`, `Delete comment by"${author}"?`))) {
      deleteComment(postId, commentId);
      logAction("حذف تعليق بالمنتدى", `تم حذف تعليق الطالب ${author} من المنشور.`,"review");
    }
  };

  const handleDeleteReply = (postId: string, commentId: string, replyId: string, author: string) => {
    if (confirm(t(`هل تريد بالتأكيد حذف رد الطالب"${author}"؟`, `Delete reply by"${author}"?`))) {
      deleteReply(postId, commentId, replyId);
      logAction("حذف رد بالمنتدى", `تم حذف رد الطالب ${author} من التعليق.`,"review");
    }
  };

  const handleDeleteReview = async (id: string, author: string) => {
    if (confirm(t(`هل أنت متأكد من إزالة مراجعة الطالب"${author}" نهائياً؟`, `Permanently delete review by"${author}"?`))) {
      await deleteReview(id);
      logAction("حذف مراجعة مقرر", `تم حذف مراجعة الطالب ${author} لعدم ملاءمتها.`,"review");
    }
  };

  const reportedPostsCount = React.useMemo(() => posts.filter((p) => p.reported).length, [posts]);

  return (
    <div className="space-y-6 animate-fade-in" dir={dir}>
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5">
            <Shield className="h-6 w-6 text-primary shrink-0" />
            <span>{t("إدارة ورقابة المنتدى والتقييمات","Community Forum & Reviews Moderation")}</span>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {t("لوحة التحكم الإدارية لمتابعة تدوينات الطلاب، فحص التفاعلات، ومراجعة وحذف التعليقات غير الملائمة.","Administrative control panel to monitor posts, inspect reactions, and moderate or delete comments and replies."
            )}
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-xs font-bold py-1.5 px-3 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 gap-1.5">
            <MessageSquare className="h-3.5 w-3.5 text-primary" />
            <span>{posts.length} {t("منشور طلابي","Posts")}</span>
          </Badge>

          {reportedPostsCount > 0 && (
            <Badge className="text-xs font-bold py-1.5 px-3 bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 gap-1.5 animate-pulse">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>{reportedPostsCount} {t("مبلغ عنها","Reported")}</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 overflow-x-auto scrollbar-none flex-nowrap sm:flex-wrap">
        <button
          onClick={() => { setActiveTab("posts"); setSearchTerm(""); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shrink-0 ${activeTab ==="posts"
              ?"bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
              :"text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            }`}
        >
          <MessageCircle className="h-4 w-4" />
          <span>{t("منشورات المنتدى الطلابي","Student Forum Posts")}</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">{posts.length}</span>
        </button>

        <button
          onClick={() => { setActiveTab("reviews"); setSearchTerm(""); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shrink-0 ${activeTab ==="reviews"
              ?"bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
              :"text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            }`}
        >
          <Star className="h-4 w-4" />
          <span>{t("مراجعات وتقييمات المواد","Course Reviews")}</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">{reviews.length}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <Card className="border border-zinc-200/50 bg-white dark:bg-zinc-900 shadow-sm">
        <CardContent className="p-3 sm:p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className={`absolute ${lang ==="ar" ?"right-3.5" :"left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400`} />
            <Input
              type="text"
              placeholder={
                activeTab ==="posts"
                  ? t("ابحث بنص المنشور، اسم الكاتب، أو الإيميل...","Search post text, author name, or email...")
                  : t("ابحث بكود المادة، اسم الطالب، أو نص التعليق...","Search by course code, student name, or comment...")
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={lang ==="ar" ?"pr-10" :"pl-10"}
            />
          </div>

          {activeTab ==="posts" ? (
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-150 cursor-pointer w-full sm:w-auto flex-1"
              >
                <option value="ALL">{t("جميع الاقسام","All Categories")}</option>
                <option value="General Discussion">General Discussion</option>
                <option value="Study Help">Study Help</option>
                <option value="Programming">Programming</option>
                <option value="AI">AI</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Career Advice">Career Advice</option>
              </select>

              <Button
                variant={reportedOnly ?"destructive" :"outline"}
                size="sm"
                onClick={() => setReportedOnly(!reportedOnly)}
                className="h-10 text-xs font-bold gap-1.5 cursor-pointer w-full sm:w-auto justify-center"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                {t("المبلغ عنها فقط","Reported Only")}
              </Button>
            </div>
          ) : (
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-150 cursor-pointer w-full md:w-auto"
            >

              <option value="ALL">{t("جميع المقررات","All Courses")}</option>
              {courses.map((c) => (
                <option key={c.code} value={c.code}>{c.code} - {t(c.arabic, c.english)}</option>
              ))}
            </select>
          )}
        </CardContent>
      </Card>

      {/* Tab 1: Community Posts List */}
      {activeTab ==="posts" && (
        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => {
              const authorUser = users.find(u => u.email?.toLowerCase().trim() === post.authorEmail?.toLowerCase().trim());
              return (
                <Card key={post.id} className={`border bg-white dark:bg-zinc-900 shadow-sm p-5 space-y-4 transition-all ${post.reported ?"border-red-500/40 bg-red-500/[0.02]" :"border-zinc-200/60 dark:border-zinc-800/60"}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-black text-sm overflow-hidden shrink-0">
                        {renderAvatar(post.avatar,"‍🎓")}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {authorUser?.id ? (
                            <Link
                              href={`/profile/${authorUser.id}`}
                              className="font-bold text-xs text-zinc-900 dark:text-zinc-50 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                            >
                              {getAuthorDisplayName(post.authorEmail, post.author)}
                            </Link>
                          ) : (
                            <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-50">
                              {getAuthorDisplayName(post.authorEmail, post.author)}
                            </h4>
                          )}
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
                          {t("بلاغ مخالفة","Reported")}
                        </Badge>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePost(post.id, post.title, post.author)}
                        className="text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 h-8 px-2.5 cursor-pointer gap-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {t("حذف المنشور","Delete Post")}
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

                  {/* Footer metadata & Moderation Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 text-[11px] text-zinc-400 font-semibold border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                      {/* Reactions Toggle */}
                      <button
                        onClick={() => toggleLikes(post.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer border border-zinc-200/50 dark:border-zinc-750"
                        title={t("عرض تفاصيل المعجبين","View reactions")}
                      >
                        <ThumbsUp className="h-3.5 w-3.5 text-primary" />
                        <span>{post.likes.length} {t("إعجاب","Likes")}</span>
                        {expandedLikes[post.id] ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>

                      {/* Comments Moderation Accordion Toggle */}
                      <button
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/30 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 transition-colors cursor-pointer border border-cyan-500/20 font-bold"
                      >
                        <MessageCircle className="h-3.5 w-3.5 text-primary" />
                        <span>{t("التعليقات والردود","Comments & Replies")} ({post.comments.length})</span>
                        {expandedComments[post.id] ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      </button>
                    </div>

                    {post.attachmentName && (
                      <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-bold text-xs">
                        <Paperclip className="h-3.5 w-3.5" />
                        {post.attachmentName}
                      </span>
                    )}
                  </div>

                  {/* Expanded Reactions / Likes Panel */}
                  {expandedLikes[post.id] && (
                    <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/70 dark:border-zinc-800 space-y-2 animate-fade-in text-xs">
                      <h5 className="font-bold text-[11px] text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                        <ThumbsUp className="h-3.5 w-3.5 text-primary" />
                        <span>{t("قائمة المعجبين بالمنشور (اضغط لزيارة الملف الشخصي):","Students who liked this post (click to view profile):")}</span>
                      </h5>
                      {post.likes.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {post.likes.map((email) => {
                            const student = users.find(u => u.email?.toLowerCase().trim() === email.toLowerCase().trim());
                            const displayName = getAuthorDisplayName(email, email);
                            return student?.id ? (
                              <Link
                                key={email}
                                href={`/profile/${student.id}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-bold text-zinc-800 dark:text-zinc-200 shadow-2xs hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all cursor-pointer"
                              >
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                <span>{displayName}</span>
                                <span className="text-[9px] text-zinc-400 font-mono font-normal">({email})</span>
                              </Link>
                            ) : (
                              <span
                                key={email}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-bold text-zinc-800 dark:text-zinc-200 shadow-2xs"
                              >
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                                <span>{displayName}</span>
                                <span className="text-[9px] text-zinc-400 font-mono font-normal">({email})</span>
                              </span>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-[11px] text-zinc-400">{t("لا توجد تفاعلات على هذا المنشور حتى الآن.","No likes on this post yet.")}</p>
                      )}
                    </div>
                  )}

                  {/* Expanded Comments & Replies Moderation Panel */}
                  {expandedComments[post.id] && (
                    <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/70 dark:border-zinc-800 space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between pb-2 border-b border-zinc-200/50 dark:border-zinc-800">
                        <h5 className="font-bold text-xs text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                          <MessageSquare className="h-3.5 w-3.5 text-primary" />
                          <span>{t("إدارة تعليقات وردود الطلاب","Moderate Comments & Replies")} ({post.comments.length})</span>
                        </h5>
                        <span className="text-[10px] text-zinc-400 font-medium">{t("يمكنك حذف أي تعليق أو رد مخالف فوراً","Delete any inappropriate comment directly")}</span>
                      </div>

                      {post.comments.length > 0 ? (
                        <div className="space-y-3">
                          {post.comments.map((comment) => {
                            const commentUser = users.find(u => u.email?.toLowerCase().trim() === comment.authorEmail?.toLowerCase().trim());
                            return (
                              <div key={comment.id} className="space-y-2">
                                {/* Comment Item Card */}
                                <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-2 shadow-2xs">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className="h-7 w-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs overflow-hidden shrink-0">
                                        {renderAvatar(comment.avatar,"")}
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          {commentUser?.id ? (
                                            <Link
                                              href={`/profile/${commentUser.id}`}
                                              className="font-bold text-xs text-zinc-900 dark:text-zinc-100 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                                            >
                                              {getAuthorDisplayName(comment.authorEmail, comment.author)}
                                            </Link>
                                          ) : (
                                            <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                                              {getAuthorDisplayName(comment.authorEmail, comment.author)}
                                            </span>
                                          )}
                                          <span className="text-[9px] text-zinc-400 font-mono">({comment.authorEmail})</span>
                                        </div>
                                        <span className="text-[9px] text-zinc-400 block leading-none mt-0.5">{comment.date}</span>
                                      </div>
                                    </div>

                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteComment(post.id, comment.id, comment.author)}
                                      className="h-7 px-2 text-[10px] font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer gap-1"
                                      title={t("حذف هذا التعليق","Delete this comment")}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                      <span>{t("حذف التعليق","Delete")}</span>
                                    </Button>
                                  </div>

                                  <p className="text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed pr-2 pl-2">
                                    {comment.content}
                                  </p>
                                </div>

                                {/* Nested Replies List */}
                                {comment.replies && comment.replies.length > 0 && (
                                  <div className={`space-y-1.5 ${lang ==="ar" ?"mr-6 border-r-2 pr-3" :"ml-6 border-l-2 pl-3"} border-cyan-500/30`}>
                                    {comment.replies.map((reply) => {
                                      const replyUser = users.find(u => u.email?.toLowerCase().trim() === reply.authorEmail?.toLowerCase().trim());
                                      return (
                                        <div key={reply.id} className="p-2.5 rounded-lg bg-zinc-100/70 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800 space-y-1">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                              <div className="h-5 w-5 rounded bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-[10px] overflow-hidden shrink-0">
                                                {renderAvatar(reply.avatar,"")}
                                              </div>
                                              {replyUser?.id ? (
                                                <Link
                                                  href={`/profile/${replyUser.id}`}
                                                  className="font-bold text-[11px] text-zinc-850 dark:text-zinc-200 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                                                >
                                                  {getAuthorDisplayName(reply.authorEmail, reply.author)}
                                                </Link>
                                              ) : (
                                                <span className="font-bold text-[11px] text-zinc-850 dark:text-zinc-200">
                                                  {getAuthorDisplayName(reply.authorEmail, reply.author)}
                                                </span>
                                              )}
                                              <span className="text-[9px] text-zinc-400 font-mono">({reply.authorEmail})</span>
                                              <span className="text-[9px] text-zinc-400">· {reply.date}</span>
                                            </div>

                                            <button
                                              onClick={() => handleDeleteReply(post.id, comment.id, reply.id, reply.author)}
                                              className="text-[10px] font-black text-red-500 hover:text-red-700 hover:underline cursor-pointer flex items-center gap-0.5"
                                              title={t("حذف هذا الرد","Delete this reply")}
                                            >
                                              <Trash2 className="h-2.5 w-2.5" />
                                              <span>{t("حذف","Delete")}</span>
                                            </button>
                                          </div>
                                          <p className="text-[11px] text-zinc-650 dark:text-zinc-355 whitespace-pre-wrap leading-relaxed pr-1 pl-1">
                                            {reply.content}
                                          </p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-zinc-400 py-3 text-center">{t("لا توجد أي تعليقات على هذا المنشور حتى الآن.","No comments on this post yet.")}</p>
                      )}
                    </div>
                  )}
                </Card>
              );
            })
          ) : (
            <div className="py-12 text-center text-xs text-zinc-400 space-y-2">
              <HelpCircle className="h-8 w-8 mx-auto text-primary dark:text-zinc-700" />
              <p>{t("لا توجد منشورات بالمنتدى مطابقة لخيارات التصفية","No forum posts match search filter")}</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Course Reviews List */}
      {activeTab ==="reviews" && (
        <div className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((rev) => (
              <Card key={rev.id} className="border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-sky-100 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-xs">
                      {rev.author[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-50">{rev.author}</h4>
                      <span className="text-[10px] text-zinc-400 block">{rev.date} · {t("المادة:","Course:")} <strong className="text-zinc-700 dark:text-zinc-300 font-mono">{rev.courseCode}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`h-3.5 w-3.5 ${star <= rev.rating ?"fill-amber-400 text-amber-400" :"text-zinc-200 dark:text-zinc-800"}`} />
                      ))}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteReview(rev.id, rev.author)}
                      className="text-[10px] font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 h-8 px-2 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {t("حذف التقييم","Delete Review")}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-semibold">
                    {rev.comment}
                  </p>
                  <p className="p-3 bg-sky-500/[0.04] border border-sky-500/10 rounded-xl text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    <span className="text-sky-600 dark:text-sky-400 font-bold block mb-0.5"> {t("النصيحة الأكاديمية للمذاكرة:","Study Tip:")}</span>
                    {rev.tips}
                  </p>
                </div>
              </Card>
            ))
          ) : (
            <div className="py-12 text-center text-xs text-zinc-400 space-y-2">
              <HelpCircle className="h-8 w-8 mx-auto text-primary dark:text-zinc-700" />
              <p>{t("لا توجد تقييمات مطابقة لخيارات التصفية","No student reviews match search filter")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
