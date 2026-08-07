"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useAdmin } from "@/context/admin-context";
import { Resource } from "@/lib/resources-data";
import { useApp } from "@/context/app-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Upload,
  Check,
  X,
  Star,
  Trash2,
  Edit2,
  FileSpreadsheet,
  Download,
  AlertCircle,
  HelpCircle,
  Video,
  FileText,
  BookOpen,
  Code,
  FolderMinus,
  Plus
} from "lucide-react";

import { useToast } from "@/components/ui/toast";

export default function ResourceManagementPage() {
  const { t, dir, lang } = useApp();
  const { toast } = useToast();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const {
    resources,
    approveResource,
    addResourceAdmin,
    editResourceAdmin,
    deleteResourceAdmin,
    featureResource,
    courses
  } = useAdmin();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("ALL");
  const [courseFilter, setCourseFilter] = React.useState("ALL");

  // Modal State
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = React.useState("");
  const [formDesc, setFormDesc] = React.useState("");
  const [formCourse, setFormCourse] = React.useState("");
  const [formType, setFormType] = React.useState<Resource["type"]>("book");
  const [formLink, setFormLink] = React.useState("");
  const [formAuthor, setFormAuthor] = React.useState("");

  // Drag and Drop Mock State
  const [dragging, setDragging] = React.useState(false);
  const [uploadedFile, setUploadedFile] = React.useState<string | null>(null);

  // Filtered resources
  const filteredResources = React.useMemo(() => {
    return resources.filter((r) => {
      const query = searchTerm.toLowerCase().trim();
      const matchQuery =
        !query ||
        r.title.toLowerCase().includes(query) ||
        r.courseCode.toLowerCase().includes(query) ||
        r.author.toLowerCase().includes(query);

      const matchType = typeFilter === "ALL" || r.type === typeFilter;
      const matchCourse = courseFilter === "ALL" || r.courseCode === courseFilter;

      return matchQuery && matchType && matchCourse;
    });
  }, [resources, searchTerm, typeFilter, courseFilter]);

  const openAddModal = () => {
    setEditingId(null);
    setFormTitle("");
    setFormDesc("");
    setFormCourse(courses[0]?.code || "CSW 110");
    setFormType("book");
    setFormLink("");
    setFormAuthor("إدارة الكلية");
    setUploadedFile(null);
    setModalOpen(true);
  };

  const openEditModal = (res: Resource) => {
    setEditingId(res.id);
    setFormTitle(res.title);
    setFormDesc(res.description);
    setFormCourse(res.courseCode);
    setFormType(res.type);
    setFormLink(res.url);
    setFormAuthor(res.author);
    setUploadedFile(res.url);
    setModalOpen(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile(file.name);
      setFormLink(`#file-${file.name}`);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formCourse) {
      toast(t("⚠️ يرجى إدخال عنوان الملف وكود المادة المرتبطة.", "⚠️ Please enter resource title and associated course code."));
      return;
    }

    if (editingId) {
      editResourceAdmin(editingId, {
        title: formTitle,
        description: formDesc,
        courseCode: formCourse,
        type: formType,
        url: formLink || "#",
        author: formAuthor
      });
      toast(t("✅ تم تعديل بيانات المصدر بنجاح.", "✅ Resource updated successfully."));
    } else {
      addResourceAdmin({
        title: formTitle,
        description: formDesc || "ملخص ومستند دراسي مساعد للطلاب.",
        courseCode: formCourse,
        type: formType,
        url: formLink || "#",
        author: formAuthor || "إدارة الكلية"
      });
      toast(t("✨ تم إضافة الملف والمصدر الأكاديمي بنجاح.", "✨ Academic resource added successfully."));
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in" dir={dir}>
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
            {t("إدارة الملفات والمصادر الأكاديمية", "Academic Resources & Files Management")}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {t(
              "مراجعة الملفات المرفوعة من الطلاب، الموافقة على المراجع، ورفع ملخصات واختبارات الكلية.",
              "Review student-uploaded files, approve study references, and publish official materials."
            )}
          </p>
        </div>

        <Button onClick={openAddModal} className="gap-2 text-xs font-bold shrink-0">
          <Upload className="h-4 w-4" />
          {t("رفع ملف / مصدر جديد", "Upload New Resource")}
        </Button>
      </div>

      {/* Controls */}
      <Card className="border border-zinc-200/50 bg-white dark:bg-zinc-900 shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className={`absolute ${lang === "ar" ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400`} />
            <Input
              type="text"
              placeholder={t("ابحث باسم الملف، كود المادة، أو اسم الرافع...", "Search by file name, course code, or author...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={lang === "ar" ? "pr-10" : "pl-10"}
            />
          </div>

          <div className="flex gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-150 cursor-pointer"
            >
              <option value="ALL">{t("جميع أنواع الملفات 📂", "All File Types 📂")}</option>
              <option value="book">{t("كتب وملخصات 📚", "Books & Summaries 📚")}</option>
              <option value="slides">{t("شرائح محاضرات 📊", "Lecture Slides 📊")}</option>
              <option value="exam">{t("امتحانات سابقة 📝", "Past Exams 📝")}</option>
              <option value="cheatsheet">{t("ملخصات سريعة 📄", "Cheatsheets 📄")}</option>
            </select>

            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-150 cursor-pointer"
            >
              <option value="ALL">{t("جميع المواد 🎯", "All Courses 🎯")}</option>
              {courses.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {t(c.arabic, c.english)}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.length > 0 ? (
          filteredResources.map((res) => {
            const isPending = res.author.includes("[PENDING]");
            const isFeatured = res.rating === 5;

            return (
              <Card
                key={res.id}
                className={`border bg-white dark:bg-zinc-900 shadow-sm flex flex-col justify-between ${
                  isPending
                    ? "border-amber-300 dark:border-amber-850 bg-amber-500/[0.02]"
                    : "border-zinc-200/60 dark:border-zinc-800/60"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="text-[10px] font-mono font-bold">
                      {res.courseCode}
                    </Badge>

                    {isPending ? (
                      <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/20 text-[9px]">
                        {t("قيد التقييم والمراجعة ⏳", "Pending Approval ⏳")}
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 text-[9px] border-transparent">
                        {t("معتمد بالمكتبة ✓", "Approved ✓")}
                      </Badge>
                    )}
                  </div>

                  <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-50 mt-2 line-clamp-1">
                    {res.title}
                  </CardTitle>
                  <CardDescription className="text-[11px] text-zinc-400 line-clamp-2">
                    {res.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-3 text-xs space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-2">
                    <span>{t("بواسطة:", "By:")} {res.author.replace("[PENDING]", "")}</span>
                    <span>{res.downloadCount} {t("تنزيلات", "downloads")}</span>
                  </div>
                </CardContent>

                <div className="p-4 pt-0 flex gap-1.5 border-t border-transparent">
                  {isPending ? (
                    <Button
                      size="sm"
                      onClick={() => approveResource(res.id, true)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold h-8 gap-1 cursor-pointer"
                    >
                      <Check className="h-3.5 w-3.5" />
                      {t("اعتماد ونشر", "Approve & Publish")}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => featureResource(res.id, !isFeatured)}
                      className={`flex-1 text-[10px] font-bold h-8 gap-1 cursor-pointer ${
                        isFeatured ? "text-amber-600 border-amber-300" : ""
                      }`}
                    >
                      <Star className={`h-3.5 w-3.5 ${isFeatured ? "fill-amber-400" : ""}`} />
                      {isFeatured ? t("مميز", "Featured") : t("تثبيت كمميز", "Make Featured")}
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(res)}
                    className="text-[10px] h-8 font-bold cursor-pointer"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm(t(`هل أنت متأكد من حذف المصدر [${res.title}]؟`, `Delete resource [${res.title}]?`))) {
                        deleteResourceAdmin(res.id);
                      }
                    }}
                    className="text-[10px] h-8 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center space-y-2">
            <HelpCircle className="h-6 w-6 mx-auto text-zinc-400" />
            <p className="text-xs text-zinc-400">{t("لا توجد ملفات أو مصادر مطابقة للتصفية الحالية", "No resources match current filter criteria")}</p>
          </div>
        )}
      </div>

      {modalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-hidden">
          <Card className="w-full max-w-lg max-h-[85vh] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-3xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
              <CardTitle className="text-base font-bold">
                {editingId ? t("تعديل بيانات المصدر الأكاديمي", "Edit Academic Resource") : t("رفع ملف ومصدر دراسي جديد", "Upload New Academic Resource")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 overflow-y-auto flex-1 space-y-4">
              <form id="resource-form" onSubmit={handleSave} className="space-y-4">
                {/* Drag and drop upload zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors cursor-pointer ${
                    dragging
                      ? "border-violet-500 bg-violet-50/50 dark:bg-violet-950/20"
                      : "border-zinc-250 dark:border-zinc-800 hover:border-violet-400"
                  }`}
                >
                  <Upload className="h-8 w-8 mx-auto text-zinc-400 mb-2" />
                  <h4 className="font-bold text-xs text-zinc-800 dark:text-zinc-200">
                    {uploadedFile ? t(`تم تجهيز الملف: ${uploadedFile}`, `File selected: ${uploadedFile}`) : t("اسحب وأفلت ملف PDF/Doc هنا، أو اضغط للتصفح", "Drag & drop PDF/Doc file here, or click to browse")}
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-1">{t("الحد الأقصى لحجم الملف هو 50 ميجابايت", "Maximum file size limit is 50 MB")}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("عنوان الملف / المصدر", "Resource Title")}</label>
                  <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder={t("مثال: ملخص مادة نظم التشغيل - الشابتر الأول", "Example: Operating Systems Chapter 1 Summary")} className="text-xs" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("المادة المرتبطة", "Associated Course")}</label>
                    <select value={formCourse} onChange={(e) => setFormCourse(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 cursor-pointer">
                      {courses.map((c) => (
                        <option key={c.code} value={c.code}>{c.code} - {t(c.arabic, c.english)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("نوع الملف", "File Type")}</label>
                    <select value={formType} onChange={(e) => setFormType(e.target.value as any)} className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 cursor-pointer">
                      <option value="book">{t("كتاب / ملخص 📚", "Book / Summary 📚")}</option>
                      <option value="slides">{t("شرائح محاضرات 📊", "Slides 📊")}</option>
                      <option value="exam">{t("امتحان سابق 📝", "Past Exam 📝")}</option>
                      <option value="cheatsheet">{t("ملخص سريع 📄", "Cheatsheet 📄")}</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("الوصف والملحوظات", "Description & Notes")}</label>
                  <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} rows={2} className="w-full p-3 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100" />
                </div>
              </form>
            </CardContent>
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 shrink-0 flex gap-2 justify-end bg-zinc-50/50 dark:bg-zinc-950/50">
              <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)} className="text-xs font-bold cursor-pointer">
                {t("إلغاء", "Cancel")}
              </Button>
              <Button type="submit" form="resource-form" size="sm" className="text-xs font-bold cursor-pointer">
                {editingId ? t("تحديث بيانات المصدر", "Update Resource") : t("نشر المصدر للمكتبة", "Publish Resource")}
              </Button>
            </div>
          </Card>
        </div>,
        document.body
      )}
    </div>
  );
}
