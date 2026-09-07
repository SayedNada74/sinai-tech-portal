"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, User } from "lucide-react";
import { useApp } from "@/context/app-context";
import { isValidImageAvatar } from "@/lib/utils";

export interface AvatarLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  src?: string;
  name?: string;
  subtitle?: string;
}

export function AvatarLightboxModal({
  isOpen,
  onClose,
  src,
  name,
  subtitle
}: AvatarLightboxModalProps) {
  const { t, dir } = useApp();
  const [mounted, setMounted] = React.useState(false);
  const isImage = isValidImageAvatar(src);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Handle Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll
  React.useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const content = (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[999999] flex flex-col items-center justify-between p-4 sm:p-6 bg-black/90 backdrop-blur-xl animate-fade-in select-none"
        dir={dir}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        {/* Top Floating Bar: User Info & Close Control */}
        <div className="w-full max-w-2xl flex items-center justify-between gap-4 z-10 shrink-0 bg-white/10 dark:bg-zinc-900/60 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-full bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 font-bold shrink-0">
              <User className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-sm sm:text-base text-white truncate">
                {name || t("الصورة الشخصية", "Profile Picture")}
              </h3>
              {subtitle && (
                <p className="text-[11px] text-zinc-400 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="h-8 w-8 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
              title={t("إغلاق", "Close")}
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Central Display Area */}
        <div
          className="flex-1 flex items-center justify-center w-full py-4 overflow-hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-full max-h-full flex items-center justify-center p-2"
          >
            {isImage ? (
              <div className="relative rounded-3xl sm:rounded-4xl overflow-hidden border-2 border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.8)] bg-zinc-950 select-none">
                <img
                  src={src}
                  alt={name || "Avatar"}
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  className="max-w-[85vw] max-h-[72vh] sm:max-w-[70vw] sm:max-h-[75vh] w-auto h-auto object-contain select-none pointer-events-none transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="h-56 w-56 sm:h-64 sm:w-64 rounded-3xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center text-center p-6 shadow-2xl">
                <span className="text-7xl mb-3">{src || "🎓"}</span>
                <span className="text-sm font-bold text-zinc-300">{name}</span>
                <span className="text-xs text-zinc-500 mt-1">{t("رمز تعبيري كصورة شخصية", "Emoji Avatar")}</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Bottom Hint */}
        <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 text-center shrink-0">
          {t("اضغط في أي مكان خارج الصورة أو زر Esc للإغلاق", "Click anywhere outside or press Esc to close")}
        </div>
      </div>
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
