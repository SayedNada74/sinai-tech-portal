"use client";

import * as React from "react";
import { useAuth, UserProfile } from "./auth-context";
import { fetchFromSupabase, insertToSupabase, updateInSupabase, deleteFromSupabase } from "@/lib/supabase";

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
  type: "reply" | "resource" | "career" | "event" | "academic" | "badge";
  read: boolean;
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
  createPost: (title: string, content: string, category: CommunityPost["category"], attachmentName?: string, attachmentUrl?: string) => void;
  editPost: (id: string, title: string, content: string, category: CommunityPost["category"]) => void;
  deletePost: (id: string) => void;
  likePost: (id: string) => void;
  reportPost: (id: string) => void;
  addComment: (postId: string, content: string) => void;
  addReply: (postId: string, commentId: string, content: string) => void;
  deleteComment: (postId: string, commentId: string) => void;
  deleteReply: (postId: string, commentId: string, replyId: string) => void;

  // Career Actions
  addCareer: (career: Omit<CareerOpportunity, "id" | "dateAdded">) => void;
  editCareer: (id: string, career: Omit<CareerOpportunity, "id" | "dateAdded">) => void;
  deleteCareer: (id: string) => void;
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

        setPosts(merged);
        localStorage.setItem("su_global_community_posts", JSON.stringify(merged));
      }
    };

    loadSharedPosts();

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === "su_global_community_posts" && e.newValue) {
        try {
          setPosts(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };
    window.addEventListener("storage", handleStorageEvent);
    return () => window.removeEventListener("storage", handleStorageEvent);
  }, []);

  const saveGlobalPosts = (updatedPosts: CommunityPost[]) => {
    setPosts(updatedPosts);
    try {
      localStorage.setItem("su_global_community_posts", JSON.stringify(updatedPosts));
      window.dispatchEvent(new Event("storage"));
    } catch (e) {}
  };

  // Load user specific state from localStorage on user change
  React.useEffect(() => {
    if (user) {
      if (user.social_state) {
        try {
          const parsed = typeof user.social_state === "string" ? JSON.parse(user.social_state) : user.social_state;
          if (parsed.careers) setCareers(parsed.careers);
          if (parsed.events) setEvents(parsed.events);
          if (parsed.reminders) setReminders(parsed.reminders);
          if (parsed.notifications) setNotifications(parsed.notifications);
          if (parsed.savedJobs) setSavedJobs(parsed.savedJobs);
          if (parsed.savedEvents) setSavedEvents(parsed.savedEvents);
          if (parsed.savedPosts) setSavedPosts(parsed.savedPosts);
          if (parsed.moodleUrl) setMoodleUrl(parsed.moodleUrl);
          return; // skip local storage if cloud state exists
        } catch (e) {
          console.error("Failed to parse cloud social state", e);
        }
      }

      const savedDb = localStorage.getItem(`su_social_${user.id}`);
      if (savedDb) {
        try {
          const parsed = JSON.parse(savedDb);
          if (parsed.careers) setCareers(parsed.careers);
          if (parsed.events) setEvents(parsed.events);
          if (parsed.reminders) setReminders(parsed.reminders);
          if (parsed.notifications) setNotifications(parsed.notifications);
          if (parsed.savedJobs) setSavedJobs(parsed.savedJobs);
          if (parsed.savedEvents) setSavedEvents(parsed.savedEvents);
          if (parsed.savedPosts) setSavedPosts(parsed.savedPosts);
          if (parsed.moodleUrl) setMoodleUrl(parsed.moodleUrl);
        } catch (e) {
          console.error("Failed to parse social state", e);
        }
      }
    }
  }, [user]);

  // Save changes state wrapper helper
  const saveSocialState = (updates: Partial<any>) => {
    if (user) {
      const key = `su_social_${user.id}`;
      const saved = localStorage.getItem(key);
      let current: any = {};
      if (saved) {
        try { current = JSON.parse(saved); } catch (e) { }
      }
      const data = {
        careers: updates.careers !== undefined ? updates.careers : (current.careers || careers),
        events: updates.events !== undefined ? updates.events : (current.events || events),
        reminders: updates.reminders !== undefined ? updates.reminders : (current.reminders || reminders),
        notifications: updates.notifications !== undefined ? updates.notifications : (current.notifications || notifications),
        savedJobs: updates.savedJobs !== undefined ? updates.savedJobs : (current.savedJobs || savedJobs),
        savedEvents: updates.savedEvents !== undefined ? updates.savedEvents : (current.savedEvents || savedEvents),
        savedPosts: updates.savedPosts !== undefined ? updates.savedPosts : (current.savedPosts || savedPosts),
        moodleUrl: updates.moodleUrl !== undefined ? updates.moodleUrl : (current.moodleUrl || moodleUrl),
      };
      localStorage.setItem(key, JSON.stringify(data));
      
      // Async save to cloud
      if (user) {
         updateProfile({ social_state: data }).catch(err => console.warn("Cloud sync failed for social_state:", err));
      }
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

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `لقد ربحت +${amount} نقطة!`,
      content: `السبب: ${reason}`,
      date: new Date().toLocaleString("ar-EG"),
      type: "badge",
      read: false
    };

    let updatedNotifs = [newNotif, ...notifications];
    if (badgeNotification) {
      const badgeNotif: NotificationItem = {
        id: `notif-badge-${Date.now()}`,
        title: `شارة جديدة مفتوحة 🏆`,
        content: badgeNotification,
        date: new Date().toLocaleString("ar-EG"),
        type: "badge",
        read: false
      };
      updatedNotifs = [badgeNotif, ...updatedNotifs];
    }

    setNotifications(updatedNotifs);
    saveSocialState({ notifications: updatedNotifs });
  };

  // Community logic
  const createPost = (title: string, content: string, category: CommunityPost["category"], attachmentName?: string, attachmentUrl?: string) => {
    if (!user) return;
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
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

    insertToSupabase("posts", {
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
  };

  const editPost = (id: string, title: string, content: string, category: CommunityPost["category"]) => {
    const updated = posts.map(p => p.id === id ? { ...p, title, content, category } : p);
    saveGlobalPosts(updated);
    updateInSupabase("posts", id, { title, content, category });
  };

  const deletePost = (id: string) => {
    const updated = posts.filter(p => p.id !== id);
    saveGlobalPosts(updated);
    deleteFromSupabase("posts", id);
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

  const addComment = (postId: string, content: string) => {
    if (!user) return;
    const newComment: PostComment = {
      id: `comment-${Date.now()}`,
      postId,
      author: user.name,
      authorEmail: user.email,
      avatar: user.avatar,
      content,
      date: new Date().toISOString().split("T")[0],
      replies: []
    };

    const updated = posts.map(p => {
      if (p.id === postId) {
        // Send a notification if post author is not current user
        if (p.authorEmail !== user.email) {
          const newNot: NotificationItem = {
            id: `not-${Date.now()}`,
            title: "رد جديد على منشورك",
            content: `علق ${user.name} على منشورك '${p.title.substring(0, 20)}...'.`,
            date: new Date().toLocaleString("ar-EG"),
            type: "reply",
            read: false
          };
          const updatedNotifs = [newNot, ...notifications];
          setNotifications(updatedNotifs);
          saveSocialState({ notifications: updatedNotifs });
        }
        return { ...p, comments: [...p.comments, newComment] };
      }
      return p;
    });

    saveGlobalPosts(updated);
    awardPoints(10, "إضافة تعليق");
  };

  const addReply = (postId: string, commentId: string, content: string) => {
    if (!user) return;
    const newReply: PostReply = {
      id: `reply-${Date.now()}`,
      author: user.name,
      authorEmail: user.email,
      avatar: user.avatar,
      content,
      date: new Date().toISOString().split("T")[0]
    };

    const updated = posts.map(p => {
      if (p.id === postId) {
        const commentIndex = p.comments.findIndex(c => c.id === commentId);
        if (commentIndex !== -1) {
          const targetComment = p.comments[commentIndex];
          if (targetComment.authorEmail !== user.email) {
            const newNot: NotificationItem = {
              id: `not-${Date.now()}`,
              title: "رد جديد على تعليقك",
              content: `رد ${user.name} على تعليقك بالمنتدى.`,
              date: new Date().toLocaleString("ar-EG"),
              type: "reply",
              read: false
            };
            const updatedNotifs = [newNot, ...notifications];
            setNotifications(updatedNotifs);
            saveSocialState({ notifications: updatedNotifs });
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
    const updated = savedJobs.includes(id) ? savedJobs.filter(j => j !== id) : [...savedJobs, id];
    setSavedJobs(updated);
    saveSocialState({ savedJobs: updated });
  };

  const isJobSaved = (id: string) => savedJobs.includes(id);

  const addCareer = (careerData: Omit<CareerOpportunity, "id" | "dateAdded">) => {
    const newCareer: CareerOpportunity = {
      ...careerData,
      id: `car-${Date.now()}`,
      dateAdded: new Date().toISOString().split("T")[0]
    };
    const updated = [newCareer, ...careers];
    setCareers(updated);
    saveSocialState({ careers: updated });
  };

  const editCareer = (id: string, careerData: Omit<CareerOpportunity, "id" | "dateAdded">) => {
    const updated = careers.map((c) => (c.id === id ? { ...c, ...careerData } : c));
    setCareers(updated);
    saveSocialState({ careers: updated });
  };

  const deleteCareer = (id: string) => {
    const updated = careers.filter((c) => c.id !== id);
    setCareers(updated);
    saveSocialState({ careers: updated });
  };

  // Events bookmarks
  const toggleSaveEvent = (id: string) => {
    const updated = savedEvents.includes(id) ? savedEvents.filter(e => e !== id) : [...savedEvents, id];
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
