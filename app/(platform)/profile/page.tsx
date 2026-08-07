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

  const [name, setName] = React.useState("");
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

  // Initialize fields from Auth context
  React.useEffect(() => {
    if (user) {
      setName(user.name || "");
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
    }
  }, [user]);

  // Calculate profile completion percentage
  const completionPercentage = React.useMemo(() => {
    let score = 0;
    if (name) score += 15;
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

    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: t("حجم الصورة كبير جداً. يرجى اختيار صورة أقل من 5 ميجابايت.", "Image size too large. Please select an image under 5MB.")
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setAvatar(reader.result);
      }
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

    try {
      const success = await updateProfile({
        name,
        email,
        level,
        studentId,
        bio,
        avatar,
        skills,
        socialLinks: { github, linkedin, website: portfolioUrl },
        cvUrl,
        projects
      });

      if (success) {
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
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>

                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-50">{name}</h3>
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
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{t("الاسم الكامل للمسؤول", "Admin Full Name")}</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} className="h-11 text-xs" />
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

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
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
                  className="text-xs gap-1.5 h-8 font-bold border-dashed"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>{t("رفع صورة من الجهاز", "Upload Custom Picture")}</span>
                </Button>
              </div>

              <h3 className="font-extrabold text-base text-zinc-950 dark:text-zinc-50">
                {name || t("طالب مستجد", "Freshman Student")}
              </h3>
              <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-1">{level} · {user?.department}</p>

              {/* Bio summary display (Smart Conditional) */}
              {bio && bio.trim().length > 0 && (
                <div className={`mt-4 p-3 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border border-zinc-200/60 dark:border-zinc-850 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed ${isRtl ? "text-right" : "text-left"}`}>
                  <span className="font-bold text-[10px] uppercase text-zinc-400 block mb-1">{t("النبذة التعريفية", "Bio")}</span>
                  <p>{bio}</p>
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
                {/* Full name */}
                <div className={`space-y-1.5 ${isRtl ? "text-right" : "text-left"}`}>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    {t("الاسم الكامل", "Full Name")}
                  </label>
                  <div className="relative">
                    <User className={`absolute ${isRtl ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400`} />
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={isRtl ? "pr-10" : "pl-10"}
                      disabled={isLoading}
                      required
                    />
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

          {/* Form Actions */}
          <div className="flex justify-end gap-3.5 pt-2">
            <Button type="submit" className="px-8 shadow-md" isLoading={isLoading} disabled={isLoading}>
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
