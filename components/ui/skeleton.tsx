import { cn } from "@/lib/utils";

// Standard pulse skeleton
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-zinc-200/60 dark:bg-zinc-800/60",
        className
      )}
      {...props}
    />
  );
}

// Card shape with 3 shimmer lines
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("p-5 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm space-y-4 animate-pulse", className)}>
      {/* Title shimmer line */}
      <Skeleton className="h-5 w-1/3" />
      
      {/* Value shimmer line */}
      <Skeleton className="h-9 w-2/3" />
      
      {/* Description shimmer line */}
      <Skeleton className="h-4.5 w-full" />
    </div>
  );
}

// Sensor card shape with header + value + chart placeholder
export function SkeletonSensor({ className }: { className?: string }) {
  return (
    <div className={cn("p-5 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm space-y-5 animate-pulse", className)}>
      {/* Header icon + title placeholder */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>

      {/* Primary Value */}
      <Skeleton className="h-10 w-1/2" />

      {/* Chart Placeholder Area */}
      <Skeleton className="h-16 w-full rounded-xl" />
    </div>
  );
}
