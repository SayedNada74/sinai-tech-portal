"use client";

import * as React from"react";
import Link from"next/link";
import { Navbar } from"@/components/navbar";
import { Footer } from"@/components/footer";
import { useApp } from"@/context/app-context";
import { useAuth } from"@/context/auth-context";
import { Button } from"@/components/ui/button";
import { Badge } from"@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from"@/components/ui/card";
import { Accordion, AccordionItem } from"@/components/ui/accordion";
import { SpotlightCard } from"@/components/ui/spotlight-card";
import { CountUp } from"@/components/ui/count-up";
import { ShinyText } from"@/components/ui/shiny-text";
import {
  GraduationCap,
  Calculator,
  BookOpen,
  Sparkles,
  Users,
  Briefcase,
  Compass,
  ArrowRight,
  ArrowUpRight,
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
} from"lucide-react";
import { motion } from"framer-motion";

export default function LandingPage() {
  const { t, dir, lang } = useApp();
  const { isAuthenticated } = useAuth();
  const portalHref = isAuthenticated ?"/dashboard" :"/auth/login";
  const [activeTab, setActiveTab] = React.useState<"gpa" |"courses" |"ai" |"careers">("gpa");

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
      icon: <Calculator className="h-7 w-7 text-sky-600 dark:text-sky-400" />,
      title: t("حاسبة ومحاكي المعدل التراكمي (GPA)", "GPA Calculator & Graduation Predictor"),
      description: t(
        "حساب فوري دقيق لمعدلك الفصلي والتراكمي طبقاً للائحة الـ 144 ساعة، مع محاكي ذكي يحدد التقدير والدرجات المطلوبة للتخرج بمعدل ممتاز أو جيد جداً.",
        "Accurate calculation for semester and cumulative GPA based on 144-credit regulations, with smart What-If simulation to predict target graduation grades."
      )
    },
    {
      icon: <BookOpen className="h-7 w-7 text-cyan-600 dark:text-cyan-400" />,
      title: t("دليل المقررات والشجرة الأكاديمية", "Curriculum Guide & Prerequisites Tree"),
      description: t(
        "استكشف كافة مواد الكلية بالترتيب الأكاديمي من المستوى الأول حتى الرابع، مع توضيح المتطلبات المسبقة، مخرجات التعلم، والملخصات المتاحة.",
        "Explore all faculty courses in academic order from Year 1 to Year 4, with prerequisites, learning outcomes, and downloadable references."
      )
    },
    {
      icon: <Users className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />,
      title: t("دليل الطلاب الموثق بالبريد الجامعي", "Verified Student Directory & Profiles"),
      description: t(
        "شبكة موثوقة لطلاب جامعة سيناء تتيح التواصل مع أبناء تخصصك (IT, CS, IS)، تصفح البروفايلات، وتبادل الخبرات الأكاديمية بالأرقام الأكاديمية.",
        "Secure student directory for Sinai University students with official email verification, allowing connection with peers in IT, CS, and IS tracks."
      )
    },
    {
      icon: <Sparkles className="h-7 w-7 text-sky-600 dark:text-sky-400" />,
      title: t("المرشد الأكاديمي الذكي (AI Counselor)", "24/7 AI Academic Advisor"),
      description: t(
        "مرشد ذكي مدرب على اللوائح الأكاديمية لجامعة سيناء يجيب على استفساراتك، يساعدك في فتح المواد، ويقترح خطط التسجيل المناسبة لظروفك.",
        "AI advisor trained on Sinai University regulations to answer questions, resolve registration conflicts, and suggest optimized study schedules."
      )
    },
    {
      icon: <Compass className="h-7 w-7 text-amber-600 dark:text-amber-400" />,
      title: t("مسارات التعلّم وسوق العمل", "Career Roadmaps & Skill Paths"),
      description: t(
        "خرائط طريق واضحة تربط المواد الجامعية بمتطلبات العمل الواقعية في تطوير الويب، الذكاء الاصطناعي، شبكات الحواسيب، والتدريبات الصيفية.",
        "Clear career roadmaps connecting university curricula to real-world job roles in Web Development, AI, Networking, and Summer Internships."
      )
    },
    {
      icon: <Smartphone className="h-7 w-7 text-teal-600 dark:text-teal-400" />,
      title: t("تطبيق PWA ومزامنة تقويم Moodle", "Instant PWA App & Moodle Sync"),
      description: t(
        "تثبيت فوري للمنصة كتطبيق على هاتف المحمول، مع مزامنة آلية لجدول محاضراتك وامتحاناتك مباشرة من نظام Moodle الرسمي.",
        "Install the portal as an instant app on your phone with zero app store hassle, plus automatic Moodle calendar sync for assignments and exams."
      )
    }
  ];

  const stats = [
    { num: 144, suffix:"", label: t("ساعة معتمدة مصممة بالكامل","Total Credit Hours Managed") },
    { num: 4, suffix:"", label: t("أقسام أكاديمية تخصصية (IT/CS/IS/Basic)","Specialized Academic Tracks") },
    { num: 100, suffix:"%", label: t("مزامنة أوتوماتيكية مع تقويم Moodle","Auto Synchronization with Moodle") },
    { num: 24, suffix:"/7", label: t("إرشاد وتوقع أكاديمي ذكي","24/7 Smart AI Guidance") }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 overflow-x-hidden selection:bg-sky-500 selection:text-white" dir={dir}>
      <Navbar />

      <main className="flex-1">
        {/* Hero Section - Perfectly framed to fill viewport ending right at the guest tools cards */}
        <section className="relative min-h-[calc(100vh-64px)] flex flex-col justify-center items-center py-6 sm:py-8 px-4 sm:px-6 overflow-hidden">
          {/* Glowing Background Orbs */}
          <div className="absolute -top-40 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-sky-600/10 via-cyan-600/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/3 left-10 w-[400px] h-[400px] bg-gradient-to-tr from-sky-500/10 to-transparent rounded-full blur-[100px] pointer-events-none" />

          <div className="w-full max-w-5xl mx-auto text-center relative z-10 space-y-3 sm:space-y-4 my-auto">
            {/* Top Floating Badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-sky-500/25 dark:border-sky-500/30 bg-zinc-100/90 dark:bg-zinc-900/90 text-zinc-900 dark:text-white text-xs sm:text-sm font-semibold shadow-xs backdrop-blur-md transition-colors"
            >
              <span>{t("المنصة التعليمية الشاملة لطلاب جامعة سيناء","The comprehensive educational platform for Sinai University students.")}</span>
              <GraduationCap className="h-4 w-4 text-primary dark:text-sky-400 shrink-0" />
            </motion.div>

            {/* Hero Main Headline - Matches screenshot 1 exact calm lavender styling */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.25] max-w-4xl mx-auto"
            >
              <span className="block text-zinc-950 dark:text-white">
                {t("دليلك الأكاديمي والمهني لرحلة","Your Academic & Career Guide for a")}
              </span>
              <span className="block mt-1 sm:mt-2 text-sky-600 dark:text-sky-400">
                {t("تخرج ذكية وبدون عوائق","Smart Graduation Without Hurdles")}
              </span>
            </motion.h1>

            {/* Hero Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-xs sm:text-sm md:text-[15px] text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed font-normal"
            >
              {t("تتبع خطتك الدراسية، احسب معدلك التراكمي، واكتشف متطلبات المواد والمسارات المهنية بخطوات انسيابية فائقة السرعة.","Track your curriculum, calculate your GPA, and explore course requirements & career paths with intuitive speed."
              )}
            </motion.p>

            {/* Hero Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1 sm:pt-2"
            >
              <Link href={portalHref} className="w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" className="w-full sm:w-auto px-7 py-2.5 text-sm font-bold shadow-md shadow-sky-600/20 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl gap-2 cursor-pointer">
                    <span>{t("دخول منصة الطالب","Open Student Portal")}</span>
                    <ArrowRight className={`h-4 w-4 ${lang ==="ar" ?"rotate-180" :""}`} />
                  </Button>
                </motion.div>
              </Link>

              <Link href="#features" className="w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-7 py-2.5 text-sm font-bold rounded-2xl border-zinc-300 dark:border-zinc-800 bg-white/90 dark:bg-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 backdrop-blur-sm cursor-pointer">
                    <span>{t("استكشاف المميزات","Explore Features")}</span>
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Quick Guest Access Strip - Distinctive, eye-catching, ultra-chic and interactive */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="pt-3 sm:pt-4 max-w-4xl mx-auto w-full"
            >
              {/* Eye-catching Chic Badge with Live Pulse Dot & ShinyText */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-sky-500/30 dark:border-sky-500/40 text-zinc-800 dark:text-zinc-200 text-[11px] font-semibold mb-3.5 shadow-2xs transition-all">
                {/* Live glowing radar pulse dot */}
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                </span>
                <ShinyText text={t("أدوات مفتوحة للتجربة السريعة بدون تسجيل","Instant Free Exploration Tools (No Login Required)")} className="font-bold text-zinc-850 dark:text-zinc-100" />
                <span className="px-1.5 py-0.5 rounded-md bg-sky-500/10 dark:bg-sky-400/15 text-sky-600 dark:text-sky-300 text-[9px] font-bold">
                  {t("متاح للجميع","Open to All")}
                </span>
              </div>

              {/* 3 Interactive Cards Container */}
              <div className="relative max-w-3xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-right" dir={dir}>
                  {/* Card 1: GPA Calculator with ReactBits SpotlightCard */}
                  <Link href="/gpa" className="group block h-full">
                    <SpotlightCard className="h-full p-3.5 shadow-xs hover:shadow-lg hover:shadow-sky-500/10 hover:border-sky-500/50 dark:hover:border-sky-500/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between" spotlightColor="rgba(2, 132, 199, 0.22)">
                      <div className="flex items-center justify-between gap-2.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-9 w-9 rounded-xl bg-sky-50 dark:bg-zinc-800 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all duration-300 border border-sky-100 dark:border-zinc-700/50 shadow-2xs">
                            <Calculator className="h-4.5 w-4.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-bold text-zinc-950 dark:text-white truncate">{t("حاسبة الـ GPA","GPA Calculator")}</h4>
                              <span className="text-[9px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-200/40 dark:border-sky-800/40 shrink-0">
                                {t("فوري","Instant")}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-600 dark:text-zinc-300 font-medium truncate mt-0.5">{t("توقع درجات التخرج والمعدل الفصلي","Target Graduation Predictor")}</p>
                          </div>
                        </div>

                        {/* Chic Action Indicator */}
                        <div className="h-7 w-7 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 flex items-center justify-center shrink-0 group-hover:bg-sky-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                          <ArrowUpRight className={`h-3.5 w-3.5 ${lang ==="ar" ?"-scale-x-100" :""}`} />
                        </div>
                      </div>
                    </SpotlightCard>
                  </Link>

                  {/* Card 2: Course Explorer with ReactBits SpotlightCard */}
                  <Link href="/courses" className="group block h-full">
                    <SpotlightCard className="h-full p-3.5 shadow-xs hover:shadow-lg hover:shadow-sky-500/10 hover:border-sky-500/50 dark:hover:border-sky-500/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between" spotlightColor="rgba(2, 132, 199, 0.22)">
                      <div className="flex items-center justify-between gap-2.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-9 w-9 rounded-xl bg-sky-50 dark:bg-zinc-800 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all duration-300 border border-sky-100 dark:border-zinc-700/50 shadow-2xs">
                            <BookOpen className="h-4.5 w-4.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-bold text-zinc-950 dark:text-white truncate">{t("دليل المقررات","Course Explorer")}</h4>
                              <span className="text-[9px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-200/40 dark:border-sky-800/40 shrink-0">
                                {t("الشجرة","Tree")}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-600 dark:text-zinc-300 font-medium truncate mt-0.5">{t("شجرة المواد والمتطلبات السابقة","Course Hierarchy & Prerequisites")}</p>
                          </div>
                        </div>

                        {/* Chic Action Indicator */}
                        <div className="h-7 w-7 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 flex items-center justify-center shrink-0 group-hover:bg-sky-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                          <ArrowUpRight className={`h-3.5 w-3.5 ${lang ==="ar" ?"-scale-x-100" :""}`} />
                        </div>
                      </div>
                    </SpotlightCard>
                  </Link>

                  {/* Card 3: Career Roadmaps with ReactBits SpotlightCard */}
                  <Link href="/roadmaps" className="group block h-full">
                    <SpotlightCard className="h-full p-3.5 shadow-xs hover:shadow-lg hover:shadow-sky-500/10 hover:border-sky-500/50 dark:hover:border-sky-500/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between" spotlightColor="rgba(2, 132, 199, 0.22)">
                      <div className="flex items-center justify-between gap-2.5">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-9 w-9 rounded-xl bg-sky-50 dark:bg-zinc-800 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white transition-all duration-300 border border-sky-100 dark:border-zinc-700/50 shadow-2xs">
                            <Compass className="h-4.5 w-4.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-bold text-zinc-950 dark:text-white truncate">{t("مسارات التعلّم","Career Roadmaps")}</h4>
                              <span className="text-[9px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-200/40 dark:border-sky-800/40 shrink-0">
                                {t("2026","2026")}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-600 dark:text-zinc-300 font-medium truncate mt-0.5">{t("خارطة طريق Frontend, AI, Backend","Frontend, AI & Backend tracks")}</p>
                          </div>
                        </div>

                        {/* Chic Action Indicator */}
                        <div className="h-7 w-7 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 flex items-center justify-center shrink-0 group-hover:bg-sky-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                          <ArrowUpRight className={`h-3.5 w-3.5 ${lang ==="ar" ?"-scale-x-100" :""}`} />
                        </div>
                      </div>
                    </SpotlightCard>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Interactive Showcase Tabs Section - Perfectly responsive on Mobile and Desktop */}
        <section id="features" className="py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="p-3.5 sm:p-5 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl shadow-2xl space-y-4 sm:space-y-5"
            >
              {/* Tab Switches - 2x2 grid on mobile, horizontal flex on desktop */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-2 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-3">
                {[
                  { id:"gpa", label: t("حاسبة المعدل التراكمي","GPA Predictor"), icon: <Calculator className="h-4 w-4 shrink-0" /> },
                  { id:"courses", label: t("شجرة المواد والمقررات","Course Hierarchy"), icon: <BookOpen className="h-4 w-4 shrink-0" /> },
                  { id:"ai", label: t("المساعد الذكي AI","AI Assistant"), icon: <Sparkles className="h-4 w-4 shrink-0" /> },
                  { id:"careers", label: t("المسارات والفرص","Career Roadmaps"), icon: <Compass className="h-4 w-4 shrink-0" /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-2.5 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer select-none ${
                      activeTab === tab.id
                        ?"bg-sky-600 text-white shadow-md shadow-sky-600/25"
                        :"text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100/80 dark:bg-zinc-800/50 hover:bg-zinc-200/80 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {tab.icon}
                    <span className="truncate">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Preview Display */}
              <div className={`p-4 sm:p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200/60 dark:border-zinc-800/60 ${dir ==="rtl" ?"text-right" :"text-left"} space-y-3 sm:space-y-4 min-h-[220px] flex flex-col justify-between`} dir={dir}>
                {activeTab ==="gpa" && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge className="bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border-none font-bold">
                        {t("توقع فوري محاذى للوائح الكلية","Sinai Regulations Compliant")}
                      </Badge>
                      <span className="text-xs text-zinc-400 font-semibold">{t("144 ساعة معتمدة","144 Credit Hours")}</span>
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-snug">
                      {t("حساب المعدل الفصلي وتحديد الدرجات المطلوبة للتخرج","Semester GPA & Target Graduation Grades")}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {t("أدخل درجات موادك الحالية أو استعمل محاكي (What-If) لمعرفة التقدير المتوقع المطلوب تحقيقه مستقبلاً للوصول لمعدل امتياز أو جيد جداً.","Enter your course grades or use What-If simulation to calculate target grades needed for Excellent or Very Good GPA."
                      )}
                    </p>
                  </div>
                )}

                {activeTab ==="courses" && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge className="bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300 border-none font-bold">
                        {t("ترتيب تسلسلي أكاديمي","Academic Prerequisites Chain")}
                      </Badge>
                      <span className="text-xs text-zinc-400 font-semibold">{t("تأكد من المتطلبات المسبقة","Check Prerequisites")}</span>
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-snug">
                      {t("دليل المواد الشامل من المستوى الأول إلى الرابع","Complete Course Directory (Year 1 to Year 4)")}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {t("تصفح خطة مقررات تكنولوجيا المعلومات، الحاسبات، ونظم المعلومات باللغتين العربية والإنجليزية مع تنزيل المراجع وتجارب الطلاب.","Browse IT, CS, and IS course plans in Arabic & English with downloadable references and student reviews."
                      )}
                    </p>
                  </div>
                )}

                {activeTab ==="ai" && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge className="bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border-none font-bold">
                        {t("ذكاء اصطناعي مخصص","Custom AI Model")}
                      </Badge>
                      <span className="text-xs text-zinc-400 font-semibold">{t("استجابة لغوية فائقة","Instant AI Response")}</span>
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-snug">
                      {t("المرشد الذكي لجامعة سيناء (SU IT Advisor)","Sinai University Smart AI Counselor")}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {t("اسأل عن طريقة التسجيل، شروط فتح المواد المغلقة، النصائح الدراسية للمواد الصعبة، واحصل على إجابة موثوقة في ثوانٍ.","Ask about registration rules, prerequisite unlocks, study tips, and get instant reliable academic answers."
                      )}
                    </p>
                  </div>
                )}

                {activeTab ==="careers" && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-none font-bold">
                        {t("ربط الكلية بسوق العمل","Bridge Academia to Industry")}
                      </Badge>
                      <span className="text-xs text-zinc-400 font-semibold">{t("فرص وتدريبات مهنية","Internships & Careers")}</span>
                    </div>
                    <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-snug">
                      {t("خراط طريق مهنية وفرص تدريب توظيفية","Career Roadmaps & Internship Opportunities")}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {t("ربط المواد الجامعية بمتطلبات العمل الواقعية في تطوير الويب، الذكاء الاصطناعي، شبكات الحواسيب، والتدريبات الصيفية.","Connect university curricula to real-world job roles in Web Development, AI, Networking, and Summer Internships."
                      )}
                    </p>
                  </div>
                )}

                <div className={`pt-2 flex ${dir ==="rtl" ?"justify-end" :"justify-start"}`}>
                  <Link
                    href={
                      activeTab ==="gpa"
                        ?"/gpa"
                        : activeTab ==="courses"
                          ?"/courses"
                          : activeTab ==="careers"
                            ?"/roadmaps"
                            : portalHref
                    }
                    className="w-full sm:w-auto"
                  >
                    <Button size="sm" className="w-full sm:w-auto gap-2 font-bold text-xs cursor-pointer shadow-md bg-sky-600 hover:bg-sky-700 text-white rounded-xl">
                      <span>{t("تجربة الخدمة مباشرة","Try Feature Now")}</span>
                      <ChevronLeft className={`h-4 w-4 ${lang ==="en" ?"rotate-180" :""}`} />
                    </Button>
                  </Link>
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
            <div className={`flex flex-row flex-nowrap items-center shrink-0 min-w-max gap-4 ${lang ==="ar" ?"marquee-group-rtl" :"marquee-group-ltr"}`}>
              {[
                {
                  icon: Calculator,
                  labelAr:"حاسبة ومحاكي الـ GPA الذكي",
                  labelEn:"Smart GPA Simulator & Predictor",
                  color:"text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20"
                },
                {
                  icon: Calendar,
                  labelAr:"مزامنة تقويم المودل Moodle الآلية",
                  labelEn:"Automated Moodle Calendar Sync",
                  color:"text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
                },
                {
                  icon: Sparkles,
                  labelAr:"المرشد الأكاديمي الذكي بالـ AI",
                  labelEn:"24/7 AI Academic Counselor",
                  color:"text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20"
                },
                {
                  icon: GraduationCap,
                  labelAr:"خطة الـ 144 ساعة المعتمدة",
                  labelEn:"144 Credit Hours Matrix Plan",
                  color:"text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                },
                {
                  icon: Compass,
                  labelAr:"مسارات المهارات وسوق العمل",
                  labelEn:"Career & Tech Roadmaps",
                  color:"text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20"
                },
                {
                  icon: Smartphone,
                  labelAr:"تطبيق الهاتف السريع PWA",
                  labelEn:"Instant PWA Mobile App",
                  color:"text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20"
                },
                {
                  icon: BookOpen,
                  labelAr:"دليل المقررات والمراجع الأكاديمية",
                  labelEn:"Course Library & Open Resources",
                  color:"text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20"
                },
                {
                  icon: Users,
                  labelAr:"منتدى مجتمع طلاب الكلية",
                  labelEn:"Students Community Forum",
                  color:"text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/20"
                },
                {
                  icon: Zap,
                  labelAr:"أداء فائق واستجابة لحظية",
                  labelEn:"Sub-Second Performance & Speed",
                  color:"text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20"
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={`t1-${idx}`}
                    className="flex items-center gap-2.5 px-4.5 py-2.5 rounded-full bg-white/90 dark:bg-zinc-900/80 border border-zinc-200/90 dark:border-zinc-800/80 shadow-2xs hover:shadow-md hover:border-sky-400 dark:hover:border-sky-600/70 hover:scale-105 transition-all duration-200 select-none shrink-0"
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
            <div className={`flex flex-row flex-nowrap items-center shrink-0 min-w-max gap-4 ${lang ==="ar" ?"marquee-group-rtl" :"marquee-group-ltr"}`} aria-hidden="true">
              {[
                {
                  icon: Calculator,
                  labelAr:"حاسبة ومحاكي الـ GPA الذكي",
                  labelEn:"Smart GPA Simulator & Predictor",
                  color:"text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20"
                },
                {
                  icon: Calendar,
                  labelAr:"مزامنة تقويم المودل Moodle الآلية",
                  labelEn:"Automated Moodle Calendar Sync",
                  color:"text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
                },
                {
                  icon: Sparkles,
                  labelAr:"المرشد الأكاديمي الذكي بالـ AI",
                  labelEn:"24/7 AI Academic Counselor",
                  color:"text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20"
                },
                {
                  icon: GraduationCap,
                  labelAr:"خطة الـ 144 ساعة المعتمدة",
                  labelEn:"144 Credit Hours Matrix Plan",
                  color:"text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                },
                {
                  icon: Compass,
                  labelAr:"مسارات المهارات وسوق العمل",
                  labelEn:"Career & Tech Roadmaps",
                  color:"text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20"
                },
                {
                  icon: Smartphone,
                  labelAr:"تطبيق الهاتف السريع PWA",
                  labelEn:"Instant PWA Mobile App",
                  color:"text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20"
                },
                {
                  icon: BookOpen,
                  labelAr:"دليل المقررات والمراجع الأكاديمية",
                  labelEn:"Course Library & Open Resources",
                  color:"text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20"
                },
                {
                  icon: Users,
                  labelAr:"منتدى مجتمع طلاب الكلية",
                  labelEn:"Students Community Forum",
                  color:"text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/20"
                },
                {
                  icon: Zap,
                  labelAr:"أداء فائق واستجابة لحظية",
                  labelEn:"Sub-Second Performance & Speed",
                  color:"text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20"
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={`t2-${idx}`}
                    className="flex items-center gap-2.5 px-4.5 py-2.5 rounded-full bg-white/90 dark:bg-zinc-900/80 border border-zinc-200/90 dark:border-zinc-800/80 shadow-2xs hover:shadow-md hover:border-sky-400 dark:hover:border-sky-600/70 hover:scale-105 transition-all duration-200 select-none shrink-0"
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

        {/* Statistics Banner Section with ReactBits CountUp & SpotlightCard */}
        <section id="stats" className="py-10 sm:py-12 px-4 sm:px-6 border-y border-zinc-200/60 dark:border-zinc-900 bg-white/50 dark:bg-zinc-900/20 backdrop-blur-md">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                >
                  <SpotlightCard className="p-4 sm:p-5 text-center shadow-sm hover:shadow-md hover:border-sky-500/40 dark:hover:border-sky-500/40" spotlightColor="rgba(2, 132, 199, 0.18)">
                    <span className="block text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-500 mb-1">
                      <CountUp to={stat.num} suffix={stat.suffix} duration={1.6} />
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-zinc-600 dark:text-zinc-400">
                      {stat.label}
                    </span>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works (3 Steps) Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 bg-zinc-100/40 dark:bg-zinc-900/10">
          <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center space-y-2.5 max-w-2xl mx-auto">
              <Badge className="bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border-none font-bold">
                {t("سهولة فائقة في الاستخدام","Simple & Intuitive")}
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">
                {t("كيف تبدأ رحلتك الأكاديمية في 3 خطوات بسيطة؟","How to Get Started in 3 Simple Steps")}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm md:text-base leading-relaxed">
                {t("صُممت المنصة لتوفير الوقت والجهد على طلاب الكلية من اليوم الأول حتى يوم التخرج.","Engineered to save time and effort for students from Freshman year until graduation day."
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 relative" dir={dir}>
              {[
                {
                  step:"01",
                  icon: GraduationCap,
                  iconClasses:"bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200/80 dark:border-sky-800/60 shadow-sm shadow-sky-500/10",
                  badgeClasses:"bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20",
                  title: t("حدد فرقتك وقسمك التخصصي","1. Choose Year & Department"),
                  desc: t("اختر فرقتك الدراسية (الأولى، الثانية، الثالثة، الرابعة) وتخصصك (IT, CS, IS) لتهيئة خطتك الدراسية فوراً.","Select your academic level (Year 1 to 4) and specialized track (IT, CS, IS) to tailor your plan."
                  )
                },
                {
                  step:"02",
                  icon: Calendar,
                  iconClasses:"bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-200/80 dark:border-cyan-800/60 shadow-sm shadow-cyan-500/10",
                  badgeClasses:"bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20",
                  title: t("سجل درجاتك أو اربط تقويم Moodle","2. Log Grades or Sync Moodle"),
                  desc: t("أدخل تقديراتك للمواد المنجزة، أو انسخ رابط تقويم Moodle iCal لمزامنة مواعيد المحاضرات والامتحانات تلقائياً.","Enter your completed grades, or connect your Moodle iCal URL to sync assignment and exam dates."
                  )
                },
                {
                  step:"03",
                  icon: Sparkles,
                  iconClasses:"bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/60 shadow-sm shadow-blue-500/10",
                  badgeClasses:"bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20",
                  title: t("احصل على توقعات الـ GPA وإرشاد الـ AI","3. Get GPA Insights & AI Advice"),
                  desc: t("استمتع بحساب وتوقع فوري للمعدل التراكمي المطلوب للتخرج بامتياز، مع استشارات ذكية من المرشد الأكاديمي الذكي.","Enjoy instant GPA predictions to achieve Honors, with 24/7 personalized AI academic counseling."
                  )
                }
              ].map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -4 }}
                    className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/80 shadow-lg shadow-zinc-900/5 dark:shadow-black/40 relative overflow-hidden flex flex-col justify-between transition-all"
                  >
                    <div className="space-y-4">
                      {/* Top Header Row with Icon and Step Number Badge */}
                      <div className="flex items-center justify-between w-full">
                        <div className={`h-11 w-11 rounded-2xl flex items-center justify-center ${item.iconClasses}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <span className={`text-xs font-black px-2.5 py-1 rounded-xl tracking-wider ${item.badgeClasses}`}>
                          STEP {item.step}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="space-y-1.5">
                        <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-zinc-50 leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
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
        <section id="features" className="py-12 sm:py-16 px-4 sm:px-6 relative">
          <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
            <div className="text-center space-y-2.5 max-w-2xl mx-auto">
              <Badge className="bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border-none font-bold">
                {t("مميزات حصرية","Exclusive Features")}
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">
                {t("كل ما يحتاجه طالب تكنولوجيا المعلومات في مكان واحد","Everything an IT Student Needs in One Place")}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm md:text-base leading-relaxed">
                {t("تم تطوير المنصة بدقة لتلبي الاحتياجات الأكاديمية والعملية الفعليه لطلاب الجامعة.","Engineered specifically to fulfill real academic and practical needs for Sinai University students."
                )}
              </p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin:"-50px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
            >
              {features.map((feature, idx) => (
                <motion.div key={idx} variants={itemVariants} whileHover={{ y: -4, scale: 1.01 }}>
                  <Card className="h-full border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/80 backdrop-blur-sm shadow-md hover:shadow-xl hover:border-sky-500/50 transition-all rounded-3xl">
                    <CardHeader className="flex flex-row items-center gap-3.5 pb-2">
                      <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800/60 rounded-2xl shrink-0">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-base sm:text-lg font-bold">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-xs sm:text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium">
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
        <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-b from-zinc-50 to-sky-50/40 dark:from-zinc-950 dark:to-sky-950/20 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-sky-50/90 via-blue-50/80 to-cyan-50/70 dark:from-sky-950/80 dark:via-blue-950/70 dark:to-zinc-950 shadow-2xl border border-sky-200/80 dark:border-sky-800/40 relative overflow-hidden transition-all">
              {/* Background Ambient Glows */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/15 dark:bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-400/15 dark:bg-sky-600/30 rounded-full blur-3xl pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
                <div className={`lg:col-span-8 space-y-4 sm:space-y-5 ${dir ==="rtl" ?"text-right" :"text-left"}`} dir={dir}>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 dark:bg-white/10 backdrop-blur-md border border-sky-200 dark:border-white/20 text-xs font-bold text-sky-700 dark:text-sky-200">
                    <Smartphone className="h-4 w-4 text-primary dark:text-cyan-300" />
                    <span>{t("تطبيق الهاتف المحمول PWA","Mobile App Experience (PWA)")}</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight text-zinc-900 dark:text-white">
                    {t("منصتك الأكاديمية معك في جيبك أينما كنت","Your Academic Platform in Your Pocket Everywhere")}
                  </h2>

                  <p className="text-xs sm:text-sm md:text-base text-zinc-700 dark:text-zinc-300 max-w-2xl leading-relaxed font-medium">
                    {t("ثبّت المنصة كتطبيق فوري على هاتفك (Android أو iPhone) أو جهاز الكمبيوتر بضغطة زر واحدة. استمتع بسرعة فائقة، إمكانية التصفح، وتجربة سلسة بدون الحاجة للتحميل من المتاجر.","Install the portal as an instant app on your phone (Android/iOS) or PC with one click. Enjoy fast loading, offline capability, and smooth experience with zero app store hassle."
                    )}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 shadow-xs">
                      <Zap className="h-4.5 w-4.5 text-amber-500 shrink-0" />
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100">{t("سرعة تشغيل فائقة","Instant Launch Speed")}</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 shadow-xs">
                      <CheckCircle2 className="h-4.5 w-4.5 text-primary shrink-0" />
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100">{t("حفظ البيانات أوفلاين","Offline Data Persistence")}</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-zinc-200/80 dark:border-white/10 shadow-xs">
                      <Smartphone className="h-4.5 w-4.5 text-primary dark:text-cyan-400 shrink-0" />
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100">{t("دعم كامل لـ iOS & Android","Full iOS & Android Support")}</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-white/10 backdrop-blur-xl border border-sky-200/90 dark:border-white/20 shadow-xl w-full max-w-xs space-y-3.5">
                    <div className="h-14 w-14 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-400 to-sky-600 flex items-center justify-center shadow-lg">
                      <Download className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-zinc-900 dark:text-white">{t("تثبيت التطبيق على جهازك","Install App on Device")}</h4>
                      <p className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300 mt-1">{t("اضغط على'تثبيت' أو'إضافة للشاشة الرئيسية'","Tap'Install' or'Add to Home Screen'")}</p>
                    </div>
                    <Button
                      onClick={() => {
                        window.dispatchEvent(new Event("trigger-pwa-install"));
                      }}
                      className="w-full bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs h-10 rounded-xl shadow-lg shadow-sky-500/25 cursor-pointer gap-2"
                    >
                      <Download className="h-4 w-4 text-white" />
                      <span>{t("تثبيت التطبيق الآن","Install App Now")}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <div className="inline-flex p-3 bg-sky-100 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 rounded-2xl">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">{t("الأسئلة الشائعة","Frequently Asked Questions")}</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">{t("إليك أهم الإجابات عن التساؤلات الشائعة حول المنصة.","Clear answers to common questions about the platform.")}</p>
            </div>

            <Accordion dir={dir}>
              <AccordionItem title={t("كيف يتم حساب المعدل التراكمي (GPA) الفصلي والإجمالي؟", "How is the semester and cumulative GPA calculated?")}>
                {t("يتم حساب الـ GPA بضرب نقاط تقدير كل مقرر دراسي (مثلاً: A=4.0، B=3.0، C=2.0) في عدد ساعاته المعتمدة لنحصل على نقاط المقرر، ثم يتم جمع نقاط جميع المقررات وقسمة المجموع على إجمالي الساعات المسجلة. كما توفر لك المنصة حاسبة ذكية ومحاكي GPA يقوم بكل هذه الحسابات وتوقع معدلك المستهدف بدقة تلقائياً دون الحاجة لحسابها يدوياً.", "GPA is calculated by multiplying each course's grade points (e.g. A=4.0, B=3.0, C=2.0) by its credit hours to get course points, summing all course points, and dividing by total registered credit hours. The platform also provides a built-in smart calculator and predictor that computes this automatically.")}
              </AccordionItem>
              <AccordionItem title={t("كيف يساعدني محاكي الـ GPA وكيف يتم حساب المعدل المستهدف؟", "How does the GPA Predictor calculate target grades?")}>
                {t("يُمكنك المحاكي من إدخال المعدل المستهدف للتخرج (مثلاً 3.5)، وسيقوم النظام بطرح نقاطك المنجزة وتقسيم المتبقي على الساعات القادمة لتحديد التقديرات المحددة والحد الأدنى للدرجات المطلوب تحقيقها في المواد والساعات المتبقية.", "The predictor allows you to input a target graduation GPA (e.g. 3.5). The system subtracts completed grade points from total required points and divides the remainder over remaining hours to determine precise target semester grades.")}
              </AccordionItem>
              <AccordionItem title={t("هل التسجيل متاح بأي بريد إلكتروني أم بـ بريد الجامعة فقط؟", "Is registration open to any email or university email only?")}>
                {t("التسجيل في المنصة مخصص حصرياً لطلاب الجامعة باستخدام البريد الأكاديمي المعتمد (@su.edu.eg أو @sinai.edu.eg) لضمان أمان وحصرية الخدمات والأدوات للطلاب.", "Registration is strictly restricted to students using official university email (@su.edu.eg or @sinai.edu.eg) to guarantee account security and platform integrity.")}
              </AccordionItem>
              <AccordionItem title={t("هل المنصة آمنة ومربوطة بسيرفر سحابي؟", "Is the platform secure and cloud-backed?")}>
                {t("نعم، المنصة مربوطة بسيرفر قاعدة بيانات سحابية (Supabase Cloud Database) تؤمن بيانات الحسابات، التقييمات، والمنشورات بالكامل مع تشفير البيانات.", "Yes, the platform is backed by Supabase Cloud Database securing accounts, reviews, and student posts with full data encryption.")}
              </AccordionItem>
              <AccordionItem title={t("كيف تتم المزامنة مع Moodle والتقويم الأكاديمي؟", "How does Moodle synchronization work?")}>
                {t("المزامنة تتم من خلال رابط تقويم iCal العام الذي تقوم بنسخه من Moodle. المنصة تقرأ التواريخ الخاصة بالمهام الأكاديمية والامتحانات وتضعها وتنبّهك بها تلقائياً في تقويمك.", "Sync operates via public iCal calendar URL copied from Moodle. The system automatically parses exam and assignment dates into your personal dashboard calendar.")}
              </AccordionItem>
              <AccordionItem title={t("هل يتم حفظ كلمة مرور Moodle الخاصة بي؟", "Is my Moodle password saved?")}>
                {t("لا، المنصة تستخدم رابط تقويم iCal العام المخصص للمهام والامتحانات فقط دون الحاجة لإدخال كلمة مرور Moodle الخاصة بك، مما يضمن أمان حسابك الجامعي بالكامل.", "No, the portal only uses the public iCal calendar feed for assignment dates without requiring your Moodle password, keeping your credentials completely safe.")}
              </AccordionItem>
              <AccordionItem title={t("كيف يساعدني المرشد الأكاديمي الذكي (AI Advisor)؟", "How does the AI Advisor support my studies?")}>
                {t("يعتمد المرشد الذكي على الذكاء الاصطناعي للإجابة على استفساراتك حول اللوائح، شرح مفاهيم المواد، تقديم نصائح الاستذكار، ومساعدتك في اختيار التخصصات والمواد.", "Powered by AI, the advisor answers rule queries, clarifies course concepts, offers tailored study advice, and assists with academic decision-making.")}
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
