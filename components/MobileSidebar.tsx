"use client";

import * as React from"react";
import Link from"next/link";
import { usePathname } from"next/navigation";
import { useApp } from"@/context/app-context";
import { useAuth } from"@/context/auth-context";
import { useAnimationProps } from"@/lib/motion";
import { motion, AnimatePresence } from"framer-motion";
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
} from"lucide-react";
import { DeveloperCredit } from"@/components/ui/developer-credit";
import { Logo } from"@/components/ui/logo";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { lang, setLang, theme, setTheme, t, dir, userRole } = useApp();
  const { shouldAnimate } = useAnimationProps();

  const isRtl = dir ==="rtl";
  const isAdminUser = userRole ==="admin" || userRole ==="super-admin" || userRole ==="moderator";

  const userAvatar = user?.avatar ||"🎓";
  const isImageAvatar = userAvatar.startsWith("data:image/") || userAvatar.startsWith("http");

  const menuItems = isAdminUser
    ? [
        { labelAr:"لوحة الإدارة ️", labelEn:"Admin Dashboard ️", href:"/admin", icon: Shield },
        { labelAr:"لوحة التحكم", labelEn:"Dashboard", href:"/dashboard", icon: LayoutDashboard },
        { labelAr:"دليل ومستكشف المواد", labelEn:"Course Explorer", href:"/courses", icon: BookOpen },
        { labelAr:"المنتدى الطلابي", labelEn:"Student Forum", href:"/community", icon: MessageSquare },
        { labelAr:"دليل الطلاب", labelEn:"Student Directory", href:"/directory", icon: Users },
        { labelAr:"الفرص والتوظيف", labelEn:"Careers & Jobs", href:"/careers", icon: Briefcase },
        { labelAr:"مسارات خارطة الطريق", labelEn:"Career Roadmaps", href:"/roadmaps", icon: Layers },
        { labelAr:"الملف الشخصي", labelEn:"Admin Profile", href:"/profile", icon: User },
        { labelAr:"الإعدادات", labelEn:"Portal Settings", href:"/settings", icon: Settings }
      ]
    : [
        { labelAr:"لوحة التحكم", labelEn:"Dashboard", href:"/dashboard", icon: LayoutDashboard },
        { labelAr:"المرشد الذكي (AI)", labelEn:"AI Assistant", href:"/ai-assistant", icon: Bot },
        { labelAr:"الخطة الدراسية والتقدم", labelEn:"Curriculum Checklist", href:"/departments", icon: CheckCircle },
        { labelAr:"مخطط التسجيل الذكي", labelEn:"Registration Planner", href:"/planner", icon: Compass },
        { labelAr:"حاسبة المعدل (GPA)", labelEn:"GPA Calculator", href:"/gpa", icon: Calculator, key:"gpa" },
        { labelAr:"دليل ومستكشف المواد", labelEn:"Course Explorer", href:"/courses", icon: BookOpen, key:"courses" },
        { labelAr:"المنتدى الطلابي", labelEn:"Student Forum", href:"/community", icon: MessageSquare, key:"community" },
        { labelAr:"دليل الطلاب", labelEn:"Student Directory", href:"/directory", icon: Users, key:"directory" },
        { labelAr:"الفرص والتوظيف", labelEn:"Careers & Jobs", href:"/careers", icon: Briefcase, key:"careers" },
        { labelAr:"مسارات خارطة الطريق", labelEn:"Career Roadmaps", href:"/roadmaps", icon: Layers },
        { labelAr:"الملف الشخصي", labelEn:"Student Profile", href:"/profile", icon: User },
        { labelAr:"الإعدادات", labelEn:"Portal Settings", href:"/settings", icon: Settings }
      ];

  // Prevent background scrolling when mobile sidebar is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow ="hidden";
    } else {
      document.body.style.overflow ="";
    }
    return () => {
      document.body.style.overflow ="";
    };
  }, [isOpen]);

  const slideInitial = isRtl ? { x:"100%" } : { x:"-100%" };
  const slideAnimate = { x: 0 };
  const slideExit = isRtl ? { x:"100%" } : { x:"-100%" };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 sm:hidden" dir={dir}>
          {/* Dimmer Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Drawer Content */}
          <motion.div
            initial={shouldAnimate ? slideInitial : slideAnimate}
            animate={slideAnimate}
            exit={slideExit}
            transition={{ type:"spring", damping: 28, stiffness: 280 }}
            className={`fixed inset-y-0 ${
              isRtl ?"right-0 border-l" :"left-0 border-r"
            } z-50 w-72 max-w-[85vw] bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-850 h-full flex flex-col justify-between shadow-2xl overflow-y-auto overscroll-contain`}
          >
            {/* Header & Close Button */}
            <div>
              <div className="h-16 px-5 border-b border-zinc-200 dark:border-zinc-850 flex items-center justify-between">
                <Logo size="sm" href="/dashboard" />
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-850 transition-colors cursor-pointer"
                  aria-label="Close Sidebar"
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
                      className={`sidebar-link relative ${active ?"active" :""}`}
                    >
                      <Icon className="h-4.5 w-4.5 shrink-0" />
                      <span className="truncate">{t(item.labelAr, item.labelEn)}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Controls: Language, Theme & Logout */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-950/40 space-y-2">
              {/* Language & Theme Controls Row */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setLang(lang ==="ar" ?"en" :"ar")}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-850 transition-all cursor-pointer shadow-2xs"
                >
                  <Globe className="h-4 w-4 text-foreground dark:text-sky-400" />
                  <span>{lang ==="ar" ?"English" :"العربية"}</span>
                </button>

                <button
                  onClick={() => setTheme(theme ==="dark" ?"light" :"dark")}
                  suppressHydrationWarning
                  className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-850 transition-all cursor-pointer shadow-2xs"
                >
                  {theme ==="dark" ? (
                    <>
                      <Sun className="h-4 w-4 text-amber-400" />
                      <span>{t("فاتح","Light")}</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4 text-foreground" />
                      <span>{t("داكن","Dark")}</span>
                    </>
                  )}
                </button>
              </div>

              {/* User Profile Card */}
              <div className="flex items-center gap-1.5 p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
                <Link href="/profile" onClick={() => onClose()} className="flex items-center gap-2.5 flex-1 min-w-0 group hover:opacity-80 transition-opacity">
                  <div className="h-9 w-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-base overflow-hidden shrink-0">
                    {isImageAvatar ? (
                      <img src={userAvatar} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      userAvatar
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-sky-600 transition-colors">{user?.name || t("طالب سيناء", "Student")}</h5>
                    <span className="text-[10px] text-zinc-400 block truncate leading-none mt-0.5">
                      {userRole === "student" ? t("طالب الكلية", "Faculty Student") : t("مشرف المنصة", "Admin")}
                    </span>
                  </div>
                </Link>
                <button
                  onClick={() => {
                    onClose();
                    logout();
                  }}
                  className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                  title={t("تسجيل الخروج","Logout")}
                  aria-label="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>

              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 mt-2">
                <DeveloperCredit variant="sidebar" />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
