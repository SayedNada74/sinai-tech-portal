"use client";

import * as React from"react";
import { useApp } from"@/context/app-context";
import { useAdmin } from"@/context/admin-context";
import { UserProfile } from"@/context/auth-context";
import { Card, CardHeader, CardTitle, CardContent } from"@/components/ui/card";
import { Badge } from"@/components/ui/badge";
import { Button } from"@/components/ui/button";
import Link from"next/link";
import { cn, getAvatarFallback, isValidImageAvatar, getLocalizedUserName } from "@/lib/utils";
import {
  User,
  GraduationCap,
  Globe,
  Link2,
  FileText,
  Award,
  ChevronLeft,
  ArrowRight,
  ArrowLeft
} from"lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PublicProfilePage({ params }: PageProps) {
  const { t, lang, dir } = useApp();
  const { users } = useAdmin();
  const resolvedParams = React.use(params);
  const userId = decodeURIComponent(resolvedParams.id);

  // Find user by ID
  const profile = users.find((u) => u.id === userId);

  const isRtl = dir ==="rtl";
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  if (!profile) {
    return (
      <div className="text-center py-20" dir={dir}>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {t("لم يتم العثور على حساب الطالب.","Student profile not found.")}
        </h2>
        <Link href="/directory" className="inline-block mt-6">
          <Button variant="outline">
            {t("العودة إلى الدليل","Back to Directory")}
          </Button>
        </Link>
      </div>
    );
  }

  // Privacy Settings Check
  const publicSkills = profile.privacySettings?.publicSkills ?? true;
  const publicProjects = profile.privacySettings?.publicProjects ?? true;

  const displayName = getLocalizedUserName(profile, lang);

  const getLevelLabel = (lvl?: string) => {
    if (!lvl) return "";
    if (lang === "en") {
      if (lvl.includes("الأول") || lvl === "Level 1" || lvl === "Year 1") return "Level 1 (Freshman)";
      if (lvl.includes("الثاني") || lvl === "Level 2" || lvl === "Year 2") return "Level 2 (Sophomore)";
      if (lvl.includes("الثالث") || lvl === "Level 3" || lvl === "Year 3") return "Level 3 (Junior)";
      if (lvl.includes("الرابع") || lvl === "Level 4" || lvl === "Year 4") return "Level 4 (Senior)";
      if (lvl.includes("خريج") || lvl.toLowerCase().includes("grad") || lvl.toLowerCase().includes("alumni")) return "Graduate (Alumni)";
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700" dir={dir}>
      
      {/* Header / Back */}
      <div className="flex items-center gap-4">
        <Link href="/directory">
          <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
            <BackArrow className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
            {displayName}
          </h1>
          <p className="text-sm text-zinc-500 font-bold">
            {t("الملف الشخصي العام","Public Profile")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Left Column: Basic Info */}
        <div className="col-span-1 space-y-6">
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-3xl overflow-hidden bg-white/70 dark:bg-zinc-900/40 backdrop-blur-3xl">
            <CardContent className="p-6 text-center">
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-tr from-sky-100 to-sky-50 dark:from-sky-900/40 dark:to-sky-500/10 flex items-center justify-center border-4 border-white dark:border-zinc-900 shadow-xl overflow-hidden mb-4">
                {isValidImageAvatar(profile.avatar) ? (
                  <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-16 w-16 text-sky-700/50 dark:text-sky-300/50" />
                )}
              </div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50">{displayName}</h2>
              <div className="mt-2 flex items-center justify-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                <GraduationCap className="h-4 w-4" />
                <span className="text-sm font-bold">{getLevelLabel(profile.level)} {profile.department ? ` - ${getDeptLabel(profile.department)}` :""}</span>
              </div>
              <Badge variant="outline" className="mt-3 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 font-bold">
                {profile.studentId}
              </Badge>
            </CardContent>
          </Card>

          {/* Bio Card */}
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-3xl bg-white/70 dark:bg-zinc-900/40 backdrop-blur-3xl">
            <CardHeader className="p-5 border-b border-zinc-100 dark:border-zinc-850">
              <CardTitle className="text-base font-black flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                {t("السيرة الذاتية","Bio")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <p className="text-sm text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed whitespace-pre-wrap">
                {getFormattedBio(profile.bio)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Skills & Projects */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          
          {/* Skills & Social Links (If Public) */}
          {publicSkills ? (
            <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-3xl bg-white/70 dark:bg-zinc-900/40 backdrop-blur-3xl">
              <CardHeader className="p-5 border-b border-zinc-100 dark:border-zinc-850">
                <CardTitle className="text-base font-black flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  {t("المهارات والروابط","Skills & Social Links")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-zinc-500 mb-3">{t("المهارات التقنية","Technical Skills")}</h4>
                  {profile.skills && profile.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 px-3 py-1 text-xs font-bold">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-400">{t("لم يتم إضافة مهارات.","No skills added.")}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profile.socialLinks?.github && (
                    <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                        <svg className="h-4 w-4 text-zinc-700 dark:text-zinc-300" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </div>
                      <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 line-clamp-1">{profile.socialLinks.github.replace("https://github.com/","")}</span>
                    </a>
                  )}
                  {profile.socialLinks?.linkedin && (
                    <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                        <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </div>
                      <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 line-clamp-1">{profile.socialLinks.linkedin.replace("https://linkedin.com/in/","").replace("https://www.linkedin.com/in/","")}</span>
                    </a>
                  )}
                  {profile.socialLinks?.website && (
                    <a href={profile.socialLinks.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                        <Globe className="h-4 w-4 text-primary dark:text-zinc-400" />
                      </div>
                      <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 line-clamp-1">{profile.socialLinks.website.replace("https://","")}</span>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed border-zinc-200 dark:border-zinc-800 shadow-none rounded-3xl bg-transparent">
              <CardContent className="p-8 text-center text-zinc-400">
                {t("قام الطالب بإخفاء مهاراته وروابط التواصل.","The student has hidden their skills and social links.")}
              </CardContent>
            </Card>
          )}

          {/* Projects & Portfolio (If Public) */}
          {publicProjects ? (
            <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm rounded-3xl bg-white/70 dark:bg-zinc-900/40 backdrop-blur-3xl">
              <CardHeader className="p-5 border-b border-zinc-100 dark:border-zinc-850">
                <CardTitle className="text-base font-black flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  {t("المشاريع ومعرض الأعمال","Projects & Portfolio")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                {profile.projects && profile.projects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {profile.projects.map((proj, idx) => (
                      <div key={idx} className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 hover:shadow-md transition-shadow">
                        <h4 className="font-bold text-zinc-900 dark:text-zinc-50 text-sm mb-1">{proj.title}</h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">{proj.description}</p>
                        {proj.link && (
                          <a href={proj.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline">
                            <Link2 className="h-3 w-3" />
                            {t("عرض المشروع","View Project")}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {t("لم يتم إضافة مشاريع بعد.","No projects added yet.")}
                  </p>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed border-zinc-200 dark:border-zinc-800 shadow-none rounded-3xl bg-transparent">
              <CardContent className="p-8 text-center text-zinc-400">
                {t("قام الطالب بإخفاء قسم المشاريع ومعرض الأعمال.","The student has hidden their projects and portfolio.")}
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
