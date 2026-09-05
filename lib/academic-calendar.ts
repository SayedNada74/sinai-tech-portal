/**
 * Academic Calendar & Dynamic Semester Generator
 * Tailored for Sinai University Credit Hours Bylaws
 * 
 * 3 Official Terms:
 * 1. Fall (الفصل الأول - خريف)
 * 2. Spring (الفصل الثاني - ربيع)
 * 3. Summer (الفصل الصيفي - صيف - اختياري)
 * 
 * Each semester explicitly specifies:
 * - سنة كام: الفرقة الأولى / الثانية / الثالثة / الرابعة (تخرج)
 * - ترم كام: الفصل الأول / الفصل الثاني / الفصل الصيفي
 * - العام الأكاديمي والتقويمي
 */

export interface DynamicSemesterOption {
  id: string;
  year: number;
  term: "fall" | "spring" | "summer";
  academicYearLabel: string; // e.g. "2023/2024"
  titleAr: string;
  titleEn: string;
  shortAr: string;
  shortEn: string;
  levelAr: string;
  levelEn: string;
  isSummer: boolean;
}

export interface CustomSemesterCourse {
  id: string;
  code: string;
  credits: number;
  grade: string;
  attemptNumber?: number; // 1, 2, or 3+
}

export interface CustomSemesterData {
  id: string;
  periodId: string; // unique identifier (e.g. 'fall-2023', 'spring-2024')
  titleAr: string;
  titleEn: string;
  term: "fall" | "spring" | "summer";
  year: number;
  isGraduationTerm?: boolean; // final graduation semester toggle
  courses: CustomSemesterCourse[];
}


/**
 * Extracts admission year from student ID (e.g. '20230142' -> 2023, '20220819' -> 2022).
 * Falls back to 2023 if unauthenticated or non-matching.
 */
export function getEnrollmentYearFromId(studentId?: string | null, fallbackYear: number = 2023): number {
  if (!studentId) return fallbackYear;
  const match = studentId.trim().match(/^(20\d{2})/);
  if (match) {
    const year = parseInt(match[1], 10);
    if (year >= 2015 && year <= 2035) {
      return year;
    }
  }
  return fallbackYear;
}

export function getAcademicLevelLabel(offset: number): { ar: string; en: string; shortAr: string; shortEn: string } {
  switch (offset) {
    case 0:
      return { ar: "الفرقة الأولى (سنة أولى)", en: "Year 1 (Freshman)", shortAr: "سنة أولى", shortEn: "Year 1" };
    case 1:
      return { ar: "الفرقة الثانية (سنة ثانية)", en: "Year 2 (Sophomore)", shortAr: "سنة ثانية", shortEn: "Year 2" };
    case 2:
      return { ar: "الفرقة الثالثة (سنة ثالثة)", en: "Year 3 (Junior)", shortAr: "سنة ثالثة", shortEn: "Year 3" };
    case 3:
      return { ar: "الفرقة الرابعة (سنة رابعة - تخرج)", en: "Year 4 (Senior - Graduation)", shortAr: "سنة رابعة (تخرج)", shortEn: "Year 4 (Senior)" };
    default:
      if (offset > 3) {
        return { ar: `سنة إضافية / ممتدة (${offset + 1})`, en: `Extension Year (${offset + 1})`, shortAr: `سنة ${offset + 1}`, shortEn: `Year ${offset + 1}` };
      }
      return { ar: "سنة تمهيدية / سابقة", en: "Prior Year", shortAr: "تمهيدي", shortEn: "Prior" };
  }
}

export function getSemesterTermLabel(term: "fall" | "spring" | "summer", academicYearStart: number): {
  termNumberAr: string;
  termNumberEn: string;
  seasonAr: string;
  seasonEn: string;
  fullAr: string;
  fullEn: string;
} {
  if (term === "fall") {
    return {
      termNumberAr: "الترم الأول",
      termNumberEn: "Term 1",
      seasonAr: `خريف ${academicYearStart}`,
      seasonEn: `Fall ${academicYearStart}`,
      fullAr: `الفصل الأول (خريف ${academicYearStart})`,
      fullEn: `Semester 1 (Fall ${academicYearStart})`
    };
  } else if (term === "spring") {
    return {
      termNumberAr: "الترم الثاني",
      termNumberEn: "Term 2",
      seasonAr: `ربيع ${academicYearStart + 1}`,
      seasonEn: `Spring ${academicYearStart + 1}`,
      fullAr: `الفصل الثاني (ربيع ${academicYearStart + 1})`,
      fullEn: `Semester 2 (Spring ${academicYearStart + 1})`
    };
  } else {
    return {
      termNumberAr: "الترم الصيفي",
      termNumberEn: "Summer Term",
      seasonAr: `صيف ${academicYearStart + 1}`,
      seasonEn: `Summer ${academicYearStart + 1}`,
      fullAr: `الفصل الصيفي (صيف ${academicYearStart + 1} - اختياري)`,
      fullEn: `Summer Term (Summer ${academicYearStart + 1} - Optional)`
    };
  }
}

export interface SemesterCreditLimitRule {
  maxCredits: number;
  standardCredits: number;
  reasonAr: string;
  reasonEn: string;
  badgeType: "standard" | "highGpa" | "probation" | "graduation" | "summer";
  isProbation: boolean;
  isHighGpa: boolean;
  isGraduation: boolean;
}

/**
 * Calculates the exact credit hour load limit for a semester based on Sinai University bylaws:
 * 
 * Standard limits:
 * - Year 1 (الفرقة الأولى): Fall: 17, Spring: 17, Summer: 9
 * - Year 2 (الفرقة الثانية): Fall: 20, Spring: 18, Summer: 9
 * - Year 3 (الفرقة الثالثة): Fall: 18, Spring: 18, Summer: 9
 * - Year 4 (الفرقة الرابعة): Fall: 18, Spring: 18, Summer: 9
 * - Extension: Fall: 18, Spring: 18, Summer: 9
 * 
 * Rules & Exceptions:
 * 1. High GPA (prior GPA >= 3.00): Regular terms allow up to 21 credits.
 * 2. Probation (prior GPA < 2.00): Capped at 12 credits.
 * 3. Summer Term: 9 credits, UNLESS graduating term -> up to 12 credits.
 * 4. Graduation Term (final term): Regular terms allow up to 21 credits WITHOUT requiring GPA >= 3.00.
 */
export function getSemesterCreditLimit(params: {
  term: "fall" | "spring" | "summer";
  yearOffset: number; // 0 = Year 1, 1 = Year 2, 2 = Year 3, 3 = Year 4, >= 4 = Extension
  priorCumGpa: number | null; // null if first semester
  isGraduationTerm?: boolean;
}): SemesterCreditLimitRule {
  const { term, yearOffset, priorCumGpa, isGraduationTerm } = params;

  // Determine standard default credits for this specific year & term
  let standardCredits = 18;
  if (term === "summer") {
    standardCredits = 9;
  } else if (yearOffset === 0) {
    // Year 1 (الفرقة الأولى): Term 1 = 17, Term 2 = 17
    standardCredits = 17;
  } else if (yearOffset === 1) {
    // Year 2 (الفرقة الثانية): Term 1 = 20, Term 2 = 18
    standardCredits = term === "fall" ? 20 : 18;
  } else {
    // Year 3, Year 4, Extension: 18
    standardCredits = 18;
  }

  // 1. Graduation Term Exception (أخر ترم خالص ويتخرج)
  if (isGraduationTerm) {
    if (term === "summer") {
      return {
        maxCredits: 12,
        standardCredits,
        reasonAr: "ترم التخرج الأخير (صيفي) — استثناء خريج حتى 12 ساعة بدلاً من 9",
        reasonEn: "Graduation Summer Term — Capped at 12 credits instead of 9",
        badgeType: "graduation",
        isProbation: false,
        isHighGpa: false,
        isGraduation: true
      };
    } else {
      return {
        maxCredits: 21,
        standardCredits,
        reasonAr: "فصل التخرج الأخير — استثناء خريج حتى 21 ساعة (بدون شرط المعدل)",
        reasonEn: "Final Graduation Term — Allowed up to 21 credits without GPA condition",
        badgeType: "graduation",
        isProbation: false,
        isHighGpa: false,
        isGraduation: true
      };
    }
  }

  // 2. Summer Term (السمر كورس 9 ساعات علطول)
  if (term === "summer") {
    return {
      maxCredits: 9,
      standardCredits: 9,
      reasonAr: "الحد الأقصى للفصل الصيفي (9 ساعات)",
      reasonEn: "Summer Term Cap (9 credits)",
      badgeType: "summer",
      isProbation: false,
      isHighGpa: false,
      isGraduation: false
    };
  }

  // 3. Regular Term (خريف أو ربيع)
  // Check probation condition (prior GPA < 2.00)
  if (priorCumGpa !== null && priorCumGpa > 0 && priorCumGpa < 2.00) {
    return {
      maxCredits: 12,
      standardCredits,
      reasonAr: `إنذار أكاديمي (المعدل التراكمي السابق ${priorCumGpa.toFixed(2)} أقل من 2.00) — الحد الأقصى 12 ساعة فقط`,
      reasonEn: `Academic Probation (Prior GPA ${priorCumGpa.toFixed(2)} < 2.00) — Capped at 12 credits`,
      badgeType: "probation",
      isProbation: true,
      isHighGpa: false,
      isGraduation: false
    };
  }

  // Check High GPA condition (prior GPA >= 3.00)
  if (priorCumGpa !== null && priorCumGpa >= 3.00) {
    return {
      maxCredits: 21,
      standardCredits,
      reasonAr: `تفوق أكاديمي (المعدل التراكمي السابق ${priorCumGpa.toFixed(2)} ≥ 3.00) — مسموح حتى 21 ساعة بالترم العادي`,
      reasonEn: `Academic Distinction (Prior GPA ${priorCumGpa.toFixed(2)} >= 3.00) — Allowed up to 21 credits`,
      badgeType: "highGpa",
      isProbation: false,
      isHighGpa: true,
      isGraduation: false
    };
  }

  // Standard limit according to Year Level & Term
  let termLabelAr = "";
  if (yearOffset === 0) {
    termLabelAr = term === "fall" ? "أولى (ترم أول): 17 ساعة" : "أولى (ترم ثاني): 17 ساعة";
  } else if (yearOffset === 1) {
    termLabelAr = term === "fall" ? "ثانية (ترم أول): 20 ساعة" : "ثانية (ترم ثاني): 18 ساعة";
  } else if (yearOffset === 2) {
    termLabelAr = term === "fall" ? "ثالثة (ترم أول): 18 ساعة" : "ثالثة (ترم ثاني): 18 ساعة";
  } else if (yearOffset === 3) {
    termLabelAr = term === "fall" ? "رابعة (ترم أول): 18 ساعة" : "رابعة (ترم ثاني): 18 ساعة";
  } else {
    termLabelAr = "سنة ممتدة: 18 ساعة";
  }

  return {
    maxCredits: standardCredits,
    standardCredits,
    reasonAr: `الحد الطبيعي للائحة الكلية — ${termLabelAr}`,
    reasonEn: `Standard Bylaw Limit (${standardCredits} credits)`,
    badgeType: "standard",
    isProbation: false,
    isHighGpa: false,
    isGraduation: false
  };
}


/**
 * Generates the sequential 3-term sequence (Fall, Spring, Summer) starting from student's admission year.
 * Every term clearly states "سنة كام وترم كام":
 * e.g.:
 * - الفرقة الأولى — الفصل الأول (خريف 2023)
 * - الفرقة الأولى — الفصل الثاني (ربيع 2024)
 * - الفرقة الأولى — الفصل الصيفي (صيف 2024 - اختياري)
 * - الفرقة الثانية — الفصل الأول (خريف 2024)
 * ... etc.
 */
export function generateStudentSemesters(startYear: number, numberOfYears: number = 5): DynamicSemesterOption[] {
  const semesters: DynamicSemesterOption[] = [];

  for (let offset = 0; offset < numberOfYears; offset++) {
    const academicYearStart = startYear + offset;
    const academicYearEnd = academicYearStart + 1;
    const academicYearLabel = `${academicYearStart}/${academicYearEnd}`;
    const level = getAcademicLevelLabel(offset);

    // 1. Fall Semester (الفصل الأول - خريف)
    semesters.push({
      id: `fall-${academicYearStart}`,
      year: academicYearStart,
      term: "fall",
      academicYearLabel,
      titleAr: `${level.ar} — الفصل الأول (خريف ${academicYearStart})`,
      titleEn: `${level.en} — Semester 1 (Fall ${academicYearStart})`,
      shortAr: `خريف ${academicYearStart}`,
      shortEn: `Fall ${academicYearStart}`,
      levelAr: level.ar,
      levelEn: level.en,
      isSummer: false
    });

    // 2. Spring Semester (الفصل الثاني - ربيع)
    semesters.push({
      id: `spring-${academicYearEnd}`,
      year: academicYearEnd,
      term: "spring",
      academicYearLabel,
      titleAr: `${level.ar} — الفصل الثاني (ربيع ${academicYearEnd})`,
      titleEn: `${level.en} — Semester 2 (Spring ${academicYearEnd})`,
      shortAr: `ربيع ${academicYearEnd}`,
      shortEn: `Spring ${academicYearEnd}`,
      levelAr: level.ar,
      levelEn: level.en,
      isSummer: false
    });

    // 3. Summer Semester (الفصل الصيفي - اختياري)
    semesters.push({
      id: `summer-${academicYearEnd}`,
      year: academicYearEnd,
      term: "summer",
      academicYearLabel,
      titleAr: `${level.ar} — الفصل الصيفي (صيف ${academicYearEnd} - اختياري)`,
      titleEn: `${level.en} — Summer Term (Summer ${academicYearEnd} - Optional)`,
      shortAr: `صيف ${academicYearEnd}`,
      shortEn: `Summer ${academicYearEnd}`,
      levelAr: level.ar,
      levelEn: level.en,
      isSummer: true
    });
  }

  return semesters;
}

/**
 * Creates an official semester entry specifying exactly "سنة كام وترم كام"
 * - academicYearStart: e.g. 2022 for academic year 2022/2023
 * - startYear: student's enrollment year (to compute level: 1st, 2nd, 3rd, 4th)
 */
export function createSemesterEntry(
  term: "fall" | "spring" | "summer",
  academicYearStart: number,
  studentStartYear: number = 2023
): CustomSemesterData {
  const offset = academicYearStart - studentStartYear;
  const level = getAcademicLevelLabel(offset);

  let titleAr = "";
  let titleEn = "";
  let calendarYear = academicYearStart;
  let periodId = "";

  if (term === "fall") {
    calendarYear = academicYearStart;
    periodId = `fall-${academicYearStart}`;
    titleAr = `${level.ar} — الفصل الأول (خريف ${academicYearStart})`;
    titleEn = `${level.en} — Semester 1 (Fall ${academicYearStart})`;
  } else if (term === "spring") {
    calendarYear = academicYearStart + 1;
    periodId = `spring-${academicYearStart + 1}`;
    titleAr = `${level.ar} — الفصل الثاني (ربيع ${academicYearStart + 1})`;
    titleEn = `${level.en} — Semester 2 (Spring ${academicYearStart + 1})`;
  } else {
    calendarYear = academicYearStart + 1;
    periodId = `summer-${academicYearStart + 1}`;
    titleAr = `${level.ar} — الفصل الصيفي (صيف ${academicYearStart + 1} - اختياري)`;
    titleEn = `${level.en} — Summer Term (Summer ${academicYearStart + 1} - Optional)`;
  }

  return {
    id: `sem-${periodId}-${Date.now().toString(36).substring(4)}`,
    periodId,
    titleAr,
    titleEn,
    term,
    year: calendarYear,
    courses: []
  };
}
