"use client";

import { Logo } from "@/components/ui/logo";
import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { useAuth } from "@/context/auth-context";
import { AdminProtectedRoute } from "@/components/admin-protected-route";
import { PageTransitionWrapper } from "@/components/page-transition-wrapper";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileSpreadsheet,
  MessageSquare,
  Megaphone,
  HelpCircle,
  ShieldCheck,
  Settings,
  ArrowRight,
  ArrowLeft,
  Menu,
  X,
  Sparkles,
  Power,
  GraduationCap,
  Briefcase,
  Compass,
  Sun,
  Moon,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t, dir, lang, setLang, theme, setTheme } = useApp();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const allMenuItems = [
    { nameAr: "لوحة التحكم والتحليلات", nameEn: "Dashboard & Analytics", path: "/admin", icon: LayoutDashboard, roles: ["moderator", "admin", "super-admin"] },
    { nameAr: "إدارة المستخدمين والصلاحيات", nameEn: "Users & Roles Management", path: "/admin/users", icon: Users, roles: ["super-admin"] },
    { nameAr: "إدارة المساقات والخطط", nameEn: "Courses & Curricula", path: "/admin/courses", icon: BookOpen, roles: ["admin", "super-admin"] },
    { nameAr: "إدارة الملفات والمصادر", nameEn: "Files & Resources", path: "/admin/resources", icon: FileSpreadsheet, roles: ["admin", "super-admin"] },
    { nameAr: "بوابة التدريب والتوظيف", nameEn: "Careers & Internships", path: "/admin/careers", icon: Briefcase, roles: ["admin", "super-admin"] },
    { nameAr: "خارطة مسارات التعلّم", nameEn: "Career Roadmaps", path: "/admin/roadmaps", icon: Compass, roles: ["admin", "super-admin"] },
    { nameAr: "مراجعة وتقييمات الطلاب", nameEn: "Student Reviews & Audits", path: "/admin/reviews", icon: MessageSquare, roles: ["moderator", "admin", "super-admin"] },
    { nameAr: "مركز نشر الإعلانات", nameEn: "Announcements Center", path: "/admin/announcements", icon: Megaphone, roles: ["moderator", "admin", "super-admin"] },
    { nameAr: "قاعدة المعرفة والذكاء الاصطناعي", nameEn: "Knowledge & AI Base", path: "/admin/faq", icon: HelpCircle, roles: ["moderator", "admin", "super-admin"] },
    { nameAr: "سجلات النظام والرقابة", nameEn: "Audit & Log Inspection", path: "/admin/audit", icon: ShieldCheck, roles: ["super-admin"] },
    { nameAr: "إعدادات المنصة الأساسية", nameEn: "Core System Settings", path: "/admin/settings", icon: Settings, roles: ["super-admin"] }
  ];

  const menuItems = allMenuItems.filter(item => user && item.roles.includes(user.role as any));

  // Protect current path against unauthorized role access
  React.useEffect(() => {
    if (user && pathname) {
      const currentItem = allMenuItems.find(i => i.path === pathname);
      if (currentItem && !currentItem.roles.includes(user.role as any)) {
        router.push("/admin");
      }
    }
  }, [user, pathname, router]);

  // Helper to resolve badge label and color based on role
  const getRoleBadge = (role?: string) => {
    switch (role) {
      case "super-admin":
        return { label: t("مشرف أعلى 👑", "Super Admin 👑"), color: "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/20 dark:border-rose-900 dark:text-rose-400" };
      case "admin":
        return { label: t("مسؤول النظام ⚙️", "System Admin ⚙️"), color: "bg-violet-50 border-violet-200 text-violet-700 dark:bg-violet-950/20 dark:border-violet-900 dark:text-violet-400" };
      case "moderator":
        return { label: t("منسق محتوى 📚", "Content Moderator 📚"), color: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400" };
      default:
        return { label: t("طالب 🧑‍🎓", "Student 🧑‍🎓"), color: "bg-zinc-100 border-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300" };
    }
  };

  const badge = getRoleBadge(user?.role);
  const BackIcon = dir === "rtl" ? ArrowRight : ArrowLeft;

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col md:flex-row w-full max-w-full overflow-x-hidden" dir={dir}>
        {/* Mobile Header */}
        <header className="sticky top-0 flex md:hidden items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-xs z-50">
          <Link
            href="/admin"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition-opacity min-w-0"
            title={t("العودة للرئيسية الإدارية", "Go to Admin Dashboard")}
          >
            <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <GraduationCap className="h-4.5 w-4.5" />
            </div>
            <span className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-50 truncate">
              {t("لوحة الإشراف والتنظيم", "Admin Portal")}
            </span>
          </Link>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick Language Toggle Mobile */}
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title={t("تغيير اللغة", "Change Language")}
            >
              {lang === "ar" ? "EN" : "عربي"}
            </button>

            {/* Quick Theme Toggle Mobile */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              suppressHydrationWarning
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title={t("تبديل المظهر", "Toggle Theme")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-zinc-600" />}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Toggle sidebar menu"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </header>

        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 ${dir === "rtl" ? "right-0 border-l" : "left-0 border-r"} w-68 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 flex flex-col justify-between z-40 transition-transform duration-300 transform md:translate-x-0 md:static md:h-screen ${sidebarOpen ? "translate-x-0" : dir === "rtl" ? "translate-x-full" : "-translate-x-full"
            }`}
        >
          <div className="flex flex-col flex-1 overflow-y-auto">
            {/* Logo Header with Quick Actions */}
            <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <Logo size="sm" href="/admin" subtitle={t("الإشراف", "Admin")} />
            </div>

            {/* Profile Info */}
            <div className="px-5 py-4.5 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
              <span className="text-2xl">{user?.avatar || "👨‍💻"}</span>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">{user?.name}</h4>
                <p className="text-[9px] text-zinc-400 truncate mb-1.5">{user?.email}</p>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border ${badge.color}`}>
                  {badge.label}
                </span>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="p-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.path || (item.path !== "/admin" && pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${active
                        ? "bg-violet-50 text-violet-600 dark:bg-violet-950/20 dark:text-violet-400"
                        : "text-zinc-650 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-950 dark:hover:text-zinc-100"
                      }`}
                  >
                    <Icon className={`h-4.5 w-4.5 ${active ? "text-violet-600 dark:text-violet-400" : "text-zinc-400"}`} />
                    <span>{t(item.nameAr, item.nameEn)}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer Controls: Language, Theme, Back to Portal & Logout */}
          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2 bg-zinc-50/50 dark:bg-zinc-950/30">
            {/* Language & Theme Switchers Row */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-850 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-2xs"
                title={t("تغيير لغة المنصة", "Change Language")}
              >
                <Globe className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                <span>{lang === "ar" ? "English" : "العربية"}</span>
              </button>

            <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                suppressHydrationWarning
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-850 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-2xs"
                title={t("تبديل المظهر", "Toggle Theme")}
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="h-3.5 w-3.5 text-amber-400" />
                    <span>{t("فاتح", "Light")}</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-3.5 w-3.5 text-zinc-600" />
                    <span>{t("داكن", "Dark")}</span>
                  </>
                )}
              </button>
            </div>

            <Link href="/dashboard" className="w-full block">
              <Button variant="outline" className="w-full justify-center gap-2 h-9 text-[10px] font-extrabold shadow-2xs">
                <BackIcon className="h-4 w-4" />
                {t("عودة لبوابة الطالب", "Back to Student Portal")}
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full justify-center gap-2 h-9 text-[10px] text-red-600 hover:bg-red-50 dark:hover:bg-red-950/25 cursor-pointer"
            >
              <Power className="h-4 w-4" />
              {t("خروج من النظام", "System Logout")}
            </Button>
          </div>
        </aside>

        {/* Page Content area */}
        <main className="flex-1 w-full min-w-0 max-w-full p-3.5 sm:p-6 md:p-8 pb-20 md:pb-8 overflow-y-auto overflow-x-hidden max-h-screen">
          <PageTransitionWrapper>{children}</PageTransitionWrapper>
        </main>
      </div>
    </AdminProtectedRoute>
  );
}
