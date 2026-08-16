"use client";

import * as React from "react";
import { Course } from "@/lib/courses-data";
import { useAuth } from "./auth-context";
import { useAdmin } from "./admin-context";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0,
  "A": 3.8,
  "A-": 3.6,
  "B+": 3.3,
  "B": 3.0,
  "C+": 2.7,
  "C": 2.4,
  "D+": 2.0,
  "D": 2.0, // Legacy fallback for backward compatibility
  "F": 0.0
};

export const GRADE_OPTIONS = ["A+", "A", "A-", "B+", "B", "C+", "C", "D+", "F"];


export const GRADE_LABELS: Record<string, string> = {
  "A+": "ممتاز مرتفع (A+)",
  "A": "ممتاز (A)",
  "A-": "ممتاز منخفض (A-)",
  "B+": "جيد جداً مرتفع (B+)",
  "B": "جيد جداً (B)",
  "C+": "جيد مرتفع (C+)",
  "C": "جيد (C)",
  "D+": "مقبول (D+)",
  "D": "مقبول (D)", // Legacy fallback
  "F": "راسب (F)"
};

export interface CompletedCourseState {
  code: string;
  grade: string;
}

interface AcademicContextType {
  completedCourses: CompletedCourseState[];
  plannedCourses: string[];
  targetGpa: number;
  completedCredits: number;
  remainingCredits: number;
  graduationPercentage: number;
  cumulativeGpa: number;
  totalCreditsInCatalog: number;
  markCompleted: (code: string, grade: string) => void;
  markPlanned: (code: string) => void;
  removeCourse: (code: string) => void;
  resetAll: () => void;
  setTargetGpa: (gpa: number) => void;
  isCompleted: (code: string) => boolean;
  isPlanned: (code: string) => boolean;
  getCourseGrade: (code: string) => string | undefined;
}

const AcademicContext = React.createContext<AcademicContextType | undefined>(undefined);

export function AcademicProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { courses } = useAdmin();
  const [completedCourses, setCompletedCourses] = React.useState<CompletedCourseState[]>([]);
  const [plannedCourses, setPlannedCourses] = React.useState<string[]>([]);
  const [targetGpa, setTargetGpa] = React.useState<number>(3.5);

  const totalCreditsInCatalog = React.useMemo(() => {
    return courses.reduce((sum, c) => sum + c.credits, 0);
  }, [courses]);

  // Load state from Supabase Cloud DB and local cache on mount or user change
  React.useEffect(() => {
    let isMounted = true;
    if (user) {
      const userEmailKey = user.email ? user.email.toLowerCase().trim().replace(/[^a-z0-9]/g, '_') : user.id;
      const storageKey = `su_academic_${userEmailKey}`;
      const legacyKey = `su_academic_${user.id}`;
      const saved = localStorage.getItem(storageKey) || localStorage.getItem(legacyKey);

      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setCompletedCourses(parsed.completedCourses || []);
          setPlannedCourses(parsed.plannedCourses || []);
          setTargetGpa(parsed.targetGpa || 3.5);
        } catch (e) { }
      }

      // Authoritative Cloud Fetch from Supabase academic_progress table
      const fetchAcademicCloud = async () => {
        if (isSupabaseConfigured && supabase && user.id) {
          try {
            const { data, error } = await supabase
              .from("academic_progress")
              .select("*")
              .eq("user_id", user.id)
              .maybeSingle();

            if (!error && data && isMounted) {
              const cloudCompleted = Array.isArray(data.completed_courses)
                ? data.completed_courses
                : (typeof data.completed_courses === "string" ? JSON.parse(data.completed_courses || "[]") : []);
              const cloudPlanned = Array.isArray(data.planned_courses)
                ? data.planned_courses
                : (typeof data.planned_courses === "string" ? JSON.parse(data.planned_courses || "[]") : []);
              const cloudGpa = Number(data.target_gpa) || 3.5;

              setCompletedCourses(cloudCompleted);
              setPlannedCourses(cloudPlanned);
              setTargetGpa(cloudGpa);

              // Update local cache
              const payload = JSON.stringify({
                completedCourses: cloudCompleted,
                plannedCourses: cloudPlanned,
                targetGpa: cloudGpa
              });
              localStorage.setItem(storageKey, payload);
              localStorage.setItem(`su_academic_${user.id}`, payload);
            }
          } catch (err) {
            console.warn("Academic cloud fetch error:", err);
          }
        }
      };

      fetchAcademicCloud();
    } else {
      setCompletedCourses([]);
      setPlannedCourses([]);
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Save changes to localStorage cache and Supabase Cloud DB
  const saveState = async (completed: CompletedCourseState[], planned: string[], target: number) => {
    if (user) {
      const userEmailKey = user.email ? user.email.toLowerCase().trim().replace(/[^a-z0-9]/g, '_') : user.id;
      const storageKey = `su_academic_${userEmailKey}`;
      const payload = JSON.stringify({
        completedCourses: completed,
        plannedCourses: planned,
        targetGpa: target
      });

      // 1. Cache locally
      localStorage.setItem(storageKey, payload);
      localStorage.setItem(`su_academic_${user.id}`, payload);

      // 2. Persist to Supabase Cloud DB
      if (isSupabaseConfigured && supabase && user.id) {
        try {
          await supabase.from("academic_progress").upsert({
            user_id: user.id,
            completed_courses: completed,
            planned_courses: planned,
            target_gpa: target,
            updated_at: new Date().toISOString()
          }, { onConflict: "user_id" });
        } catch (err) {
          console.warn("Academic progress cloud save warning:", err);
        }
      }
    }
  };

  const markCompleted = (code: string, grade: string) => {
    // Remove from planned first
    const newPlanned = plannedCourses.filter((c) => c !== code);
    
    // Add/Update completed
    const newCompleted = [...completedCourses];
    const index = newCompleted.findIndex((c) => c.code === code);
    if (index !== -1) {
      newCompleted[index].grade = grade;
    } else {
      newCompleted.push({ code, grade });
    }

    setPlannedCourses(newPlanned);
    setCompletedCourses(newCompleted);
    saveState(newCompleted, newPlanned, targetGpa);
  };

  const markPlanned = (code: string) => {
    // Remove from completed
    const newCompleted = completedCourses.filter((c) => c.code !== code);
    
    // Add to planned if not exists
    const newPlanned = [...plannedCourses];
    if (!newPlanned.includes(code)) {
      newPlanned.push(code);
    }

    setCompletedCourses(newCompleted);
    setPlannedCourses(newPlanned);
    saveState(newCompleted, newPlanned, targetGpa);
  };

  const removeCourse = (code: string) => {
    const newCompleted = completedCourses.filter((c) => c.code !== code);
    const newPlanned = plannedCourses.filter((c) => c !== code);

    setCompletedCourses(newCompleted);
    setPlannedCourses(newPlanned);
    saveState(newCompleted, newPlanned, targetGpa);
  };

  const resetAll = () => {
    setCompletedCourses([]);
    setPlannedCourses([]);
    setTargetGpa(3.5);
    if (user) {
      localStorage.removeItem(`su_academic_${user.id}`);
    }
  };

  const updateTargetGpa = (val: number) => {
    setTargetGpa(val);
    saveState(completedCourses, plannedCourses, val);
  };

  // Check state helpers
  const isCompleted = (code: string) => completedCourses.some((c) => c.code === code);
  const isPlanned = (code: string) => plannedCourses.includes(code);
  const getCourseGrade = (code: string) => completedCourses.find((c) => c.code === code)?.grade;

  // Calculators
  const completedCredits = React.useMemo(() => {
    return completedCourses.reduce((sum, comp) => {
      const course = courses.find((c) => c.code === comp.code);
      return sum + (course ? course.credits : 0);
    }, 0);
  }, [completedCourses, courses]);

  const remainingCredits = React.useMemo(() => {
    return Math.max(0, 144 - completedCredits); // Standard 144 credits graduation target
  }, [completedCredits]);

  const graduationPercentage = React.useMemo(() => {
    return Math.min(100, Math.round((completedCredits / 144) * 100));
  }, [completedCredits]);

  const cumulativeGpa = React.useMemo(() => {
    let totalPoints = 0;
    let totalCreditsForGpa = 0;

    completedCourses.forEach((comp) => {
      const course = courses.find((c) => c.code === comp.code);
      if (course && course.credits > 0) { // Exclude 0 credit courses like Sinai History (Hu 100)
        const gradeValue = GRADE_POINTS[comp.grade] ?? 0;
        totalPoints += gradeValue * course.credits;
        totalCreditsForGpa += course.credits;
      }
    });

    if (totalCreditsForGpa === 0) return 0;
    return Math.round((totalPoints / totalCreditsForGpa) * 100) / 100;
  }, [completedCourses, courses]);

  return (
    <AcademicContext.Provider
      value={{
        completedCourses,
        plannedCourses,
        targetGpa,
        completedCredits,
        remainingCredits,
        graduationPercentage,
        cumulativeGpa,
        totalCreditsInCatalog,
        markCompleted,
        markPlanned,
        removeCourse,
        resetAll,
        setTargetGpa: updateTargetGpa,
        isCompleted,
        isPlanned,
        getCourseGrade
      }}
    >
      {children}
    </AcademicContext.Provider>
  );
}

export function useAcademic() {
  const context = React.useContext(AcademicContext);
  if (context === undefined) {
    throw new Error("useAcademic must be used within an AcademicProvider");
  }
  return context;
}
