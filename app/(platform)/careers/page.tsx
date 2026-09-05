"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { useAuth } from "@/context/auth-context";
import { useAdmin } from "@/context/admin-context";
import { useSocial, CareerOpportunity } from "@/context/social-context";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from"@/components/ui/card";
import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import { Badge } from"@/components/ui/badge";
import {
  Briefcase,
  MapPin,
  Building2,
  Bookmark,
  BookmarkCheck,
  Search,
  ExternalLink,
  SlidersHorizontal,
  ChevronDown,
  Award,
  Clock,
  Globe,
  ShieldCheck,
  Layers,
  GraduationCap,
  Cpu,
  Laptop,
  Cloud
} from"lucide-react";
import { motion, AnimatePresence } from"framer-motion";

export interface FreeCertificateItem {
  id: string;
  titleAr: string;
  titleEn: string;
  provider: string;
  category: "ai_data" | "web_software" | "cybersecurity_networks" | "cloud_tech";
  categoryAr: string;
  categoryEn: string;
  duration: string;
  language: string;
  descAr: string;
  descEn: string;
  skills: string[];
  link: string;
}

export const FREE_CERTIFICATES: FreeCertificateItem[] = [
  {
    id: "cert-1",
    titleAr: "شهادة أساسيات الذكاء الاصطناعي التوليدي",
    titleEn: "Generative AI Fundamentals Certificate",
    provider: "MaharaTech (ITI - معهد تكنولوجيا المعلومات)",
    category: "ai_data",
    categoryAr: "الذكاء الاصطناعي وعلوم البيانات",
    categoryEn: "AI & Data Science",
    duration: "15 ساعة تدريبية",
    language: "العربية / الإنجليزية",
    descAr: "تمنحك الشهادة فهمًا عمليًا لبناء ونشر نماذج الذكاء الاصطناعي التوليدي، مع التعامل مع الهندسة الفورية (Prompt Engineering) وتطبيقات الـ Large Language Models (LLMs).",
    descEn: "Provides practical hands-on understanding of building Generative AI applications and Prompt Engineering.",
    skills: ["Prompt Engineering", "Generative AI", "LLMs", "Python"],
    link: "https://maharatech.gov.eg/course/index.php?categoryid=40"
  },
  {
    id: "cert-2",
    titleAr: "شهادة تحليل البيانات المعتمدة من جوجل",
    titleEn: "Google Data Analytics Professional Certificate",
    provider: "Google (عبر Coursera - مع دعم مالي مجاني 100%)",
    category: "ai_data",
    categoryAr: "الذكاء الاصطناعي وعلوم البيانات",
    categoryEn: "AI & Data Science",
    duration: "180 ساعة (مرنة)",
    language: "الإنجليزية (مترجمة للعربية)",
    descAr: "شهادة احترافية من Google تؤهلك للعمل كمحلل بيانات. تشمل تنظيف البيانات تحليلها باستخدام SQL و R و Tableau وإعداد التقارير التفاعلية.",
    descEn: "Official Google certificate equipping you with SQL, R programming, Tableau visualization, and data cleaning skills.",
    skills: ["SQL", "R Language", "Tableau", "Data Analysis", "Spreadsheets"],
    link: "https://www.coursera.org/professional-certificates/google-data-analytics"
  },
  {
    id: "cert-3",
    titleAr: "شهادة تعلّم الآلة وتجهيز البيانات بالـ Python",
    titleEn: "Python & Machine Learning Certificate",
    provider: "Kaggle Learn (Google)",
    category: "ai_data",
    categoryAr: "الذكاء الاصطناعي وعلوم البيانات",
    categoryEn: "AI & Data Science",
    duration: "10 ساعات عمليّة",
    language: "الإنجليزية",
    descAr: "شهادة معتمدة فورية من مجتمع Kaggle العالمي تضمن إتقان مكتبات Pandas و Scikit-Learn لبناء نماذج التنبؤ وتخفيض أبعاد البيانات.",
    descEn: "Hands-on certificate for mastering Pandas, Scikit-Learn, and building predictive Machine Learning models.",
    skills: ["Pandas", "Scikit-Learn", "Machine Learning", "Data Visualization"],
    link: "https://www.kaggle.com/learn/python"
  },
  {
    id: "cert-4",
    titleAr: "شهادة تعلم الآلة والعميق IBM Cognitive Class",
    titleEn: "IBM Deep Learning & AI Digital Badge Certificate",
    provider: "Cognitive Class by IBM",
    category: "ai_data",
    categoryAr: "الذكاء الاصطناعي وعلوم البيانات",
    categoryEn: "AI & Data Science",
    duration: "25 ساعة تدريبية",
    language: "الإنجليزية",
    descAr: "تمنحك شارات رقمية موثقة على منصة Credly العالمية من شركة IBM في مجالات الـ Neural Networks وتطبيقات TensorFlow و PyTorch.",
    descEn: "Earn official IBM Credly digital badges in Neural Networks, TensorFlow, and PyTorch applications.",
    skills: ["TensorFlow", "PyTorch", "Deep Learning", "Neural Networks"],
    link: "https://cognitiveclass.ai/courses/deep-learning-with-tensorflow"
  },
  {
    id: "cert-5",
    titleAr: "شهادة علوم الحاسب والبرمجة الرسمية CS50x",
    titleEn: "Harvard CS50x Computer Science Certificate",
    provider: "Harvard University (جامعة هارفارد)",
    category: "web_software",
    categoryAr: "تطوير الويب والبرمجيات",
    categoryEn: "Web & Software Dev",
    duration: "120 ساعة مكثفة",
    language: "الإنجليزية (مترجمة للعربية)",
    descAr: "أشهر شهادة علوم حاسب في العالم مجاناً من هارفارد! تمنحك إتقان خوارزميات الـ C و Python وبناء تطبيقات الويب والهياكل البرمجية المتقدمة.",
    descEn: "World-renowned Harvard CS certificate covering algorithms, C, Python, SQL, and Web Development fundamentals.",
    skills: ["C Programming", "Python", "Algorithms", "Data Structures", "SQL"],
    link: "https://cs50.harvard.edu/x/"
  },
  {
    id: "cert-6",
    titleAr: "شهادة تطوير واجهات الويب والشاشات Responsive Web Design",
    titleEn: "Responsive Web Design Developer Certificate (300 Hours)",
    provider: "FreeCodeCamp",
    category: "web_software",
    categoryAr: "تطوير الويب والبرمجيات",
    categoryEn: "Web & Software Dev",
    duration: "300 ساعة تطبيقية",
    language: "الإنجليزية / العربية",
    descAr: "شهادة عمليّة 100% تتطلب بناء 5 مشاريع مواقع حقيقية واجتياز اختبارات HTML5, CSS3, Flexbox, Grid وبناء تصميمات متجاوبة مع الموبايل.",
    descEn: "Comprehensive 300-hour verified certificate requiring building 5 real projects using HTML5, CSS3, Flexbox, and Grid.",
    skills: ["HTML5", "CSS3", "Flexbox", "CSS Grid", "Responsive Design"],
    link: "https://www.freecodecamp.org/learn/2022/responsive-web-design/"
  },
  {
    id: "cert-7",
    titleAr: "شهادة مطور الويب MERN Stack من مهارة تك",
    titleEn: "MaharaTech Full-Stack MERN Web Certificate",
    provider: "MaharaTech (ITI)",
    category: "web_software",
    categoryAr: "تطوير الويب والبرمجيات",
    categoryEn: "Web & Software Dev",
    duration: "60 ساعة تدريبية",
    language: "العربية / الإنجليزية",
    descAr: "شهادة معتمدة من معهد ITI في بناء تطبيقات الويب المتكاملة باستخدام React.js وخوادم Node.js وقواعد بيانات MongoDB.",
    descEn: "Verified ITI certificate for building full-stack web applications with React.js, Node.js, and MongoDB.",
    skills: ["React.js", "Node.js", "Express.js", "MongoDB", "REST APIs"],
    link: "https://maharatech.gov.eg/course/index.php?categoryid=11"
  },
  {
    id: "cert-8",
    titleAr: "شهادة أساسيات الأمن السيبراني Cisco Cybersecurity Essentials",
    titleEn: "Cisco Cybersecurity Essentials Badge & Certificate",
    provider: "Cisco Networking Academy",
    category: "cybersecurity_networks",
    categoryAr: "الأمن السيبراني والشبكات",
    categoryEn: "Cybersecurity & Networks",
    duration: "30 ساعة تدريبية",
    language: "العربية / الإنجليزية",
    descAr: "شهادة وشارة معتمدة رسمياً من شركة Cisco تمنحك إتقان التشفير، الدفاع عن الشبكات الأكاديمية، والتعامل مع الثغرات الأمنية والـ Firewalls.",
    descEn: "Official Cisco certificate and digital badge covering cryptography, network defense, Firewalls, and threat management.",
    skills: ["Network Security", "Cryptography", "Firewalls", "Threat Defense"],
    link: "https://www.netacad.com/courses/cybersecurity/cybersecurity-essentials"
  },
  {
    id: "cert-9",
    titleAr: "شهادة البرمجة بلغة بايثون للشبكات Cisco Python Essentials",
    titleEn: "Cisco Certified Python Essentials",
    provider: "Cisco Networking Academy",
    category: "cybersecurity_networks",
    categoryAr: "الأمن السيبراني والشبكات",
    categoryEn: "Cybersecurity & Networks",
    duration: "40 ساعة تدريبية",
    language: "الإنجليزية",
    descAr: "شهادة معتمدة من Cisco في استخدام Python لأتمتة فحص الشبكات وبناء أدوات الأمان وفحص المنافذ والحزم الأكاديمية.",
    descEn: "Official Cisco certificate for Python programming focused on network automation and security scripting.",
    skills: ["Python Scripting", "Network Automation", "Socket Programming", "OOP"],
    link: "https://www.netacad.com/courses/programming/pcap-programming-essentials-python"
  },
  {
    id: "cert-10",
    titleAr: "شهادة أساسيات الحوسبة السحابية Azure Fundamentals AZ-900",
    titleEn: "Microsoft Azure Cloud Fundamentals Learning Certificate",
    provider: "Microsoft Learn",
    category: "cloud_tech",
    categoryAr: "الحوسبة السحابية والإدارة",
    categoryEn: "Cloud & Tech Management",
    duration: "20 ساعة تدريبية",
    language: "العربية / الإنجليزية",
    descAr: "شهادة ومسار تعلم رسمي مجاني من مايكروسوفت للتأهل لاختبار AZ-900 وفهم الخدمات السحابية والأمان والأجهزة الافتراضية Virtual Machines.",
    descEn: "Official Microsoft learning path preparing you for Azure AZ-900 cloud architecture, security, and virtual machines.",
    skills: ["Azure Cloud", "Cloud Computing", "Virtual Machines", "Cloud Security"],
    link: "https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/"
  },
  {
    id: "cert-11",
    titleAr: "شهادة إدارة المشاريع التقنية الاحترافية من جوجل",
    titleEn: "Google Project Management Professional Certificate",
    provider: "Google (عبر Coursera - دعم مالي 100%)",
    category: "cloud_tech",
    categoryAr: "الحوسبة السحابية والإدارة",
    categoryEn: "Cloud & Tech Management",
    duration: "140 ساعة (مرنة)",
    language: "الإسبانية / الإنجليزية (مترجمة للعربية)",
    descAr: "شهادة احترافية معتمدة من جوجل في إدارة الفرق والأنظمة البرمجية باستخدام منهجية الإدارات المرنة Agile والـ Scrum وبناء الخطط الموثوقة.",
    descEn: "Google certified credential covering Agile project management, Scrum framework, documentation, and team leadership.",
    skills: ["Agile Management", "Scrum", "Project Planning", "Documentation", "Risk Management"],
    link: "https://www.coursera.org/professional-certificates/google-project-management"
  }
];

export default function CareersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { settings } = useAdmin();
  const { t, lang, dir } = useApp();
  const { careers, freeCertificates, toggleSaveJob, isJobSaved } = useSocial();

  const isAdmin = user?.role === "admin" || user?.role === "super-admin" || user?.role === "moderator";
  const careersStatus = settings?.featureAccess?.careers || "ALL";

  React.useEffect(() => {
    if (careersStatus === "DISABLED" || (careersStatus === "ADMIN_ONLY" && !isAdmin)) {
      router.replace("/dashboard");
    }
  }, [careersStatus, isAdmin, router]);

  const [search, setSearch] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<string>("all");
  const [selectedExp, setSelectedExp] = React.useState<string>("all");
  const [selectedDept, setSelectedDept] = React.useState<string>("all");
  const [showFilters, setShowFilters] = React.useState(false);

  const typesArabic: Record<string, { ar: string; en: string }> = {
    all: { ar:"كل الفرص", en:"All Opportunities" },
    internship: { ar:"تدريب عملي", en:"Internship" },
    remote: { ar:"وظيفة عن بعد", en:"Remote Job" },"part-time": { ar:"دوام جزئي", en:"Part-Time" },
    freelance: { ar:"عمل حر", en:"Freelance" },
    graduate: { ar:"برامج خريجين", en:"Graduate Program" },
    competition: { ar:"مسابقات وتحديات", en:"Competition" },
    hackathon: { ar:"هاكاثون", en:"Hackathon" },
    scholarship: { ar:"منح دراسية", en:"Scholarship" },
    training: { ar:"برامج تدريبية", en:"Training Program" }
  };

  const experienceArabic: Record<string, { ar: string; en: string }> = {
    all: { ar:"جميع المستويات", en:"All Levels" },
    entry: { ar:"مبتدئ (Entry)", en:"Entry Level" },
    mid: { ar:"متوسط (Mid)", en:"Mid Level" },
    senior: { ar:"متقدم (Senior)", en:"Senior Level" }
  };

  const deptsArabic: Record<string, { ar: string; en: string }> = {
    all: { ar:"كل الأقسام", en:"All Departments" },
    IT: { ar:"تكنولوجيا المعلومات (IT)", en:"Information Technology (IT)" },
    CS: { ar:"علوم الحاسب (CS)", en:"Computer Science (CS)" },
    IS: { ar:"نظم المعلومات (IS)", en:"Information Systems (IS)" }
  };

  const [activeTab, setActiveTab] = React.useState<"jobs" | "certificates">("jobs");
  const [certCatFilter, setCertCatFilter] = React.useState<string>("all");

  const filteredCareers = careers.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase());

    const matchesType = selectedType ==="all" || job.type === selectedType;
    const matchesExp = selectedExp ==="all" || job.experience === selectedExp;
    const matchesDept = selectedDept ==="all" || job.department === selectedDept || job.department ==="all";

    return matchesSearch && matchesType && matchesExp && matchesDept;
  });

  const activeCerts = (freeCertificates && freeCertificates.length > 0) ? freeCertificates : FREE_CERTIFICATES;

  const filteredCertificates = React.useMemo(() => {
    return activeCerts.filter((cert) => {
      const matchesCat = certCatFilter === "all" || cert.category === certCatFilter;
      const query = search.toLowerCase().trim();
      const matchesSearch =
        !query ||
        cert.titleAr.toLowerCase().includes(query) ||
        cert.titleEn.toLowerCase().includes(query) ||
        cert.provider.toLowerCase().includes(query) ||
        cert.descAr.toLowerCase().includes(query) ||
        cert.skills.some((s) => s.toLowerCase().includes(query));

      return matchesCat && matchesSearch;
    });
  }, [activeCerts, certCatFilter, search]);

  const isRtl = dir ==="rtl";

  if (careersStatus === "DISABLED" || (careersStatus === "ADMIN_ONLY" && !isAdmin)) {
    return null;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto" dir={dir}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-950 dark:text-zinc-50 flex items-center gap-2.5">
            <Briefcase className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
            {t("بوابة التدريب والتوظيف الأكاديمي","Academic Internship & Careers Portal")}
          </h1>
          <p className="text-sm text-zinc-550 dark:text-zinc-400 mt-1">
            {t("اكتشف فرص التدريب الصيفي، الوظائف، المنح والهاكاثونات الموجهة لطلاب الحاسبات وتقنية المعلومات.","Discover summer internships, job openings, scholarships, and hackathons for IT students."
            )}
          </p>
        </div>
      </div>

      {/* Navigation Tabs Switcher */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-3 sm:gap-6 overflow-x-auto scrollbar-none pb-0">
        <button
          onClick={() => setActiveTab("jobs")}
          className={`pb-3 text-sm font-black flex items-center gap-2 transition-colors relative cursor-pointer shrink-0 ${
            activeTab === "jobs"
              ? "text-sky-600 dark:text-sky-400"
              : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          <Briefcase className="h-4 w-4" />
          <span>{t("فرص التوظيف والتدريبات المباشرة (2026)", "Live Jobs & Internships (2026)")}</span>
          <Badge className="bg-sky-500 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full">
            {careers.length}
          </Badge>
          {activeTab === "jobs" && (
            <motion.div
              layoutId="activeTabUnderline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded-full"
            />
          )}
        </button>

        <button
          onClick={() => setActiveTab("certificates")}
          className={`pb-3 text-sm font-black flex items-center gap-2 transition-colors relative cursor-pointer shrink-0 ${
            activeTab === "certificates"
              ? "text-sky-600 dark:text-sky-400"
              : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          <Award className="h-4 w-4 text-sky-500" />
          <span>{t("دليل المنصات والشهادات المجانية المعتمدة", "Free Verified Certificates Hub")}</span>
          <Badge className="bg-sky-500 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full">
            {FREE_CERTIFICATES.length}
          </Badge>
          {activeTab === "certificates" && (
            <motion.div
              layoutId="activeTabUnderline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500 rounded-full"
            />
          )}
        </button>
      </div>

      {activeTab === "jobs" ? (
        <>
          {/* Search and Filters Bar */}
          <Card className="border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm">
            <CardContent className="p-4 md:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className={`absolute ${isRtl ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-400`} />
                  <Input
                    type="text"
                    placeholder={t("ابحث عن المسمى الوظيفي، الشركة، الكلمات المفتاحية...", "Search job title, company, keywords...")}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={isRtl ? "pr-10" : "pl-10"}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 h-11 shrink-0 px-5 border-zinc-200/60 dark:border-zinc-800/60 cursor-pointer"
                >
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                  <span>{t("تصفية متقدمة", "Advanced Filter")}</span>
                  <ChevronDown className={`h-3 w-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                </Button>
              </div>

              {/* Advanced filters dropdown */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3.5 border-t border-zinc-100 dark:border-zinc-800"
                  >
                    {/* Type Filter */}
                    <div className={`space-y-1.5 ${isRtl ? "text-right" : "text-left"}`}>
                      <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
                        {t("نوع الفرصة", "Opportunity Type")}
                      </label>
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-850 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 cursor-pointer"
                      >
                        {Object.entries(typesArabic).map(([k, v]) => (
                          <option key={k} value={k}>{t(v.ar, v.en)}</option>
                        ))}
                      </select>
                    </div>

                    {/* Experience Level Filter */}
                    <div className={`space-y-1.5 ${isRtl ? "text-right" : "text-left"}`}>
                      <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
                        {t("مستوى الخبرة", "Experience Level")}
                      </label>
                      <select
                        value={selectedExp}
                        onChange={(e) => setSelectedExp(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-855 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 cursor-pointer"
                      >
                        {Object.entries(experienceArabic).map(([k, v]) => (
                          <option key={k} value={k}>{t(v.ar, v.en)}</option>
                        ))}
                      </select>
                    </div>

                    {/* Department Filter */}
                    <div className={`space-y-1.5 ${isRtl ? "text-right" : "text-left"}`}>
                      <label className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
                        {t("التخصص / القسم", "Major / Department")}
                      </label>
                      <select
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                        className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-855 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 cursor-pointer"
                      >
                        {Object.entries(deptsArabic).map(([k, v]) => (
                          <option key={k} value={k}>{t(v.ar, v.en)}</option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Jobs List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredCareers.length > 0 ? (
                filteredCareers.map((job, idx) => {
                  const saved = isJobSaved(job.id);
                  return (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                    >
                      <Card className="h-full border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className={`absolute top-0 ${isRtl ? "right-0" : "left-0"} bottom-0 w-1 bg-sky-600/80 group-hover:bg-sky-600 transition-colors`} />

                        <CardHeader className={`pb-3 ${isRtl ? "text-right" : "text-left"}`}>
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1.5">
                              <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400 text-[10px] px-2.5 py-0.5 rounded-md font-bold">
                                {typesArabic[job.type] ? t(typesArabic[job.type].ar, typesArabic[job.type].en) : job.type}
                              </Badge>
                              <CardTitle className="text-base font-extrabold text-zinc-950 dark:text-zinc-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors mt-2">
                                {job.title}
                              </CardTitle>
                            </div>
                            
                            <button
                              onClick={() => toggleSaveJob(job.id)}
                              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                saved
                                  ? "bg-sky-50 border-sky-200 text-sky-600 dark:bg-sky-950/40 dark:border-sky-850 dark:text-sky-400"
                                  : "bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-400 dark:bg-zinc-950 dark:border-zinc-800 dark:hover:bg-zinc-850"
                              }`}
                              title={saved ? t("إزالة من المحفوظات", "Remove Bookmark") : t("حفظ الفرصة", "Bookmark Opportunity")}
                            >
                              {saved ? <BookmarkCheck className="h-4.5 w-4.5" /> : <Bookmark className="h-4.5 w-4.5" />}
                            </button>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-550 dark:text-zinc-400 mt-3 font-semibold">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3.5 w-3.5 text-primary" />
                              {job.company}
                            </span>
                            <span className="text-zinc-350 dark:text-zinc-700">|</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-primary" />
                              {job.location}
                            </span>
                          </div>
                        </CardHeader>

                        <CardContent className={`space-y-4 pt-0 ${isRtl ? "text-right" : "text-left"} flex-1 flex flex-col justify-between`}>
                          <p className="text-xs text-zinc-650 dark:text-zinc-350 leading-relaxed line-clamp-3">
                            {job.description}
                          </p>

                          <div className="space-y-4 mt-4">
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-850">
                              <span className="text-[10px] font-bold px-2 py-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800 rounded-md text-zinc-600 dark:text-zinc-400">
                                {experienceArabic[job.experience] ? t(experienceArabic[job.experience].ar, experienceArabic[job.experience].en) : job.experience}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800 rounded-md text-zinc-600 dark:text-zinc-400">
                                {deptsArabic[job.department] ? t(deptsArabic[job.department].ar, deptsArabic[job.department].en) : job.department}
                              </span>
                              <span className={`text-[10px] text-zinc-400 dark:text-zinc-500 ${isRtl ? "mr-auto" : "ml-auto"} mt-1`}>
                                {t(`أضيف في: ${job.dateAdded}`, `Added: ${job.dateAdded}`)}
                              </span>
                            </div>

                            <a
                              href={job.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block w-full"
                            >
                              <Button className="w-full flex items-center justify-center gap-2 text-xs font-bold shadow-sm cursor-pointer" variant="secondary">
                                <span>{t("التقديم على الفرصة", "Apply for Position")}</span>
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Button>
                            </a>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/60 rounded-3xl space-y-4">
                  <Briefcase className="h-12 w-12 mx-auto text-primary" />
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-zinc-950 dark:text-zinc-50">
                      {t("لا توجد نتائج مطابقة", "No matching results")}
                    </h3>
                    <p className="text-xs text-zinc-450 dark:text-zinc-500">
                      {t("جرب تعديل الكلمات الدلالية أو الفلاتر للعثور على فرص ملائمة.", "Try adjusting your search terms or filters to find opportunities.")}
                    </p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </>
      ) : (
        <>
          {/* Certificates Search & Category Filter Bar */}
          <Card className="border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm">
            <CardContent className="p-4 md:p-5 space-y-4">
              <div className="relative">
                <Search className={`absolute ${isRtl ? "right-3.5" : "left-3.5"} top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-400`} />
                <Input
                  type="text"
                  placeholder={t("ابحث في الشهادات والمنصات المجانية (مثال: Google, Python, Cisco, CS50...)", "Search free certificates (e.g. Google, Python, Cisco, CS50...)")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={isRtl ? "pr-10 bg-white dark:bg-zinc-950" : "pl-10 bg-white dark:bg-zinc-950"}
                />
              </div>

              {/* Category Badges Filter */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { id: "all", labelAr: "كل التخصصات", labelEn: "All Domains" },
                  { id: "ai_data", labelAr: "الذكاء الاصطناعي وعلوم البيانات", labelEn: "AI & Data Science" },
                  { id: "web_software", labelAr: "تطوير الويب والبرمجيات", labelEn: "Web & Software Dev" },
                  { id: "cybersecurity_networks", labelAr: "الأمن السيبراني والشبكات", labelEn: "Cybersecurity & Networks" },
                  { id: "cloud_tech", labelAr: "الحوسبة السحابية والإدارة", labelEn: "Cloud & Management" }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCertCatFilter(cat.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      certCatFilter === cat.id
                        ? "bg-sky-600 text-white shadow-sm"
                        : "bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-800 hover:border-sky-500"
                    }`}
                  >
                    {t(cat.labelAr, cat.labelEn)}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Free Certificates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredCertificates.length > 0 ? (
                filteredCertificates.map((cert, idx) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                  >
                    <Card className="h-full border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
                      <div className={`absolute top-0 ${isRtl ? "right-0" : "left-0"} bottom-0 w-1 bg-sky-600/80 group-hover:bg-sky-600 transition-colors`} />

                      <CardHeader className={`pb-3 ${isRtl ? "text-right" : "text-left"}`}>
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1.5">
                            <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400 text-[10px] px-2.5 py-0.5 rounded-md font-bold">
                              {cert.provider}
                            </Badge>
                            <CardTitle className="text-base font-extrabold text-zinc-950 dark:text-zinc-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors mt-2">
                              {t(cert.titleAr, cert.titleEn)}
                            </CardTitle>
                          </div>
                          
                          <Badge variant="outline" className="text-[9px] font-bold border-zinc-200/60 dark:border-zinc-800 text-zinc-500 shrink-0">
                            {cert.categoryAr}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-550 dark:text-zinc-400 mt-3 font-semibold">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            {cert.duration}
                          </span>
                          <span className="text-zinc-350 dark:text-zinc-700">|</span>
                          <span className="flex items-center gap-1">
                            <Globe className="h-3.5 w-3.5 text-primary" />
                            {cert.language}
                          </span>
                        </div>
                      </CardHeader>

                      <CardContent className={`space-y-4 pt-0 ${isRtl ? "text-right" : "text-left"} flex-1 flex flex-col justify-between`}>
                        <p className="text-xs text-zinc-650 dark:text-zinc-350 leading-relaxed line-clamp-3">
                          {t(cert.descAr, cert.descEn)}
                        </p>

                        <div className="space-y-4 mt-4">
                          <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-850">
                            {cert.skills.map((skill) => (
                              <span
                                key={skill}
                                className="text-[10px] font-bold px-2 py-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800 rounded-md text-zinc-600 dark:text-zinc-400"
                              >
                                #{skill}
                              </span>
                            ))}
                          </div>

                          <a
                            href={cert.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full"
                          >
                            <Button className="w-full flex items-center justify-center gap-2 text-xs font-bold shadow-sm cursor-pointer" variant="secondary">
                              <span>{t("الانتقال لبدء الكورس والشهادة المجانية", "Start Free Certified Course")}</span>
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Button>
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/60 rounded-3xl space-y-4">
                  <Award className="h-12 w-12 mx-auto text-primary" />
                  <div className="space-y-1">
                    <h3 className="text-base font-extrabold text-zinc-950 dark:text-zinc-50">
                      {t("لا توجد نتائج مطابقة", "No matching certificates")}
                    </h3>
                    <p className="text-xs text-zinc-450 dark:text-zinc-500">
                      {t("جرب اختيار تخصص آخر أو تعديل كلمة البحث.", "Try choosing another domain or modifying your search.")}
                    </p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}
