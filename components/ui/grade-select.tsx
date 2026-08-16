"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Star, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GradeSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  disabled?: boolean;
  className?: string;
}

export function GradeSelect({ value, onChange, options, disabled, className }: GradeSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [coords, setCoords] = React.useState({ top: 0, left: 0, width: 0 });

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        ref.current && !ref.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen && ref.current) {
      const updatePosition = () => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          setCoords({
            top: rect.bottom + window.scrollY + 4,
            left: rect.left + window.scrollX,
            width: Math.max(rect.width, 100), // Min width to prevent it being too narrow
          });
        }
      };
      
      updatePosition();
      
      const handleScroll = () => setIsOpen(false);
      window.addEventListener("scroll", handleScroll, true); // true to catch scroll in any scrollable container
      window.addEventListener("resize", handleScroll);
      
      return () => {
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", handleScroll);
      };
    }
  }, [isOpen]);

  // Prevent SSR hydration mismatch for portal
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <>
      <div className={`relative ${className}`} ref={ref}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-full flex items-center justify-between px-2.5 sm:px-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-xs sm:text-sm font-black text-zinc-850 dark:text-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
          dir="ltr"
        >
          <div className="flex items-center gap-2">
            <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500 shrink-0" />
            <span className="mt-0.5">{value || "--"}</span>
          </div>
          <ChevronDown className={`h-3 w-3 sm:h-4 sm:w-4 text-zinc-400 opacity-70 shrink-0 ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "absolute",
                top: coords.top,
                left: coords.left,
                width: coords.width,
              }}
              className="z-[99999] max-h-56 overflow-y-auto bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl py-1"
              dir="ltr"
            >
              {!value && (
                <button
                  type="button"
                  onClick={() => { onChange(""); setIsOpen(false); }}
                  className="w-full flex items-center px-3 py-2 text-xs sm:text-sm font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  --
                </button>
              )}
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => { onChange(opt); setIsOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm font-bold transition-colors ${
                    value === opt 
                      ? "bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400" 
                      : "text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  }`}
                >
                  <span>{opt}</span>
                  {value === opt && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
