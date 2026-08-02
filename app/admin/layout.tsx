"use client";

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
  Compass
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t, dir } = useApp();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const menuItems = [
    { nameAr: "لوحة التحكم والتحليلات", nameEn: "Dashboard & Analytics", path: "/admin", icon: LayoutDashboard },
    { nameAr: "إدارة المستخدمين والصلاحيات", nameEn: "Users & Roles Management", path: "/admin/users", icon: Users },
    { nameAr: "إدارة المساقات والخطط", nameEn: "Courses & Curricula", path: "/admin/courses", icon: BookOpen },
    { nameAr: "إدارة الملفات والمصادر", nameEn: "Files & Resources", path: "/admin/resources", icon: FileSpreadsheet },
    { nameAr: "بوابة التدريب والتوظيف", nameEn: "Careers & Internships", path: "/admin/careers", icon: Briefcase },
    { nameAr: "خارطة مسارات التعلّم", nameEn: "Career Roadmaps", path: "/admin/roadmaps", icon: Compass },
    { nameAr: "مراجعة وتقييمات الطلاب", nameEn: "Student Reviews & Audits", path: "/admin/reviews", icon: MessageSquare },
    { nameAr: "مركز نشر الإعلانات", nameEn: "Announcements Center", path: "/admin/announcements", icon: Megaphone },
    { nameAr: "قاعدة المعرفة والذكاء الاصطناعي", nameEn: "Knowledge & AI Base", path: "/admin/faq", icon: HelpCircle },
    { nameAr: "سجلات النظام والرقابة", nameEn: "Audit & Log Inspection", path: "/admin/audit", icon: ShieldCheck },
    { nameAr: "إعدادات المنصة الأساسية", nameEn: "Core System Settings", path: "/admin/settings", icon: Settings }
  ];

  // Helper to resolve badge label and color based on role
  const getRoleBadge = (role?: string) => {
    switch (role) {
      case "super-admin":
        return { label: t("مشرف أعلى 👑", "Super Admin 👑"), color: "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/20 dark:border-rose-900 dark:text-rose-400" };
      case "admin":
        return { label: t("مسؤول النظام ⚙️", "System Admin ⚙️"), color: "bg-violet-50 border-violet-200 text-violet-700 dark:bg-violet-950/20 dark:border-violet-900 dark:text-violet-400" };
      case "moderator":
        return { label: t("منسق محتوى 👩‍🏫", "Content Moderator 👩‍🏫"), color: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400" };
      default:
        return { label: t("طالب 🎓", "Student 🎓"), color: "bg-zinc-100 border-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300" };
    }
  };

  const badge = getRoleBadge(user?.role);
  const BackIcon = dir === "rtl" ? ArrowRight : ArrowLeft;

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col md:flex-row" dir={dir}>
        {/* Mobile Header */}
        <header className="flex md:hidden items-center justify-between px-5 py-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-sm z-50">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-violet-600 flex items-center justify-center text-white">
              <GraduationCap className="h-4.5 w-4.5" />
            </div>
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-50">
              {t("لوحة الإشراف والتنظيم", "Admin & Management Portal")}
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
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
          className={`fixed inset-y-0 ${dir === "rtl" ? "right-0 border-l" : "left-0 border-r"} w-68 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 flex flex-col justify-between z-40 transition-transform duration-300 transform md:translate-x-0 md:static md:h-screen ${
            sidebarOpen ? "translate-x-0" : dir === "rtl" ? "translate-x-full" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col flex-1 overflow-y-auto">
            {/* Logo */}
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <Link href="/admin" className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-md">
                  <GraduationCap className="h-5.5 w-5.5" />
                </div>
                <span className="font-bold text-base text-zinc-900 dark:text-zinc-50">
                  {t("إشراف", "Admin")} <span className="text-violet-600 dark:text-violet-400">SU IT</span>
                </span>
              </Link>
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
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      active
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

          {/* Footer Controls */}
          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2.5">
            <Link href="/dashboard" className="w-full">
              <Button variant="outline" className="w-full justify-center gap-2 h-9 text-[10px] font-extrabold">
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
        <main className="flex-1 p-4 sm:p-6 md:p-8 pb-20 md:pb-8 overflow-y-auto max-h-screen">
          <PageTransitionWrapper>{children}</PageTransitionWrapper>
        </main>
      </div>
    </AdminProtectedRoute>
  );
}
