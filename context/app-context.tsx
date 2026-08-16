"use client";

import * as React from "react";
import { useAuth } from "./auth-context";
import { firebaseDb, FirebaseUser } from "@/lib/firebase";

export interface AppContextType {
  lang: "ar" | "en";
  setLang: (l: "ar" | "en") => void;
  theme: "dark" | "light";
  setTheme: (t: "dark" | "light") => void;
  t: (ar: string, en: string) => string;
  dir: "rtl" | "ltr";
  userName: string;
  setUserName: (n: string) => void;
  userRole: string;
  userEmail: string;
  userPhotoUrl: string | null;
  setUserPhotoUrl: (url: string | null) => void;
  firebaseUser: FirebaseUser | null;
  isLoggedIn: boolean;
  lowPowerMode: boolean;
  setLowPowerMode: (m: boolean) => void;
}

const AppContext = React.createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, updateProfile } = useAuth();

  // 1. Initial State from localStorage
  const [lang, setLangState] = React.useState<"ar" | "en">("ar");
  const [theme, setThemeState] = React.useState<"dark" | "light">("dark");
  const [lowPowerMode, setLowPowerModeState] = React.useState<boolean>(false);

  // Synchronize document DOM classes with theme state
  const applyThemeToDOM = React.useCallback((t: "dark" | "light") => {
    if (typeof document === "undefined") return;
    if (t === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light-mode");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light-mode");
    }
  }, []);

  // Read initial states on mount
  React.useEffect(() => {
    const savedLang = localStorage.getItem("app_lang") as "ar" | "en" | null;
    const savedTheme = (localStorage.getItem("app_theme") || localStorage.getItem("theme")) as "dark" | "light" | null;
    const savedLPM = localStorage.getItem("app_lpm");

    if (savedLang) setLangState(savedLang);
    if (savedTheme) {
      setThemeState(savedTheme);
      applyThemeToDOM(savedTheme);
    } else {
      applyThemeToDOM("dark");
    }
    if (savedLPM) setLowPowerModeState(savedLPM === "true");
  }, [applyThemeToDOM]);

  // 2. Setters with Persistence, Theme, and Direction application
  const setLang = React.useCallback((l: "ar" | "en") => {
    setLangState(l);
    localStorage.setItem("app_lang", l);
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    
    // Sync settings to Firebase if logged in
    if (user) {
      firebaseDb.syncSettings(user.id, { lang: l, theme, lowPowerMode });
    }
  }, [user, theme, lowPowerMode]);

  const setTheme = React.useCallback((t: "dark" | "light") => {
    setThemeState(t);
    localStorage.setItem("app_theme", t);
    localStorage.setItem("theme", t);
    applyThemeToDOM(t);

    // Sync settings to Firebase if logged in
    if (user) {
      firebaseDb.syncSettings(user.id, { lang, theme: t, lowPowerMode });
    }
  }, [user, lang, lowPowerMode, applyThemeToDOM]);

  const setLowPowerMode = React.useCallback((m: boolean) => {
    setLowPowerModeState(m);
    localStorage.setItem("app_lpm", String(m));

    // Sync settings to Firebase if logged in
    if (user) {
      firebaseDb.syncSettings(user.id, { lang, theme, lowPowerMode: m });
    }
  }, [user, lang, theme]);

  // Apply visual settings (theme class and direction) on state load/change
  React.useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    applyThemeToDOM(theme);
  }, [lang, theme, applyThemeToDOM]);

  // 3. Load settings from Firebase on Login (overrides localStorage)
  React.useEffect(() => {
    if (user) {
      const loadFirebaseSettings = async () => {
        const fbSettings = await firebaseDb.loadSettings(user.id);
        if (fbSettings) {
          setLangState(fbSettings.lang);
          setThemeState(fbSettings.theme);
          setLowPowerModeState(fbSettings.lowPowerMode);
          applyThemeToDOM(fbSettings.theme);
          
          localStorage.setItem("app_lang", fbSettings.lang);
          localStorage.setItem("app_theme", fbSettings.theme);
          localStorage.setItem("theme", fbSettings.theme);
          localStorage.setItem("app_lpm", String(fbSettings.lowPowerMode));
        }
      };
      loadFirebaseSettings();
    }
  }, [user, applyThemeToDOM]);

  // 4. Translate helper
  const t = React.useCallback((ar: string, en: string) => {
    return lang === "ar" ? ar : en;
  }, [lang]);

  // 5. User settings mapping
  const userName = user ? (lang === "ar" ? (user.nameAr || user.name) : (user.nameEn || user.name)) : "";
  const setUserName = React.useCallback((n: string) => {
    updateProfile({ name: n });
  }, [updateProfile]);

  const userRole = user?.role || "student";
  const userEmail = user?.email || "";
  const userPhotoUrl = user?.avatar || null;
  const setUserPhotoUrl = React.useCallback((url: string | null) => {
    updateProfile({ avatar: url || "🎓" });
  }, [updateProfile]);

  const firebaseUser = React.useMemo<FirebaseUser | null>(() => {
    if (!user) return null;
    return {
      uid: user.id,
      displayName: lang === "ar" ? (user.nameAr || user.name) : (user.nameEn || user.name),
      email: user.email,
      photoURL: user.avatar
    };
  }, [user]);

  // 6. Memoized Context value
  const contextValue = React.useMemo<AppContextType>(() => {
    return {
      lang,
      setLang,
      theme,
      setTheme,
      t,
      dir: lang === "ar" ? "rtl" : "ltr",
      userName,
      setUserName,
      userRole,
      userEmail,
      userPhotoUrl,
      setUserPhotoUrl,
      firebaseUser,
      isLoggedIn: isAuthenticated,
      lowPowerMode,
      setLowPowerMode
    };
  }, [
    lang,
    setLang,
    theme,
    setTheme,
    t,
    userName,
    setUserName,
    userRole,
    userEmail,
    userPhotoUrl,
    setUserPhotoUrl,
    firebaseUser,
    isAuthenticated,
    lowPowerMode,
    setLowPowerMode
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
