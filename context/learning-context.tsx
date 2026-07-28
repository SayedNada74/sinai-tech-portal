"use client";

import * as React from "react";
import { useAuth } from "./auth-context";

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
  date: string;
  helpfulCount: number;
  helpfulUsers: string[]; // user IDs who liked this review
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
  addReview: (courseCode: string, review: Omit<CourseReview, "id" | "courseCode" | "author" | "date" | "helpfulCount" | "helpfulUsers">) => void;
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

// Static mock reviews database to populate items instantly
const INITIAL_REVIEWS: CourseReview[] = [];

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const [bookmarks, setBookmarks] = React.useState<BookmarkItem[]>([]);
  const [reviews, setReviews] = React.useState<CourseReview[]>(INITIAL_REVIEWS);
  const [likedResources, setLikedResources] = React.useState<string[]>([]);
  const [ratedResources, setRatedResources] = React.useState<Record<string, number>>({});
  const [downloadedResources, setDownloadedResources] = React.useState<Record<string, number>>({});
  const [roadmapProgress, setRoadmapProgress] = React.useState<Record<string, string[]>>({});
  const [recentlyViewed, setRecentlyViewed] = React.useState<LearningContextType["recentlyViewed"]>([]);

  // Load from localStorage on user change
  React.useEffect(() => {
    if (user) {
      const storageKey = `su_learning_${user.id}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setBookmarks(parsed.bookmarks || []);
          setReviews(parsed.reviews || INITIAL_REVIEWS);
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
        setReviews(INITIAL_REVIEWS);
        setLikedResources([]);
        setRatedResources({});
        setDownloadedResources({});
        setRoadmapProgress({});
        setRecentlyViewed([]);
      }
    } else {
      setBookmarks([]);
      setReviews(INITIAL_REVIEWS);
      setLikedResources([]);
      setRatedResources({});
      setDownloadedResources({});
      setRoadmapProgress({});
      setRecentlyViewed([]);
    }
  }, [user]);

  // Save helper
  const saveState = (updates: Partial<any>) => {
    if (user) {
      const storageKey = `su_learning_${user.id}`;
      const saved = localStorage.getItem(storageKey);
      let current = {};
      if (saved) {
        try {
          current = JSON.parse(saved);
        } catch (e) {}
      }
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          bookmarks,
          reviews,
          likedResources,
          ratedResources,
          downloadedResources,
          roadmapProgress,
          recentlyViewed,
          ...updates
        })
      );
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

  const addReview = (
    courseCode: string,
    review: Omit<CourseReview, "id" | "courseCode" | "author" | "date" | "helpfulCount" | "helpfulUsers">
  ) => {
    const newReview: CourseReview = {
      ...review,
      id: Math.random().toString(36).substring(2, 9),
      courseCode,
      author: user?.name || "طالب مجهول",
      date: new Date().toISOString().split("T")[0],
      helpfulCount: 0,
      helpfulUsers: []
    };
    const newReviews = [newReview, ...reviews];
    setReviews(newReviews);
    saveState({ reviews: newReviews });
  };

  const toggleHelpfulReview = (reviewId: string) => {
    if (!user) return;
    const newReviews = reviews.map((r) => {
      if (r.id === reviewId) {
        const liked = r.helpfulUsers.includes(user.id);
        const helpfulUsers = liked
          ? r.helpfulUsers.filter((uid) => uid !== user.id)
          : [...r.helpfulUsers, user.id];
        const helpfulCount = liked ? Math.max(0, r.helpfulCount - 1) : r.helpfulCount + 1;
        return {
          ...r,
          helpfulCount,
          helpfulUsers
        };
      }
      return r;
    });
    setReviews(newReviews);
    saveState({ reviews: newReviews });
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
