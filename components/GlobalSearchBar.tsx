"use client";

import * as React from"react";
import { useRouter } from"next/navigation";
import { useApp } from"@/context/app-context";
import { useAdmin } from"@/context/admin-context";
import { useAuth } from"@/context/auth-context";
import { performSearch, SearchResultItem } from"@/lib/search";
import { useAnimationProps } from"@/lib/motion";
import { motion, AnimatePresence } from"framer-motion";
import {
  Search,
  FileText,
  Command,
  GraduationCap,
  Bookmark,
  X,
  CornerDownLeft
} from"lucide-react";

export function GlobalSearchBar() {
  const router = useRouter();
  const { lang, theme, setLang, setTheme, t, lowPowerMode } = useApp();
  const { courses } = useAdmin();
  const { logout } = useAuth();
  const { shouldAnimate, scaleSpring } = useAnimationProps();

  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<{ item: SearchResultItem; score: number }[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const inputRef = React.useRef<HTMLInputElement>(null);

  // 1. Bind Ctrl+K / Cmd+K globally
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key ==="k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 2. Perform search on query change
  React.useEffect(() => {
    if (query.trim() ==="") {
      setResults([]);
      setSelectedIndex(0);
      return;
    }
    const searchResults = performSearch(query, courses, lang);
    setResults(searchResults.slice(0, 8)); // Limit to 8 results
    setSelectedIndex(0);
  }, [query, courses, lang]);

  // Focus input when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
    }
  }, [isOpen]);

  // 3. Handle Keyboard Navigation inside search
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key ==="Escape") {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key ==="ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
    } else if (e.key ==="ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
    } else if (e.key ==="Enter") {
      e.preventDefault();
      if (results.length > 0) {
        handleSelectItem(results[selectedIndex].item);
      }
    }
  };

  // 4. Handle Item Selection
  const handleSelectItem = (item: SearchResultItem) => {
    setIsOpen(false);

    // If it's an action, run the action
    if (item.type ==="action" && item.actionKey) {
      switch (item.actionKey) {
        case"theme-light":
          setTheme("light");
          break;
        case"theme-dark":
          setTheme("dark");
          break;
        case"lang-ar":
          setLang("ar");
          break;
        case"lang-en":
          setLang("en");
          break;
        case"logout":
          logout();
          break;
        default:
          break;
      }
      return;
    }

    // Otherwise navigate to the path
    router.push(item.path);
  };

  const getIcon = (type: SearchResultItem["type"]) => {
    switch (type) {
      case"page":
        return <FileText className="h-4.5 w-4.5 text-foreground" />;
      case"action":
        return <Command className="h-4.5 w-4.5 text-amber-500" />;
      case"item":
        return <GraduationCap className="h-4.5 w-4.5 text-foreground" />;
      case"section":
        return <Bookmark className="h-4.5 w-4.5 text-foreground" />;
    }
  };

  const getTypeLabel = (type: SearchResultItem["type"]) => {
    if (lang ==="ar") {
      switch (type) {
        case"page": return"صفحة";
        case"action": return"إجراء";
        case"item": return"مقرر";
        case"section": return"قسم";
      }
    } else {
      switch (type) {
        case"page": return"Page";
        case"action": return"Action";
        case"item": return"Course";
        case"section": return"Section";
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-md transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Search Box Card */}
          <motion.div
            {...scaleSpring}
            className="w-full max-w-lg card card-glow overflow-hidden border border-zinc-200 dark:border-zinc-800/40 bg-white dark:bg-zinc-950 shadow-2xl relative z-10 text-right font-sans"
            dir={lang ==="ar" ?"rtl" :"ltr"}
            onKeyDown={handleKeyDown}
          >
            {/* Input Wrapper */}
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-850 flex items-center gap-3">
              <Search className="h-5 w-5 text-foreground shrink-0" />
              <input
                ref={inputRef}
                type="text"
                className="w-full bg-transparent text-sm text-zinc-800 dark:text-zinc-100 outline-none placeholder-zinc-500 border-none"
                placeholder={t("اكتب للبحث (مثال: حاسبة، برمجة، لغة)...","Search pages, courses, actions (Ctrl+K)..."
                )}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 transition-colors cursor-pointer shrink-0"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Results Area */}
            <div className="max-h-80 overflow-y-auto p-2.5 divide-y divide-zinc-100 dark:divide-zinc-900">
              {results.length > 0 ? (
                results.map((res, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={res.item.id}
                      onClick={() => handleSelectItem(res.item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`p-3 rounded-xl flex items-center justify-between gap-4 cursor-pointer transition-all duration-150 ${
                        isSelected
                          ?"bg-zinc-100 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700/50 shadow-sm"
                          :"border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg shrink-0">
                          {getIcon(res.item.type)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-100 truncate">
                            {t(res.item.titleAr, res.item.titleEn)}
                          </h4>
                          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                            {t(res.item.descriptionAr, res.item.descriptionEn)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/40 text-zinc-500 dark:text-zinc-400">
                          {getTypeLabel(res.item.type)}
                        </span>
                        {isSelected && (
                          <CornerDownLeft className="h-3 w-3 text-foreground" />
                        )}
                      </div>
                    </div>
                  );
                })
              ) : query.trim() !=="" ? (
                <div className="text-center py-10 text-xs text-zinc-500">
                  {t("لا توجد نتائج مطابقة لبحثك.","No results match your search query.")}
                </div>
              ) : (
                <div className="p-6 text-right" dir={lang ==="ar" ?"rtl" :"ltr"}>
                  <h5 className="text-[10px] font-black uppercase tracking-wider text-zinc-500 mb-3">
                    {t("روابط سريعة مقترحة","Suggested Pages")}
                  </h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => { setIsOpen(false); router.push("/departments"); }}
                      className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800/40 hover:border-zinc-300 dark:hover:border-zinc-700/50 bg-zinc-50 dark:bg-zinc-900/40 text-right text-zinc-700 dark:text-zinc-300 hover:text-cyan-600 dark:hover:text-cyan-400 font-bold transition-all cursor-pointer"
                    >
                       {t("الخطة والتقدم","Curriculum Progress")}
                    </button>
                    <button
                      onClick={() => { setIsOpen(false); router.push("/gpa"); }}
                      className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800/40 hover:border-zinc-300 dark:hover:border-zinc-700/50 bg-zinc-50 dark:bg-zinc-900/40 text-right text-zinc-700 dark:text-zinc-300 hover:text-cyan-600 dark:hover:text-cyan-400 font-bold transition-all cursor-pointer"
                    >
                       {t("حاسبة المعدل","GPA Calculator")}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer hints */}
            <div className="px-4 py-2 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-950/80 flex justify-between text-[9px] font-medium text-zinc-500">
              <span>{t("اضغط Enter للاختيار","Press Enter to select")}</span>
              <span className="flex items-center gap-1.5">
                <span>{t("التنقل بـ","Navigate with")}</span>
                <kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded">↑↓</kbd>
                <span>{t("والإغلاق بـ Esc","and Close with Esc")}</span>
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
