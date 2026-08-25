"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Code2, X } from "lucide-react";
import { useApp } from "@/context/app-context";

interface DeveloperCreditProps {
  variant?: "navbar" | "sidebar" | "footer" | "default";
  className?: string;
}

export function DeveloperCredit({ variant = "default", className = "" }: DeveloperCreditProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { dir } = useApp();

  // Close popup cleanly when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Reusable Popup Content
  const renderPopup = (title: string, positionClasses: string) => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.96 }}
          transition={{ duration: 0.12 }}
          className={`absolute ${positionClasses} w-52 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-zinc-900/10 dark:shadow-black/60 rounded-2xl p-2 z-50 overflow-hidden`}
          dir="ltr"
        >
          <div className="flex items-center justify-between px-2 py-1.5 border-b border-zinc-100 dark:border-zinc-800/80 mb-1.5">
            <p className="text-[10px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-wider">
              {title}
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1 rounded-md transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            <a
              href="https://github.com/SayedNada74"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-xs font-bold text-zinc-800 dark:text-zinc-100 hover:bg-teal-50 dark:hover:bg-zinc-800/80 hover:text-teal-600 dark:hover:text-teal-400 rounded-xl transition-all group"
            >
              <span>GitHub</span>
              <svg className="h-4 w-4 text-zinc-500 group-hover:text-teal-600 dark:text-zinc-400 dark:group-hover:text-teal-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>

            <a
              href="https://sayed-nada-portfolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-xs font-bold text-zinc-800 dark:text-zinc-100 hover:bg-teal-50 dark:hover:bg-zinc-800/80 hover:text-teal-600 dark:hover:text-teal-400 rounded-xl transition-all group"
            >
              <span>Portfolio</span>
              <Globe className="h-4 w-4 text-zinc-500 group-hover:text-teal-600 dark:text-zinc-400 dark:group-hover:text-teal-400 transition-colors" />
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // 1. FOOTER VARIANT (Landing Page footer & Mobile drawer badge)
  if (variant === "footer") {
    return (
      <div className={`relative inline-block ${className}`} ref={containerRef}>
        {renderPopup("Founder / Developer", "bottom-full mb-2 left-1/2 -translate-x-1/2")}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-900 dark:hover:bg-zinc-850 border border-zinc-200/80 dark:border-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-500/40 transition-all duration-200 cursor-pointer shadow-2xs"
          dir="ltr"
          aria-expanded={isOpen}
        >
          <Code2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
          <span>Developed by <strong className="font-bold text-zinc-950 dark:text-zinc-50">Sayed Nada</strong></span>
        </button>
      </div>
    );
  }

  // 2. NAVBAR VARIANT (Top navigation bar chip)
  if (variant === "navbar") {
    return (
      <div className={`relative inline-block ${className}`} ref={containerRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-850 text-zinc-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          title="Developer Portfolio & GitHub"
          aria-label="Developer Information"
          aria-expanded={isOpen}
        >
          <Code2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
          <span className="hidden lg:inline text-[11px] font-bold text-zinc-800 dark:text-zinc-200" dir="ltr">Sayed Nada</span>
        </button>

        {renderPopup("Lead Developer", "top-full mt-2 left-1/2 -translate-x-1/2")}
      </div>
    );
  }

  // 3. SIDEBAR / DEFAULT VARIANT (Desktop & Mobile Sidebars bottom button)
  return (
    <div className={`relative flex flex-col w-full ${className}`} ref={containerRef}>
      {renderPopup("Founder / Developer", "bottom-full left-0 right-0 mb-2 w-full")}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-3 py-2 bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/90 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-xl transition-all duration-200 group cursor-pointer shadow-2xs"
        aria-expanded={isOpen}
      >
        <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-300 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" dir="ltr">
          Developed by Sayed Nada
        </span>
        <Code2 className="h-4 w-4 text-teal-600 dark:text-teal-400 group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
}
