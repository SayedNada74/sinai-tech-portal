"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/app-context";
import { useAuth } from "@/context/auth-context";
import {
  LayoutDashboard,
  Bot,
  CheckCircle,
  Compass,
  Calculator,
  BookOpen,
  User,
  Settings,
  MessageSquare,
  Briefcase,
  Layers,
  Sun,
  Moon,
  LogOut,
  GraduationCap,
  Shield
} from "lucide-react";

export function DesktopSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { lang, theme, setLang, setTheme, t, dir, isLoggedIn, userRole } = useApp();

  const isRtl = dir === "rtl";

  // Hide on landing, login, and non-auth pages
  if (!isLoggedIn || pathname === "/" || pathname === "/login" || pathname === "/auth/login" || pathname === "/auth/register") {
    return null;
  }

  const isAdminUser = userRole === "admin" || userRole === "super-admin" || userRole === "moderator";

  const menuItems = isAdminUser
    ? [
        { labelAr: "لوحة الإدارة 🛠️", labelEn: "Admin Dashboard 🛠️", href: "/admin", icon: Shield },
        { labelAr: "لوحة التحكم", labelEn: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { labelAr: "دليل ومستكشف المواد", labelEn: "Course Explorer", href: "/courses", icon: BookOpen },
        { labelAr: "المنتدى الطلابي", labelEn: "Student Forum", href: "/community", icon: MessageSquare },
        { labelAr: "الفرص والتوظيف", labelEn: "Careers & Jobs", href: "/careers", icon: Briefcase },
        { labelAr: "مسارات خارطة الطريق", labelEn: "Career Roadmaps", href: "/roadmaps", icon: Layers },
        { labelAr: "الملف الشخصي", labelEn: "Admin Profile", href: "/profile", icon: User },
        { labelAr: "الإعدادات", labelEn: "Portal Settings", href: "/settings", icon: Settings }
      ]
    : [
        { labelAr: "لوحة التحكم", labelEn: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { labelAr: "المرشد الذكي (AI)", labelEn: "AI Assistant", href: "/ai-assistant", icon: Bot },
        { labelAr: "الخطة الدراسية والتقدم", labelEn: "Curriculum Checklist", href: "/departments", icon: CheckCircle },
        { labelAr: "مخطط التسجيل الذكي", labelEn: "Registration Planner", href: "/planner", icon: Compass },
        { labelAr: "حاسبة المعدل (GPA)", labelEn: "GPA Calculator", href: "/gpa", icon: Calculator },
        { labelAr: "دليل ومستكشف المواد", labelEn: "Course Explorer", href: "/courses", icon: BookOpen },
        { labelAr: "المنتدى الطلابي", labelEn: "Student Forum", href: "/community", icon: MessageSquare },
        { labelAr: "الفرص والتوظيف", labelEn: "Careers & Jobs", href: "/careers", icon: Briefcase },
        { labelAr: "مسارات خارطة الطريق", labelEn: "Career Roadmaps", href: "/roadmaps", icon: Layers },
        { labelAr: "الملف الشخصي", labelEn: "Student Profile", href: "/profile", icon: User },
        { labelAr: "الإعدادات", labelEn: "Portal Settings", href: "/settings", icon: Settings }
      ];

  const userAvatar = user?.avatar || "🎓";
  const isImageAvatar = userAvatar.startsWith("data:image/") || userAvatar.startsWith("http");

  return (
    <aside
      style={{ width: "230px" }}
      className={`hidden sm:flex flex-col justify-between shrink-0 h-screen sticky top-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md z-30 select-none ${
        isRtl ? "border-l border-zinc-200/80 dark:border-zinc-800/60" : "border-r border-zinc-200/80 dark:border-zinc-800/60"
      }`}
      dir={dir}
    >
      {/* Top Header Logo */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="h-16 px-5 flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-850 shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <GraduationCap className="h-4.5 w-4.5" />
            </div>
            <span className="font-black text-sm tracking-tight text-zinc-900 dark:text-zinc-50">
              SU IT Guide
            </span>
          </Link>
        </div>

        {/* Scrollable Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3.5 py-2.5 rounded-xl font-bold text-[13px] leading-snug flex items-center gap-3 transition-colors duration-150 group ${
                  active
                    ? "bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 font-bold"
                    : "border border-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-850/60 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                {/* Active Indicator Pillar Bar */}
                {active && (
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)] ${
                      isRtl ? "-right-0.5" : "-left-0.5"
                    }`}
                  />
                )}

                <Icon
                  className={`h-4 w-4 shrink-0 ${
                    active
                      ? "text-cyan-600 dark:text-cyan-400"
                      : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-200"
                  }`}
                />
                <span className="truncate">{t(item.labelAr, item.labelEn)}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom User & Toggles Block */}
      <div className="p-3 border-t border-zinc-200/60 dark:border-zinc-850 space-y-2.5 bg-zinc-50/50 dark:bg-zinc-950/40 shrink-0">
        {/* Quick Toggles */}
        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-600 dark:text-zinc-300 flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-2xs"
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-3.5 w-3.5 text-amber-500" />
                <span>{t("مضيء", "Light")}</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-zinc-600" />
                <span>{t("داكن", "Dark")}</span>
              </>
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-600 dark:text-zinc-300 flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-2xs"
          >
            <span>{lang === "ar" ? "English" : "العربية"}</span>
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-850 shadow-2xs">
          <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-base overflow-hidden shrink-0">
            {isImageAvatar ? (
              <img src={userAvatar} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              userAvatar
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h5 className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 truncate">{user?.name}</h5>
            <span className="text-[9px] text-zinc-400 block truncate leading-none mt-0.5">
              {userRole === "student" ? t("طالب الكلية", "Faculty Student") : t("مشرف المنصة", "Admin")}
            </span>
          </div>
          <button
            onClick={() => logout()}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
            title={t("تسجيل الخروج", "Logout")}
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
