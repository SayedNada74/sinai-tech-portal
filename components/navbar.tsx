"use client";

import * as React from"react";
import { Logo } from"@/components/ui/logo";
import Link from"next/link";
import { useAuth } from"@/context/auth-context";
import { useApp } from"@/context/app-context";
import { Menu, X, Sun, Moon, Sparkles, GraduationCap, User, LayoutDashboard, Settings, LogOut, Globe } from"lucide-react";
import { Button } from"@/components/ui/button";
import { cn, getAvatarFallback, isValidImageAvatar } from"@/lib/utils";
import { motion, AnimatePresence, useScroll, useSpring } from"framer-motion";
import { DeveloperCredit } from"@/components/ui/developer-credit";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, setTheme, lang, setLang, t, dir } = useApp();
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const isDark = theme ==="dark";
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Smooth scroll progress indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001
  });

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(theme ==="dark" ?"light" :"dark");
  };

  const navLinks = [
    { label: t("الرئيسية","Home"), href:"/#hero" },
    { label: t("الميزات","Features"), href:"/#features" },
    { label: t("المميزات الإحصائية","Statistics"), href:"/#stats" },
    { label: t("الأسئلة الشائعة","FAQ"), href:"/#faq" }
  ];

  const userAvatar = user?.avatar ||"🎓";
  const userName = user?.name ||"";
  const isImageAvatar = isValidImageAvatar(userAvatar);

  return (
    <>
      {/* Dynamic Scroll Progress Bar */}
      <motion.div
        style={{ scaleX, transformOrigin: dir ==="rtl" ?"right" :"left" }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-600 via-cyan-500 to-sky-400 z-[70] shadow-[0_0_12px_rgba(2,132,199,0.7)]"
      />

      <header
        className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-xl border-b border-zinc-200/80 dark:border-zinc-850/80 shadow-xs py-3.5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between" dir={dir}>
          {/* Logo */}
          <Logo size="md" href="/" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-zinc-600 hover:text-sky-600 dark:text-zinc-400 dark:hover:text-sky-400 transition-colors duration-200"
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
              suppressHydrationWarning
              className="p-2.5 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
              aria-label="Toggle theme"
              title={t("تبديل مظهر الموقع","Toggle Theme")}
            >
              {isDark ? <Sun className="h-4.5 w-4.5 text-amber-500" /> : <Moon className="h-4.5 w-4.5 text-foreground" />}
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang ==="ar" ?"en" :"ar")}
              className="p-2.5 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1.5"
              title={t("تغيير لغة المنصة","Change Language")}
            >
              <Globe className="h-4 w-4 text-foreground dark:text-sky-400" />
              <span>{lang ==="ar" ?"English" :"العربية"}</span>
            </button>

            {/* Developer Credit */}
            <DeveloperCredit variant="navbar" />

            {isAuthenticated ? (
              /* User Dropdown Menu */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="h-10 w-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-800/30 flex items-center justify-center text-lg shadow-sm hover:scale-105 transition-transform cursor-pointer overflow-hidden"
                >
                  {isImageAvatar ? (
                    <img src={userAvatar} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-5 w-5 text-sky-700 dark:text-sky-300" />
                  )}
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute ${lang ==="ar" ?"left-0" :"right-0"} mt-3.5 w-56 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 shadow-xl py-2 z-50`}
                    >
                      {/* User metadata */}
                      <div className="px-4.5 py-3 border-b border-zinc-100 dark:border-zinc-850">
                        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-50 truncate">{userName}</p>
                        <p className="text-[10px] text-zinc-400 truncate mt-0.5">{user?.email}</p>
                      </div>

                      <div className="p-1.5 space-y-1">
                        <Link href="/dashboard" onClick={() => setDropdownOpen(false)}>
                          <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                            <LayoutDashboard className="h-4 w-4" />
                            <span>{t("لوحة التحكم","Dashboard")}</span>
                          </div>
                        </Link>

                        <Link href="/profile" onClick={() => setDropdownOpen(false)}>
                          <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                            <User className="h-4 w-4" />
                            <span>{t("الملف الشخصي","Profile")}</span>
                          </div>
                        </Link>

                        <Link href="/settings" onClick={() => setDropdownOpen(false)}>
                          <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                            <Settings className="h-4 w-4" />
                            <span>{t("الإعدادات","Settings")}</span>
                          </div>
                        </Link>

                        <div className="pt-1 border-t border-zinc-100 dark:border-zinc-800">
                          <button
                            onClick={() => {
                              setDropdownOpen(false);
                              logout();
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-colors cursor-pointer"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>{t("تسجيل الخروج","Logout")}</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Guest Actions */
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="outline" size="sm" className="rounded-xl font-bold border-zinc-200 dark:border-zinc-800 text-xs px-3.5 h-9">{t("تسجيل الدخول","Sign In")}</Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="sm" className="gap-1.5 font-bold rounded-xl text-xs px-3.5 h-9 bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/20">
                    <Sparkles className="h-4 w-4" />
                    {t("ابدأ التخطيط","Get Started")}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setLang(lang ==="ar" ?"en" :"ar")}
              className="px-2.5 py-1.5 rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 text-zinc-800 dark:text-zinc-200 text-xs font-bold shadow-2xs hover:bg-zinc-100 dark:hover:bg-zinc-850 transition-colors cursor-pointer"
            >
              {lang ==="ar" ?"EN" :"عربي"}
            </button>
            <button
              onClick={toggleTheme}
              suppressHydrationWarning
              className="p-2 rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 text-zinc-800 dark:text-zinc-200 shadow-2xs hover:bg-zinc-100 dark:hover:bg-zinc-850 transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4.5 w-4.5 text-amber-500" /> : <Moon className="h-4.5 w-4.5 text-foreground" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 text-zinc-800 dark:text-zinc-200 shadow-2xs hover:bg-zinc-100 dark:hover:bg-zinc-850 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>
      {/* Spacer to prevent layout shift with fixed header */}
      <div className="h-[68px] shrink-0" />

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 top-[65px] bg-zinc-950/60 backdrop-blur-xs z-30 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease:"easeOut" }}
              className="fixed inset-x-0 top-[65px] z-40 md:hidden bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 shadow-2xl py-5 px-4 sm:py-6 sm:px-6 max-h-[calc(100vh-75px)] overflow-y-auto"
              dir={dir}
            >
            <nav className="flex flex-col gap-4.5 mb-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-base font-semibold text-zinc-700 hover:text-sky-600 dark:text-zinc-300 dark:hover:text-sky-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/40 rounded-xl mb-1">
                    <div className="h-10 w-10 rounded-xl bg-sky-100 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/30 flex items-center justify-center text-xl overflow-hidden shrink-0">
                      {isImageAvatar ? (
                        <img src={userAvatar} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-5 w-5 text-sky-700 dark:text-sky-300" />
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
                      {t("لوحة التحكم","Dashboard")}
                    </Button>
                  </Link>
                  <Link href="/profile" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start gap-2.5">
                      <User className="h-4.5 w-4.5" />
                      {t("الملف الشخصي","Student Profile")}
                    </Button>
                  </Link>
                  <Link href="/settings" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start gap-2.5">
                      <Settings className="h-4.5 w-4.5" />
                      {t("إعدادات المنصة","Portal Settings")}
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
                    {t("تسجيل الخروج","Logout")}
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">{t("تسجيل الدخول","Sign In")}</Button>
                  </Link>
                  <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                    <Button className="w-full gap-1.5">
                      <Sparkles className="h-4 w-4" />
                      {t("ابدأ التخطيط","Get Started")}
                    </Button>
                  </Link>
                </>
              )}

              {/* Developer Credit Mobile */}
              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-850/60 mt-1 flex justify-center">
                <DeveloperCredit variant="footer" />
              </div>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
