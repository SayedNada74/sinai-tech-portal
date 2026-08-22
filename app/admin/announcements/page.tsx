"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useAdmin, Announcement } from "@/context/admin-context";
import { useApp } from "@/context/app-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Megaphone,
  Search,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Send,
  Eye,
  EyeOff,
  Bell,
  HelpCircle
} from "lucide-react";

import { useToast } from "@/components/ui/toast";

export default function AnnouncementCMSPage() {
  const { t, dir, lang } = useApp();
  const { toast } = useToast();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useAdmin();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("ALL");

  // Form Modal States
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = React.useState("");
  const [formContent, setFormContent] = React.useState("");
  const [formCategory, setFormCategory] = React.useState<Announcement["category"]>("news");
  const [formScheduledDate, setFormScheduledDate] = React.useState("");
  const [formPublished, setFormPublished] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Filtering
  const filteredAnnouncements = React.useMemo(() => {
    return announcements.filter((a) => {
      const query = searchTerm.toLowerCase().trim();
      const matchQuery =
        !query ||
        a.title.toLowerCase().includes(query) ||
        a.content.toLowerCase().includes(query);

      const matchCategory = categoryFilter === "ALL" || a.category === categoryFilter;

      return matchQuery && matchCategory;
    });
  }, [announcements, searchTerm, categoryFilter]);

  const openCreateModal = () => {
    setEditingId(null);
    setFormTitle("");
    setFormContent("");
    setFormCategory("news");
    setFormScheduledDate("");
    setFormPublished(true);
    setModalOpen(true);
  };

  const openEditModal = (ann: Announcement) => {
    setEditingId(ann.id);
    setFormTitle(ann.title);
    setFormContent(ann.content);
    setFormCategory(ann.category);
    setFormScheduledDate(ann.scheduledDate || "");
    setFormPublished(ann.published);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formTitle || !formContent) {
      toast(t("⚠️ يرجى إدخال عنوان الإعلان ونصه التفصيلي.", "⚠️ Please enter announcement title and detailed content."), "error");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateAnnouncement(editingId, {
          title: formTitle,
          content: formContent,
          category: formCategory,
          scheduledDate: formScheduledDate || undefined,
          published: formPublished
        });
        toast(t("✨ تم تحديث بيانات الإعلان بنجاح!", "✨ Announcement updated successfully!"), "success");
      } else {
        await addAnnouncement({
          title: formTitle,
          content: formContent,
          category: formCategory,
          scheduledDate: formScheduledDate || undefined,
          published: formPublished
        });
        toast(t("✨ تم نشر الإعلان الجديد على المنصة بنجاح!", "✨ New announcement published successfully!"), "success");
      }
      setModalOpen(false);
    } catch (err) {
      toast(t("حدث خطأ أثناء حفظ الإعلان.", "An error occurred while saving the announcement."), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" dir={dir}>
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
            {t("مركز إدارة ونشر الإعلانات والأخبار", "Announcements & CMS Management")}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {t(
              "نشر الإعلانات الرسمية للكلية، جدولة مواعيد الاختبارات والتسجيل الصيفي، وتنبيه الطلاب.",
              "Publish official announcements, schedule exam timetables & registration alerts for students."
            )}
          </p>
        </div>

        <Button onClick={openCreateModal} className="gap-2 text-xs font-bold shrink-0">
          <Megaphone className="h-4 w-4" />
          {t("نشر إعلان جديد", "Post New Announcement")}
        </Button>
      </div>

      {/* Controls */}
      <Card className="border border-zinc-200/50 bg-white dark:bg-zinc-900 shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className={`absolute ${lang === "ar" ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400`} />
            <Input
              type="text"
              placeholder={t("ابحث في عناوين ونصوص الإعلانات المنشورة...", "Search announcement titles or content...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={lang === "ar" ? "pr-10" : "pl-10"}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-150 cursor-pointer"
          >
            <option value="ALL">{t("جميع التصنيفات 📢", "All Categories 📢")}</option>
            <option value="news">{t("أخبار عامة 📰", "General News 📰")}</option>
            <option value="registration">{t("جدول التسجيل 📝", "Registration 📝")}</option>
            <option value="midterms">{t("امتحانات ميدتيرم ⏱️", "Midterms ⏱️")}</option>
            <option value="finals">{t("امتحانات نهائية 🎓", "Finals 🎓")}</option>
          </select>
        </CardContent>
      </Card>

      {/* Announcements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((ann) => (
            <Card key={ann.id} className="border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="text-[10px] font-bold">
                    {ann.category}
                  </Badge>
                  <span className="text-[9px] text-zinc-400 font-bold">{ann.date}</span>
                </div>

                <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-50 mt-2 line-clamp-1">
                  {ann.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="pb-3 text-xs space-y-2">
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                  {ann.content}
                </p>
              </CardContent>

              <div className="p-4 pt-0 flex gap-2 border-t border-transparent">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(ann)}
                  className="flex-1 text-[10px] font-bold h-8 gap-1 cursor-pointer"
                >
                  <Edit2 className="h-3 w-3" />
                  {t("تعديل الإعلان", "Edit")}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm(t(`حذف الإعلان [${ann.title}] نهائياً؟`, `Permanently delete [${ann.title}]?`))) {
                      deleteAnnouncement(ann.id);
                    }
                  }}
                  className="text-[10px] h-8 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-xs text-zinc-400">
            {t("لا توجد إعلانات مطابقة للتصفية", "No announcements match search criteria")}
          </div>
        )}
      </div>

      {modalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-hidden">
          <Card className="w-full max-w-lg max-h-[85vh] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-3xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
              <CardTitle className="text-base font-bold">
                {editingId ? t("تعديل الإعلان المنشور", "Edit Published Announcement") : t("نشر إعلان أكاديمي جديد", "Post New Academic Announcement")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 overflow-y-auto flex-1 space-y-4">
              <form id="announcement-form" onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("عنوان الإعلان الرئيسي", "Announcement Title")}</label>
                  <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="بدء فتح باب التسجيل الصيفي" className="text-xs" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("التصنيف الأكاديمي", "Category")}</label>
                  <select value={formCategory} onChange={(e) => setFormCategory(e.target.value as any)} className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 cursor-pointer">
                    <option value="news">{t("أخبار عامة 📰", "General News 📰")}</option>
                    <option value="registration">{t("جدول التسجيل 📝", "Registration 📝")}</option>
                    <option value="midterms">{t("امتحانات ميدتيرم ⏱️", "Midterms ⏱️")}</option>
                    <option value="finals">{t("امتحانات نهائية 🎓", "Finals 🎓")}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("نص الإعلان التفصيلي", "Detailed Announcement Content")}</label>
                  <textarea value={formContent} onChange={(e) => setFormContent(e.target.value)} rows={4} className="w-full p-3 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100" />
                </div>
              </form>
            </CardContent>
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 shrink-0 flex gap-2 justify-end bg-zinc-50/50 dark:bg-zinc-950/50">
              <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)} className="text-xs font-bold cursor-pointer">
                {t("إلغاء", "Cancel")}
              </Button>
              <Button type="submit" form="announcement-form" size="sm" className="text-xs font-bold cursor-pointer" isLoading={isSubmitting} disabled={isSubmitting}>
                {editingId ? t("تحديث الإعلان", "Update Announcement") : t("نشر الإعلان", "Publish Announcement")}
              </Button>
            </div>
          </Card>
        </div>,
        document.body
      )}
    </div>
  );
}
