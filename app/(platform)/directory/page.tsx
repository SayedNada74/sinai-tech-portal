"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { useAuth } from "@/context/auth-context";
import { useAdmin } from "@/context/admin-context";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Search, Users, GraduationCap, ChevronLeft, ArrowLeft, ArrowRight, User, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, getAvatarFallback, isValidImageAvatar, getLocalizedUserName, matchesUserQuery } from "@/lib/utils";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { UserAvatar } from "@/components/ui/user-avatar";

export default function DirectoryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t, lang, dir } = useApp();
  const { users, settings } = useAdmin();

  const isAdmin = user?.role === "admin" || user?.role === "super-admin" || user?.role === "moderator";
  const directoryStatus = settings?.featureAccess?.studentDirectory || "ALL";

  React.useEffect(() => {
    if (directoryStatus === "DISABLED" || (directoryStatus === "ADMIN_ONLY" && !isAdmin)) {
      router.replace("/dashboard");
    }
  }, [directoryStatus, isAdmin, router]);

  // Persist search query and level filter across navigation
  const [searchQuery, setSearchQuery] = useLocalStorage<string>("su_directory_search_query", "");
  const [filterLevel, setFilterLevel] = useLocalStorage<string>("su_directory_filter_level", "all");

  if (directoryStatus === "DISABLED" || (directoryStatus === "ADMIN_ONLY" && !isAdmin)) {
    return null;
  }
  
  const isRtl = dir === "rtl";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const levels = React.useMemo(() => {
    const studentUsers = users.filter((u) => !u.role || u.role === "student");
    const uniqueLevels = new Set(studentUsers.map((u) => u.level).filter(Boolean));
    return Array.from(uniqueLevels);
  }, [users]);

  const filteredUsers = React.useMemo(() => {
    // If search is empty, don't show any users (privacy protection)
    if (!searchQuery || searchQuery.trim() === "") {
      return [];
    }

    return users.filter((u) => {
      // Hide admin accounts from the directory completely
      if (u.role && u.role !== "student") return false;

      const matchesSearch = matchesUserQuery(u, searchQuery);
      const matchesLevel = filterLevel === "all" || u.level === filterLevel;
      
      return matchesSearch && matchesLevel;
    });
  }, [users, searchQuery, filterLevel]);

  const getLevelLabel = (lvl?: string) => {
    if (!lvl) return "";
    if (lang === "en") {
      if (lvl.includes("الأول") || lvl === "Level 1" || lvl === "Year 1") return "Level 1 (Freshman)";
      if (lvl.includes("الثاني") || lvl === "Level 2" || lvl === "Year 2") return "Level 2 (Sophomore)";
      if (lvl.includes("الثالث") || lvl === "Level 3" || lvl === "Year 3") return "Level 3 (Junior)";
      if (lvl.includes("الرابع") || lvl === "Level 4" || lvl === "Year 4") return "Level 4 (Senior)";
      if (lvl.includes("خريج") || lvl.toLowerCase().includes("grad") || lvl.toLowerCase().includes("alumni")) return "Graduate (Alumni)";
      if (lvl.includes("الكادر الإداري")) return "Administrative Staff";
      if (lvl.includes("الإدارة العليا")) return "University Management";
      if (lvl.includes("كادر التنسيق")) return "Student Coordination Staff";
    }
    return lvl;
  };

  const getDeptLabel = (dept?: string) => {
    if (!dept) return"";
    if (lang ==="en") {
      if (dept.includes("تكنولوجيا المعلومات") || dept ==="IT") return"Information Technology (IT)";
      if (dept.includes("علوم الحاسب") || dept ==="CS") return"Computer Science (CS)";
      if (dept.includes("نظم المعلومات") || dept ==="IS") return"Information Systems (IS)";
      if (dept.includes("عام") || dept.includes("أساسي")) return"General Computer Science";
    }
    return dept;
  };

  const getFormattedBio = (b?: string) => {
    if (!b || !b.trim()) return t("لا توجد سيرة ذاتية.","No bio provided.");
    if (lang ==="en") {
      if (b.includes("طالب مسجل في المنصة الأكاديمية") || b.includes("طالب مسجل في المنصة")) {
        return"Registered student on Sinai University Tech Portal.";
      }
      if (b.includes("طالب جديد في منصة")) {
        return"New student on Sinai University Tech Portal.";
      }
      if (b.includes("حساب جديد في المنصة")) {
        return"New account on the academic platform.";
      }
      if (b.includes("مستخدم مسجل وموثق")) {
        return"Verified student on Sinai University Tech Portal.";
      }
      if (b.includes("مسؤول النظام الإداري")) {
        return"System Administrator";
      }
      if (b.includes("المشرف الأعلى على المنصة")) {
        return"Super Administrator";
      }
      if (b.includes("منسق ومراجع المحتوى")) {
        return"Content Moderator";
      }
    }
    return b;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-[calc(100vh+30px)] pb-12" dir={dir}>
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-950 dark:text-zinc-50 flex items-center gap-2.5">
          <Users className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
          {t("دليل الطلاب","Student Directory")}
        </h1>
        <p className="text-sm text-zinc-500 mt-2 font-bold max-w-2xl">
          {t("ابحث عن زملائك، وتعرف على مهاراتهم، وقم بزيارة ملفاتهم الشخصية.","Find your peers, discover their skills, and visit their profiles.")}
        </p>
      </div>

      {/* Filters & Search */}
      <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-3xl bg-white/70 dark:bg-zinc-900/40 backdrop-blur-3xl overflow-hidden">
        <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className={`absolute ${isRtl ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 pointer-events-none`} />
            <Input
              placeholder={t("ابحث بالاسم (عربي أو إنجليزي) أو الرقم الأكاديمي أو البريد...", "Search by name (Arabic/English), academic ID, or email...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`h-12 bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-2xl ${isRtl ? "pr-11 pl-10" : "pl-11 pr-10"}`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className={`absolute ${isRtl ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors`}
                title={t("مسح البحث", "Clear search")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide shrink-0 items-center">
            <Button
              variant={filterLevel ==="all" ?"default" :"outline"}
              onClick={() => setFilterLevel("all")}
              className="rounded-xl h-10 px-4 whitespace-nowrap"
            >
              {t("الكل","All")}
            </Button>
            {levels.map((lvl) => (
              <Button
                key={lvl}
                variant={filterLevel === lvl ?"default" :"outline"}
                onClick={() => setFilterLevel(lvl)}
                className="rounded-xl h-10 px-4 whitespace-nowrap"
              >
                {getLevelLabel(lvl)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link href={`/profile/${user.id}`}>
                  <Card className="group h-full border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-sky-200 dark:hover:border-sky-800/50 rounded-3xl overflow-hidden bg-white/70 dark:bg-zinc-900/40 backdrop-blur-3xl transition-all cursor-pointer relative">
                    <CardContent className="p-5 flex flex-col items-center text-center h-full relative z-10">
                      <UserAvatar
                        src={user.avatar}
                        name={getLocalizedUserName(user, lang)}
                        className="w-20 h-20 mb-3 group-hover:scale-105 transition-transform"
                      />
                      
                      <h3 className="font-extrabold text-zinc-950 dark:text-zinc-50 text-base line-clamp-1">
                        {getLocalizedUserName(user, lang)}
                      </h3>
                      
                      <div className="mt-1.5 flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 font-bold">
                        <GraduationCap className="h-3.5 w-3.5" />
                        <span>{getLevelLabel(user.level)}</span>
                      </div>
                      {user.bio && (
                        <p className="mt-4 text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2 leading-relaxed h-[36px]">
                          {getFormattedBio(user.bio)}
                        </p>
                      )}
                      
                      <p className="mt-2 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {getDeptLabel(user.department)}
                      </p>

                      <div className="mt-auto pt-4 w-full flex justify-center">
                        <span className="text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1 group-hover:gap-2 transition-all">
                          {t("زيارة الملف الشخصي","View Profile")}
                          <ArrowIcon className="h-3 w-3" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <p className="text-zinc-500 font-bold">
                {(!searchQuery || searchQuery.trim() ==="")
                  ? t("اكتب اسم الطالب أو الرقم الأكاديمي في شريط البحث لعرض النتائج.","Type a student name or academic ID in the search bar to view results.")
                  : t("لم يتم العثور على أي طلاب مطابقين للبحث.","No students found matching your search.")}
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
