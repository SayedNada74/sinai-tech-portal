"use client";

import * as React from "react";
import { useAdmin } from "@/context/admin-context";
import { useApp } from "@/context/app-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Shield,
  Save,
  Globe,
  Bell,
  Sliders,
  UserCheck,
  AlertOctagon,
  Sparkles,
  Info,
  Briefcase,
  Award,
  GraduationCap,
  FileText,
  MessageSquare,
  Users,
  CheckCircle2
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/context/auth-context";

export default function PlatformSettingsPage() {
  const { t, dir } = useApp();
  const { settings, updateSettings, logAction } = useAdmin();
  const { toast } = useToast();
  const { user } = useAuth();

  if (user && user.role !== "super-admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
        <div className="h-16 w-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-3xl">
          <Shield className="h-8 w-8 text-rose-500" />
        </div>
        <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
          {t("هذه الصفحة مخصصة فقط للمشرف الأعلى (Super Admin)", "Restricted to Super Admin only")}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
          {t("لا تملك الصلاحية الكافية لتعديل إعدادات النظام ومفاتيح الخصائص.", "You do not have sufficient clearance to modify system settings and feature flags.")}
        </p>
      </div>
    );
  }

  // Form Fields
  const [siteName, setSiteName] = React.useState(settings.siteName);
  const [logo, setLogo] = React.useState(settings.logo || "🎓");
  const [contactEmail, setContactEmail] = React.useState(settings.contactEmail);
  const [maintenanceMode, setMaintenanceMode] = React.useState(settings.maintenanceMode);

  // Feature Flags State
  const [flagGpa, setFlagGpa] = React.useState(settings.featureFlags?.gpaPredictor ?? true);
  const [flagTranscript, setFlagTranscript] = React.useState(settings.featureFlags?.semesterTranscript ?? true);
  const [flagAi, setFlagAi] = React.useState(settings.featureFlags?.aiAssistant ?? true);
  const [flagCareers, setFlagCareers] = React.useState(settings.featureFlags?.careersPortal ?? true);
  const [flagCertificates, setFlagCertificates] = React.useState(settings.featureFlags?.freeCertificatesHub ?? true);
  const [flagReviews, setFlagReviews] = React.useState(settings.featureFlags?.courseReviews ?? true);
  const [flagSharing, setFlagSharing] = React.useState(settings.featureFlags?.resourceSharing ?? true);
  const [flagAnnouncements, setFlagAnnouncements] = React.useState(settings.featureFlags?.liveAnnouncements ?? true);
  const [flagDirectory, setFlagDirectory] = React.useState(settings.featureFlags?.studentDirectory ?? true);

  React.useEffect(() => {
    setSiteName(settings.siteName);
    setLogo(settings.logo || "🎓");
    setContactEmail(settings.contactEmail);
    setMaintenanceMode(settings.maintenanceMode);

    setFlagGpa(settings.featureFlags?.gpaPredictor ?? true);
    setFlagTranscript(settings.featureFlags?.semesterTranscript ?? true);
    setFlagAi(settings.featureFlags?.aiAssistant ?? true);
    setFlagCareers(settings.featureFlags?.careersPortal ?? true);
    setFlagCertificates(settings.featureFlags?.freeCertificatesHub ?? true);
    setFlagReviews(settings.featureFlags?.courseReviews ?? true);
    setFlagSharing(settings.featureFlags?.resourceSharing ?? true);
    setFlagAnnouncements(settings.featureFlags?.liveAnnouncements ?? true);
    setFlagDirectory(settings.featureFlags?.studentDirectory ?? true);
  }, [settings]);

  // Submit Settings
  const handleSaveSettings = () => {
    updateSettings({
      siteName,
      logo,
      contactEmail,
      maintenanceMode,
      featureFlags: {
        gpaPredictor: flagGpa,
        semesterTranscript: flagTranscript,
        aiAssistant: flagAi,
        careersPortal: flagCareers,
        freeCertificatesHub: flagCertificates,
        courseReviews: flagReviews,
        resourceSharing: flagSharing,
        liveAnnouncements: flagAnnouncements,
        studentDirectory: flagDirectory
      }
    });

    logAction("تحديث إعدادات المنصة", "تم تعديل اسم المنصة، البريد، وضع الصيانة، ومفاتيح الميزات الحديثة.", "settings");
    toast(t("تم حفظ وتحديث كافة إعدادات المنصة ومفاتيح الميزات بنجاح!", "System core settings and feature flags updated successfully!"), "success");
  };

  const featureFlagsList = [
    {
      id: "gpa",
      labelAr: "حاسبة ومخطط المعدل التراكمي (GPA)",
      labelEn: "GPA Calculator & Predictor",
      icon: GraduationCap,
      state: flagGpa,
      setState: setFlagGpa
    },
    {
      id: "transcript",
      labelAr: "السجل الأكاديمي التلقائي للترانسكريبت",
      labelEn: "Automated Academic Transcript",
      icon: FileText,
      state: flagTranscript,
      setState: setFlagTranscript
    },
    {
      id: "ai",
      labelAr: "المساعد الأكاديمي الذكي (AI Assistant)",
      labelEn: "AI Assistant & Knowledge Engine",
      icon: Sparkles,
      state: flagAi,
      setState: setFlagAi
    },
    {
      id: "careers",
      labelAr: "بوابة التوظيف والتدريبات الصيفية",
      labelEn: "Careers & Internships Portal",
      icon: Briefcase,
      state: flagCareers,
      setState: setFlagCareers
    },
    {
      id: "certificates",
      labelAr: "دليل الشهادات والمنصات المجانية المعتمدة",
      labelEn: "Free Verified Certificates Hub",
      icon: Award,
      state: flagCertificates,
      setState: setFlagCertificates
    },
    {
      id: "reviews",
      labelAr: "تقييمات ومراجعات المقررات الدراسية",
      labelEn: "Course Reviews & Ratings",
      icon: MessageSquare,
      state: flagReviews,
      setState: setFlagReviews
    },
    {
      id: "sharing",
      labelAr: "مشاركة وتحميل الملفات الأكاديمية",
      labelEn: "Academic Resource Sharing",
      icon: FileText,
      state: flagSharing,
      setState: setFlagSharing
    },
    {
      id: "announcements",
      labelAr: "شريط الإعلانات والتنبيهات المباشرة",
      labelEn: "Live Announcement Banner",
      icon: Bell,
      state: flagAnnouncements,
      setState: setFlagAnnouncements
    },
    {
      id: "directory",
      labelAr: "دليل الطلاب والمنتدى الاجتماعي",
      labelEn: "Student Directory & Community Hub",
      icon: Users,
      state: flagDirectory,
      setState: setFlagDirectory
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in" dir={dir}>
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5">
            <Sliders className="h-6 w-6 text-sky-500" />
            <span>{t("إعدادات المنصة ومفاتيح الميزات", "Platform Settings & Feature Flags")}</span>
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {t("التحكم في هوية المنصة، تفعيل/تعطيل وضع الصيانة، وتخصيص الميزات المتاحة لطلاب جامعة سيناء.", "Control platform identity, enable/disable maintenance mode, and manage feature flags.")}
          </p>
        </div>

        <Button onClick={handleSaveSettings} className="gap-2 text-xs font-bold w-full sm:w-auto justify-center shrink-0">
          <Save className="h-4 w-4" />
          {t("حفظ جميع الإعدادات", "Save All Settings")}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Platform Identity & Core Setup */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <CardTitle className="text-base font-extrabold flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
                <Globe className="h-5 w-5 text-sky-500" />
                {t("الهوية والبيانات الأساسية للموقع", "Identity & Basic System Info")}
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("اسم المنصة والكلية", "Platform Name")}</label>
                  <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="text-xs font-bold" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("شعار المنصة النصي", "Logo Text / Badge")}</label>
                  <Input value={logo} onChange={(e) => setLogo(e.target.value)} className="text-xs font-bold" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("البريد الإلكتروني للدعم الفني والتواصل", "Support & Contact Email")}</label>
                <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="text-xs font-mono" />
              </div>

              {/* Maintenance Mode Card */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between gap-4 mt-2">
                <div className="flex items-center gap-3">
                  <AlertOctagon className="h-5 w-5 text-amber-500 shrink-0" />
                  <div>
                    <h4 className="font-extrabold text-xs text-amber-900 dark:text-amber-300">{t("وضع الصيانة المؤقت (Maintenance Mode)", "Maintenance Mode")}</h4>
                    <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                      {t("إظهار شريط تنبيه الصيانة لجميع الطلاب بالمنصة وتعليق التعديلات المؤقتة.", "Show maintenance notification banner across the student portal.")}
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="h-5 w-5 rounded text-sky-600 accent-sky-600 focus:ring-0 cursor-pointer shrink-0"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Feature Flags Management */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-extrabold flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
                  <Sliders className="h-5 w-5 text-sky-500" />
                  {t("مفاتيح الميزات (Feature Flags)", "Feature Flags")}
                </CardTitle>
                <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400 text-[10px] font-bold">
                  {featureFlagsList.filter(f => f.state).length} / {featureFlagsList.length} {t("مفعّلة", "Active")}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-3">
              {featureFlagsList.map((flag) => {
                const IconComp = flag.icon;
                return (
                  <div
                    key={flag.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                      flag.state
                        ? "bg-sky-50/50 dark:bg-sky-950/20 border-sky-200/60 dark:border-sky-900/40"
                        : "bg-zinc-50/80 dark:bg-zinc-950/40 border-zinc-200/60 dark:border-zinc-800/60 opacity-60"
                    }`}
                    onClick={() => flag.setState(!flag.state)}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <IconComp className={`h-4 w-4 shrink-0 ${flag.state ? "text-sky-600 dark:text-sky-400" : "text-zinc-400"}`} />
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
                        {t(flag.labelAr, flag.labelEn)}
                      </span>
                    </div>

                    <input
                      type="checkbox"
                      checked={flag.state}
                      onChange={(e) => {
                        e.stopPropagation();
                        flag.setState(e.target.checked);
                      }}
                      className="h-4 w-4 text-sky-600 accent-sky-600 focus:ring-0 cursor-pointer shrink-0"
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

