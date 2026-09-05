"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/app-context";
import { useAuth } from"@/context/auth-context";
import { useAcademic } from"@/context/academic-context";
import { useLearning } from"@/context/learning-context";
import { useAdmin } from "@/context/admin-context";
import { getAiResponse, sleep, AiMessage, StudentContext } from"@/lib/ai-engine";
import { cn } from"@/lib/utils";
import { supabase, isSupabaseConfigured } from"@/lib/supabase";
import { Button } from"@/components/ui/button";
import { Input } from"@/components/ui/input";
import { Badge } from"@/components/ui/badge";
import { Spinner } from"@/components/ui/spinner";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Trash2,
  ArrowUpRight,
  Plus,
  MessageSquare,
  Clock,
  Calculator,
  Link as LinkIcon,
  Calendar,
  Code2,
  BookOpen,
  GraduationCap,
  ChevronRight
} from"lucide-react";
import { motion, AnimatePresence } from"framer-motion";

export interface ChatSession {
  id: string;
  title: string;
  messages: AiMessage[];
  createdAt: string;
}

function renderInlineFormatting(text: string) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, pIdx) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={pIdx}
          dir="ltr"
          className="px-1.5 py-0.5 mx-0.5 rounded-md bg-zinc-200/80 dark:bg-zinc-700/60 font-mono text-[11px] font-bold text-sky-600 dark:text-sky-400 inline-block select-all"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={pIdx} className="font-black">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function renderMessageContent(content: string, isAssistant: boolean) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = "";

  lines.forEach((line, idx) => {
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <div key={`code-${idx}`} dir="ltr" className="my-2.5 rounded-xl overflow-hidden border border-zinc-750 dark:border-zinc-700 bg-zinc-950 text-left shadow-inner">
            {codeLang && (
              <div className="px-3 py-1 bg-zinc-900 border-b border-zinc-800 text-[10px] font-mono font-bold text-zinc-400 uppercase">
                {codeLang}
              </div>
            )}
            <pre className="p-3 text-xs font-mono text-emerald-400 dark:text-emerald-300 overflow-x-auto selection:bg-emerald-500/30">
              <code>{codeBuffer.join("\n")}</code>
            </pre>
          </div>
        );
        codeBuffer = [];
        codeLang = "";
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLang = line.trim().replace("```", "").trim();
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    if (line.startsWith("###")) {
      elements.push(
        <h3
          key={idx}
          dir="auto"
          className={`font-extrabold text-sm mt-3 mb-1.5 ${
            isAssistant ? "text-black dark:text-white" : "text-white"
          }`}
        >
          {renderInlineFormatting(line.replace("###", "").trim())}
        </h3>
      );
      return;
    }

    if (line.startsWith("####")) {
      elements.push(
        <h4
          key={idx}
          dir="auto"
          className={`font-bold text-xs mt-2.5 mb-1 ${
            isAssistant ? "text-black dark:text-white" : "text-white"
          }`}
        >
          {renderInlineFormatting(line.replace("####", "").trim())}
        </h4>
      );
      return;
    }

    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      elements.push(
        <li
          key={idx}
          dir="auto"
          className={`list-disc ps-4 text-xs font-semibold leading-relaxed ${
            isAssistant ? "text-black dark:text-white" : "text-white"
          }`}
        >
          {renderInlineFormatting(line.trim().replace(/^[-*]\s+/, ""))}
        </li>
      );
      return;
    }

    if (/^\d+\.\s+/.test(line.trim())) {
      elements.push(
        <div
          key={idx}
          dir="auto"
          className={`ps-2 text-xs font-semibold leading-relaxed ${
            isAssistant ? "text-black dark:text-white" : "text-white"
          }`}
        >
          {renderInlineFormatting(line.trim())}
        </div>
      );
      return;
    }

    if (!line.trim()) {
      elements.push(<div key={idx} className="h-1.5" />);
      return;
    }

    elements.push(
      <p
        key={idx}
        dir="auto"
        className={`whitespace-pre-line leading-relaxed ${
          isAssistant ? "text-black dark:text-white" : "text-white"
        }`}
      >
        {renderInlineFormatting(line)}
      </p>
    );
  });

  if (inCodeBlock && codeBuffer.length > 0) {
    elements.push(
      <div key="unclosed-code" dir="ltr" className="my-2.5 rounded-xl overflow-hidden border border-zinc-750 dark:border-zinc-700 bg-zinc-950 text-left shadow-inner">
        <pre className="p-3 text-xs font-mono text-emerald-400 dark:text-emerald-300 overflow-x-auto">
          <code>{codeBuffer.join("\n")}</code>
        </pre>
      </div>
    );
  }

  return elements;
}

export default function AiAssistantPage() {
  const router = useRouter();
  const { t, lang, dir, userName } = useApp();
  const { user } = useAuth();
  const { faqs, settings } = useAdmin();

  const isAdmin = user?.role === "admin" || user?.role === "super-admin" || user?.role === "moderator";
  const aiStatus = settings?.featureAccess?.aiAssistant || "ALL";

  React.useEffect(() => {
    if (aiStatus === "DISABLED" || (aiStatus === "ADMIN_ONLY" && !isAdmin)) {
      router.replace("/dashboard");
    }
  }, [aiStatus, isAdmin, router]);

  const {
    cumulativeGpa,
    completedCredits,
    remainingCredits,
    graduationPercentage,
    completedCourses,
    plannedCourses
  } = useAcademic();
  const { roadmapProgress } = useLearning();

  if (aiStatus === "DISABLED" || (aiStatus === "ADMIN_ONLY" && !isAdmin)) {
    return null;
  }

  const studentContext: StudentContext = React.useMemo(() => ({
    userName: userName || user?.name,
    cumulativeGpa,
    completedCredits,
    remainingCredits,
    graduationPercentage,
    completedCourses,
    plannedCourses,
    roadmapProgress,
    faqs
  }), [userName, user?.name, cumulativeGpa, completedCredits, remainingCredits, graduationPercentage, completedCourses, plannedCourses, roadmapProgress, faqs]);

  const [sessions, setSessions] = React.useState<ChatSession[]>([]);
  // Default to empty string"" so user starts on the fresh New Chat screen
  const [activeSessionId, setActiveSessionId] = React.useState<string>("");
  const [inputVal, setInputVal] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const inFlightDeleteSessionRef = React.useRef<Set<string>>(new Set());

  // Load saved chat sessions from Supabase Cloud DB and local cache on mount
  React.useEffect(() => {
    let isMounted = true;
    const userCacheKey = user?.id ? `su_ai_chat_sessions_${user.id}` :"su_ai_chat_sessions";

    try {
      const saved = localStorage.getItem(userCacheKey) || localStorage.getItem("su_ai_chat_sessions");
      if (saved) {
        const parsed: ChatSession[] = JSON.parse(saved);
        if (parsed.length > 0) {
          setSessions(parsed);
        }
      }
    } catch (e) { }

    // Authoritative Cloud Fetch from Supabase ai_conversations table
    const fetchAiCloud = async () => {
      if (isSupabaseConfigured && supabase && user?.id) {
        try {
          const { data, error } = await supabase
            .from("ai_conversations")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (!error && data && Array.isArray(data) && data.length > 0 && isMounted) {
            const mappedSessions: ChatSession[] = data.map((conv: any) => ({
              id: conv.id,
              title: conv.title ||"محادثة مخصصة",
              createdAt: conv.created_at || new Date().toISOString(),
              messages: Array.isArray(conv.messages) ? conv.messages : (typeof conv.messages ==="string" ? JSON.parse(conv.messages ||"[]") : [])
            }));
            setSessions(mappedSessions);
            localStorage.setItem(userCacheKey, JSON.stringify(mappedSessions));
          }
        } catch (err) {
          console.warn("AI Cloud fetch error:", err);
        }
      }
    };

    fetchAiCloud();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  // ============================================================================
  // ACTIVE-SESSION-ONLY SERIALIZED PERSISTENCE ENGINE
  // ============================================================================
  // Map holding pending updates for sessions currently being synced
  const pendingSessionSyncRef = React.useRef<Map<string, ChatSession>>(new Map());
  const isSessionSyncingRef = React.useRef<Set<string>>(new Set());
  const userRef = React.useRef(user);
  userRef.current = user;

  // Persists ONLY the specific active session to Supabase Cloud DB with per-session serial lock
  const persistSessionToCloud = React.useCallback(async (session: ChatSession) => {
    const currentUser = userRef.current;
    if (!isSupabaseConfigured || !supabase || !currentUser?.id || !session?.id) {
      return;
    }

    const sessionId = session.id;

    // Buffer the latest snapshot for this session
    pendingSessionSyncRef.current.set(sessionId, session);

    // If an upsert for this session is already in-flight, it will pick up the latest snapshot in finally block
    if (isSessionSyncingRef.current.has(sessionId)) {
      return;
    }

    isSessionSyncingRef.current.add(sessionId);

    while (pendingSessionSyncRef.current.has(sessionId)) {
      const snapshot = pendingSessionSyncRef.current.get(sessionId);
      pendingSessionSyncRef.current.delete(sessionId);

      if (!snapshot) break;

      try {
        const { error } = await supabase.from("ai_conversations").upsert({
          id: snapshot.id,
          user_id: currentUser.id,
          title: snapshot.title,
          messages: snapshot.messages,
          updated_at: new Date().toISOString()
        }, { onConflict:"id" });

        if (error) {
          console.warn("[AI Session Sync] Upsert warning:", error.message);
        }
      } catch (err: any) {
        console.warn("[AI Session Sync] Network or unexpected error:", err?.message || err);
      }
    }

    isSessionSyncingRef.current.delete(sessionId);
  }, []);

  // Update local React state and localStorage cache instantly (Local-First)
  const updateLocalSessions = React.useCallback((updatedSessions: ChatSession[]) => {
    setSessions(updatedSessions);
    const currentUser = userRef.current;
    const userCacheKey = currentUser?.id ? `su_ai_chat_sessions_${currentUser.id}` :"su_ai_chat_sessions";
    try {
      localStorage.setItem(userCacheKey, JSON.stringify(updatedSessions));
    } catch (e) {
      console.warn("[AI Assistant] LocalStorage write error:", e);
    }
  }, []);

  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const messages = activeSession?.messages || [];

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages update in active session
  React.useEffect(() => {
    if (activeSessionId) {
      messagesEndRef.current?.scrollIntoView({ behavior:"smooth" });
    }
  }, [messages, isLoading, activeSessionId]);

  // Reset to Fresh New Chat screen
  const startNewChatScreen = () => {
    setActiveSessionId("");
    setInputVal("");
  };

  // Delete a specific session (Local state + Single row deletion in Supabase)
  const deleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (inFlightDeleteSessionRef.current.has(sessionId)) {
      console.warn(`[AI Idempotency] Duplicate deleteSession blocked for: ${sessionId}`);
      return;
    }
    inFlightDeleteSessionRef.current.add(sessionId);

    const updated = sessions.filter((s) => s.id !== sessionId);
    updateLocalSessions(updated);

    if (activeSessionId === sessionId) {
      setActiveSessionId("");
    }

    try {
      // Delete single session from Supabase Cloud DB
      if (isSupabaseConfigured && supabase && user?.id) {
        await supabase
          .from("ai_conversations")
          .delete()
          .eq("id", sessionId)
          .eq("user_id", user.id);
      }
    } catch (err) {
      console.warn("[AI Session Delete] Cloud delete warning:", err);
    } finally {
      setTimeout(() => {
        inFlightDeleteSessionRef.current.delete(sessionId);
      }, 500);
    }
  };

  // Send message from either New Chat Screen OR an Existing Session
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: AiMessage = { role:"user", content: textToSend };

    let currentSessionId = activeSessionId;
    let targetSession: ChatSession;
    let updatedSessions: ChatSession[];

    if (!currentSessionId || !activeSession) {
      // 1. Create a NEW Chat Session
      const newSessionId = `session-${Date.now()}`;
      const titleSnippet = textToSend.slice(0, 26) + (textToSend.length > 26 ?"..." :"");

      targetSession = {
        id: newSessionId,
        title: titleSnippet,
        messages: [userMsg],
        createdAt: new Date().toLocaleTimeString(lang ==="ar" ?"ar-EG" :"en-US", { hour:"2-digit", minute:"2-digit" })
      };

      currentSessionId = newSessionId;
      setActiveSessionId(newSessionId);
      updatedSessions = [targetSession, ...sessions];
    } else {
      // 2. Append to Existing Chat Session
      const updatedMessages = [...activeSession.messages, userMsg];
      targetSession = { ...activeSession, messages: updatedMessages };

      updatedSessions = sessions.map((s) => (s.id === currentSessionId ? targetSession : s));
    }

    // Update Local-first state and cache
    updateLocalSessions(updatedSessions);
    // Persist ONLY the active session to Supabase
    persistSessionToCloud(targetSession);

    setInputVal("");
    setIsLoading(true);

    try {
      await sleep(1200);
      const aiReply = getAiResponse(textToSend, studentContext, activeSession?.messages || []);
      const assistantMsg: AiMessage = { role:"assistant", content: aiReply };

      let finalTargetSession: ChatSession | null = null;
      const finalSessions = updatedSessions.map((s) => {
        if (s.id === currentSessionId) {
          finalTargetSession = { ...s, messages: [...s.messages, assistantMsg] };
          return finalTargetSession;
        }
        return s;
      });

      updateLocalSessions(finalSessions);
      if (finalTargetSession) {
        persistSessionToCloud(finalTargetSession);
      }
    } catch (e) {
      const errorMsg: AiMessage = {
        role:"assistant",
        content: t(
          "عذراً، حدث خطأ أثناء الاتصال بالمرشد الذكي. يرجى المحاولة مرة أخرى.",
          "Sorry, an error occurred connecting to the AI advisor. Please try again."
        )
      };

      let errorTargetSession: ChatSession | null = null;
      const finalSessions = updatedSessions.map((s) => {
        if (s.id === currentSessionId) {
          errorTargetSession = { ...s, messages: [...s.messages, errorMsg] };
          return errorTargetSession;
        }
        return s;
      });

      updateLocalSessions(finalSessions);
      if (errorTargetSession) {
        persistSessionToCloud(errorTargetSession);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isRtl = dir === "rtl";
  const displayName = userName.trim().split(/\s+/)[0] || (lang === "ar" ? "طالب" : "Student");

  // Quick Action Capabilities for the New Chat Screen
  const quickCapabilities = [
    {
      icon: Calculator,
      color:"from-blue-500 to-cyan-500",
      bgLight:"bg-blue-500/10 border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-blue-400",
      titleAr:"الـ GPA والمعدل المباشر",
      titleEn:"Live GPA & Progress",
      descAr:"استعرض المعدل التراكمي المباشر ونقاط التخرج وتوقعات الدرجات.",
      descEn:"View live GPA, credit hours, and grade predictions.",
      prompt:"ال gpa بتاعي كام دلوقتي؟"
    },
    {
      icon: LinkIcon,
      color:"from-sky-600 to-cyan-600",
      bgLight:"bg-sky-500/10 border-sky-200 dark:border-sky-800/40 text-sky-600 dark:text-sky-400",
      titleAr:"المتطلبات والسلاسل",
      titleEn:"Prerequisites Chains",
      descAr:"فحص شروط أي مادة والمواد المفتاحية قبل التسجيل الأكاديمي.",
      descEn:"Check prerequisite courses and unlocks before registration.",
      prompt:"ما هي شروط مادة برمجة 2 وهياكل البيانات؟"
    },
    {
      icon: Calendar,
      color:"from-emerald-500 to-teal-500",
      bgLight:"bg-emerald-500/10 border-emerald-200 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400",
      titleAr:"تخطيط جدول الترم",
      titleEn:"Semester Planning",
      descAr:"اقترح جدولاً دراسياً متوازناً بعبء 15-18 ساعة معتمدة.",
      descEn:"Suggest a balanced semester registration plan.",
      prompt:"اقترحلي خطة لتسجيل ترم متوازن"
    },
    {
      icon: Code2,
      color:"from-amber-500 to-orange-500",
      bgLight:"bg-amber-500/10 border-amber-200 dark:border-amber-800/40 text-amber-600 dark:text-amber-400",
      titleAr:"مسارات التكنولوجيا والبرمجة",
      titleEn:"Tech & Career Roadmaps",
      descAr:"أسئلة حول Frontend, Backend, AI, ولغات البرمجة.",
      descEn:"Questions on Frontend, Backend, AI, and programming languages.",
      prompt:"ما الفرق بين مسار Frontend ومسار Backend وكيف أبدأ؟"
    }
  ];

  return (
    <div className="space-y-2 sm:space-y-4 flex flex-col h-[calc(100dvh-175px)] sm:h-[calc(100dvh-160px)] md:h-[calc(100vh-100px)]" dir={dir}>
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 shrink-0">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary fill-sky-500/10" />
            {t("المرشد الأكاديمي والتقني الذكي","Smart Academic & Tech AI Guide")}
          </h1>
          <p className="hidden sm:block text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {t("مساعدك الشخصي المرتبط ببيانات حسابك المباشرة وبكل مواد وتخصصات الكلية والتكنولوجيا.","Your AI assistant connected live to your student data, faculty curricula, and tech roadmaps."
            )}
          </p>
        </div>
        
        {/* New Chat Button (Desktop only here, mobile has it in the session strip) */}
        <Button onClick={startNewChatScreen} size="sm" className="hidden sm:inline-flex w-auto gap-1.5 text-xs font-bold shadow-sm cursor-pointer justify-center">
          <Plus className="h-4 w-4" />
          <span>{t("محادثة جديدة","New Chat")}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* Sidebar History (Desktop) */}
        <div className="hidden lg:flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-4 space-y-4 overflow-y-auto">
          {/* New Chat Action in Sidebar */}
          <button
            onClick={startNewChatScreen}
            className={`w-full p-3 rounded-2xl border flex items-center gap-2.5 font-bold text-xs transition-all cursor-pointer shadow-2xs ${
              activeSessionId ===""
                ?"bg-sky-600 text-white border-sky-600 shadow-sm"
                :"bg-zinc-50 dark:bg-zinc-850/50 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:border-sky-400"
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>{t("محادثة جديدة","New Chat")}</span>
          </button>

          <div className="flex justify-between items-center pt-2 pb-1 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-zinc-900 dark:text-white" />
              <span>{t("سجل المحادثات","Chat History")}</span>
            </h3>
            <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-200">({sessions.length})</span>
          </div>

          <div className="space-y-1.5 flex-1 overflow-y-auto">
            {sessions.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 dark:text-zinc-300 text-xs font-semibold">
                {t("لا توجد محادثات سابقة بعد","No previous chats yet")}
              </div>
            ) : (
              sessions.map((s) => {
                const isActive = s.id === activeSessionId;
                return (
                  <div
                    key={s.id}
                    onClick={() => setActiveSessionId(s.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isActive
                        ?"border-sky-500/50 bg-sky-50/80 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-extrabold shadow-xs"
                        :"border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-850/50 text-zinc-900 dark:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MessageSquare className={`h-4 w-4 shrink-0 ${isActive ?"text-sky-600 dark:text-sky-400" :"text-zinc-700 dark:text-zinc-200"}`} />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-zinc-900 dark:text-white truncate block">{s.title}</span>
                        <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-300 block mt-0.5">{s.createdAt}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => deleteSession(s.id, e)}
                      className="p-1 text-zinc-400 hover:text-red-500 dark:text-zinc-300 dark:hover:text-red-400 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title={t("حذف المحادثة","Delete Chat")}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Main Panel View */}
        <div className="lg:col-span-3 flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl overflow-hidden shadow-sm">
          {/* Mobile Sessions Switcher Strip */}
          <div className="lg:hidden p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-950/40 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-1.5 sm:gap-2 overflow-x-auto">
            <button
              onClick={startNewChatScreen}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 ${
                activeSessionId ===""
                  ?"bg-sky-600 text-white shadow-xs"
                  :"bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200"
              }`}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{t("محادثة جديدة","New Chat")}</span>
            </button>
            {sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSessionId(s.id)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold shrink-0 max-w-[130px] truncate ${
                  s.id === activeSessionId
                    ?"bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border-sky-300 font-bold"
                    :"bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>

          {/* SCREEN 1: NEW CHAT WELCOME LANDING HERO (When activeSessionId ==="") */}
          {activeSessionId ==="" ? (
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 flex flex-col justify-center items-center text-center space-y-3 sm:space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-1.5 sm:space-y-2.5 max-w-xl shrink-0"
              >
                <div className="h-10 w-10 sm:h-16 sm:w-16 mx-auto rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white flex items-center justify-center shadow-md sm:shadow-lg shadow-sky-500/20">
                  <Sparkles className="h-5 w-5 sm:h-8 sm:w-8" />
                </div>
                <h2 className="text-base sm:text-2xl md:text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                  {lang === "ar" ? `أهلاً بك، ${displayName} 👋` : `Welcome, ${displayName} 👋`}
                </h2>
                <p className="text-[11px] sm:text-sm text-zinc-500 dark:text-zinc-400 leading-tight sm:leading-relaxed font-semibold max-w-xs sm:max-w-xl">
                  {t("ما الذي تريد استكشافه أو التخطيط له اليوم في مسيرتك الأكاديمية والمهنية؟","What would you like to explore or plan today in your academic and tech career?"
                  )}
                </p>
              </motion.div>

              {/* Quick capabilities grid cards - Compact 2x2 on mobile */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3.5 w-full max-w-2xl text-right shrink-0">
                {quickCapabilities.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handleSendMessage(item.prompt)}
                      className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border text-right transition-all cursor-pointer hover:scale-[1.01] hover:shadow-md ${item.bgLight}`}
                    >
                      {/* Mobile Compact Horizontal Row */}
                      <div className="flex sm:hidden items-center gap-2 w-full">
                        <div className="p-1.5 rounded-lg bg-white/80 dark:bg-zinc-950/80 shadow-xs shrink-0">
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <h4 className="text-[11px] font-black text-zinc-900 dark:text-zinc-100 truncate flex-1 text-right">
                          {t(item.titleAr, item.titleEn)}
                        </h4>
                      </div>

                      {/* Desktop / Tablet Rich Vertical Layout */}
                      <div className="hidden sm:flex flex-col justify-between space-y-2.5 h-full">
                        <div className="flex items-center justify-between">
                          <div className="p-2 rounded-xl bg-white/80 dark:bg-zinc-950/80 shadow-xs">
                            <Icon className="h-4.5 w-4.5" />
                          </div>
                          <ArrowUpRight className="h-4 w-4 opacity-60" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-zinc-900 dark:text-zinc-100 mb-0.5">
                            {t(item.titleAr, item.titleEn)}
                          </h4>
                          <p className="text-[10px] sm:text-[11px] text-zinc-650 dark:text-zinc-400 leading-snug font-medium line-clamp-2">
                            {t(item.descAr, item.descEn)}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* SCREEN 2: ACTIVE CHAT MESSAGES STREAM */
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3.5 sm:space-y-5 flex flex-col">
              <AnimatePresence initial={false}>
                {messages.map((msg, index) => {
                  const isAssistant = msg.role === "assistant";
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2.5 sm:gap-3.5 max-w-[92%] sm:max-w-[85%] ${
                        isAssistant
                          ? "self-start flex-row"
                          : "self-end flex-row-reverse"
                      }`}
                    >
                      {/* Avatar Icon */}
                      <div className={`h-7 w-7 sm:h-8 sm:w-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isAssistant
                          ? "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400"
                          : "bg-zinc-100 text-zinc-650 dark:bg-zinc-800 dark:text-zinc-350"
                      }`}>
                        {isAssistant ? <Bot className="h-4 w-4 sm:h-4.5 sm:w-4.5" /> : <User className="h-4 w-4 sm:h-4.5 sm:w-4.5" />}
                      </div>

                      {/* Chat Bubble */}
                      <div
                        dir="auto"
                        className={`p-3 sm:p-4.5 rounded-2xl text-xs sm:text-sm leading-relaxed break-words overflow-hidden ${
                          isAssistant
                            ? "bg-zinc-100 dark:bg-zinc-800/90 text-black dark:text-white border border-zinc-200/80 dark:border-zinc-700/60 shadow-sm"
                            : "bg-sky-600 text-white dark:bg-sky-600 shadow-md font-medium"
                        }`}
                      >
                        <div className="space-y-2 prose max-w-none dark:prose-invert text-start">
                          {renderMessageContent(msg.content, isAssistant)}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Typing state indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3.5 max-w-[85%] self-start"
                >
                  <div className="h-8 w-8 rounded-xl bg-sky-100 dark:bg-sky-950/60 dark:text-sky-400 flex items-center justify-center shrink-0">
                    <Bot className="h-4.5 w-4.5" />
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 flex items-center gap-2">
                    <Spinner className="h-4 w-4 text-sky-600" />
                    <span className="text-[11px] font-bold">
                      {t("جاري معالجة الإجابة والأكواد المباشرة...", "Processing live data & response...")}
                    </span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* INPUT PANEL AT BOTTOM */}
          <div className="p-2 sm:p-3.5 bg-zinc-50/90 dark:bg-zinc-950/50 backdrop-blur-md border-t border-zinc-100 dark:border-zinc-850 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputVal);
              }}
              className="flex gap-2"
            >
              <Input
                type="text"
                dir="auto"
                placeholder={t("اسأل المرشد عن معدلك المباشر، متطلبات المواد، أو مفاهيم البرمجة...", "Ask about your live GPA, course prerequisites, or programming concepts..."
                )}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                disabled={isLoading}
                className="flex-1 rounded-xl sm:rounded-2xl h-10 sm:h-12 bg-white dark:bg-zinc-900 text-xs sm:text-sm text-black dark:text-white placeholder:text-black dark:placeholder:text-white border-zinc-200 dark:border-zinc-850 px-3.5 sm:px-4"
              />
              <Button type="submit" disabled={isLoading || !inputVal.trim()} className="rounded-xl sm:rounded-2xl h-10 sm:h-12 px-3.5 sm:px-6 shrink-0 gap-1.5 font-bold cursor-pointer text-xs sm:text-sm">
                <Send className={`h-4 w-4 ${isRtl ? "-scale-x-100" : ""}`} />
                <span>{t("إرسال", "Send")}</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
