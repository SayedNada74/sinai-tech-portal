"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  href?: string;
  className?: string;
  subtitle?: string;
}

export function Logo({
  size = "md",
  showText = true,
  href = "/",
  className,
  subtitle = "Guide"
}: LogoProps) {
  const sizeMap = {
    sm: {
      box: "h-11 w-11 rounded-xl p-1.5",
      title: "text-[16px] font-black tracking-tight leading-none",
      sub: "text-[10px] font-bold tracking-[0.2em] leading-none mt-1",
      gap: "gap-3"
    },
    md: {
      box: "h-14 w-14 rounded-2xl p-2",
      title: "text-[20px] font-black tracking-tight leading-none",
      sub: "text-[12px] font-bold tracking-[0.2em] leading-none mt-1",
      gap: "gap-3.5"
    },
    lg: {
      box: "h-16 w-16 rounded-2xl p-2.5",
      title: "text-[24px] font-black tracking-tight leading-none",
      sub: "text-[14px] font-bold tracking-[0.2em] leading-none mt-1",
      gap: "gap-4"
    },
    xl: {
      box: "h-24 w-24 rounded-3xl p-3.5 shadow-xl shadow-violet-500/10",
      title: "text-3xl font-black tracking-tight mt-2 leading-none",
      sub: "text-[13px] font-bold tracking-[0.3em] leading-none mt-2",
      gap: "gap-1 flex-col items-center text-center"
    }
  };

  const currentSize = sizeMap[size];

  const logoContent = (
    <div
      className={cn(
        "flex items-center group cursor-pointer transition-all duration-200",
        size === "xl" ? "flex-col items-center text-center" : "flex-row",
        currentSize.gap,
        className
      )}
    >
      {/* High-contrast logo container badge that guarantees 100% visibility in both Light and Dark mode */}
      <div
        className={cn(
          "bg-white dark:bg-white border border-zinc-200 dark:border-zinc-300 shadow-md shadow-violet-500/10 overflow-hidden flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105",
          currentSize.box
        )}
      >
        <img
          src="/uni-logo.jpeg"
          alt="Sinai University Logo"
          className="h-full w-full object-contain filter drop-shadow-sm select-none"
        />
      </div>

      {showText && (
        <div className={cn("flex flex-col leading-none", size === "xl" && "items-center")}>
          <span className={cn("font-sans tracking-tight text-zinc-900 dark:text-zinc-50 font-bold", currentSize.title)}>
            SU IT
          </span>
          <span className={cn("uppercase text-violet-600 dark:text-violet-400 font-mono mt-0.5", currentSize.sub)}>
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{logoContent}</Link>;
  }

  return logoContent;
}
