"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export function ShinyText({
  text,
  disabled = false,
  speed = 4,
  className = "",
}: ShinyTextProps) {
  return (
    <span
      className={cn(
        "relative inline-block overflow-hidden bg-clip-text text-transparent transition-all duration-300",
        !disabled && "animate-shine",
        className
      )}
      style={{
        backgroundImage:
          "linear-gradient(120deg, rgba(139, 92, 246, 0.8) 0%, rgba(255, 255, 255, 1) 50%, rgba(139, 92, 246, 0.8) 100%)",
        backgroundSize: "200% 100%",
        animationDuration: `${speed}s`,
      }}
    >
      {text}
    </span>
  );
}
