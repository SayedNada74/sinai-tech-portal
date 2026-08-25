"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useApp } from "@/context/app-context";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import {
  GraduationCap,
  Calculator,
  BookOpen,
  Sparkles,
  Users,
  Briefcase,
  Compass,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Shield,
  Layers,
  ChevronLeft,
  Calendar,
  Zap,
  Globe,
  Smartphone,
  Download,
  Flame,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const { t, dir, lang } = useApp();
  const { isAuthenticated } = useAuth();
  const portalHref = isAuthenticated ? "/dashboard" : "/auth/login";
  const [activeTab, setActiveTab] = React.useState<"gpa" | "courses" | "ai" | "careers">("gpa");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const features = [
    {
      icon: <Calculator className="h-7 w-7 text-violet-600 dark:text-violet-400" />,
      title: t("حاسبة ومحاكي المعدل التراكمي (GPA)", "GPA Calculator & Predictor"),
      description: t(
        "حساب فوري دقيق لمعدلك الفصلي والتراكمي، مع محاكي ذكي يحدد التقدير والدرجات المطلوبة بالضبط للتخرج بالمعدل الذي تطمح إليه.",
        "Instant accurate calculation for semester and cumulative GPA, with smart simulator to predict target graduation grades."
      )
    },
    {
      icon: <BookOpen className="h-7 w-7 text-cyan-600 dark:text-cyan-400" />,
      title: t("دليل المقررات الأكاديمي والترتيب التسلسلي", "Curriculum Guide & Course Hierarchy"),
      description: t(
        "استكشف كافة مواد الكلية بالترتيب الأكاديمي من الفرقة الأولى حتى الرابعة، مع المتطلبات المسبقة ومخرجات التعلم ومراجع التنزيل.",
        "Explore all faculty courses in academic order from Year 1 to Year 4, with prerequisites, outcomes, and downloadable references."
      )
    },
    {
      icon: <Sparkles className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />,
      title: t("المساعد الأكاديمي الذكي (AI Advisor)", "Smart AI Academic Advisor"),
      description: t(
        "مرشد ذكي مدرب على اللوائح الأكاديمية لجامعة سيناء يجيب على تساؤلاتك، يقترح خطط التسجيل، ويحلل أدائك.",
        "AI advisor trained on Sinai University regulations to answer questions, suggest registration plans, and analyze performance."
      )
    },
    {
      icon: <Compass className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />,
      title: t("مسارات التعلم والمهارات المهنية", "Learning Roadmaps & Skill Paths"),
      description: t(
        "خراط طريق واضحة تربط المواد الجامعة بمسارات العمل المطلوبة (Front-end, Back-end, AI, CyberSecurity).",
        "Clear career roadmaps connecting university courses with in-demand industry tracks (Frontend, Backend, AI, Security)."
      )
    },
    {
      icon: <Briefcase className="h-7 w-7 text-amber-600 dark:text-amber-400" />,
      title: t("بوابة التدريب والفرص الوظيفية", "Careers & Internship Portal"),
      description: t(
        "منصة لعرض الفرص والتدريبات الصيفية (Internships) المتاحة لطلاب تكنولوجيا المعلومات والحاسبات.",
        "Dedicated portal for summer internships, job opportunities, and career announcements for IT students."
      )
    },
    {
      icon: <Users className="h-7 w-7 text-rose-600 dark:text-rose-400" />,
      title: t("المجتمع الطلابي والنقاشات الأكاديمية", "Student Community & Forum"),
      description: t(
        "مكان مخصص للطلاب لتبادل الملاحظات والملخصات، طرح الاستفسارات الأكاديمية، والتفاعل الإيجابي.",
        "Space for students to share notes, summaries, post academic questions, and engage constructively."
      )
    }
  ];

  const stats = [
    { value: "144", label: t("ساعة معتمدة مصممة بالكامل", "Total Credit Hours Managed") },
    { value: "4", label: t("أقسام أكاديمية تخصصية (IT/CS/IS/Basic)", "Specialized Academic Tracks") },
    { value: "100%", label: t("مزامنة أوتوماتيكية مع تقويم Moodle", "Auto Synchronization with Moodle") },
    { value: "24/7", label: t("إرشاد وتوقع أكاديمي ذكي", "24/7 Smart AI Guidance") }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 overflow-x-hidden selection:bg-violet-500 selection:text-white" dir={dir}>
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 md:pt-36 md:pb-32 px-6 overflow-hidden">
          {/* Glowing Background Orbs */}
          <div className="absolute -top-40 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-violet-600/20 via-indigo-600/15 to-transparent rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
          <div className="absolute top-1/3 left-10 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-500/20 to-teal-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />

          <div className="max-w-6xl mx-auto text-center relative z-10 space-y-8">
            {/* Top Floating Badge */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 text-xs sm:text-sm font-bold backdrop-blur-md shadow-sm"
            >
              <GraduationCap className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              <span>{t("المنصة التعليمية الشاملة لطلاب جامعة سيناء", "The comprehensive educational platform for Sinai University students.")}</span>
            </motion.div>

            {/* Hero Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.15] max-w-4xl mx-auto"
            >
              {t("دليلك الأكاديمي والمهني لرحلة تخرج", "Your Academic & Career Guide for a")} {" "}
              <span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                {t("ذكية وبدون عوائق", "Seamless Graduation Journey")}
              </span>
            </motion.h1>

            {/* Hero Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium"
            >
              {t(
                "تتبع خطتك الدراسية، احسب معدلك التراكمي، واكتشف متطلبات المواد والمسارات المهنية بخطوات انسيابية فائقة السرعة.",
                "Track your curriculum, calculate your GPA, and explore course requirements & career paths with intuitive speed."
              )}
            </motion.p>

            {/* Hero Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link href={portalHref} className="w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" className="w-full sm:w-auto px-9 py-6 text-base font-extrabold shadow-xl shadow-violet-600/20 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-2xl gap-2 cursor-pointer">
                    <span>{t("دخول منصة الطالب", "Open Student Portal")}</span>
                    <ArrowRight className={`h-5 w-5 ${lang === "ar" ? "rotate-180" : ""}`} />
                  </Button>
                </motion.div>
              </Link>

              <Link href="#features" className="w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-6 text-base font-bold rounded-2xl border-zinc-300 dark:border-zinc-800 backdrop-blur-sm cursor-pointer">
                    <span>{t("استكشاف المميزات", "Explore Features")}</span>
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Quick Guest Access Strip */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="pt-6 max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold mb-4">
                <Flame className="h-3.5 w-3.5" />
                <span>{t("أدوات مفتوحة للتجربة السريعة بدون تسجيل ⚡", "Instant Free Exploration Tools (No Login Required) ⚡")}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-right" dir={dir}>
                <Link href="/gpa" className="group">
                  <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm hover:shadow-md hover:border-violet-500/50 hover:bg-violet-50/50 dark:hover:bg-violet-950/20 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Calculator className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-zinc-900 dark:text-zinc-50 truncate">{t("حاسبة الـ GPA", "GPA Calculator")}</h4>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{t("حساب فوري وسيناريوهات التخرج", "Instant GPA & What-If Simulation")}</p>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/courses" className="group">
                  <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm hover:shadow-md hover:border-cyan-500/50 hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <BookOpen className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-zinc-900 dark:text-zinc-50 truncate">{t("دليل المقررات", "Course Explorer")}</h4>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{t("شجرة المواد والمتطلبات السابقة", "Course Hierarchy & Prerequisites")}</p>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/roadmaps" className="group">
                  <div className="p-4 rounded-2xl bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm hover:shadow-md hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Compass className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-zinc-900 dark:text-zinc-50 truncate">{t("مسارات التعلّم", "Career Roadmaps")}</h4>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{t("خارطة طريق Frontend, AI, Backend", "Frontend, AI & Backend tracks")}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </motion.div>

            {/* Interactive Showcase Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-12 max-w-5xl mx-auto"
            >
              <div className="p-3 sm:p-4 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl shadow-2xl space-y-6">
                {/* Tab Switches */}
                <div className="flex flex-wrap justify-center gap-2 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-3">
                  {[
                    { id: "gpa", label: t("حاسبة المعدل التراكمي", "GPA Predictor"), icon: <Calculator className="h-4 w-4" /> },
                    { id: "courses", label: t("شجرة المواد والمقررات", "Course Hierarchy"), icon: <BookOpen className="h-4 w-4" /> },
                    { id: "ai", label: t("المساعد الذكي AI", "AI Assistant"), icon: <Sparkles className="h-4 w-4" /> },
                    { id: "careers", label: t("المسارات والفرص", "Career Roadmaps"), icon: <Compass className="h-4 w-4" /> }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${activeTab === tab.id
                        ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                        : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                        }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Tab Preview Display */}
                <div className={`p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200/60 dark:border-zinc-800/60 ${dir === "rtl" ? "text-right" : "text-left"} space-y-4 min-h-[220px] flex flex-col justify-between`} dir={dir}>
                  {activeTab === "gpa" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300 border-none font-bold">
                          {t("توقع فوري محاذى للوائح الكلية", "Sinai Regulations Compliant")}
                        </Badge>
                        <span className="text-xs text-zinc-400 font-semibold">{t("144 ساعة معتمدة", "144 Credit Hours")}</span>
                      </div>
                      <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">
                        {t("حساب المعدل الفصلي وتحديد الدرجات المطلوبة للتخرج", "Semester GPA & Target Graduation Grades")}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {t(
                          "أدخل درجات موادك الحالية أو استعمل محاكي (What-If) لمعرفة التقدير المتوقع المطلوب تحقيقه مستقبلاً للوصول لمعدل امتياز أو جيد جداً.",
                          "Enter your course grades or use What-If simulation to calculate target grades needed for Excellent or Very Good GPA."
                        )}
                      </p>
                    </div>
                  )}

                  {activeTab === "courses" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300 border-none font-bold">
                          {t("ترتيب تسلسلي أكاديمي", "Academic Prerequisites Chain")}
                        </Badge>
                        <span className="text-xs text-zinc-400 font-semibold">{t("تأكد من المتطلبات المسبقة", "Check Prerequisites")}</span>
                      </div>
                      <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">
                        {t("دليل المواد الشامل من المستوى الأول إلى الرابع", "Complete Course Directory (Year 1 to Year 4)")}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {t(
                          "تصفح خطة مقررات تكنولوجيا المعلومات، الحاسبات، ونظم المعلومات باللغتين العربية والإنجليزية مع تنزيل المراجع وتجارب الطلاب.",
                          "Browse IT, CS, and IS course plans in Arabic & English with downloadable references and student reviews."
                        )}
                      </p>
                    </div>
                  )}

                  {activeTab === "ai" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-none font-bold">
                          {t("ذكاء اصطناعي مخصص", "Custom AI Model")}
                        </Badge>
                        <span className="text-xs text-zinc-400 font-semibold">{t("استجابة لغوية فائقة", "Instant AI Response")}</span>
                      </div>
                      <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">
                        {t("المرشد الذكي لجامعة سيناء (SU IT Advisor)", "Sinai University Smart AI Counselor")}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {t(
                          "اسأل عن طريقة التسجيل، شروط فتح المواد المغلقة، النصائح الدراسية للمواد الصعبة، واحصل على إجابة موثوقة في ثوانٍ.",
                          "Ask about registration rules, prerequisite unlocks, study tips, and get instant reliable academic answers."
                        )}
                      </p>
                    </div>
                  )}

                  {activeTab === "careers" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-none font-bold">
                          {t("ربط الكلية بسوق العمل", "Bridge Academia to Industry")}
                        </Badge>
                        <span className="text-xs text-zinc-400 font-semibold">{t("فرص وتدريبات مهنية", "Internships & Careers")}</span>
                      </div>
                      <h3 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50">
                        {t("خراط طريق مهنية وفرص تدريب توظيفية", "Career Roadmaps & Internship Opportunities")}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {t(
                          "ربط المواد الجامعية بمتطلبات العمل الواقعية في تطوير الويب، الذكاء الاصطناعي، شبكات الحواسيب، والتدريبات الصيفية.",
                          "Connect university curricula to real-world job roles in Web Development, AI, Networking, and Summer Internships."
                        )}
                      </p>
                    </div>
                  )}

                  <div className={`pt-2 flex ${dir === "rtl" ? "justify-end" : "justify-start"}`}>
                    <Link
                      href={
                        activeTab === "gpa"
                          ? "/gpa"
                          : activeTab === "courses"
                            ? "/courses"
                            : activeTab === "careers"
                              ? "/roadmaps"
                              : portalHref
                      }
                    >
                      <Button size="sm" className="gap-2 font-bold text-xs cursor-pointer shadow-md bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl">
                        <span>{t("تجربة الخدمة مباشرة 🚀", "Try Feature Now 🚀")}</span>
                        <ChevronLeft className={`h-4 w-4 ${lang === "en" ? "rotate-180" : ""}`} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Infinite Features Ribbon / Marquee Ticker */}
        <section className="py-6 overflow-hidden relative border-y border-zinc-200/70 dark:border-zinc-850/80 bg-zinc-50/50 dark:bg-zinc-950/40 backdrop-blur-md">
          <div
            className="marquee-container flex flex-row flex-nowrap w-full overflow-hidden select-none cursor-pointer py-1 gap-4"
            dir={dir}
          >
            {/* Track 1 */}
            <div className={`flex flex-row flex-nowrap items-center shrink-0 min-w-max gap-4 ${lang === "ar" ? "marquee-group-rtl" : "marquee-group-ltr"}`}>
              {[
                {
                  icon: Calculator,
                  labelAr: "حاسبة ومحاكي الـ GPA الذكي",
                  labelEn: "Smart GPA Simulator & Predictor",
                  color: "text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20"
                },
                {
                  icon: Calendar,
                  labelAr: "مزامنة تقويم المودل Moodle الآلية",
                  labelEn: "Automated Moodle Calendar Sync",
                  color: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
                },
                {
                  icon: Sparkles,
                  labelAr: "المرشد الأكاديمي الذكي بالـ AI",
                  labelEn: "24/7 AI Academic Counselor",
                  color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
                },
                {
                  icon: GraduationCap,
                  labelAr: "خطة الـ 144 ساعة المعتمدة",
                  labelEn: "144 Credit Hours Matrix Plan",
                  color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                },
                {
                  icon: Compass,
                  labelAr: "مسارات المهارات وسوق العمل",
                  labelEn: "Career & Tech Roadmaps",
                  color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20"
                },
                {
                  icon: Smartphone,
                  labelAr: "تطبيق الهاتف السريع PWA",
                  labelEn: "Instant PWA Mobile App",
                  color: "text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20"
                },
                {
                  icon: BookOpen,
                  labelAr: "دليل المقررات والمراجع الأكاديمية",
                  labelEn: "Course Library & Open Resources",
                  color: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20"
                },
                {
                  icon: Users,
                  labelAr: "منتدى مجتمع طلاب الكلية",
                  labelEn: "Students Community Forum",
                  color: "text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/20"
                },
                {
                  icon: Zap,
                  labelAr: "أداء فائق واستجابة لحظية",
                  labelEn: "Sub-Second Performance & Speed",
                  color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20"
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={`t1-${idx}`}
                    className="flex items-center gap-2.5 px-4.5 py-2.5 rounded-full bg-white/90 dark:bg-zinc-900/80 border border-zinc-200/90 dark:border-zinc-800/80 shadow-2xs hover:shadow-md hover:border-violet-400 dark:hover:border-violet-600/70 hover:scale-105 transition-all duration-200 select-none shrink-0"
                  >
                    <div className={`p-1 rounded-lg border ${item.color} flex items-center justify-center shrink-0`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs sm:text-sm font-extrabold text-zinc-800 dark:text-zinc-200 whitespace-nowrap">
                      {t(item.labelAr, item.labelEn)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Track 2 (Synchronized Duplicate for zero-gap loop) */}
            <div className={`flex flex-row flex-nowrap items-center shrink-0 min-w-max gap-4 ${lang === "ar" ? "marquee-group-rtl" : "marquee-group-ltr"}`} aria-hidden="true">
              {[
                {
                  icon: Calculator,
                  labelAr: "حاسبة ومحاكي الـ GPA الذكي",
                  labelEn: "Smart GPA Simulator & Predictor",
                  color: "text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20"
                },
                {
                  icon: Calendar,
                  labelAr: "مزامنة تقويم المودل Moodle الآلية",
                  labelEn: "Automated Moodle Calendar Sync",
                  color: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
                },
                {
                  icon: Sparkles,
                  labelAr: "المرشد الأكاديمي الذكي بالـ AI",
                  labelEn: "24/7 AI Academic Counselor",
                  color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
                },
                {
                  icon: GraduationCap,
                  labelAr: "خطة الـ 144 ساعة المعتمدة",
                  labelEn: "144 Credit Hours Matrix Plan",
                  color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                },
                {
                  icon: Compass,
                  labelAr: "مسارات المهارات وسوق العمل",
                  labelEn: "Career & Tech Roadmaps",
                  color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20"
                },
                {
                  icon: Smartphone,
                  labelAr: "تطبيق الهاتف السريع PWA",
                  labelEn: "Instant PWA Mobile App",
                  color: "text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20"
                },
                {
                  icon: BookOpen,
                  labelAr: "دليل المقررات والمراجع الأكاديمية",
                  labelEn: "Course Library & Open Resources",
                  color: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20"
                },
                {
                  icon: Users,
                  labelAr: "منتدى مجتمع طلاب الكلية",
                  labelEn: "Students Community Forum",
                  color: "text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/20"
                },
                {
                  icon: Zap,
                  labelAr: "أداء فائق واستجابة لحظية",
                  labelEn: "Sub-Second Performance & Speed",
                  color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20"
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={`t2-${idx}`}
                    className="flex items-center gap-2.5 px-4.5 py-2.5 rounded-full bg-white/90 dark:bg-zinc-900/80 border border-zinc-200/90 dark:border-zinc-800/80 shadow-2xs hover:shadow-md hover:border-violet-400 dark:hover:border-violet-600/70 hover:scale-105 transition-all duration-200 select-none shrink-0"
                  >
                    <div className={`p-1 rounded-lg border ${item.color} flex items-center justify-center shrink-0`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs sm:text-sm font-extrabold text-zinc-800 dark:text-zinc-200 whitespace-nowrap">
                      {t(item.labelAr, item.labelEn)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Statistics Banner Section */}
        <section id="stats" className="py-16 px-6 border-y border-zinc-200/60 dark:border-zinc-900 bg-white/50 dark:bg-zinc-900/20 backdrop-blur-md">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 shadow-sm"
                >
                  <span className="block text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-500 mb-2">
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-zinc-600 dark:text-zinc-400">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works (3 Steps) Section */}
        <section className="py-20 px-6 bg-zinc-100/40 dark:bg-zinc-900/10">
          <div className="max-w-6xl mx-auto space-y-14">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-none font-bold">
                {t("سهولة فائقة في الاستخدام", "Simple & Intuitive")}
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">
                {t("كيف تبدأ رحلتك الأكاديمية في 3 خطوات بسيطة؟", "How to Get Started in 3 Simple Steps")}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
                {t(
                  "صُممت المنصة لتوفير الوقت والجهد على طلاب الكلية من اليوم الأول حتى يوم التخرج.",
                  "Engineered to save time and effort for students from Freshman year until graduation day."
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative" dir={dir}>
              {[
                {
                  step: "01",
                  icon: GraduationCap,
                  iconClasses: "bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 border border-violet-200/80 dark:border-violet-800/60 shadow-sm shadow-violet-500/10",
                  badgeClasses: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20",
                  title: t("حدد فرقتك وقسمك التخصصي", "1. Choose Year & Department"),
                  desc: t(
                    "اختر فرقتك الدراسية (الأولى، الثانية، الثالثة، الرابعة) وتخصصك (IT, CS, IS) لتهيئة خطتك الدراسية فوراً.",
                    "Select your academic level (Year 1 to 4) and specialized track (IT, CS, IS) to tailor your plan."
                  )
                },
                {
                  step: "02",
                  icon: Calendar,
                  iconClasses: "bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-200/80 dark:border-cyan-800/60 shadow-sm shadow-cyan-500/10",
                  badgeClasses: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20",
                  title: t("سجل درجاتك أو اربط تقويم Moodle", "2. Log Grades or Sync Moodle"),
                  desc: t(
                    "أدخل تقديراتك للمواد المنجزة، أو انسخ رابط تقويم Moodle iCal لمزامنة مواعيد المحاضرات والامتحانات تلقائياً.",
                    "Enter your completed grades, or connect your Moodle iCal URL to sync assignment and exam dates."
                  )
                },
                {
                  step: "03",
                  icon: Sparkles,
                  iconClasses: "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm shadow-indigo-500/10",
                  badgeClasses: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20",
                  title: t("احصل على توقعات الـ GPA وإرشاد الـ AI", "3. Get GPA Insights & AI Advice"),
                  desc: t(
                    "استمتع بحساب وتوقع فوري للمعدل التراكمي المطلوب للتخرج بامتياز، مع استشارات ذكية من المرشد الأكاديمي الذكي.",
                    "Enjoy instant GPA predictions to achieve Honors, with 24/7 personalized AI academic counseling."
                  )
                }
              ].map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -6 }}
                    className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/80 shadow-lg shadow-zinc-900/5 dark:shadow-black/40 relative overflow-hidden flex flex-col justify-between transition-all"
                  >
                    <div className="space-y-5">
                      {/* Top Header Row with Icon and Step Number Badge */}
                      <div className="flex items-center justify-between w-full">
                        <div className={`h-13 w-13 rounded-2xl flex items-center justify-center ${item.iconClasses}`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <span className={`text-xs sm:text-sm font-black px-3 py-1.5 rounded-xl tracking-wider ${item.badgeClasses}`}>
                          STEP {item.step}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="space-y-2.5">
                        <h3 className="text-lg sm:text-xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Core Features Grid Section */}
        <section id="features" className="py-24 px-6 relative">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300 border-none font-bold">
                {t("مميزات حصرية", "Exclusive Features")}
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">
                {t("كل ما يحتاجه طالب تكنولوجيا المعلومات في مكان واحد", "Everything an IT Student Needs in One Place")}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
                {t(
                  "تم تطوير المنصة بدقة لتلبي الاحتياجات الأكاديمية والعملية الفعليه لطلاب الجامعة.",
                  "Engineered specifically to fulfill real academic and practical needs for Sinai University students."
                )}
              </p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {features.map((feature, idx) => (
                <motion.div key={idx} variants={itemVariants} whileHover={{ y: -6, scale: 1.02 }}>
                  <Card className="h-full border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/80 backdrop-blur-sm shadow-md hover:shadow-xl hover:border-violet-500/50 transition-all rounded-3xl">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      <div className="p-3 bg-zinc-100 dark:bg-zinc-800/60 rounded-2xl shrink-0">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-lg font-bold">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 font-medium">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* PWA Mobile App Install Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-zinc-50 to-violet-50/40 dark:from-zinc-950 dark:to-violet-950/20">
          <div className="max-w-6xl mx-auto">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-violet-50/90 via-indigo-50/80 to-purple-50/70 dark:from-violet-950/80 dark:via-indigo-950/70 dark:to-zinc-950 shadow-2xl border border-violet-200/80 dark:border-violet-800/40 relative overflow-hidden transition-all">
              {/* Background Ambient Glows */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/15 dark:bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-400/15 dark:bg-violet-600/30 rounded-full blur-3xl pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                <div className={`lg:col-span-8 space-y-6 ${dir === "rtl" ? "text-right" : "text-left"}`} dir={dir}>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 dark:bg-white/10 backdrop-blur-md border border-violet-200 dark:border-white/20 text-xs font-bold text-violet-700 dark:text-violet-200">
                    <Smartphone className="h-4 w-4 text-violet-600 dark:text-cyan-300" />
                    <span>{t("تطبيق الهاتف المحمول PWA", "Mobile App Experience (PWA)")}</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-zinc-900 dark:text-white">
                    {t("منصتك الأكاديمية معك في جيبك أينما كنت 📲", "Your Academic Platform in Your Pocket Everywhere 📲")}
                  </h2>

                  <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 max-w-2xl leading-relaxed font-medium">
                    {t(
                      "ثبّت المنصة كتطبيق فوري على هاتفك (Android أو iPhone) أو جهاز الكمبيوتر بضغطة زر واحدة. استمتع بسرعة فائقة، إمكانية التصفح، وتجربة سلسة بدون الحاجة للتحميل من المتاجر.",
                      "Install the portal as an instant app on your phone (Android/iOS) or PC with one click. Enjoy fast loading, offline capability, and smooth experience with zero app store hassle."
                    )}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 shadow-xs">
                      <Zap className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100">{t("سرعة تشغيل فائقة", "Instant Launch Speed")}</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 shadow-xs">
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100">{t("حفظ البيانات أوفلاين", "Offline Data Persistence")}</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 shadow-xs">
                      <Smartphone className="h-4.5 w-4.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100">{t("دعم كامل لـ iOS & Android", "Full iOS & Android Support")}</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="p-6 rounded-3xl bg-white/90 dark:bg-white/10 backdrop-blur-xl border border-violet-200/90 dark:border-white/20 shadow-xl w-full max-w-xs space-y-4">
                    <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-400 to-violet-500 flex items-center justify-center shadow-lg">
                      <Download className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-zinc-900 dark:text-white">{t("تثبيت التطبيق على جهازك", "Install App on Device")}</h4>
                      <p className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300 mt-1">{t("اضغط على 'تثبيت' أو 'إضافة للشاشة الرئيسية'", "Tap 'Install' or 'Add to Home Screen'")}</p>
                    </div>
                    <Button
                      onClick={() => {
                        window.dispatchEvent(new Event("trigger-pwa-install"));
                      }}
                      className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-extrabold text-xs h-11 rounded-xl shadow-lg shadow-violet-500/25 cursor-pointer gap-2"
                    >
                      <Download className="h-4 w-4 text-white" />
                      <span>{t("تثبيت التطبيق الآن 🚀", "Install App Now 🚀")}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 px-6">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="inline-flex p-3 bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 rounded-2xl">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">{t("الأسئلة الشائعة", "Frequently Asked Questions")}</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">{t("إليك أهم الإجابات عن التساؤلات الشائعة حول المنصة.", "Clear answers to common questions about the platform.")}</p>
            </div>

            <Accordion dir={dir}>
              <AccordionItem title={t("كيف يتم حساب التوقعات في محاكي الـ GPA؟", "How does the GPA Predictor calculate target grades?")}>
                {t(
                  "يقوم النظام بالمعادلة التالية: يطرح عدد الساعات التي أنجزتها (مضروبة في نقاط التقديرات) من إجمالي نقاط المعدل المستهدف عند التخرج (144 ساعة)، ثم يقسم الناتج على الساعات المتبقية ليحدد لك بدقة التقدير المطلوب الحصول عليه مستقبلاً.",
                  "The system subtracts completed grade points from target graduation points (144 hours), dividing the remainder over remaining hours to determine precise target semester grades."
                )}
              </AccordionItem>
              <AccordionItem title={t("هل المنصة آمنة ومربوطة بسيرفر سحابي؟", "Is the platform secure and cloud-backed?")}>
                {t(
                  "نعم، المنصة مربوطة بسيرفر قاعدة بيانات سحابية (Supabase Cloud Database) تؤمن بيانات الحسابات، التقييمات، والمنشورات بالكامل مع تشفير البيانات.",
                  "Yes, the platform is backed by Supabase Cloud Database securing accounts, reviews, and student posts with encryption."
                )}
              </AccordionItem>
              <AccordionItem title={t("كيف تتم المزامنة مع Moodle؟", "How does Moodle synchronization work?")}>
                {t(
                  "المزامنة تتم من خلال رابط تقويم iCal العام الذي تقوم بنسخه من Moodle. المنصة تقرأ فقط التواريخ الخاصة بالمهام الأكاديمية والامتحانات وتضعها في تقويمك الخاص.",
                  "Sync operates via public iCal calendar URL from Moodle. The system parses exam and assignment dates directly into your calendar."
                )}
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
