"use client";

import * as React from"react";
import { createPortal } from"react-dom";
import { useAdmin } from"@/context/admin-context";
import { Course } from"@/lib/courses-data";
import { useApp } from"@/context/app-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from"@/components/ui/card";
import { Input } from"@/components/ui/input";
import { Button } from"@/components/ui/button";
import { Badge } from"@/components/ui/badge";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Archive,
  BookOpen,
  HelpCircle,
  FolderMinus,
  Settings,
  Link as LinkIcon
} from"lucide-react";

import { useToast } from"@/components/ui/toast";

export default function CourseManagementPage() {
  const { t, dir, lang } = useApp();
  const { toast } = useToast();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  const { courses, addCourse, updateCourse, deleteCourse, archiveCourse } = useAdmin();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [deptFilter, setDeptFilter] = React.useState("ALL");
  const [diffFilter, setDiffFilter] = React.useState("ALL");

  // Modal States
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingCode, setEditingCode] = React.useState<string | null>(null);

  // Form Fields
  const [formCode, setFormCode] = React.useState("");
  const [formEnglish, setFormEnglish] = React.useState("");
  const [formArabic, setFormArabic] = React.useState("");
  const [formCredits, setFormCredits] = React.useState(3);
  const [formType, setFormType] = React.useState<"required" |"elective">("required");
  const [formPeriod, setFormPeriod] = React.useState("year-1-sem-1");
  const [formPrereqs, setFormPrereqs] = React.useState<string[]>([]);
  const [formDiff, setFormDiff] = React.useState<"easy" |"medium" |"hard">("medium");
  const [formDept, setFormDept] = React.useState<Course["department"]>("IT");
  const [formDesc, setFormDesc] = React.useState("");

  // Filtering
  const filteredCourses = React.useMemo(() => {
    return courses.filter((c) => {
      const query = searchTerm.toLowerCase().trim();
      const matchQuery =
        !query ||
        c.code.toLowerCase().includes(query) ||
        c.arabic.toLowerCase().includes(query) ||
        c.english.toLowerCase().includes(query);

      const matchDept = deptFilter ==="ALL" || c.department === deptFilter;
      const matchDiff = diffFilter ==="ALL" || c.difficulty === diffFilter;

      return matchQuery && matchDept && matchDiff;
    });
  }, [courses, searchTerm, deptFilter, diffFilter]);

  const openAddModal = () => {
    setEditingCode(null);
    setFormCode("");
    setFormEnglish("");
    setFormArabic("");
    setFormCredits(3);
    setFormType("required");
    setFormPeriod("year-1-sem-1");
    setFormPrereqs([]);
    setFormDiff("medium");
    setFormDept("IT");
    setFormDesc("");
    setModalOpen(true);
  };

  const openEditModal = (c: Course) => {
    setEditingCode(c.code);
    setFormCode(c.code);
    setFormEnglish(c.english);
    setFormArabic(c.arabic);
    setFormCredits(c.credits);
    setFormType(c.type);
    setFormPeriod(c.period);
    setFormPrereqs(c.prerequisites || []);
    setFormDiff(c.difficulty);
    setFormDept(c.department);
    setFormDesc(c.description);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode || !formEnglish || !formArabic) {
      toast(t("️ يرجى ملء الكود، والاسم بالإنجليزية، والاسم بالعربية.","️ Please fill in code, English name, and Arabic name."),"error");
      return;
    }

    const courseObj: Course = {
      code: formCode,
      english: formEnglish,
      arabic: formArabic,
      credits: formCredits,
      type: formType,
      period: formPeriod,
      prerequisites: formPrereqs,
      difficulty: formDiff,
      department: formDept,
      description: formDesc || `مقرر دراسي في ${formArabic}`,
      descriptionEn: `Academic course in ${formEnglish}`,
      outcomes: [`فهم مبادئ ${formArabic}`],
      outcomesEn: [`Understand principles of ${formEnglish}`]
    };

    if (editingCode) {
      updateCourse(editingCode, courseObj);
      toast(t(" تم تحديث بيانات المقرر بنجاح!"," Course updated successfully!"),"success");
    } else {
      addCourse(courseObj);
      toast(t(" تم إضافة المقرر الجديد بالدليل الأكاديمي بنجاح!"," New course added successfully!"),"success");
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in" dir={dir}>
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
            {t("إدارة الخطة والمقررات الدراسية","Course Catalog & Curricula Management")}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {t("إضافة وتعديل المقررات الأكاديمية لجميع التخصصات، تحديث المتطلبات السابقة، وأرشفة المواد.","Add, edit academic courses across departments, update prerequisites, and archive subjects."
            )}
          </p>
        </div>

        <Button onClick={openAddModal} className="gap-2 text-xs font-bold w-full sm:w-auto justify-center shrink-0">
          <Plus className="h-4 w-4" />
          {t("إضافة مقرر دراسي جديد","Add New Course")}
        </Button>
      </div>

      {/* Controls */}
      <Card className="border border-zinc-200/50 bg-white dark:bg-zinc-900 shadow-sm">
        <CardContent className="p-3 sm:p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className={`absolute ${lang ==="ar" ?"right-3.5" :"left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400`} />
            <Input
              type="text"
              placeholder={t("ابحث بكود المادة، اسم المادة بالعربي أو الإنجليزي...","Search by course code, title in Arabic or English...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={lang ==="ar" ?"pr-10" :"pl-10"}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full md:w-auto">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-150 cursor-pointer w-full"
            >
              <option value="ALL">{t("جميع الأقسام","All Departments")}</option>
              <option value="IT">IT - {t("تكنولوجيا المعلومات","Information Technology")}</option>
              <option value="CS">CS - {t("علوم الحاسب","Computer Science")}</option>
              <option value="IS">IS - {t("نظم المعلومات","Information Systems")}</option>
              <option value="MATH">{t("العلوم الأساسية والرياضيات","Basic Sciences & Math")}</option>
              <option value="HUMANITIES">{t("متطلبات الجامعة","University Requirements")}</option>
            </select>

            <select
              value={diffFilter}
              onChange={(e) => setDiffFilter(e.target.value)}
              className="h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-150 cursor-pointer w-full"
            >
              <option value="ALL">{t("جميع مستويات الصعوبة","All Difficulties")}</option>
              <option value="easy">{t("سهل 🟢","Easy 🟢")}</option>
              <option value="medium">{t("متوسط 🟡","Medium 🟡")}</option>
              <option value="hard">{t("صعب","Hard")}</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((c) => (
            <Card key={c.code} className="border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="text-[10px] font-bold font-mono">
                    {c.code}
                  </Badge>
                  <Badge className="text-[9px] py-0 px-2 border-transparent bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400">
                    {c.department}
                  </Badge>
                </div>
                <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-50 mt-2">
                  {t(c.arabic, c.english)}
                </CardTitle>
                <CardDescription className="text-[11px] text-zinc-400">
                  {lang ==="ar" ? c.english : c.arabic}
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-3 text-xs space-y-2">
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                  {lang ==="ar" ? c.description : (c.descriptionEn || c.description)}
                </p>

                <div className="flex flex-wrap gap-2 text-[10px] text-zinc-400 font-bold border-t border-zinc-100 dark:border-zinc-800 pt-2">
                  <span>{c.credits} {t("ساعات معتمدة","Credit Hours")}</span>
                  <span>·</span>
                  <span>{t(c.type ==="required" ?"إجباري" :"اختياري", c.type ==="required" ?"Required" :"Elective")}</span>
                </div>
              </CardContent>

              <CardFooter className="pt-0 flex gap-2 border-t border-transparent">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(c)}
                  className="flex-1 text-[11px] h-8 font-bold gap-1 cursor-pointer"
                >
                  <Edit2 className="h-3 w-3" />
                  {t("تعديل","Edit")}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => archiveCourse(c.code, true)}
                  className="text-[11px] h-8 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 cursor-pointer"
                  title={t("أرشفة المقرر","Archive Course")}
                >
                  <Archive className="h-3.5 w-3.5" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm(t(`هل أنت متأكد من حذف المقرر [${c.code}] نهائياً؟`, `Are you sure you want to delete course [${c.code}]?`))) {
                      deleteCourse(c.code);
                    }
                  }}
                  className="text-[11px] h-8 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                  title={t("حذف المقرر","Delete Course")}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-12 text-center space-y-2">
            <HelpCircle className="h-6 w-6 mx-auto text-primary" />
            <p className="text-xs text-zinc-400">{t("لا توجد مقررات متطابقة مع البحث الحالي","No courses match current filter criteria")}</p>
          </div>
        )}
      </div>

      {modalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <Card className="w-full max-w-xl max-h-[90vh] my-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-3xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
              <CardTitle className="text-base font-bold">
                {editingCode ? t(`تعديل بيانات المقرر [${editingCode}]`, `Edit Course [${editingCode}]`) : t("إضافة مقرر دراسي جديد","Add New Course")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 overflow-y-auto flex-1 space-y-4">
              <form id="course-form" onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("رمز المقرر (كود المادة)","Course Code")}</label>
                    <Input value={formCode} onChange={(e) => setFormCode(e.target.value)} placeholder="CSW 232" className="text-xs font-mono" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("الساعات المعتمدة","Credit Hours")}</label>
                    <Input type="number" value={formCredits} onChange={(e) => setFormCredits(Number(e.target.value))} className="text-xs" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("الاسم باللغة العربية","Arabic Title")}</label>
                    <Input value={formArabic} onChange={(e) => setFormArabic(e.target.value)} placeholder="برمجة الحاسب (1)" className="text-xs" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("الاسم باللغة الإنجليزية","English Title")}</label>
                    <Input value={formEnglish} onChange={(e) => setFormEnglish(e.target.value)} placeholder="Computer Programming (1)" className="text-xs" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("القسم الأكاديمي","Department")}</label>
                    <select value={formDept} onChange={(e) => setFormDept(e.target.value as any)} className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 cursor-pointer">
                      <option value="IT">IT</option>
                      <option value="CS">CS</option>
                      <option value="IS">IS</option>
                      <option value="MATH">MATH</option>
                      <option value="HUMANITIES">HUMANITIES</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("مستوى الصعوبة","Difficulty Level")}</label>
                    <select value={formDiff} onChange={(e) => setFormDiff(e.target.value as any)} className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 cursor-pointer">
                      <option value="easy">{t("سهل","Easy")}</option>
                      <option value="medium">{t("متوسط","Medium")}</option>
                      <option value="hard">{t("صعب","Hard")}</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("الوصف الأكاديمي الشامل","Course Description")}</label>
                  <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} rows={3} className="w-full p-3 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100" />
                </div>
              </form>
            </CardContent>
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 shrink-0 flex gap-2 justify-end bg-zinc-50/50 dark:bg-zinc-950/50">
              <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)} className="text-xs font-bold cursor-pointer">
                {t("إلغاء","Cancel")}
              </Button>
              <Button type="submit" form="course-form" size="sm" className="text-xs font-bold cursor-pointer">
                {editingCode ? t("تحديث بيانات المقرر","Update Course") : t("حفظ المقرر الجديد","Save New Course")}
              </Button>
            </div>
          </Card>
        </div>,
        document.body
      )}
    </div>
  );
}
