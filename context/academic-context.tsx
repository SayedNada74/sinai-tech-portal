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

export const GRADE_OPTIONS = ["A+", "A", "A-", "B+", "B", "C+", "C", "D", "F"];


export const GRADE_LABELS: Record<string, string> = {
  "A+": "ممتاز مرتفع (A+)",
  "A": "ممتاز (A)",
  "A-": "ممتاز منخفض (A-)",
  "B+": "جيد جداً مرتفع (B+)",
  "B": "جيد جداً (B)",
  "C+": "جيد مرتفع (C+)",
  "C": "جيد (C)",
  "D+": "مقبول (D+)", // Keep for backward compatibility
  "D": "مقبول (D)", 
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
  unmarkCompleted: (code: string) => void;
  markPlanned: (code: string) => void;
  unmarkPlanned: (code: string) => void;
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

  // Cross-Tab Storage Event Listener for real-time academic sync across open tabs
  React.useEffect(() => {
    if (!user || typeof window === "undefined") return;
    const userEmailKey = user.email ? user.email.toLowerCase().trim().replace(/[^a-z0-9]/g, '_') : user.id;
    const storageKey = `su_academic_${userEmailKey}`;
    const legacyKey = `su_academic_${user.id}`;

    const handleStorageEvent = (e: StorageEvent) => {
      if ((e.key === storageKey || e.key === legacyKey) && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.completedCourses !== undefined) setCompletedCourses(parsed.completedCourses);
          if (parsed.plannedCourses !== undefined) setPlannedCourses(parsed.plannedCourses);
          if (parsed.targetGpa !== undefined) setTargetGpa(parsed.targetGpa);
        } catch (err) {}
      }
    };

    window.addEventListener("storage", handleStorageEvent);
    return () => window.removeEventListener("storage", handleStorageEvent);
  }, [user]);

  // ============================================================================
  // COALESCED DEBOUNCED SYNC ENGINE
  // ============================================================================
  // Holds the latest academic payload to persist to Supabase
  const pendingSyncRef = React.useRef<{
    completed: CompletedCourseState[];
    planned: string[];
    targetGpa: number;
  } | null>(null);

  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const isSyncingRef = React.useRef<boolean>(false);
  const hasPendingNextSyncRef = React.useRef<boolean>(false);
  const userRef = React.useRef(user);
  userRef.current = user;

  // Flushes the latest coalesced payload to Supabase Cloud DB with serialized lock
  const flushSyncToCloud = React.useCallback(async () => {
    const currentUser = userRef.current;
    if (!isSupabaseConfigured || !supabase || !currentUser?.id || !pendingSyncRef.current) {
      return;
    }

    if (isSyncingRef.current) {
      // Mark that a newer update arrived during an active in-flight request
      hasPendingNextSyncRef.current = true;
      return;
    }

    isSyncingRef.current = true;
    hasPendingNextSyncRef.current = false;

    // Snapshot the current payload to send
    const snapshot = { ...pendingSyncRef.current };

    try {
      const { error } = await supabase.from("academic_progress").upsert({
        user_id: currentUser.id,
        completed_courses: snapshot.completed,
        planned_courses: snapshot.planned,
        target_gpa: snapshot.targetGpa,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id" });

      if (error) {
        console.warn("[Academic Sync] Cloud upsert warning:", error.message);
      }
    } catch (err: any) {
      console.warn("[Academic Sync] Network or unexpected error:", err?.message || err);
    } finally {
      isSyncingRef.current = false;

      // If newer updates arrived while the network request was in-flight, immediately sync the latest coalesced state
      if (hasPendingNextSyncRef.current) {
        hasPendingNextSyncRef.current = false;
        flushSyncToCloud();
      }
    }
  }, []);

  // Schedules a debounced sync (700ms) while keeping local cache instantly updated
  const queueAcademicUpdate = React.useCallback((
    completed: CompletedCourseState[],
    planned: string[],
    target: number
  ) => {
    const currentUser = userRef.current;
    if (!currentUser) return;

    // 1. Instant Synchronous LocalStorage Cache Update (Optimistic Local-First)
    const userEmailKey = currentUser.email
      ? currentUser.email.toLowerCase().trim().replace(/[^a-z0-9]/g, '_')
      : currentUser.id;
    const storageKey = `su_academic_${userEmailKey}`;
    const legacyKey = `su_academic_${currentUser.id}`;

    const payload = JSON.stringify({
      completedCourses: completed,
      plannedCourses: planned,
      targetGpa: target
    });

    try {
      localStorage.setItem(storageKey, payload);
      localStorage.setItem(legacyKey, payload);
    } catch (e) {
      console.warn("[Academic Sync] LocalStorage write error:", e);
    }

    // 2. Update Pending Cloud Payload
    pendingSyncRef.current = {
      completed,
      planned,
      targetGpa: target
    };

    // 3. Reset and schedule debounced sync timer (700ms)
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      flushSyncToCloud();
    }, 700);
  }, [flushSyncToCloud]);

  // Cleanup on unmount or user change
  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      // If there's an uncommitted pending payload on unmount, attempt an immediate flush
      if (pendingSyncRef.current && userRef.current?.id) {
        flushSyncToCloud();
      }
    };
  }, [flushSyncToCloud]);

  const markCompleted = (code: string, grade: string) => {
    const newCompleted = [...completedCourses];
    const index = newCompleted.findIndex((c) => c.code === code);
    if (index !== -1) {
      newCompleted[index].grade = grade;
    } else {
      newCompleted.push({ code, grade });
    }

    setCompletedCourses(newCompleted);
    queueAcademicUpdate(newCompleted, plannedCourses, targetGpa);
  };

  const unmarkCompleted = (code: string) => {
    const newCompleted = completedCourses.filter((c) => c.code !== code);
    setCompletedCourses(newCompleted);
    queueAcademicUpdate(newCompleted, plannedCourses, targetGpa);
  };

  const markPlanned = (code: string) => {
    const newPlanned = [...plannedCourses];
    if (!newPlanned.includes(code)) {
      newPlanned.push(code);
    }

    setPlannedCourses(newPlanned);
    queueAcademicUpdate(completedCourses, newPlanned, targetGpa);
  };

  const unmarkPlanned = (code: string) => {
    const newPlanned = plannedCourses.filter((c) => c !== code);
    setPlannedCourses(newPlanned);
    queueAcademicUpdate(completedCourses, newPlanned, targetGpa);
  };

  const removeCourse = (code: string) => {
    const newCompleted = completedCourses.filter((c) => c.code !== code);
    const newPlanned = plannedCourses.filter((c) => c !== code);

    setCompletedCourses(newCompleted);
    setPlannedCourses(newPlanned);
    queueAcademicUpdate(newCompleted, newPlanned, targetGpa);
  };

  const resetAll = () => {
    setCompletedCourses([]);
    setPlannedCourses([]);
    setTargetGpa(3.5);
    if (user) {
      const userEmailKey = user.email ? user.email.toLowerCase().trim().replace(/[^a-z0-9]/g, '_') : user.id;
      localStorage.removeItem(`su_academic_${userEmailKey}`);
      localStorage.removeItem(`su_academic_${user.id}`);
    }
    queueAcademicUpdate([], [], 3.5);
  };

  const updateTargetGpa = (val: number) => {
    setTargetGpa(val);
    queueAcademicUpdate(completedCourses, plannedCourses, val);
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
        unmarkCompleted,
        markPlanned,
        unmarkPlanned,
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
