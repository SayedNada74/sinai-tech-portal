"use client";

import * as React from "react";
import { COURSES, Course } from "@/lib/courses-data";
import { RESOURCES, Resource } from "@/lib/resources-data";
import { ROADMAPS, Roadmap } from "@/lib/roadmaps-data";
import { useAuth, UserProfile } from "./auth-context";
import { fetchFromSupabase, insertToSupabase, updateInSupabase, isSupabaseConfigured, supabase } from "@/lib/supabase";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: "news" | "registration" | "midterms" | "finals" | "scholarships" | "internships" | "events" | "maintenance";
  date: string;
  scheduledDate?: string;
  published: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  pinned: boolean;
}

export interface AuditLog {
  id: string;
  userEmail: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
  category: "auth" | "course" | "resource" | "review" | "announcement" | "settings";
}

export interface ErrorIncident {
  id: string;
  title: string;
  statusCode: number;
  message: string;
  timestamp: string;
  type: "api" | "auth" | "app" | "performance";
}

export interface PlatformSettings {
  siteName: string;
  logo: string;
  contactEmail: string;
  maintenanceMode: boolean;
  theme: "light" | "dark" | "system";
  featureFlags: {
    gpaPredictor: boolean;
    aiAssistant: boolean;
    courseReviews: boolean;
    resourceSharing: boolean;
  };
}

interface AdminContextType {
  // State
  users: UserProfile[];
  courses: Course[];
  resources: Resource[];
  roadmaps: Roadmap[];
  announcements: Announcement[];
  faqs: FAQItem[];
  auditLogs: AuditLog[];
  settings: PlatformSettings;
  incidents: ErrorIncident[];
  aiConfig: {
    systemPrompt: string;
    temperature: number;
    suggestedReplies: string[];
  };

  // User methods
  addUserAccount: (newUser: Partial<UserProfile> & { role: UserProfile["role"] }) => void;
  updateUserRole: (userId: string, role: UserProfile["role"]) => void;
  suspendUser: (userId: string, suspend: boolean) => void;
  deleteUser: (userId: string) => void;
  resetUserPassword: (userId: string) => void;
  updateUserProfileAdmin: (userId: string, data: Partial<UserProfile>) => void;
  bulkUpdateRoles: (userIds: string[], role: UserProfile["role"]) => void;
  bulkDeleteUsers: (userIds: string[]) => void;

  // Course methods
  addCourse: (course: Course) => void;
  updateCourse: (code: string, updatedCourse: Course) => void;
  deleteCourse: (code: string) => void;
  archiveCourse: (code: string, archive: boolean) => void;

  // Resource methods
  approveResource: (id: string, approve: boolean) => Promise<boolean>;
  addResourceAdmin: (res: Omit<Resource, "id" | "uploadDate" | "downloadCount" | "rating" | "reviews">) => Promise<boolean>;
  editResourceAdmin: (id: string, updated: Partial<Resource>) => Promise<boolean>;
  deleteResourceAdmin: (id: string) => Promise<boolean>;
  featureResource: (id: string, featured: boolean) => Promise<boolean>;

  // Announcement methods
  addAnnouncement: (ann: Omit<Announcement, "id" | "date">) => Promise<boolean>;
  updateAnnouncement: (id: string, updated: Partial<Announcement>) => Promise<boolean>;
  deleteAnnouncement: (id: string) => Promise<boolean>;

  // Roadmap methods
  addRoadmap: (roadmap: Omit<Roadmap, "id">) => void;
  updateRoadmap: (id: string, updated: Partial<Roadmap>) => void;
  deleteRoadmap: (id: string) => void;

  // FAQ methods
  addFaq: (faq: Omit<FAQItem, "id">) => void;
  updateFaq: (id: string, updated: Partial<FAQItem>) => void;
  deleteFaq: (id: string) => void;

  // AI Knowledge Base methods
  updateAiConfig: (updated: Partial<AdminContextType["aiConfig"]>) => void;

  // Settings methods
  updateSettings: (updated: Partial<PlatformSettings>) => void;

  // Audit Logs methods
  logAction: (action: string, details: string, category: AuditLog["category"]) => void;
  clearAuditLogs: () => void;
  triggerMockError: (title: string, message: string, type: ErrorIncident["type"]) => void;
}

const AdminContext = React.createContext<AdminContextType | undefined>(undefined);

// Initial state data
const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: "ann-1", title: "بدء التسجيل الصيفي لمقررات الفرقة الثانية والثالثة", content: "تعلن إدارة التسجيل عن بدء فتح نظام التسجيل الصيفي ابتداءً من الأحد القادم وحسب الساعات المعتمدة المتبقية.", category: "registration", date: "2026-07-10", published: true },
  { id: "ann-2", title: "مواعيد امتحانات منتصف الفصل الدراسي الثاني", content: "يرجى العلم بأنه تم نشر جداول امتحانات الميدتيرم لجميع أقسام الكلية عبر لوحة الإعلانات الرسمية وموقع المنصة.", category: "midterms", date: "2026-07-12", published: true },
  { id: "ann-3", title: "إطلاق المساعد الأكاديمي الذكي بالمنصة", content: "يسعدنا الإعلان عن تفعيل المرشد الأكاديمي المعتمد بالذكاء الاصطناعي لمساعدتكم في حل مشكلات التسجيل وصعوبة المناهج.", category: "news", date: "2026-07-14", published: true }
];

const MOCK_FAQS: FAQItem[] = [
  { id: "faq-1", question: "ما هو الحد الأقصى للساعات المعتمدة للتسجيل في الفصل الدراسي الواحد؟", answer: "الحد الأقصى هو 18 ساعة معتمدة للطلاب ذوي المعدل التراكمي المرتفع، و12 ساعة معتمدة للطلاب الخاضعين للإنذار الأكاديمي.", category: "التسجيل", pinned: true },
  { id: "faq-2", question: "كيف يمكنني رفع معدلي التراكمي (GPA)؟", answer: "يمكنك إعادة دراسة المواد التيحصلت فيها على تقدير أقل من C لرفع التقدير وحساب المعدل مجدداً.", category: "الدرجات", pinned: true },
  { id: "faq-3", question: "ما هي شروط الالتحاق بمشروع التخرج (1)؟", answer: "يشترط إتمام 100 ساعة معتمدة بنجاح واجتياز المتطلبات المحددة بالقسم الأكاديمي الخاص بك.", category: "التخرج", pinned: false }
];

const DEFAULT_SETTINGS: PlatformSettings = {
  siteName: "دليل ومرشد طلاب IT",
  logo: "🎓",
  contactEmail: "it.guide@sinai.edu.eg",
  maintenanceMode: false,
  theme: "system",
  featureFlags: {
    gpaPredictor: true,
    aiAssistant: true,
    courseReviews: true,
    resourceSharing: true
  }
};

const DEFAULT_AI_CONFIG = {
  systemPrompt: "أنت مساعد أكاديمي ذكي لطلاب تكنولوجيا المعلومات بجامعة سيناء. أجب بأسلوب لبق وموجز وباللغة العربية.",
  temperature: 0.7,
  suggestedReplies: [
    "ما هي شروط تسجيل مشروع التخرج؟",
    "اقترح لي خطة دراسية متوازنة",
    "ما هي أصعب مواد قسم تكنولوجيا المعلومات؟"
  ]
};

const INITIAL_INCIDENTS: ErrorIncident[] = [
  { id: "err-1", title: "API Timeout Failure", statusCode: 504, message: "Gateway Timeout during course catalog synchronization.", timestamp: "2026-07-14 10:15", type: "api" },
  { id: "err-2", title: "Failed User Authentication", statusCode: 401, message: "Invalid credentials retry threshold exceeded.", timestamp: "2026-07-15 01:22", type: "auth" }
];

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const [users, setUsers] = React.useState<UserProfile[]>([]);
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [resources, setResources] = React.useState<Resource[]>([]);
  const [roadmaps, setRoadmaps] = React.useState<Roadmap[]>(ROADMAPS);
  const [announcements, setAnnouncements] = React.useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [faqs, setFaqs] = React.useState<FAQItem[]>(MOCK_FAQS);
  const [auditLogs, setAuditLogs] = React.useState<AuditLog[]>([]);
  const [settings, setSettings] = React.useState<PlatformSettings>(DEFAULT_SETTINGS);
  const [incidents, setIncidents] = React.useState<ErrorIncident[]>(INITIAL_INCIDENTS);
  const [aiConfig, setAiConfig] = React.useState(DEFAULT_AI_CONFIG);

  // Action in-flight mutex locks for rapid-click protection & idempotency
  const inFlightAdminActionRef = React.useRef<Set<string>>(new Set());

  // Initialize and Sync states
  React.useEffect(() => {
    const loadUsers = () => {
      const savedRegs = localStorage.getItem("su_registered_users");
      let currentUsers: UserProfile[] = [];
      if (savedRegs) {
        try {
          currentUsers = JSON.parse(savedRegs);
        } catch (e) { }
      }

      // Ensure we have some default roles for demo
      const defaultAccounts: UserProfile[] = [
        { id: "user-admin", name: "سيد المسؤول", nameAr: "سيد المسؤول", nameEn: "Sayed Admin", email: "admin@example.com", level: "الكادر الإداري والفني", department: "إدارة المنصة والسياسات", studentId: "ADM-001", bio: "مسؤول النظام الإداري", skills: [], socialLinks: { github: "", linkedin: "" }, avatar: "️", role: "admin", is_profile_completed: true },
        { id: "user-super", name: "سيد المشرف الأعلى", nameAr: "سيد المشرف الأعلى", nameEn: "Sayed Super Admin", email: "super@example.com", level: "الإدارة العليا للجامعة", department: "الإشراف والرقابة العامة", studentId: "SUP-001", bio: "المشرف الأعلى على المنصة", skills: [], socialLinks: { github: "", linkedin: "" }, avatar: "", role: "super-admin", is_profile_completed: true },
        { id: "user-mod", name: "سيد المنسق", nameAr: "سيد المنسق", nameEn: "Sayed Moderator", email: "mod@example.com", level: "كادر التنسيق الطلابي", department: "الرقابة وجودة المحتوى", studentId: "MOD-001", bio: "منسق ومراجع المحتوى والمنتدى", skills: [], socialLinks: { github: "", linkedin: "" }, avatar: "", role: "moderator", is_profile_completed: true }
      ];

      defaultAccounts.forEach(da => {
        const idx = currentUsers.findIndex(u => u.email?.toLowerCase().trim() === da.email.toLowerCase().trim() || u.id === da.id);
        if (idx === -1) {
          currentUsers.push(da);
        } else {
          currentUsers[idx] = {
            ...da,
            ...currentUsers[idx],
            name: currentUsers[idx].name || da.name,
            nameAr: currentUsers[idx].nameAr || da.nameAr,
            nameEn: currentUsers[idx].nameEn || da.nameEn,
            avatar: currentUsers[idx].avatar || da.avatar,
            studentId: currentUsers[idx].studentId || da.studentId,
            level: currentUsers[idx].level || da.level,
            department: currentUsers[idx].department || da.department,
            role: currentUsers[idx].role || da.role
          };
        }
      });
      setUsers(currentUsers);
      localStorage.setItem("su_registered_users", JSON.stringify(currentUsers));
    };

    loadUsers();

    window.addEventListener("su_users_updated", loadUsers);
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "su_registered_users") loadUsers();
    };
    window.addEventListener("storage", handleStorageChange);

    // 2. Courses setup - Always merge with default COURSES to ensure descriptionEn & outcomesEn exist
    const savedCourses = localStorage.getItem("su_courses_db");
    if (savedCourses) {
      try {
        const parsed: Course[] = JSON.parse(savedCourses);
        const merged = parsed.map((sc) => {
          const defaultC = COURSES.find((dc) => dc.code.toLowerCase() === sc.code.toLowerCase());
          return {
            ...defaultC,
            ...sc,
            descriptionEn: sc.descriptionEn || defaultC?.descriptionEn,
            outcomesEn: sc.outcomesEn || defaultC?.outcomesEn,
          };
        });
        setCourses(merged);
        localStorage.setItem("su_courses_db", JSON.stringify(merged));
      } catch (e) {
        setCourses(COURSES);
        localStorage.setItem("su_courses_db", JSON.stringify(COURSES));
      }
    } else {
      setCourses(COURSES);
      localStorage.setItem("su_courses_db", JSON.stringify(COURSES));
    }

    // 3. Resources setup (Hydrate from cache immediately, then authoritative fetch from Supabase)
    const savedResources = localStorage.getItem("su_resources_db");
    if (savedResources) {
      try { setResources(JSON.parse(savedResources)); } catch (e) { }
    } else {
      setResources(RESOURCES);
      localStorage.setItem("su_resources_db", JSON.stringify(RESOURCES));
    }

    const fetchAdminResourcesCloud = async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from("resources")
            .select("*")
            .order("created_at", { ascending: false });

          if (!error && data && data.length > 0) {
            const mappedRes: Resource[] = data.map((r: any) => ({
              id: r.id,
              title: r.title,
              description: r.description || "",
              courseCode: r.course_code || "",
              type: r.type || "pdf",
              author: r.author || "إدارة المنصة",
              uploadDate: r.upload_date || new Date().toISOString().split("T")[0],
              downloadCount: r.download_count || 0,
              rating: Number(r.rating) || 5,
              url: r.url || ""
            }));
            setResources(mappedRes);
            localStorage.setItem("su_resources_db", JSON.stringify(mappedRes));
          }
        } catch (err) {
          console.warn("[Admin Resources] Cloud fetch warning:", err);
        }
      }
    };
    fetchAdminResourcesCloud();

    // 4. Roadmaps setup - Always merge with default ROADMAPS to ensure titleEn, descriptionEn, durationEn & node En fields exist
    const savedRoadmaps = localStorage.getItem("su_roadmaps_db");
    if (savedRoadmaps) {
      try {
        const parsed: Roadmap[] = JSON.parse(savedRoadmaps);
        const merged = parsed.map((sr) => {
          const defaultR = ROADMAPS.find((dr) => dr.id === sr.id);
          const mergedNodes = (sr.nodes || []).map((sn, nIdx) => {
            const defaultN = defaultR?.nodes[nIdx];
            const mergedRes = (sn.resources || []).map((sRes, rIdx) => {
              const defaultRes = defaultN?.resources[rIdx];
              return {
                ...defaultRes,
                ...sRes,
                titleEn: sRes.titleEn || defaultRes?.titleEn,
              };
            });
            return {
              ...defaultN,
              ...sn,
              labelEn: sn.labelEn || defaultN?.labelEn,
              descriptionEn: sn.descriptionEn || defaultN?.descriptionEn,
              durationEn: sn.durationEn || defaultN?.durationEn,
              resources: mergedRes
            };
          });
          return {
            ...defaultR,
            ...sr,
            titleEn: sr.titleEn || defaultR?.titleEn,
            descriptionEn: sr.descriptionEn || defaultR?.descriptionEn,
            durationEn: sr.durationEn || defaultR?.durationEn,
            nodes: mergedNodes
          };
        });
        setRoadmaps(merged);
        localStorage.setItem("su_roadmaps_db", JSON.stringify(merged));
      } catch (e) {
        setRoadmaps(ROADMAPS);
        localStorage.setItem("su_roadmaps_db", JSON.stringify(ROADMAPS));
      }
    } else {
      setRoadmaps(ROADMAPS);
      localStorage.setItem("su_roadmaps_db", JSON.stringify(ROADMAPS));
    }

    // 5. CMS items: Announcements (Hydrate from cache, then authoritative fetch from Supabase)
    const savedAnn = localStorage.getItem("su_announcements");
    if (savedAnn) { try { setAnnouncements(JSON.parse(savedAnn)); } catch (e) { } }

    const fetchAdminAnnouncementsCloud = async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from("announcements")
            .select("*")
            .order("created_at", { ascending: false });

          if (!error && data && data.length > 0) {
            const mappedAnn: Announcement[] = data.map((a: any) => ({
              id: a.id,
              title: a.title,
              content: a.content,
              category: a.category || "news",
              date: a.date || new Date().toISOString().split("T")[0],
              published: Boolean(a.published)
            }));
            setAnnouncements(mappedAnn);
            localStorage.setItem("su_announcements", JSON.stringify(mappedAnn));
          }
        } catch (err) {
          console.warn("[Admin Announcements] Cloud fetch warning:", err);
        }
      }
    };
    fetchAdminAnnouncementsCloud();

    const savedFaq = localStorage.getItem("su_faqs");
    if (savedFaq) { try { setFaqs(JSON.parse(savedFaq)); } catch (e) { } }

    const savedAudit = localStorage.getItem("su_audit_logs");
    if (savedAudit) { try { setAuditLogs(JSON.parse(savedAudit)); } catch (e) { } }

    const savedSettings = localStorage.getItem("su_settings");
    if (savedSettings) { try { setSettings(JSON.parse(savedSettings)); } catch (e) { } }

    const savedAi = localStorage.getItem("su_ai_config");
    if (savedAi) { try { setAiConfig(JSON.parse(savedAi)); } catch (e) { } }

    const savedIncidents = localStorage.getItem("su_incidents");
    if (savedIncidents) { try { setIncidents(JSON.parse(savedIncidents)); } catch (e) { } }

    return () => {
      window.removeEventListener("su_users_updated", loadUsers);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Save changes wrapper helper
  const saveState = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // Log action helper
  const logAction = (action: string, details: string, category: AuditLog["category"]) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userEmail: user?.email || "system@su.edu",
      userName: user?.name || "النظام التلقائي",
      action,
      details,
      timestamp: new Date().toLocaleString("ar-EG"),
      category
    };
    const updated = [newLog, ...auditLogs];
    setAuditLogs(updated);
    saveState("su_audit_logs", updated);
  };

  // User Actions
  const updateUserRole = async (userId: string, role: UserProfile["role"]) => {
    const target = users.find(u => u.id === userId);
    const updated = users.map(u => u.id === userId ? { ...u, role } : u);
    setUsers(updated);
    saveState("su_registered_users", updated);
    logAction("تغيير صلاحية مستخدم", `تم تغيير صلاحية المستخدم ${target?.email} إلى: ${role}`, "auth");

    if (isSupabaseConfigured) {
      await updateInSupabase("profiles", userId, { role });
    }
  };

  const suspendUser = async (userId: string, suspend: boolean) => {
    const target = users.find(u => u.id === userId);
    const newBio = suspend ? "[SUSPENDED]" + (target?.bio || "") : (target?.bio || "").replace("[SUSPENDED]", "");
    const updated = users.map(u => u.id === userId ? { ...u, bio: newBio } : u);
    setUsers(updated);
    saveState("su_registered_users", updated);
    logAction(suspend ? "إيقاف حساب مستخدم" : "تنشيط حساب مستخدم", `تم تعديل حالة الحساب للبريد: ${target?.email}`, "auth");

    if (isSupabaseConfigured) {
      await updateInSupabase("profiles", userId, { bio: newBio });
    }
  };

  const deleteUser = async (userId: string) => {
    const target = users.find(u => u.id === userId);
    const updated = users.filter(u => u.id !== userId);
    setUsers(updated);
    saveState("su_registered_users", updated);
    logAction("حذف حساب مستخدم", `تم إزالة الحساب تماماً للبريد: ${target?.email}`, "auth");

    if (isSupabaseConfigured && supabase) {
      await supabase.from("profiles").delete().eq("id", userId);
    }
  };

  const resetUserPassword = (userId: string) => {
    const target = users.find(u => u.id === userId);
    logAction("إعادة تعيين كلمة المرور", `تم إرسال رابط تصفير كلمة المرور للمستخدم: ${target?.email}`, "auth");
  };

  const addUserAccount = async (newUser: Partial<UserProfile> & { role: UserProfile["role"] }) => {
    const id = typeof crypto !== "undefined" ? crypto.randomUUID() : `usr-${Date.now()}`;
    const fullUser: UserProfile = {
      id,
      name: newUser.name || "عضو جديد",
      email: newUser.email || `user_${Date.now()}@example.com`,
      level: newUser.level || (newUser.role === "student" ? "الفرقة الأولى" : "الكادر الإداري والفني"),
      department: newUser.department || (newUser.role === "student" ? "تكنولوجيا المعلومات (IT)" : "إدارة المنصة والسياسات"),
      studentId: newUser.studentId || (newUser.role === "super-admin" ? `SUP-${Math.floor(100 + Math.random() * 900)}` : newUser.role === "admin" ? `ADM-${Math.floor(100 + Math.random() * 900)}` : newUser.role === "moderator" ? `MOD-${Math.floor(100 + Math.random() * 900)}` : `${Math.floor(20230000 + Math.random() * 9999)}`),
      bio: newUser.bio || "حساب جديد في المنصة",
      skills: [],
      socialLinks: { github: "", linkedin: "" },
      avatar: newUser.avatar || (newUser.role === "super-admin" ? "" : newUser.role === "admin" ? "️" : newUser.role === "moderator" ? "" : "‍🎓"),
      role: newUser.role,
      is_profile_completed: false
    };
    const updated = [fullUser, ...users];
    setUsers(updated);
    saveState("su_registered_users", updated);
    logAction("إضافة حساب مستخدم جديد", `تم إنشاء حساب جديد بنجاح للبريد: ${fullUser.email} برتبة: ${fullUser.role}`, "auth");

    if (isSupabaseConfigured) {
      await insertToSupabase("profiles", {
        id: fullUser.id,
        email: fullUser.email,
        name: fullUser.name,
        role: fullUser.role,
        level: fullUser.level,
        department: fullUser.department,
        student_id: fullUser.studentId,
        avatar: fullUser.avatar,
        bio: fullUser.bio
      });
    }
  };

  const updateUserProfileAdmin = async (userId: string, data: Partial<UserProfile>) => {
    const updated = users.map(u => u.id === userId ? { ...u, ...data } : u);
    setUsers(updated);
    saveState("su_registered_users", updated);
    logAction("تعديل ملف مستخدم", `تم تعديل حقول الحساب للمعرف: ${userId}`, "auth");
  };

  const bulkUpdateRoles = (userIds: string[], role: UserProfile["role"]) => {
    const updated = users.map(u => userIds.includes(u.id) ? { ...u, role } : u);
    setUsers(updated);
    saveState("su_registered_users", updated);
    logAction("تحديث صلاحيات جماعي", `تغيير صلاحيات ${userIds.length} مستخدمين إلى: ${role}`, "auth");
  };

  const bulkDeleteUsers = (userIds: string[]) => {
    const updated = users.filter(u => !userIds.includes(u.id));
    setUsers(updated);
    saveState("su_registered_users", updated);
    logAction("حذف جماعي للمستخدمين", `تم حذف ${userIds.length} مستخدمين من قاعدة البيانات`, "auth");
  };

  // Course Actions
  const addCourse = (course: Course) => {
    const updated = [course, ...courses];
    setCourses(updated);
    saveState("su_courses_db", updated);
    logAction("إضافة مقرر دراسي جديد", `تم إدراج المقرر [${course.code} - ${course.arabic}] بنجاح.`, "course");
  };

  const updateCourse = (code: string, updatedCourse: Course) => {
    const updated = courses.map(c => c.code.toLowerCase() === code.toLowerCase() ? updatedCourse : c);
    setCourses(updated);
    saveState("su_courses_db", updated);
    logAction("تعديل مقرر دراسي", `تم تحديث حقول المقرر: ${code}`, "course");
  };

  const deleteCourse = (code: string) => {
    const updated = courses.filter(c => c.code.toLowerCase() !== code.toLowerCase());
    setCourses(updated);
    saveState("su_courses_db", updated);
    logAction("حذف مقرر دراسي", `تم إزالة المقرر: ${code} تماماً من خطة الأقسام.`, "course");
  };

  const archiveCourse = (code: string, archive: boolean) => {
    const updated = courses.map(c => c.code.toLowerCase() === code.toLowerCase() ? { ...c, type: archive ? "elective" as const : "required" as const } : c);
    setCourses(updated);
    saveState("su_courses_db", updated);
    logAction(archive ? "أرشفة مقرر" : "إعادة تفعيل مقرر مؤرشف", `المقرر المستهدف: ${code}`, "course");
  };

  // Resource Actions (with In-Flight Mutex Locks)
  const approveResource = async (id: string, approve: boolean): Promise<boolean> => {
    const lockKey = `approve_res_${id}`;
    if (inFlightAdminActionRef.current.has(lockKey)) return false;
    inFlightAdminActionRef.current.add(lockKey);

    const target = resources.find(r => r.id === id);
    const newAuthor = approve ? (target?.author || "").replace("[PENDING]", "").trim() : "[PENDING] " + (target?.author || "").replace("[PENDING]", "").trim();
    const updated = resources.map(r => r.id === id ? { ...r, author: newAuthor } : r);
    setResources(updated);
    saveState("su_resources_db", updated);
    logAction(approve ? "موافقة على مصدر" : "تعليق الموافقة للمصدر", `المصدر الأكاديمي: ${target?.title}`, "resource");

    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from("resources").update({ author: newAuthor }).eq("id", id);
      }
      return true;
    } catch (e) {
      console.warn("[Admin Resources] Cloud update warning:", e);
      return false;
    } finally {
      setTimeout(() => {
        inFlightAdminActionRef.current.delete(lockKey);
      }, 500);
    }
  };

  const addResourceAdmin = async (res: Omit<Resource, "id" | "uploadDate" | "downloadCount" | "rating">): Promise<boolean> => {
    const lockKey = `add_res_${res.title.trim()}_${res.courseCode.trim()}`;
    if (inFlightAdminActionRef.current.has(lockKey)) {
      console.warn(`[Admin Idempotency] Duplicate addResourceAdmin blocked for: ${lockKey}`);
      return false;
    }
    inFlightAdminActionRef.current.add(lockKey);

    const newRes: Resource = {
      ...res,
      id: `res-admin-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      uploadDate: new Date().toISOString().split("T")[0],
      downloadCount: 0,
      rating: 5
    };
    const updated = [newRes, ...resources];
    setResources(updated);
    saveState("su_resources_db", updated);
    logAction("إضافة ملف ومصدر دراسي", `رفع ملف: ${newRes.title}`, "resource");

    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from("resources").insert([{
          id: newRes.id,
          title: newRes.title,
          description: newRes.description,
          course_code: newRes.courseCode,
          type: newRes.type,
          author: newRes.author,
          upload_date: newRes.uploadDate,
          download_count: newRes.downloadCount,
          rating: newRes.rating,
          url: newRes.url
        }]);
      }
      return true;
    } catch (e) {
      console.warn("[Admin Resources] Cloud insert warning:", e);
      return false;
    } finally {
      setTimeout(() => {
        inFlightAdminActionRef.current.delete(lockKey);
      }, 1000);
    }
  };

  const editResourceAdmin = async (id: string, updatedFields: Partial<Resource>): Promise<boolean> => {
    const lockKey = `edit_res_${id}`;
    if (inFlightAdminActionRef.current.has(lockKey)) return false;
    inFlightAdminActionRef.current.add(lockKey);

    const updated = resources.map(r => r.id === id ? { ...r, ...updatedFields } : r);
    setResources(updated);
    saveState("su_resources_db", updated);
    logAction("تعديل ملف أكاديمي", `المعرف: ${id}`, "resource");

    try {
      if (isSupabaseConfigured && supabase) {
        const payload: Record<string, any> = {};
        if (updatedFields.title !== undefined) payload.title = updatedFields.title;
        if (updatedFields.description !== undefined) payload.description = updatedFields.description;
        if (updatedFields.courseCode !== undefined) payload.course_code = updatedFields.courseCode;
        if (updatedFields.type !== undefined) payload.type = updatedFields.type;
        if (updatedFields.author !== undefined) payload.author = updatedFields.author;
        if (updatedFields.url !== undefined) payload.url = updatedFields.url;
        if (updatedFields.rating !== undefined) payload.rating = updatedFields.rating;

        if (Object.keys(payload).length > 0) {
          await supabase.from("resources").update(payload).eq("id", id);
        }
      }
      return true;
    } catch (e) {
      console.warn("[Admin Resources] Cloud update warning:", e);
      return false;
    } finally {
      setTimeout(() => {
        inFlightAdminActionRef.current.delete(lockKey);
      }, 500);
    }
  };

  const deleteResourceAdmin = async (id: string): Promise<boolean> => {
    const lockKey = `delete_res_${id}`;
    if (inFlightAdminActionRef.current.has(lockKey)) return false;
    inFlightAdminActionRef.current.add(lockKey);

    const target = resources.find(r => r.id === id);
    const updated = resources.filter(r => r.id !== id);
    setResources(updated);
    saveState("su_resources_db", updated);
    logAction("حذف ملف ومصدر دراسي", `تم إزالة المصدر: ${target?.title}`, "resource");

    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from("resources").delete().eq("id", id);
      }
      return true;
    } catch (e) {
      console.warn("[Admin Resources] Cloud delete warning:", e);
      return false;
    } finally {
      setTimeout(() => {
        inFlightAdminActionRef.current.delete(lockKey);
      }, 500);
    }
  };

  const featureResource = async (id: string, featured: boolean): Promise<boolean> => {
    const lockKey = `feature_res_${id}`;
    if (inFlightAdminActionRef.current.has(lockKey)) return false;
    inFlightAdminActionRef.current.add(lockKey);

    const newRating = featured ? 5 : 4;
    const updated = resources.map(r => r.id === id ? { ...r, rating: newRating } : r);
    setResources(updated);
    saveState("su_resources_db", updated);
    logAction(featured ? "تثبيت مصدر مميز" : "إلغاء تثبيت المصدر المميز", `المعرف: ${id}`, "resource");

    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from("resources").update({ rating: newRating }).eq("id", id);
      }
      return true;
    } catch (e) {
      console.warn("[Admin Resources] Cloud feature update warning:", e);
      return false;
    } finally {
      setTimeout(() => {
        inFlightAdminActionRef.current.delete(lockKey);
      }, 500);
    }
  };

  // Announcement Actions (with In-Flight Mutex Locks)
  const addAnnouncement = async (ann: Omit<Announcement, "id" | "date">): Promise<boolean> => {
    const lockKey = `add_ann_${ann.title.trim()}_${ann.category}`;
    if (inFlightAdminActionRef.current.has(lockKey)) {
      console.warn(`[Admin Idempotency] Duplicate addAnnouncement blocked for: ${lockKey}`);
      return false;
    }
    inFlightAdminActionRef.current.add(lockKey);

    const newAnn: Announcement = {
      ...ann,
      id: `ann-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date: new Date().toISOString().split("T")[0]
    };
    const updated = [newAnn, ...announcements];
    setAnnouncements(updated);
    saveState("su_announcements", updated);
    logAction("نشر إعلان جديد", `عنوان الإعلان: ${newAnn.title}`, "announcement");

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from("announcements").insert([{
          id: newAnn.id,
          title: newAnn.title,
          content: newAnn.content,
          category: newAnn.category,
          date: newAnn.date,
          published: newAnn.published
        }]);
        if (error) {
          console.warn("[Admin Announcements] Cloud insert error:", error.message);
          return false;
        }
      }
      return true;
    } catch (e) {
      console.warn("[Admin Announcements] Cloud insert warning:", e);
      return false;
    } finally {
      setTimeout(() => {
        inFlightAdminActionRef.current.delete(lockKey);
      }, 1000);
    }
  };

  const updateAnnouncement = async (id: string, updatedFields: Partial<Announcement>): Promise<boolean> => {
    const lockKey = `update_ann_${id}`;
    if (inFlightAdminActionRef.current.has(lockKey)) return false;
    inFlightAdminActionRef.current.add(lockKey);

    const updated = announcements.map(a => a.id === id ? { ...a, ...updatedFields } : a);
    setAnnouncements(updated);
    saveState("su_announcements", updated);
    logAction("تعديل الإعلان منشور", `المعرف: ${id}`, "announcement");

    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from("announcements").update(updatedFields).eq("id", id);
      }
      return true;
    } catch (e) {
      console.warn("[Admin Announcements] Cloud update warning:", e);
      return false;
    } finally {
      setTimeout(() => {
        inFlightAdminActionRef.current.delete(lockKey);
      }, 500);
    }
  };

  const deleteAnnouncement = async (id: string): Promise<boolean> => {
    const lockKey = `delete_ann_${id}`;
    if (inFlightAdminActionRef.current.has(lockKey)) return false;
    inFlightAdminActionRef.current.add(lockKey);

    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    saveState("su_announcements", updated);
    logAction("حذف إعلان", `تم إزالة الإعلان بنجاح.`, "announcement");

    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from("announcements").delete().eq("id", id);
      }
      return true;
    } catch (e) {
      console.warn("[Admin Announcements] Cloud delete warning:", e);
      return false;
    } finally {
      setTimeout(() => {
        inFlightAdminActionRef.current.delete(lockKey);
      }, 500);
    }
  };

  // FAQ Actions
  const addFaq = (faq: Omit<FAQItem, "id">) => {
    const newFaq: FAQItem = {
      ...faq,
      id: `faq-${Date.now()}`
    };
    const updated = [newFaq, ...faqs];
    setFaqs(updated);
    saveState("su_faqs", updated);
    logAction("إضافة سؤال شائع", `سؤال: ${newFaq.question}`, "settings");
  };

  const updateFaq = (id: string, updatedFields: Partial<FAQItem>) => {
    const updated = faqs.map(f => f.id === id ? { ...f, ...updatedFields } : f);
    setFaqs(updated);
    saveState("su_faqs", updated);
    logAction("تعديل سؤال شائع", `المعرف: ${id}`, "settings");
  };

  const deleteFaq = (id: string) => {
    const updated = faqs.filter(f => f.id !== id);
    setFaqs(updated);
    saveState("su_faqs", updated);
    logAction("حذف سؤال شائع", `المعرف الاستدلالي: ${id}`, "settings");
  };

  // AI Knowledge Base configuration
  const updateAiConfig = (updatedFields: Partial<AdminContextType["aiConfig"]>) => {
    const updated = { ...aiConfig, ...updatedFields };
    setAiConfig(updated);
    saveState("su_ai_config", updated);
    logAction("تحديث نموذج الذكاء الاصطناعي", "تم تعديل الملقنات المقترحة وصياغة الملقن الأساسي للمنصة.", "settings");
  };

  // Settings Actions
  const updateSettings = (updatedFields: Partial<PlatformSettings>) => {
    const updated = { ...settings, ...updatedFields };
    setSettings(updated);
    saveState("su_settings", updated);
    logAction("تحديث إعدادات المنصة", "تغيير إعدادات المنصة الأساسية أو تفعيل وضع الصيانة.", "settings");
  };

  const clearAuditLogs = () => {
    setAuditLogs([]);
    localStorage.removeItem("su_audit_logs");
  };

  const triggerMockError = (title: string, message: string, type: ErrorIncident["type"]) => {
    const newErr: ErrorIncident = {
      id: `err-${Date.now()}`,
      title,
      statusCode: type === "api" ? 500 : type === "auth" ? 403 : 503,
      message,
      timestamp: new Date().toLocaleString("ar-EG"),
      type
    };
    const updated = [newErr, ...incidents];
    setIncidents(updated);
    saveState("su_incidents", updated);
  };

  // Roadmap Actions
  const addRoadmap = (roadmapData: Omit<Roadmap, "id">) => {
    const newRoadmap: Roadmap = {
      ...roadmapData,
      id: `roadmap-${Date.now()}`
    };
    const updated = [newRoadmap, ...roadmaps];
    setRoadmaps(updated);
    saveState("su_roadmaps_db", updated);
    logAction("إضافة مسار تعلم", `تمت إضافة مسار التعلم: ${newRoadmap.title}`, "course");
  };

  const updateRoadmap = (id: string, updatedFields: Partial<Roadmap>) => {
    const updated = roadmaps.map((r) => (r.id === id ? { ...r, ...updatedFields } : r));
    setRoadmaps(updated);
    saveState("su_roadmaps_db", updated);
    logAction("تحديث مسار تعلم", `تم تعديل مسار التعلم مع المعرف ${id}`, "course");
  };

  const deleteRoadmap = (id: string) => {
    const updated = roadmaps.filter((r) => r.id !== id);
    setRoadmaps(updated);
    saveState("su_roadmaps_db", updated);
    logAction("حذف مسار تعلم", `تم حذف مسار التعلم مع المعرف ${id}`, "course");
  };

  return (
    <AdminContext.Provider
      value={{
        users,
        courses,
        resources,
        roadmaps,
        announcements,
        faqs,
        auditLogs,
        settings,
        incidents,
        aiConfig,
        addUserAccount,
        addRoadmap,
        updateRoadmap,
        deleteRoadmap,
        updateUserRole,
        suspendUser,
        deleteUser,
        resetUserPassword,
        updateUserProfileAdmin,
        bulkUpdateRoles,
        bulkDeleteUsers,
        addCourse,
        updateCourse,
        deleteCourse,
        archiveCourse,
        approveResource,
        addResourceAdmin,
        editResourceAdmin,
        deleteResourceAdmin,
        featureResource,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        addFaq,
        updateFaq,
        deleteFaq,
        updateAiConfig,
        updateSettings,
        logAction,
        clearAuditLogs,
        triggerMockError
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = React.useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
