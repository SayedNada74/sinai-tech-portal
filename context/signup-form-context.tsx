"use client";

import * as React from "react";

export interface SignupFormData {
  nameAr: string;
  nameEn: string;
  email: string;
  studentId: string;
  level: string;
  department: string;
  password?: string;
}

const STORAGE_KEY = "sinai_signup_form_draft";

const DEFAULT_FORM_DATA: SignupFormData = {
  nameAr: "",
  nameEn: "",
  email: "",
  studentId: "",
  level: "الفرقة الأولى",
  department: "تكنولوجيا المعلومات وعلوم الحاسب (IT & CS)",
  password: ""
};

interface SignupFormContextType {
  formData: SignupFormData;
  setFormField: <K extends keyof SignupFormData>(field: K, value: SignupFormData[K]) => void;
  setFormData: React.Dispatch<React.SetStateAction<SignupFormData>>;
  resetForm: () => void;
}

const SignupFormContext = React.createContext<SignupFormContextType | undefined>(undefined);

export function SignupFormProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = React.useState<SignupFormData>(DEFAULT_FORM_DATA);
  const isHydratedRef = React.useRef(false);

  // 1. Hydrate non-sensitive form data from localStorage on client mount (safe for Next.js SSR)
  React.useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const savedDraft = window.localStorage.getItem(STORAGE_KEY);
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          setFormData((prev) => ({
            ...prev,
            nameAr: typeof parsed.nameAr === "string" ? parsed.nameAr : prev.nameAr,
            nameEn: typeof parsed.nameEn === "string" ? parsed.nameEn : prev.nameEn,
            email: typeof parsed.email === "string" ? parsed.email : prev.email,
            studentId: typeof parsed.studentId === "string" ? parsed.studentId : prev.studentId,
            level: typeof parsed.level === "string" ? parsed.level : prev.level,
            department: typeof parsed.department === "string" ? parsed.department : prev.department,
            // SECURITY: Never restore password from persistent storage
            password: prev.password || ""
          }));
        }
      }
    } catch (err) {
      console.warn("Failed to load signup form draft from storage:", err);
    }
    isHydratedRef.current = true;
  }, []);

  // 2. Persist non-sensitive fields to localStorage whenever formData changes
  React.useEffect(() => {
    if (!isHydratedRef.current) return;

    try {
      if (typeof window !== "undefined") {
        const safeDataToPersist = {
          nameAr: formData.nameAr,
          nameEn: formData.nameEn,
          email: formData.email,
          studentId: formData.studentId,
          level: formData.level,
          department: formData.department
        };

        // Only persist if at least one field has been modified
        const hasData = Object.values(safeDataToPersist).some((v) => Boolean(v && v !== DEFAULT_FORM_DATA[v as keyof typeof DEFAULT_FORM_DATA]));
        if (hasData) {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(safeDataToPersist));
        }
      }
    } catch (err) {
      console.warn("Failed to save signup form draft to storage:", err);
    }
  }, [formData]);

  // 3. Helper to update a single form field
  const setFormField = React.useCallback(<K extends keyof SignupFormData>(field: K, value: SignupFormData[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // 4. Helper to reset form state and clear localStorage draft (used upon successful registration)
  const resetForm = React.useCallback(() => {
    setFormData(DEFAULT_FORM_DATA);
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch (err) {
      console.warn("Failed to clear signup form draft from storage:", err);
    }
  }, []);

  return (
    <SignupFormContext.Provider value={{ formData, setFormField, setFormData, resetForm }}>
      {children}
    </SignupFormContext.Provider>
  );
}

export function useSignupForm() {
  const context = React.useContext(SignupFormContext);
  if (!context) {
    throw new Error("useSignupForm must be used within a SignupFormProvider");
  }
  return context;
}
