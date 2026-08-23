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
  Globe
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
              <span>{t("المنصة الأولى والتعليمية الشاملة لطلاب جامعة سيناء", "Comprehensive Smart Platform for Sinai University Students")}</span>
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
                      className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                        activeTab === tab.id
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

        {/* Benefits Breakdown Section */}
        <section className="py-20 px-6 bg-zinc-100/50 dark:bg-zinc-900/20 border-y border-zinc-200/60 dark:border-zinc-900">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-6 ${dir === "rtl" ? "text-right" : "text-left"}`} dir={dir}>
              <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-none font-bold">
                {t("لماذا تختار المنصة؟", "Why Choose SU IT Guide?")}
              </Badge>
              <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight">
                {t("تخلص من عشوائية جداول البيانات والتقديرات اليدوية", "Eliminate Manual Spreadsheets & Academic Uncertainty")}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
                {t(
                  "توفر المنصة رؤية فورية وواضحة لتقدمك الأكاديمي، وتنبؤ مستقبلي يحدد لك أهدافك الفصلية بدقة متناهية.",
                  "Gain clear instant visibility into academic progress with precise target grade predictions."
                )}
              </p>
              <ul className="space-y-3.5">
                {[
                  t("تتبع خطتك الدراسية والمواد المتبقية أوتوماتيكياً.", "Automatically track completed and remaining courses."),
                  t("توقع المعدل التراكمي المستهدف وحساب النقاط المطلوبة.", "Predict target cumulative GPA and required semester points."),
                  t("مزامنة أوتوماتيكية مع تقويم المودل Moodle iCal.", "Automatic synchronization with Moodle iCal calendar."),
                  t("دعم كامل للغتين العربية والإنجليزية والنظام الليلة والنهارية.", "100% full bilingual support and smooth Dark/Light mode.")
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative flex justify-center">
              <div className="w-full max-w-md p-8 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-2xl relative overflow-hidden space-y-6">
                <div className="absolute -top-12 -left-12 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <GraduationCap className="h-16 w-16 opacity-30" />
                <div className="space-y-3">
                  <h3 className="text-2xl font-black">{t("جاهز لتنظيم خطتك الأكاديمية؟", "Ready to Organize Your Academic Plan?")}</h3>
                  <p className="text-xs sm:text-sm text-violet-100 leading-relaxed">
                    {t("ابدأ الآن بإنشاء حسابك مجاناً وتتبع كافة موادك ودرجاتك بكل يسر.", "Start now for free and easily manage all your courses and grades.")}
                  </p>
                </div>
                <Link href={portalHref} className="block pt-2">
                  <Button className="w-full bg-white text-violet-900 hover:bg-zinc-100 font-extrabold text-xs sm:text-sm py-5 rounded-xl shadow-lg cursor-pointer">
                    {t("دخول المنصة الآن", "Open Student Platform")}
                  </Button>
                </Link>
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
