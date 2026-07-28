"use client";

import * as React from "react";
import { GraduationCap } from "lucide-react";

export default function Loading() {
  const [lang, setLang] = React.useState("ar");

  React.useEffect(() => {
    const saved = localStorage.getItem("app_lang");
    if (saved) setLang(saved);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-550/5 dark:bg-zinc-950/20 backdrop-blur-sm">
      {/* Centered pulsing logo + loader spinner */}
      <div className="relative flex items-center justify-center mb-4">
        {/* Pulsing Outer Ring */}
        <div className="absolute w-16 h-16 rounded-full border-2 border-cyan-500/30 animate-ping" />
        
        {/* Spinner Ring */}
        <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-cyan-400 animate-spin" />

        {/* Center Logo */}
        <div className="absolute h-9.5 w-9.5 rounded-lg bg-cyan-600 flex items-center justify-center text-white shadow-md animate-pulse">
          <GraduationCap className="h-5 w-5" />
        </div>
      </div>
      
      {/* Loading message */}
      <span className="text-xs font-black tracking-wider text-zinc-500 dark:text-zinc-400 mt-2">
        {lang === "ar" ? "جاري تحميل المنصة..." : "Loading SU IT Guide..."}
      </span>
    </div>
  );
}
