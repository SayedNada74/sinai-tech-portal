"use client";

import * as React from "react";
import { User } from "lucide-react";
import { cn, getAvatarFallback, isValidImageAvatar } from "@/lib/utils";

interface UserAvatarProps {
  src?: string;
  name?: string;
  className?: string;
  iconClassName?: string;
  initialsClassName?: string;
}

export function UserAvatar({
  src,
  name,
  className = "w-20 h-20",
  iconClassName = "h-8 w-8",
  initialsClassName = "text-sm font-black text-sky-700 dark:text-sky-300"
}: UserAvatarProps) {
  const [imgError, setImgError] = React.useState(false);
  const isImage = isValidImageAvatar(src) && !imgError;

  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-tr from-sky-100 to-sky-50 dark:from-sky-900/40 dark:to-sky-500/10 flex items-center justify-center border-4 border-white dark:border-zinc-900 shadow-sm overflow-hidden select-none shrink-0",
        className
      )}
    >
      {isImage ? (
        <img
          src={src}
          alt=""
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      ) : name ? (
        <span className={initialsClassName}>{getAvatarFallback(src, name)}</span>
      ) : (
        <User className={cn("text-sky-700/50 dark:text-sky-300/50", iconClassName)} />
      )}
    </div>
  );
}
