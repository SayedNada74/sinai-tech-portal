"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useSocial, CareerOpportunity, FreeCertificateItem } from "@/context/social-context";
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
  Award,
  Building2,
  MapPin,
  ExternalLink,
  Check,
  X,
  Clock,
  Globe
} from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function AdminCareersPage() {
  const { t, dir, lang } = useApp();
  const { toast } = useToast();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const {
    careers,
    addCareer,
    editCareer,
    deleteCareer,
    freeCertificates,
    addFreeCertificate,
    editFreeCertificate,
    deleteFreeCertificate
  } = useSocial();

  const [activeTab, setActiveTab] = React.useState<"jobs" | "certificates">("jobs");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("ALL");

  // Job Modal State
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  // Job Form State
  const [formTitle, setFormTitle] = React.useState("");
  const [formCompany, setFormCompany] = React.useState("");
  const [formLocation, setFormLocation] = React.useState("مصر / Remotely");
  const [formType, setFormType] = React.useState<CareerOpportunity["type"]>("internship");
  const [formDesc, setFormDesc] = React.useState("");
  const [formLink, setFormLink] = React.useState("https://example.com");
  const [formDept, setFormDept] = React.useState<CareerOpportunity["department"]>("all");
  const [formExp, setFormExp] = React.useState<CareerOpportunity["experience"]>("entry");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Certificate Modal State
  const [certModalOpen, setCertModalOpen] = React.useState(false);
  const [editingCertId, setEditingCertId] = React.useState<string | null>(null);

  // Certificate Form State
  const [certTitleAr, setCertTitleAr] = React.useState("");
  const [certTitleEn, setCertTitleEn] = React.useState("");
  const [certProvider, setCertProvider] = React.useState("");
  const [certCategory, setCertCategory] = React.useState<FreeCertificateItem["category"]>("ai_data");
  const [certDuration, setCertDuration] = React.useState("15 ساعة تدريبية");
  const [certLanguage, setCertLanguage] = React.useState("العربية / الإنجليزية");
  const [certDescAr, setCertDescAr] = React.useState("");
  const [certDescEn, setCertDescEn] = React.useState("");
  const [certSkillsStr, setCertSkillsStr] = React.useState("");
  const [certLink, setCertLink] = React.useState("");

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

  const openCreateCertModal = () => {
    setEditingCertId(null);
    setCertTitleAr("");
    setCertTitleEn("");
    setCertProvider("");
    setCertCategory("ai_data");
    setCertDuration("15 ساعة تدريبية");
    setCertLanguage("العربية / الإنجليزية");
    setCertDescAr("");
    setCertDescEn("");
    setCertSkillsStr("");
    setCertLink("https://");
    setCertModalOpen(true);
  };

  const openEditCertModal = (cert: FreeCertificateItem) => {
    setEditingCertId(cert.id);
    setCertTitleAr(cert.titleAr);
    setCertTitleEn(cert.titleEn);
    setCertProvider(cert.provider);
    setCertCategory(cert.category);
    setCertDuration(cert.duration);
    setCertLanguage(cert.language);
    setCertDescAr(cert.descAr);
    setCertDescEn(cert.descEn);
    setCertSkillsStr(cert.skills ? cert.skills.join(", ") : "");
    setCertLink(cert.link);
    setCertModalOpen(true);
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

  const filteredCertificates = React.useMemo(() => {
    return (freeCertificates || []).filter((cert) => {
      const q = searchTerm.toLowerCase().trim();
      return (
        !q ||
        cert.titleAr.toLowerCase().includes(q) ||
        cert.titleEn.toLowerCase().includes(q) ||
        cert.provider.toLowerCase().includes(q)
      );
    });
  }, [freeCertificates, searchTerm]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formTitle || !formCompany || !formLink) {
      toast(t("يرجى ملء المسمّى الوظيفي، اسم الشركة، ورابط التقديم.", "Please enter job title, company name, and application URL."), "error");
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
        toast(t("تم تعديل بيانات الفرصة بنجاح!", "Opportunity updated successfully!"), "success");
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
        toast(t("تم نشر فرصة التوظيف/التدريب بنجاح!", "Opportunity published successfully!"), "success");
      }
      setModalOpen(false);
    } catch (err) {
      toast(t("حدث خطأ أثناء حفظ الفرصة.", "An error occurred while saving."), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitleAr || !certProvider || !certLink) {
      toast(t("يرجى إدخال اسم الشهادة، الجهة المانحة، ورابط التعلم المباشر.", "Please enter title, provider, and direct URL."), "error");
      return;
    }

    const categoryLabels: Record<string, { ar: string; en: string }> = {
      ai_data: { ar: "الذكاء الاصطناعي وعلوم البيانات", en: "AI & Data Science" },
      web_software: { ar: "تطوير الويب والبرمجيات", en: "Web & Software Dev" },
      cybersecurity_networks: { ar: "الأمن السيبراني والشبكات", en: "Cybersecurity & Networks" },
      cloud_tech: { ar: "الحوسبة السحابية والإدارة", en: "Cloud & Management" }
    };

    const catLabel = categoryLabels[certCategory] || categoryLabels["ai_data"];
    const parsedSkills = certSkillsStr.split(",").map((s) => s.trim()).filter(Boolean);

    try {
      if (editingCertId) {
        await editFreeCertificate(editingCertId, {
          titleAr: certTitleAr,
          titleEn: certTitleEn || certTitleAr,
          provider: certProvider,
          category: certCategory,
          categoryAr: catLabel.ar,
          categoryEn: catLabel.en,
          duration: certDuration,
          language: certLanguage,
          descAr: certDescAr || certTitleAr,
          descEn: certDescEn || certTitleEn || certTitleAr,
          skills: parsedSkills,
          link: certLink
        });
        toast(t("تم تعديل بيانات الشهادة بنجاح!", "Certificate updated successfully!"), "success");
      } else {
        await addFreeCertificate({
          titleAr: certTitleAr,
          titleEn: certTitleEn || certTitleAr,
          provider: certProvider,
          category: certCategory,
          categoryAr: catLabel.ar,
          categoryEn: catLabel.en,
          duration: certDuration,
          language: certLanguage,
          descAr: certDescAr || certTitleAr,
          descEn: certDescEn || certTitleEn || certTitleAr,
          skills: parsedSkills,
          link: certLink
        });
        toast(t("تم إضافة الشهادة الكورس المجاني بنجاح!", "Certificate added successfully!"), "success");
      }
      setCertModalOpen(false);
    } catch (err) {
      toast(t("حدث خطأ أثناء حفظ الشهادة.", "An error occurred while saving."), "error");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" dir={dir}>
      {/* Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
            {t("بوابة إدارة الفرص والشهادات الرسمية", "Careers & Certifications Management")}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {t("نشر وإدارة التقديمات على الفرص الوظيفية ودليل المنصات والشهادات المجانية المعتمدة.", "Publish & manage job listings, summer internships, and free verified certificates hub.")}
          </p>
        </div>

        {activeTab === "jobs" ? (
          <Button onClick={openCreateModal} className="gap-2 text-xs font-bold w-full sm:w-auto justify-center shrink-0">
            <Plus className="h-4 w-4" />
            {t("نشر فرصة جديدة", "Post New Career")}
          </Button>
        ) : (
          <Button onClick={openCreateCertModal} className="gap-2 text-xs font-bold w-full sm:w-auto justify-center shrink-0">
            <Plus className="h-4 w-4" />
            {t("إضافة شهادة مجانية جديدة", "Add Free Certificate")}
          </Button>
        )}
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-4">
        <button
          onClick={() => setActiveTab("jobs")}
          className={`pb-3 text-xs font-extrabold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === "jobs"
              ? "border-sky-600 text-sky-600 dark:text-sky-400"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          <Briefcase className="h-4 w-4" />
          <span>{t("إدارة فرص التوظيف والتدريب الصيفي", "Jobs & Internships")}</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{careers.length}</Badge>
        </button>

        <button
          onClick={() => setActiveTab("certificates")}
          className={`pb-3 text-xs font-extrabold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === "certificates"
              ? "border-sky-600 text-sky-600 dark:text-sky-400"
              : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          <Award className="h-4 w-4" />
          <span>{t("إدارة دليل الشهادات والمنصات المجانية", "Free Certificates Hub")}</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{freeCertificates?.length || 0}</Badge>
        </button>
      </div>

      {/* Search Bar */}
      <Card className="border border-zinc-200/50 bg-white dark:bg-zinc-900 shadow-sm">
        <CardContent className="p-3 sm:p-4 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className={`absolute ${lang === "ar" ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400`} />
            <Input
              type="text"
              placeholder={
                activeTab === "jobs"
                  ? t("ابحث بالوظيفة، الشركة، أو مكان العمل...", "Search by job title, company, or location...")
                  : t("ابحث باسم الشهادة، الكورس، أو الجهة المانحة...", "Search by certificate title or provider...")
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={lang === "ar" ? "pr-10" : "pl-10"}
            />
          </div>

          {activeTab === "jobs" && (
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-150 cursor-pointer w-full md:w-auto"
            >
              <option value="ALL">{t("جميع أنواع الفرص", "All Career Types")}</option>
              <option value="internship">{t("تدريب صيفي", "Internships")}</option>
              <option value="remote">{t("عن بعد", "Remote")}</option>
              <option value="part-time">{t("دوام جزئي", "Part Time")}</option>
              <option value="freelance">{t("عمل حر", "Freelance")}</option>
              <option value="graduate">{t("للخريجين", "Graduate")}</option>
            </select>
          )}
        </CardContent>
      </Card>

      {/* Tab 1: Careers Grid */}
      {activeTab === "jobs" ? (
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
                  <CardDescription className="text-xs font-semibold text-sky-600 dark:text-sky-400">
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
      ) : (
        /* Tab 2: Free Certificates Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCertificates.length > 0 ? (
            filteredCertificates.map((cert) => (
              <Card key={cert.id} className="border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400 text-[10px] px-2 py-0.5 font-bold">
                      {cert.provider}
                    </Badge>
                    <Badge variant="outline" className="text-[9px] font-bold shrink-0">
                      {cert.categoryAr}
                    </Badge>
                  </div>

                  <CardTitle className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 mt-2 line-clamp-1">
                    {t(cert.titleAr, cert.titleEn)}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pb-3 text-xs space-y-2">
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {t(cert.descAr, cert.descEn)}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-bold pt-1">
                    <span>⏱ {cert.duration}</span>
                    <span>🌐 {cert.language}</span>
                  </div>
                </CardContent>

                <div className="p-4 pt-0 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditCertModal(cert)}
                    className="flex-1 text-[10px] font-bold h-8 gap-1 cursor-pointer"
                  >
                    <Edit2 className="h-3 w-3" />
                    {t("تعديل الشهادة", "Edit Certificate")}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm(t(`حذف شهادة [${cert.titleAr}] نهائياً؟`, `Permanently delete [${cert.titleAr}]?`))) {
                        deleteFreeCertificate(cert.id);
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
              {t("لا توجد شهادات مجانية متطابقة", "No free certificates match search query")}
            </div>
          )}
        </div>
      )}

      {/* Modal 1: Job Opportunity */}
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
                  <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Software Engineering Intern" className="text-xs" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("اسم الشركة / الجهة", "Company Name")}</label>
                    <Input value={formCompany} onChange={(e) => setFormCompany(e.target.value)} placeholder="Siemens / IBM / Paymob" className="text-xs" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("مكان العمل / المحافظة", "Location")}</label>
                    <Input value={formLocation} onChange={(e) => setFormLocation(e.target.value)} placeholder="Cairo / Remote" className="text-xs" />
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

      {/* Modal 2: Free Certificate */}
      {certModalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <Card className="w-full max-w-lg max-h-[90vh] my-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-3xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
              <CardTitle className="text-base font-bold">
                {editingCertId ? t("تعديل تفاصيل الشهادة الكورس المجاني", "Edit Certificate Course") : t("إضافة شهادة وكورس مجاني جديد", "Add New Free Certificate")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 overflow-y-auto flex-1 space-y-4">
              <form id="cert-form" onSubmit={handleSaveCert} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("عنوان الشهادة (بالعربية)", "Certificate Title (Arabic)")}</label>
                  <Input value={certTitleAr} onChange={(e) => setCertTitleAr(e.target.value)} placeholder="شهادة الأساسيات في البرمجة" className="text-xs" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("عنوان الشهادة (بالإنجليزي - اختياري)", "Certificate Title (English)")}</label>
                  <Input value={certTitleEn} onChange={(e) => setCertTitleEn(e.target.value)} placeholder="CS50 Programming Certificate" className="text-xs" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("الجهة المانحة / المنصة", "Provider")}</label>
                    <Input value={certProvider} onChange={(e) => setCertProvider(e.target.value)} placeholder="Google / Harvard / Cisco / MaharaTech" className="text-xs" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("التخصص الأكاديمي", "Domain Category")}</label>
                    <select value={certCategory} onChange={(e) => setCertCategory(e.target.value as any)} className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 cursor-pointer">
                      <option value="ai_data">{t("الذكاء الاصطناعي وعلوم البيانات", "AI & Data Science")}</option>
                      <option value="web_software">{t("تطوير الويب والبرمجيات", "Web & Software Dev")}</option>
                      <option value="cybersecurity_networks">{t("الأمن السيبراني والشبكات", "Cybersecurity & Networks")}</option>
                      <option value="cloud_tech">{t("الحوسبة السحابية والإدارة", "Cloud & Management")}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("مدة التدريب", "Duration")}</label>
                    <Input value={certDuration} onChange={(e) => setCertDuration(e.target.value)} placeholder="15 ساعة تدريبية" className="text-xs" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("لغة الدراسة", "Language")}</label>
                    <Input value={certLanguage} onChange={(e) => setCertLanguage(e.target.value)} placeholder="العربية / الإنجليزية" className="text-xs" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("رابط الكورس المباشر", "Direct Enrollment URL")}</label>
                  <Input value={certLink} onChange={(e) => setCertLink(e.target.value)} placeholder="https://cs50.harvard.edu/x/" className="text-xs font-mono" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("المهارات (مفصولة بفواصل)", "Skills (Comma separated)")}</label>
                  <Input value={certSkillsStr} onChange={(e) => setCertSkillsStr(e.target.value)} placeholder="Python, Algorithms, SQL" className="text-xs" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("الشرح والوصف الموجز", "Description")}</label>
                  <textarea value={certDescAr} onChange={(e) => setCertDescAr(e.target.value)} rows={3} className="w-full p-3 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100" />
                </div>
              </form>
            </CardContent>
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 shrink-0 flex gap-2 justify-end bg-zinc-50/50 dark:bg-zinc-950/50">
              <Button type="button" variant="outline" size="sm" onClick={() => setCertModalOpen(false)} className="text-xs font-bold cursor-pointer">
                {t("إلغاء", "Cancel")}
              </Button>
              <Button type="submit" form="cert-form" size="sm" className="text-xs font-bold cursor-pointer">
                {editingCertId ? t("حفظ التعديلات", "Save Changes") : t("إضافة الشهادة", "Add Certificate")}
              </Button>
            </div>
          </Card>
        </div>,
        document.body
      )}
    </div>
  );
}
