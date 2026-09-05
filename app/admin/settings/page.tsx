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
  CheckCircle2,
  Calculator,
  Calendar
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/context/auth-context";

export default function PlatformSettingsPage() {
  const { t, dir } = useApp();
  const { settings, updateSettings, logAction } = useAdmin();
  const { toast } = useToast();
  const { user } = useAuth();

  const isStaff = user?.role === "admin" || user?.role === "super-admin" || user?.role === "moderator";

  if (user && !isStaff) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
        <div className="h-16 w-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-3xl">
          <Shield className="h-8 w-8 text-rose-500" />
        </div>
        <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
          {t("هذه الصفحة مخصصة فقط للكادر الإداري", "Restricted to Administrative Staff only")}
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

  // Feature Access State (3-state: ALL / ADMIN_ONLY / DISABLED)
  type FAStatus = "ALL" | "ADMIN_ONLY" | "DISABLED";
  const fa = settings.featureAccess || {
    gpa: "ALL",
    gpaRegular: "ALL",
    gpaFlexible: "ALL",
    aiAssistant: "ALL",
    careers: "ALL",
    courseReviews: "ALL",
    resourceSharing: "ALL",
    studentDirectory: "ALL",
    planner: "ALL"
  };

  const [accessGpaRegular, setAccessGpaRegular] = React.useState<FAStatus>(fa.gpaRegular || fa.gpa || "ALL");
  const [accessGpaFlexible, setAccessGpaFlexible] = React.useState<FAStatus>(fa.gpaFlexible || fa.gpa || "ALL");
  const [accessAi, setAccessAi] = React.useState<FAStatus>(fa.aiAssistant || "ALL");
  const [accessCareers, setAccessCareers] = React.useState<FAStatus>(fa.careers || "ALL");
  const [accessReviews, setAccessReviews] = React.useState<FAStatus>(fa.courseReviews || "ALL");
  const [accessSharing, setAccessSharing] = React.useState<FAStatus>(fa.resourceSharing || "ALL");
  const [accessDirectory, setAccessDirectory] = React.useState<FAStatus>(fa.studentDirectory || "ALL");
  const [accessPlanner, setAccessPlanner] = React.useState<FAStatus>(fa.planner || "ALL");

  // Simple boolean flags (for features that don't need 3-state)
  const [flagTranscript, setFlagTranscript] = React.useState(settings.featureFlags?.semesterTranscript ?? true);
  const [flagCertificates, setFlagCertificates] = React.useState(settings.featureFlags?.freeCertificatesHub ?? true);
  const [flagAnnouncements, setFlagAnnouncements] = React.useState(settings.featureFlags?.liveAnnouncements ?? true);

  React.useEffect(() => {
    setSiteName(settings.siteName);
    setLogo(settings.logo || "🎓");
    setContactEmail(settings.contactEmail);
    setMaintenanceMode(settings.maintenanceMode);

    const f = settings.featureAccess || {
      gpa: "ALL",
      gpaRegular: "ALL",
      gpaFlexible: "ALL",
      aiAssistant: "ALL",
      careers: "ALL",
      courseReviews: "ALL",
      resourceSharing: "ALL",
      studentDirectory: "ALL",
      planner: "ALL"
    };
    setAccessGpaRegular(f.gpaRegular || f.gpa || "ALL");
    setAccessGpaFlexible(f.gpaFlexible || f.gpa || "ALL");
    setAccessAi(f.aiAssistant || "ALL");
    setAccessCareers(f.careers || "ALL");
    setAccessReviews(f.courseReviews || "ALL");
    setAccessSharing(f.resourceSharing || "ALL");
    setAccessDirectory(f.studentDirectory || "ALL");
    setAccessPlanner(f.planner || "ALL");

    setFlagTranscript(settings.featureFlags?.semesterTranscript ?? true);
    setFlagCertificates(settings.featureFlags?.freeCertificatesHub ?? true);
    setFlagAnnouncements(settings.featureFlags?.liveAnnouncements ?? true);
  }, [settings]);

  // Submit Settings
  const handleSaveSettings = () => {
    const featureAccess = {
      gpa: (accessGpaRegular !== "DISABLED" || accessGpaFlexible !== "DISABLED") ? "ALL" as FAStatus : "ALL" as FAStatus,
      gpaRegular: accessGpaRegular,
      gpaFlexible: accessGpaFlexible,
      aiAssistant: accessAi,
      careers: accessCareers,
      courseReviews: accessReviews,
      resourceSharing: accessSharing,
      studentDirectory: accessDirectory,
      planner: accessPlanner
    };

    updateSettings({
      siteName,
      logo,
      contactEmail,
      maintenanceMode,
      gpaFeatureStatus: accessGpaRegular,
      featureAccess,
      featureFlags: {
        gpaPredictor: true,
        aiAssistant: accessAi !== "DISABLED",
        courseReviews: accessReviews !== "DISABLED",
        resourceSharing: accessSharing !== "DISABLED",
        careersPortal: accessCareers !== "DISABLED",
        freeCertificatesHub: flagCertificates,
        semesterTranscript: flagTranscript,
        liveAnnouncements: flagAnnouncements,
        studentDirectory: accessDirectory !== "DISABLED"
      }
    });

    logAction("تحديث إعدادات المنصة", "تم تعديل اسم المنصة، البريد، وضع الصيانة، ومفاتيح الميزات الحديثة.", "settings");
    toast(t("تم حفظ وتحديث كافة إعدادات المنصة ومفاتيح الميزات بنجاح!", "System core settings and feature flags updated successfully!"), "success");
  };

  // Feature access items for the unified 3-state UI
  const featureAccessItems: { key: string; labelAr: string; labelEn: string; descAr: string; descEn: string; icon: any; value: FAStatus; setValue: (v: FAStatus) => void }[] = [
    {
      key: "gpaRegular",
      labelAr: "المسار المنتظم (حاسبة الفصل - افتراضي)",
      labelEn: "Regular Track (Semester Calculator - Default)",
      descAr: "حاسبة الفصل للترتيب القياسي للكلية (الفرقة 1 إلى 4) مع سجل المقررات الافتراضي.",
      descEn: "Standard 4-year curriculum semester calculator with default course records.",
      icon: Calculator,
      value: accessGpaRegular,
      setValue: setAccessGpaRegular
    },
    {
      key: "gpaFlexible",
      labelAr: "المسار الفصلي المرن (الساعات المعتمدة)",
      labelEn: "Flexible Semester Track (Credit Hours)",
      descAr: "نظام الفصول المرنة للتسجيل الحر، السمر كورس، والإنذار الأكاديمي (12 ساعة).",
      descEn: "Flexible timeline for irregular terms, summer registration, and probation caps.",
      icon: Calendar,
      value: accessGpaFlexible,
      setValue: setAccessGpaFlexible
    },
    { key: "aiAssistant", labelAr: "المرشد الأكاديمي الذكي (AI)", labelEn: "AI Academic Assistant", descAr: "المساعد الذكي للإرشاد الأكاديمي بالذكاء الاصطناعي.", descEn: "AI-powered academic counselor & assistant.", icon: Sparkles, value: accessAi, setValue: setAccessAi },
    { key: "careers", labelAr: "بوابة التوظيف والتدريبات", labelEn: "Careers & Internships Portal", descAr: "فرص العمل والتدريب الصيفي والمهني.", descEn: "Job listings, internships, and career resources.", icon: Briefcase, value: accessCareers, setValue: setAccessCareers },
    { key: "planner", labelAr: "مخطط التسجيل الذكي", labelEn: "Smart Registration Planner", descAr: "التخطيط الذكي للفصول الدراسية والمواد.", descEn: "Intelligent semester & course registration planner.", icon: Sliders, value: accessPlanner, setValue: setAccessPlanner },
    { key: "courseReviews", labelAr: "تقييمات ومراجعات المقررات", labelEn: "Course Reviews & Ratings", descAr: "آراء وتقييمات الطلاب عن المقررات الدراسية.", descEn: "Student reviews and ratings for courses.", icon: MessageSquare, value: accessReviews, setValue: setAccessReviews },
    { key: "resourceSharing", labelAr: "مشاركة الملفات الأكاديمية", labelEn: "Academic Resource Sharing", descAr: "رفع وتحميل الملفات والملخصات الدراسية.", descEn: "Upload & download academic files and summaries.", icon: FileText, value: accessSharing, setValue: setAccessSharing },
    { key: "studentDirectory", labelAr: "دليل الطلاب والمنتدى", labelEn: "Student Directory & Community", descAr: "دليل الطلاب المسجلين والتواصل الاجتماعي.", descEn: "Registered students directory and social hub.", icon: Users, value: accessDirectory, setValue: setAccessDirectory },
  ];

  const statusColors: Record<FAStatus, { border: string; bg: string; text: string; emoji: string }> = {
    ALL: { border: "border-emerald-500/30 dark:border-emerald-500/20", bg: "bg-emerald-50/60 dark:bg-emerald-950/20", text: "text-emerald-700 dark:text-emerald-400", emoji: "✅" },
    ADMIN_ONLY: { border: "border-amber-500/30 dark:border-amber-500/20", bg: "bg-amber-50/60 dark:bg-amber-950/20", text: "text-amber-700 dark:text-amber-400", emoji: "🔒" },
    DISABLED: { border: "border-zinc-300 dark:border-zinc-700", bg: "bg-zinc-50/60 dark:bg-zinc-800/40", text: "text-zinc-500 dark:text-zinc-400", emoji: "❌" }
  };

  // Simple boolean flags
  const simpleFlagsList = [
    { id: "transcript", labelAr: "السجل الأكاديمي التلقائي", labelEn: "Automated Academic Transcript", icon: GraduationCap, state: flagTranscript, setState: setFlagTranscript },
    { id: "certificates", labelAr: "دليل الشهادات المجانية", labelEn: "Free Certificates Hub", icon: Award, state: flagCertificates, setState: setFlagCertificates },
    { id: "announcements", labelAr: "شريط الإعلانات المباشرة", labelEn: "Live Announcement Banner", icon: Bell, state: flagAnnouncements, setState: setFlagAnnouncements },
  ];

  const activeCount = featureAccessItems.filter(f => f.value === "ALL").length;
  const adminOnlyCount = featureAccessItems.filter(f => f.value === "ADMIN_ONLY").length;

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

      {/* Identity & Maintenance */}
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

          {/* Maintenance Mode */}
          <div className={`p-4 rounded-2xl flex items-center justify-between gap-4 mt-2 border transition-colors ${maintenanceMode ? "bg-red-500/10 border-red-500/30" : "bg-amber-500/10 border-amber-500/20"}`}>
            <div className="flex items-center gap-3">
              <AlertOctagon className={`h-5 w-5 shrink-0 ${maintenanceMode ? "text-red-500 animate-pulse" : "text-amber-500"}`} />
              <div>
                <h4 className={`font-extrabold text-xs ${maintenanceMode ? "text-red-900 dark:text-red-300" : "text-amber-900 dark:text-amber-300"}`}>
                  {t("وضع الصيانة الكامل (Maintenance Mode)", "Full Maintenance Mode")}
                </h4>
                <p className={`text-[11px] mt-0.5 ${maintenanceMode ? "text-red-700 dark:text-red-400" : "text-amber-700 dark:text-amber-400"}`}>
                  {maintenanceMode
                    ? t("⚠️ مفعّل الآن — الطلاب ممنوعون من الوصول للمنصة ويرون صفحة صيانة كاملة.", "⚠️ ACTIVE — Students are blocked and see a full maintenance page.")
                    : t("عند التفعيل: يتم منع الطلاب من الوصول للمنصة كلياً ويُعرض لهم صفحة صيانة.", "When enabled: Students are fully blocked and see a maintenance page.")
                  }
                </p>
              </div>
            </div>

            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="h-5 w-5 rounded text-red-600 accent-red-600 focus:ring-0 cursor-pointer shrink-0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Feature Access Control — 3-State System */}
      <Card className="border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm rounded-3xl overflow-hidden">
        <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-base font-extrabold flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
              <Shield className="h-5 w-5 text-sky-500" />
              {t("التحكم المتقدم في صلاحيات الميزات", "Advanced Feature Access Control")}
            </CardTitle>
            <div className="flex gap-1.5">
              <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 text-[10px] font-bold border-transparent">
                ✅ {activeCount} {t("مفعّلة", "Active")}
              </Badge>
              {adminOnlyCount > 0 && (
                <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 text-[10px] font-bold border-transparent">
                  🔒 {adminOnlyCount} {t("للإدارة فقط", "Admin Only")}
                </Badge>
              )}
            </div>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
            {t("تحكم في كل ميزة بثلاث حالات: متاحة للجميع، للإدارة فقط (مخفية عن الطلاب)، أو معطلة كلياً.", "Control each feature with 3 states: Active for all, Admin-only (hidden from students), or Disabled.")}
          </p>
        </CardHeader>

        <CardContent className="pt-5 space-y-4">
          {/* Permanent What-If & GPA Note */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-300/40 dark:border-emerald-800/40 flex items-center gap-3 text-xs">
            <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed font-medium">
              {t(
                "💡 تنبيه: محاكي التوقع التراكمي (What-If) وحساب المعدل التراكمي متاحان دائماً للطلاب ومستمران في العمل بغض النظر عن حالة تفعيل المسارين أعلاه.",
                "💡 Note: The Cumulative GPA (What-If) Simulator and overall GPA calculation remain permanently available to students regardless of the two semester tracks above."
              )}
            </p>
          </div>

          {featureAccessItems.map((item) => {
            const IconComp = item.icon;
            const colors = statusColors[item.value];
            return (
              <div key={item.key} className={`p-4 rounded-2xl border transition-all ${colors.border} ${colors.bg}`}>
                <div className="flex items-start gap-3 mb-3">
                  <IconComp className={`h-5 w-5 shrink-0 mt-0.5 ${colors.text}`} />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50">
                      {t(item.labelAr, item.labelEn)}
                    </h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {t(item.descAr, item.descEn)}
                    </p>
                  </div>
                  <span className="text-lg shrink-0">{colors.emoji}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(["ALL", "ADMIN_ONLY", "DISABLED"] as FAStatus[]).map((status) => {
                    const isActive = item.value === status;
                    const labels: Record<FAStatus, { ar: string; en: string }> = {
                      ALL: { ar: "للجميع", en: "All Users" },
                      ADMIN_ONLY: { ar: "إدارة فقط", en: "Admin Only" },
                      DISABLED: { ar: "معطلة", en: "Disabled" }
                    };
                    const btnColors: Record<FAStatus, string> = {
                      ALL: isActive ? "bg-emerald-600 text-white border-emerald-600 shadow-sm" : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-emerald-400",
                      ADMIN_ONLY: isActive ? "bg-amber-500 text-white border-amber-500 shadow-sm" : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-amber-400",
                      DISABLED: isActive ? "bg-zinc-500 text-white border-zinc-500 shadow-sm" : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400"
                    };
                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => item.setValue(status)}
                        className={`px-2 py-1.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${btnColors[status]}`}
                      >
                        {t(labels[status].ar, labels[status].en)}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Simple Boolean Feature Flags */}
      <Card className="border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm rounded-3xl overflow-hidden">
        <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <CardTitle className="text-base font-extrabold flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
            <CheckCircle2 className="h-5 w-5 text-sky-500" />
            {t("ميزات إضافية (تشغيل/إيقاف)", "Additional Features (On/Off)")}
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-4 space-y-3">
          {simpleFlagsList.map((flag) => {
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
  );
}
