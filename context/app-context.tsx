"use client";

import * as React from "react";
import { useAuth } from "./auth-context";
import { firebaseDb, FirebaseUser } from "@/lib/firebase";
import { getLocalizedUserName } from "@/lib/utils";

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

  // Cross-Tab Storage Event Listener for theme and language synchronization
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageEvent = (e: StorageEvent) => {
      if ((e.key === "app_theme" || e.key === "theme") && e.newValue) {
        const newTheme = e.newValue as "dark" | "light";
        setThemeState(newTheme);
        applyThemeToDOM(newTheme);
      } else if (e.key === "app_lang" && e.newValue) {
        const newLang = e.newValue as "ar" | "en";
        setLangState(newLang);
        if (typeof document !== "undefined") {
          document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
        }
      } else if (e.key === "app_lpm" && e.newValue !== null) {
        setLowPowerModeState(e.newValue === "true");
      }
    };

    window.addEventListener("storage", handleStorageEvent);
    return () => window.removeEventListener("storage", handleStorageEvent);
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

  // 3. Sync settings with Cloud upon Login (preserves user active local choice)
  React.useEffect(() => {
    if (user) {
      const syncUserSettings = async () => {
        const localLang = localStorage.getItem("app_lang") as "ar" | "en" | null;
        const localTheme = (localStorage.getItem("app_theme") || localStorage.getItem("theme")) as "dark" | "light" | null;
        const localLPM = localStorage.getItem("app_lpm");

        const fbSettings = await firebaseDb.loadSettings(user.id);

        if (localLang || localTheme) {
          // User already chose a preference on this device: preserve it and sync to cloud
          const activeLang = localLang || fbSettings?.lang || "ar";
          const activeTheme = localTheme || fbSettings?.theme || "dark";
          const activeLPM = localLPM !== null ? localLPM === "true" : (fbSettings?.lowPowerMode ?? false);

          setLangState(activeLang);
          setThemeState(activeTheme);
          setLowPowerModeState(activeLPM);
          applyThemeToDOM(activeTheme);
          document.documentElement.dir = activeLang === "ar" ? "rtl" : "ltr";

          localStorage.setItem("app_lang", activeLang);
          localStorage.setItem("app_theme", activeTheme);
          localStorage.setItem("theme", activeTheme);

          // Update cloud with the active user selection
          firebaseDb.syncSettings(user.id, { lang: activeLang, theme: activeTheme, lowPowerMode: activeLPM });
        } else if (fbSettings) {
          // First time on device: adopt cloud settings
          setLangState(fbSettings.lang);
          setThemeState(fbSettings.theme);
          setLowPowerModeState(fbSettings.lowPowerMode);
          applyThemeToDOM(fbSettings.theme);
          document.documentElement.dir = fbSettings.lang === "ar" ? "rtl" : "ltr";

          localStorage.setItem("app_lang", fbSettings.lang);
          localStorage.setItem("app_theme", fbSettings.theme);
          localStorage.setItem("theme", fbSettings.theme);
          localStorage.setItem("app_lpm", String(fbSettings.lowPowerMode));
        }
      };
      syncUserSettings();
    }
  }, [user, applyThemeToDOM]);

  // 4. Translate helper
  const t = React.useCallback((ar: string, en: string) => {
    return lang === "ar" ? ar : en;
  }, [lang]);

  // 5. User settings mapping
  const userName = getLocalizedUserName(user, lang);
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
