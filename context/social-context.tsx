"use client";

import * as React from "react";
import { useAuth, UserProfile } from "./auth-context";
import { fetchFromSupabase, insertToSupabase, updateInSupabase, deleteFromSupabase, supabase, isSupabaseConfigured } from "@/lib/supabase";

// Post Interfaces
export interface PostReply {
  id: string;
  author: string;
  authorEmail: string;
  avatar: string;
  content: string;
  date: string;
}

export interface PostComment {
  id: string;
  postId: string;
  author: string;
  authorEmail: string;
  avatar: string;
  content: string;
  date: string;
  replies: PostReply[];
}

export interface CommunityPost {
  id: string;
  title: string;
  category: "General Discussion" | "Study Help" | "Programming" | "AI" | "Web Development" | "Mobile Development" | "Career Advice" | "University News";
  content: string;
  date: string;
  author: string;
  authorEmail: string;
  avatar: string;
  likes: string[]; // array of user emails
  comments: PostComment[];
  attachmentUrl?: string;
  attachmentName?: string;
  reported: boolean;
}

// Career Interfaces
export interface CareerOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "internship" | "remote" | "part-time" | "freelance" | "graduate" | "competition" | "hackathon" | "scholarship" | "training";
  experience: "entry" | "mid" | "senior" | "all";
  department: "IT" | "CS" | "IS" | "all";
  description: string;
  link: string;
  dateAdded: string;
}

// Event Interfaces
export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: "workshop" | "seminar" | "competition" | "university" | "fair" | "meetup";
  speaker?: string;
}

// Calendar Interfaces
export interface CalendarReminder {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: "midterm" | "final" | "assignment" | "registration" | "event" | "holiday" | "personal";
  description?: string;
}

// Notification Interfaces
export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  date: string;
  type: "reply" | "resource" | "career" | "event" | "academic" | "badge" | "system" | "announcement";
  read: boolean;
  recipientEmail?: string;
}

interface SocialContextType {
  // States
  posts: CommunityPost[];
  careers: CareerOpportunity[];
  events: EventItem[];
  reminders: CalendarReminder[];
  notifications: NotificationItem[];
  savedJobs: string[]; // job ids
  savedEvents: string[]; // event ids
  savedPosts: string[]; // post ids
  moodleUrl: string;
  syncMoodle: (url: string) => Promise<void>;
  clearMoodle: () => void;

  // Post Actions
  createPost: (title: string, content: string, category: CommunityPost["category"], attachmentName?: string, attachmentUrl?: string) => Promise<boolean>;
  editPost: (id: string, title: string, content: string, category: CommunityPost["category"]) => Promise<boolean>;
  deletePost: (id: string) => Promise<boolean>;
  likePost: (id: string) => void;
  reportPost: (id: string) => void;
  addComment: (postId: string, content: string) => Promise<boolean>;
  addReply: (postId: string, commentId: string, content: string) => Promise<boolean>;
  deleteComment: (postId: string, commentId: string) => void;
  deleteReply: (postId: string, commentId: string, replyId: string) => void;

  // Career Actions
  addCareer: (career: Omit<CareerOpportunity, "id" | "dateAdded">) => Promise<boolean>;
  editCareer: (id: string, career: Omit<CareerOpportunity, "id" | "dateAdded">) => Promise<boolean>;
  deleteCareer: (id: string) => Promise<boolean>;
  toggleSaveJob: (id: string) => void;
  isJobSaved: (id: string) => boolean;

  // Event Actions
  addEvent: (event: Omit<EventItem, "id">) => void;
  deleteEvent: (id: string) => void;
  toggleSaveEvent: (id: string) => void;
  isEventSaved: (id: string) => boolean;

  // Calendar Actions
  addReminder: (title: string, date: string, type: CalendarReminder["type"], description?: string) => void;
  deleteReminder: (id: string) => void;

  // Notification Actions
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  sendNotificationToUser: (targetEmail: string, notif: Omit<NotificationItem, "id" | "date" | "read">) => void;

  // Gamification & Points
  awardPoints: (amount: number, reason: string) => void;
}

const SocialContext = React.createContext<SocialContextType | undefined>(undefined);

// Clean Initial Community Posts
const INITIAL_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    title: "ما هي أفضل الطرق للتعامل مع مادة الداتا ستراكشر (CSW 232)؟",
    category: "Study Help",
    content: "يا شباب، محتاج نصائح للتعامل مع أسئلة امتحان الميدتيرم لمادة بناء البيانات والمعلومات. تنصحوا بحل مسائل شيت الكود واللاب ولا التركيز على الفهم النظري فقط؟",
    date: "2026-07-25",
    author: "أحمد محمود",
    authorEmail: "ahmed.m@sinai.edu.eg",
    avatar: "👨‍💻",
    likes: ["admin@sinai.edu.eg"],
    comments: [
      {
        id: "comm-1",
        postId: "post-1",
        author: "سيد ندى",
        authorEmail: "sayed@example.com",
        avatar: "🎓",
        content: "ركز جداً على كود Linked Lists والـ Binary Trees لأن الدكاترة بيطلبوا كتابة الكود بنفسك بالورقة والقلم!",
        date: "2026-07-26",
        replies: []
      }
    ],
    reported: false
  },
  {
    id: "post-2",
    title: "جلسة دراسية وتطبيق عملي لمشروع تطوير الويب بـ React & Next.js 🚀",
    category: "Web Development",
    content: "بنجهز لجروب عمل وتدريب أسبوعي زوم لتطبيق مشاريع تخرج وأفكار مواقع حقيقية بـ Next.js و Tailwind. اللي حابب ينضم يسيب تعليق بمهاراته الحالية!",
    date: "2026-07-27",
    author: "مريم علي",
    authorEmail: "mariam.a@sinai.edu.eg",
    avatar: "👩‍💻",
    likes: [],
    comments: [],
    reported: false
  }
];

// Seeded Realistic Careers & Internships (Focus on Internships & Fresh Grads)
const INITIAL_CAREERS: CareerOpportunity[] = [
  {
    id: "job-1",
    title: "ITI - 9 Month Intensive Training Program",
    company: "Information Technology Institute (ITI)",
    location: "Ismailia / Cairo / Smart Village",
    type: "training",
    experience: "entry",
    department: "all",
    description: "The most prestigious IT training program in Egypt. Tracks include Full-Stack, AI, Data Science, and Cybersecurity. Fully funded with a monthly stipend. Perfect for fresh IT graduates from Sinai University.",
    link: "https://iti.gov.eg/iti/intake",
    dateAdded: "2026-08-15"
  },
  {
    id: "job-2",
    title: "Orange Digital Center (ODC) - Web Dev BootCamp",
    company: "Orange Egypt",
    location: "Cairo, Egypt",
    type: "internship",
    experience: "entry",
    department: "IT",
    description: "Intensive 3-month Bootcamp on MERN Stack (MongoDB, Express, React, Node). Priority given to 3rd and 4th-year students. Great chance to get hired directly at Orange after completion.",
    link: "https://www.orangedigitalcenters.com/",
    dateAdded: "2026-08-16"
  },
  {
    id: "job-3",
    title: "Software Engineering Intern - Fall 2026",
    company: "Valeo Egypt",
    location: "Cairo, Egypt (Smart Village)",
    type: "internship",
    experience: "entry",
    department: "CS",
    description: "Join Valeo's Embedded Systems and Automotive Software team for a 3-month Fall Internship. Required: Strong problem-solving, basics of C/C++, and Data Structures. Open to undergrads.",
    link: "https://valeo.wd3.myworkdayjobs.com/Valeo_Jobs",
    dateAdded: "2026-08-14"
  },
  {
    id: "job-4",
    title: "Vodafone _VOIS Discover Graduate Program",
    company: "Vodafone Intelligent Solutions",
    location: "Alexandria / Cairo, Egypt",
    type: "graduate",
    experience: "entry",
    department: "IS",
    description: "A 2-year rotational graduate program designed for fresh tech grads. You will rotate across Data Analytics, Cloud, and Software Development teams.",
    link: "https://careers.vodafone.com/vois/discover",
    dateAdded: "2026-08-10"
  },
  {
    id: "job-5",
    title: "Microsoft Learn Student Ambassador (MLSA)",
    company: "Microsoft",
    location: "Remote / Campus",
    type: "internship",
    experience: "entry",
    department: "all",
    description: "Become a community leader on Sinai University campus! Host events, get free Azure credits, and gain direct access to Microsoft engineers for mentorship.",
    link: "https://studentambassadors.microsoft.com/",
    dateAdded: "2026-08-05"
  },
  {
    id: "job-6",
    title: "Junior Data Analyst",
    company: "e-finance",
    location: "Remote / Hybrid",
    type: "graduate",
    experience: "entry",
    department: "IS",
    description: "e-finance is hiring a Junior Data Analyst to work on national fintech projects. Required: SQL, basic Python, and PowerBI. Fresh graduates are welcome to apply.",
    link: "https://wuzzuf.net/jobs/p/efinance-data",
    dateAdded: "2026-08-12"
  },
  {
    id: "job-7",
    title: "Cybersecurity & Networks Intern",
    company: "Banque Misr",
    location: "Cairo, Egypt",
    type: "internship",
    experience: "entry",
    department: "IT",
    description: "A specialized 2-month internship in the IT Security department. Learn about SOC, Penetration Testing basics, and banking network infrastructure.",
    link: "https://www.banquemisr.com/en/careers",
    dateAdded: "2026-08-13"
  },
  {
    id: "job-8",
    title: "NTI - Cloud Computing Track (AWS/Azure)",
    company: "National Telecommunication Institute",
    location: "Ismailia / Online",
    type: "training",
    experience: "entry",
    department: "CS",
    description: "Free intensive training on Cloud Architecture for 3rd and 4th-year students. Includes free certification vouchers for AWS Cloud Practitioner.",
    link: "https://www.nti.sci.eg/",
    dateAdded: "2026-08-01"
  },
  {
    id: "job-9",
    title: "Instabug - Software Testing & QA Intern",
    company: "Instabug",
    location: "Cairo, Egypt",
    type: "internship",
    experience: "entry",
    department: "CS",
    description: "Passionate about quality? Join Instabug as a QA Intern. You'll learn automated testing (Cypress/Selenium) and help ensure the stability of SDKs used by millions.",
    link: "https://instabug.com/careers",
    dateAdded: "2026-08-11"
  },
  {
    id: "job-10",
    title: "Frontend Development Intern (React)",
    company: "Robusta Studio",
    location: "Cairo, Egypt",
    type: "internship",
    experience: "entry",
    department: "IT",
    description: "Robusta is looking for a frontend intern! If you have built projects using React and Tailwind CSS, we want you to join our agile teams for 3 months.",
    link: "https://careers.robustastudio.com/",
    dateAdded: "2026-08-08"
  },
  {
    id: "job-11",
    title: "Dell Technologies Hackathon 2026",
    company: "Dell Technologies",
    location: "Virtual / Online",
    type: "hackathon",
    experience: "all",
    department: "all",
    description: "Compete with teams across the MENA region in Dell's annual hackathon focused on AI and Sustainability. Direct interview opportunities for finalists.",
    link: "https://www.dell.com/hackathon",
    dateAdded: "2026-08-16"
  }
];

// Clean Live Events
const INITIAL_EVENTS: EventItem[] = [];

// Clean Live Reminders
const INITIAL_REMINDERS: CalendarReminder[] = [];

// Clean Live Notifications
const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export function SocialProvider({ children }: { children: React.ReactNode }) {
  const { user, updateProfile } = useAuth();

  const [posts, setPosts] = React.useState<CommunityPost[]>(INITIAL_POSTS);
  const [careers, setCareers] = React.useState<CareerOpportunity[]>(INITIAL_CAREERS);
  const [events, setEvents] = React.useState<EventItem[]>(INITIAL_EVENTS);
  const [reminders, setReminders] = React.useState<CalendarReminder[]>(INITIAL_REMINDERS);
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const [savedJobs, setSavedJobs] = React.useState<string[]>([]);
  const [savedEvents, setSavedEvents] = React.useState<string[]>([]);
  const [savedPosts, setSavedPosts] = React.useState<string[]>([]);
  const [moodleUrl, setMoodleUrl] = React.useState<string>("");

  // Load Global Shared Community Posts & Sync from Supabase Cloud
  React.useEffect(() => {
    const loadSharedPosts = async () => {
      let initial: CommunityPost[] = [];
      const savedGlobal = localStorage.getItem("su_global_community_posts");
      if (savedGlobal) {
        try {
          const parsed = JSON.parse(savedGlobal);
          if (Array.isArray(parsed) && parsed.length > 0) {
            initial = parsed;
          }
        } catch (e) {}
      }

      if (initial.length === 0) {
        initial = INITIAL_POSTS;
        localStorage.setItem("su_global_community_posts", JSON.stringify(INITIAL_POSTS));
      }
      setPosts(initial);

      // Fetch remote posts from Supabase database
      const remotePosts = await fetchFromSupabase<any>("posts");
      if (remotePosts && remotePosts.length > 0) {
        const mappedRemote: CommunityPost[] = remotePosts.map((p) => ({
          id: p.id,
          title: p.title,
          content: p.content,
          category: p.category || "General Discussion",
          date: p.date,
          author: p.author,
          authorEmail: p.author_email || p.authorEmail || "student@sinai.edu.eg",
          avatar: p.avatar || "🎓",
          likes: Array.isArray(p.likes) ? p.likes : [],
          comments: Array.isArray(p.comments) ? p.comments : [],
          attachmentName: p.attachment_name,
          attachmentUrl: p.attachment_url,
          reported: Boolean(p.reported)
        }));

        const mergedMap = new Map<string, CommunityPost>();
        initial.forEach(p => mergedMap.set(p.id, p));
        mappedRemote.forEach(p => mergedMap.set(p.id, p));
        const merged = Array.from(mergedMap.values());

        setPosts(Array.from(mergedMap.values()));
        localStorage.setItem("su_global_community_posts", JSON.stringify(Array.from(mergedMap.values())));
      }
    };

    const loadSharedCareers = async () => {
      // 1. Initial load from local careers cache if present, otherwise default to INITIAL_CAREERS
      const cached = localStorage.getItem("su_careers_cache");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const valid = parsed.filter((c: any) => !c.id?.startsWith("hack-") && !c.title?.toLowerCase().includes("malicious") && !c.company?.toLowerCase().includes("exploit") && !c.description?.toLowerCase().includes("hacked"));
            if (valid.length > 0) {
              setCareers(valid);
            } else {
              setCareers(INITIAL_CAREERS);
              localStorage.setItem("su_careers_cache", JSON.stringify(INITIAL_CAREERS));
            }
          } else {
            setCareers(INITIAL_CAREERS);
            localStorage.setItem("su_careers_cache", JSON.stringify(INITIAL_CAREERS));
          }
        } catch (e) {
          setCareers(INITIAL_CAREERS);
        }
      } else {
        setCareers(INITIAL_CAREERS);
        localStorage.setItem("su_careers_cache", JSON.stringify(INITIAL_CAREERS));
      }

      // 2. Fetch authoritative cloud careers from Supabase
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.from("careers").select("*").order("created_at", { ascending: false });
          if (!error && data && data.length > 0) {
            const valid = data.filter((c: any) => !c.id?.startsWith("hack-") && !c.title?.toLowerCase().includes("malicious") && !c.company?.toLowerCase().includes("exploit") && !c.description?.toLowerCase().includes("hacked"));
            if (valid.length > 0) {
              const mappedCareers: CareerOpportunity[] = valid.map((c: any) => ({
                id: c.id,
                title: c.title,
                company: c.company,
                location: c.location || "مصر",
                type: c.type || "internship",
                experience: c.experience || "entry",
                department: c.department || "all",
                description: c.description || "",
                link: c.link || "#",
                dateAdded: c.date_added ? c.date_added.split("T")[0] : new Date().toISOString().split("T")[0]
              }));
              setCareers(mappedCareers);
              localStorage.setItem("su_careers_cache", JSON.stringify(mappedCareers));
            } else {
              setCareers(INITIAL_CAREERS);
              localStorage.setItem("su_careers_cache", JSON.stringify(INITIAL_CAREERS));
            }
          }
        } catch (e) {
          console.warn("[Careers Cloud Sync] Fetch error:", e);
        }
      }
    };

    loadSharedPosts();
    loadSharedCareers();

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === "su_global_community_posts" && e.newValue) {
        try {
          setPosts(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };
    window.addEventListener("storage", handleStorageEvent);
  }, []);

  // Action in-flight mutex locks for rapid-click protection & idempotency
  const inFlightCareersRef = React.useRef<Set<string>>(new Set());
  const inFlightPostsRef = React.useRef<Set<string>>(new Set());
  const inFlightCommentsRef = React.useRef<Set<string>>(new Set());
  const inFlightRepliesRef = React.useRef<Set<string>>(new Set());
  const inFlightLikesRef = React.useRef<Set<string>>(new Set());

  const saveGlobalPosts = (updatedPosts: CommunityPost[]) => {
    setPosts(updatedPosts);
    try {
      localStorage.setItem("su_global_community_posts", JSON.stringify(updatedPosts));
      window.dispatchEvent(new Event("storage"));
    } catch (e) {}
  };

  // Load user specific personal state from localStorage on user change
  React.useEffect(() => {
    if (user && user.id) {
      const userEmail = user.email ? user.email.toLowerCase().trim() : "";
      let userNotifs: NotificationItem[] = [];

      // 1. Check cloud social_state
      if (user.social_state) {
        try {
          const parsed = typeof user.social_state === "string" ? JSON.parse(user.social_state) : user.social_state;
          if (parsed.events) setEvents(parsed.events);
          if (parsed.reminders) setReminders(parsed.reminders);
          if (Array.isArray(parsed.notifications)) {
            userNotifs = parsed.notifications.filter((n: NotificationItem) => !n.recipientEmail || n.recipientEmail.toLowerCase().trim() === userEmail);
          }
          if (parsed.savedJobs) setSavedJobs(parsed.savedJobs);
          if (parsed.savedEvents) setSavedEvents(parsed.savedEvents);
          if (parsed.savedPosts) setSavedPosts(parsed.savedPosts);
          if (parsed.moodleUrl) setMoodleUrl(parsed.moodleUrl);
        } catch (e) {
          console.error("Failed to parse cloud social state", e);
        }
      }

      // 2. Check local user-specific DB
      const savedDb = localStorage.getItem(`su_social_${user.id}`);
      if (savedDb) {
        try {
          const parsed = JSON.parse(savedDb);
          if (parsed.events && (!user.social_state || !user.social_state.events)) setEvents(parsed.events);
          if (parsed.reminders && (!user.social_state || !user.social_state.reminders)) setReminders(parsed.reminders);
          if (Array.isArray(parsed.notifications)) {
            const filtered = parsed.notifications.filter((n: NotificationItem) => !n.recipientEmail || n.recipientEmail.toLowerCase().trim() === userEmail);
            if (filtered.length > userNotifs.length) {
              userNotifs = filtered;
            }
          }
          if (parsed.savedJobs && (!user.social_state || !user.social_state.savedJobs)) setSavedJobs(parsed.savedJobs);
          if (parsed.savedEvents && (!user.social_state || !user.social_state.savedEvents)) setSavedEvents(parsed.savedEvents);
          if (parsed.savedPosts && (!user.social_state || !user.social_state.savedPosts)) setSavedPosts(parsed.savedPosts);
          if (parsed.moodleUrl && (!user.social_state || !user.social_state.moodleUrl)) setMoodleUrl(parsed.moodleUrl);
        } catch (e) {
          console.error("Failed to parse social state", e);
        }
      }

      // 3. Check standalone user inbox `su_notifs_${userEmail}`
      if (userEmail) {
        const standaloneInbox = localStorage.getItem(`su_notifs_${userEmail}`);
        if (standaloneInbox) {
          try {
            const parsedInbox = JSON.parse(standaloneInbox);
            if (Array.isArray(parsedInbox) && parsedInbox.length > 0) {
              const map = new Map<string, NotificationItem>();
              userNotifs.forEach(n => map.set(n.id, n));
              parsedInbox.forEach((n: NotificationItem) => {
                if (!n.recipientEmail || n.recipientEmail.toLowerCase().trim() === userEmail) {
                  map.set(n.id, n);
                }
              });
              userNotifs = Array.from(map.values()).sort((a, b) => (b.date || "").localeCompare(a.date || ""));
            }
          } catch (e) {}
        }
      }

      setNotifications(userNotifs);
    } else {
      // WHEN NO USER IS LOGGED IN, COMPLETELY CLEAR MEMORY
      setNotifications([]);
      setEvents([]);
      setReminders([]);
      setSavedJobs([]);
      setSavedEvents([]);
      setSavedPosts([]);
      setMoodleUrl("");
    }
  }, [user?.id, user?.email]);

  // Cross-Tab Storage Event Listener for personal social state
  React.useEffect(() => {
    if (!user || typeof window === "undefined") return;
    const socialKey = `su_social_${user.id}`;
    const userEmail = user.email ? user.email.toLowerCase().trim() : "";
    const notifsKey = userEmail ? `su_notifs_${userEmail}` : "";
    const careersKey = "su_careers_cache";

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === socialKey && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.savedJobs !== undefined) setSavedJobs(parsed.savedJobs);
          if (parsed.savedEvents !== undefined) setSavedEvents(parsed.savedEvents);
          if (parsed.savedPosts !== undefined) setSavedPosts(parsed.savedPosts);
          if (parsed.reminders !== undefined) setReminders(parsed.reminders);
          if (parsed.notifications !== undefined && Array.isArray(parsed.notifications)) {
            setNotifications(parsed.notifications.filter((n: NotificationItem) => !n.recipientEmail || n.recipientEmail.toLowerCase().trim() === userEmail));
          }
          if (parsed.moodleUrl !== undefined) setMoodleUrl(parsed.moodleUrl);
        } catch (err) {}
      } else if (notifsKey && e.key === notifsKey && e.newValue) {
        try {
          const parsedNotifs = JSON.parse(e.newValue);
          if (Array.isArray(parsedNotifs)) {
            setNotifications(parsedNotifs.filter((n: NotificationItem) => !n.recipientEmail || n.recipientEmail.toLowerCase().trim() === userEmail));
          }
        } catch (err) {}
      } else if (e.key === careersKey && e.newValue) {
        try {
          setCareers(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };

    window.addEventListener("storage", handleStorageEvent);
    return () => window.removeEventListener("storage", handleStorageEvent);
  }, [user?.id, user?.email]);

  // Save changes state wrapper helper with Type-Aware Merging
  const saveSocialState = (updates: Partial<any>) => {
    if (user && user.id) {
      const key = `su_social_${user.id}`;
      const userEmail = user.email ? user.email.toLowerCase().trim() : "";
      let freshest: any = {};
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(key);
        if (saved) {
          try { freshest = JSON.parse(saved); } catch (e) { }
        }
      }

      // Filter notifications to ensure only this user's notifications are saved
      const currentNotifs = updates.notifications !== undefined ? updates.notifications : (freshest.notifications || notifications);
      const filteredNotifs = Array.isArray(currentNotifs)
        ? currentNotifs.filter((n: NotificationItem) => !n.recipientEmail || n.recipientEmail.toLowerCase().trim() === userEmail)
        : [];

      const data = {
        events: updates.events !== undefined ? updates.events : (freshest.events || events),
        reminders: updates.reminders !== undefined ? updates.reminders : (freshest.reminders || reminders),
        notifications: filteredNotifs,
        savedJobs: updates.savedJobs !== undefined ? updates.savedJobs : (freshest.savedJobs || savedJobs),
        savedEvents: updates.savedEvents !== undefined ? updates.savedEvents : (freshest.savedEvents || savedEvents),
        savedPosts: updates.savedPosts !== undefined ? updates.savedPosts : (freshest.savedPosts || savedPosts),
        moodleUrl: updates.moodleUrl !== undefined ? updates.moodleUrl : (freshest.moodleUrl || moodleUrl),
      };

      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(data));
        if (userEmail) {
          localStorage.setItem(`su_notifs_${userEmail}`, JSON.stringify(filteredNotifs));
        }
      }
      
      // Async save to cloud with freshest merged payload
      updateProfile({ social_state: data }).catch(err => console.warn("Cloud sync failed for social_state:", err));
    }
  };

  // Dedicated helper to send notification to a specific user account
  const sendNotificationToUser = (targetEmail: string, notif: Omit<NotificationItem, "id" | "date" | "read">) => {
    if (!targetEmail) return;
    const normalizedTarget = targetEmail.toLowerCase().trim();
    const fullNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date: new Date().toLocaleString("ar-EG"),
      read: false,
      recipientEmail: normalizedTarget
    };

    // 1. If recipient is currently active:
    if (user && user.email && user.email.toLowerCase().trim() === normalizedTarget) {
      setNotifications(prev => {
        const updated = [fullNotif, ...prev.filter(n => n.id !== fullNotif.id)];
        saveSocialState({ notifications: updated });
        return updated;
      });
    }

    // 2. Always persist into target user's dedicated inbox
    if (typeof window !== "undefined") {
      const targetKey = `su_notifs_${normalizedTarget}`;
      try {
        const existing = JSON.parse(localStorage.getItem(targetKey) || "[]");
        const merged = [fullNotif, ...existing.filter((n: any) => n.id !== fullNotif.id)].slice(0, 50);
        localStorage.setItem(targetKey, JSON.stringify(merged));
      } catch (e) {}
    }
  };

  // Gamification helper inside provider
  const awardPoints = async (amount: number, reason: string) => {
    if (!user) return;
    const currentPoints = user.points || 0;
    const currentBadges = user.badges || [];
    const newPoints = currentPoints + amount;

    let newBadges = [...currentBadges];
    let badgeNotification: string | null = null;

    if (newPoints >= 100 && !newBadges.includes("نجم الكلية")) {
      newBadges.push("نجم الكلية");
      badgeNotification = "حصلت على شارة 'نجم الكلية' لتخطيك 100 نقطة أكاديمية!";
    }
    if (newPoints >= 300 && !newBadges.includes("العضو الفضي")) {
      newBadges.push("العضو الفضي");
      badgeNotification = "حصلت على شارة 'العضو الفضي' لتخطيك 300 نقطة أكاديمية!";
    }
    if (newPoints >= 500 && !newBadges.includes("العضو الذهبي")) {
      newBadges.push("العضو الذهبي");
      badgeNotification = "تهانينا! حصلت على شارة 'العضو الذهبي' المرموقة لتخطيك 500 نقطة!";
    }

    if (reason === "إضافة منشور" && !newBadges.includes("المساهم الأول")) {
      newBadges.push("المساهم الأول");
      badgeNotification = "شارة جديدة: 'المساهم الأول' لنشرك أول تدوينة بالمنتدى!";
    }

    await updateProfile({
      points: newPoints,
      badges: newBadges
    });

    if (user.email) {
      sendNotificationToUser(user.email, {
        title: `لقد ربحت +${amount} نقطة!`,
        content: `السبب: ${reason}`,
        type: "badge"
      });

      if (badgeNotification) {
        sendNotificationToUser(user.email, {
          title: `شارة جديدة مفتوحة 🏆`,
          content: badgeNotification,
          type: "badge"
        });
      }
    }
  };

  // Community logic (with In-Flight Mutex Locks)
  const createPost = async (title: string, content: string, category: CommunityPost["category"], attachmentName?: string, attachmentUrl?: string): Promise<boolean> => {
    if (!user) return false;
    const lockKey = `post_${user.id}_${title.trim().toLowerCase()}`;
    if (inFlightPostsRef.current.has(lockKey)) {
      console.warn(`[Social Idempotency] Duplicate createPost blocked for: ${lockKey}`);
      return false;
    }
    inFlightPostsRef.current.add(lockKey);

    const newPost: CommunityPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      category,
      content,
      date: new Date().toISOString().split("T")[0],
      author: user.name,
      authorEmail: user.email,
      avatar: user.avatar,
      likes: [],
      comments: [],
      attachmentName,
      attachmentUrl,
      reported: false
    };

    const updated = [newPost, ...posts];
    saveGlobalPosts(updated);

    try {
      await insertToSupabase("posts", {
        id: newPost.id,
        title: newPost.title,
        content: newPost.content,
        category: newPost.category,
        author: newPost.author,
        author_email: newPost.authorEmail,
        avatar: newPost.avatar,
        date: newPost.date,
        likes: newPost.likes,
        reported: false,
        attachment_name: attachmentName,
        attachment_url: attachmentUrl
      });
      awardPoints(20, "إضافة منشور");
      return true;
    } catch (e) {
      console.warn("[Social Sync] Post insert warning:", e);
      return false;
    } finally {
      setTimeout(() => {
        inFlightPostsRef.current.delete(lockKey);
      }, 1000);
    }
  };

  const editPost = async (id: string, title: string, content: string, category: CommunityPost["category"]): Promise<boolean> => {
    const lockKey = `edit_post_${id}`;
    if (inFlightPostsRef.current.has(lockKey)) return false;
    inFlightPostsRef.current.add(lockKey);

    const updated = posts.map(p => p.id === id ? { ...p, title, content, category } : p);
    saveGlobalPosts(updated);

    try {
      await updateInSupabase("posts", id, { title, content, category });
      return true;
    } catch (e) {
      console.warn("[Social Sync] Post edit warning:", e);
      return false;
    } finally {
      setTimeout(() => {
        inFlightPostsRef.current.delete(lockKey);
      }, 500);
    }
  };

  const deletePost = async (id: string): Promise<boolean> => {
    const lockKey = `delete_post_${id}`;
    if (inFlightPostsRef.current.has(lockKey)) return false;
    inFlightPostsRef.current.add(lockKey);

    const updated = posts.filter(p => p.id !== id);
    saveGlobalPosts(updated);

    try {
      await deleteFromSupabase("posts", id);
      return true;
    } catch (e) {
      console.warn("[Social Sync] Post delete warning:", e);
      return false;
    } finally {
      setTimeout(() => {
        inFlightPostsRef.current.delete(lockKey);
      }, 500);
    }
  };

  const likePost = (id: string) => {
    if (!user) return;
    const updated = posts.map(p => {
      if (p.id === id) {
        const liked = p.likes.includes(user.email);
        const newLikes = liked ? p.likes.filter(email => email !== user.email) : [...p.likes, user.email];
        updateInSupabase("posts", id, { likes: newLikes });
        return { ...p, likes: newLikes };
      }
      return p;
    });
    saveGlobalPosts(updated);
  };

  const reportPost = (id: string) => {
    const updated = posts.map(p => p.id === id ? { ...p, reported: true } : p);
    saveGlobalPosts(updated);
    updateInSupabase("posts", id, { reported: true });
  };

  const addComment = async (postId: string, content: string): Promise<boolean> => {
    if (!user || !content.trim()) return false;
    const lockKey = `comment_${user.id}_${postId}_${content.trim().toLowerCase()}`;
    if (inFlightCommentsRef.current.has(lockKey)) {
      console.warn(`[Social Idempotency] Duplicate addComment blocked for: ${lockKey}`);
      return false;
    }
    inFlightCommentsRef.current.add(lockKey);

    const newComment: PostComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      postId,
      author: user.name,
      authorEmail: user.email,
      avatar: user.avatar,
      content: content.trim(),
      date: new Date().toISOString().split("T")[0],
      replies: []
    };

    const updated = posts.map(p => {
      if (p.id === postId) {
        if (p.authorEmail && user.email && p.authorEmail.toLowerCase().trim() !== user.email.toLowerCase().trim()) {
          sendNotificationToUser(p.authorEmail, {
            title: "رد جديد على منشورك",
            content: `علق ${user.name} على منشورك '${p.title.substring(0, 25)}...'`,
            type: "reply"
          });
        }
        return { ...p, comments: [...p.comments, newComment] };
      }
      return p;
    });

    saveGlobalPosts(updated);
    awardPoints(10, "إضافة تعليق");

    setTimeout(() => {
      inFlightCommentsRef.current.delete(lockKey);
    }, 1000);
    return true;
  };

  const addReply = async (postId: string, commentId: string, content: string): Promise<boolean> => {
    if (!user || !content.trim()) return false;
    const lockKey = `reply_${user.id}_${commentId}_${content.trim().toLowerCase()}`;
    if (inFlightRepliesRef.current.has(lockKey)) {
      console.warn(`[Social Idempotency] Duplicate addReply blocked for: ${lockKey}`);
      return false;
    }
    inFlightRepliesRef.current.add(lockKey);

    const newReply: PostReply = {
      id: `reply-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      author: user.name,
      authorEmail: user.email,
      avatar: user.avatar,
      content: content.trim(),
      date: new Date().toISOString().split("T")[0]
    };

    const updated = posts.map(p => {
      if (p.id === postId) {
        const commentIndex = p.comments.findIndex(c => c.id === commentId);
        if (commentIndex !== -1) {
          const targetComment = p.comments[commentIndex];
          if (targetComment.authorEmail && user.email && targetComment.authorEmail.toLowerCase().trim() !== user.email.toLowerCase().trim()) {
            sendNotificationToUser(targetComment.authorEmail, {
              title: "رد جديد على تعليقك",
              content: `رد ${user.name} على تعليقك في منشور '${p.title.substring(0, 20)}...' بالمنتدى.`,
              type: "reply"
            });
          }
          const updatedComments = [...p.comments];
          updatedComments[commentIndex] = {
            ...targetComment,
            replies: [...targetComment.replies, newReply]
          };
          return { ...p, comments: updatedComments };
        }
      }
      return p;
    });

    saveGlobalPosts(updated);
    awardPoints(5, "الرد على تعليق");

    setTimeout(() => {
      inFlightRepliesRef.current.delete(lockKey);
    }, 1000);
    return true;
  };

  const deleteComment = (postId: string, commentId: string) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        return { ...p, comments: p.comments.filter(c => c.id !== commentId) };
      }
      return p;
    });
    saveGlobalPosts(updated);
  };

  const deleteReply = (postId: string, commentId: string, replyId: string) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        const commentIndex = p.comments.findIndex(c => c.id === commentId);
        if (commentIndex !== -1) {
          const targetComment = p.comments[commentIndex];
          const updatedReplies = targetComment.replies.filter(r => r.id !== replyId);
          const updatedComments = [...p.comments];
          updatedComments[commentIndex] = { ...targetComment, replies: updatedReplies };
          return { ...p, comments: updatedComments };
        }
      }
      return p;
    });
    saveGlobalPosts(updated);
  };

  // Careers bookmarks
  const toggleSaveJob = (id: string) => {
    const updated = savedJobs.includes(id) ? savedJobs.filter(j => j !== id) : Array.from(new Set([...savedJobs, id]));
    setSavedJobs(updated);
    saveSocialState({ savedJobs: updated });
  };

  const isJobSaved = (id: string) => savedJobs.includes(id);

  const addCareer = async (careerData: Omit<CareerOpportunity, "id" | "dateAdded">): Promise<boolean> => {
    const lockKey = `add_career_${careerData.title.trim()}_${careerData.company.trim()}`;
    if (inFlightCareersRef.current.has(lockKey)) {
      console.warn(`[Careers Idempotency] Duplicate addCareer blocked for: ${lockKey}`);
      return false;
    }
    inFlightCareersRef.current.add(lockKey);

    const newCareer: CareerOpportunity = {
      ...careerData,
      id: `car-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      dateAdded: new Date().toISOString().split("T")[0]
    };
    const updated = [newCareer, ...careers];
    setCareers(updated);
    localStorage.setItem("su_careers_cache", JSON.stringify(updated));

    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from("careers").insert([{
          id: newCareer.id,
          title: newCareer.title,
          company: newCareer.company,
          location: newCareer.location,
          type: newCareer.type,
          description: newCareer.description,
          link: newCareer.link,
          department: newCareer.department,
          experience: newCareer.experience,
          date_added: new Date().toISOString()
        }]);
      }
      return true;
    } catch (e) {
      console.warn("[Careers Cloud Sync] Insert warning:", e);
      return false;
    } finally {
      setTimeout(() => {
        inFlightCareersRef.current.delete(lockKey);
      }, 1000);
    }
  };

  const editCareer = async (id: string, careerData: Omit<CareerOpportunity, "id" | "dateAdded">): Promise<boolean> => {
    const lockKey = `edit_career_${id}`;
    if (inFlightCareersRef.current.has(lockKey)) return false;
    inFlightCareersRef.current.add(lockKey);

    const updated = careers.map((c) => (c.id === id ? { ...c, ...careerData } : c));
    setCareers(updated);
    localStorage.setItem("su_careers_cache", JSON.stringify(updated));

    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from("careers").update({
          title: careerData.title,
          company: careerData.company,
          location: careerData.location,
          type: careerData.type,
          description: careerData.description,
          link: careerData.link,
          department: careerData.department,
          experience: careerData.experience
        }).eq("id", id);
      }
      return true;
    } catch (e) {
      console.warn("[Careers Cloud Sync] Update warning:", e);
      return false;
    } finally {
      setTimeout(() => {
        inFlightCareersRef.current.delete(lockKey);
      }, 500);
    }
  };

  const deleteCareer = async (id: string): Promise<boolean> => {
    const lockKey = `delete_career_${id}`;
    if (inFlightCareersRef.current.has(lockKey)) return false;
    inFlightCareersRef.current.add(lockKey);

    const updated = careers.filter((c) => c.id !== id);
    setCareers(updated);
    localStorage.setItem("su_careers_cache", JSON.stringify(updated));

    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from("careers").delete().eq("id", id);
      }
      return true;
    } catch (e) {
      console.warn("[Careers Cloud Sync] Delete warning:", e);
      return false;
    } finally {
      setTimeout(() => {
        inFlightCareersRef.current.delete(lockKey);
      }, 500);
    }
  };

  // Events bookmarks
  const toggleSaveEvent = (id: string) => {
    const updated = savedEvents.includes(id) ? savedEvents.filter(e => e !== id) : Array.from(new Set([...savedEvents, id]));
    setSavedEvents(updated);
    saveSocialState({ savedEvents: updated });
  };

  const isEventSaved = (id: string) => savedEvents.includes(id);

  const addEvent = (eventData: Omit<EventItem, "id">) => {
    const newEv: EventItem = {
      ...eventData,
      id: `event-${Date.now()}`
    };
    const updated = [newEv, ...events];
    setEvents(updated);
    saveSocialState({ events: updated });
  };

  const deleteEvent = (id: string) => {
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
    saveSocialState({ events: updated });
  };

  // Reminders
  const addReminder = (title: string, date: string, type: CalendarReminder["type"], description?: string) => {
    const newRem: CalendarReminder = {
      id: `rem-${Date.now()}`,
      title,
      date,
      type,
      description
    };
    const updated = [newRem, ...reminders];
    setReminders(updated);
    saveSocialState({ reminders: updated });
  };

  const deleteReminder = (id: string) => {
    const updated = reminders.filter(r => r.id !== id);
    setReminders(updated);
    saveSocialState({ reminders: updated });
  };

  // Notifications
  const markAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    saveSocialState({ notifications: updated });
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    saveSocialState({ notifications: updated });
  };

  const clearNotifications = () => {
    setNotifications([]);
    saveSocialState({ notifications: [] });
  };

  // Moodle calendar sync actions
  const syncMoodle = async (url: string) => {
    try {
      const res = await fetch(`/api/moodle-proxy?url=${encodeURIComponent(url)}`);
      if (!res.ok) throw new Error("فشلت عملية جلب البيانات من Moodle");
      const iCalText = await res.text();

      const parsedEvents: CalendarReminder[] = [];
      const lines = iCalText.split(/\r?\n/);
      let inEvent = false;
      let currentEvent: Partial<CalendarReminder> = {};

      for (let line of lines) {
        if (line.startsWith("BEGIN:VEVENT")) {
          inEvent = true;
          currentEvent = {};
        } else if (line.startsWith("END:VEVENT")) {
          if (currentEvent.title && currentEvent.date) {
            currentEvent.id = `moodle-rem-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
            parsedEvents.push(currentEvent as CalendarReminder);
          }
          inEvent = false;
        } else if (inEvent) {
          if (line.startsWith("SUMMARY:")) {
            currentEvent.title = line.substring(8).trim();
          } else if (line.startsWith("DTSTART:")) {
            const val = line.substring(8).trim();
            if (val.length >= 8) {
              const y = val.substring(0, 4);
              const m = val.substring(4, 6);
              const d = val.substring(6, 8);
              currentEvent.date = `${y}-${m}-${d}`;
            }
          } else if (line.startsWith("DESCRIPTION:")) {
            currentEvent.description = line.substring(12).trim();
          }
        }
      }

      const parsedWithTypes = parsedEvents.map(e => ({
        ...e,
        type: e.title.toLowerCase().includes("exam") || e.title.includes("اختبار") ? "midterm" as const : "assignment" as const
      }));

      // Filter out existing Moodle reminders
      const nonMoodleReminders = reminders.filter(r => !r.id.startsWith("moodle-rem-"));
      const updated = [...parsedWithTypes, ...nonMoodleReminders];

      setReminders(updated);
      setMoodleUrl(url);
      saveSocialState({ reminders: updated, moodleUrl: url });
    } catch (e: any) {
      console.error("Moodle sync error", e);
      throw e;
    }
  };

  const clearMoodle = () => {
    const updated = reminders.filter(r => !r.id.startsWith("moodle-rem-"));
    setReminders(updated);
    setMoodleUrl("");
    saveSocialState({ reminders: updated, moodleUrl: "" });
  };

  return (
    <SocialContext.Provider
      value={{
        posts,
        careers,
        events,
        reminders,
        notifications,
        savedJobs,
        savedEvents,
        savedPosts,
        moodleUrl,
        createPost,
        editPost,
        deletePost,
        likePost,
        reportPost,
        addComment,
        addReply,
        deleteComment,
        deleteReply,
        toggleSaveJob,
        isJobSaved,
        addCareer,
        editCareer,
        deleteCareer,
        toggleSaveEvent,
        isEventSaved,
        addEvent,
        deleteEvent,
        addReminder,
        deleteReminder,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        sendNotificationToUser,
        syncMoodle,
        clearMoodle,
        awardPoints
      }}
    >
      {children}
    </SocialContext.Provider>
  );
}

export function useSocial() {
  const context = React.useContext(SocialContext);
  if (context === undefined) {
    throw new Error("useSocial must be used within a SocialProvider");
  }
  return context;
}
