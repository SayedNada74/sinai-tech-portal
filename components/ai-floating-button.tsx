"use client";

import * as React from"react";
import { getAiResponse, sleep, AiMessage } from"@/lib/ai-engine";
import { Card, CardHeader, CardTitle, CardContent } from"@/components/ui/card";
import { Input } from"@/components/ui/input";
import { Button } from"@/components/ui/button";
import { Spinner } from"@/components/ui/spinner";
import { Bot, X, Send, Sparkles, MessageCircle } from"lucide-react";
import { motion, AnimatePresence } from"framer-motion";

export function AiFloatingButton() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<AiMessage[]>([
    { role:"assistant", content:"مرحباً! اسألني أي سؤال أكاديمي سريع وسأجيبك فوراً." }
  ]);
  const [inputVal, setInputVal] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages, isLoading, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isLoading) return;

    const textToSend = inputVal;
    const newMessages = [...messages, { role:"user" as const, content: textToSend }];
    setMessages(newMessages);
    setInputVal("");
    setIsLoading(true);

    try {
      await sleep(1200);
      const response = getAiResponse(textToSend);
      setMessages([...newMessages, { role:"assistant" as const, content: response }]);
    } catch (e) {
      setMessages([
        ...newMessages,
        { role:"assistant" as const, content:"️ خطأ في الاتصال." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-end" dir="rtl">
      {/* Floating Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-[340px] h-[450px] bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/65 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Header */}
            <CardHeader className="py-3.5 px-4 bg-sky-600 text-white flex flex-row items-center justify-between shrink-0 space-y-0">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-sky-100" />
                <div className="text-right">
                  <h3 className="font-extrabold text-xs">المرشد الأكاديمي السريع</h3>
                  <span className="text-[9px] text-sky-200">مساعد الذكاء الاصطناعي الذكي</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </CardHeader>

            {/* Messages container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => {
                const isAssistant = msg.role ==="assistant";
                return (
                  <div
                    key={index}
                    className={`flex gap-2.5 max-w-[85%] ${
                      isAssistant ?"mr-0 ml-auto" :"mr-auto ml-0 flex-row-reverse"
                    }`}
                  >
                    <div className={`h-6.5 w-6.5 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                      isAssistant ?"bg-sky-100 text-sky-800 dark:bg-sky-950/40" :"bg-zinc-100 text-zinc-650"
                    }`}>
                      {isAssistant ?"" :""}
                    </div>
                    <div className={`p-3 rounded-2xl text-[11px] leading-relaxed ${
                      isAssistant
                        ?"bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700/60 font-medium"
                        :"bg-sky-600 text-white dark:bg-sky-600 font-medium"
                    }`}>
                      {/* Simple line formatting */}
                      {msg.content.split("\n").map((line, lIdx) => {
                        if (line.startsWith("###")) {
                          return <span key={lIdx} className="block font-black mt-2 text-zinc-900 dark:text-zinc-50">{line.replace("###","").trim()}</span>;
                        }
                        if (line.startsWith("-") || line.startsWith("1.")) {
                          return <span key={lIdx} className="block pr-2 font-semibold">· {line.replace("-","").substring(2).trim()}</span>;
                        }
                        return <span key={lIdx} className="block">{line}</span>;
                      })}
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex gap-2.5 max-w-[85%] mr-0 ml-auto">
                  <div className="h-6.5 w-6.5 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center shrink-0 text-xs">
                    
                  </div>
                  <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 flex items-center gap-1.5 text-[10px] font-bold">
                    <Spinner className="h-3 w-3 text-sky-500" />
                    <span>يكتب...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-zinc-50 dark:bg-zinc-950/40 border-t border-zinc-100 dark:border-zinc-850 flex gap-2 shrink-0">
              <Input
                type="text"
                placeholder="اسأل عن الشروط، صعوبة المواد..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                disabled={isLoading}
                className="h-10 rounded-xl bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-[11px] border-zinc-200 dark:border-zinc-800"
              />
              <Button type="submit" size="sm" disabled={isLoading || !inputVal.trim()} className="h-10 px-4 rounded-xl font-bold">
                <Send className="h-3.5 w-3.5 rotate-180" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-105 active:scale-95 cursor-pointer relative"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -45 }} animate={{ rotate: 0 }} exit={{ rotate: 45 }}>
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="relative">
              <MessageCircle className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-red-500 border-2 border-sky-600 flex items-center justify-center text-[7px] font-black text-white">1</span>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
export default AiFloatingButton;
