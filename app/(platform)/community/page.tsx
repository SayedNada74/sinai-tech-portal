"use client";

import * as React from "react";
import { useApp } from "@/context/app-context";
import { useAuth } from "@/context/auth-context";
import { useSocial, CommunityPost, PostComment } from "@/context/social-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  ThumbsUp,
  Flag,
  Trash2,
  Edit,
  Plus,
  Paperclip,
  X,
  FileText,
  CornerDownLeft,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CommunityPage() {
  const { t, lang, dir } = useApp();
  const { user } = useAuth();
  const {
    posts,
    createPost,
    editPost,
    deletePost,
    likePost,
    reportPost,
    addComment,
    addReply,
    deleteComment,
    deleteReply
  } = useSocial();

  const [selectedCategory, setSelectedCategory] = React.useState<string>("الكل");
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState("");
  const [newContent, setNewContent] = React.useState("");
  const [newCategory, setNewCategory] = React.useState<CommunityPost["category"]>("General Discussion");
  const [newFile, setNewFile] = React.useState("");

  // Edit Post states
  const [editingPostId, setEditingPostId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState("");
  const [editContent, setEditContent] = React.useState("");
  const [editCategory, setEditCategory] = React.useState<CommunityPost["category"]>("General Discussion");

  // Comment input state
  const [commentInputs, setCommentInputs] = React.useState<Record<string, string>>({});
  // Reply input state
  const [replyInputs, setReplyInputs] = React.useState<Record<string, string>>({});
  // Expanded comments accordion state
  const [expandedComments, setExpandedComments] = React.useState<Record<string, boolean>>({});

  const categories = [
    "الكل",
    "General Discussion",
    "Study Help",
    "Programming",
    "AI",
    "Web Development",
    "Mobile Development",
    "Career Advice",
    "University News"
  ];

  const categoryArabic: Record<string, { ar: string; en: string }> = {
    "الكل": { ar: "الكل", en: "All" },
    "General Discussion": { ar: "مناقشات عامة", en: "General Discussion" },
    "Study Help": { ar: "مساعدة دراسية", en: "Study Help" },
    "Programming": { ar: "برمجة", en: "Programming" },
    "AI": { ar: "ذكاء اصطناعي", en: "Artificial Intelligence" },
    "Web Development": { ar: "تطوير الويب", en: "Web Development" },
    "Mobile Development": { ar: "تطوير الهواتف", en: "Mobile Development" },
    "Career Advice": { ar: "نصائح مهنية", en: "Career Advice" },
    "University News": { ar: "أخبار الجامعة", en: "University News" }
  };

  const filteredPosts = posts.filter(
    (p) => selectedCategory === "الكل" || p.category === selectedCategory
  );

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    
    createPost(
      newTitle,
      newContent,
      newCategory,
      newFile ? newFile : undefined,
      newFile ? "#/downloads/" + newFile : undefined
    );

    setNewTitle("");
    setNewContent("");
    setNewCategory("General Discussion");
    setNewFile("");
    setIsCreateOpen(false);
  };

  const handleStartEdit = (post: CommunityPost) => {
    setEditingPostId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditCategory(post.category);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPostId || !editTitle.trim() || !editContent.trim()) return;
    editPost(editingPostId, editTitle, editContent, editCategory);
    setEditingPostId(null);
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId] || "";
    if (!text.trim()) return;
    addComment(postId, text);
    setCommentInputs({ ...commentInputs, [postId]: "" });
    setExpandedComments({ ...expandedComments, [postId]: true });
  };

  const handleAddReply = (postId: string, commentId: string) => {
    const text = replyInputs[commentId] || "";
    if (!text.trim()) return;
    addReply(postId, commentId, text);
    setReplyInputs({ ...replyInputs, [commentId]: "" });
  };

  const toggleComments = (postId: string) => {
    setExpandedComments({ ...expandedComments, [postId]: !expandedComments[postId] });
  };

  const isRtl = dir === "rtl";

  return (
    <div className="space-y-8 max-w-5xl mx-auto" dir={dir}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-950 dark:text-zinc-50">
            {t("المنتدى ومجتمع الطلاب", "Student Forum & Community")}
          </h1>
          <p className="text-sm text-zinc-550 dark:text-zinc-400 mt-1">
            {t(
              "تواصل مع زملائك، اطرح أسئلتك، وشارك المعرفة الأكاديمية.",
              "Connect with peers, ask questions, and share academic knowledge."
            )}
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className={`flex items-center gap-2 ${isRtl ? "self-start sm:self-auto" : "self-end sm:self-auto"} shadow-md`}
        >
          <Plus className="h-4.5 w-4.5" />
          {t("إضافة منشور جديد", "Add New Post")}
        </Button>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2.5 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              selectedCategory === cat
                ? "bg-violet-600 text-white shadow-md shadow-violet-500/10"
                : "bg-white border border-zinc-200/60 text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-850"
            }`}
          >
            {categoryArabic[cat] ? t(categoryArabic[cat].ar, categoryArabic[cat].en) : cat}
          </button>
        ))}
      </div>

      {/* Forum Feed */}
      <div className="space-y-6">
        <AnimatePresence>
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => {
              const isOwn = post.authorEmail === user?.email;
              const hasLiked = post.likes.includes(user?.email || "");
              const isEditing = editingPostId === post.id;

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={`border border-zinc-200/50 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm ${post.reported ? "border-amber-500/30 bg-amber-50/5 dark:bg-amber-950/5" : ""}`}>
                    
                    {/* Post Top Meta */}
                    <CardHeader className="pb-3 flex flex-row items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center text-lg shadow-inner">
                          {post.avatar || "🎓"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{post.author}</span>
                            <Badge className="bg-zinc-100 text-zinc-750 dark:bg-zinc-800 dark:text-zinc-350 text-[10px] py-0 px-2 font-bold rounded-md">
                              {categoryArabic[post.category] ? t(categoryArabic[post.category].ar, categoryArabic[post.category].en) : post.category}
                            </Badge>
                            {post.reported && (
                              <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 text-[9px] flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {t("قيد المراجعة", "Under Review")}
                              </Badge>
                            )}
                          </div>
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block mt-0.5">{post.date}</span>
                        </div>
                      </div>

                      {/* Post Actions Menu (Edit/Delete/Report) */}
                      {!isEditing && (
                        <div className="flex items-center gap-1">
                          {isOwn && (
                            <>
                              <button
                                onClick={() => handleStartEdit(post)}
                                className="p-2 text-zinc-400 hover:text-violet-600 hover:bg-zinc-50 dark:hover:bg-zinc-850 rounded-lg transition-colors cursor-pointer"
                                title={t("تعديل المنشور", "Edit Post")}
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(t("هل تريد بالتأكيد حذف هذا المنشور؟", "Are you sure you want to delete this post?"))) {
                                    deletePost(post.id);
                                  }
                                }}
                                className="p-2 text-zinc-400 hover:text-red-500 hover:bg-zinc-50 dark:hover:bg-zinc-850 rounded-lg transition-colors cursor-pointer"
                                title={t("حذف المنشور", "Delete Post")}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          {!isOwn && (
                            <button
                              onClick={() => reportPost(post.id)}
                              className="p-2 text-zinc-400 hover:text-amber-500 hover:bg-zinc-50 dark:hover:bg-zinc-850 rounded-lg transition-colors cursor-pointer"
                              title={t("إبلاغ عن محتوى غير لائق", "Report inappropriate content")}
                            >
                              <Flag className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </CardHeader>

                    {/* Post Content */}
                    <CardContent className="space-y-4">
                      {isEditing ? (
                        <form onSubmit={handleSaveEdit} className="space-y-3">
                          <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="text-sm font-bold"
                            placeholder={t("عنوان التعديل", "Edit Title")}
                            required
                          />
                          <textarea
                            rows={4}
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full p-3 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-950 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                            placeholder={t("محتوى المنشور المعدل", "Edit Content")}
                            required
                          />
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={() => setEditingPostId(null)}>
                              {t("إلغاء", "Cancel")}
                            </Button>
                            <Button type="submit" size="sm">
                              {t("حفظ التغييرات", "Save Changes")}
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <h3 className="font-extrabold text-base text-zinc-950 dark:text-zinc-100 leading-snug">{post.title}</h3>
                          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>

                          {/* File Attachment */}
                          {post.attachmentName && (
                            <div className="flex items-center gap-2.5 p-3.5 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-250/20 dark:border-zinc-800/40 rounded-xl max-w-sm">
                              <FileText className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                              <div className="min-w-0 flex-1">
                                <span className="text-xs font-bold text-zinc-850 dark:text-zinc-200 block truncate">{post.attachmentName}</span>
                                <span className="text-[10px] text-zinc-400 block mt-0.5">
                                  {t("ملف مرفق للتحميل", "Attached file for download")}
                                </span>
                              </div>
                              <a
                                href={post.attachmentUrl}
                                className="text-xs font-black text-violet-600 dark:text-violet-400 hover:underline shrink-0"
                                download
                              >
                                {t("تحميل", "Download")}
                              </a>
                            </div>
                          )}

                          {/* Post Bottom Buttons (Like, comment toggle) */}
                          <div className="flex items-center gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-850/60 text-xs">
                            <button
                              onClick={() => likePost(post.id)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                                hasLiked
                                  ? "text-violet-650 bg-violet-50/50 dark:text-violet-400 dark:bg-violet-950/20 font-black"
                                  : "text-zinc-500 hover:text-violet-650 hover:bg-zinc-50 dark:text-zinc-450 dark:hover:bg-zinc-850"
                              }`}
                            >
                              <ThumbsUp className={`h-4 w-4 ${hasLiked ? "fill-violet-600 dark:fill-violet-550" : ""}`} />
                              <span>{post.likes.length} {t("إعجاب", "Likes")}</span>
                            </button>

                            <button
                              onClick={() => toggleComments(post.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-zinc-500 hover:text-violet-650 hover:bg-zinc-50 dark:text-zinc-450 dark:hover:bg-zinc-850 rounded-lg transition-colors cursor-pointer"
                            >
                              <MessageSquare className="h-4 w-4" />
                              <span>{post.comments.length} {t("تعليقات", "Comments")}</span>
                              {expandedComments[post.id] ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                            </button>
                          </div>

                          {/* Comments Accordion/Collapse Section */}
                          {expandedComments[post.id] && (
                            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-850/60 space-y-4 bg-zinc-50/30 dark:bg-zinc-950/20 p-4 rounded-2xl">
                              
                              {/* Comments List */}
                              <div className="space-y-4">
                                {post.comments.length > 0 ? (
                                  post.comments.map((comment) => {
                                    const isCommentOwn = comment.authorEmail === user?.email;
                                    return (
                                      <div key={comment.id} className={`space-y-2 ${isRtl ? "text-right" : "text-left"}`}>
                                        <div className="flex gap-2.5 items-start bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 p-3 rounded-xl">
                                          <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center text-sm shadow-inner shrink-0">
                                            {comment.avatar || "👤"}
                                          </div>
                                          <div className="flex-1 space-y-1 min-w-0">
                                            <div className="flex justify-between items-center">
                                              <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">{comment.author}</span>
                                              <div className="flex gap-2 items-center">
                                                <span className="text-[9px] text-zinc-400">{comment.date}</span>
                                                {isCommentOwn && (
                                                  <button
                                                    onClick={() => deleteComment(post.id, comment.id)}
                                                    className="text-[9px] font-black text-red-500 hover:underline cursor-pointer"
                                                  >
                                                    {t("حذف", "Delete")}
                                                  </button>
                                                )}
                                              </div>
                                            </div>
                                            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">{comment.content}</p>
                                          </div>
                                        </div>

                                        {/* Nested Replies List */}
                                        <div className={`${isRtl ? "mr-8 border-r-2 pr-3" : "ml-8 border-l-2 pl-3"} space-y-2 border-zinc-200 dark:border-zinc-800`}>
                                          {comment.replies.map((reply) => (
                                            <div key={reply.id} className="flex gap-2 items-start bg-zinc-100/50 dark:bg-zinc-900/30 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-850">
                                              <div className="h-7 w-7 rounded-lg bg-zinc-200 dark:bg-zinc-900 flex items-center justify-center text-xs shrink-0">
                                                {reply.avatar || "👤"}
                                              </div>
                                              <div className="flex-1 space-y-0.5 min-w-0">
                                                <div className="flex justify-between items-center">
                                                  <span className="font-bold text-[11px] text-zinc-850 dark:text-zinc-200">{reply.author}</span>
                                                  <div className="flex gap-2 items-center">
                                                    <span className="text-[9px] text-zinc-400">{reply.date}</span>
                                                    {reply.authorEmail === user?.email && (
                                                      <button
                                                        onClick={() => deleteReply(post.id, comment.id, reply.id)}
                                                        className="text-[9px] font-black text-red-500 hover:underline cursor-pointer"
                                                      >
                                                        {t("حذف", "Delete")}
                                                      </button>
                                                    )}
                                                  </div>
                                                </div>
                                                <p className="text-xs text-zinc-650 dark:text-zinc-355 leading-relaxed">{reply.content}</p>
                                              </div>
                                            </div>
                                          ))}

                                          {/* Reply Input Form */}
                                          <div className="flex gap-2 pt-1.5 items-center">
                                            <CornerDownLeft className={`h-4.5 w-4.5 text-zinc-400 transform ${isRtl ? "scale-x-[-1]" : ""}`} />
                                            <Input
                                              placeholder={t("اكتب رداً على هذا التعليق...", "Write a reply to this comment...")}
                                              value={replyInputs[comment.id] || ""}
                                              onChange={(e) => setReplyInputs({ ...replyInputs, [comment.id]: e.target.value })}
                                              className="h-8 text-xs border border-zinc-200 bg-white dark:bg-zinc-950 dark:border-zinc-800"
                                              onKeyDown={(e) => {
                                                if (e.key === "Enter") handleAddReply(post.id, comment.id);
                                              }}
                                            />
                                            <Button
                                              size="sm"
                                              onClick={() => handleAddReply(post.id, comment.id)}
                                              className="h-8 px-3 text-xs"
                                            >
                                              {t("رد", "Reply")}
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <p className="text-xs text-zinc-400 text-center py-2.5">
                                    {t("لا توجد تعليقات بعد، كن أول من يعلق!", "No comments yet. Be the first to comment!")}
                                  </p>
                                )}
                              </div>

                              {/* Comment Input */}
                              <div className="flex gap-2.5 pt-2 items-center">
                                <Input
                                  placeholder={t("شارك رأيك أو استفسارك هنا...", "Share your thoughts or questions here...")}
                                  value={commentInputs[post.id] || ""}
                                  onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                                  className="h-10 text-xs border border-zinc-200 bg-white dark:bg-zinc-950 dark:border-zinc-800"
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleAddComment(post.id);
                                  }}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleAddComment(post.id)}
                                  className="h-10 px-5 text-xs font-bold"
                                >
                                  {t("تعليق", "Comment")}
                                </Button>
                              </div>

                            </div>
                          )}

                        </>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/60 rounded-3xl space-y-4">
              <MessageSquare className="h-12 w-12 mx-auto text-zinc-300" />
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-zinc-950 dark:text-zinc-50">
                  {t("لا توجد منشورات في هذا القسم", "No posts in this category")}
                </h3>
                <p className="text-xs text-zinc-450 dark:text-zinc-500">
                  {t("كن أول من يشارك منشوره لزملائه الآن!", "Be the first to share a post with your peers!")}
                </p>
              </div>
              <Button onClick={() => setIsCreateOpen(true)} size="sm" className="px-6">
                {t("إضافة منشور", "Add Post")}
              </Button>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden ${isRtl ? "text-right" : "text-left"}`}
              dir={dir}
            >
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-850 flex justify-between items-center">
                <h3 className="font-extrabold text-base text-zinc-950 dark:text-zinc-50">
                  {t("إنشاء منشور جديد", "Create New Post")}
                </h3>
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="p-6 space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    {t("عنوان المنشور", "Post Title")}
                  </label>
                  <Input
                    placeholder={t("مثال: كيف أستعد لاختبار برمجة 1؟", "Example: How do I prepare for Programming 1 exam?")}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Category select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    {t("القسم / التصنيف", "Category / Section")}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as CommunityPost["category"])}
                    className="w-full h-11 px-3.5 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-950 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 cursor-pointer"
                  >
                    {categories.filter(c => c !== "الكل").map((cat) => (
                      <option key={cat} value={cat}>
                        {categoryArabic[cat] ? t(categoryArabic[cat].ar, categoryArabic[cat].en) : cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    {t("محتوى المنشور", "Post Content")}
                  </label>
                  <textarea
                    rows={5}
                    placeholder={t("اكتب استفسارك أو تفاصيل مشاركتك هنا...", "Write your question or post details here...")}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-950 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 leading-relaxed resize-none"
                  />
                </div>

                {/* File Upload Attachment Input Simulation */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Paperclip className="h-4 w-4 text-zinc-400" />
                    <span>{t("إرفاق ملف ملخص/كود (اختياري)", "Attach File/Code (Optional)")}</span>
                  </label>
                  <Input
                    placeholder={t("اسم الملف مثلاً: lecture_notes.pdf أو lab_code.zip", "Filename e.g. lecture_notes.pdf or lab_code.zip")}
                    value={newFile}
                    onChange={(e) => setNewFile(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-850">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    {t("إلغاء", "Cancel")}
                  </Button>
                  <Button type="submit" className="px-6">
                    {t("نشر الآن", "Publish Now")}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
