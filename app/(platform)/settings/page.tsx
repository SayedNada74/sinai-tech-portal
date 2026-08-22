"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";
import { useApp } from "@/context/app-context";
import { useSocial } from "@/context/social-context";
import {
  Lock,
  Globe,
  Bell,
  Eye,
  Link2,
  CheckCircle,
  AlertCircle,
  Sun,
  Moon,
  Zap
} from "lucide-react";

import { useLocalStorage } from "@/lib/hooks/use-local-storage";

export default function SettingsPage() {
  const { lang, setLang, theme, setTheme, t, dir, lowPowerMode, setLowPowerMode } = useApp();
  const { moodleUrl, syncMoodle, clearMoodle } = useSocial();
  const { user, loginWithProvider } = useAuth();

  const [connectedProviders, setConnectedProviders] = React.useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("su_connected_providers");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return ["google"];
  });

  const [moodleInput, setMoodleInput] = useLocalStorage("su_settings_moodle_input", moodleUrl || "");
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [showInstructions, setShowInstructions] = React.useState(false);
  const [moodleError, setMoodleError] = React.useState("");

  const [message, setMessage] = React.useState({ type: "", text: "" });
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (moodleUrl) {
      setMoodleInput(moodleUrl);
    }
  }, [moodleUrl, setMoodleInput]);

  const handleToggleProvider = async (provider: "google" | "github") => {
    const isConnected = connectedProviders.includes(provider);

    if (isConnected) {
      const updated = connectedProviders.filter((p) => p !== provider);
      setConnectedProviders(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("su_connected_providers", JSON.stringify(updated));
      }
      setMessage({
        type: "success",
        text: t(`تم إلغاء ربط حساب ${provider === "google" ? "Google" : "GitHub"} بنجاح!`, `Unlinked ${provider} account successfully!`)
      });
    } else {
      setIsSaving(true);
      const updated = [...connectedProviders, provider];
      setConnectedProviders(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("su_connected_providers", JSON.stringify(updated));
      }
      setMessage({
        type: "success",
        text: t(`جاري توجيهك لصفحة تفعيل ربط ${provider === "google" ? "Google" : "GitHub"}...`, `Redirecting to link ${provider} account...`)
      });
      await loginWithProvider(provider);
      setIsSaving(false);
    }
  };


  const isDark = theme === "dark";

  return (
    <div className="max-w-4xl mx-auto space-y-8" dir={dir}>
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
          {t("إعدادات المنصة", "Portal Settings")}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          {t("تخصيص الخيارات الشخصية وتفضيلات النظام والأمان", "Customize personal preferences, system aesthetics, and security.")}
        </p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-3 ${
          message.type === "success"
            ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400"
            : "bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"
        }`}>
          {message.type === "success" ? <CheckCircle className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Theme card */}
          <Card className="card border border-zinc-200 dark:border-zinc-800/40 shadow-sm">
            <CardHeader className="pb-3 border-b border-zinc-150 dark:border-zinc-850 mb-4">
              <CardTitle className="text-xs font-black uppercase tracking-wider text-zinc-400">
                {t("مظهر النظام", "System Theme")}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  !isDark
                    ? "border-cyan-500 bg-cyan-500/5 text-cyan-500 dark:text-cyan-400 font-bold"
                    : "border-zinc-200 dark:border-zinc-800/40 text-zinc-550"
                }`}
              >
                <Sun className="h-5 w-5" />
                <span className="text-xs font-bold">{t("مضيء", "Light")}</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  isDark
                    ? "border-cyan-500 bg-cyan-500/5 text-cyan-400 font-bold"
                    : "border-zinc-200 dark:border-zinc-800/40 text-zinc-550"
                }`}
              >
                <Moon className="h-5 w-5" />
                <span className="text-xs font-bold">{t("داكن", "Dark")}</span>
              </button>
            </CardContent>
          </Card>

          {/* Language Preferences */}
          <Card className="card border border-zinc-200 dark:border-zinc-800/40 shadow-sm">
            <CardHeader className="pb-3 border-b border-zinc-150 dark:border-zinc-850 mb-6">
              <CardTitle className="text-sm font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Globe className="h-4.5 w-4.5 text-zinc-400" />
                {t("تفضيلات اللغة", "Language Preferences")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                <label className="block mb-1">{t("لغة المنصة الافتراضية", "Default Portal Language")}</label>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as "ar" | "en")}
                  className="w-full h-11 pr-4 pl-3 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:ring-cyan-500 transition-all duration-200 cursor-pointer"
                >
                  <option value="ar">العربية (Arabic)</option>
                  <option value="en">الإنجليزية (English)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Moodle sync card */}
          <Card className="card border border-zinc-200 dark:border-zinc-800/40 shadow-sm">
            <CardHeader className="pb-3 border-b border-zinc-150 dark:border-zinc-850 mb-4">
              <CardTitle className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <span className="font-extrabold text-cyan-500 dark:text-cyan-455">Moodle</span>
                <span>{t("مزامنة التقويم الدراسي", "Moodle Calendar Sync")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2 text-xs">
              {moodleUrl ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-green-500/10 p-2.5 rounded-xl text-green-600 dark:text-green-400 border border-green-500/20 font-bold">
                    <span>{t("مرتبط ومزامن بنجاح 🎉", "Connected & Synced 🎉")}</span>
                  </div>
                  <div className="p-2.5 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-900 font-mono text-[9px] truncate text-zinc-500">
                    {moodleUrl}
                  </div>
                  <Button
                    onClick={() => {
                      clearMoodle();
                      setMoodleInput("");
                      setMoodleError("");
                    }}
                    className="w-full bg-red-600 hover:bg-red-750 text-white font-bold h-9 text-xs rounded-xl"
                  >
                    {t("إلغاء الربط ومسح البيانات", "Unlink & Clear Data")}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="font-bold text-zinc-700 dark:text-zinc-300 block">
                      {t("رابط تقويم Moodle الخاص بك", "Your Moodle Calendar Link")}
                    </label>
                    <input
                      type="url"
                      value={moodleInput}
                      onChange={(e) => setMoodleInput(e.target.value)}
                      placeholder="https://kmoodle.su.edu.eg/calendar/export_execute.php?..."
                      className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-white text-[10px] text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-all"
                    />
                  </div>

                  {moodleError && (
                    <div className="text-[10px] text-red-500 font-bold flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{moodleError}</span>
                    </div>
                  )}

                  <Button
                    onClick={async () => {
                      if (!moodleInput.trim()) {
                        setMoodleError(t("الرجاء إدخال رابط التقويم أولاً", "Please input the calendar link first"));
                        return;
                      }
                      setMoodleError("");
                      setIsSyncing(true);
                      try {
                        await syncMoodle(moodleInput);
                        setMessage({
                          type: "success",
                          text: t("تم مزامنة تقويم Moodle بنجاح وتنزيل المهام!", "Moodle calendar synced and tasks imported successfully!")
                        });
                      } catch (e: any) {
                        setMoodleError(t("الرابط غير صحيح أو حدث خطأ أثناء المزامنة", "Invalid link or an error occurred during sync"));
                      } finally {
                        setIsSyncing(false);
                      }
                    }}
                    disabled={isSyncing}
                    className="w-full btn-primary font-bold h-10 text-xs rounded-xl"
                  >
                    {isSyncing ? t("جاري المزامنة...", "Syncing...") : t("ربط ومزامنة المهام", "Link & Sync Tasks")}
                  </Button>

                  <button
                    type="button"
                    onClick={() => setShowInstructions(!showInstructions)}
                    className="text-[10px] font-bold text-cyan-500 hover:underline block mx-auto transition-all cursor-pointer"
                  >
                    {t("كيف أحصل على رابط Moodle؟", "How do I get Moodle calendar link?")}
                  </button>

                  {showInstructions && (
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-2xl text-[10px] text-zinc-600 dark:text-zinc-400 space-y-2 leading-relaxed text-right" dir="rtl">
                      <h4 className="font-bold text-zinc-900 dark:text-zinc-200">{t("خطوات الحصول على الرابط:", "Steps to get link:")}</h4>
                      <ol className="list-decimal pr-4 space-y-1.5">
                        <li>
                          {t("سجل دخولك في مودل جامعة سيناء: ", "Log in to Sinai University Moodle: ")}
                          <a href="https://kmoodle.su.edu.eg/" target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline">
                            kmoodle.su.edu.eg
                          </a>
                        </li>
                        <li>{t("اذهب لصفحة التقويم (Calendar).", "Go to Calendar page.")}</li>
                        <li>{t("اضغط على زر 'تصدير التقويم' (Export Calendar) في الأسفل.", "Click 'Export Calendar' at the bottom.")}</li>
                        <li>{t("اختر 'كل الأحداث' (All events) وفترة 'رابط مخصص' (Custom link).", "Select 'All events' and 'Recent and upcoming' time.")}</li>
                        <li>{t("اضغط على 'احصل على رابط التقويم' وانسخه وضعه في المربع أعلاه.", "Click 'Get calendar URL', copy it and paste it above.")}</li>
                      </ol>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Connected accounts */}
          <Card className="card border border-zinc-200 dark:border-zinc-800/40 shadow-sm">
            <CardHeader className="pb-3 border-b border-zinc-150 dark:border-zinc-850 mb-4">
              <CardTitle className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Link2 className="h-4 w-4 text-zinc-400" />
                {t("الحسابات المرتبطة", "Connected Accounts")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              {/* Google OAuth Link Status */}
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 font-semibold text-zinc-800 dark:text-zinc-200">
                  <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span>Google</span>
                </div>
                {connectedProviders.includes("google") ? (
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-transparent font-bold">{t("مرتبط", "Connected")}</Badge>
                    <button
                      type="button"
                      onClick={() => handleToggleProvider("google")}
                      className="text-[10px] text-red-500 hover:underline font-bold cursor-pointer transition-colors"
                    >
                      {t("إلغاء", "Unlink")}
                    </button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleProvider("google")}
                    className="h-7 text-[10px] py-0 px-2.5 cursor-pointer font-bold border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10"
                  >
                    {t("ربط الحساب", "Link Account")}
                  </Button>
                )}
              </div>

              {/* GitHub OAuth Link Status */}
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2 font-semibold text-zinc-800 dark:text-zinc-200">
                  <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  <span>GitHub</span>
                </div>
                {connectedProviders.includes("github") ? (
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-transparent font-bold">{t("مرتبط", "Connected")}</Badge>
                    <button
                      type="button"
                      onClick={() => handleToggleProvider("github")}
                      className="text-[10px] text-red-500 hover:underline font-bold cursor-pointer transition-colors"
                    >
                      {t("إلغاء", "Unlink")}
                    </button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleProvider("github")}
                    className="h-7 text-[10px] py-0 px-2.5 cursor-pointer font-bold border-cyan-500/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10"
                  >
                    {t("ربط الحساب", "Link Account")}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
