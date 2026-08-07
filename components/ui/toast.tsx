"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  message: string;
  type?: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const toast = React.useCallback((message: string, type: ToastType = "success") => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastItem = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Notification Container */}
      <div
        className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-6 sm:bottom-8 z-[9999] flex flex-col gap-3 max-w-md w-[calc(100vw-2rem)] sm:w-auto pointer-events-none"
        dir="rtl"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 50, scale: 0.85, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.8, y: -25, filter: "blur(8px)" }}
              transition={{ type: "spring", stiffness: 450, damping: 28 }}
              className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl backdrop-blur-2xl flex items-center justify-between gap-3 text-xs sm:text-sm font-bold transition-all ${
                t.type === "error"
                  ? "bg-rose-950/95 border-rose-500/60 text-rose-100 shadow-rose-500/25 ring-1 ring-rose-500/40"
                  : t.type === "info"
                  ? "bg-cyan-950/95 border-cyan-500/60 text-cyan-100 shadow-cyan-500/25 ring-1 ring-cyan-500/40"
                  : "bg-zinc-950/95 border-emerald-500/60 text-emerald-100 shadow-emerald-500/25 ring-1 ring-emerald-500/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.05 }}
                  className={`p-2 rounded-xl shrink-0 ${
                    t.type === "error"
                      ? "bg-rose-500/20 text-rose-400"
                      : t.type === "info"
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "bg-emerald-500/20 text-emerald-400"
                  }`}
                >
                  {t.type === "error" ? (
                    <AlertCircle className="h-5 w-5 animate-pulse" />
                  ) : t.type === "info" ? (
                    <Info className="h-5 w-5 animate-bounce" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5" />
                  )}
                </motion.div>
                <span className="leading-relaxed font-semibold text-zinc-100 text-xs sm:text-sm">{t.message}</span>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="opacity-70 hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-white/10 shrink-0 cursor-pointer text-zinc-400 hover:text-zinc-100"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      toast: (msg: string) => console.log("Toast:", msg)
    };
  }
  return context;
}
