"use client";

import * as React from "react";
import { useAdmin, AuditLog, ErrorIncident } from "@/context/admin-context";
import { useApp } from "@/context/app-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ShieldAlert,
  History,
  Trash2,
  AlertTriangle,
  Play,
  Activity,
  Cpu,
  Search,
  Filter,
  CheckCircle2,
  HardDrive
} from "lucide-react";

import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/context/auth-context";

export default function SystemLogsAndErrorsPage() {
  const { t, dir, lang } = useApp();
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
          {t("لا تملك الصلاحية الكافية لمراجعة سجلات النظام والأمان.", "You do not have sufficient clearance to view system audit logs.")}
        </p>
      </div>
    );
  }
  const {
    auditLogs,
    incidents,
    clearAuditLogs,
    triggerMockError,
    logAction
  } = useAdmin();

  const [activeTab, setActiveTab] = React.useState<"audit" | "incidents">("audit");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("ALL");

  // Filter logs
  const filteredLogs = React.useMemo(() => {
    return auditLogs.filter((log) => {
      const q = searchTerm.toLowerCase().trim();
      const matchQ =
        !q ||
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.userName.toLowerCase().includes(q);

      const matchCat = categoryFilter === "ALL" || log.category === categoryFilter;
      return matchQ && matchCat;
    });
  }, [auditLogs, searchTerm, categoryFilter]);

  // Actions
  const handleClearLogs = () => {
    if (confirm(t("⚠️ هل أنت متأكد من مسح جميع سجلات تدقيق النظام والأمان نهائياً؟", "⚠️ Are you sure you want to clear all audit logs permanently?"))) {
      clearAuditLogs();
      toast(t("✨ تم مسح سجلات التدقيق بنجاح!", "✨ Audit logs cleared successfully!"), "success");
    }
  };

  const handleTriggerError = (title: string, message: string, type: ErrorIncident["type"]) => {
    triggerMockError(title, message, type);
    toast(t(`🚨 تم محاكاة تسجيل حدث الخطأ: "${title}"`, `🚨 Simulated error event: "${title}"`), "info");
  };

  return (
    <div className="space-y-6 animate-fade-in" dir={dir}>
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
            {t("سجلات الأمان والرقابة الإدارية", "System Audit Logs & Security Inspection")}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {t(
              "تتبع وتوثيق جميع عمليات الإشراف والتغييرات بالمنصة، وتفقد بلاغات الأخطاء البرمجية.",
              "Track admin operations, log security audit trails, and inspect system error incidents."
            )}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl shrink-0">
          <Button
            variant={activeTab === "audit" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("audit")}
            className="text-xs font-bold gap-1.5 h-8 cursor-pointer"
          >
            <History className="h-3.5 w-3.5" />
            {t("سجلات الرقابة والعمليات", "Audit Trail")}
          </Button>

          <Button
            variant={activeTab === "incidents" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("incidents")}
            className="text-xs font-bold gap-1.5 h-8 cursor-pointer"
          >
            <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
            {t("بلاغات الأخطاء والحوادث", "System Incidents")}
          </Button>
        </div>
      </div>

      {activeTab === "audit" ? (
        <div className="space-y-4">
          {/* Controls */}
          <Card className="border border-zinc-200/50 bg-white dark:bg-zinc-900 shadow-sm">
            <CardContent className="p-4 flex flex-col md:flex-row justify-between gap-3">
              <div className="relative flex-1">
                <Search className={`absolute ${lang === "ar" ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400`} />
                <Input
                  type="text"
                  placeholder={t("ابحث بالبريد، اسم الإجراء، أو تفاصيل العملية...", "Search by user email, action, or log details...")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={lang === "ar" ? "pr-10" : "pl-10"}
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-150 cursor-pointer"
                >
                  <option value="ALL">{t("جميع العمليات 📋", "All Actions 📋")}</option>
                  <option value="auth">{t("المستخدمين والصلاحيات 🔑", "Auth & Roles 🔑")}</option>
                  <option value="course">{t("المقررات والخطط 📚", "Courses & Plans 📚")}</option>
                  <option value="resource">{t("المصادر والملفات 📁", "Resources & Files 📁")}</option>
                  <option value="announcement">{t("الإعلانات 📢", "Announcements 📢")}</option>
                </select>

                <Button
                  variant="outline"
                  onClick={handleClearLogs}
                  className="text-red-600 border-red-200 hover:bg-red-50 text-xs font-bold gap-1.5 h-10 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                  {t("مسح السجلات", "Clear Logs")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Audit Trail List */}
          <Card className="border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-zinc-50 dark:bg-zinc-950/60 border-b border-zinc-200/60 dark:border-zinc-800 font-bold text-zinc-500 dark:text-zinc-400">
                  <tr>
                    <th className="p-4">{t("نوع الإجراء", "Action")}</th>
                    <th className="p-4">{t("تفاصيل العملية", "Details")}</th>
                    <th className="p-4">{t("المشرف المنفّذ", "Executed By")}</th>
                    <th className="p-4">{t("التوقيت الزمني", "Timestamp")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-950/40 transition-colors">
                        <td className="p-4 font-bold text-zinc-900 dark:text-zinc-50">
                          {log.action}
                        </td>
                        <td className="p-4 text-zinc-600 dark:text-zinc-400">
                          {log.details}
                        </td>
                        <td className="p-4 font-bold text-violet-600 dark:text-violet-400">
                          {log.userName} ({log.userEmail})
                        </td>
                        <td className="p-4 text-[10px] text-zinc-400 font-mono">
                          {log.timestamp}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-zinc-400">
                        {t("لا توجد سجلات تدقيق سابقة", "No audit logs found")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Incidents & Errors list */
        <div className="space-y-4">
          <Card className="border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm">
            <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <ShieldAlert className="h-4.5 w-4.5 text-rose-500" />
                {t("سجلات الأخطاء والحوادث الحية", "Live System Incidents & Safety Logs")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTriggerError("Gateway Timeout 504", "Simulated moodle proxy gateway delay response.", "api")}
                  className="text-xs font-bold text-amber-600 border-amber-300"
                >
                  ⚡ {t("محاكاة خطأ 504 API", "Simulate 504 API Error")}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleTriggerError("Auth Rate Limit Exceeded", "Simulated suspicious brute-force login attempts block.", "auth")}
                  className="text-xs font-bold text-red-600 border-red-300"
                >
                  🔒 {t("محاكاة حظر أمان 403", "Simulate 403 Security Block")}
                </Button>
              </div>

              <div className="space-y-3">
                {incidents.map((inc) => (
                  <div key={inc.id} className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/40 rounded-2xl flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-xs text-red-800 dark:text-red-300">{inc.title}</h4>
                        <Badge variant="outline" className="border-red-300 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-[9px] font-mono">
                          HTTP {inc.statusCode}
                        </Badge>
                      </div>
                      <p className="text-xs text-red-600/90 dark:text-red-400/80 mt-1 font-mono">{inc.message}</p>
                      <span className="text-[9px] text-zinc-400 block mt-2">{inc.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
