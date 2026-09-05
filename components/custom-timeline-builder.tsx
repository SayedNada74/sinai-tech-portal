"use client";

import * as React from "react";
import { useApp } from "@/context/app-context";
import { useAcademic, GRADE_POINTS, GRADE_OPTIONS } from "@/context/academic-context";
import { useAdmin } from "@/context/admin-context";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GradeSelect } from "@/components/ui/grade-select";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import {
  Calendar,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Save,
  RotateCcw,
  Sun,
  ShieldAlert,
  GraduationCap,
  Lock,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/toast";
import {
  CustomSemesterData,
  CustomSemesterCourse,
  generateStudentSemesters,
  createSemesterEntry,
  getAcademicLevelLabel,
  getSemesterTermLabel,
  getSemesterCreditLimit,
  SemesterCreditLimitRule
} from "@/lib/academic-calendar";


interface CustomTimelineBuilderProps {
  startYear: number;
  onStartYearChange: (year: number) => void;
  studentId?: string;
}

export function CustomTimelineBuilder({
  startYear,
  onStartYearChange,
  studentId
}: CustomTimelineBuilderProps) {
  const { t, lang, dir } = useApp();
  const { toast } = useToast();
  const { courses } = useAdmin();
  const { user } = useAuth();
  const { markCompleted, completedCourses } = useAcademic();

  // Dialog state for adding a semester
  const [showAddSemesterModal, setShowAddSemesterModal] = React.useState(false);
  const [newSemesterTerm, setNewSemesterTerm] = React.useState<"fall" | "spring" | "summer">("fall");
  const [newSemesterYear, setNewSemesterYear] = React.useState<number>(startYear);

  // Open modal and automatically select the first available (non-duplicate) year & term
  const openAddSemesterModal = () => {
    const candidateYears = [startYear, startYear + 1, startYear + 2, startYear + 3, startYear + 4, startYear + 5];
    const candidateTerms: Array<"fall" | "spring" | "summer"> = ["fall", "spring", "summer"];

    let chosenYear = startYear;
    let chosenTerm: "fall" | "spring" | "summer" = "fall";
    let foundNonDuplicate = false;

    for (const yr of candidateYears) {
      for (const tm of candidateTerms) {
        const pid = tm === "fall" ? `fall-${yr}` : `${tm}-${yr + 1}`;
        if (!customSemesters.some((s) => s.periodId === pid)) {
          chosenYear = yr;
          chosenTerm = tm;
          foundNonDuplicate = true;
          break;
        }
      }
      if (foundNonDuplicate) break;
    }

    setNewSemesterYear(chosenYear);
    setNewSemesterTerm(chosenTerm);
    setShowAddSemesterModal(true);
  };

  // Default initial semesters (First year: Fall, Spring, and Summer) based on student ID start year
  const defaultInitialSemesters = React.useMemo<CustomSemesterData[]>(() => {
    const standard = generateStudentSemesters(startYear, 4);
    return standard.slice(0, 3).map((s) => ({
      id: `sem-${s.id}`,
      periodId: s.id,
      titleAr: s.titleAr,
      titleEn: s.titleEn,
      term: s.term,
      year: s.year,
      courses: []
    }));
  }, [startYear]);

  // Persistent storage for user's semester records (completely isolated storage key)
  const [customSemesters, setCustomSemesters] = useLocalStorage<CustomSemesterData[]>(
    `su_gpa_flexible_timeline_${startYear}`,
    defaultInitialSemesters
  );

  // Sync if startYear changed and list is empty
  React.useEffect(() => {
    if (customSemesters.length === 0) {
      setCustomSemesters(defaultInitialSemesters);
    }
  }, [startYear]);

  // Copy/Import existing completed courses from regular curriculum into this flexible timeline as a starting draft
  const handleImportFromRegularTrack = () => {
    if (!completedCourses || completedCourses.length === 0) {
      toast(t("لا توجد مواد مسجلة في الخطة المنتظمة لاستيرادها.", "No completed courses found in regular track to import."), "info");
      return;
    }

    if (!window.confirm(t("هل تريد نسخ المواد المسجلة في الخطة المنتظمة وتوزيعها على فصول هذا المسار كمسودة؟ (بيانات المسار المنتظم ستظل محفوظة كما هي ولن تتأثر)", "Do you want to copy your regular curriculum courses into this flexible timeline as a draft? (Your regular track data will remain untouched)"))) {
      return;
    }

    const standard = generateStudentSemesters(startYear, 4);
    const periodMap = new Map<string, Array<{ code: string; credits: number; grade: string }>>();
    completedCourses.forEach((comp) => {
      const catalog = courses.find((c) => c.code === comp.code);
      const period = catalog?.period || "1-1";
      if (!periodMap.has(period)) periodMap.set(period, []);
      periodMap.get(period)!.push({
        code: comp.code,
        credits: catalog?.credits ?? 3,
        grade: comp.grade
      });
    });

    const periodToTermIndex: Record<string, number> = {
      "1-1": 0, // Fall Y
      "1-2": 1, // Spring Y+1
      "2-1": 3, // Fall Y+1
      "2-2": 4, // Spring Y+2
      "3-1": 6, // Fall Y+2
      "3-2": 7, // Spring Y+3
      "4-1": 9, // Fall Y+3
      "4-2": 10 // Spring Y+4
    };

    const newSemestersList = standard.slice(0, 6).map((s, idx) => {
      const matchedPeriod = Object.keys(periodToTermIndex).find((p) => periodToTermIndex[p] === idx);
      const importedCourses = matchedPeriod && periodMap.has(matchedPeriod)
        ? periodMap.get(matchedPeriod)!.map((c) => ({
            id: `course-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
            code: c.code,
            credits: c.credits,
            grade: c.grade
          }))
        : [];

      return {
        id: `sem-${s.id}`,
        periodId: s.id,
        titleAr: s.titleAr,
        titleEn: s.titleEn,
        term: s.term,
        year: s.year,
        courses: importedCourses
      };
    });

    setCustomSemesters(newSemestersList);
    toast(
      t("تم استيراد المواد وتوزيعها بنجاح! يمكنك الآن تعديلها وإضافة مواد الصيفي بحرية تامة دون أي تأثير على المسار المنتظم.", "Imported courses as draft! You can now freely modify terms or add summer retakes with zero impact on regular track."),
      "success"
    );
  };

  // Track attempts of each course across previous semesters to enforce Sinai University 3rd-attempt D-cap rule
  const courseAttemptCountMap = React.useMemo(() => {
    const counts = new Map<string, number>();
    customSemesters.forEach((sem) => {
      sem.courses.forEach((c) => {
        if (!c.code) return;
        const prev = counts.get(c.code) || 0;
        counts.set(c.code, prev + 1);
      });
    });
    return counts;
  }, [customSemesters]);

  // Add chosen semester (Fall, Spring, or Summer) with strict duplicate prevention
  const handleAddNewSemester = () => {
    const targetPeriodId = newSemesterTerm === "fall" ? `fall-${newSemesterYear}` : `${newSemesterTerm}-${newSemesterYear + 1}`;
    const alreadyExists = customSemesters.some((s) => s.periodId === targetPeriodId);

    if (alreadyExists) {
      toast(
        t("هذا الفصل الدراسي مضاف بالفعل في سجلك ولا يمكن تكراره بنفس الاسم!", "This semester is already in your record and cannot be duplicated!"),
        "info"
      );
      return;
    }

    const created = createSemesterEntry(newSemesterTerm, newSemesterYear, startYear);
    setCustomSemesters([...customSemesters, created]);
    setShowAddSemesterModal(false);
    toast(
      t(`تمت إضافة ${created.titleAr} إلى سجلك بنجاح!`, `Added ${created.titleEn} to your record!`),
      "success"
    );
  };

  // Quick helper to append next sequential semester
  const handleAddNextStandardSemester = () => {
    const standard = generateStudentSemesters(startYear, 5);
    const existingPeriodIds = new Set(customSemesters.map((s) => s.periodId));
    const nextUnadded = standard.find((s) => !existingPeriodIds.has(s.id));

    if (!nextUnadded) {
      toast(
        t("تمت إضافة جميع الفصول الدراسية الأساسية (5 سنوات)! يمكنك استخدام 'إضافة فصل' لإضافة فصول أخرى.", "All standard 5-year terms added! Use Add Semester for more."),
        "info"
      );
      return;
    }

    const newSem: CustomSemesterData = {
      id: `sem-${nextUnadded.id}-${Date.now().toString(36).substring(4)}`,
      periodId: nextUnadded.id,
      titleAr: nextUnadded.titleAr,
      titleEn: nextUnadded.titleEn,
      term: nextUnadded.term,
      year: nextUnadded.year,
      courses: []
    };

    setCustomSemesters([...customSemesters, newSem]);
    toast(
      t(`تمت إضافة ${nextUnadded.shortAr} إلى سجلك!`, `Added ${nextUnadded.shortEn} to your record!`),
      "success"
    );
  };

  const removeSemester = (semId: string) => {
    if (customSemesters.length <= 1) {
      toast(t("يجب الإبقاء على فصل دراسي واحد على الأقل في السجل.", "Must keep at least one semester in record."), "info");
      return;
    }
    setCustomSemesters(customSemesters.filter((s) => s.id !== semId));
    toast(t("تم حذف الفصل الدراسي من السجل.", "Semester removed from record."), "info");
  };

  const addCourseToSemester = (semId: string) => {
    setCustomSemesters(
      customSemesters.map((sem) => {
        if (sem.id === semId) {
          const newCourse: CustomSemesterCourse = {
            id: `course-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
            code: "",
            credits: 3,
            grade: "B"
          };
          return { ...sem, courses: [...sem.courses, newCourse] };
        }
        return sem;
      })
    );
  };

  const updateCourseInSemester = (
    semId: string,
    courseId: string,
    field: keyof CustomSemesterCourse,
    value: any
  ) => {
    setCustomSemesters(
      customSemesters.map((sem) => {
        if (sem.id === semId) {
          return {
            ...sem,
            courses: sem.courses.map((c) => {
              if (c.id === courseId) {
                const updated = { ...c, [field]: value };
                if (field === "code" && value) {
                  const catalogCourse = courses.find((co) => co.code === value);
                  if (catalogCourse) {
                    updated.credits = catalogCourse.credits;
                  }
                }
                return updated;
              }
              return c;
            })
          };
        }
        return sem;
      })
    );
  };

  const removeCourseFromSemester = (semId: string, courseId: string) => {
    setCustomSemesters(
      customSemesters.map((sem) => {
        if (sem.id === semId) {
          return {
            ...sem,
            courses: sem.courses.filter((c) => c.id !== courseId)
          };
        }
        return sem;
      })
    );
  };

  const resetAllTimeline = () => {
    if (window.confirm(t("هل أنت متأكد من رغبتك في إعادة ضبط سجل الفصول؟", "Are you sure you want to reset your semester records?"))) {
      setCustomSemesters(defaultInitialSemesters);
      toast(t("تمت إعادة ضبط السجل إلى الوضع الافتراضي.", "Semester records reset to default."), "info");
    }
  };

  // Toggle graduation semester status
  const toggleGraduationTerm = (semId: string) => {
    setCustomSemesters(
      customSemesters.map((sem) => {
        if (sem.id === semId) {
          const nextState = !sem.isGraduationTerm;
          if (nextState) {
            toast(
              t(
                "تم تعيين هذا الفصل كترم التخرج الأخير! تم تفعيل استثناء الخريج حتى 21 ساعة (أو 12 ساعة للصيفي) بدون شرط الـ GPA.",
                "Marked as Final Graduation Term! Credit limit unlocked up to 21 hrs (or 12 hrs for summer)."
              ),
              "success"
            );
          } else {
            toast(
              t("تم إلغاء تحديد ترم التخرج وعادت الساعات للحد الطبيعي للائحة.", "Graduation status removed. Returned to standard limits."),
              "info"
            );
          }
          return { ...sem, isGraduationTerm: nextState };
        }
        return sem;
      })
    );
  };

  const handleAddCourseClick = (semId: string, currentCredits: number, maxCredits: number) => {
    if (currentCredits >= maxCredits) {
      toast(
        t(
          `عفواً، لقد بلغت الحد الأقصى للساعات المسموح بها في هذا الترم (${maxCredits} ساعة) وفقاً للائحة ولا يمكنك إضافة مقررات إضافية!`,
          `Credit limit reached (${maxCredits} hrs) for this semester!`
        ),
        "error"
      );
      return;
    }
    addCourseToSemester(semId);
  };

  // Calculate stats for each semester (Credits, GPA, Quality Points, Bylaw credit caps)
  const semesterCalculations = React.useMemo(() => {
    let runningTotalPoints = 0;
    let runningTotalCredits = 0;

    const priorAttemptsSeen = new Map<string, number>();

    return customSemesters.map((sem) => {
      // Prior cumulative GPA before this semester begins
      const priorCumGpa = runningTotalCredits > 0
        ? Math.round((runningTotalPoints / runningTotalCredits) * 100) / 100
        : null;

      let semPoints = 0;
      let semCredits = 0;
      let hasThirdAttemptRetake = false;

      sem.courses.forEach((c) => {
        if (!c.code) return;
        const catalogCourse = courses.find((co) => co.code === c.code);
        const credits = c.credits ?? catalogCourse?.credits ?? 3;

        // Check prior attempt count
        const priorCount = priorAttemptsSeen.get(c.code) || 0;
        let effectiveGradePoints = GRADE_POINTS[c.grade] ?? 0;

        if (priorCount >= 2) {
          // Sinai University Rule: 3rd attempt cap at Grade D (2.00 pts)
          hasThirdAttemptRetake = true;
          effectiveGradePoints = Math.min(effectiveGradePoints, GRADE_POINTS["D"] || 2.0);
        }

        semPoints += effectiveGradePoints * credits;
        semCredits += credits;

        priorAttemptsSeen.set(c.code, priorCount + 1);
      });

      const semGpa = semCredits > 0 ? Math.round((semPoints / semCredits) * 100) / 100 : 0;

      // Academic level offset (0 = Year 1, 1 = Year 2, 2 = Year 3, 3 = Year 4, >= 4 = Extension)
      const semYearStart = sem.term === "fall" ? sem.year : sem.year - 1;
      const yearOffset = Math.max(0, semYearStart - startYear);

      // Determine graduation status (explicitly toggled by user)
      const isGraduationTerm = Boolean(sem.isGraduationTerm);

      // Calculate exact credit limit rule according to Sinai University bylaws
      const limitRule = getSemesterCreditLimit({
        term: sem.term,
        yearOffset,
        priorCumGpa,
        isGraduationTerm
      });

      const isExceeded = semCredits > limitRule.maxCredits;

      // Update running totals for subsequent semesters
      runningTotalPoints += semPoints;
      runningTotalCredits += semCredits;
      const cumGpa = runningTotalCredits > 0 ? Math.round((runningTotalPoints / runningTotalCredits) * 100) / 100 : 0;

      return {
        semId: sem.id,
        semCredits,
        semGpa,
        cumGpa,
        priorCumGpa,
        limitRule,
        isExceeded,
        isGraduationTerm,
        hasThirdAttemptRetake
      };
    });
  }, [customSemesters, courses, startYear]);


  // Overall Totals
  const overallStats = React.useMemo(() => {
    let totalCredits = 0;
    let totalPoints = 0;
    let totalCoursesCount = 0;

    customSemesters.forEach((sem) => {
      sem.courses.forEach((c) => {
        if (!c.code) return;
        const pts = GRADE_POINTS[c.grade] ?? 0;
        totalCredits += c.credits;
        totalPoints += pts * c.credits;
        totalCoursesCount += 1;
      });
    });

    const cumGpa = totalCredits > 0 ? Math.round((totalPoints / totalCredits) * 100) / 100 : 0;
    return { totalCredits, cumGpa, totalCoursesCount };
  }, [customSemesters]);

  // Sync to global AcademicContext
  const [syncSuccess, setSyncSuccess] = React.useState(false);
  const handleSyncToAcademicProfile = () => {
    if (!user) {
      toast(t("يرجى تسجيل الدخول أولاً لمزامنة موادك بسجلك الأكاديمي.", "Please sign in to sync courses to your academic profile."), "info");
      return;
    }

    const hasOverLimitSemesters = semesterCalculations.some((s) => s.isExceeded);
    if (hasOverLimitSemesters) {
      if (!window.confirm(t("تنبيه: يوجد فصل دراسي أو أكثر يتجاوز الحد الأقصى للساعات المسموح بها حسب لائحة جامعة سيناء! هل تريد المتابعة ومزامنة المواد على أية حال؟", "Warning: One or more semesters exceed the allowed credit hour limit. Do you still want to proceed and sync?"))) {
        return;
      }
    }

    if (!window.confirm(t("هل تريد بالتأكيد اعتماد مواد هذا المسار المرن في ملفك الأكاديمي الرئيسي وشريط التخرج (144 ساعة)؟ (بياناتك في الحاسبة السريعة ستظل محفوظة كما هي)", "Do you want to apply this flexible timeline record as your main academic progress and update your 144-credits bar? (Your regular track data will remain intact)"))) {
      return;
    }


    let syncedCount = 0;
    customSemesters.forEach((sem) => {
      sem.courses.forEach((c) => {
        if (c.code && c.grade) {
          markCompleted(c.code, c.grade);
          syncedCount++;
        }
      });
    });

    setSyncSuccess(true);
    toast(
      t(`تمت بنجاح مزامنة ${syncedCount} مقرر من سجلك مع خطتك الرسمية وشريط الـ 144 ساعة!`, `Synced ${syncedCount} courses to your official 144-credits graduation progress!`),
      "success"
    );
    setTimeout(() => setSyncSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Starting Year & Student ID Configuration Banner (Portal Themed for Flexible Track) */}
      <Card className="border border-cyan-200/80 dark:border-cyan-900/60 bg-gradient-to-r from-cyan-500/10 via-sky-500/5 to-cyan-500/10 dark:from-cyan-950/40 dark:via-sky-950/20 dark:to-cyan-950/30 shadow-sm rounded-3xl overflow-hidden">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-sky-600 dark:bg-sky-600 !text-white dark:!text-white shadow-sm border border-sky-400/40">
                  <GraduationCap className="h-3.5 w-3.5 text-white" />
                  {studentId ? t(`رقم الطالب: ${studentId}`, `Student ID: ${studentId}`) : t("حساب استرشادي", "Guidance Record")}
                </span>
                <span className="text-xs font-bold text-cyan-800 dark:text-cyan-300">
                  {t("المسار الفصلي المرن (تسجيل حر بالساعات المعتمدة)", "Flexible Semester Record (Credit Hours)")}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-50">
                {t(
                  `بداية الفصول من العام الجامعي: ${startYear} / ${startYear + 1}`,
                  `Academic Timeline Starts From: ${startYear} / ${startYear + 1}`
                )}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                {t(
                  `يبدأ تسلسل فصولك الدراسية الثلاثة (الفصل الأول، الفصل الثاني، والفصل الصيفي) تلقائياً من سنة التحاقك دفعة (${startYear}) المستنتجة من رقم القيد الجامعي. يمكنك تسجيل أي مواد تختارها في كل فصل بحرية تامة وبنفس الترتيب والعبء الذي سجلت به في كليتك.`,
                  `Your 3 official university terms (Term 1, Term 2, and Summer Term) are generated starting from your admission year class of (${startYear}) derived from your student ID. You can freely log whatever courses you actually enrolled in per semester.`
                )}
              </p>
            </div>

            {/* Quick Year Selector & Add Semester Button */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-stretch md:self-auto justify-end">
              <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-cyan-200 dark:border-cyan-800/80 rounded-2xl px-3 py-1.5 shadow-2xs">
                <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
                  {t("سنة القيد:", "Admission Year:")}
                </span>
                <select
                  value={startYear}
                  onChange={(e) => onStartYearChange(parseInt(e.target.value, 10))}
                  className="bg-transparent text-xs font-black text-cyan-600 dark:text-cyan-400 font-mono focus:outline-none cursor-pointer"
                >
                  {[2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027].map((yr) => (
                    <option key={yr} value={yr} className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-900">
                      {yr} / {yr + 1}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                onClick={openAddSemesterModal}
                className="gap-1.5 text-xs font-bold rounded-2xl shadow-sm bg-sky-600 hover:bg-sky-700 dark:bg-sky-600 dark:hover:bg-sky-500 text-white dark:text-white cursor-pointer"
              >
                <Plus className="h-4 w-4 text-white" />
                <span>{t("إضافة فصل دراسي", "Add Semester")}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Explicit Data Isolation Notice Banner with Import from Regular Track button */}
      <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-950 dark:text-cyan-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2 font-bold">
          <div className="p-1 rounded-lg bg-cyan-500/20 text-cyan-700 dark:text-cyan-300">
            <Lock className="h-3.5 w-3.5" />
          </div>
          <span>
            {t(
              "بيانات هذا المسار المرن معزولة ومستقلة تماماً في التخزين والحسابات عن المسار المنتظم.",
              "This flexible timeline is completely data-isolated and separate from the regular track."
            )}
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleImportFromRegularTrack}
          className="gap-1.5 text-xs font-bold rounded-xl border-cyan-300 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 shrink-0 cursor-pointer"
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>{t("استيراد كمسودة من المسار المنتظم", "Import Draft from Regular")}</span>
        </Button>
      </div>

      {/* Sinai University Bylaws Info Banner (Detailed Credit Hour System) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-950 dark:text-amber-100 space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-2.5">
          <div className="flex items-center gap-2 font-black text-sm text-amber-800 dark:text-amber-300">
            <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{t("لائحة وضوابط سقف الساعات المعتمدة بجامعة سيناء:", "Sinai University Credit Hour Bylaws & Limits:")}</span>
          </div>
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-800 dark:text-amber-300">
            {t("الحد الأقصى للتسجيل لكل ترم", "Max Credit Hours Per Term")}
          </span>
        </div>

        {/* Standard bylaw limits per year and term */}
        <div className="space-y-1.5">
          <span className="font-bold text-[11px] text-amber-900/80 dark:text-amber-300/80 block">
            {t("1. السقف الطبيعي للساعات المعتمدة (الوضع العادي):", "1. Standard Semester Credit Caps (Default):")}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
            <div className="p-2 rounded-xl bg-white/70 dark:bg-zinc-900/70 border border-amber-200/60 dark:border-amber-800/40">
              <strong className="block text-amber-800 dark:text-amber-300">{t("الفرقة الأولى:", "Year 1 (Freshman):")}</strong>
              <span className="text-zinc-600 dark:text-zinc-400">{t("ترم 1:", "Sem 1:")} <strong>17</strong> | {t("ترم 2:", "Sem 2:")} <strong>17</strong></span>
            </div>
            <div className="p-2 rounded-xl bg-white/70 dark:bg-zinc-900/70 border border-amber-200/60 dark:border-amber-800/40">
              <strong className="block text-amber-800 dark:text-amber-300">{t("الفرقة الثانية:", "Year 2 (Sophomore):")}</strong>
              <span className="text-zinc-600 dark:text-zinc-400">{t("ترم 1:", "Sem 1:")} <strong>20</strong> | {t("ترم 2:", "Sem 2:")} <strong>18</strong></span>
            </div>
            <div className="p-2 rounded-xl bg-white/70 dark:bg-zinc-900/70 border border-amber-200/60 dark:border-amber-800/40">
              <strong className="block text-amber-800 dark:text-amber-300">{t("الفرقة الثالثة:", "Year 3 (Junior):")}</strong>
              <span className="text-zinc-600 dark:text-zinc-400">{t("ترم 1:", "Sem 1:")} <strong>18</strong> | {t("ترم 2:", "Sem 2:")} <strong>18</strong></span>
            </div>
            <div className="p-2 rounded-xl bg-white/70 dark:bg-zinc-900/70 border border-amber-200/60 dark:border-amber-800/40">
              <strong className="block text-amber-800 dark:text-amber-300">{t("الفرقة الرابعة:", "Year 4 (Senior):")}</strong>
              <span className="text-zinc-600 dark:text-zinc-400">{t("ترم 1:", "Sem 1:")} <strong>18</strong> | {t("ترم 2:", "Sem 2:")} <strong>18</strong></span>
            </div>
            <div className="p-2 rounded-xl bg-white/70 dark:bg-zinc-900/70 border border-amber-200/60 dark:border-amber-800/40 col-span-2 sm:col-span-1">
              <strong className="block text-amber-800 dark:text-amber-300">{t("الفصل الصيفي:", "Summer Semester:")}</strong>
              <span className="text-zinc-600 dark:text-zinc-400">{t("الحد الأقصى:", "Maximum:")} <strong>{t("9 ساعات", "9 Credits")}</strong></span>
            </div>
          </div>
        </div>

        {/* 4 Special Rules */}
        <div className="space-y-1.5 pt-1 border-t border-amber-500/20">
          <span className="font-bold text-[11px] text-amber-900/80 dark:text-amber-300/80 block">
            {t("2. القواعد الاستثنائية والضوابط الخاصة للائحة:", "2. Special Bylaw Rules & Exceptions:")}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px] leading-relaxed">
            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-zinc-900/70 border border-amber-200/60 dark:border-amber-800/40">
              <strong className="block text-emerald-700 dark:text-emerald-400 mb-0.5">{t("تفوق أكاديمي (GPA ≥ 3.00):", "Academic Excellence (GPA ≥ 3.00):")}</strong>
              {t("يسمح للطالب المتميز بتسجيل حتى 21 ساعة في الترم العادي.", "Students with cumulative GPA >= 3.00 can register up to 21 credits in regular terms.")}
            </div>
            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-zinc-900/70 border border-amber-200/60 dark:border-amber-800/40">
              <strong className="block text-red-600 dark:text-red-400 mb-0.5">{t("إنذار أكاديمي (GPA < 2.00):", "Academic Probation (GPA < 2.00):")}</strong>
              {t("الحد الأقصى للتسجيل هو 12 ساعة فقط للمحافظة على مستواه وتدارك مواده.", "Students on probation (GPA < 2.00) are strictly capped at 12 credits.")}
            </div>
            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-zinc-900/70 border border-amber-200/60 dark:border-amber-800/40">
              <strong className="block text-amber-700 dark:text-amber-400 mb-0.5">{t("الصيفي والتخرج:", "Summer & Graduation:")}</strong>
              {t("السمر كورس 9 ساعات دائماً، إلا في حالة أن الطالب خريج في آخر ترم صيفي له فيسمح حتى 12 ساعة.", "Summer is 9 credits, except for graduating students in their final summer term (up to 12 credits).")}
            </div>
            <div className="p-2.5 rounded-xl bg-white/70 dark:bg-zinc-900/70 border border-amber-200/60 dark:border-amber-800/40">
              <strong className="block text-cyan-700 dark:text-cyan-400 mb-0.5">{t("فصل التخرج الأخير:", "Final Graduation Term:")}</strong>
              {t("يسمح للخريج في آخر ترم له بالجامعة بتسجيل حتى 21 ساعة بالترم العادي دون اشتراط GPA فوق الـ 3.", "Graduating student in final term can register up to 21 credits without GPA >= 3.00 requirement.")}
            </div>
          </div>
        </div>
      </div>


      {/* Summary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs text-center">
          <span className="text-[10px] font-bold text-zinc-400 block">{t("الفصول المسجلة", "Recorded Semesters")}</span>
          <span className="text-xl sm:text-2xl font-black text-sky-600 dark:text-sky-400 font-mono mt-1 block">
            {customSemesters.length}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs text-center">
          <span className="text-[10px] font-bold text-zinc-400 block">{t("الساعات المنجزة", "Completed Credits")}</span>
          <span className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50 font-mono mt-1 block">
            {overallStats.totalCredits} <span className="text-xs text-zinc-400 font-sans">/ 144</span>
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs text-center">
          <span className="text-[10px] font-bold text-zinc-400 block">{t("المعدل التراكمي الكلي", "Cumulative GPA")}</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1 block">
            {overallStats.cumGpa.toFixed(2)}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs text-center">
          <span className="text-[10px] font-bold text-zinc-400 block">{t("إجمالي المقررات", "Total Courses")}</span>
          <span className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50 font-mono mt-1 block">
            {overallStats.totalCoursesCount}
          </span>
        </div>
      </div>

      {/* Semesters Cards Container */}
      <div className="space-y-5">
        {customSemesters.map((semester, semIndex) => {
          const stats = semesterCalculations[semIndex] || {
            semCredits: 0,
            semGpa: 0,
            cumGpa: 0,
            isOnProbation: false,
            exceedsProbationLoad: false,
            hasThirdAttemptRetake: false
          };

          const isSummer = semester.term === "summer";
          const semYearStart = semester.term === "fall" ? semester.year : semester.year - 1;
          const semOffset = semYearStart - startYear;
          const semLevel = getAcademicLevelLabel(semOffset);
          const semTermInfo = getSemesterTermLabel(semester.term, semYearStart);

          return (
            <Card
              key={semester.id}
              className={`border transition-all rounded-3xl overflow-hidden ${
                stats.isExceeded
                  ? "border-red-400/80 dark:border-red-900/80 bg-red-500/5 dark:bg-red-950/20"
                  : stats.isGraduationTerm
                  ? "border-amber-300 dark:border-amber-800/80 bg-amber-500/5 dark:bg-amber-950/15"
                  : isSummer
                  ? "border-amber-200 dark:border-amber-900/50 bg-amber-500/5 dark:bg-amber-950/20"
                  : "border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900"
              }`}
            >
              {/* Semester Header */}
              <CardHeader className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                        {isSummer ? <Sun className="h-4.5 w-4.5 text-amber-500" /> : <Calendar className="h-4.5 w-4.5 text-sky-500" />}
                        {lang === "ar" ? semester.titleAr : semester.titleEn}
                      </span>

                      {/* سنة كام badge */}
                      <Badge className="bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 text-[10px] font-bold border border-cyan-200 dark:border-cyan-800">
                        {lang === "ar" ? semLevel.shortAr : semLevel.shortEn}
                      </Badge>

                      {/* ترم كام badge */}
                      <Badge className="bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 text-[10px] font-bold border border-sky-200 dark:border-sky-800">
                        {lang === "ar" ? semTermInfo.termNumberAr : semTermInfo.termNumberEn}
                      </Badge>

                      {/* Limit rule reason badge */}
                      {stats.limitRule.badgeType === "highGpa" ? (
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                          {t("تفوق أكاديمي (سقف 21 ساعة)", "High GPA (21 cr cap)")}
                        </Badge>
                      ) : stats.limitRule.badgeType === "probation" ? (
                        <Badge className="bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/30 text-[10px] font-bold">
                          {t("إنذار أكاديمي (سقف 12 ساعة)", "Probation (12 cr cap)")}
                        </Badge>
                      ) : stats.limitRule.badgeType === "graduation" ? (
                        <Badge className="bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-500/40 text-[10px] font-bold">
                          {t(`استثناء تخرج (${stats.limitRule.maxCredits} ساعة)`, `Graduation (${stats.limitRule.maxCredits} cr)`)}
                        </Badge>
                      ) : isSummer ? (
                        <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                          {t("فصل صيفي (سقف 9 ساعات)", "Summer (9 cr cap)")}
                        </Badge>
                      ) : (
                        <Badge className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 text-[10px] font-bold">
                          {t(`سقف اللائحة: ${stats.limitRule.maxCredits} ساعة`, `Bylaw Cap: ${stats.limitRule.maxCredits} cr`)}
                        </Badge>
                      )}

                      {stats.hasThirdAttemptRetake && (
                        <Badge className="bg-orange-500/20 text-orange-700 dark:text-orange-300 text-[10px] font-bold border border-orange-500/30">
                          {t("إعادة مادة (سقف D)", "3rd Retake (D Cap)")}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 flex-wrap">
                      <span>
                        {semester.courses.length} {t("مواد", "courses")}
                      </span>
                      <span>&bull;</span>
                      <span className={`font-mono font-bold ${stats.isExceeded ? "text-red-600 dark:text-red-400" : stats.semCredits === stats.limitRule.maxCredits ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-800 dark:text-zinc-200"}`}>
                        {t("الساعات:", "Credits:")} <strong>{stats.semCredits} / {stats.limitRule.maxCredits} {t("ساعة", "hrs")}</strong>
                        {stats.isExceeded && <AlertTriangle className="inline h-3.5 w-3.5 text-red-600 dark:text-red-400 mr-1 rtl:mr-1 ltr:ml-1 align-text-bottom" />}
                      </span>
                      <span>&bull;</span>
                      <span>
                        {t("المعدل الفصلي:", "Semester GPA:")}{" "}
                        <strong className="text-sky-600 dark:text-sky-400 font-mono font-bold">{stats.semGpa.toFixed(2)}</strong>
                      </span>
                      <span>&bull;</span>
                      <span>
                        {t("التراكمي بنهاية الفصل:", "Cumulative:")}{" "}
                        <strong className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{stats.cumGpa.toFixed(2)}</strong>
                      </span>
                      {stats.priorCumGpa !== null && (
                        <>
                          <span>&bull;</span>
                          <span>
                            {t("تراكمي سابق:", "Prior GPA:")}{" "}
                            <strong className="text-zinc-700 dark:text-zinc-300 font-mono font-bold">{stats.priorCumGpa.toFixed(2)}</strong>
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Semester Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                    {/* Final Graduation Term Toggle */}
                    <Button
                      size="sm"
                      variant={semester.isGraduationTerm ? "default" : "outline"}
                      onClick={() => toggleGraduationTerm(semester.id)}
                      className={`gap-1.5 text-xs font-bold rounded-xl h-8 cursor-pointer transition-all ${
                        semester.isGraduationTerm
                          ? "bg-amber-600 hover:bg-amber-700 text-white border-amber-600 shadow-xs"
                          : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-amber-600 hover:border-amber-300 dark:hover:border-amber-700"
                      }`}
                      title={t("تحديد هذا الفصل كترم التخرج النهائي لفتح سقف الساعات (حتى 21 ساعة للعادي و 12 ساعة للصيفي)", "Mark as final graduation semester to unlock credit limits")}
                    >
                      <GraduationCap className="h-3.5 w-3.5" />
                      <span>{semester.isGraduationTerm ? t("فصل تخرج", "Graduation Term") : t("ترم تخرج؟", "Graduation?")}</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddCourseClick(semester.id, stats.semCredits, stats.limitRule.maxCredits)}
                      className={`gap-1.5 text-xs font-bold rounded-xl h-8 cursor-pointer ${
                        stats.semCredits >= stats.limitRule.maxCredits
                          ? "opacity-60 border-zinc-200 text-zinc-400"
                          : ""
                      }`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>{t("إضافة مقرر", "Add Course")}</span>
                    </Button>

                    <button
                      onClick={() => removeSemester(semester.id)}
                      className="p-2 rounded-xl text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      title={t("حذف هذا الفصل", "Delete Semester")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Over-limit Warning Alert for this semester */}
                {stats.isExceeded && (
                  <div className="mt-3 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold space-y-1">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-red-600" />
                      <span>
                        {t(
                          `تنبيه مخالفة اللائحة: لقد سجلت ${stats.semCredits} ساعة في هذا الفصل بينما الحد الأقصى المسموح به هو ${stats.limitRule.maxCredits} ساعة فقط!`,
                          `Bylaw Violation: Registered ${stats.semCredits} credits in this term, but your max allowed limit is ${stats.limitRule.maxCredits} credits!`
                        )}
                      </span>
                    </div>
                    <p className="text-[11px] font-normal text-red-700/90 dark:text-red-300/90 mr-6 rtl:mr-6 ltr:ml-6">
                      <strong>{t("الضابط المطبق:", "Applied Rule:")} </strong>
                      {lang === "ar" ? stats.limitRule.reasonAr : stats.limitRule.reasonEn}
                    </p>
                  </div>
                )}
              </CardHeader>


              {/* Courses in this semester */}
              <CardContent className="p-4 sm:p-5 space-y-3">
                {semester.courses.length > 0 ? (
                  <div className="space-y-2.5">
                    {/* Header line for desktop */}
                    <div className="hidden sm:grid grid-cols-12 gap-3 text-[11px] font-bold text-zinc-400 pb-1.5 border-b border-zinc-100 dark:border-zinc-800">
                      <div className="col-span-6">{t("المقرر الدراسي", "Course")}</div>
                      <div className="col-span-2 text-center">{t("الساعات", "Credits")}</div>
                      <div className="col-span-3 text-center">{t("التقدير المحقق", "Grade")}</div>
                      <div className="col-span-1"></div>
                    </div>

                    {semester.courses.map((c) => {
                      const courseObj = courses.find((co) => co.code === c.code);

                      // Check attempt count
                      const attemptCount = courseAttemptCountMap.get(c.code) || 1;
                      const isThirdAttempt = attemptCount >= 3;

                      return (
                        <div
                          key={c.id}
                          className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center p-2.5 rounded-2xl bg-zinc-50/80 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-zinc-800/80"
                        >
                          {/* Course select */}
                          <div className="col-span-12 sm:col-span-6 space-y-1">
                            <select
                              value={c.code}
                              onChange={(e) => updateCourseInSemester(semester.id, c.id, "code", e.target.value)}
                              className="w-full h-10 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                            >
                              <option value="">{t("-- اختر المقرر الدراسي --", "-- Select course --")}</option>
                              {courses.map((co) => (
                                <option key={co.code} value={co.code}>
                                  {co.code} - {t(co.arabic, co.english)} ({co.credits} {t("ساعة", "cr")})
                                </option>
                              ))}
                            </select>

                            {isThirdAttempt && c.code && (
                              <div className="flex items-center gap-1.5 text-[10px] text-amber-600 dark:text-amber-400 font-bold px-1">
                                <AlertTriangle className="h-3 w-3 shrink-0" />
                                <span>{t("إعادة للمرة الثالثة: سقف النقاط D (2.00)", "3rd Retake: Quality points capped at D (2.00)")}</span>
                              </div>
                            )}
                          </div>

                          {/* Credits */}
                          <div className="col-span-6 sm:col-span-2">
                            <label className="text-[10px] font-bold text-zinc-400 sm:hidden block mb-1">{t("الساعات", "Credits")}</label>
                            <Input
                              type="number"
                              min={0}
                              max={6}
                              value={c.credits}
                              onChange={(e) => updateCourseInSemester(semester.id, c.id, "credits", parseInt(e.target.value, 10) || 0)}
                              className="h-10 text-center text-xs font-bold"
                            />
                          </div>

                          {/* Grade */}
                          <div className="col-span-6 sm:col-span-3">
                            <label className="text-[10px] font-bold text-zinc-400 sm:hidden block mb-1">{t("التقدير", "Grade")}</label>
                            <GradeSelect
                              value={c.grade}
                              onChange={(val) => updateCourseInSemester(semester.id, c.id, "grade", val)}
                              options={GRADE_OPTIONS}
                              className="w-full h-10 text-xs font-bold"
                            />
                          </div>

                          {/* Delete Course Button */}
                          <div className="col-span-12 sm:col-span-1 flex items-center justify-end sm:justify-center">
                            <button
                              onClick={() => removeCourseFromSemester(semester.id, c.id)}
                              className="p-2 text-zinc-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs"
                              title={t("حذف المقرر", "Remove Course")}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sm:hidden font-bold">{t("حذف المقرر", "Delete Course")}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-6 text-center text-zinc-400 dark:text-zinc-500 space-y-2 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                    <p className="text-xs font-semibold">
                      {t("لم يتم تسجيل أي مقررات في هذا الفصل بعد.", "No courses registered in this semester yet.")}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddCourseClick(semester.id, stats.semCredits, stats.limitRule.maxCredits)}
                      className="gap-1 text-xs h-8 font-bold rounded-xl cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>{t("إضافة مقرر دراسي", "Add Course")}</span>
                    </Button>

                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <Button
            onClick={handleAddNextStandardSemester}
            variant="outline"
            className="gap-1.5 text-xs font-bold rounded-2xl h-10 border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-300 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{t("إضافة الفصل التالي", "Add Next Semester")}</span>
          </Button>

          <Button
            onClick={openAddSemesterModal}
            variant="outline"
            className="gap-1.5 text-xs font-bold rounded-2xl h-10 cursor-pointer"
          >
            <Calendar className="h-4 w-4 text-sky-500" />
            <span>{t("إضافة فصل دراسي", "Add Semester")}</span>
          </Button>

          <Button
            onClick={resetAllTimeline}
            variant="ghost"
            className="gap-1.5 text-xs text-zinc-400 hover:text-rose-500 rounded-2xl h-10 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{t("إعادة ضبط", "Reset All")}</span>
          </Button>
        </div>

        <div className="w-full sm:w-auto flex justify-end">
          <Button
            onClick={handleSyncToAcademicProfile}
            className="w-full sm:w-auto gap-2 text-xs font-bold rounded-2xl h-10 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>{t("مزامنة المواد المنجزة مع خطتي (Sync All)", "Sync All to Academic Plan")}</span>
          </Button>
        </div>
      </div>

      {syncSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-2.5 shadow-sm">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{t("تم بنجاح تحديث خطتك الدراسية الرسمية وحساب الساعات الـ 144 في النظام!", "Successfully synced your entire semester record with official 144-credits graduation progress!")}</span>
        </div>
      )}

      {/* Modal / Dialog for adding a standard university semester */}
      <AnimatePresence>
        {showAddSemesterModal && (() => {
          const targetPeriodId = newSemesterTerm === "fall" ? `fall-${newSemesterYear}` : `${newSemesterTerm}-${newSemesterYear + 1}`;
          const isDuplicate = customSemesters.some((s) => s.periodId === targetPeriodId);

          const offset = newSemesterYear - startYear;
          const level = getAcademicLevelLabel(offset);
          const termInfo = getSemesterTermLabel(newSemesterTerm, newSemesterYear);
          const previewTitle = `${lang === "ar" ? level.ar : level.en} — ${lang === "ar" ? termInfo.fullAr : termInfo.fullEn}`;
          const previewLimitRule = getSemesterCreditLimit({
            term: newSemesterTerm,
            yearOffset: offset,
            priorCumGpa: null
          });

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
                dir={dir}
              >
                {/* Modal Title */}
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-sky-500" />
                    <span>{t("إضافة فصل دراسي إلى سجلك (تحديد السنة والترم)", "Add Semester to Record (Specify Year & Term)")}</span>
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {t(
                      "حدد الفرقة الدراسية (سنة كام) ونوع الفصل (ترم كام). يمنع النظام تكرار أي ترم مضاف مسبقاً بنفس الاسم والفرقة.",
                      "Specify academic year level & term. Duplicate semesters are strictly prevented."
                    )}
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  {/* 1. Academic Level / Year (سنة كام) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-extrabold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                        <GraduationCap className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                        <span>{t("1. اختر الفرقة الدراسية (سنة كام؟):", "1. Select Academic Year (Which Year?):")}</span>
                      </label>
                      <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 font-bold bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
                        {t(`سنة القيد: ${startYear}`, `Admission: ${startYear}`)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[0, 1, 2, 3].map((off) => {
                        const yr = startYear + off;
                        const lvl = getAcademicLevelLabel(off);
                        const isSelected = newSemesterYear === yr;

                        // Check count of added terms in this academic year
                        const yearTermIds = [`fall-${yr}`, `spring-${yr + 1}`, `summer-${yr + 1}`];
                        const addedCount = yearTermIds.filter((pid) =>
                          customSemesters.some((s) => s.periodId === pid)
                        ).length;
                        const isFull = addedCount === 3;

                        return (
                          <button
                            key={yr}
                            type="button"
                            onClick={() => setNewSemesterYear(yr)}
                            className={`p-2.5 rounded-2xl border text-right rtl:text-right ltr:text-left transition-all cursor-pointer flex flex-col justify-between gap-1 relative ${
                              isSelected
                                ? "border-sky-600 bg-sky-50/90 dark:bg-sky-950/70 text-sky-900 dark:text-sky-200 ring-2 ring-sky-500/30 shadow-xs"
                                : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700"
                            }`}
                          >
                            <div>
                              <span className="block font-black text-xs text-zinc-900 dark:text-zinc-50">
                                {lang === "ar" ? lvl.shortAr : lvl.shortEn}
                              </span>
                              <span className="block text-[10px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                                {yr} / {yr + 1}
                              </span>
                            </div>

                            <div className="mt-1">
                              {isFull ? (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-zinc-200/80 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold block text-center">
                                  {t("3/3 فصول مضافة", "3/3 Added")}
                                </span>
                              ) : (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-sky-100/80 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 font-bold block text-center">
                                  {t(`${addedCount} من 3 مضاف`, `${addedCount}/3 Added`)}
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Extended graduation years option if student exceeded 4 years */}
                    <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950/40 p-2 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60">
                      <span>{t("هل تحتاج سنة تخرج إضافية أو ممتدة؟", "Need an extended graduation year?")}</span>
                      <select
                        value={newSemesterYear >= startYear + 4 ? newSemesterYear : ""}
                        onChange={(e) => {
                          if (e.target.value) {
                            setNewSemesterYear(parseInt(e.target.value, 10));
                          }
                        }}
                        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2 py-1 text-xs font-bold text-sky-600 dark:text-sky-400 focus:outline-none cursor-pointer"
                      >
                        <option value="">{t("-- اختر سنة إضافية --", "-- Extension Year --")}</option>
                        {[startYear + 4, startYear + 5, startYear + 6].map((ey) => {
                          const off = ey - startYear;
                          const lvl = getAcademicLevelLabel(off);
                          return (
                            <option key={ey} value={ey}>
                              {ey} / {ey + 1} — {lang === "ar" ? lvl.ar : lvl.en}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  {/* 2. Term Selection (ترم كام) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-extrabold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-sky-500" />
                        <span>{t("2. اختر الفصل الدراسي (ترم كام؟):", "2. Select Semester Term:")}</span>
                      </label>
                      <span className="text-[10px] text-zinc-400 font-semibold">
                        {t("3 فصول باللائحة", "3 Official Terms")}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        {
                          key: "fall",
                          termNumAr: "الترم الأول",
                          termNumEn: "Term 1",
                          labelAr: "الفصل الأول (خريف)",
                          labelEn: "Term 1 (Fall)"
                        },
                        {
                          key: "spring",
                          termNumAr: "الترم الثاني",
                          termNumEn: "Term 2",
                          labelAr: "الفصل الثاني (ربيع)",
                          labelEn: "Term 2 (Spring)"
                        },
                        {
                          key: "summer",
                          termNumAr: "ترم صيفي",
                          termNumEn: "Summer Term",
                          labelAr: "الفصل الصيفي",
                          labelEn: "Summer Term"
                        }
                      ].map((termOpt) => {
                        const pid = termOpt.key === "fall" ? `fall-${newSemesterYear}` : `${termOpt.key}-${newSemesterYear + 1}`;
                        const isTermAdded = customSemesters.some((s) => s.periodId === pid);
                        const isSelected = newSemesterTerm === termOpt.key;

                        return (
                          <button
                            key={termOpt.key}
                            type="button"
                            onClick={() => setNewSemesterTerm(termOpt.key as any)}
                            className={`p-2.5 sm:p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 text-center relative ${
                              isSelected
                                ? isTermAdded
                                  ? "border-amber-500 bg-amber-500/10 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/30"
                                  : "border-sky-600 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 ring-2 ring-sky-500/30 shadow-sm"
                                : isTermAdded
                                ? "border-zinc-200 dark:border-zinc-800/80 bg-zinc-100/70 dark:bg-zinc-900/40 text-zinc-400 dark:text-zinc-500 hover:border-zinc-300"
                                : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 hover:border-sky-300 dark:hover:border-sky-800"
                            }`}
                          >
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                              {t(termOpt.termNumAr, termOpt.termNumEn)}
                            </span>
                            <span className="font-extrabold text-xs">
                              {t(termOpt.labelAr, termOpt.labelEn)}
                            </span>
                            {isTermAdded ? (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 font-bold border border-amber-500/30">
                                {t("مضاف مسبقاً", "Added")}
                              </span>
                            ) : (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/20">
                                {t("متاح للإضافة", "Available")}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 3. Live Preview Card & Strict Duplicate Protection */}
                  <div
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all space-y-2.5 ${
                      isDuplicate
                        ? "bg-red-500/10 border-red-500/30 text-red-950 dark:text-red-200"
                        : "bg-cyan-50/70 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800 text-cyan-950 dark:text-cyan-100"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        {t("بيانات الفصل المحدد للإضافة:", "Target Semester Details:")}
                      </span>
                      {isDuplicate ? (
                        <Badge className="bg-red-600 text-white text-[10px] font-bold shadow-xs">
                          {t("مضاف مسبقاً (مكرر)", "Duplicate Term")}
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
                          {t("متاح للإضافة", "Ready to Add")}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50">
                        <span className="text-[10px] font-bold text-zinc-400 block mb-0.5">
                          {t("سنة كام:", "Academic Year:")}
                        </span>
                        <strong className="text-zinc-900 dark:text-zinc-100 font-extrabold block">
                          {lang === "ar" ? level.ar : level.en}
                        </strong>
                        <span className="text-[10px] font-mono text-zinc-500">
                          ({newSemesterYear} / {newSemesterYear + 1})
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50">
                        <span className="text-[10px] font-bold text-zinc-400 block mb-0.5">
                          {t("ترم كام:", "Semester Term:")}
                        </span>
                        <strong className="text-zinc-900 dark:text-zinc-100 font-extrabold block">
                          {lang === "ar" ? termInfo.termNumberAr : termInfo.termNumberEn}
                        </strong>
                        <span className="text-[10px] text-zinc-500">
                          ({lang === "ar" ? termInfo.seasonAr : termInfo.seasonEn})
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-zinc-400 block">
                          {t("الاسم المعتمد في السجل:", "Official Transcript Name:")}
                        </span>
                        <span className="text-xs sm:text-sm font-black text-cyan-800 dark:text-cyan-300">
                          {previewTitle}
                        </span>
                      </div>
                      <Calendar className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                    </div>

                    <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50 text-[11px]">
                      <span className="text-zinc-500 dark:text-zinc-400 font-medium">
                        {t("سقف الساعات الطبيعي للائحة:", "Standard Bylaw Limit:")}
                      </span>
                      <strong className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                        {previewLimitRule.maxCredits} {t("ساعة معتمدة", "credit hours")}
                      </strong>
                    </div>

                    {isDuplicate ? (
                      <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-700 dark:text-red-300 text-xs font-bold flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                        <span>
                          {t(
                            "هذا الفصل مضاف بالفعل في سجلك الأكاديمي! لائحة الجامعة تمنع تكرار نفس الترم بنفس الاسم والفرقة. اختر تيرماً آخر غير مضاف.",
                            "This semester is already in your record! University bylaws prevent duplicate terms. Please pick another term or year."
                          )}
                        </span>
                      </div>
                    ) : (
                      <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                        <span>
                          {t(
                            "هذا الترم غير مكرر وجاهز للإضافة إلى مسارك المرن لتسجيل مواده بحرية.",
                            "Available and unique. Ready to add to your flexible timeline."
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddSemesterModal(false)}
                    className="rounded-xl text-xs font-bold cursor-pointer"
                  >
                    {t("إلغاء", "Cancel")}
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAddNewSemester}
                    disabled={isDuplicate}
                    className={`rounded-xl text-xs font-bold transition-all px-4 ${
                      isDuplicate
                        ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 cursor-not-allowed border-0 shadow-none"
                        : "bg-sky-600 hover:bg-sky-700 text-white dark:text-white cursor-pointer shadow-md"
                    }`}
                  >
                    {isDuplicate ? (
                      <span className="flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                        <span>{t("الترم مضاف مسبقاً (ممنوع التكرار)", "Already Added (No Duplicates)")}</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Plus className="h-4 w-4 text-white" />
                        <span>{t("إضافة هذا الفصل إلى سجلي", "Add Semester to Record")}</span>
                      </span>
                    )}
                  </Button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

