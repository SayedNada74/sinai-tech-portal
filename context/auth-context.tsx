"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { fetchFromSupabase, insertToSupabase, updateInSupabase, isSupabaseConfigured, supabase } from "@/lib/supabase";
import { getAuthCallbackURL } from "@/lib/auth-helpers";

export interface UserProfile {
  id: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  email: string;

  level: string;
  department: string;
  studentId: string;
  bio: string;
  skills: string[];
  socialLinks: { github?: string; linkedin?: string; twitter?: string; website?: string };
  avatar: string;
  role: "student" | "moderator" | "admin" | "super-admin";
  rememberMe?: boolean;
  cvUrl?: string;
  projects?: { title: string; description: string; link: string }[];
  badges?: string[];
  points?: number;
  following?: string[];
  needsOnboarding?: boolean;
  isProfileComplete?: boolean;
  is_profile_completed: boolean;
  learning_state?: any;
  social_state?: any;
  privacySettings?: { publicSkills: boolean; publicProjects: boolean };
}

interface AuthContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  register: (nameAr: string, nameEn: string, email: string, password: string, level?: string, department?: string, studentId?: string) => Promise<boolean | "requires_verification">;
  loginWithProvider: (provider: "google" | "github") => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updatedProfile: Partial<UserProfile>) => Promise<boolean>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  // In-flight mutex locks for rapid click hardening & idempotency
  const inFlightOAuthRef = React.useRef<Set<string>>(new Set());
  const inFlightUpdateProfileRef = React.useRef(false);

  React.useEffect(() => {
    let isMounted = true;

    // Helper to hydrate single user from Supabase Cloud DB using UUID
    const hydrateUserFromCloud = async (authUser: any) => {
      if (!isSupabaseConfigured || !supabase || !authUser) return null;

      try {
        const userEmail = authUser.email ? authUser.email.toLowerCase().trim() : "";
        let profileRow: any = null;

        // 1. Direct query by Supabase Auth UUID
        const { data: byId } = await supabase.from("profiles").select("*").eq("id", authUser.id).maybeSingle();
        if (byId) {
          profileRow = byId;
        } else if (userEmail) {
          // 2. Query by Email if ID mismatched (legacy migration)
          const { data: byEmail } = await supabase.from("profiles").select("*").eq("email", userEmail).maybeSingle();
          if (byEmail) {
            profileRow = byEmail;
            // Execute Safe Legacy Migration: update ID to match auth.users.id UUID
            try {
              await supabase.from("profiles").update({ id: authUser.id }).eq("email", userEmail);
              profileRow.id = authUser.id;
            } catch (migErr) {
              console.warn("Legacy profile ID migration warning:", migErr);
            }
          }
        }

        // PROTECTION: If profile row not found in Supabase, do NOT overwrite active user state with empty defaults!
        if (!profileRow) {
          console.warn("No Supabase profile row found for user:", authUser.id);
          return null;
        }

        const parseJson = (val: any, fallback: any) => {
          if (!val) return fallback;
          if (typeof val === "string") {
            try { return JSON.parse(val); } catch (e) { return fallback; }
          }
          return val;
        };

        const cloudSocial = parseJson(profileRow.social_links || profileRow.socialLinks, {});
        const cloudSkills = parseJson(profileRow.skills, []);
        const cloudProjects = parseJson(profileRow.projects, []);
        const isCompleted = profileRow.is_profile_completed !== false;

        if (isMounted) {
          setUser((prev) => {
            const mergedSocial = (cloudSocial && Object.keys(cloudSocial).length > 0)
              ? cloudSocial
              : (prev?.socialLinks || {});
            const mergedSkills = (cloudSkills && cloudSkills.length > 0)
              ? cloudSkills
              : (prev?.skills || []);
            const mergedProjects = (cloudProjects && cloudProjects.length > 0)
              ? cloudProjects
              : (prev?.projects || []);

            const sessionUser: UserProfile = {
              id: profileRow.id || authUser.id,
              name: profileRow.name || prev?.name || authUser.user_metadata?.full_name || authUser.user_metadata?.name || userEmail.split("@")[0] || "طالب سيناء",
              nameAr: profileRow.name_ar || prev?.nameAr || "",
              nameEn: profileRow.name_en || prev?.nameEn || "",
              email: userEmail || authUser.email,
              level: profileRow.level || prev?.level || authUser.user_metadata?.level || "",
              department: profileRow.department || prev?.department || authUser.user_metadata?.department || "تكنولوجيا المعلومات وعلوم الحاسب (IT & CS)",
              studentId: profileRow.student_id || profileRow.studentId || prev?.studentId || authUser.user_metadata?.student_id || "",
              bio: profileRow.bio || prev?.bio || "طالب مسجل في المنصة الأكاديمية.",
              skills: mergedSkills,
              socialLinks: mergedSocial,
              avatar: profileRow.avatar || (prev?.id === (profileRow.id || authUser.id) ? prev?.avatar : null) || authUser.user_metadata?.avatar_url || "🎓",
              role: profileRow.role || (prev?.id === (profileRow.id || authUser.id) ? prev?.role : "student"),
              cvUrl: profileRow.cv_url || profileRow.cvUrl || (prev?.id === (profileRow.id || authUser.id) ? prev?.cvUrl : ""),
              projects: mergedProjects,
              badges: profileRow.badges || (prev?.id === (profileRow.id || authUser.id) ? prev?.badges : ["طالب"]),
              points: profileRow.points || (prev?.id === (profileRow.id || authUser.id) ? prev?.points : 50),
              following: profileRow.following || (prev?.id === (profileRow.id || authUser.id) ? prev?.following : []),
              isProfileComplete: isCompleted,
              needsOnboarding: !isCompleted,
              is_profile_completed: isCompleted,
              learning_state: profileRow.learning_state || prev?.learning_state,
              social_state: profileRow.social_state || prev?.social_state,
              privacySettings: typeof profileRow.privacy_settings === "string"
                ? JSON.parse(profileRow.privacy_settings)
                : (profileRow.privacy_settings || prev?.privacySettings || { publicSkills: true, publicProjects: true })
            };

            localStorage.setItem("su_user_session", JSON.stringify(sessionUser));
            return sessionUser;
          });
        }
        return profileRow;
      } catch (e) {
        console.warn("Supabase user hydration warning:", e);
        return null;
      }
    };

    // 1. Initial Local Cache Hydration for instant UI feedback
    const savedUser = localStorage.getItem("su_user_session");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("su_user_session");
      }
    }

    // 2. Authoritative Supabase Auth Hydration & Real-time Session Listener
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user && isMounted) {
          hydrateUserFromCloud(session.user);
        }
        if (isMounted) setIsLoading(false);
      });

      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!isMounted) return;
        if (event === "PASSWORD_RECOVERY") {
          if (session?.user) {
            await hydrateUserFromCloud(session.user);
          }
          router.push("/auth/reset-password");
          setIsLoading(false);
          return;
        } else if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
          if (session?.user) {
            await hydrateUserFromCloud(session.user);
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          localStorage.removeItem("su_user_session");
        }
        setIsLoading(false);
      });

      return () => {
        isMounted = false;
        authListener?.subscription?.unsubscribe();
      };
    } else {
      setIsLoading(false);
    }
  }, []);

  // Cross-Tab Storage Event Listener for real-time session synchronization (e.g. cross-tab logout)
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === "su_user_session") {
        if (e.newValue === null) {
          // Tab A logged out: immediately terminate session in all other open tabs
          setUser(null);
        } else if (e.newValue && !user) {
          // Tab A logged in: sync user session into this tab without loop
          try {
            const parsed = JSON.parse(e.newValue);
            if (parsed && parsed.id) {
              setUser(parsed);
            }
          } catch (err) { }
        }
      }
    };

    window.addEventListener("storage", handleStorageEvent);
    return () => window.removeEventListener("storage", handleStorageEvent);
  }, [user]);

  // 3. Heartbeat for real-time active session tracking
  React.useEffect(() => {
    if (!user) return;

    const updateHeartbeat = () => {
      try {
        const savedSessionsStr = localStorage.getItem("su_active_sessions") || "[]";
        let sessions = JSON.parse(savedSessionsStr);
        if (!Array.isArray(sessions)) sessions = [];

        const now = Date.now();
        // Remove stale sessions older than 2 minutes
        sessions = sessions.filter((s: any) => s && s.lastActive && now - s.lastActive < 120000 && s.userId !== user.id);

        // Add current active user session
        sessions.push({
          userId: user.id,
          name: user.name,
          nameAr: user.nameAr,
          nameEn: user.nameEn,
          email: user.email,
          avatar: user.avatar || "",
          role: user.role,
          lastActive: now
        });

        localStorage.setItem("su_active_sessions", JSON.stringify(sessions));
      } catch (e) { }
    };

    updateHeartbeat();
    const interval = setInterval(updateHeartbeat, 15000);

    return () => clearInterval(interval);
  }, [user]);

  const login = async (email: string, password: string, rememberMe: boolean): Promise<boolean> => {
    setIsLoading(true);

    // Authentication is exclusively through Supabase Auth — no local fallback
    if (!isSupabaseConfigured || !supabase) {
      setIsLoading(false);
      throw new Error("خدمة المصادقة غير متوفرة حالياً. يرجى المحاولة لاحقاً.");
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
      if (error || !data?.user) {
        setIsLoading(false);
        if (error?.message?.toLowerCase().includes("email not confirmed") || error?.message?.toLowerCase().includes("not confirmed")) {
          throw new Error("لم يتم تأكيد بريدك الإلكتروني بعد. يرجى فتح بريدك الإلكتروني والضغط على رابط التفعيل للمتابعة.");
        }
        return false;
      }

      // Query complete profile row from Supabase Cloud DB
      let dbProfile: any = null;
      try {
        const { data: profileRow } = await supabase.from("profiles").select("*").eq("id", data.user.id).maybeSingle();
        if (!profileRow) {
          // Fallback: query by email
          const { data: byEmail } = await supabase.from("profiles").select("*").eq("email", email.toLowerCase().trim()).maybeSingle();
          if (byEmail) dbProfile = byEmail;
        } else {
          dbProfile = profileRow;
        }
      } catch (e) { }

      const isCompleted = dbProfile ? (dbProfile.is_profile_completed !== false) : true;
      const sessionUser: UserProfile = {
        id: dbProfile?.id || data.user.id,
        name: dbProfile?.name || data.user.user_metadata?.name || email.split("@")[0],
        nameAr: dbProfile?.name_ar || "",
        nameEn: dbProfile?.name_en || "",
        email: email.toLowerCase().trim(),
        level: dbProfile?.level || data.user.user_metadata?.level || "الفرقة الأولى",
        department: dbProfile?.department || data.user.user_metadata?.department || "تكنولوجيا المعلومات وعلوم الحاسب (IT & CS)",
        studentId: dbProfile?.student_id || dbProfile?.studentId || data.user.user_metadata?.student_id || "",
        bio: dbProfile?.bio || "طالب مسجل في المنصة الأكاديمية.",
        skills: Array.isArray(dbProfile?.skills) ? dbProfile.skills : (typeof dbProfile?.skills === "string" ? JSON.parse(dbProfile.skills || "[]") : []),
        socialLinks: dbProfile?.social_links || dbProfile?.socialLinks || {},
        avatar: dbProfile?.avatar || data.user.user_metadata?.avatar_url || "🎓",
        role: dbProfile?.role || "student",
        cvUrl: dbProfile?.cv_url || dbProfile?.cvUrl || "",
        projects: Array.isArray(dbProfile?.projects) ? dbProfile.projects : (typeof dbProfile?.projects === "string" ? JSON.parse(dbProfile.projects || "[]") : []),
        badges: dbProfile?.badges || ["طالب"],
        points: dbProfile?.points || 50,
        following: dbProfile?.following || [],
        isProfileComplete: isCompleted,
        needsOnboarding: !isCompleted,
        is_profile_completed: isCompleted,
        rememberMe
      };

      setUser(sessionUser);
      localStorage.setItem("su_user_session", JSON.stringify(sessionUser));
      setIsLoading(false);
      return true;
    } catch (e) {
      console.warn("Supabase auth error:", e);
      setIsLoading(false);
      throw e;
    }
  };

  const register = async (nameAr: string, nameEn: string, email: string, password: string, level = "الفرقة الأولى", department = "تكنولوجيا المعلومات وعلوم الحاسب (IT & CS)", studentId = ""): Promise<boolean | "requires_verification"> => {
    setIsLoading(true);

    const savedUsersStr = localStorage.getItem("su_registered_users") || "[]";
    const savedUsers = JSON.parse(savedUsersStr) as UserProfile[];

    // Validate Official University Email Domain (@su.edu.eg or @sinai.edu.eg)
    const lowerEmail = email.toLowerCase().trim();
    if (!lowerEmail.endsWith("@su.edu.eg") && !lowerEmail.endsWith("@sinai.edu.eg")) {
      setIsLoading(false);
      throw new Error("️ يرجى استخدام البريد الإلكتروني الجامعي الرسمي المنتهي بـ @su.edu.eg أو @sinai.edu.eg لتأكيد هويتك كطالب بجامعة سيناء.");
    }

    // Validate Password Complexity (Min 8 chars, letter, number, special char)
    const hasMinLen = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNum = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (!hasMinLen || !hasLetter || !hasNum || !hasSpecial) {
      setIsLoading(false);
      throw new Error("️ كلمة المرور ضعيفة! يجب أن تتكون من 8 خانات على الأقل وتتضمن حروفاً وأرقاماً ورموزاً مميزة (مثل !@#$).");
    }

    // Ensure email uniqueness globally
    const allExistingUsers = [...savedUsers];
    if (allExistingUsers.some((u) => u.email.toLowerCase() === lowerEmail)) {
      setIsLoading(false);
      throw new Error("️ هذا البريد الإلكتروني مسجل بالفعل في منصة الجامعة. يرجى الانتقال لتسجيل الدخول.");
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: existingCloud } = await supabase.from("profiles").select("id, email").eq("email", lowerEmail).maybeSingle();
        if (existingCloud) {
          setIsLoading(false);
          throw new Error("️ هذا البريد الإلكتروني مسجل بالفعل في منصة الجامعة. يرجى الانتقال لتسجيل الدخول.");
        }
      } catch (e) { }
    }

    let finalUserId = `user-${Date.now()}`;
    const generatedStudentId = studentId ? studentId.trim() : "";

    // Validate student_id uniqueness for registration
    if (generatedStudentId && isSupabaseConfigured && supabase) {
      try {
        const { data: existingStudentId } = await supabase.from("profiles").select("id").eq("student_id", generatedStudentId).limit(1).maybeSingle();
        if (existingStudentId) {
          setIsLoading(false);
          throw new Error("عذراً، هذا الرقم الأكاديمي مسجل بالفعل لطالب آخر.");
        }
      } catch (err: any) {
        if (err.message.includes("مسجل بالفعل")) throw err;
      }
    }

    // Save profile to Supabase Cloud DB & Auth if available
    let requiresEmailConfirmation = false;

    if (isSupabaseConfigured && supabase) {
      try {
        const callbackUrl = getAuthCallbackURL();
        const fullStudentName = typeof window !== "undefined" && document.documentElement.dir === "rtl" ? nameAr : nameEn;
        const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: callbackUrl,
            data: { name: fullStudentName, level, department, student_id: generatedStudentId }
          }
        });

        if (signUpErr) {
          setIsLoading(false);
          const rawMsg = signUpErr.message || "";
          if (rawMsg.includes("User already registered") || rawMsg.includes("already registered") || rawMsg.includes("user_already_exists")) {
            const isRtl = typeof window !== "undefined" && document.documentElement.dir === "rtl";
            throw new Error(
              isRtl
                ? "هذا البريد الإلكتروني مسجل بالفعل في المنصة. إذا كنت قد سجلت سابقاً باستخدام جوجل (Google)، يرجى الانتقال لصفحة تسجيل الدخول واختيار (تسجيل الدخول بـ Google)."
                : "This email address is already registered. If you previously logged in with Google, please use (Sign in with Google) on the login page."
            );
          }
          if (rawMsg && rawMsg !== "{}" && rawMsg.trim()) {
            throw new Error(`️ ${rawMsg}`);
          } else {
            throw new Error("تعذر إرسال بريد التأكيد. يرجى التحقق من إعدادات البريد في Supabase أو المحاولة لاحقاً.");
          }
        }

        if (signUpData?.user?.id) {
          finalUserId = signUpData.user.id;
        }

        // If user is returned but session is null, email confirmation is required!
        if (signUpData?.user && !signUpData.session) {
          requiresEmailConfirmation = true;
        }
      } catch (e: any) {
        setIsLoading(false);
        if (e?.message && e.message !== "{}") {
          throw e; // rethrow formatted error
        }
        throw new Error("حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.");
      }
    }

    if (requiresEmailConfirmation) {
      setIsLoading(false);
      return "requires_verification";
    }

    const fullStudentName = typeof window !== "undefined" && document.documentElement.dir === "rtl" ? nameAr : nameEn;

    const newUser: UserProfile = {
      id: finalUserId,
      name: fullStudentName,
      nameAr,
      nameEn,
      email,
      level,
      department,
      studentId: generatedStudentId,
      bio: "طالب جديد في منصة SU IT Guide.",
      skills: [],
      socialLinks: { github: "", linkedin: "" },
      avatar: "🎓",
      role: "student", // Strictly student role for all registrations!
      cvUrl: "",
      projects: [],
      badges: ["الدخول الأول"],
      points: 50,
      following: [],
      is_profile_completed: false
    };

    try {
      await insertToSupabase("profiles", {
        id: finalUserId,
        email,
        name: fullStudentName,
        name_ar: nameAr,
        name_en: nameEn,
        role: "student",
        level,
        department,
        student_id: generatedStudentId,
        avatar: "🎓"
      });
    } catch (err: any) {
      if (err?.code === "23505" || err?.message?.includes("duplicate key")) {
        // PostgreSQL unique constraint violation (Race Condition caught!)
        setIsLoading(false);
        if (err?.message?.includes("student_id")) {
          throw new Error("عذراً، هذا الرقم الأكاديمي مسجل بالفعل لطالب آخر. (تطابق أثناء المعالجة)");
        } else {
          throw new Error("هذا البريد الإلكتروني أو الرقم الأكاديمي مسجل بالفعل في منصة الجامعة.");
        }
      }
      console.warn("Error inserting to profiles:", err);
    }

    // Save to local storage list
    savedUsers.push(newUser);
    localStorage.setItem("su_registered_users", JSON.stringify(savedUsers));
    window.dispatchEvent(new Event("su_users_updated"));

    // Sign in active session
    setUser(newUser);
    localStorage.setItem("su_user_session", JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const loginWithProvider = async (provider: "google" | "github"): Promise<boolean> => {
    if (inFlightOAuthRef.current.has(provider)) {
      console.warn(`[OAuth Idempotency] Duplicate OAuth request blocked for: ${provider}`);
      return false;
    }
    inFlightOAuthRef.current.add(provider);
    setIsLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const callbackUrl = getAuthCallbackURL();
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: provider,
          options: {
            redirectTo: callbackUrl,
            queryParams: {
              prompt: 'select_account'
            }
          }
        });
        if (!error && data?.url) {
          window.location.href = data.url;
          return true;
        }
      }

      // Fallback OAuth session (Strictly Student Role!)
      const providerUser: UserProfile = {
        id: `user-${provider}-${Date.now()}`,
        name: provider === "google" ? "طالب Google" : "طالب GitHub",
        email: provider === "google" ? "student.google@gmail.com" : "student.git@github.com",
        level: "الفرقة الأولى",
        department: "تكنولوجيا المعلومات (IT)",
        studentId: `2026${Math.floor(1000 + Math.random() * 9000)}`,
        bio: `مستخدم مسجل عبر ${provider}`,
        skills: [],
        socialLinks: { github: "", linkedin: "" },
        avatar: provider === "google" ? "" : "",
        role: "student",
        cvUrl: "",
        projects: [],
        badges: ["الدخول عبر الهوية الرقمية"],
        points: 100,
        following: [],
        is_profile_completed: false
      };

      setUser(providerUser);
      localStorage.setItem("su_user_session", JSON.stringify(providerUser));
      return true;
    } catch (e) {
      console.warn("Supabase OAuth error:", e);
      return false;
    } finally {
      setTimeout(() => {
        inFlightOAuthRef.current.delete(provider);
      }, 1500);
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setUser(null);
    localStorage.removeItem("su_user_session");
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn("Supabase sign out warning:", e);
      }
    }
    setIsLoading(false);
    router.push("/");
  };

  const updateProfile = async (updatedFields: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    if (inFlightUpdateProfileRef.current) {
      console.warn("[Profile Idempotency] Concurrent updateProfile blocked");
      return false;
    }
    inFlightUpdateProfileRef.current = true;

    try {
      const updatedUser = {
        ...user,
        ...updatedFields,
      };

      const updatePayload = {
        name: updatedUser.name,
        name_ar: updatedUser.nameAr || "",
        name_en: updatedUser.nameEn || "",
        level: updatedUser.level,
        department: updatedUser.department,
        student_id: updatedUser.studentId,
        bio: updatedUser.bio,
        avatar: updatedUser.avatar,
        // SECURITY: role is NOT sent from client — enforced by DB trigger protect_profile_role
        social_links: updatedUser.socialLinks || {},
        skills: updatedUser.skills || [],
        cv_url: updatedUser.cvUrl || "",
        projects: updatedUser.projects || [],
        points: updatedUser.points || 50,
        badges: updatedUser.badges || [],
        is_profile_completed: updatedUser.isProfileComplete ?? true,
        privacy_settings: updatedUser.privacySettings || { publicSkills: true, publicProjects: true },
        learning_state: updatedUser.learning_state !== undefined ? updatedUser.learning_state : user.learning_state,
        social_state: updatedUser.social_state !== undefined ? updatedUser.social_state : user.social_state
      };

      // Uniqueness validation for social links
      if (isSupabaseConfigured && supabase) {
        try {
          const linksToCheck = Object.values(updatedUser.socialLinks || {}).filter(url => typeof url === 'string' && url.trim().length > 0);
          if (linksToCheck.length > 0) {
            // Check if any of these links exist in other profiles
            const { data: allProfiles } = await supabase.from("profiles").select("id, social_links").neq("id", user.id);
            if (allProfiles) {
              for (const profile of allProfiles) {
                const otherLinks = Object.values(profile.social_links || {});
                const conflict = linksToCheck.some(link => otherLinks.includes(link));
                if (conflict) {
                  setIsLoading(false);
                  throw new Error(" عذراً، هذا الرابط (Portfolio/GitHub/LinkedIn) مسجل بالفعل باسم طالب آخر في المنصة. يرجى استخدام الروابط الخاصة بك فقط.");
                }
              }
            }
          }
        } catch (err: any) {
          setIsLoading(false);
          if (err.message.includes("مسجل بالفعل")) throw err;
          console.warn("Uniqueness check warning:", err);
        }
      }

      // Uniqueness validation for student ID
      if (updatedUser.studentId && isSupabaseConfigured && supabase) {
        try {
          const { data: existingStudentId } = await supabase.from("profiles").select("id").eq("student_id", updatedUser.studentId).neq("id", user.id).limit(1).maybeSingle();
          if (existingStudentId) {
            setIsLoading(false);
            throw new Error("عذراً، هذا الرقم الأكاديمي مسجل بالفعل لطالب آخر.");
          }
        } catch (err: any) {
          setIsLoading(false);
          if (err.message.includes("مسجل بالفعل")) throw err;
          console.warn("Student ID uniqueness check warning:", err);
        }
      }

      if (isSupabaseConfigured && supabase) {
        try {
          const fullPayload = {
            ...updatePayload,
            id: user.id,
            email: user.email
          };
          const { error } = await supabase.from("profiles").upsert(fullPayload, { onConflict: "id" }).select();

          if (error) {
            if (error.code === "23505" || error.message?.includes("duplicate key")) {
               throw new Error("عذراً، هذا الرقم الأكاديمي مسجل بالفعل لطالب آخر.");
            }
            console.warn("Supabase upsert by ID failed, attempting by email fallback:", error);
            // If ID conflict fails (e.g., ID changed but email same), try updating by email
            const { data: existingUser } = await supabase.from("profiles").select("id").eq("email", user.email.toLowerCase().trim()).maybeSingle();
            if (existingUser) {
              const { error: updateErr } = await supabase.from("profiles").update(updatePayload).eq("id", existingUser.id);
              if (updateErr && (updateErr.code === "23505" || updateErr.message?.includes("duplicate key"))) {
                 throw new Error("عذراً، هذا الرقم الأكاديمي مسجل بالفعل لطالب آخر.");
              }
            } else {
              // Force insert if totally missing
              const { error: insertErr } = await supabase.from("profiles").insert([fullPayload]);
              if (insertErr && (insertErr.code === "23505" || insertErr.message?.includes("duplicate key"))) {
                 throw new Error("عذراً، هذا الرقم الأكاديمي مسجل بالفعل لطالب آخر.");
              }
            }
          }
        } catch (err: any) {
          console.warn("Cloud sync error during updateProfile:", err);
          if (err.message && err.message.includes("مسجل بالفعل")) {
            setIsLoading(false);
            throw err;
          }
        }
      }

      setUser(updatedUser);
      localStorage.setItem("su_user_session", JSON.stringify(updatedUser));

      const savedUsersStr = localStorage.getItem("su_registered_users") || "[]";
      const savedUsers = JSON.parse(savedUsersStr) as UserProfile[];
      const userIndex = savedUsers.findIndex((u) => u.id === user.id || (u.email && user.email && u.email.toLowerCase().trim() === user.email.toLowerCase().trim()));
      if (userIndex !== -1) {
        savedUsers[userIndex] = {
          ...savedUsers[userIndex],
          ...updatedUser
        };
      } else {
        savedUsers.push(updatedUser);
      }
      localStorage.setItem("su_registered_users", JSON.stringify(savedUsers));
      window.dispatchEvent(new Event("su_users_updated"));

      return true;
    } finally {
      inFlightUpdateProfileRef.current = false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginWithProvider,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
