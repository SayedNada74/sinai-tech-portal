"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { fetchFromSupabase, insertToSupabase, updateInSupabase, isSupabaseConfigured, supabase } from "@/lib/supabase";
import { getAuthCallbackURL } from "@/lib/auth-helpers";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
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
}

interface AuthContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  register: (name: string, email: string, password: string, level?: string, department?: string, studentId?: string) => Promise<boolean>;
  loginWithProvider: (provider: "google" | "github") => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updatedProfile: Partial<UserProfile>) => Promise<boolean>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Standard predefined accounts with strict role definitions & passwords
const DEFAULT_ACCOUNTS: UserProfile[] = [
  {
    id: "user-1",
    name: "سيد محمود",
    email: "sayed@example.com",
    password: "123",
    level: "الفرقة الأولى",
    department: "تكنولوجيا المعلومات (IT)",
    studentId: "20230109",
    bio: "طالب متحمس لبرمجة وتطوير تطبيقات الويب والذكاء الاصطناعي بجامعة سيناء.",
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
    socialLinks: { github: "https://github.com/sayed-mahmoud", linkedin: "https://linkedin.com/in/sayed-mahmoud" },
    avatar: "🧑‍🎓",
    role: "student",
    cvUrl: "resume.pdf",
    projects: [
      { title: "SU IT Guide Platform", description: "البوابة الذكية المخصصة لمساعدة وتوجيه طلاب تقنية المعلومات بجامعة سيناء.", link: "https://github.com/sayed-mahmoud/su-it-guide" }
    ],
    badges: ["الدخول الأول", "مكتمل الملف الشخصي"],
    points: 350,
    following: []
  },
  {
    id: "user-admin",
    name: "سيد المسؤول",
    email: "admin@example.com",
    password: "admin",
    level: "الكادر الإداري والفني",
    department: "إدارة المنصة والسياسات",
    studentId: "ADM-001",
    bio: "مسؤول النظام الإداري",
    skills: [],
    socialLinks: {},
    avatar: "⚙️",
    role: "admin",
    badges: ["مدير النظام"],
    points: 1000,
    following: []
  },
  {
    id: "user-super",
    name: "أحمد المشرف الأعلى",
    email: "super@example.com",
    password: "super",
    level: "الإدارة العليا للجامعة",
    department: "الإشراف والرقابة العامة",
    studentId: "SUP-001",
    bio: "المشرف الأعلى على المنصة",
    skills: [],
    socialLinks: {},
    avatar: "👑",
    role: "super-admin",
    badges: ["مشرف أعلى"],
    points: 1000,
    following: []
  },
  {
    id: "user-student",
    name: "أحمد الطالب",
    email: "student@example.com",
    password: "123",
    level: "الفرقة الأولى",
    department: "تكنولوجيا المعلومات (IT)",
    studentId: "20230101",
    bio: "حساب طالب تجريبي",
    skills: [],
    socialLinks: {},
    avatar: "🧑‍🎓",
    role: "student",
    badges: ["طالب"],
    points: 100,
    following: []
  },
  {
    id: "user-mod",
    name: "منى المنسقة",
    email: "mod@example.com",
    password: "mod",
    level: "كادر التنسيق والرقابة",
    department: "الرقابة وجودة المحتوى",
    studentId: "MOD-001",
    bio: "منسقة ومراجعة المحتوى الأكاديمي والمنتدى",
    skills: [],
    socialLinks: {},
    avatar: "👩‍🏫",
    role: "moderator",
    badges: ["منسق محتوى"],
    points: 500,
    following: []
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    // 1. Initialize registered users list & sanitize passwords
    const savedRegs = localStorage.getItem("su_registered_users");
    let currentUsers: UserProfile[] = [];
    if (savedRegs) {
      try {
        currentUsers = JSON.parse(savedRegs);
      } catch (e) { }
    }

    // Merge default accounts and ensure legacy accounts have fallback passwords
    DEFAULT_ACCOUNTS.forEach((da) => {
      const idx = currentUsers.findIndex((u) => u.email.toLowerCase() === da.email.toLowerCase());
      if (idx === -1) {
        currentUsers.push(da);
      } else {
        // Ensure default accounts retain correct role & password
        currentUsers[idx].password = currentUsers[idx].password || da.password;
        currentUsers[idx].role = currentUsers[idx].role || da.role;
      }
    });

    // Fetch cloud profiles from Supabase if available for cross-device sync
    const syncCloudProfiles = async () => {
      if (isSupabaseConfigured) {
        const cloudProfiles = await fetchFromSupabase<any>("profiles");
        if (cloudProfiles && Array.isArray(cloudProfiles) && cloudProfiles.length > 0) {
          cloudProfiles.forEach((cp) => {
            if (cp.email) {
              const idx = currentUsers.findIndex((u) => u.email.toLowerCase() === cp.email.toLowerCase());
              const mappedUser: UserProfile = {
                id: cp.id || `user-${Date.now()}`,
                name: cp.name || cp.email.split("@")[0],
                email: cp.email,
                password: cp.password || "123456",
                level: cp.level || "الفرقة الأولى",
                department: cp.department || "تكنولوجيا المعلومات (IT)",
                studentId: cp.student_id || cp.studentId || "20261001",
                bio: cp.bio || "طالب مسجل في المنصة",
                skills: cp.skills || [],
                socialLinks: cp.socialLinks || {},
                avatar: cp.avatar || "🎓",
                role: cp.role || "student",
                badges: cp.badges || ["طالب"],
                points: cp.points || 50,
                following: cp.following || []
              };
              if (idx === -1) {
                currentUsers.push(mappedUser);
              } else {
                currentUsers[idx] = { ...currentUsers[idx], ...mappedUser };
              }
            }
          });
          localStorage.setItem("su_registered_users", JSON.stringify(currentUsers));
        }
      }
    };
    syncCloudProfiles();

    // Ensure any user without a password has a default fallback password
    currentUsers = currentUsers.map((u) => ({
      ...u,
      password: u.password || "123456"
    }));

    localStorage.setItem("su_registered_users", JSON.stringify(currentUsers));

    // 2. Check active user session
    const savedUser = localStorage.getItem("su_user_session");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("su_user_session");
      }
    }
    setIsLoading(false);
  }, []);

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
          email: user.email,
          avatar: user.avatar || "👤",
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

    const savedUsersStr = localStorage.getItem("su_registered_users");
    let currentUsers: UserProfile[] = DEFAULT_ACCOUNTS;
    if (savedUsersStr) {
      try {
        currentUsers = JSON.parse(savedUsersStr) as UserProfile[];
      } catch (e) { }
    }

    DEFAULT_ACCOUNTS.forEach((da) => {
      const idx = currentUsers.findIndex((u) => u.email.toLowerCase() === da.email.toLowerCase());
      if (idx === -1) {
        currentUsers.push(da);
      } else {
        currentUsers[idx].password = currentUsers[idx].password || da.password;
        currentUsers[idx].role = currentUsers[idx].role || da.role;
      }
    });

    // Sanitize
    currentUsers = currentUsers.map((u) => ({
      ...u,
      password: u.password || "123456"
    }));

    // 1. Try Supabase cloud auth if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (!error && data?.user) {
          const matched = currentUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
          const sessionUser: UserProfile = matched || {
            id: data.user.id,
            name: data.user.user_metadata?.name || email.split("@")[0],
            email: email,
            level: data.user.user_metadata?.level || "الفرقة الأولى",
            department: data.user.user_metadata?.department || "تكنولوجيا المعلومات (IT)",
            studentId: data.user.user_metadata?.student_id || "20261001",
            bio: "مستخدم مسجل في المنصة",
            skills: [],
            socialLinks: {},
            avatar: "🎓",
            role: "student",
            rememberMe
          };

          setUser(sessionUser);
          localStorage.setItem("su_user_session", JSON.stringify(sessionUser));
          setIsLoading(false);
          return true;
        }
      } catch (e) {
        console.warn("Supabase auth failed, falling back to local credentials:", e);
      }
    }

    // 2. Strict Local Credentials Check
    const lowerInputEmail = email.toLowerCase().trim();
    const isDemoAccount = DEFAULT_ACCOUNTS.some(da => da.email.toLowerCase() === lowerInputEmail);
    if (!isDemoAccount) {
      if (!lowerInputEmail.endsWith("@su.edu.eg") && !lowerInputEmail.endsWith("@sinai.edu.eg")) {
        setIsLoading(false);
        throw new Error("⚠️ لا يُسمح بتسجيل الدخول إلا بالبريد الإلكتروني الجامعي الرسمي المعتمد من جامعة سيناء (username@su.edu.eg).");
      }
    }

    const matchedUser = currentUsers.find((u) => u.email.toLowerCase() === lowerInputEmail);

    // FAILED: Email does NOT exist in registered users
    if (!matchedUser) {
      setIsLoading(false);
      return false;
    }

    // FAILED: Check Password Match Strictly!
    const expectedPassword = matchedUser.password || "123456";
    if (expectedPassword !== password) {
      setIsLoading(false);
      return false; // Strictly return false on password mismatch!
    }

    // FAILED: Check if account is suspended
    if (matchedUser.bio && matchedUser.bio.includes("[SUSPENDED]")) {
      setIsLoading(false);
      throw new Error("🚫 هذا الحساب مجمد وموقوف مؤقتاً بقرار إداري. جميع بياناتك ومحفوظاتك وتقدمك الأكاديمي محفوظ بأمان، يرجى التواصل مع إدارة النظام.");
    }

    // SUCCESS: Authenticate and grant user session
    const sessionUser: UserProfile = {
      ...matchedUser,
      rememberMe
    };

    setUser(sessionUser);
    localStorage.setItem("su_user_session", JSON.stringify(sessionUser));
    setIsLoading(false);
    return true;
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    level: string = "الفرقة الأولى",
    department: string = "تكنولوجيا المعلومات (IT)",
    studentId: string = ""
  ): Promise<boolean> => {
    setIsLoading(true);

    const savedUsersStr = localStorage.getItem("su_registered_users") || "[]";
    const savedUsers = JSON.parse(savedUsersStr) as UserProfile[];

    // Validate Official University Email Domain (@su.edu.eg or @sinai.edu.eg)
    const lowerEmail = email.toLowerCase().trim();
    if (!lowerEmail.endsWith("@su.edu.eg") && !lowerEmail.endsWith("@sinai.edu.eg")) {
      setIsLoading(false);
      throw new Error("⚠️ يرجى استخدام البريد الإلكتروني الجامعي الرسمي المنتهي بـ @su.edu.eg لتأكيد هويتك كطالب بجامعة سيناء.");
    }

    // Validate Password Complexity (Min 8 chars, letter, number, special char)
    const hasMinLen = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNum = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (!hasMinLen || !hasLetter || !hasNum || !hasSpecial) {
      setIsLoading(false);
      throw new Error("⚠️ كلمة المرور ضعيفة! يجب أن تتكون من 8 خانات على الأقل وتتضمن حروفاً وأرقاماً ورموزاً مميزة (مثل !@#$).");
    }

    // Check if email already registered across all registered and default accounts
    const allExistingUsers = [...DEFAULT_ACCOUNTS, ...savedUsers];
    if (allExistingUsers.some((u) => u.email.toLowerCase() === lowerEmail)) {
      setIsLoading(false);
      throw new Error("⚠️ هذا البريد الإلكتروني مسجل بالفعل في منصة الجامعة. يرجى الانتقال لتسجيل الدخول.");
    }

    const userId = `user-${Date.now()}`;
    const generatedStudentId = studentId || `2026${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser: UserProfile = {
      id: userId,
      name,
      email,
      password: password || "123456", // Store user's chosen password
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
      following: []
    };

    // Save profile to Supabase Cloud DB & Auth if available
    if (isSupabaseConfigured && supabase) {
      try {
        const callbackUrl = getAuthCallbackURL();
        await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: callbackUrl,
            data: { name, level, department, student_id: generatedStudentId }
          }
        });
      } catch (e) {
        console.warn("Supabase signUp error:", e);
      }
    }

    await insertToSupabase("profiles", {
      id: userId,
      email,
      password: password || "123456",
      name,
      role: "student",
      level,
      department,
      student_id: generatedStudentId,
      avatar: "🎓"
    });

    // Save to local storage list
    savedUsers.push(newUser);
    localStorage.setItem("su_registered_users", JSON.stringify(savedUsers));

    // Sign in active session
    setUser(newUser);
    localStorage.setItem("su_user_session", JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const loginWithProvider = async (provider: "google" | "github"): Promise<boolean> => {
    setIsLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const callbackUrl = getAuthCallbackURL();
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: provider,
          options: {
            redirectTo: callbackUrl
          }
        });
        if (!error && data?.url) {
          window.location.href = data.url;
          return true;
        }
      } catch (e) {
        console.warn("Supabase OAuth error:", e);
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
      avatar: provider === "google" ? "🌐" : "🐈",
      role: "student",
      cvUrl: "",
      projects: [],
      badges: ["الدخول عبر الهوية الرقمية"],
      points: 100,
      following: []
    };

    setUser(providerUser);
    localStorage.setItem("su_user_session", JSON.stringify(providerUser));
    setIsLoading(false);
    return true;
  };

  const logout = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setUser(null);
    localStorage.removeItem("su_user_session");
    setIsLoading(false);
    router.push("/");
  };

  const updateProfile = async (updatedFields: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    setIsLoading(true);

    const updatedUser = {
      ...user,
      ...updatedFields,
    };

    await updateInSupabase("profiles", user.id, {
      name: updatedUser.name,
      level: updatedUser.level,
      department: updatedUser.department,
      student_id: updatedUser.studentId,
      bio: updatedUser.bio,
      avatar: updatedUser.avatar,
    });

    setUser(updatedUser);
    localStorage.setItem("su_user_session", JSON.stringify(updatedUser));

    const savedUsersStr = localStorage.getItem("su_registered_users") || "[]";
    const savedUsers = JSON.parse(savedUsersStr) as UserProfile[];
    const userIndex = savedUsers.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      savedUsers[userIndex] = updatedUser;
      localStorage.setItem("su_registered_users", JSON.stringify(savedUsers));
    }

    setIsLoading(false);
    return true;
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
