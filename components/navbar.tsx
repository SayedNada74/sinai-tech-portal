"use client";

import * as React from "react";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useApp } from "@/context/app-context";
import { Menu, X, Sun, Moon, Sparkles, GraduationCap, User, LayoutDashboard, Settings, LogOut, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, setTheme, lang, setLang, t, dir } = useApp();
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const isDark = theme === "dark";
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navLinks = [
    { label: t("الرئيسية", "Home"), href: "/#hero" },
    { label: t("الميزات", "Features"), href: "/#features" },
    { label: t("المميزات الإحصائية", "Statistics"), href: "/#stats" },
    { label: t("الأسئلة الشائعة", "FAQ"), href: "/#faq" }
  ];

  const userAvatar = user?.avatar || "🎓";
  const isImageAvatar = userAvatar.startsWith("data:image/") || userAvatar.startsWith("http");

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300 border-b border-transparent",
          scrolled
            ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg shadow-sm border-zinc-200/50 dark:border-zinc-800/50 py-3"
            : "bg-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between" dir={dir}>
          {/* Logo */}
          <Logo size="md" href="/" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-zinc-600 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
              aria-label="Toggle theme"
              title={t("تبديل مظهر الموقع", "Toggle Theme")}
            >
              {isDark ? <Sun className="h-4.5 w-4.5 text-amber-500" /> : <Moon className="h-4.5 w-4.5 text-zinc-700" />}
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="p-2.5 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1.5"
              title={t("تغيير لغة المنصة", "Change Language")}
            >
              <Globe className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              <span>{lang === "ar" ? "English" : "العربية"}</span>
            </button>

            {isAuthenticated ? (
              /* User Dropdown Menu */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="h-10 w-10 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-800/30 flex items-center justify-center text-lg shadow-sm hover:scale-105 transition-transform cursor-pointer overflow-hidden"
                >
                  {isImageAvatar ? (
                    <img src={userAvatar} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    userAvatar
                  )}
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute ${lang === "ar" ? "left-0" : "right-0"} mt-3.5 w-56 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 shadow-xl py-2 z-50`}
                    >
                      {/* User metadata */}
                      <div className="px-4.5 py-3 border-b border-zinc-100 dark:border-zinc-850">
                        <p className="font-bold text-sm text-zinc-900 dark:text-zinc-50 truncate">{user?.name}</p>
                        <p className="text-[10px] text-zinc-400 mt-0.5 truncate">{user?.email}</p>
                      </div>

                      <div className="p-1 space-y-0.5">
                        <Link
                          href="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-850 rounded-xl transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4 text-zinc-450" />
                          {t("لوحة التحكم", "Dashboard")}
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-850 rounded-xl transition-colors"
                        >
                          <User className="h-4 w-4 text-zinc-450" />
                          {t("الملف الشخصي", "Student Profile")}
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-850 rounded-xl transition-colors"
                        >
                          <Settings className="h-4 w-4 text-zinc-450" />
                          {t("إعدادات المنصة", "Settings")}
                        </Link>
                      </div>

                      <div className="border-t border-zinc-100 dark:border-zinc-850 p-1 mt-1">
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            logout();
                          }}
                          className="flex w-full items-center gap-3 px-3.5 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" />
                          {t("تسجيل الخروج", "Logout")}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Guest Actions */
              <>
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">{t("تسجيل الدخول", "Sign In")}</Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="sm" className="gap-1.5 font-bold">
                    <Sparkles className="h-4 w-4" />
                    {t("ابدأ التخطيط", "Get Started")}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="p-2 rounded-lg border border-zinc-200 text-zinc-600 dark:border-zinc-800 dark:text-zinc-400 text-xs font-bold cursor-pointer"
            >
              {lang === "ar" ? "EN" : "عربي"}
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-zinc-200 text-zinc-600 dark:border-zinc-800 dark:text-zinc-400 cursor-pointer"
            >
              {isDark ? <Sun className="h-4.5 w-4.5 text-amber-500" /> : <Moon className="h-4.5 w-4.5 text-zinc-700" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg border border-zinc-200 text-zinc-600 dark:border-zinc-800 dark:text-zinc-400 cursor-pointer"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[73px] z-40 md:hidden bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shadow-xl py-6 px-6"
            dir={dir}
          >
            <nav className="flex flex-col gap-4.5 mb-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-base font-semibold text-zinc-700 hover:text-violet-600 dark:text-zinc-300 dark:hover:text-violet-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/40 rounded-xl mb-1">
                    <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800/30 flex items-center justify-center text-xl overflow-hidden shrink-0">
                      {isImageAvatar ? (
                        <img src={userAvatar} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        userAvatar
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate">{user?.name}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{user?.email}</p>
                    </div>
                  </div>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start gap-2.5">
                      <LayoutDashboard className="h-4.5 w-4.5" />
                      {t("لوحة التحكم", "Dashboard")}
                    </Button>
                  </Link>
                  <Link href="/profile" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start gap-2.5">
                      <User className="h-4.5 w-4.5" />
                      {t("الملف الشخصي", "Student Profile")}
                    </Button>
                  </Link>
                  <Link href="/settings" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start gap-2.5">
                      <Settings className="h-4.5 w-4.5" />
                      {t("إعدادات المنصة", "Portal Settings")}
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      setIsOpen(false);
                      logout();
                    }}
                    className="w-full gap-2.5 bg-red-600 hover:bg-red-500 text-white cursor-pointer"
                  >
                    <LogOut className="h-4.5 w-4.5" />
                    {t("تسجيل الخروج", "Logout")}
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">{t("تسجيل الدخول", "Sign In")}</Button>
                  </Link>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button className="w-full gap-1.5">
                      <Sparkles className="h-4 w-4" />
                      {t("ابدأ التخطيط", "Get Started")}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
