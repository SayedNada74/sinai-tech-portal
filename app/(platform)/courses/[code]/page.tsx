"use client";

import * as React from "react";
import Link from "next/link";
import { useApp } from "@/context/app-context";
import { PERIODS } from "@/lib/courses-data";
import { RESOURCES, Resource } from "@/lib/resources-data";
import { useLearning, CourseReview } from "@/context/learning-context";
import { useAuth } from "@/context/auth-context";
import { useAdmin } from "@/context/admin-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  GraduationCap,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Download,
  Users,
  Star,
  FileText,
  ThumbsUp,
  Trash2,
  Bookmark,
  BookmarkCheck,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ChevronLeft
} from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface PageProps {
  params: Promise<{ code: string }>;
}

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

export default function CourseDetailPage({ params }: PageProps) {
  const { t, lang, dir, userRole } = useApp();
  const resolvedParams = React.use(params);
  const code = decodeURIComponent(resolvedParams.code);

  const { user } = useAuth();
  const { courses } = useAdmin();
  const course = courses.find((c) => c.code.toLowerCase() === code.toLowerCase());

  const {
    isBookmarked,
    toggleBookmark,
    reviews,
    addReview,
    deleteReview,
    toggleHelpfulReview,
    incrementDownload,
    addRecentlyViewed
  } = useLearning();

  // Record recently viewed upon mounting
  React.useEffect(() => {
    if (course) {
      addRecentlyViewed(course.code, "course", course.arabic, `/courses/${course.code}`);
    }
  }, [course]);

  // Form states for adding review
  const [showReviewForm, setShowReviewForm] = React.useState(false);
  const [rating, setRating] = React.useState(5);
  const [difficulty, setDifficulty] = React.useState(3);
  const [workload, setWorkload] = React.useState(3);
  const [examDiff, setExamDiff] = React.useState(3);
  const [attendance, setAttendance] = React.useState(true);
  const [comment, setComment] = React.useState("");
  const [tips, setTips] = React.useState("");
  const [isSubmittingReview, setIsSubmittingReview] = React.useState(false);

  const isRtl = dir === "rtl";
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  if (!course) {
    return (
      <div className="text-center py-20" dir={dir}>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {t("لم يتم العثور على المقرر الدراسي المطلوب.", "Course not found.")}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          {t("يرجى التأكد من صحة كود المادة في الرابط.", "Please verify the course code in the URL.")}
        </p>
        <Link href="/courses" className="inline-block mt-6">
          <Button variant="outline">
            {t("العودة لمستكشف المواد", "Back to Course Explorer")}
          </Button>
        </Link>
      </div>
    );
  }

  // Related Courses (courses in same department, up to 3)
  const relatedCourses = courses.filter(
    (c) => c.department === course.department && c.code !== course.code
  ).slice(0, 3);

  // Dynamic resources belonging to this specific course
  const courseResources = RESOURCES.filter(
    (r) => r.courseCode.toLowerCase() === course.code.toLowerCase()
  );

  // Dynamic reviews belonging to this course
  const courseReviews = reviews.filter(
    (r) => r.courseCode.toLowerCase() === course.code.toLowerCase()
  );

  // Calculations for average rating
  const avgRating = React.useMemo(() => {
    if (courseReviews.length === 0) return 4.0;
    const total = courseReviews.reduce((sum, r) => sum + r.rating, 0);
    return Number((total / courseReviews.length).toFixed(1));
  }, [courseReviews]);

  const bookmarked = isBookmarked(course.code);

  const { toast } = useToast();

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast(t("يرجى تسجيل الدخول أولاً لتتمكن من كتابة مراجعة للمادة.", "Please sign in first to submit a course review."), "info");
      return;
    }
    if (isSubmittingReview) return;

    if (!comment.trim() || !tips.trim()) {
      toast(t("⚠️ يرجى كتابة تعليقك ونصيحتك الأكاديمية لمساعدة زملائك.", "⚠️ Please write your review and study tips to help your peers."), "error");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const success = await addReview(course.code, {
        rating,
        difficulty,
        workload,
        examDifficulty: examDiff,
        attendance,
        comment: comment.trim(),
        tips: tips.trim()
      });

      if (success !== false) {
        setComment("");
        setTips("");
        setShowReviewForm(false);
        toast(t("✨ تم نشر مراجعتك بنجاح! شكرًا لك على مساهمتك القيمة.", "✨ Your review has been published successfully! Thank you for your feedback."), "success");
      } else {
        toast(t("حدث خطأ أو تم إرسال المراجعة مسبقاً.", "An error occurred or review already submitted."), "error");
      }
    } catch (err) {
      toast(t("فشل نشر المراجعة. حاول مرة أخرى.", "Failed to publish review. Please try again."), "error");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "book":
        return <BookOpen className="h-4.5 w-4.5 text-indigo-500" />;
      case "github":
        return <FileText className="h-4.5 w-4.5 text-emerald-500" />;
      default:
        return <FileText className="h-4.5 w-4.5 text-red-500" />;
    }
  };

  const outcomesList = lang === "ar" ? course.outcomes : (course.outcomesEn || course.outcomes);
  const courseDesc = lang === "ar" ? course.description : (course.descriptionEn || course.description);

  return (
    <div className="space-y-8" dir={dir}>
      {/* Back button */}
      <div className="flex justify-between items-center">
        <Link href="/courses" className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
          <BackArrow className="h-4 w-4" />
          {t("العودة لمستكشف المواد", "Back to Course Explorer")}
        </Link>

        {/* Course Bookmark */}
        <button
          onClick={() => {
            if (!user) {
              toast(t("يرجى تسجيل الدخول أولاً لحفظ المادة في قائمتك المفضلة.", "Please sign in to bookmark courses."), "info");
              return;
            }
            toggleBookmark(course.code, "course", course.arabic, `/courses/${course.code}`);
          }}
          className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
            bookmarked
              ? "bg-violet-600 border-violet-600 text-white hover:bg-violet-700 shadow-sm"
              : "border-violet-500/40 dark:border-violet-500/40 bg-violet-500/10 dark:bg-violet-500/15 hover:bg-violet-500/20 dark:hover:bg-violet-500/25 text-violet-600 dark:text-violet-400 hover:border-violet-600 dark:hover:border-violet-400"
          }`}
        >
          {bookmarked ? (
            <BookmarkCheck className="h-4 w-4 text-white stroke-[2.4]" />
          ) : (
            <Bookmark className="h-4 w-4 text-violet-600 dark:text-violet-400 stroke-[2.4]" />
          )}
          <span>{bookmarked ? t("محفوظة في المفضلة", "Bookmarked") : t("حفظ المادة", "Bookmark Course")}</span>
        </button>
      </div>

      {/* Main Header Card */}
      <Card className="border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 overflow-hidden relative shadow-sm">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <CardContent className="pt-8 pb-7 px-6 sm:px-8 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap gap-2.5 items-center">
                <Badge variant="outline" className="text-xs font-bold py-0.5 px-3">
                  {course.code}
                </Badge>
                <Badge
                  className={`text-[10px] py-0.5 px-2.5 border-transparent ${
                    course.difficulty === "easy"
                      ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                      : course.difficulty === "hard"
                      ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                  }`}
                >
                  {course.difficulty === "easy" ? t("سهل", "Easy") : course.difficulty === "hard" ? t("صعب", "Hard") : t("متوسط", "Medium")}
                </Badge>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50 mt-4">
                {t(course.arabic, course.english)}
              </h1>
              {lang === "ar" && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  {course.english}
                </p>
              )}
            </div>

            <div className={`flex gap-4 ${isRtl ? "sm:border-r sm:pr-8" : "sm:border-l sm:pl-8"} border-zinc-100 dark:border-zinc-800 shrink-0 ${isRtl ? "text-right" : "text-left"}`}>
              <div>
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 block">
                  {t("الساعات المعتمدة", "Credit Hours")}
                </span>
                <span className="text-lg font-black text-zinc-800 dark:text-zinc-100">
                  {course.credits} {t("ساعة", "Hours")}
                </span>
              </div>
              <div className="mx-2">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 block">
                  {t("الفصل المقترح", "Suggested Term")}
                </span>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-150">
                  {lang === "ar" ? (PERIODS[course.period] || course.period) : (PERIODS_EN[course.period] || course.period)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Areas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <Card className="border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
                <BookOpen className="h-4.5 w-4.5 text-zinc-400 dark:text-zinc-500" />
                {t("وصف المقرر الدراسي", "Course Description")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {courseDesc}
              </p>
            </CardContent>
          </Card>

          {/* Learning Outcomes */}
          <Card className="border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
                <GraduationCap className="h-4.5 w-4.5 text-zinc-400 dark:text-zinc-500" />
                {t("مخرجات التعلم المستهدفة", "Intended Learning Outcomes")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {outcomesList.map((outcome, index) => (
                  <li key={index} className="flex gap-3 text-xs text-zinc-700 dark:text-zinc-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-600 dark:bg-violet-400 mt-2 shrink-0" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Dynamic Resources list */}
          <Card className="border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                {t("المصادر والمراجع المساعدة", "Supporting Resources & References")}
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                {t("الملفات والشروحات المرتبطة بالمقرر مباشرة.", "Files and materials directly related to this course.")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {courseResources.length > 0 ? (
                courseResources.map((res) => (
                  <div key={res.id} className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-150/60 dark:border-zinc-850/60 rounded-xl">
                    <div className="flex items-center gap-2.5">
                      {getIcon(res.type)}
                      <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{res.title}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        incrementDownload(res.id);
                        toast(t(`📥 جاري تحميل المستند: "${res.title}"...`, `📥 Downloading document: "${res.title}"...`), "info");
                      }}
                      className="h-8 gap-1.5 text-[10px] text-zinc-500 hover:text-violet-600 dark:hover:text-violet-400"
                    >
                      <Download className="h-3.5 w-3.5" />
                      {t("تحميل", "Download")}
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-zinc-400 dark:text-zinc-500">
                  {t(
                    "لا توجد مصادر دراسية مضافة لهذه المادة بعد. يمكنك إضافة مصادر من صفحة المصادر.",
                    "No study resources added for this course yet."
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Interactive Reviews Hub */}
          <Card className="border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 shadow-sm">
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
                  <MessageSquare className="h-4.5 w-4.5 text-zinc-400 dark:text-zinc-500" />
                  {t(`مراجعات وتجارب الطلاب (${courseReviews.length})`, `Student Reviews & Experiences (${courseReviews.length})`)}
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                  {t("تجارب حية ونصائح من زملائك الذين اجتازوا المادة.", "Real student experiences and tips from peers who took this course.")}
                </CardDescription>
              </div>

              {user ? (
                <Button size="sm" className="text-xs font-bold" onClick={() => setShowReviewForm(!showReviewForm)}>
                  {t("كتابة مراجعة", "Write Review")}
                </Button>
              ) : (
                <Link href="/auth/login">
                  <Button size="sm" variant="outline" className="text-xs font-bold gap-1 text-violet-600 dark:text-violet-400 border-violet-500/30 hover:bg-violet-50 dark:hover:bg-violet-950/30">
                    <span>{t("تسجيل الدخول للمشاركة 💬", "Sign In to Review 💬")}</span>
                  </Button>
                </Link>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Review Entry Form (Only for logged-in students) */}
              {user && showReviewForm && (
                <form onSubmit={handleSubmitReview} className="p-5 border border-dashed border-zinc-250 dark:border-zinc-800 rounded-2xl space-y-4 bg-zinc-50/50 dark:bg-zinc-950/40">
                  <h4 className="font-extrabold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-violet-500" />
                    {t("أضف مراجعتك الأكاديمية الصادقة", "Add Your Academic Review")}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Stars */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 block">
                        {t("تقييم المادة الكلي (نجوم)", "Overall Course Rating (Stars)")}
                      </span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} type="button" onClick={() => setRating(star)} className="p-0.5 cursor-pointer">
                            <Star className={`h-4.5 w-4.5 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-zinc-300 dark:text-zinc-700"}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Difficulty Slider */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 block">
                        {t(`مستوى صعوبة المادة: ${difficulty} / 5`, `Course Difficulty: ${difficulty} / 5`)}
                      </span>
                      <input type="range" min="1" max="5" value={difficulty} onChange={(e) => setDifficulty(Number(e.target.value))} className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-800 accent-violet-600" />
                    </div>

                    {/* Workload Slider */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 block">
                        {t(`كمية التكليفات والمهام: ${workload} / 5`, `Workload & Assignments: ${workload} / 5`)}
                      </span>
                      <input type="range" min="1" max="5" value={workload} onChange={(e) => setWorkload(Number(e.target.value))} className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-800 accent-violet-600" />
                    </div>

                    {/* Exam Difficulty */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 block">
                        {t(`صعوبة الامتحانات: ${examDiff} / 5`, `Exam Difficulty: ${examDiff} / 5`)}
                      </span>
                      <input type="range" min="1" max="5" value={examDiff} onChange={(e) => setExamDiff(Number(e.target.value))} className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-800 accent-violet-600" />
                    </div>

                    {/* Attendance */}
                    <div className="space-y-1 col-span-2">
                      <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 block">
                        {t("هل الحضور والغياب يؤثر في الدرجات؟", "Does attendance affect grades?")}
                      </span>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                          <input type="radio" checked={attendance === true} onChange={() => setAttendance(true)} className="text-violet-600 focus:ring-0" />
                          {t("نعم، إلزامي", "Yes, Mandatory")}
                        </label>
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                          <input type="radio" checked={attendance === false} onChange={() => setAttendance(false)} className="text-violet-600 focus:ring-0" />
                          {t("لا، اختياري", "No, Optional")}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 block">
                      {t("تجربتك الشخصية مع المادة", "Your Personal Experience")}
                    </span>
                    <Input type="text" placeholder={t("اكتب بالتفصيل عن شرح المحاضر، طريقة توزيع الدرجات...", "Write in detail about teaching, grade distribution...")} value={comment} onChange={(e) => setComment(e.target.value)} className="text-xs" />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 block">
                      {t("نصائح دراسية للاجتياز بتقدير مرتفع", "Study Tips to Ace the Course")}
                    </span>
                    <Input type="text" placeholder={t("مثال: يفضل حل امتحانات الميدتيرم السابقة...", "Example: Focus on past midterm exams...")} value={tips} onChange={(e) => setTips(e.target.value)} className="text-xs" />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowReviewForm(false)} className="text-xs">
                      {t("إلغاء", "Cancel")}
                    </Button>
                    <Button type="submit" size="sm" className="text-xs font-bold" isLoading={isSubmittingReview} disabled={isSubmittingReview}>
                      {t("نشر المراجعة", "Submit Review")}
                    </Button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {courseReviews.length > 0 ? (
                  courseReviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-200/40 dark:border-zinc-850/50 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center gap-3">
                        {rev.authorId ? (
                          <Link href={`/profile/${rev.authorId}`} className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
                            <div className="h-7 w-7 rounded-lg bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center text-xs font-bold group-hover:bg-violet-200 dark:group-hover:bg-violet-900/50">
                              {rev.author[0]}
                            </div>
                            <div>
                              <h5 className="font-bold text-xs text-zinc-800 dark:text-zinc-200 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{rev.author}</h5>
                              <span className="text-[9px] text-zinc-400 dark:text-zinc-500 block">{rev.date}</span>
                            </div>
                          </Link>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-lg bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center text-xs font-bold">
                              {rev.author[0]}
                            </div>
                            <div>
                              <h5 className="font-bold text-xs text-zinc-800 dark:text-zinc-200">{rev.author}</h5>
                              <span className="text-[9px] text-zinc-400 dark:text-zinc-500 block">{rev.date}</span>
                            </div>
                          </div>
                        )}

                        {/* Stars */}
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={`h-3 w-3 ${star <= rev.rating ? "fill-amber-400 text-amber-400" : "text-zinc-200 dark:text-zinc-800"}`} />
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-2.5 border-y border-zinc-150/45 dark:border-zinc-850/30 text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
                        <div>{t("الصعوبة:", "Difficulty:")} <Badge variant="outline" className="text-[9px] py-0 px-1.5">{rev.difficulty}/5</Badge></div>
                        <div>{t("العبء الدراسي:", "Workload:")} <Badge variant="outline" className="text-[9px] py-0 px-1.5">{rev.workload}/5</Badge></div>
                        <div>{t("أهمية الحضور:", "Attendance:")} <Badge variant="outline" className="text-[9px] py-0 px-1.5">{rev.attendance ? t("إلزامي", "Mandatory") : t("اختياري", "Optional")}</Badge></div>
                        <div>{t("صعوبة الامتحان:", "Exams:")} <Badge variant="outline" className="text-[9px] py-0 px-1.5">{rev.examDifficulty}/5</Badge></div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-semibold">
                          <span className="text-[9px] text-zinc-400 dark:text-zinc-500 block mb-0.5">{t("التجربة الشخصية:", "Personal Experience:")}</span>
                          {rev.comment}
                        </p>
                        <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-semibold p-3.5 bg-violet-500/[0.03] border border-violet-500/10 rounded-xl">
                          <span className="text-[9px] text-violet-600 dark:text-violet-400 font-black block mb-1">💡 {t("نصيحة للمذاكرة:", "Study Tip:")}</span>
                          {rev.tips}
                        </p>
                      </div>

                      {/* Review Actions Footer: Delete (Author/Admin) & Helpful upvote */}
                      <div className="flex justify-between items-center pt-1">
                        {(user?.id === rev.authorId || userRole === "admin" || userRole === "super-admin") ? (
                          <button
                            onClick={async () => {
                              if (confirm(t("هل أنت متأكد من حذف هذه المراجعة؟", "Are you sure you want to delete this review?"))) {
                                await deleteReview(rev.id);
                                toast(t("تم حذف المراجعة بنجاح.", "Review deleted successfully."), "success");
                              }
                            }}
                            className="flex items-center gap-1 text-[10px] font-bold text-red-500/80 hover:text-red-600 transition-colors cursor-pointer"
                            title={t("حذف المراجعة", "Delete Review")}
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>{t("حذف", "Delete")}</span>
                          </button>
                        ) : <div />}

                        {/* Helpful upvote */}
                        <button
                          onClick={() => toggleHelpfulReview(rev.id)}
                          className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 cursor-pointer"
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                          <span>{t(`مفيدة (${rev.helpfulCount})`, `Helpful (${rev.helpfulCount})`)}</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-zinc-400 dark:text-zinc-500">
                    {t("لا توجد مراجعات مضافة بعد. كن أول من يشارك تجربته مع زملائه!", "No reviews added yet. Be the first to share your experience!")}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info Areas */}
        <div className="space-y-6">
          {/* Prerequisites */}
          <Card className="border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 shadow-sm">
            <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
              <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{t("المتطلبات السابقة", "Prerequisites")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {course.prerequisites.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {course.prerequisites.map((pre) => (
                    <Link href={`/courses/${pre}`} key={pre}>
                      <Badge className="bg-zinc-100 text-zinc-700 hover:bg-violet-50 hover:text-violet-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-violet-950/40 dark:hover:text-violet-400 cursor-pointer text-xs">
                        {pre}
                      </Badge>
                    </Link>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  {t("لا يوجد متطلبات سابقة لهذا المقرر.", "No prerequisites for this course.")}
                </span>
              )}
            </CardContent>
          </Card>

          {/* Related Courses */}
          <Card className="border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 shadow-sm">
            <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
              <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{t("مقررات ذات صلة", "Related Courses")}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3.5">
              {relatedCourses.map((rc) => (
                <Link href={`/courses/${rc.code}`} key={rc.code} className="block group">
                  <h4 className="font-bold text-xs text-zinc-700 group-hover:text-violet-600 dark:text-zinc-300 dark:group-hover:text-violet-400 transition-colors">
                    {t(rc.arabic, rc.english)}
                  </h4>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">{rc.code} · {rc.credits} {t("ساعات", "Credits")}</p>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Instructor & Reviews summary */}
          <Card className="border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 shadow-sm">
            <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
                <Users className="h-4.5 w-4.5 text-zinc-400 dark:text-zinc-500" />
                {t("المحاضرون والتقييمات", "Department & Ratings")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 block mb-1">
                  {t("القسم والأقسام الأكاديمية:", "Department:")}
                </span>
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {t(`قسم ${course.department} - كلية الحاسبات والمعلومات`, `${course.department} Department - Faculty of Computers & IT`)}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 block mb-1.5">
                  {t("تقييم الطلاب الفعلي:", "Student Rating:")}
                </span>
                <div className="flex items-center gap-1.5">
                  <Star className="h-4.5 w-4.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-black text-zinc-800 dark:text-zinc-200">{avgRating} / 5</span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500">({courseReviews.length} {t("تقييمات", "reviews")})</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
