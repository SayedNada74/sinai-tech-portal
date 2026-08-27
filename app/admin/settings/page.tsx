"use client";

import * as React from "react";
import { useAdmin } from "@/context/admin-context";
import { useApp } from "@/context/app-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  Info
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
          👑
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
  const [logo, setLogo] = React.useState(settings.logo);
  const [contactEmail, setContactEmail] = React.useState(settings.contactEmail);
  const [maintenanceMode, setMaintenanceMode] = React.useState(settings.maintenanceMode);

  // Feature Flags
  const [flagGpa, setFlagGpa] = React.useState(settings.featureFlags.gpaPredictor);
  const [flagAi, setFlagAi] = React.useState(settings.featureFlags.aiAssistant);
  const [flagReviews, setFlagReviews] = React.useState(settings.featureFlags.courseReviews);
  const [flagSharing, setFlagSharing] = React.useState(settings.featureFlags.resourceSharing);

  React.useEffect(() => {
    setSiteName(settings.siteName);
    setLogo(settings.logo);
    setContactEmail(settings.contactEmail);
    setMaintenanceMode(settings.maintenanceMode);
    setFlagGpa(settings.featureFlags.gpaPredictor);
    setFlagAi(settings.featureFlags.aiAssistant);
    setFlagReviews(settings.featureFlags.courseReviews);
    setFlagSharing(settings.featureFlags.resourceSharing);
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
        aiAssistant: flagAi,
        courseReviews: flagReviews,
        resourceSharing: flagSharing
      }
    });

    logAction("تحديث إعدادات المنصة", "تغيير اسم المنصة، بريد التواصل، أو حالة مفاتيح الميزات.", "settings");
    toast(t("✅ تم حفظ وتحديث إعدادات النظام الرئيسية بنجاح.", "✅ System core settings updated successfully."), "success");
  };

  return (
    <div className="space-y-6 animate-fade-in" dir={dir}>
      {/* Title */}
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
          {t("إعدادات المنصة ومفاتيح الميزات", "Platform & Core System Settings")}
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          {t(
            "التحكم في هوية المنصة، تفعيل/تعطيل وضع الصيانة، وتخصيص الميزات المتاحة للطلاب.",
            "Control platform identity, enable/disable maintenance mode, and manage feature flags."
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Info Settings */}
        <Card className="border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm lg:col-span-2">
          <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Globe className="h-4.5 w-4.5 text-sky-600" />
              {t("الهوية والبيانات الأساسية للموقع", "Identity & Basic System Info")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("اسم المنصة والكلية", "Platform Name")}</label>
                <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="text-xs" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("شعار المنصة (رمز التعبير)", "Logo / Emoji")}</label>
                <Input value={logo} onChange={(e) => setLogo(e.target.value)} className="text-xs" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("البريد الإلكتروني لللدعم الفني والتواصل", "Support & Contact Email")}</label>
              <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="text-xs font-mono" />
            </div>

            {/* Maintenance Mode */}
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <AlertOctagon className="h-5 w-5 text-amber-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-xs text-amber-900 dark:text-amber-300">{t("وضع الصيانة المؤقت", "Maintenance Mode")}</h4>
                  <p className="text-[10px] text-amber-700 dark:text-amber-400 mt-0.5">
                    {t("إظهار شريط تنبيه الصيانة لجميع الطلاب بالمنصة.", "Show maintenance banner across the student portal.")}
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="h-5 w-5 rounded text-sky-600 accent-sky-600 focus:ring-0 cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>

        {/* Feature Flags Card */}
        <Card className="border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm">
          <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Sliders className="h-4.5 w-4.5 text-sky-600" />
              {t("مفاتيح الميزات (Feature Flags)", "Feature Flags")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-950/40 rounded-xl">
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{t("حاسبة المعدل التراكمي (GPA)", "GPA Calculator")}</span>
              <input type="checkbox" checked={flagGpa} onChange={(e) => setFlagGpa(e.target.checked)} className="h-4 w-4 text-sky-600 accent-sky-600 focus:ring-0 cursor-pointer" />
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-950/40 rounded-xl">
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{t("المساعد الذكي (AI Assistant)", "AI Assistant")}</span>
              <input type="checkbox" checked={flagAi} onChange={(e) => setFlagAi(e.target.checked)} className="h-4 w-4 text-sky-600 accent-sky-600 focus:ring-0 cursor-pointer" />
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-950/40 rounded-xl">
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{t("تقييم ومراجعة المواد", "Course Reviews")}</span>
              <input type="checkbox" checked={flagReviews} onChange={(e) => setFlagReviews(e.target.checked)} className="h-4 w-4 text-sky-600 accent-sky-600 focus:ring-0 cursor-pointer" />
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-950/40 rounded-xl">
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{t("مشاركة وتحميل الملفات", "Resource Sharing")}</span>
              <input type="checkbox" checked={flagSharing} onChange={(e) => setFlagSharing(e.target.checked)} className="h-4 w-4 text-sky-600 accent-sky-600 focus:ring-0 cursor-pointer" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={handleSaveSettings} className="gap-2 text-xs font-bold w-full sm:w-auto justify-center">
          <Save className="h-4 w-4" />
          {t("حفظ جميع الإعدادات", "Save All Settings")}
        </Button>
      </div>
    </div>
  );
}
