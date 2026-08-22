"use client";

import * as React from "react";
import { useAuth } from "./auth-context";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export interface BookmarkItem {
  id: string;
  type: "course" | "resource" | "roadmap";
  title: string;
  link: string;
}

export interface CourseReview {
  id: string;
  courseCode: string;
  rating: number;
  difficulty: number; // 1-5
  workload: number; // 1-5
  attendance: boolean;
  examDifficulty: number; // 1-5
  comment: string;
  tips: string;
  author: string;
  authorId?: string;
  date: string;
  helpfulCount: number;
  helpfulUsers?: string[]; // user IDs who liked this review
}

interface LearningContextType {
  bookmarks: BookmarkItem[];
  reviews: CourseReview[];
  likedResources: string[];
  ratedResources: Record<string, number>;
  downloadedResources: Record<string, number>;
  roadmapProgress: Record<string, string[]>;
  recentlyViewed: { id: string; type: string; title: string; path: string; timestamp: number }[];
  toggleBookmark: (id: string, type: BookmarkItem["type"], title: string, link: string) => void;
  isBookmarked: (id: string) => boolean;
  addReview: (courseCode: string, review: Omit<CourseReview, "id" | "courseCode" | "author" | "authorId" | "date" | "helpfulCount" | "helpfulUsers">) => Promise<boolean>;
  deleteReview: (reviewId: string) => Promise<boolean>;
  toggleHelpfulReview: (reviewId: string) => void;
  toggleLikeResource: (id: string) => void;
  isResourceLiked: (id: string) => boolean;
  rateResource: (id: string, rating: number) => void;
  getResourceRating: (id: string) => number;
  incrementDownload: (id: string) => void;
  getResourceDownloads: (id: string, defaultVal: number) => number;
  toggleRoadmapNode: (roadmapId: string, nodeId: string) => void;
  isRoadmapNodeCompleted: (roadmapId: string, nodeId: string) => boolean;
  getRoadmapProgressPercentage: (roadmapId: string, totalNodes: number) => number;
  addRecentlyViewed: (id: string, type: string, title: string, path: string) => void;
}

const LearningContext = React.createContext<LearningContextType | undefined>(undefined);

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const { user, updateProfile } = useAuth();

  const [bookmarks, setBookmarks] = React.useState<BookmarkItem[]>([]);
  const [reviews, setReviews] = React.useState<CourseReview[]>(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("su_course_reviews_cache");
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {}
      }
    }
    return [];
  });
  const [likedResources, setLikedResources] = React.useState<string[]>([]);
  const [ratedResources, setRatedResources] = React.useState<Record<string, number>>({});
  const [downloadedResources, setDownloadedResources] = React.useState<Record<string, number>>({});
  const [roadmapProgress, setRoadmapProgress] = React.useState<Record<string, string[]>>({});
  const [recentlyViewed, setRecentlyViewed] = React.useState<LearningContextType["recentlyViewed"]>([]);

  // 1. AUTHORITATIVE CLOUD HYDRATION FOR COURSE REVIEWS (public.reviews)
  const fetchCloudReviews = React.useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Supabase reviews fetch warning:", error.message);
        return;
      }

      if (data) {
        const mappedReviews: CourseReview[] = data.map((row: any) => ({
          id: row.id,
          courseCode: row.course_code || "",
          rating: Number(row.rating) || 5,
          difficulty: Number(row.difficulty) || 3,
          workload: Number(row.workload) || 3,
          attendance: row.attendance !== false,
          examDifficulty: Number(row.exam_difficulty) || 3,
          comment: row.comment || "",
          tips: row.tips || "",
          author: row.author || "طالب سيناء",
          authorId: row.author_id,
          date: row.date || new Date().toISOString().split("T")[0],
          helpfulCount: Number(row.helpful_count) || 0,
          helpfulUsers: []
        }));

        setReviews(mappedReviews);
        if (typeof window !== "undefined") {
          localStorage.setItem("su_course_reviews_cache", JSON.stringify(mappedReviews));
        }
      }
    } catch (err) {
      console.error("Failed to load reviews from Supabase:", err);
    }
  }, []);

  React.useEffect(() => {
    fetchCloudReviews();
  }, [fetchCloudReviews]);

  // 2. Load personal learning state (bookmarks, progress, ratings) on user change
  React.useEffect(() => {
    if (user) {
      if (user.learning_state) {
        try {
          const parsed = typeof user.learning_state === "string" ? JSON.parse(user.learning_state) : user.learning_state;
          setBookmarks(parsed.bookmarks || []);
          setLikedResources(parsed.likedResources || []);
          setRatedResources(parsed.ratedResources || {});
          setDownloadedResources(parsed.downloadedResources || {});
          setRoadmapProgress(parsed.roadmapProgress || {});
          setRecentlyViewed(parsed.recentlyViewed || []);
          return; // skip local storage if cloud state exists
        } catch (e) {
          console.error("Failed to parse cloud learning state", e);
        }
      }

      const storageKey = `su_learning_${user.id}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setBookmarks(parsed.bookmarks || []);
          setLikedResources(parsed.likedResources || []);
          setRatedResources(parsed.ratedResources || {});
          setDownloadedResources(parsed.downloadedResources || {});
          setRoadmapProgress(parsed.roadmapProgress || {});
          setRecentlyViewed(parsed.recentlyViewed || []);
        } catch (e) {
          console.error("Failed to load learning state", e);
        }
      } else {
        setBookmarks([]);
        setLikedResources([]);
        setRatedResources({});
        setDownloadedResources({});
        setRoadmapProgress({});
        setRecentlyViewed([]);
      }
    } else {
      setBookmarks([]);
      setLikedResources([]);
      setRatedResources({});
      setDownloadedResources({});
      setRoadmapProgress({});
      setRecentlyViewed([]);
    }
  }, [user]);

  // 3. Cross-Tab Storage Event Listener for real-time multi-tab sync
  React.useEffect(() => {
    if (!user || typeof window === "undefined") return;
    const storageKey = `su_learning_${user.id}`;
    const reviewsKey = "su_course_reviews_cache";

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.bookmarks !== undefined) setBookmarks(parsed.bookmarks);
          if (parsed.likedResources !== undefined) setLikedResources(parsed.likedResources);
          if (parsed.ratedResources !== undefined) setRatedResources(parsed.ratedResources);
          if (parsed.downloadedResources !== undefined) setDownloadedResources(parsed.downloadedResources);
          if (parsed.roadmapProgress !== undefined) setRoadmapProgress(parsed.roadmapProgress);
          if (parsed.recentlyViewed !== undefined) setRecentlyViewed(parsed.recentlyViewed);
        } catch (err) {}
      } else if (e.key === reviewsKey && e.newValue) {
        try {
          setReviews(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };

    window.addEventListener("storage", handleStorageEvent);
    return () => window.removeEventListener("storage", handleStorageEvent);
  }, [user]);

  // 4. Save helper for personal learning state with Type-Aware Merging
  const saveState = (updates: Partial<any>) => {
    if (user) {
      const storageKey = `su_learning_${user.id}`;
      let freshest: any = {};
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          try { freshest = JSON.parse(saved); } catch (e) {}
        }
      }

      const finalPayload = {
        bookmarks: updates.bookmarks !== undefined ? updates.bookmarks : (freshest.bookmarks || bookmarks),
        likedResources: updates.likedResources !== undefined ? updates.likedResources : (freshest.likedResources || likedResources),
        ratedResources: { ...(freshest.ratedResources || ratedResources), ...(updates.ratedResources || {}) },
        downloadedResources: { ...(freshest.downloadedResources || downloadedResources), ...(updates.downloadedResources || {}) },
        roadmapProgress: { ...(freshest.roadmapProgress || roadmapProgress), ...(updates.roadmapProgress || {}) },
        recentlyViewed: updates.recentlyViewed !== undefined ? updates.recentlyViewed : (freshest.recentlyViewed || recentlyViewed)
      };
      
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, JSON.stringify(finalPayload));
      }

      // Async save personal learning state to cloud with freshest merged payload
      updateProfile({ learning_state: finalPayload }).catch(err => console.warn("Cloud sync failed for learning_state:", err));
    }
  };

  const toggleBookmark = (id: string, type: BookmarkItem["type"], title: string, link: string) => {
    let newBookmarks = [...bookmarks];
    const index = newBookmarks.findIndex((b) => b.id === id && b.type === type);
    if (index !== -1) {
      newBookmarks.splice(index, 1);
    } else {
      newBookmarks.push({ id, type, title, link });
    }
    setBookmarks(newBookmarks);
    saveState({ bookmarks: newBookmarks });
  };

  const isBookmarked = (id: string) => {
    return bookmarks.some((b) => b.id === id);
  };

  // Action in-flight mutex locks for rapid-click protection & idempotency
  const inFlightReviewsRef = React.useRef<Set<string>>(new Set());
  const inFlightDeleteRef = React.useRef<Set<string>>(new Set());

  // 5. ADD REVIEW (Direct row-level INSERT to public.reviews with author_id & In-Flight Lock)
  const addReview = async (
    courseCode: string,
    review: Omit<CourseReview, "id" | "courseCode" | "author" | "authorId" | "date" | "helpfulCount" | "helpfulUsers">
  ): Promise<boolean> => {
    if (!user) return false;

    // Idempotency lock key per user + course
    const lockKey = `${user.id}_${courseCode.trim().toLowerCase()}`;
    if (inFlightReviewsRef.current.has(lockKey)) {
      console.warn(`[Idempotency Guard] Duplicate addReview call blocked for: ${lockKey}`);
      return false;
    }

    inFlightReviewsRef.current.add(lockKey);

    const newReviewId = `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const reviewDate = new Date().toISOString().split("T")[0];
    const authorName = user?.name || "طالب سيناء";
    const authorId = user?.id;

    const newReview: CourseReview = {
      ...review,
      id: newReviewId,
      courseCode,
      author: authorName,
      authorId: authorId,
      date: reviewDate,
      helpfulCount: 0,
      helpfulUsers: []
    };

    // Optimistic UI update & Cache
    setReviews((prev) => {
      if (prev.some(r => r.id === newReviewId)) return prev;
      const updated = [newReview, ...prev];
      if (typeof window !== "undefined") {
        localStorage.setItem("su_course_reviews_cache", JSON.stringify(updated));
      }
      return updated;
    });

    try {
      // Authoritative Cloud INSERT
      if (isSupabaseConfigured && supabase && user) {
        const { error } = await supabase.from("reviews").insert({
          id: newReviewId,
          course_code: courseCode,
          rating: review.rating,
          difficulty: review.difficulty,
          workload: review.workload,
          attendance: review.attendance,
          exam_difficulty: review.examDifficulty,
          comment: review.comment,
          tips: review.tips,
          author: authorName,
          author_id: authorId,
          date: reviewDate,
          helpful_count: 0
        });

        if (error) {
          console.error("Supabase insert review error:", error.message);
          return false;
        }
      }
      return true;
    } catch (err) {
      console.error("Exception adding review to Supabase:", err);
      return false;
    } finally {
      // Release lock after cooldown to prevent rapid spamming
      setTimeout(() => {
        inFlightReviewsRef.current.delete(lockKey);
      }, 1000);
    }
  };

  // 6. DELETE REVIEW (Author or Admin Only via RLS & In-Flight Lock)
  const deleteReview = async (reviewId: string): Promise<boolean> => {
    if (inFlightDeleteRef.current.has(reviewId)) {
      return false;
    }
    inFlightDeleteRef.current.add(reviewId);

    // Optimistic UI update
    setReviews((prev) => {
      const updated = prev.filter((r) => r.id !== reviewId);
      if (typeof window !== "undefined") {
        localStorage.setItem("su_course_reviews_cache", JSON.stringify(updated));
      }
      return updated;
    });

    try {
      // Cloud DELETE
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
        if (error) {
          console.error("Supabase delete review error:", error.message);
          return false;
        }
      }
      return true;
    } catch (err) {
      console.error("Exception deleting review from Supabase:", err);
      return false;
    } finally {
      setTimeout(() => {
        inFlightDeleteRef.current.delete(reviewId);
      }, 500);
    }
  };

  // 6. TOGGLE HELPFUL (Safe per-user local toggle)
  const toggleHelpfulReview = (reviewId: string) => {
    if (typeof window === "undefined") return;
    const likedKey = `su_helpful_reviews_${user?.id || "anon"}`;
    let likedList: string[] = [];
    try {
      const saved = localStorage.getItem(likedKey);
      if (saved) likedList = JSON.parse(saved);
    } catch (e) {}

    const alreadyLiked = likedList.includes(reviewId);
    const newLikedList = alreadyLiked ? likedList.filter((id) => id !== reviewId) : [...likedList, reviewId];
    localStorage.setItem(likedKey, JSON.stringify(newLikedList));

    setReviews((prev) => {
      const updated = prev.map((r) => {
        if (r.id === reviewId) {
          const newCount = alreadyLiked ? Math.max(0, r.helpfulCount - 1) : r.helpfulCount + 1;
          return { ...r, helpfulCount: newCount };
        }
        return r;
      });
      localStorage.setItem("su_course_reviews_cache", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleLikeResource = (id: string) => {
    let newLikes = [...likedResources];
    if (newLikes.includes(id)) {
      newLikes = newLikes.filter((lid) => lid !== id);
    } else {
      newLikes.push(id);
    }
    setLikedResources(newLikes);
    saveState({ likedResources: newLikes });
  };

  const isResourceLiked = (id: string) => likedResources.includes(id);

  const rateResource = (id: string, rating: number) => {
    const newRatings = { ...ratedResources, [id]: rating };
    setRatedResources(newRatings);
    saveState({ ratedResources: newRatings });
  };

  const getResourceRating = (id: string) => ratedResources[id] || 0;

  const incrementDownload = (id: string) => {
    const current = downloadedResources[id] || 0;
    const newDownloads = { ...downloadedResources, [id]: current + 1 };
    setDownloadedResources(newDownloads);
    saveState({ downloadedResources: newDownloads });
  };

  const getResourceDownloads = (id: string, defaultVal: number) => {
    return (downloadedResources[id] || 0) + defaultVal;
  };

  const toggleRoadmapNode = (roadmapId: string, nodeId: string) => {
    const currentNodes = roadmapProgress[roadmapId] || [];
    let newNodes = [...currentNodes];
    if (newNodes.includes(nodeId)) {
      newNodes = newNodes.filter((nid) => nid !== nodeId);
    } else {
      newNodes.push(nodeId);
    }
    const newProgress = { ...roadmapProgress, [roadmapId]: newNodes };
    setRoadmapProgress(newProgress);
    saveState({ roadmapProgress: newProgress });
  };

  const isRoadmapNodeCompleted = (roadmapId: string, nodeId: string) => {
    return (roadmapProgress[roadmapId] || []).includes(nodeId);
  };

  const getRoadmapProgressPercentage = (roadmapId: string, totalNodes: number) => {
    if (totalNodes === 0) return 0;
    const completedCount = (roadmapProgress[roadmapId] || []).length;
    return Math.round((completedCount / totalNodes) * 100);
  };

  const addRecentlyViewed = (id: string, type: string, title: string, path: string) => {
    if (recentlyViewed.length > 0 && recentlyViewed[0].id === id) return;
    
    // Keep only top 4 items, avoid duplicates
    let newViewed = recentlyViewed.filter((item) => item.id !== id);
    newViewed.unshift({ id, type, title, path, timestamp: Date.now() });
    newViewed = newViewed.slice(0, 4);
    setRecentlyViewed(newViewed);
    saveState({ recentlyViewed: newViewed });
  };

  return (
    <LearningContext.Provider
      value={{
        bookmarks,
        reviews,
        likedResources,
        ratedResources,
        downloadedResources,
        roadmapProgress,
        recentlyViewed,
        toggleBookmark,
        isBookmarked,
        addReview,
        deleteReview,
        toggleHelpfulReview,
        toggleLikeResource,
        isResourceLiked,
        rateResource,
        getResourceRating,
        incrementDownload,
        getResourceDownloads,
        toggleRoadmapNode,
        isRoadmapNodeCompleted,
        getRoadmapProgressPercentage,
        addRecentlyViewed
      }}
    >
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  const context = React.useContext(LearningContext);
  if (context === undefined) {
    throw new Error("useLearning must be used within a LearningProvider");
  }
  return context;
}
