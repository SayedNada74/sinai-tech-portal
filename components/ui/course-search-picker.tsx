"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Search, ChevronDown, Check, BookOpen, X, Clock, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/context/app-context";

export interface CourseOption {
  code: string;
  arabic: string;
  english: string;
  credits: number;
  /** If true, the course shows a "retake" badge */
  isRetake?: boolean;
}

interface CourseSearchPickerProps {
  value: string;
  onChange: (code: string) => void;
  options: CourseOption[];
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function CourseSearchPicker({
  value,
  onChange,
  options,
  disabled,
  className,
  placeholder,
}: CourseSearchPickerProps) {
  const { t, lang, dir } = useApp();
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [coords, setCoords] = React.useState({ top: 0, left: 0, width: 0 });
  const [dropDirection, setDropDirection] = React.useState<"down" | "up">("down");

  // Current selected course info
  const selectedCourse = React.useMemo(
    () => options.find((c) => c.code === value),
    [value, options]
  );

  // Filtered courses based on search
  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return options;
    const q = search.trim().toLowerCase();
    return options.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.arabic.toLowerCase().includes(q) ||
        c.english.toLowerCase().includes(q)
    );
  }, [options, search]);

  // Close on outside click
  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  // Position dropdown
  React.useEffect(() => {
    if (isOpen && triggerRef.current) {
      const updatePosition = () => {
        if (triggerRef.current) {
          const rect = triggerRef.current.getBoundingClientRect();
          const spaceBelow = window.innerHeight - rect.bottom;
          const spaceAbove = rect.top;
          const dropdownHeight = 340; // approximate max height

          const shouldDropUp = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
          setDropDirection(shouldDropUp ? "up" : "down");

          setCoords({
            top: shouldDropUp
              ? rect.top + window.scrollY - dropdownHeight - 4
              : rect.bottom + window.scrollY + 4,
            left: rect.left + window.scrollX,
            width: Math.max(rect.width, 320),
          });
        }
      };

      updatePosition();

      const handleScrollOrResize = (e: Event) => {
        if (
          dropdownRef.current &&
          (e.target === dropdownRef.current ||
            dropdownRef.current.contains(e.target as Node))
        ) {
          return;
        }
        setIsOpen(false);
        setSearch("");
      };
      window.addEventListener("scroll", handleScrollOrResize, true);
      window.addEventListener("resize", handleScrollOrResize);

      return () => {
        window.removeEventListener("scroll", handleScrollOrResize, true);
        window.removeEventListener("resize", handleScrollOrResize);
      };
    }
  }, [isOpen]);

  // Focus search input when dropdown opens
  React.useEffect(() => {
    if (isOpen) {
      // Small delay to let the animation start
      const timer = setTimeout(() => searchInputRef.current?.focus(), 80);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Keyboard nav
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setSearch("");
      }
    },
    []
  );

  // SSR guard
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const defaultPlaceholder = t("-- اختر المقرر الدراسي --", "-- Select a course --");

  return (
    <>
      <div className={`relative ${className || ""}`} ref={triggerRef}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            setIsOpen(!isOpen);
            if (isOpen) setSearch("");
          }}
          className={`w-full h-11 flex items-center justify-between gap-2 px-3 rounded-xl border transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/30 ${
            isOpen
              ? "border-sky-400 dark:border-sky-600 bg-sky-50/50 dark:bg-sky-950/30 ring-2 ring-sky-500/20"
              : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700"
          } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
          dir={dir}
        >
          {selectedCourse ? (
            <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
              <span className="shrink-0 text-[10px] font-mono font-black text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-950/80 px-1.5 py-0.5 rounded-md border border-sky-200/60 dark:border-sky-800/60">
                {selectedCourse.code}
              </span>
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                {lang === "ar" ? selectedCourse.arabic : selectedCourse.english}
              </span>
              <span className="shrink-0 text-[10px] text-zinc-400 font-semibold">
                ({selectedCourse.credits} {t("س", "cr")})
              </span>
              {selectedCourse.isRetake && (
                <span className="shrink-0 text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-800/60 flex items-center gap-0.5">
                  <RefreshCw className="h-2.5 w-2.5" />
                  {t("إعادة", "Retake")}
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
              {placeholder || defaultPlaceholder}
            </span>
          )}

          <ChevronDown
            className={`h-4 w-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {mounted &&
        typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: dropDirection === "down" ? -8 : 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: dropDirection === "down" ? -8 : 8, scale: 0.98 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  top: coords.top,
                  left: coords.left,
                  width: coords.width,
                }}
                className="z-[99999] bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                dir={dir}
                onKeyDown={handleKeyDown}
              >
                {/* Search Input */}
                <div className="p-2.5 border-b border-zinc-100 dark:border-zinc-800/80">
                  <div className="relative">
                    <Search className="absolute top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 ltr:left-3 rtl:right-3 pointer-events-none" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={t(
                        "ابحث بكود المادة أو اسمها...",
                        "Search by course code or name..."
                      )}
                      className="w-full h-9 px-9 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 text-xs font-medium text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 dark:focus:border-sky-600 transition-all"
                      dir={dir}
                    />
                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="absolute top-1/2 -translate-y-1/2 ltr:right-2.5 rtl:left-2.5 p-0.5 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  {/* Results count */}
                  <div className="flex items-center justify-between mt-1.5 px-1">
                    <span className="text-[10px] text-zinc-400 font-semibold">
                      {filteredOptions.length} {t("مادة متاحة", "courses available")}
                    </span>
                    {value && (
                      <button
                        type="button"
                        onClick={() => {
                          onChange("");
                          setIsOpen(false);
                          setSearch("");
                        }}
                        className="text-[10px] text-rose-500 hover:text-rose-600 font-bold cursor-pointer flex items-center gap-0.5 transition-colors"
                      >
                        <X className="h-3 w-3" />
                        {t("إلغاء الاختيار", "Clear selection")}
                      </button>
                    )}
                  </div>
                </div>

                {/* Options list */}
                <div className="max-h-[260px] overflow-y-auto overscroll-contain py-1 scroll-smooth">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((course) => {
                      const isSelected = value === course.code;
                      return (
                        <button
                          key={course.code}
                          type="button"
                          onClick={() => {
                            onChange(course.code);
                            setIsOpen(false);
                            setSearch("");
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 transition-all duration-150 cursor-pointer group text-start ${
                            isSelected
                              ? "bg-sky-50 dark:bg-sky-950/40 border-l-2 ltr:border-l-2 rtl:border-r-2 rtl:border-l-0 border-sky-500"
                              : "hover:bg-zinc-50 dark:hover:bg-zinc-900/80 border-l-2 ltr:border-l-2 rtl:border-r-2 rtl:border-l-0 border-transparent"
                          }`}
                        >
                          {/* Course Code Badge */}
                          <span
                            className={`shrink-0 text-[10px] font-mono font-black px-2 py-1 rounded-lg border transition-colors ${
                              isSelected
                                ? "bg-sky-500 text-white border-sky-400 shadow-sm"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200/60 dark:border-zinc-700 group-hover:bg-sky-100 dark:group-hover:bg-sky-950/60 group-hover:text-sky-700 dark:group-hover:text-sky-400 group-hover:border-sky-200 dark:group-hover:border-sky-800"
                            }`}
                          >
                            {course.code}
                          </span>

                          {/* Course Name & Credits */}
                          <div className="flex-1 min-w-0">
                            <span
                              className={`text-xs font-bold block truncate ${
                                isSelected
                                  ? "text-sky-800 dark:text-sky-200"
                                  : "text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-zinc-100"
                              }`}
                            >
                              {lang === "ar" ? course.arabic : course.english}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium flex items-center gap-0.5">
                                <Clock className="h-2.5 w-2.5" />
                                {course.credits} {t("ساعات معتمدة", "credit hours")}
                              </span>
                              {lang === "ar" && (
                                <span className="text-[10px] text-zinc-400/70 dark:text-zinc-600 font-medium truncate max-w-[160px]">
                                  {course.english}
                                </span>
                              )}
                              {lang !== "ar" && (
                                <span className="text-[10px] text-zinc-400/70 dark:text-zinc-600 font-medium truncate max-w-[160px]">
                                  {course.arabic}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Retake badge */}
                          {course.isRetake && (
                            <span className="shrink-0 text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 rounded-lg border border-amber-200/60 dark:border-amber-800/60 flex items-center gap-0.5">
                              <RefreshCw className="h-2.5 w-2.5" />
                              {t("إعادة", "Retake")}
                            </span>
                          )}

                          {/* Selection check */}
                          {isSelected && (
                            <Check className="h-4 w-4 text-sky-500 shrink-0" />
                          )}
                        </button>
                      );
                    })
                  ) : (
                    <div className="py-8 text-center space-y-2">
                      <BookOpen className="h-6 w-6 mx-auto text-zinc-300 dark:text-zinc-700" />
                      <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                        {t(
                          "لم يتم العثور على مقررات تطابق بحثك.",
                          "No courses match your search."
                        )}
                      </p>
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="text-[11px] text-sky-500 hover:text-sky-600 font-bold cursor-pointer"
                      >
                        {t("مسح البحث", "Clear search")}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
