"use client";

import * as React from"react";
import Link from"next/link";
import { useApp } from"@/context/app-context";
import { useAuth } from"@/context/auth-context";
import { ROADMAPS, Roadmap, RoadmapNode } from"@/lib/roadmaps-data";
import { useLearning } from"@/context/learning-context";
import { useAdmin } from"@/context/admin-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from"@/components/ui/card";
import { Button } from"@/components/ui/button";
import { Badge } from"@/components/ui/badge";
import { Progress } from"@/components/ui/progress";
import {
  Compass,
  Clock,
  BookOpen,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  PlayCircle,
  ExternalLink,
  Globe,
  GraduationCap,
  Sparkles,
  Layers,
  Code2,
  Check
} from"lucide-react";
import { motion, AnimatePresence } from"framer-motion";
import { GuestNoticeBanner } from "@/components/guest-notice-banner";

interface SubRoadmap {
  nameAr: string;
  nameEn: string;
  url: string;
}

interface RoadmapShTrack {
  id: string;
  titleAr: string;
  titleEn: string;
  category: string;
  icon: string;
  color: string;
  descAr: string;
  descEn: string;
  url: string;
  embedUrl: string;
  keyTopics: string[];
  subRoadmaps: SubRoadmap[];
}

const ROADMAP_SH_TRACKS: RoadmapShTrack[] = [
  {
    id:"frontend",
    titleAr:"مطور واجهات الويب (Frontend Developer)",
    titleEn:"Frontend Web Developer",
    category:"Web Development",
    icon:"🎨",
    color:"from-cyan-500 to-blue-600",
    descAr:"خارطة طريق كاملة لتعلم HTML, CSS, JavaScript, React, Next.js, TypeScript والتعامل مع APIs.",
    descEn:"Complete roadmap to learn HTML, CSS, JavaScript, React, Next.js, TypeScript, and API integration.",
    url:"https://roadmap.sh/frontend",
    embedUrl:"https://roadmap.sh/frontend",
    keyTopics: ["HTML & CSS","JavaScript ES6+","Git & GitHub","React.js","Next.js","Tailwind CSS","TypeScript"],
    subRoadmaps: [
      { nameAr:"مسار React.js ️", nameEn:"React.js Roadmap", url:"https://roadmap.sh/react" },
      { nameAr:"مسار Next.js ▲", nameEn:"Next.js Roadmap", url:"https://roadmap.sh/nextjs" },
      { nameAr:"مسار TypeScript", nameEn:"TypeScript Roadmap", url:"https://roadmap.sh/typescript" },
      { nameAr:"مسار Vue.js", nameEn:"Vue.js Roadmap", url:"https://roadmap.sh/vue" },
      { nameAr:"مسار Angular ️", nameEn:"Angular Roadmap", url:"https://roadmap.sh/angular" }
    ]
  },
  {
    id:"backend",
    titleAr:"مطور خوادم الويب (Backend Developer)",
    titleEn:"Backend Web Developer",
    category:"Web Development",
    icon:"⚙️",
    color:"from-emerald-500 to-teal-600",
    descAr:"تعلم خوادم Node.js, Python, PostgreSQL, REST APIs, GraphQL, الأمان، والتحكم بالحاويات Docker.",
    descEn:"Learn Node.js, Python, PostgreSQL, REST APIs, GraphQL, Security, and Docker containers.",
    url:"https://roadmap.sh/backend",
    embedUrl:"https://roadmap.sh/backend",
    keyTopics: ["Node.js / Express","Python / Django","PostgreSQL & SQL","RESTful APIs","Authentication","Docker"],
    subRoadmaps: [
      { nameAr:"مسار Node.js 🟢", nameEn:"Node.js Roadmap", url:"https://roadmap.sh/nodejs" },
      { nameAr:"مسار Python", nameEn:"Python Roadmap", url:"https://roadmap.sh/python" },
      { nameAr:"مسار PostgreSQL", nameEn:"PostgreSQL Roadmap", url:"https://roadmap.sh/postgresql" },
      { nameAr:"مسار Docker", nameEn:"Docker Roadmap", url:"https://roadmap.sh/docker" },
      { nameAr:"مسار GraphQL ️", nameEn:"GraphQL Roadmap", url:"https://roadmap.sh/graphql" }
    ]
  },
  {
    id:"full-stack",
    titleAr:"مطور الويب الشامل (Full Stack Developer)",
    titleEn:"Full Stack Developer",
    category:"Web Development",
    icon:"🌍",
    color:"from-sky-500 to-blue-600",
    descAr:"الجمع بين الواجهات الأمامية والأنظمة الخلفية لتطوير تطبيقات ويب متكاملة وقابلة للتوسع.",
    descEn:"Combine frontend and backend skills to build scalable, full-stack web applications.",
    url:"https://roadmap.sh/full-stack",
    embedUrl:"https://roadmap.sh/full-stack",
    keyTopics: ["Frontend Mastery","Backend APIs","Database Systems","DevOps Basics","System Architecture"],
    subRoadmaps: [
      { nameAr:"مسار Frontend", nameEn:"Frontend Roadmap", url:"https://roadmap.sh/frontend" },
      { nameAr:"مسار Backend ️", nameEn:"Backend Roadmap", url:"https://roadmap.sh/backend" },
      { nameAr:"مسار API Design", nameEn:"API Design Roadmap", url:"https://roadmap.sh/api-design" },
      { nameAr:"مسار System Design ️", nameEn:"System Design", url:"https://roadmap.sh/system-design" }
    ]
  },
  {
    id:"ai-data-science",
    titleAr:"الذكاء الاصطناعي وعلم البيانات (AI & Data Science)",
    titleEn:"AI & Data Science",
    category:"Artificial Intelligence",
    icon:"🤖",
    color:"from-amber-500 to-orange-600",
    descAr:"خارطة طريق مهارات تعلم الآلة Machine Learning, Deep Learning, Python, Pandas, TensorFlow.",
    descEn:"Roadmap for Machine Learning, Deep Learning, Python, Pandas, NumPy, and PyTorch.",
    url:"https://roadmap.sh/ai-data-scientist",
    embedUrl:"https://roadmap.sh/ai-data-scientist",
    keyTopics: ["Python Data Stack","Mathematics & Statistics","Machine Learning","Neural Networks","LLMs & AI Prompting"],
    subRoadmaps: [
      { nameAr:"مسار Python للذكاء الاصطناعي", nameEn:"Python AI Roadmap", url:"https://roadmap.sh/python" },
      { nameAr:"مسار Data Analyst", nameEn:"Data Analyst Roadmap", url:"https://roadmap.sh/data-analyst" },
      { nameAr:"مسار Prompt Engineering ️", nameEn:"Prompt Engineering", url:"https://roadmap.sh/prompt-engineering" }
    ]
  },
  {
    id:"android",
    titleAr:"تطوير تطبيقات الموبايل (Android / Flutter)",
    titleEn:"Android & Mobile Developer",
    category:"Mobile Development",
    icon:"📱",
    color:"from-green-500 to-emerald-600",
    descAr:"بناء تطبيقات للهواتف الذكية بـ Kotlin, Flutter, Firebase, والتكامل مع خوادم الويب.",
    descEn:"Build smartphone applications using Kotlin, Flutter, Firebase, and REST APIs.",
    url:"https://roadmap.sh/android",
    embedUrl:"https://roadmap.sh/android",
    keyTopics: ["Kotlin / Dart","Flutter Framework","Mobile UI Patterns","State Management","Firebase & Push Notifs"],
    subRoadmaps: [
      { nameAr:"مسار Flutter", nameEn:"Flutter Roadmap", url:"https://roadmap.sh/flutter" },
      { nameAr:"مسار React Native ️", nameEn:"React Native Roadmap", url:"https://roadmap.sh/react-native" },
      { nameAr:"مسار Android / Kotlin", nameEn:"Android Roadmap", url:"https://roadmap.sh/android" },
      { nameAr:"مسار iOS / Swift", nameEn:"iOS Roadmap", url:"https://roadmap.sh/ios" }
    ]
  },
  {
    id:"cyber-security",
    titleAr:"الأمن السيبراني وحماية الشبكات (Cyber Security)",
    titleEn:"Cyber Security Specialist",
    category:"Security",
    icon:"🛡️",
    color:"from-rose-500 to-red-600",
    descAr:"دليل دراسة اختراق الشبكات، التشفير، أمن المعلومات، واستجابة الحوادث السيبرانية.",
    descEn:"Study guide for penetration testing, cryptography, network security, and incident response.",
    url:"https://roadmap.sh/cyber-security",
    embedUrl:"https://roadmap.sh/cyber-security",
    keyTopics: ["Networking Protocol","Linux Administration","Ethical Hacking","Cryptography","Security Compliance"],
    subRoadmaps: [
      { nameAr:"مسار Linux", nameEn:"Linux Roadmap", url:"https://roadmap.sh/linux" },
      { nameAr:"مسار Cyber Security ️", nameEn:"Cyber Security", url:"https://roadmap.sh/cyber-security" }
    ]
  },
  {
    id:"computer-science",
    titleAr:"أساسيات علوم الحاسب (Computer Science)",
    titleEn:"Computer Science Fundamentals",
    category:"Core Academics",
    icon:"💻",
    color:"from-sky-600 to-blue-700",
    descAr:"أساسيات هياكل البيانات، الخوارزميات، نظم التشغيل، شبكات الحاسب، وتصميم الأنظمة.",
    descEn:"Core concepts of Data Structures, Algorithms, Operating Systems, Networks, and System Design.",
    url:"https://roadmap.sh/computer-science",
    embedUrl:"https://roadmap.sh/computer-science",
    keyTopics: ["Data Structures & Algo","Operating Systems","Networking","Database Internals","System Design"],
    subRoadmaps: [
      { nameAr:"مسار Data Structures & Algo", nameEn:"Data Structures Roadmap", url:"https://roadmap.sh/datastructures-and-algorithms" },
      { nameAr:"مسار System Design ️", nameEn:"System Design Roadmap", url:"https://roadmap.sh/system-design" }
    ]
  },
  {
    id:"devops",
    titleAr:"مهندس الحوسبة والأتمتة (DevOps Engineer)",
    titleEn:"DevOps Engineer",
    category:"Cloud & Infrastructure",
    icon:"♾️",
    color:"from-sky-500 to-cyan-600",
    descAr:"أتمتة البنية التحتية، Docker, Kubernetes, CI/CD Pipelines, والسحابة الإلكترونية AWS.",
    descEn:"Infrastructure automation, Docker, Kubernetes, CI/CD Pipelines, and AWS Cloud.",
    url:"https://roadmap.sh/devops",
    embedUrl:"https://roadmap.sh/devops",
    keyTopics: ["Linux & Bash","Docker & Containers","Kubernetes","CI/CD Pipelines","AWS / Cloud Providers"],
    subRoadmaps: [
      { nameAr:"مسار Docker", nameEn:"Docker Roadmap", url:"https://roadmap.sh/docker" },
      { nameAr:"مسار Kubernetes ️", nameEn:"Kubernetes Roadmap", url:"https://roadmap.sh/kubernetes" },
      { nameAr:"مسار AWS Cloud ️", nameEn:"AWS Roadmap", url:"https://roadmap.sh/aws" },
      { nameAr:"مسار Linux", nameEn:"Linux Roadmap", url:"https://roadmap.sh/linux" }
    ]
  }
];

export default function RoadmapsPage() {
  const { user } = useAuth();
  const { t, lang, dir } = useApp();
  const { roadmaps = ROADMAPS } = useAdmin();
  const {
    toggleBookmark,
    isBookmarked,
    toggleRoadmapNode,
    isRoadmapNodeCompleted,
    getRoadmapProgressPercentage,
    addRecentlyViewed
  } = useLearning();

  const [mode, setModeState] = React.useState<"global" | "faculty">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("su_roadmaps_active_mode");
      if (saved === "global" || saved === "faculty") return saved;
    }
    return "faculty"; // Default to faculty if user is on this platform, or preserve selection
  });

  const setMode = React.useCallback((m: "global" | "faculty") => {
    setModeState(m);
    if (typeof window !== "undefined") {
      localStorage.setItem("su_roadmaps_active_mode", m);
    }
  }, []);

  const [selectedGlobalTrackId, setSelectedGlobalTrackIdState] = React.useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("su_roadmaps_active_global_id");
      if (saved) return saved;
    }
    return "frontend";
  });

  const setSelectedGlobalTrackId = React.useCallback((id: string) => {
    setSelectedGlobalTrackIdState(id);
    if (typeof window !== "undefined") {
      localStorage.setItem("su_roadmaps_active_global_id", id);
    }
  }, []);

  const [activeFacultyRoadmapId, setActiveFacultyRoadmapIdState] = React.useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("su_roadmaps_active_faculty_id");
      if (saved) return saved;
    }
    return "frontend";
  });

  const setActiveFacultyRoadmapId = React.useCallback((id: string) => {
    setActiveFacultyRoadmapIdState(id);
    if (typeof window !== "undefined") {
      localStorage.setItem("su_roadmaps_active_faculty_id", id);
    }
  }, []);

  const activeGlobalTrack = React.useMemo(() => {
    return ROADMAP_SH_TRACKS.find((tr) => tr.id === selectedGlobalTrackId) || ROADMAP_SH_TRACKS[0];
  }, [selectedGlobalTrackId]);

  const currentFacultyRoadmap = React.useMemo(() => {
    return roadmaps.find((r) => r.id === activeFacultyRoadmapId) || roadmaps[0];
  }, [roadmaps, activeFacultyRoadmapId]);

  const facultyProgressPercentage = React.useMemo(() => {
    return currentFacultyRoadmap ? getRoadmapProgressPercentage(currentFacultyRoadmap.id, currentFacultyRoadmap.nodes.length) : 0;
  }, [currentFacultyRoadmap, getRoadmapProgressPercentage]);

  const handleNodeToggle = (nodeId: string) => {
    if (currentFacultyRoadmap) {
        toggleRoadmapNode(currentFacultyRoadmap.id, nodeId);
        const title = lang ==="ar" ? currentFacultyRoadmap.title : (currentFacultyRoadmap.titleEn || currentFacultyRoadmap.title);
        addRecentlyViewed(currentFacultyRoadmap.id,"roadmap", title,"/roadmaps");
    }
  };

  const isRtl = dir ==="rtl";

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in" dir={dir}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5">
            <Compass className="h-7 w-7 text-primary" />
            {t("مسارات وخارطة طريق التعلّم المهنية","Professional Career Roadmaps")}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {t("دليل شامل يجمع بين خرائط التكنولوجيا العالمية والتوجيهات الأكاديمية الخاصة بالكلية.","Comprehensive roadmaps combining global tech standards with faculty guidance."
            )}
          </p>
        </div>
      </div>

      {/* Guest Mode Notification Banner */}
      {!user && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-sky-600/10 via-cyan-600/10 to-blue-500/10 border border-cyan-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
        >
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-50 flex flex-wrap items-center gap-2">
                <span>{t("مسارات التعلم مفتوحة للجميع","Open Career Roadmaps")}</span>
                <Badge className="bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-none text-[10px] font-bold">
                  {t("استكشف المهارات المطلوبة","Explore Skills")}
                </Badge>
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                {t("تصفح مسارات الواجهات الأمامية، الخلفية، والذكاء الاصطناعي بحرية. أنشئ حسابك لتتبع تقدمك وإتمام المهارات خطوة بخطوة.","Browse Frontend, Backend, and AI tracks freely. Create an account to track your progress and complete skills step-by-step."
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <Link href="/auth/login" className="flex-1 sm:flex-none">
              <Button size="sm" variant="outline" className="w-full sm:w-auto text-xs font-bold rounded-xl h-9">
                {t("تسجيل الدخول","Sign In")}
              </Button>
            </Link>
            <Link href="/auth/register" className="flex-1 sm:flex-none">
              <Button size="sm" className="w-full sm:w-auto text-xs font-bold rounded-xl h-9 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-md">
                {t("إنشاء حساب","Register")}
              </Button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setMode("global")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
            mode ==="global"
              ?"bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
              :"text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          }`}
        >
          <Globe className="h-4.5 w-4.5" />
          <span>{t(" خرائط التكنولوجيا العالمية (roadmap.sh)"," Global Tech Standards (roadmap.sh)")}</span>
        </button>

        <button
          onClick={() => setMode("faculty")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
            mode ==="faculty"
              ?"bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
              :"text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          }`}
        >
          <GraduationCap className="h-4.5 w-4.5" />
          <span>{t(" المسارات الأكاديمية للكلية"," Faculty Custom Roadmaps")}</span>
        </button>
      </div>

      {/* MODE 1: GLOBAL ROADMAP.SH INTEGRATION */}
      {mode ==="global" && (
        <div className="space-y-6">
          {/* Track Selector Horizontal Slider */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
            {ROADMAP_SH_TRACKS.map((track) => {
              const active = track.id === selectedGlobalTrackId;
              return (
                <button
                  key={track.id}
                  onClick={() => setSelectedGlobalTrackId(track.id)}
                  className={`px-4 py-3 rounded-2xl border text-right transition-all shrink-0 cursor-pointer flex items-center gap-3 min-w-[200px] sm:min-w-[220px] ${
                    active
                      ?"border-cyan-500 bg-cyan-500/10 text-zinc-900 dark:text-zinc-50 shadow-md ring-2 ring-cyan-500/30"
                      :"border-zinc-200/70 bg-white dark:border-zinc-800/70 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-850"
                  }`}
                >
                  <span className="text-2xl">{track.icon}</span>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 block">{track.category}</span>
                    <h4 className="text-xs font-black truncate">{t(track.titleAr, track.titleEn)}</h4>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Track Banner Card */}
          <Card className="border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-md p-4 sm:p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className={`h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br ${activeGlobalTrack.color} text-white flex items-center justify-center text-2xl sm:text-3xl shadow-lg shrink-0`}>
                  {activeGlobalTrack.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-50">
                      {t(activeGlobalTrack.titleAr, activeGlobalTrack.titleEn)}
                    </h2>
                    <Badge className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 text-[9px] sm:text-[10px] font-bold">
                      Standard roadmap.sh
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 sm:mt-1.5 max-w-2xl leading-relaxed">
                    {t(activeGlobalTrack.descAr, activeGlobalTrack.descEn)}
                  </p>
                </div>
              </div>

              <a
                href={activeGlobalTrack.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto shrink-0"
              >
                <Button size="lg" className="w-full sm:w-auto gap-2 text-xs font-black shadow-md bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white cursor-pointer rounded-2xl px-5 sm:px-6 h-11">
                  <span>{t(" فتح الخريطة التفاعلية بالكامل على roadmap.sh"," Open Full Interactive Roadmap on roadmap.sh")}</span>
                  <ExternalLink className="h-4 w-4 shrink-0" />
                </Button>
              </a>
            </div>

            {/* Key Topics Badges */}
            <div className="mt-5 pt-4 sm:mt-6 sm:pt-5 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-xs">
                <span className="text-[10px] sm:text-[11px] font-extrabold text-zinc-400 gap-1.5 flex items-center">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  {t("أهم المهارات والموضوعات المغطاة:","Key Skills & Topics Covered:")}
                </span>
                {activeGlobalTrack.keyTopics.map((topic, tIdx) => (
                  <Badge key={tIdx} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] sm:text-[11px] font-bold py-0.5 px-2.5 sm:py-1 sm:px-3 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50">
                    {topic}
                  </Badge>
                ))}
              </div>

              {/* Related Sub-Roadmaps */}
              {activeGlobalTrack.subRoadmaps && activeGlobalTrack.subRoadmaps.length > 0 && (
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-xs pt-2 border-t border-zinc-100/60 dark:border-zinc-850/60">
                  <span className="text-[10px] sm:text-[11px] font-extrabold text-cyan-600 dark:text-cyan-400 gap-1.5 flex items-center">
                    <Layers className="h-3.5 w-3.5" />
                    {t("الخرائط الفرعية والتخصصية المرتبطة:","Related Specialty Roadmaps:")}
                  </span>
                  {activeGlobalTrack.subRoadmaps.map((sub, sIdx) => (
                    <a key={sIdx} href={sub.url} target="_blank" rel="noopener noreferrer">
                      <Badge className="bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 text-[10px] sm:text-[11px] font-extrabold py-0.5 px-2.5 sm:py-1 sm:px-3 rounded-xl border border-cyan-300/40 dark:border-cyan-800/40 cursor-pointer transition-all flex items-center gap-1">
                        <span>{lang ==="ar" ? sub.nameAr : sub.nameEn}</span>
                        <ExternalLink className="h-3 w-3 opacity-70" />
                      </Badge>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Structured Interactive Track Stages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activeGlobalTrack.keyTopics.map((skill, sIdx) => (
              <Card key={sIdx} className="border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm p-5 flex flex-col justify-between hover:border-cyan-500/40 transition-all">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Badge className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-transparent text-[10px] font-bold">
                      {t("المرحلة","Stage")} {sIdx + 1}
                    </Badge>
                    <span className="text-[10px] font-bold text-zinc-400">roadmap.sh node</span>
                  </div>

                  <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>{skill}</span>
                  </h3>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {t(
                      `تعلّم أساسيات وتطبيقات ${skill} وفقاً لخرائط الطريق البرمجية الحديثة مع التطبيق العملي.`,
                      `Master core concepts and practical implementations of ${skill} based on modern industry standards.`
                    )}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-zinc-100 dark:border-zinc-850 flex items-center justify-between">
                  <a
                    href={activeGlobalTrack.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 flex items-center gap-1 transition-colors"
                  >
                    <span>{t("استكشف المصادر والمشاريع","Explore Resources & Projects")}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <span className="text-[10px] font-semibold text-zinc-400">roadmap.sh</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* MODE 2: FACULTY CUSTOM ROADMAPS */}
      {mode ==="faculty" && (
        <div className="space-y-8">
          {/* Select buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {roadmaps.map((r) => {
              const percentage = getRoadmapProgressPercentage(r.id, r.nodes.length);
              const roadmapTitle = lang ==="ar" ? r.title : (r.titleEn || r.title);
              return (
                <button
                  key={r.id}
                  onClick={() => setActiveFacultyRoadmapId(r.id)}
                  className={`p-4 rounded-2xl border ${isRtl ?"text-right" :"text-left"} transition-all cursor-pointer flex flex-col justify-between h-28 ${
                    activeFacultyRoadmapId === r.id
                      ?"border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:bg-cyan-950/20 dark:text-cyan-400 shadow-sm"
                      :"border-zinc-200/60 bg-white dark:border-zinc-800/60 dark:bg-zinc-900 text-zinc-700 hover:border-zinc-300 dark:text-zinc-300"
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 block mb-1">
                      {t("مسار كليّة مقترح","Suggested Faculty Path")}
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold line-clamp-1">{roadmapTitle}</span>
                  </div>
                  <div className="w-full mt-3">
                    <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mb-1">
                      <span>{t("نسبة الإكمال:","Completion:")}</span>
                      <span>{percentage}%</span>
                    </div>
                    <Progress value={percentage} className="h-1 bg-zinc-150 dark:bg-zinc-800" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Roadmap Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Vertical Timeline */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 shadow-sm">
                <CardHeader className="flex flex-row items-start justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 gap-4 space-y-0">
                  <div>
                    <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                      {lang ==="ar" ? currentFacultyRoadmap.title : (currentFacultyRoadmap.titleEn || currentFacultyRoadmap.title)}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1 text-zinc-500 dark:text-zinc-400">
                      {lang ==="ar" ? currentFacultyRoadmap.description : (currentFacultyRoadmap.descriptionEn || currentFacultyRoadmap.description)}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="pt-6 relative">
                  {/* Timeline Vertical Line */}
                  <div className={`absolute ${isRtl ?"right-9" :"left-9"} top-8 bottom-8 w-0.5 bg-zinc-100 dark:bg-zinc-800/80 pointer-events-none`} />

                  <div className="space-y-8">
                    {currentFacultyRoadmap.nodes.map((node, index) => {
                      const nodeCompleted = isRoadmapNodeCompleted(currentFacultyRoadmap.id, node.id);
                      const nodeLabel = lang ==="ar" ? node.label : (node.labelEn || node.label);
                      const nodeDesc = lang ==="ar" ? node.description : (node.descriptionEn || node.description);
                      const nodeDuration = lang ==="ar" ? node.duration : (node.durationEn || node.duration);

                      return (
                        <div key={node.id} className="flex gap-6 items-start relative z-10">
                          {/* Node Bullet Checkbox */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleNodeToggle(node.id);
                            }}
                            className={`h-7.5 w-7.5 rounded-full flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
                              nodeCompleted
                                ? "bg-emerald-600 border-emerald-600 text-white"
                                : "bg-white border-zinc-300 hover:border-cyan-500 text-transparent dark:bg-zinc-950 dark:border-zinc-800"
                            }`}
                          >
                            {nodeCompleted ? <CheckCircle2 className="h-4.5 w-4.5" /> : <div className="h-2 w-2 rounded-full bg-zinc-200 dark:bg-zinc-800" />}
                          </button>

                          {/* Node Details Card */}
                          <div className="flex-1 p-4.5 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-850/40 rounded-2xl space-y-3">
                            <div className="flex flex-wrap justify-between items-start gap-2.5">
                              <div>
                                <span className="text-[9px] font-bold text-cyan-600 dark:text-cyan-400 block">
                                  {t("المرحلة","Stage")} {index + 1}
                                </span>
                                <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">{nodeLabel}</h4>
                              </div>
                              <Badge variant="outline" className="text-[9px] py-0 font-bold">{nodeDuration}</Badge>
                            </div>

                            <p className="text-[11px] text-zinc-600 dark:text-zinc-350 leading-relaxed">
                              {nodeDesc}
                            </p>

                            {/* Connected university courses */}
                            {node.courseCodes && node.courseCodes.length > 0 && (
                              <div className="flex flex-wrap items-center gap-2 border-t border-zinc-200/60 dark:border-zinc-800/60 pt-3">
                                <span className="text-[9px] font-bold text-zinc-400">
                                  {t("مقررات مرتبطة في الكلية:","Related university courses:")}
                                </span>
                                {node.courseCodes.map((code) => (
                                  <Link href={`/courses/${code}`} key={code}>
                                    <Badge className="bg-zinc-200/60 text-zinc-700 hover:bg-cyan-100 hover:text-cyan-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-cyan-950/40 text-[8px] py-0 cursor-pointer font-mono">
                                      {code}
                                    </Badge>
                                  </Link>
                                ))}
                              </div>
                            )}

                            {/* Recommended study materials */}
                            <div className="space-y-1.5 pt-2">
                              <span className="text-[9px] font-bold text-zinc-400 block">
                                {t("مصادر مقترحة للتعلم:","Recommended learning resources:")}
                              </span>
                              <div className="space-y-1">
                                {node.resources.map((res, rIdx) => {
                                  const resTitle = lang ==="ar" ? res.title : (res.titleEn || res.title);
                                  return (
                                    <a
                                      key={rIdx}
                                      href={res.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-700 hover:text-cyan-600 dark:text-zinc-300 dark:hover:text-cyan-400 transition-colors"
                                    >
                                      <PlayCircle className="h-3.5 w-3.5 text-primary" />
                                      <span>{resTitle}</span>
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <Card className="border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 shadow-sm text-center">
                <CardContent className="pt-8 pb-6">
                  <h3 className="text-zinc-600 dark:text-zinc-400 font-bold text-sm">
                    {t("معدل تقدمك الإجمالي","Your Overall Progress")}
                  </h3>
                  <div className="text-5xl font-black text-cyan-600 dark:text-cyan-400 mt-4.5">
                    {facultyProgressPercentage}%
                  </div>
                  <Badge className="mt-3 bg-cyan-50 text-cyan-600 border-transparent text-xs py-1 px-3 dark:bg-cyan-950/40 dark:text-cyan-400 font-bold">
                    {facultyProgressPercentage === 100
                      ? t("مكتمل بالكامل","Fully Complete")
                      : facultyProgressPercentage >= 50
                      ? t("تقدم رائع","Great Progress")
                      : t("قيد البداية","Getting Started")}
                  </Badge>

                  <div className={`mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 ${isRtl ?"text-right" :"text-left"} space-y-4`}>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500 dark:text-zinc-400">
                        {t("مدة المسار الكلية:","Total Roadmap Duration:")}
                      </span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">
                        {lang ==="ar" ? currentFacultyRoadmap.duration : (currentFacultyRoadmap.durationEn || currentFacultyRoadmap.duration)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500 dark:text-zinc-400">
                        {t("المراحل المكتملة:","Completed Stages:")}
                      </span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">
                        {(currentFacultyRoadmap.nodes.filter(n => isRoadmapNodeCompleted(currentFacultyRoadmap.id, n.id))).length} {t("من","of")} {currentFacultyRoadmap.nodes.length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
