"use client";

import * as React from "react";
import { useApp } from "@/context/app-context";
import { useAuth } from "@/context/auth-context";
import { useAcademic } from "@/context/academic-context";
import { getAiResponse, sleep, AiMessage, StudentContext } from "@/lib/ai-engine";
import { getLocalizedUserName } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface ChatSession {
  id: string;
  title: string;
  messages: AiMessage[];
  createdAt: string;
}

export default function AiAssistantPage() {
  const { t, lang, dir } = useApp();
  const { user } = useAuth();
  const {
    cumulativeGpa,
    completedCredits,
    remainingCredits,
    graduationPercentage,
    completedCourses,
    plannedCourses
  } = useAcademic();

  const studentContext: StudentContext = React.useMemo(() => ({
    userName: user?.name,
    cumulativeGpa,
    completedCredits,
    remainingCredits,
    graduationPercentage,
    completedCourses,
    plannedCourses
  }), [user?.name, cumulativeGpa, completedCredits, remainingCredits, graduationPercentage, completedCourses, plannedCourses]);

  const [sessions, setSessions] = React.useState<ChatSession[]>([]);
  // Default to empty string "" so user starts on the fresh New Chat screen
  const [activeSessionId, setActiveSessionId] = React.useState<string>("");
  const [inputVal, setInputVal] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  // Load saved chat sessions from localStorage on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("su_ai_chat_sessions");
      if (saved) {
        const parsed: ChatSession[] = JSON.parse(saved);
        if (parsed.length > 0) {
          setSessions(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load AI sessions", e);
    }
  }, []);

  // Save sessions to localStorage whenever they update
  const saveSessionsToStorage = (updatedSessions: ChatSession[]) => {
    setSessions(updatedSessions);
    try {
      localStorage.setItem("su_ai_chat_sessions", JSON.stringify(updatedSessions));
    } catch (e) {
      console.warn("Failed to save AI sessions", e);
    }
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const messages = activeSession?.messages || [];

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages update in active session
  React.useEffect(() => {
    if (activeSessionId) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, activeSessionId]);

  // Reset to Fresh New Chat screen
  const startNewChatScreen = () => {
    setActiveSessionId("");
    setInputVal("");
  };

  // Delete a specific session
  const deleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter((s) => s.id !== sessionId);
    saveSessionsToStorage(updated);
    if (activeSessionId === sessionId) {
      setActiveSessionId("");
    }
  };

  // Send message from either New Chat Screen OR an Existing Session
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: AiMessage = { role: "user", content: textToSend };

    let currentSessionId = activeSessionId;
    let targetSession: ChatSession;

    let updatedSessions: ChatSession[];

    if (!currentSessionId || !activeSession) {
      // 1. Create a NEW Chat Session
      const newSessionId = `session-${Date.now()}`;
      const titleSnippet = textToSend.slice(0, 26) + (textToSend.length > 26 ? "..." : "");
      
      targetSession = {
        id: newSessionId,
        title: titleSnippet,
        messages: [userMsg],
        createdAt: new Date().toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" })
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

    saveSessionsToStorage(updatedSessions);
    setInputVal("");
    setIsLoading(true);

    try {
      await sleep(1200);
      const aiReply = getAiResponse(textToSend, studentContext);
      const assistantMsg: AiMessage = { role: "assistant", content: aiReply };

      const finalSessions = updatedSessions.map((s) => {
        if (s.id === currentSessionId) {
          return { ...s, messages: [...s.messages, assistantMsg] };
        }
        return s;
      });

      saveSessionsToStorage(finalSessions);
    } catch (e) {
      const errorMsg: AiMessage = {
        role: "assistant",
        content: t(
          "⚠️ عذراً، حدث خطأ أثناء الاتصال بالمرشد الذكي. يرجى المحاولة مرة أخرى.",
          "⚠️ Sorry, an error occurred connecting to the AI advisor. Please try again."
        )
      };

      const finalSessions = updatedSessions.map((s) => {
        if (s.id === currentSessionId) {
          return { ...s, messages: [...s.messages, errorMsg] };
        }
        return s;
      });

      saveSessionsToStorage(finalSessions);
    } finally {
      setIsLoading(false);
    }
  };

  const isRtl = dir === "rtl";
  const displayName = getLocalizedUserName(user?.name?.split(" ")[0], lang === "ar" ? "ar" : "en");

  // Quick Action Capabilities for the New Chat Screen
  const quickCapabilities = [
    {
      icon: Calculator,
      color: "from-blue-500 to-cyan-500",
      bgLight: "bg-blue-500/10 border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-blue-400",
      titleAr: "الـ GPA والمعدل المباشر",
      titleEn: "Live GPA & Progress",
      descAr: "استعرض المعدل التراكمي المباشر ونقاط التخرج وتوقعات الدرجات.",
      descEn: "View live GPA, credit hours, and grade predictions.",
      prompt: "ال gpa بتاعي كام دلوقتي؟"
    },
    {
      icon: LinkIcon,
      color: "from-purple-500 to-indigo-500",
      bgLight: "bg-purple-500/10 border-purple-200 dark:border-purple-800/40 text-purple-600 dark:text-purple-400",
      titleAr: "المتطلبات والسلاسل",
      titleEn: "Prerequisites Chains",
      descAr: "فحص شروط أي مادة والمواد المفتاحية قبل التسجيل الأكاديمي.",
      descEn: "Check prerequisite courses and unlocks before registration.",
      prompt: "ما هي شروط مادة برمجة 2 وهياكل البيانات؟"
    },
    {
      icon: Calendar,
      color: "from-emerald-500 to-teal-500",
      bgLight: "bg-emerald-500/10 border-emerald-200 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400",
      titleAr: "تخطيط جدول الترم",
      titleEn: "Semester Planning",
      descAr: "اقترح جدولاً دراسياً متوازناً بعبء 15-18 ساعة معتمدة.",
      descEn: "Suggest a balanced semester registration plan.",
      prompt: "اقترحلي خطة لتسجيل ترم متوازن"
    },
    {
      icon: Code2,
      color: "from-amber-500 to-orange-500",
      bgLight: "bg-amber-500/10 border-amber-200 dark:border-amber-800/40 text-amber-600 dark:text-amber-400",
      titleAr: "مسارات التكنولوجيا والبرمجة",
      titleEn: "Tech & Career Roadmaps",
      descAr: "أسئلة حول Frontend, Backend, AI, ولغات البرمجة.",
      descEn: "Questions on Frontend, Backend, AI, and programming languages.",
      prompt: "ما الفرق بين مسار Frontend ومسار Backend وكيف أبدأ؟"
    }
  ];

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-100px)]" dir={dir}>
      {/* Page Title */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-violet-500 fill-violet-500/10" />
            {t("المرشد الأكاديمي والتقني الذكي", "Smart Academic & Tech AI Guide")}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {t(
              "مساعدك الشخصي المرتبط ببيانات حسابك المباشرة وبكل مواد وتخصصات الكلية والتكنولوجيا.",
              "Your AI assistant connected live to your student data, faculty curricula, and tech roadmaps."
            )}
          </p>
        </div>
        
        {/* New Chat Button */}
        <Button onClick={startNewChatScreen} size="sm" className="gap-1.5 text-xs font-bold shadow-sm cursor-pointer">
          <Plus className="h-4 w-4" />
          <span>{t("محادثة جديدة", "New Chat")}</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* Sidebar History (Desktop) */}
        <div className="hidden lg:flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-4 space-y-4 overflow-y-auto">
          {/* New Chat Action in Sidebar */}
          <button
            onClick={startNewChatScreen}
            className={`w-full p-3 rounded-2xl border flex items-center gap-2.5 font-bold text-xs transition-all cursor-pointer shadow-2xs ${
              activeSessionId === ""
                ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                : "bg-zinc-50 dark:bg-zinc-850/50 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:border-violet-400"
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>{t("محادثة جديدة", "New Chat")}</span>
          </button>

          <div className="flex justify-between items-center pt-2 pb-1 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{t("سجل المحادثات", "Chat History")}</span>
            </h3>
            <span className="text-[10px] font-bold text-zinc-400">({sessions.length})</span>
          </div>

          <div className="space-y-1.5 flex-1 overflow-y-auto">
            {sessions.length === 0 ? (
              <div className="text-center py-8 text-zinc-400 text-xs font-semibold">
                {t("لا توجد محادثات سابقة بعد", "No previous chats yet")}
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
                        ? "border-violet-500/50 bg-violet-50/80 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 font-extrabold shadow-xs"
                        : "border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-850/50 text-zinc-650 dark:text-zinc-400"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MessageSquare className={`h-4 w-4 shrink-0 ${isActive ? "text-violet-600 dark:text-violet-400" : "text-zinc-400"}`} />
                      <div className="min-w-0">
                        <span className="text-xs truncate block">{s.title}</span>
                        <span className="text-[9px] opacity-60 block mt-0.5">{s.createdAt}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => deleteSession(s.id, e)}
                      className="p-1 text-zinc-400 hover:text-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title={t("حذف المحادثة", "Delete Chat")}
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
          <div className="lg:hidden p-3 bg-zinc-50 dark:bg-zinc-950/40 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-2 overflow-x-auto">
            <button
              onClick={startNewChatScreen}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 ${
                activeSessionId === ""
                  ? "bg-violet-600 text-white"
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200"
              }`}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{t("محادثة جديدة", "New Chat")}</span>
            </button>
            {sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSessionId(s.id)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold shrink-0 ${
                  s.id === activeSessionId
                    ? "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300 border-violet-300"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>

          {/* SCREEN 1: NEW CHAT WELCOME LANDING HERO (When activeSessionId === "") */}
          {activeSessionId === "" ? (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 flex flex-col justify-start sm:justify-center items-center text-center space-y-6 my-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-2.5 max-w-xl shrink-0"
              >
                <div className="h-14 w-14 sm:h-16 sm:w-16 mx-auto rounded-3xl bg-gradient-to-tr from-violet-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <Sparkles className="h-7 w-7 sm:h-8 sm:w-8" />
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                  {t(`أهلاً بك، ${displayName} 👋`, `Welcome, ${displayName} 👋`)}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-semibold">
                  {t(
                    "ما الذي تريد استكشافه أو التخطيط له اليوم في مسيرتك الأكاديمية والمهنية؟",
                    "What would you like to explore or plan today in your academic and tech career?"
                  )}
                </p>
              </motion.div>

              {/* Quick capabilities grid cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-2xl text-right shrink-0">
                {quickCapabilities.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handleSendMessage(item.prompt)}
                      className={`p-3.5 sm:p-4 rounded-2xl border text-right transition-all cursor-pointer hover:scale-[1.01] hover:shadow-md flex flex-col justify-between space-y-2.5 ${item.bgLight}`}
                    >
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
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* SCREEN 2: ACTIVE CHAT MESSAGES STREAM */
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <AnimatePresence initial={false}>
                {messages.map((msg, index) => {
                  const isAssistant = msg.role === "assistant";
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3.5 max-w-[88%] ${
                        isAssistant
                          ? (isRtl ? "mr-0 ml-auto" : "ml-0 mr-auto")
                          : (isRtl ? "mr-auto ml-0 flex-row-reverse" : "ml-auto mr-0 flex-row-reverse")
                      }`}
                    >
                      {/* Avatar Icon */}
                      <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isAssistant
                          ? "bg-violet-100 text-violet-650 dark:bg-violet-950/60 dark:text-violet-400"
                          : "bg-zinc-100 text-zinc-650 dark:bg-zinc-800 dark:text-zinc-350"
                      }`}>
                        {isAssistant ? <Bot className="h-4.5 w-4.5" /> : <User className="h-4.5 w-4.5" />}
                      </div>

                      {/* Chat Bubble */}
                      <div className={`p-4.5 rounded-2xl text-xs leading-relaxed ${
                        isAssistant
                          ? "bg-zinc-100 dark:bg-zinc-800/90 text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-700/60 shadow-sm"
                          : "bg-violet-600 text-white dark:bg-violet-600 shadow-md font-medium"
                      }`}>
                        {/* Render simple markdown lines */}
                        <div className="space-y-2 prose max-w-none dark:prose-invert">
                          {msg.content.split("\n").map((line, lIdx) => {
                            if (line.startsWith("###")) {
                              return <h3 key={lIdx} className="font-extrabold text-sm text-zinc-900 dark:text-zinc-50 mt-4 mb-2">{line.replace("###", "").trim()}</h3>;
                            }
                            if (line.startsWith("####")) {
                              return <h4 key={lIdx} className="font-bold text-xs text-zinc-800 dark:text-zinc-100 mt-3 mb-1.5">{line.replace("####", "").trim()}</h4>;
                            }
                            if (line.startsWith("-")) {
                              return (
                                <li key={lIdx} className={`list-disc ${isRtl ? "pr-4" : "pl-4"} text-xs font-semibold`}>
                                  {line.replace("-", "").trim()}
                                </li>
                              );
                            }
                            return <p key={lIdx} className="whitespace-pre-line leading-relaxed text-zinc-900 dark:text-zinc-100">{line}</p>;
                          })}
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
                  className={`flex gap-3.5 max-w-[85%] ${isRtl ? "mr-0 ml-auto" : "ml-0 mr-auto"}`}
                >
                  <div className="h-8 w-8 rounded-xl bg-violet-100 dark:bg-violet-950/60 dark:text-violet-400 flex items-center justify-center shrink-0">
                    <Bot className="h-4.5 w-4.5" />
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 flex items-center gap-2">
                    <Spinner className="h-4 w-4 text-violet-500" />
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
          <div className="p-4 bg-zinc-50 dark:bg-zinc-950/30 border-t border-zinc-100 dark:border-zinc-850 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputVal);
              }}
              className="flex gap-2.5"
            >
              <Input
                type="text"
                placeholder={t(
                  "اسأل المرشد عن معدلك المباشر، متطلبات المواد، أو مفاهيم البرمجة...",
                  "Ask about your live GPA, course prerequisites, or programming concepts..."
                )}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                disabled={isLoading}
                className={`flex-1 rounded-2xl h-12 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-850 ${isRtl ? "pr-4" : "pl-4"}`}
              />
              <Button type="submit" disabled={isLoading || !inputVal.trim()} className="rounded-2xl h-12 px-6 shrink-0 gap-1.5 font-bold cursor-pointer">
                <Send className={`h-4.5 w-4.5 ${isRtl ? "rotate-180" : ""}`} />
                {t("إرسال", "Send")}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
