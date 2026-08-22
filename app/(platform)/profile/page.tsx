"use client";

import * as React from "react";
import { useApp } from "@/context/app-context";
import { useAuth, UserProfile } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedNumber } from "@/components/ui/animated-number";
import {
  User,
  Mail,
  GraduationCap,
  Globe,
  Link2,
  ShieldAlert,
  Award,
  FileText,
  Check,
  Plus,
  Trash2,
  X,
  Camera,
  Upload
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const { t, lang, dir } = useApp();
  const { user, updateProfile, isLoading } = useAuth();

  const [nameAr, setNameAr] = React.useState("");
  const [nameEn, setNameEn] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [level, setLevel] = React.useState("");
  const [studentId, setStudentId] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [github, setGithub] = React.useState("");
  const [linkedin, setLinkedin] = React.useState("");
  const [portfolioUrl, setPortfolioUrl] = React.useState("");
  const [skills, setSkills] = React.useState<string[]>([]);
  const [newSkill, setNewSkill] = React.useState("");
  const [avatar, setAvatar] = React.useState("🎓");

  // Portfolio items
  const [cvUrl, setCvUrl] = React.useState("");
  const [projects, setProjects] = React.useState<{ title: string; description: string; link: string }[]>([]);
  const [newProjTitle, setNewProjTitle] = React.useState("");
  const [newProjDesc, setNewProjDesc] = React.useState("");
  const [newProjLink, setNewProjLink] = React.useState("");
  const [isAddProjOpen, setIsAddProjOpen] = React.useState(false);

  const [message, setMessage] = React.useState({ type: "", text: "" });
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = React.useState(false);
  const isUploadingImageRef = React.useRef(false);

  // Privacy Settings
  const [publicSkills, setPublicSkills] = React.useState(true);
  const [publicProjects, setPublicProjects] = React.useState(true);

  const isInitialized = React.useRef(false);

  // Initialize fields from Auth context or draft from localStorage
  React.useEffect(() => {
    if (user && !isInitialized.current) {
      let loadedFromDraft = false;
      if (typeof window !== "undefined") {
        try {
          const draftStr = localStorage.getItem(`su_profile_draft_${user.id}`);
          if (draftStr) {
            const draft = JSON.parse(draftStr);
            setNameAr(draft.nameAr ?? user.nameAr ?? "");
            setNameEn(draft.nameEn ?? user.nameEn ?? "");
            setEmail(draft.email ?? user.email ?? "");
            setLevel(draft.level ?? user.level ?? "");
            setStudentId(draft.studentId ?? user.studentId ?? "");
            setBio(draft.bio ?? user.bio ?? "");
            setGithub(draft.github ?? user.socialLinks?.github ?? "");
            setLinkedin(draft.linkedin ?? user.socialLinks?.linkedin ?? "");
            setPortfolioUrl(draft.portfolioUrl ?? user.socialLinks?.website ?? user.socialLinks?.twitter ?? "");
            setSkills(draft.skills ?? user.skills ?? []);
            setAvatar(draft.avatar ?? user.avatar ?? "🎓");
            setCvUrl(draft.cvUrl ?? user.cvUrl ?? "");
            setProjects(draft.projects ?? user.projects ?? []);
            setPublicSkills(draft.publicSkills ?? user.privacySettings?.publicSkills ?? true);
            setPublicProjects(draft.publicProjects ?? user.privacySettings?.publicProjects ?? true);
            loadedFromDraft = true;
          }
        } catch (e) {
          console.warn("Failed to load profile draft", e);
        }
      }

      if (!loadedFromDraft) {
        setNameAr(user.nameAr || "");
        setNameEn(user.nameEn || "");
        setEmail(user.email || "");
        setLevel(user.level || "");
        setStudentId(user.studentId || "");
        setBio(user.bio || "");
        setGithub(user.socialLinks?.github || "");
        setLinkedin(user.socialLinks?.linkedin || "");
        setPortfolioUrl(user.socialLinks?.website || user.socialLinks?.twitter || "");
        setSkills(user.skills || []);
        setAvatar(user.avatar || "🎓");
        setCvUrl(user.cvUrl || "");
        setProjects(user.projects || []);
        
        if (user.privacySettings) {
          setPublicSkills(user.privacySettings.publicSkills ?? true);
          setPublicProjects(user.privacySettings.publicProjects ?? true);
        }
      }

      isInitialized.current = true;
    }
  }, [user]);

  // Persist draft on changes
  React.useEffect(() => {
    if (user && isInitialized.current && typeof window !== "undefined") {
      const draftData = {
        nameAr,
        nameEn,
        email,
        level,
        studentId,
        bio,
        github,
        linkedin,
        portfolioUrl,
        skills,
        avatar,
        cvUrl,
        projects,
        publicSkills,
        publicProjects
      };
      localStorage.setItem(`su_profile_draft_${user.id}`, JSON.stringify(draftData));
    }
  }, [user, nameAr, nameEn, email, level, studentId, bio, github, linkedin, portfolioUrl, skills, avatar, cvUrl, projects, publicSkills, publicProjects]);

  // Calculate profile completion percentage
  const completionPercentage = React.useMemo(() => {
    let score = 0;
    if (nameAr || nameEn) score += 15;
    if (email) score += 15;
    if (studentId) score += 10;
    if (bio && bio.length > 10) score += 15;
    if (skills.length > 0) score += 15;
    if (github || linkedin) score += 15;
    if (cvUrl) score += 5;
    if (projects.length > 0) score += 10;
    return score;
  }, [name, email, studentId, bio, skills, github, linkedin, cvUrl, projects]);

  // Handle custom image file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (isUploadingImageRef.current) return;
    isUploadingImageRef.current = true;
    setIsUploadingImage(true);

    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: t("حجم الصورة كبير جداً. يرجى اختيار صورة أقل من 5 ميجابايت.", "Image size too large. Please select an image under 5MB.")
      });
      isUploadingImageRef.current = false;
      setIsUploadingImage(false);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        if (typeof reader.result === "string") {
          // Compress image using Canvas to ensure it easily fits in Supabase TEXT column and localStorage
          const img = new Image();
          img.onload = () => {
            try {
              const canvas = document.createElement("canvas");
              const MAX_SIZE = 256;
              let width = img.width;
              let height = img.height;

              if (width > height && width > MAX_SIZE) {
                height *= MAX_SIZE / width;
                width = MAX_SIZE;
              } else if (height > MAX_SIZE) {
                width *= MAX_SIZE / height;
                height = MAX_SIZE;
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
                setAvatar(compressedBase64);
              } else {
                setAvatar(reader.result as string); // fallback
              }
            } finally {
              isUploadingImageRef.current = false;
              setIsUploadingImage(false);
            }
          };
          img.onerror = () => {
            isUploadingImageRef.current = false;
            setIsUploadingImage(false);
          };
          img.src = reader.result;
        }
      } catch {
        isUploadingImageRef.current = false;
        setIsUploadingImage(false);
      }
    };
    reader.onerror = () => {
      isUploadingImageRef.current = false;
      setIsUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newSkill.trim()) {
      e.preventDefault();
      if (!skills.includes(newSkill.trim())) {
        setSkills([...skills, newSkill.trim()]);
      }
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Projects list handlers
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim()) return;
    const newList = [...projects, { title: newProjTitle, description: newProjDesc, link: newProjLink }];
    setProjects(newList);
    setNewProjTitle("");
    setNewProjDesc("");
    setNewProjLink("");
    setIsAddProjOpen(false);
  };

  const handleRemoveProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Check if user made any actual modifications
    const hasChanges =
      (nameAr !== (user?.nameAr || "")) ||
      (nameEn !== (user?.nameEn || "")) ||
      (email !== (user?.email || "")) ||
      (level !== (user?.level || "")) ||
      (studentId !== (user?.studentId || "")) ||
      (bio !== (user?.bio || "")) ||
      (avatar !== (user?.avatar || "🎓")) ||
      (cvUrl !== (user?.cvUrl || "")) ||
      (github !== (user?.socialLinks?.github || "")) ||
      (linkedin !== (user?.socialLinks?.linkedin || "")) ||
      (portfolioUrl !== (user?.socialLinks?.website || "")) ||
      (publicSkills !== (user?.privacySettings?.publicSkills ?? true)) ||
      (publicProjects !== (user?.privacySettings?.publicProjects ?? true)) ||
      JSON.stringify(skills) !== JSON.stringify(user?.skills || []) ||
      JSON.stringify(projects) !== JSON.stringify(user?.projects || []);

    if (!hasChanges) {
      setMessage({
        type: "success",
        text: t("البيانات محدثة ومحفوظة بالفعل في السحابة!", "Data is already up to date and saved in cloud!")
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      const success = await updateProfile({
        nameAr,
        nameEn,
        name: typeof window !== "undefined" && document.documentElement.dir === "rtl" ? nameAr : nameEn,
        email,
        level,
        studentId,
        bio,
        avatar,
        skills,
        socialLinks: { github, linkedin, website: portfolioUrl },
        cvUrl,
        projects,
        privacySettings: { publicSkills, publicProjects }
      });

      if (success) {
        if (typeof window !== "undefined" && user) {
          localStorage.removeItem(`su_profile_draft_${user.id}`);
        }
        setMessage({ type: "success", text: t("تم تحديث صورة الشخصية وملف الطالب بنجاح!", "Profile image and student profile updated successfully!") });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setMessage({ type: "error", text: t("فشل حفظ التعديلات. يرجى المحاولة لاحقاً.", "Failed to save changes. Please try again later.") });
      }
    } catch (err) {
      setMessage({ type: "error", text: t("حدث خطأ أثناء الاتصال بالخادم.", "An error occurred while connecting to the server.") });
    }
  };

  const avatarOptions = ["🎓", "👨‍💻", "👩‍💻", "🚀", "💡", "🧠", "✨", "📚", "🎨"];

  // Badge icons dictionary
  const badgeEmojis: Record<string, string> = {
    "الدخول الأول": "👋",
    "مكتمل الملف الشخصي": "✅",
    "جامع المصادر": "📚",
    "نجم الكلية": "⭐",
    "العضو الفضي": "🥈",
    "العضو الذهبي": "🥇",
    "المساهم الأول": "✍️"
  };

  const isRtl = dir === "rtl";

  const getLevelLabel = (lvl?: string) => {
    if (!lvl) return "";
    if (lang === "en") {
      if (lvl.includes("الأول") || lvl === "Level 1" || lvl === "Year 1") return "Year 1 (Freshman)";
      if (lvl.includes("الثاني") || lvl === "Level 2" || lvl === "Year 2") return "Year 2 (Sophomore)";
      if (lvl.includes("الثالث") || lvl === "Level 3" || lvl === "Year 3") return "Year 3 (Junior)";
      if (lvl.includes("الرابع") || lvl === "Level 4" || lvl === "Year 4") return "Year 4 (Senior)";
    }
    return lvl;
  };

  const getDeptLabel = (dept?: string) => {
    if (!dept) return "";
    if (lang === "en") {
      if (dept.includes("تكنولوجيا المعلومات") || dept === "IT") return "Information Technology";
      if (dept.includes("علوم الحاسب") || dept === "CS") return "Computer Science";
      if (dept.includes("نظم المعلومات") || dept === "IS") return "Information Systems";
      if (dept.includes("عام") || dept.includes("أساسي")) return "General Computer Science";
    }
    return dept;
  };

  const getFormattedBio = (b?: string) => {
    if (!b || !b.trim()) return t("لا توجد سيرة ذاتية.", "No bio provided.");
    if (lang === "en") {
      if (b.includes("طالب مسجل في المنصة الأكاديمية") || b.includes("طالب مسجل في المنصة")) {
        return "Registered student on Sinai University Tech Portal.";
      }
      if (b.includes("طالب جديد في منصة")) {
        return "New student on Sinai University Tech Portal.";
      }
      if (b.includes("حساب جديد في المنصة")) {
        return "New account on the academic platform.";
      }
      if (b.includes("مستخدم مسجل وموثق")) {
        return "Verified student on Sinai University Tech Portal.";
      }
      if (b.includes("مسؤول النظام الإداري")) {
        return "System Administrator";
      }
      if (b.includes("المشرف الأعلى على المنصة")) {
        return "Super Administrator";
      }
      if (b.includes("منسق ومراجع المحتوى")) {
        return "Content Moderator";
      }
    }
    return b;
  };

  const isAdminStaff = user?.role === "admin" || user?.role === "super-admin" || user?.role === "moderator";

  if (isAdminStaff) {
    const adminTitle =
      user?.role === "super-admin"
        ? "👑 المشرف الأعلى للمنصة (Super Admin)"
        : user?.role === "admin"
        ? "⚙️ مسؤول النظام الإداري (System Admin)"
        : "👩‍🏫 منسق المحتوى والمنتدى (Content Moderator)";

    const adminCode =
      user?.role === "super-admin" ? "SUP-001" : user?.role === "admin" ? "ADM-001" : "MOD-001";

    const adminSector =
      user?.role === "super-admin"
        ? "الإدارة العليا للجامعة"
        : user?.role === "admin"
        ? "الكادر الإداري والفني"
        : "كادر التنسيق والرقابة";

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in" dir={dir}>
        {/* Admin Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-cyan-600/10 via-teal-600/10 to-transparent border border-cyan-500/30">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-cyan-500 text-white font-bold text-xs px-3 py-1">
                {adminTitle}
              </Badge>
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
              {t("لوحة الملف الإداري والصلاحيات", "Admin Control Profile")}
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {t(
                "إدارة بيانات الحساب الإداري، متابعة مستوى الصلاحيات الأكاديمية، وضبط إعدادات الأمان.",
                "Manage admin credentials, inspect system clearances, and configure safety settings."
              )}
            </p>
          </div>
        </div>

        {message.text && (
          <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-3 ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400"
              : "bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"
          }`}>
            {message.type === "success" ? <Check className="h-5 w-5 shrink-0" /> : <ShieldAlert className="h-5 w-5 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Admin Avatar & Quick Info */}
          <div className="space-y-6 lg:col-span-1">
            <Card className="border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm text-center">
              <CardContent className="pt-8">
                <div className="relative mx-auto h-28 w-28 rounded-3xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-500/30 shadow-lg overflow-hidden group mb-4 flex items-center justify-center">
                  {avatar.startsWith("data:image/") || avatar.startsWith("http") ? (
                    <img src={avatar} alt="Profile" className="h-full w-full object-cover rounded-3xl" />
                  ) : (
                    <span className="text-5xl">{avatar || "⚙️"}</span>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-bold gap-1"
                  >
                    <Camera className="h-5 w-5" />
                    <span>{t("تغيير الصورة", "Change Avatar")}</span>
                  </button>
                  {avatar.length > 10 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAvatar("⚙️");
                      }}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      title={t("حذف الصورة", "Remove Picture")}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>

                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-50">{(isRtl ? nameAr : nameEn) || "Admin"}</h3>
                <p className="text-xs text-zinc-500 font-mono mt-0.5">{email}</p>

                <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-right space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">{t("كود الكادر:", "Staff ID:")}</span>
                    <span className="font-mono font-extrabold text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-lg border border-zinc-200/70 dark:border-zinc-700/70">💳 {adminCode}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">{t("القطاع الوظيفي:", "Sector:")}</span>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400">{adminSector}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500">{t("حالة الحساب:", "Account Status:")}</span>
                    <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px]">🟢 نشط وتصريح كامل</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Clearances Card */}
            <Card className="border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
              <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-cyan-500" />
                  <span>{t("تصريحات التحكم الإداري", "System Administrative Clearances")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">إدارة حسابات الأعضاء والطلاب</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">مكتمل 🔑</Badge>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">تعديل المقرر والخطط الدراسية</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">مكتمل 📚</Badge>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 flex items-center justify-between">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">مراقبة سجلات الأمان والتفتيش</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">مكتمل 🛡️</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Admin Details Form */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
              <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <User className="h-4.5 w-4.5 text-cyan-500" />
                  <span>{t("بيانات حساب مسؤول النظام", "Admin Profile Details")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">الاسم الكامل (عربي)</label>
                    <Input value={nameAr} onChange={(e) => setNameAr(e.target.value)} className="h-11 text-xs" dir="rtl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Full Name (English)</label>
                    <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} className="h-11 text-xs" dir="ltr" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("البريد الإلكتروني الرسمي", "Official Admin Email")}</label>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 text-xs font-mono" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("البيان والوصف الإداري (Bio)", "Admin Bio / Statement")}</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder={t("اكتب نص الإشراف والبيان الإداري...", "Write administrative statement...")}
                    className="w-full p-3 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none"
                  />
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                  <Button type="submit" disabled={isLoading} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs px-6 h-11 rounded-xl cursor-pointer">
                    {isLoading ? t("جاري الحفظ...", "Saving...") : t("حفظ التغيرات الإدارية 💾", "Save Admin Profile 💾")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8" dir={dir}>
      {/* Header and completion indicator */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-950 dark:text-zinc-50">
            {t("الملف الشخصي ومحفظة الأعمال", "Student Profile & Portfolio")}
          </h1>
          <p className="text-sm text-zinc-550 dark:text-zinc-400 mt-1">
            {t(
              "قم بإعداد بوابتك المهنية، رفع صورتك الشخصية، واستعراض شاراتك الأكاديمية.",
              "Setup your professional portal, upload your profile picture, and view academic badges."
            )}
          </p>
        </div>

        {/* Completion Progress Bar */}
        <div className="w-full md:w-72 bg-white dark:bg-zinc-900 p-4 border border-zinc-200/50 dark:border-zinc-800/60 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-xs font-bold text-zinc-700 dark:text-zinc-355 mb-2">
            <span>{t("نسبة اكتمال البورتفوليو", "Portfolio Completion")}</span>
            <span className="text-violet-650 dark:text-violet-400">
              <AnimatedNumber value={completionPercentage} suffix="%" />
            </span>
          </div>
          <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-violet-600 to-indigo-650"
            />
          </div>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-3 ${
          message.type === "success"
            ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400"
            : "bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"
        }`}>
          {message.type === "success" ? <Check className="h-5 w-5 shrink-0" /> : <ShieldAlert className="h-5 w-5 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Avatar Sidebar & Profile Picture Upload */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 shadow-sm text-center">
            <CardContent className="pt-8">
              {/* Profile Avatar Display & Upload Overlay */}
              <div className="relative mx-auto h-28 w-28 rounded-3xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800/40 shadow-lg overflow-hidden group mb-4 flex items-center justify-center">
                {avatar.startsWith("data:image/") || avatar.startsWith("http") ? (
                  <img src={avatar} alt="Profile" className="h-full w-full object-cover rounded-3xl" />
                ) : (
                  <span className="text-5xl">{avatar}</span>
                )}

                {/* Upload Trigger Hover Overlay */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-bold gap-1"
                >
                  <Camera className="h-5 w-5" />
                  <span>{t("تغيير الصورة", "Upload Photo")}</span>
                </button>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <div className="flex justify-center gap-2 mb-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs gap-1.5 h-8 font-bold border-dashed flex-1"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>{t("رفع صورة من الجهاز", "Upload Custom Picture")}</span>
                </Button>
                {avatar.length > 10 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAvatar("🎓")}
                    className="text-xs h-8 font-bold border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-900/50 dark:hover:bg-red-900/20"
                    title={t("حذف الصورة", "Remove Picture")}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>

              <h3 className="font-extrabold text-base text-zinc-950 dark:text-zinc-50">
                {(isRtl ? nameAr : nameEn) || t("طالب مستجد", "Freshman Student")}
              </h3>
              <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-1">
                {getLevelLabel(level)} {user?.department ? ` · ${getDeptLabel(user.department)}` : ""}
              </p>

              {/* Bio summary display (Smart Conditional) */}
              {bio && bio.trim().length > 0 && (
                <div className={`mt-4 p-3 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border border-zinc-200/60 dark:border-zinc-850 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed ${isRtl ? "text-right" : "text-left"}`}>
                  <span className="font-bold text-[10px] uppercase text-zinc-400 block mb-1">{t("النبذة التعريفية", "Bio")}</span>
                  <p>{getFormattedBio(bio)}</p>
                </div>
              )}

              {/* Avatar Selector */}
              <div className="mt-6">
                <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-450 block mb-3.5">
                  {t("أو اختر رمزاً تعبيرياً (Emoji)", "Or pick an Emoji avatar")}
                </span>
                <div className="grid grid-cols-5 gap-2 justify-center max-w-xs mx-auto">
                  {avatarOptions.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setAvatar(av)}
                      className={`h-9 w-9 rounded-lg border text-sm flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-colors cursor-pointer ${
                        avatar === av
                          ? "border-violet-650 bg-violet-50 text-violet-650 dark:border-violet-500 dark:bg-violet-950/45"
                          : "border-zinc-200 dark:border-zinc-800 bg-transparent"
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Smart Links & CV Showcase Widget */}
          {(cvUrl || portfolioUrl || linkedin || github) && (
            <Card className={`border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 shadow-sm ${isRtl ? "text-right" : "text-left"}`}>
              <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <CardTitle className="text-xs font-black uppercase tracking-wider text-zinc-450 dark:text-zinc-500 flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-cyan-500" />
                  <span>{t("الروابط المهنية للملف", "Professional Links")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2.5">
                {cvUrl && cvUrl.trim().length > 0 && (
                  <a
                    href={cvUrl.startsWith("http") ? cvUrl : `https://${cvUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-all font-bold text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {t("تحميل / عرض السيرة الذاتية (CV)", "View CV / Resume")}
                    </span>
                    <span>📄</span>
                  </a>
                )}

                {portfolioUrl && portfolioUrl.trim().length > 0 && (
                  <a
                    href={portfolioUrl.startsWith("http") ? portfolioUrl : `https://${portfolioUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-500/20 transition-all font-bold text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      {t("موقع البورتفوليو الشخصي", "Portfolio Website")}
                    </span>
                    <span>🌐</span>
                  </a>
                )}

                {linkedin && linkedin.trim().length > 0 && (
                  <a
                    href={linkedin.startsWith("http") ? linkedin : `https://${linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20 transition-all font-bold text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <Link2 className="h-4 w-4" />
                      {t("حساب LinkedIn", "LinkedIn Profile")}
                    </span>
                    <span>💼</span>
                  </a>
                )}

                {github && github.trim().length > 0 && (
                  <a
                    href={github.startsWith("http") ? github : `https://${github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 transition-all font-bold text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      {t("حساب GitHub", "GitHub Profile")}
                    </span>
                    <span>💻</span>
                  </a>
                )}
              </CardContent>
            </Card>
          )}

          {/* Badges / Achievements Showcase widget */}
          <Card className={`border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 shadow-sm ${isRtl ? "text-right" : "text-left"}`}>
            <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <CardTitle className="text-xs font-black uppercase tracking-wider text-zinc-450 dark:text-zinc-500 flex items-center gap-1.5">
                <Award className="h-4.5 w-4.5 text-amber-500" />
                <span>{t(`الشارات المفتوحة (${user?.badges?.length || 0})`, `Unlocked Badges (${user?.badges?.length || 0})`)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {user?.badges && user.badges.length > 0 ? (
                user.badges.map((badge, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-850 rounded-xl flex items-center gap-3"
                  >
                    <div className="text-2xl">{badgeEmojis[badge] || "🏆"}</div>
                    <div className="min-w-0">
                      <span className="text-xs font-extrabold text-zinc-850 dark:text-zinc-100 block">{badge}</span>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">
                        {t("مكتسب عبر النشاط الدراسي", "Earned via academic activity")}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <span className="text-xs text-zinc-400 block text-center py-4">
                  {t("لا توجد شارات حالية.", "No badges unlocked yet.")}
                </span>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Form fields */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 shadow-sm">
            <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-6">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-zinc-950 dark:text-zinc-50">
                <User className="h-4.5 w-4.5 text-zinc-400" />
                {t("المعلومات الأساسية", "Basic Information")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:col-span-2">
                {/* Full name (Arabic) */}
                <div className={`space-y-1.5 ${isRtl ? "text-right" : "text-left"}`}>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    الاسم الكامل (عربي)
                  </label>
                  <div className="relative">
                    <User className={`absolute ${isRtl ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400`} />
                    <Input
                      type="text"
                      value={nameAr}
                      onChange={(e) => setNameAr(e.target.value)}
                      className={isRtl ? "pr-10" : "pl-10"}
                      disabled={isLoading}
                      required
                      dir="rtl"
                    />
                  </div>
                </div>

                {/* Full name (English) */}
                <div className={`space-y-1.5 ${isRtl ? "text-right" : "text-left"}`}>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Full Name (English)
                  </label>
                  <div className="relative">
                    <User className={`absolute ${isRtl ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400`} />
                    <Input
                      type="text"
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                      className={isRtl ? "pr-10" : "pl-10"}
                      disabled={isLoading}
                      required
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

                {/* Email */}
                <div className={`space-y-1.5 ${isRtl ? "text-right" : "text-left"}`}>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    {t("البريد الإلكتروني الجامعي", "University Email")}
                  </label>
                  <div className="relative">
                    <Mail className={`absolute ${isRtl ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400`} />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={isRtl ? "pr-10" : "pl-10"}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                {/* Academic Level */}
                <div className={`space-y-1.5 ${isRtl ? "text-right" : "text-left"}`}>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    {t("الفرقة الأكاديمية", "Academic Year Level")}
                  </label>
                  <div className="relative">
                    <GraduationCap className={`absolute ${isRtl ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400`} />
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      disabled={isLoading}
                      className={`w-full h-11 ${isRtl ? "pr-10 pl-3" : "pl-10 pr-3"} rounded-xl border border-zinc-200 bg-white text-sm text-zinc-905 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:ring-violet-500 transition-all duration-200 cursor-pointer appearance-none`}
                    >
                      <option value="الفرقة الأولى">{t("الفرقة الأولى (سنة أولى)", "Year 1 (Freshman)")}</option>
                      <option value="الفرقة الثانية">{t("الفرقة الثانية (سنة ثانية)", "Year 2 (Sophomore)")}</option>
                      <option value="الفرقة الثالثة">{t("الفرقة الثالثة (سنة ثالثة)", "Year 3 (Junior)")}</option>
                      <option value="الفرقة الرابعة">{t("الفرقة الرابعة (سنة رابعة)", "Year 4 (Senior)")}</option>
                    </select>
                  </div>
                </div>

                {/* Student ID */}
                <div className={`space-y-1.5 ${isRtl ? "text-right" : "text-left"}`}>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    {t("الرقم الأكاديمي (Student ID)", "Student ID")}
                  </label>
                  <div className="relative">
                    <FileText className={`absolute ${isRtl ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400`} />
                    <Input
                      type="text"
                      placeholder="20230109"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className={isRtl ? "pr-10" : "pl-10"}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className={`space-y-1.5 ${isRtl ? "text-right" : "text-left"}`}>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  {t("السيرة الذاتية (Bio)", "Personal Bio")}
                </label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={isLoading}
                  placeholder={t("اكتب نبذة قصيرة عن اهتماماتك الأكاديمية والتقنية...", "Write a short bio about your academic & tech interests...")}
                  className="w-full p-3 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-950 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 transition-all duration-200 resize-none leading-relaxed"
                />
              </div>
            </CardContent>
          </Card>

          {/* Academic Skills & Social links */}
          <Card className="border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 shadow-sm">
            <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-6">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-zinc-950 dark:text-zinc-50">
                <Award className="h-4.5 w-4.5 text-zinc-400" />
                {t("المهارات وروابط التواصل", "Skills & Contact Links")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Skills Tags input */}
              <div className={`space-y-2 ${isRtl ? "text-right" : "text-left"}`}>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  {t("المهارات الأكاديمية (اضغط Enter للإضافة)", "Academic & Technical Skills (Press Enter to add)")}
                </label>
                <Input
                  type="text"
                  placeholder={t("أدخل مهارة جديدة (مثال: C++, Python, UI Design)", "Enter a skill (e.g. C++, Python, UI Design)")}
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={handleAddSkill}
                  disabled={isLoading}
                />
                <div className="flex flex-wrap gap-2 pt-2">
                  {skills.length > 0 ? (
                    skills.map((skill, idx) => (
                      <Badge
                        key={idx}
                        className="bg-violet-50 hover:bg-red-50 text-violet-650 dark:bg-violet-950/40 dark:text-violet-400 border border-violet-100 dark:border-violet-800/30 pl-2 pr-2.5 py-1 text-xs rounded-lg cursor-pointer flex items-center gap-1.5 group transition-colors hover:text-red-500 dark:hover:text-red-400 dark:hover:bg-red-950/20 hover:border-red-200"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        <span>{skill}</span>
                        <span className="text-[10px] opacity-60 group-hover:opacity-100">✕</span>
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">
                      {t("لم تضف أي مهارات بعد.", "No skills added yet.")}
                    </span>
                  )}
                </div>
              </div>

              {/* Social & Professional Links */}
              <div className="space-y-4">
                <span className={`text-xs font-bold text-zinc-700 dark:text-zinc-300 block ${isRtl ? "text-right" : "text-left"}`}>
                  {t("الروابط المهنية ورابط السيرة الذاتية (CV)", "Professional Links & CV URL")}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* GitHub */}
                  <div className={`space-y-1.5 ${isRtl ? "text-right" : "text-left"}`}>
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">GitHub</label>
                    <div className="relative">
                      <Globe className={`absolute ${isRtl ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400`} />
                      <Input
                        type="url"
                        placeholder="https://github.com/username"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        className={isRtl ? "pr-10" : "pl-10"}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className={`space-y-1.5 ${isRtl ? "text-right" : "text-left"}`}>
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">LinkedIn</label>
                    <div className="relative">
                      <Link2 className={`absolute ${isRtl ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400`} />
                      <Input
                        type="url"
                        placeholder="https://linkedin.com/in/username"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        className={isRtl ? "pr-10" : "pl-10"}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Portfolio Website */}
                  <div className={`space-y-1.5 ${isRtl ? "text-right" : "text-left"}`}>
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      {t("موقع البورتفوليو الشخصي (Portfolio)", "Portfolio Website")}
                    </label>
                    <div className="relative">
                      <Globe className={`absolute ${isRtl ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-500`} />
                      <Input
                        type="url"
                        placeholder="https://myportfolio.com"
                        value={portfolioUrl}
                        onChange={(e) => setPortfolioUrl(e.target.value)}
                        className={isRtl ? "pr-10" : "pl-10"}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* CV Link */}
                  <div className={`space-y-1.5 ${isRtl ? "text-right" : "text-left"}`}>
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      {t("السيرة الذاتية (CV PDF)", "CV / Resume PDF")}
                    </label>
                    <div className="relative">
                      <FileText className={`absolute ${isRtl ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500`} />
                      <Input
                        type="url"
                        placeholder="https://drive.google.com/..."
                        value={cvUrl}
                        onChange={(e) => setCvUrl(e.target.value)}
                        className={isRtl ? "pr-10" : "pl-10"}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>

        <div className="space-y-6">
          {/* Portfolio & Projects Section */}
          <Card className={`border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 shadow-sm ${isRtl ? "text-right" : "text-left"}`}>
            <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-zinc-950 dark:text-zinc-50">
                <FileText className="h-4.5 w-4.5 text-zinc-400" />
                {t("المشاريع ومعرض الأعمال", "Projects & Portfolio Showcase")}
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddProjOpen(true)}
                className="h-8 text-xs flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                {t("إضافة مشروع", "Add Project")}
              </Button>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {/* Projects List display */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block">
                  {t("المشاريع البرمجية الحالية", "Current Projects")}
                </span>
                {projects.length > 0 ? (
                  projects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-850 rounded-xl flex justify-between items-center gap-4"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-extrabold text-zinc-950 dark:text-zinc-50 block">{proj.title}</span>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">{proj.description}</p>
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[9px] font-black text-violet-600 dark:text-violet-400 hover:underline mt-1 block"
                          >
                            {t("عرض كود المشروع 🔗", "View Project Code 🔗")}
                          </a>
                        )}
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => handleRemoveProject(idx)}
                        className="p-1.5 text-zinc-400 hover:text-red-500 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-850 cursor-pointer"
                        title={t("حذف المشروع", "Delete Project")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-zinc-400 block text-center py-2">
                    {t("لا توجد مشاريع مضافة بعد.", "No projects added yet.")}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings Card */}
          <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm col-span-1 md:col-span-2 overflow-hidden bg-white/70 dark:bg-zinc-900/40 backdrop-blur-3xl rounded-3xl">
            <CardHeader className="bg-zinc-50/50 dark:bg-zinc-950/20 border-b border-zinc-100 dark:border-zinc-850 p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center shrink-0 shadow-inner">
                  <ShieldAlert className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                    {t("إعدادات الخصوصية والعامة", "Privacy & Public Settings")}
                  </CardTitle>
                  <CardDescription className="text-xs font-bold text-zinc-500 mt-1">
                    {t("تحكم فيما يظهر للآخرين عند زيارة صفحتك الشخصية.", "Control what others can see when they visit your profile.")}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="max-w-3xl mx-auto space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/50">
                  <div>
                    <h4 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50">{t("عرض المهارات وروابط التواصل", "Show Skills & Social Links")}</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold mt-1">
                      {t("إذا تم الإيقاف، لن يرى الطلاب الآخرون مهاراتك أو روابط حساباتك.", "If disabled, other students won't see your skills or social links.")}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 self-start sm:self-center">
                    <input type="checkbox" className="sr-only peer" checked={publicSkills} onChange={(e) => setPublicSkills(e.target.checked)} />
                    <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/50">
                  <div>
                    <h4 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50">{t("عرض المشاريع ومعرض الأعمال", "Show Projects & Portfolio")}</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold mt-1">
                      {t("إذا تم الإيقاف، سيتم إخفاء قسم المشاريع من ملفك العام.", "If disabled, the projects section will be hidden from your public profile.")}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 self-start sm:self-center">
                    <input type="checkbox" className="sr-only peer" checked={publicProjects} onChange={(e) => setPublicProjects(e.target.checked)} />
                    <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-center sm:justify-end gap-3.5 pt-4">
            <Button type="submit" className="w-full sm:w-auto px-10 shadow-md font-bold" isLoading={isLoading} disabled={isLoading}>
              {t("حفظ كل التعديلات", "Save All Changes")}
            </Button>
          </div>

        </div>
      </form>

      {/* Add Project Modal Popup */}
      <AnimatePresence>
        {isAddProjOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden ${isRtl ? "text-right" : "text-left"}`}
              dir={dir}
            >
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-850 flex justify-between items-center">
                <h3 className="font-extrabold text-base text-zinc-950 dark:text-zinc-50">
                  {t("إضافة مشروع جديد", "Add New Project")}
                </h3>
                <button
                  onClick={() => setIsAddProjOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddProject} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    {t("اسم المشروع", "Project Title")}
                  </label>
                  <Input
                    placeholder={t("مثال: نظام تسجيل الجداول الدراسية", "e.g. Academic Schedule Planner")}
                    value={newProjTitle}
                    onChange={(e) => setNewProjTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    {t("وصف مختصر للمشروع", "Short Project Description")}
                  </label>
                  <Input
                    placeholder={t("مثال: تطبيق ويب تم بناؤه باستخدام Next.js...", "e.g. Web app built with Next.js & Tailwind...")}
                    value={newProjDesc}
                    onChange={(e) => setNewProjDesc(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    {t("رابط المشروع (GitHub / Live Link)", "Project Link (GitHub / Live Link)")}
                  </label>
                  <Input
                    type="url"
                    placeholder="https://github.com/username/project"
                    value={newProjLink}
                    onChange={(e) => setNewProjLink(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-850">
                  <Button type="button" variant="outline" onClick={() => setIsAddProjOpen(false)}>
                    {t("إلغاء", "Cancel")}
                  </Button>
                  <Button type="submit" className="px-6">
                    {t("إضافة المشروع", "Add Project")}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
