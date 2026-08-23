"use client";

import { Logo } from "@/components/ui/logo";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useApp } from "@/context/app-context";
import { useSocial } from "@/context/social-context";
import { useAdmin } from "@/context/admin-context";
import { ProtectedRoute } from "@/components/protected-route";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { MobileSidebar } from "@/components/MobileSidebar";
import { MobileTaskbar } from "@/components/MobileTaskbar";
import { GlobalSearchBar } from "@/components/GlobalSearchBar";
import { CompleteProfileModal } from "@/components/complete-profile-modal";
import { PageTransitionWrapper } from "@/components/page-transition-wrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Bell,
  Trophy,
  Menu,
  Sun,
  Moon,
  Sparkles,
  Search,
  GraduationCap,
  X,
  AlertCircle,
  AlertTriangle,
  Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { notifications, markAsRead, markAllAsRead, clearNotifications } = useSocial();
  const { theme, setTheme, dir, t, lang, setLang, userName } = useApp();
  const { settings } = useAdmin();

  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);
  const isRtl = dir === "rtl";

  return (
    <ProtectedRoute>
      <div
        className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col sm:flex-row pb-[72px] sm:pb-0 font-sans"
        dir={dir}
      >
        {/* Global Search Dialog Triggered by Ctrl+K */}
        <GlobalSearchBar />

        {/* Responsive Sidebars */}
        <DesktopSidebar />
        <MobileSidebar isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />

        {/* Live Maintenance Mode Banner (Controlled by Admin Settings) */}
        {settings?.maintenanceMode && (
          <div className="fixed top-0 inset-x-0 z-[100] bg-amber-600 text-white font-extrabold text-xs py-2 px-4 text-center flex items-center justify-center gap-2 shadow-lg border-b border-amber-500">
            <AlertTriangle className="h-4 w-4 animate-bounce shrink-0" />
            <span>
              {t(
                "⚠️ إشعار الصيانة: ميزّة وضع الصيانة المؤقتة مفعّلة حالياً بالكامل على كافة أرجاء المنصة من قِبل إدارة النظام.",
                "⚠️ Maintenance Alert: Live maintenance mode is currently activated across the entire platform by System Administration."
              )}
            </span>
          </div>
        )}

        {/* Mobile Header */}
        <header className="sm:hidden h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200/60 dark:border-zinc-800/60 px-4 flex items-center justify-between sticky top-0 z-40">
          <Logo size="sm" href={user ? "/dashboard" : "/"} />

          <div className="flex items-center gap-1.5">
            {/* Search Trigger for Mobile */}
            <button
              onClick={() => {
                const event = new KeyboardEvent("keydown", {
                  key: "k",
                  ctrlKey: true,
                  bubbles: true
                });
                window.dispatchEvent(event);
              }}
              title={t("ابحث عن مواد أو صفحات...", "Search courses or pages...")}
              className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-350 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="p-1.5 px-2 rounded-lg text-xs font-black bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 cursor-pointer"
            >
              {lang === "ar" ? "EN" : "عربي"}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-350 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-zinc-600" />}
            </button>

            {user ? (
              <>
                {/* Notifications mobile trigger */}
                <div className="relative">
                  <button
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-350 hover:bg-zinc-100 dark:hover:bg-zinc-800 relative cursor-pointer"
                  >
                    <Bell className="h-4 w-4" />
                    {unreadNotifs.length > 0 && (
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-ping" />
                    )}
                  </button>
                </div>

                {/* Mobile Sidebar Hamburger Trigger */}
                <button
                  onClick={() => setIsMobileOpen(true)}
                  className="p-1.5 rounded-lg text-zinc-600 dark:text-zinc-350 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </>
            ) : (
              <Link href="/auth/login">
                <Button size="sm" className="h-8 px-3 text-xs font-bold rounded-lg shadow-sm">
                  {t("دخول", "Sign In")}
                </Button>
              </Link>
            )}
          </div>
        </header>

        {/* Main Content Pane */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Top Header Bar for Desktop */}
          <header className="hidden sm:flex h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200/50 dark:border-zinc-800/40 px-8 items-center justify-between shrink-0">
            {user ? (
              <>
                {/* Left/Right depending on dir: Global search advice and trigger button */}
                <div className="flex items-center gap-4">
                  <span className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                    {lang === "ar"
                      ? `أهلاً بك، ${userName.split(" ")[0] || "طالب"} 👋`
                      : `Welcome, ${userName.split(" ")[0] || "Student"} 👋`}
                  </span>

                  {/* Fake Search input that triggers Ctrl+K search on click */}
                  <button
                    onClick={() => {
                      const event = new KeyboardEvent("keydown", {
                        key: "k",
                        ctrlKey: true,
                        bubbles: true
                      });
                      window.dispatchEvent(event);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300 transition-colors text-xs font-semibold cursor-pointer"
                  >
                    <Search className="h-3.5 w-3.5" />
                    <span>{t("ابحث عن مواد أو صفحات...", "Search courses or pages...")}</span>
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  {/* Advanced Notification System */}
                  <div className="relative">
                    <button
                      onClick={() => setIsNotifOpen(!isNotifOpen)}
                      className="p-2.5 rounded-xl border border-zinc-250/60 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-650 dark:text-zinc-300 relative transition-all cursor-pointer"
                    >
                      <Bell className="h-4 w-4" />
                      {unreadNotifs.length > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-red-500 text-[9px] font-black text-white flex items-center justify-center">
                          {unreadNotifs.length}
                        </span>
                      )}
                    </button>

                    {/* Notifications Dropdown */}
                    <AnimatePresence>
                      {isNotifOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className={`absolute ${isRtl ? "left-0" : "right-0"} mt-3 w-80 sm:w-96 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl z-50 overflow-hidden`}
                          >
                            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                              <h4 className="font-extrabold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                <Bell className="h-4 w-4 text-cyan-500" />
                                {t("الإشعارات والتنبيهات", "System Alerts")}
                              </h4>
                              <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500">
                                <button onClick={markAllAsRead} className="hover:text-cyan-600 transition-colors">
                                  {t("تحديد كمقروء", "Mark all read")}
                                </button>
                                <span>•</span>
                                <button onClick={clearNotifications} className="hover:text-red-500 transition-colors">
                                  {t("مسح الكل", "Clear all")}
                                </button>
                              </div>
                            </div>

                            <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-850">
                              {notifications.length > 0 ? (
                                notifications.map((notif) => (
                                  <div
                                    key={notif.id}
                                    onClick={() => {
                                      markAsRead(notif.id);
                                      setIsNotifOpen(false);
                                    }}
                                    className={cn(
                                      "p-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors cursor-pointer text-right flex gap-3 items-start",
                                      !notif.read && "bg-cyan-50/20 dark:bg-cyan-950/10",
                                      !isRtl && "text-left"
                                    )}
                                    dir={dir}
                                  >
                                    <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 shrink-0">
                                      {notif.type === "badge" ? (
                                        <Trophy className="h-3.5 w-3.5 text-amber-500" />
                                      ) : notif.type === "career" ? (
                                        <Briefcase className="h-3.5 w-3.5 text-emerald-500" />
                                      ) : (
                                        <AlertCircle className="h-3.5 w-3.5 text-cyan-505" />
                                      )}
                                    </div>
                                    <div className="space-y-1 min-w-0 flex-1">
                                      <h5 className={cn("text-xs font-bold text-zinc-850 dark:text-zinc-200", !notif.read && "text-cyan-600")}>
                                        {notif.title}
                                      </h5>
                                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                        {notif.content}
                                      </p>
                                      <span className="text-[9px] text-zinc-400 block">{notif.date}</span>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="py-12 text-center text-zinc-400 dark:text-zinc-550 space-y-1">
                                  <Bell className="h-8 w-8 mx-auto text-zinc-300" />
                                  <p className="text-xs font-bold">{t("لا توجد إشعارات جديدة", "No new alerts")}</p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Logo size="md" href="/" />
                  <Link
                    href="/"
                    className="text-xs font-bold text-zinc-500 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors"
                  >
                    {t("الرئيسية", "Home")}
                  </Link>
                  <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
                  <button
                    onClick={() => {
                      const event = new KeyboardEvent("keydown", {
                        key: "k",
                        ctrlKey: true,
                        bubbles: true
                      });
                      window.dispatchEvent(event);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300 transition-colors text-xs font-semibold cursor-pointer"
                  >
                    <Search className="h-3.5 w-3.5" />
                    <span>{t("ابحث عن مواد أو صفحات...", "Search courses or pages...")}</span>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                    className="px-2.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    {lang === "ar" ? "English" : "العربية"}
                  </button>
                  <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-zinc-600" />}
                  </button>
                  <Link href="/auth/login">
                    <Button variant="outline" size="sm" className="rounded-xl font-bold">
                      {t("تسجيل الدخول", "Sign In")}
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button size="sm" className="rounded-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md">
                      {t("إنشاء حساب 🚀", "Register 🚀")}
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </header>

          {/* Main workspace container */}
          <main className="flex-1 min-w-0 p-4 sm:p-8 pb-24 sm:pb-8 overflow-y-auto bg-zinc-50 dark:bg-zinc-950">
            {/* Mobile Quick Search Pill Bar */}
            <div className="sm:hidden mb-4">
              <button
                type="button"
                onClick={() => {
                  const event = new KeyboardEvent("keydown", {
                    key: "k",
                    ctrlKey: true,
                    bubbles: true
                  });
                  window.dispatchEvent(event);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-all text-xs font-medium cursor-pointer"
              >
                <Search className="h-4 w-4 shrink-0 text-zinc-400" />
                <span className="text-zinc-500 dark:text-zinc-400 font-semibold">{t("ابحث عن مواد أو صفحات...", "Search courses or pages...")}</span>
              </button>
            </div>

            <PageTransitionWrapper>{children}</PageTransitionWrapper>
          </main>
        </div>

        {/* Mobile notifications modal */}
        <AnimatePresence>
          {isNotifOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 sm:hidden">
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-t-3xl sm:rounded-3xl shadow-xl overflow-hidden max-h-[80vh] flex flex-col"
              >
                <div className="p-5 border-b border-zinc-100 dark:border-zinc-850 flex justify-between items-center">
                  <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">
                    {t("الإشعارات والتنبيهات", "Notifications & Alerts")}
                  </h4>
                  <button onClick={() => setIsNotifOpen(false)} className="p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50 px-5 py-2.5 border-b border-zinc-100 dark:border-zinc-800 text-[10px] font-bold text-zinc-500">
                  <button onClick={markAllAsRead} className="text-cyan-600">{t("تحديد المقروء", "Mark all read")}</button>
                  <button onClick={clearNotifications} className="text-zinc-400">{t("مسح الكل", "Clear all")}</button>
                </div>
                <div className="overflow-y-auto flex-1 divide-y divide-zinc-100 dark:divide-zinc-900" dir={dir}>
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markAsRead(notif.id);
                          setIsNotifOpen(false);
                        }}
                        className={cn(
                          "p-4 flex gap-3 text-right items-start",
                          !notif.read && "bg-cyan-50/10 dark:bg-cyan-950/10",
                          !isRtl && "text-left"
                        )}
                      >
                        <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 shrink-0">
                          {notif.type === "badge" ? <Trophy className="h-4 w-4 text-amber-500" /> : <Bell className="h-4 w-4 text-cyan-500" />}
                        </div>
                        <div className="space-y-1 flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-zinc-850 dark:text-zinc-200">{notif.title}</h5>
                          <p className="text-[10px] text-zinc-500 dark:text-zinc-400">{notif.content}</p>
                          <span className="text-[9px] text-zinc-400 block">{notif.date}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-16 text-center text-zinc-400 space-y-2">
                      <Bell className="h-10 w-10 mx-auto text-zinc-300" />
                      <p className="text-xs font-bold">{t("لا توجد إشعارات حالية", "No current alerts")}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Onboarding Modal for New OAuth Registrations */}
        <CompleteProfileModal />

        {/* Mobile Fixed Navigation Bar */}
        <MobileTaskbar />
      </div>
    </ProtectedRoute>
  );
}

