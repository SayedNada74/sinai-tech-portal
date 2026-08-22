"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/app-context";
import { useAuth } from "@/context/auth-context";
import { useAnimationProps } from "@/lib/motion";
import { motion, AnimatePresence } from "framer-motion";
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
  X,
  LogOut,
  Shield,
  Sun,
  Moon,
  Globe,
  Users
} from "lucide-react";
import { DeveloperCredit } from "@/components/ui/developer-credit";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { lang, setLang, theme, setTheme, t, dir, userRole } = useApp();
  const { shouldAnimate } = useAnimationProps();

  const isRtl = dir === "rtl";

  const isAdminUser = userRole === "admin" || userRole === "super-admin" || userRole === "moderator";

  const menuItems = isAdminUser
    ? [
        { labelAr: "لوحة الإدارة 🛠️", labelEn: "Admin Dashboard 🛠️", href: "/admin", icon: Shield },
        { labelAr: "لوحة التحكم", labelEn: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { labelAr: "دليل ومستكشف المواد", labelEn: "Course Explorer", href: "/courses", icon: BookOpen },
        { labelAr: "المنتدى الطلابي", labelEn: "Student Forum", href: "/community", icon: MessageSquare },
        { labelAr: "دليل الطلاب", labelEn: "Student Directory", href: "/directory", icon: Users },
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
        { labelAr: "حاسبة المعدل (GPA)", labelEn: "GPA Calculator", href: "/gpa", icon: Calculator, key: "gpa" },
        { labelAr: "دليل ومستكشف المواد", labelEn: "Course Explorer", href: "/courses", icon: BookOpen, key: "courses" },
        { labelAr: "المنتدى الطلابي", labelEn: "Student Forum", href: "/community", icon: MessageSquare, key: "community" },
        { labelAr: "دليل الطلاب", labelEn: "Student Directory", href: "/directory", icon: Users, key: "directory" },
        { labelAr: "الفرص والتوظيف", labelEn: "Careers & Jobs", href: "/careers", icon: Briefcase, key: "careers" },
        { labelAr: "مسارات خارطة الطريق", labelEn: "Career Roadmaps", href: "/roadmaps", icon: Layers },
        { labelAr: "الملف الشخصي", labelEn: "Student Profile", href: "/profile", icon: User },
        { labelAr: "الإعدادات", labelEn: "Portal Settings", href: "/settings", icon: Settings }
      ];

  const drawerVariants = {
    closed: {
      x: isRtl ? "100%" : "-105%",
      transition: { type: "tween" as const, duration: 0.25, ease: "easeInOut" as const }
    },
    open: {
      x: 0,
      transition: { type: "tween" as const, duration: 0.25, ease: "easeInOut" as const }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex" dir={dir}>
          {/* Dimmer Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-950/65 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer Content */}
          <motion.div
            variants={drawerVariants}
            initial={shouldAnimate ? "closed" : "open"}
            animate="open"
            exit="closed"
            className={`w-64 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-900/60 h-full flex flex-col justify-between shadow-2xl relative z-10 overflow-y-auto ${
              isRtl ? "border-l mr-auto" : "border-r ml-auto"
            }`}
          >
            {/* Header & Close Button */}
            <div>
              <div className="h-16 px-6 border-b border-zinc-200 dark:border-zinc-900/60 flex items-center justify-between">
                <div className="flex items-center gap-2 select-none">
                  <div className="h-7 w-7 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-bold">IT</div>
                  <span className="font-extrabold text-sm text-zinc-800 dark:text-zinc-100 bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text text-transparent">
                    SU IT Guide
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Menu Navigation Links */}
              <nav className="p-3 space-y-0.5">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`sidebar-link relative ${active ? "active" : ""}`}
                    >
                      <Icon className="h-4.5 w-4.5 shrink-0" />
                      <span className="truncate">{t(item.labelAr, item.labelEn)}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Controls: Language, Theme & Logout */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-900/60 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-2">
              {/* Language & Theme Controls Row */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                  className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-extrabold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-850 transition-all cursor-pointer"
                >
                  <Globe className="h-4 w-4 text-cyan-500" />
                  <span>{lang === "ar" ? "English" : "العربية"}</span>
                </button>

                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-extrabold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-850 transition-all cursor-pointer"
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="h-4 w-4 text-amber-400" />
                      <span>Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4 text-zinc-600" />
                      <span>Dark</span>
                    </>
                  )}
                </button>
              </div>

              {/* Logout button */}
              <button
                onClick={() => {
                  onClose();
                  logout();
                }}
                className="flex w-full items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-red-500 rounded-xl hover:bg-red-500/10 transition-all cursor-pointer border border-red-500/20 bg-red-500/5"
              >
                <LogOut className="h-4.5 w-4.5" />
                <span>{t("تسجيل الخروج", "Logout")}</span>
              </button>

              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/60 mt-2">
                <DeveloperCredit variant="sidebar" />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
