import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-xl border border-zinc-200 bg-white/50 px-4 py-2 text-sm text-zinc-900 shadow-sm transition-all placeholder:text-zinc-400 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            "dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100 dark:focus:border-sky-500 dark:focus:bg-zinc-950",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/10 dark:border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs font-medium text-red-500 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
