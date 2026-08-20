"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Code2 } from "lucide-react";
import { useApp } from "@/context/app-context";

export function DeveloperCredit() {
  const [isOpen, setIsOpen] = useState(false);
  const { dir } = useApp();
  const isRtl = dir === "rtl";

  return (
    <div 
      className={`fixed bottom-6 ${isRtl ? 'left-6 items-start' : 'right-6 items-end'} z-[100] flex flex-col`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="mb-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xl rounded-2xl p-1.5 w-48 overflow-hidden"
            dir="ltr" // keep ltr for the github/portfolio english text
          >
            <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-850/60 mb-1">
              <p className="text-[10px] font-black tracking-wider text-teal-600 dark:text-teal-400 uppercase text-center">
                Founder / Developer
              </p>
            </div>
            <a
              href="https://github.com/SayedNada74"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-700 dark:hover:text-teal-400 rounded-xl transition-all"
            >
              <span>GitHub</span>
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a
              href="https://sayed-nada-portfolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-700 dark:hover:text-teal-400 rounded-xl transition-all"
            >
              <span>Portfolio</span>
              <Globe className="h-4 w-4" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-5 py-2.5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800/80 shadow-lg hover:shadow-xl rounded-full transition-all duration-300 group"
      >
        <span className="text-xs font-extrabold text-zinc-800 dark:text-zinc-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" dir="ltr">
          Developed by Sayed Nada
        </span>
        <Code2 className="h-4 w-4 text-teal-600 dark:text-teal-400 group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
}
