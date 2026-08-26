"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useSocial, CareerOpportunity } from "@/context/social-context";
import { useApp } from "@/context/app-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Briefcase,
  Building2,
  MapPin,
  ExternalLink,
  Check,
  X
} from "lucide-react";

import { useToast } from "@/components/ui/toast";

export default function AdminCareersPage() {
  const { t, dir, lang } = useApp();
  const { toast } = useToast();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  const { careers, addCareer, editCareer, deleteCareer } = useSocial();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("ALL");

  // Modal State
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = React.useState("");
  const [formCompany, setFormCompany] = React.useState("");
  const [formLocation, setFormLocation] = React.useState("مصر / Remotely");
  const [formType, setFormType] = React.useState<CareerOpportunity["type"]>("internship");
  const [formDesc, setFormDesc] = React.useState("");
  const [formLink, setFormLink] = React.useState("https://example.com");
  const [formDept, setFormDept] = React.useState<CareerOpportunity["department"]>("all");
  const [formExp, setFormExp] = React.useState<CareerOpportunity["experience"]>("entry");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const openCreateModal = () => {
    setEditingId(null);
    setFormTitle("");
    setFormCompany("");
    setFormLocation("مصر / Remotely");
    setFormType("internship");
    setFormDesc("");
    setFormLink("https://example.com");
    setFormDept("all");
    setFormExp("entry");
    setModalOpen(true);
  };

  const openEditModal = (c: CareerOpportunity) => {
    setEditingId(c.id);
    setFormTitle(c.title);
    setFormCompany(c.company);
    setFormLocation(c.location || "");
    setFormType(c.type);
    setFormDesc(c.description || "");
    setFormLink(c.link);
    setFormDept(c.department || "all");
    setFormExp(c.experience || "entry");
    setModalOpen(true);
  };

  const filteredCareers = React.useMemo(() => {
    return careers.filter((c) => {
      const q = searchTerm.toLowerCase().trim();
      const matchQ =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q);

      const matchType = typeFilter === "ALL" || c.type === typeFilter;
      return matchQ && matchType;
    });
  }, [careers, searchTerm, typeFilter]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formTitle || !formCompany || !formLink) {
      toast(t("⚠️ يرجى ملء المسمّى الوظيفي، اسم الشركة، ورابط التقديم.", "⚠️ Please enter job title, company name, and application URL."), "error");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        await editCareer(editingId, {
          title: formTitle,
          company: formCompany,
          location: formLocation || "مصر / Remotely",
          type: formType,
          description: formDesc || "فرصة ممتازة لطلاب وخريجي حاسبات سيناء.",
          link: formLink,
          department: formDept,
          experience: formExp
        });
        toast(t("✨ تم تعديل بيانات الفرصة بنجاح!", "✨ Opportunity updated successfully!"), "success");
      } else {
        await addCareer({
          title: formTitle,
          company: formCompany,
          location: formLocation || "مصر / Remotely",
          type: formType,
          description: formDesc || "فرصة ممتازة لطلاب وخريجي حاسبات سيناء.",
          link: formLink,
          department: formDept,
          experience: formExp
        });
        toast(t("✨ تم نشر فرصة التوظيف/التدريب بنجاح!", "✨ Opportunity published successfully!"), "success");
      }
      setModalOpen(false);
    } catch (err) {
      toast(t("حدث خطأ أثناء حفظ الفرصة.", "An error occurred while saving the opportunity."), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" dir={dir}>
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
            {t("بوابة إدارة الفرص والتدريبات المهنية", "Careers & Internships Management")}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {t(
              "نشر وإدارة التقديمات على الفرص الوظيفية والتدريب الصيفي للشركات المتعاقدة.",
              "Publish & manage job listings, summer internships, and graduate career positions."
            )}
          </p>
        </div>

        <Button onClick={openCreateModal} className="gap-2 text-xs font-bold w-full sm:w-auto justify-center shrink-0">
          <Plus className="h-4 w-4" />
          {t("نشر فرصة جديدة", "Post New Career")}
        </Button>
      </div>

      {/* Controls */}
      <Card className="border border-zinc-200/50 bg-white dark:bg-zinc-900 shadow-sm">
        <CardContent className="p-3 sm:p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className={`absolute ${lang === "ar" ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400`} />
            <Input
              type="text"
              placeholder={t("ابحث بالوظيفة، الشركة، أو مكان العمل...", "Search by job title, company, or location...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={lang === "ar" ? "pr-10" : "pl-10"}
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-150 cursor-pointer w-full md:w-auto"
          >
            <option value="ALL">{t("جميع أنواع الفرص 💼", "All Career Types 💼")}</option>
            <option value="internship">{t("تدريب صيفي 🎓", "Internships 🎓")}</option>
            <option value="remote">{t("عن بعد 💻", "Remote 💻")}</option>
            <option value="part-time">{t("دوام جزئي ⏱️", "Part Time ⏱️")}</option>
            <option value="freelance">{t("عمل حر 💻", "Freelance 💻")}</option>
            <option value="graduate">{t("للخريجين 🎓", "Graduate 🎓")}</option>
          </select>
        </CardContent>
      </Card>

      {/* Careers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCareers.length > 0 ? (
          filteredCareers.map((job) => (
            <Card key={job.id} className="border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="text-[10px] font-bold">
                    {job.type === "internship" ? t("تدريب صيفي", "Internship") : t("فرصة عمل", "Career")}
                  </Badge>
                  <span className="text-[9px] text-zinc-400 font-bold">{job.dateAdded}</span>
                </div>

                <CardTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-50 mt-2 line-clamp-1">
                  {job.title}
                </CardTitle>
                <CardDescription className="text-xs font-semibold text-violet-600 dark:text-violet-400">
                  {job.company} · {job.location}
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-3 text-xs space-y-2">
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                  {job.description}
                </p>
              </CardContent>

              <div className="p-4 pt-0 flex gap-2 border-t border-transparent">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(job)}
                  className="flex-1 text-[10px] font-bold h-8 gap-1 cursor-pointer"
                >
                  <Edit2 className="h-3 w-3" />
                  {t("تعديل", "Edit")}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (confirm(t(`حذف فرصة [${job.title}] نهائياً؟`, `Permanently delete [${job.title}]?`))) {
                      deleteCareer(job.id);
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
            {t("لا توجد فرص توظيفية متطابقة", "No career opportunities match search filters")}
          </div>
        )}
      </div>

      {modalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <Card className="w-full max-w-lg max-h-[90vh] my-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-3xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
              <CardTitle className="text-base font-bold">
                {editingId ? t("تعديل فرصة توظيف / تدريب", "Edit Career Opportunity") : t("نشر فرصة مهنية جديدة", "Post New Career Opportunity")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 overflow-y-auto flex-1 space-y-4">
              <form id="career-form" onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("المسمى الوظيفي / عنوان التدريب", "Job / Internship Title")}</label>
                  <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Frontend Developer Intern" className="text-xs" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("اسم الشركة / الجهة", "Company Name")}</label>
                    <Input value={formCompany} onChange={(e) => setFormCompany(e.target.value)} placeholder="Vodafone Egypt / ITWorx" className="text-xs" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("مكان العمل / المحافظة", "Location")}</label>
                    <Input value={formLocation} onChange={(e) => setFormLocation(e.target.value)} placeholder="Smart Village, Cairo / Remote" className="text-xs" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("نوع التقديم", "Opportunity Type")}</label>
                    <select value={formType} onChange={(e) => setFormType(e.target.value as any)} className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 cursor-pointer">
                      <option value="internship">{t("تدريب صيفي", "Internship")}</option>
                      <option value="remote">{t("عن بعد", "Remote")}</option>
                      <option value="part-time">{t("دوام جزئي", "Part Time")}</option>
                      <option value="freelance">{t("عمل حر", "Freelance")}</option>
                      <option value="graduate">{t("للخريجين", "Graduate")}</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("رابط التقديم المباشر", "Application URL")}</label>
                    <Input value={formLink} onChange={(e) => setFormLink(e.target.value)} placeholder="https://careers.company.com/apply" className="text-xs font-mono" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("الوصف والمهارات المطلوبة", "Description & Requirements")}</label>
                  <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} rows={3} className="w-full p-3 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100" />
                </div>
              </form>
            </CardContent>
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 shrink-0 flex gap-2 justify-end bg-zinc-50/50 dark:bg-zinc-950/50">
              <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)} className="text-xs font-bold cursor-pointer">
                {t("إلغاء", "Cancel")}
              </Button>
              <Button type="submit" form="career-form" size="sm" className="text-xs font-bold cursor-pointer" isLoading={isSubmitting} disabled={isSubmitting}>
                {editingId ? t("حفظ التحديثات", "Save Changes") : t("نشر الفرصة", "Publish Opportunity")}
              </Button>
            </div>
          </Card>
        </div>,
        document.body
      )}
    </div>
  );
}
