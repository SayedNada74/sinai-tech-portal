"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Building2, MapPin, Clock, ExternalLink, CalendarDays, DollarSign } from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Internship" | "Full-time" | "Part-time";
  mode: "Remote" | "On-site" | "Hybrid";
  salary: string;
  description: string;
  requirements: string[];
  postedAt: string;
  deadline: string;
  link: string;
}

const JOBS_DATA: Job[] = [
  {
    id: "job-1",
    title: "تدريب تطوير واجهات المستخدم (Frontend React Intern)",
    company: "Vodafone Egypt",
    location: "القاهرة, مصر",
    type: "Internship",
    mode: "Hybrid",
    salary: "مدفوع (Paid)",
    description: "فرصة رائعة لطلاب تكنولوجيا المعلومات للتدرب على بناء واجهات مستخدم باستخدام React و Next.js تحت إشراف مهندسين خبراء.",
    requirements: ["HTML/CSS/JS", "أساسيات React", "شغف للتعلم"],
    postedAt: "منذ يومين",
    deadline: "2026-09-01",
    link: "#"
  },
  {
    id: "job-2",
    title: "مطور خلفية مبتدئ (Junior Backend Node.js)",
    company: "Fawry",
    location: "القرية الذكية, الجيزة",
    type: "Full-time",
    mode: "On-site",
    salary: "تنافسي",
    description: "نبحث عن خريجين جدد لبناء وتطوير أنظمة الدفع الإلكتروني باستخدام Node.js و PostgreSQL.",
    requirements: ["Node.js", "SQL", "فهم REST APIs"],
    postedAt: "منذ أسبوع",
    deadline: "2026-08-30",
    link: "#"
  },
  {
    id: "job-3",
    title: "تدريب أمن معلومات (Cybersecurity Intern)",
    company: "Orange Business Services",
    location: "مدينة نصر, القاهرة",
    type: "Internship",
    mode: "On-site",
    salary: "غير مدفوع (شهادة وتدريب)",
    description: "تدريب عملي على فحص الثغرات الأمنية وتأمين الشبكات. فرصة عظيمة للحصول على خبرة عملية في سوق العمل.",
    requirements: ["أساسيات الشبكات", "Linux", "معرفة بأساسيات الأمن السيبراني"],
    postedAt: "منذ 3 أيام",
    deadline: "2026-09-15",
    link: "#"
  },
  {
    id: "job-4",
    title: "مطور تطبيقات هواتف (Flutter Developer Intern)",
    company: "Swvl",
    location: "دبي / عن بعد",
    type: "Internship",
    mode: "Remote",
    salary: "300$ / شهر",
    description: "تدريب عن بعد لتطوير تطبيقات الهواتف الذكية باستخدام Flutter.",
    requirements: ["Dart", "أساسيات Flutter", "العمل مع APIs"],
    postedAt: "اليوم",
    deadline: "2026-08-25",
    link: "#"
  },
  {
    id: "job-5",
    title: "محلل بيانات مبتدئ (Junior Data Analyst)",
    company: "Talabat",
    location: "المعادي, القاهرة",
    type: "Full-time",
    mode: "Hybrid",
    salary: "حسب الخبرة",
    description: "تحليل بيانات سلوك المستخدمين واستخراج رؤى لتحسين خدمة توصيل الطلبات.",
    requirements: ["Python (Pandas/NumPy)", "SQL", "PowerBI / Tableau"],
    postedAt: "منذ أسبوعين",
    deadline: "2026-08-20",
    link: "#"
  },
  {
    id: "job-6",
    title: "تدريب مهندس سحابة (Cloud Computing Intern)",
    company: "AWS Egypt (Amazon)",
    location: "القاهرة الجديدة",
    type: "Internship",
    mode: "Hybrid",
    salary: "مدفوع (Paid)",
    description: "برنامج تدريبي لطلاب الفرقة الثالثة والرابعة للتعرف على خدمات AWS وإدارة البنية التحتية.",
    requirements: ["أساسيات الحوسبة السحابية", "فهم الشبكات", "AWS Academy (ميزة إضافية)"],
    postedAt: "منذ 5 أيام",
    deadline: "2026-09-10",
    link: "#"
  },
  {
    id: "job-7",
    title: "متخصص ضمان الجودة (QA Testing Intern)",
    company: "Instabug",
    location: "المعادي, القاهرة",
    type: "Internship",
    mode: "On-site",
    salary: "مكافأة شهرية",
    description: "تدريب على اختبار البرمجيات وكتابة سيناريوهات الاختبار اليدوي والآلي.",
    requirements: ["الانتباه للتفاصيل", "معرفة بأساسيات Testing", "مهارات تواصل ممتازة"],
    postedAt: "منذ 4 أيام",
    deadline: "2026-08-28",
    link: "#"
  },
  {
    id: "job-8",
    title: "مطور ذكاء اصطناعي (AI/ML Engineer Fresher)",
    company: "Valeo Egypt",
    location: "القرية الذكية, الجيزة",
    type: "Full-time",
    mode: "On-site",
    salary: "مجزي",
    description: "العمل على تطوير أنظمة القيادة الذاتية ومعالجة الصور باستخدام التعلم العميق.",
    requirements: ["Python", "TensorFlow / PyTorch", "رياضيات وإحصاء"],
    postedAt: "منذ أسبوع",
    deadline: "2026-09-05",
    link: "#"
  },
  {
    id: "job-9",
    title: "تدريب تصميم واجهات وتجربة المستخدم (UI/UX Intern)",
    company: "ITWorx",
    location: "مدينة نصر, القاهرة",
    type: "Internship",
    mode: "Remote",
    salary: "غير مدفوع",
    description: "فرصة لتطبيق دراستك الأكاديمية على مشاريع حقيقية باستخدام Figma وبناء نماذج أولية.",
    requirements: ["Figma", "معرفة بأساسيات التصميم", "ملف أعمال (Portfolio)"],
    postedAt: "أمس",
    deadline: "2026-09-20",
    link: "#"
  },
  {
    id: "job-10",
    title: "مهندس شبكات مبتدئ (Junior Network Engineer)",
    company: "Telecom Egypt (WE)",
    location: "المهندسين, الجيزة",
    type: "Full-time",
    mode: "On-site",
    salary: "تنافسي",
    description: "متابعة وإدارة البنية التحتية لشبكات الإنترنت وتقديم الدعم الفني المتقدم للمؤسسات.",
    requirements: ["CCNA", "معرفة بروتوكولات التوجيه", "استكشاف الأخطاء وإصلاحها"],
    postedAt: "منذ 6 أيام",
    deadline: "2026-08-30",
    link: "#"
  }
];

export default function JobsPage() {
  return (
    <div className="container px-4 sm:px-6 py-6 sm:py-8 max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-l from-primary to-blue-600">
            الوظائف والتدريبات (Jobs & Internships)
          </h1>
          <p className="text-muted-foreground mt-2">
            فرص حصرية للتدريب الصيفي والتوظيف لخريجي وطلاب الجامعة في كبرى شركات التكنولوجيا.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {JOBS_DATA.map((job) => (
          <Card key={job.id} className="group overflow-hidden border-zinc-200/50 dark:border-zinc-800/50 hover:shadow-md transition-all duration-300">
            <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/20 pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={job.type === "Internship" ? "default" : "secondary"} className={job.type === "Internship" ? "bg-blue-600 hover:bg-blue-700" : ""}>
                      {job.type}
                    </Badge>
                    <Badge variant="outline" className="bg-white dark:bg-zinc-950">
                      {job.mode}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {job.title}
                  </CardTitle>
                </div>
                <Button className="hidden sm:flex shrink-0">
                  التقديم الآن
                  <ExternalLink className="mr-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-x-6 gap-y-3 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary/70" />
                  <span className="font-medium text-foreground/90">{job.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary/70" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">{job.salary}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary/70" />
                  <span>نُشر {job.postedAt}</span>
                </div>
              </div>

              <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                {job.description}
              </p>

              <div>
                <h4 className="font-semibold text-sm mb-3">المتطلبات الأساسية:</h4>
                <div className="flex flex-wrap gap-2">
                  {job.requirements.map((req, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-zinc-50/50 dark:bg-zinc-900/20 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-red-600 dark:text-red-400">
                <CalendarDays className="h-4 w-4 shrink-0" />
                <span>ينتهي التقديم في: {job.deadline}</span>
              </div>
              <Button className="w-full sm:hidden">
                التقديم الآن
                <ExternalLink className="mr-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
