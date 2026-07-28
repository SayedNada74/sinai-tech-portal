"use client";

import * as React from "react";
import { useAuth, UserProfile } from "./auth-context";
import { type } from "os";

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

  // Community Actions
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
  toggleSaveJob: (id: string) => void;
  isJobSaved: (id: string) => boolean;
  addCareer: (career: Omit<CareerOpportunity, "id" | "dateAdded">) => void;
  editCareer: (id: string, career: Omit<CareerOpportunity, "id" | "dateAdded">) => void;
  deleteCareer: (id: string) => void;

  // Event Actions
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

// Clean Live Community Posts
const INITIAL_POSTS: CommunityPost[] = [];

// Clean Live Careers
const INITIAL_CAREERS: CareerOpportunity[] = [];

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

  // Load from localStorage on user change
  React.useEffect(() => {
    if (user) {
      const savedDb = localStorage.getItem(`su_social_${user.id}`);
      if (savedDb) {
        try {
          const parsed = JSON.parse(savedDb);
          if (parsed.posts) setPosts(parsed.posts);
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
      } else {
        setPosts(INITIAL_POSTS);
        setCareers(INITIAL_CAREERS);
        setEvents(INITIAL_EVENTS);
        setReminders(INITIAL_REMINDERS);
        setNotifications(INITIAL_NOTIFICATIONS);
        setSavedJobs([]);
        setSavedEvents([]);
        setSavedPosts([]);
        setMoodleUrl("");
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
        posts: updates.posts !== undefined ? updates.posts : (current.posts || posts),
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

    // Check thresholds for badges
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

    // Award badge based on specific triggers if specified
    if (reason === "إضافة منشور" && !newBadges.includes("المساهم الأول")) {
      newBadges.push("المساهم الأول");
      badgeNotification = "شارة جديدة: 'المساهم الأول' لنشرك أول تدوينة بالمنتدى!";
    }

    // Update Profile with new points/badges
    await updateProfile({
      points: newPoints,
      badges: newBadges
    });

    // Create system notification for points
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
    setPosts(updated);
    saveSocialState({ posts: updated });
    awardPoints(20, "إضافة منشور");
  };

  const editPost = (id: string, title: string, content: string, category: CommunityPost["category"]) => {
    const updated = posts.map(p => p.id === id ? { ...p, title, content, category } : p);
    setPosts(updated);
    saveSocialState({ posts: updated });
  };

  const deletePost = (id: string) => {
    const updated = posts.filter(p => p.id !== id);
    setPosts(updated);
    saveSocialState({ posts: updated });
  };

  const likePost = (id: string) => {
    if (!user) return;
    const updated = posts.map(p => {
      if (p.id === id) {
        const liked = p.likes.includes(user.email);
        const newLikes = liked ? p.likes.filter(email => email !== user.email) : [...p.likes, user.email];
        return { ...p, likes: newLikes };
      }
      return p;
    });
    setPosts(updated);
    saveSocialState({ posts: updated });
  };

  const reportPost = (id: string) => {
    const updated = posts.map(p => p.id === id ? { ...p, reported: true } : p);
    setPosts(updated);
    saveSocialState({ posts: updated });
    alert("🚨 تم إرسال تقرير البلاغ للمشرفين لمراجعة المحتوى.");
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

    setPosts(updated);
    saveSocialState({ posts: updated });
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
          // Send notification if comment author is not current user
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

    setPosts(updated);
    saveSocialState({ posts: updated });
    awardPoints(5, "الرد على تعليق");
  };

  const deleteComment = (postId: string, commentId: string) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        return { ...p, comments: p.comments.filter(c => c.id !== commentId) };
      }
      return p;
    });
    setPosts(updated);
    saveSocialState({ posts: updated });
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
    setPosts(updated);
    saveSocialState({ posts: updated });
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
