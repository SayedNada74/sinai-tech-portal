"use client";

import React from "react";
import { cn } from "@/lib/utils";

// Base Shimmer Skeleton Element
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "shimmer-wave rounded-xl bg-zinc-200/80 dark:bg-zinc-800/60",
        className
      )}
      {...props}
    />
  );
}

// Single Stat Card Skeleton
export function StatCardSkeleton() {
  return (
    <div className="p-6 rounded-3xl border border-zinc-200/70 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/60 shadow-sm space-y-4 shimmer-wave">
      <div className="flex justify-between items-start">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-4 w-12 rounded-lg" />
      </div>
      <Skeleton className="h-3.5 w-28 rounded-md" />
      <div className="flex items-baseline gap-2 pt-1">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-3 w-16 rounded-md" />
      </div>
    </div>
  );
}

// Single Course Card Skeleton
export function CourseCardSkeleton() {
  return (
    <div className="p-6 rounded-3xl border border-zinc-200/70 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/60 shadow-sm space-y-4 flex flex-col justify-between shimmer-wave">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-16 rounded-lg" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        <Skeleton className="h-5 w-3/4 rounded-lg mt-2" />
        <Skeleton className="h-3.5 w-1/2 rounded-md" />
        <div className="space-y-1.5 pt-2">
          <Skeleton className="h-3 w-full rounded-md" />
          <Skeleton className="h-3 w-5/6 rounded-md" />
        </div>
      </div>

      <div className="space-y-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-20 rounded-md" />
          <Skeleton className="h-3 w-24 rounded-md" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 flex-1 rounded-xl" />
          <Skeleton className="h-9 w-9 rounded-xl" />
          <Skeleton className="h-9 w-9 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// Full Dashboard Skeleton Page
export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in" dir="rtl">
      {/* Welcome Banner Skeleton */}
      <div className="p-8 sm:p-10 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/20 to-teal-950/20 dark:from-cyan-950/40 dark:to-teal-950/40 relative overflow-hidden shimmer-wave space-y-4">
        <Skeleton className="h-6 w-24 rounded-full bg-cyan-500/20" />
        <Skeleton className="h-9 sm:h-12 w-64 sm:w-80 rounded-xl bg-cyan-500/20" />
        <Skeleton className="h-4 w-full max-w-lg rounded-md bg-cyan-500/10" />
      </div>

      {/* 3 Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* 2-Column Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Main Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions Skeleton */}
          <div className="p-6 rounded-3xl border border-zinc-200/70 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/60 shadow-sm space-y-5 shimmer-wave">
            <Skeleton className="h-4 w-28 rounded-md" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col items-center space-y-2">
                  <Skeleton className="h-8 w-8 rounded-xl" />
                  <Skeleton className="h-3 w-16 rounded-md" />
                </div>
              ))}
            </div>
          </div>

          {/* Academic Summary Widget */}
          <div className="p-6 rounded-3xl border border-zinc-200/70 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/60 shadow-sm space-y-5 shimmer-wave">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-40 rounded-lg" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>
            <Skeleton className="h-3 w-full rounded-full" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <Skeleton className="h-16 rounded-2xl" />
              <Skeleton className="h-16 rounded-2xl" />
              <Skeleton className="h-16 rounded-2xl" />
            </div>
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-8">
          {/* Deadlines / Schedule Widget */}
          <div className="p-6 rounded-3xl border border-zinc-200/70 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/60 shadow-sm space-y-4 shimmer-wave">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-6 w-6 rounded-lg" />
            </div>
            <div className="space-y-3 pt-2">
              <Skeleton className="h-14 w-full rounded-2xl" />
              <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
          </div>

          {/* Roadmaps Widget */}
          <div className="p-6 rounded-3xl border border-zinc-200/70 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/60 shadow-sm space-y-4 shimmer-wave">
            <Skeleton className="h-4 w-28 rounded-md" />
            <div className="space-y-3 pt-1">
              <Skeleton className="h-12 w-full rounded-2xl" />
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Full Courses Page Grid Skeleton
export function CoursesGridSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in" dir="rtl">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-8 sm:h-10 w-48 sm:w-64 rounded-xl" />
        <Skeleton className="h-4 w-full max-w-md rounded-md" />
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-12 flex-1 rounded-2xl" />
        <Skeleton className="h-12 w-32 rounded-2xl" />
        <Skeleton className="h-12 w-32 rounded-2xl" />
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// Course Detail Page Skeleton
export function CourseDetailSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in" dir="rtl">
      <Skeleton className="h-9 w-36 rounded-xl" />

      {/* Header Banner */}
      <div className="p-8 rounded-3xl border border-zinc-200/70 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/60 shadow-sm space-y-4 shimmer-wave">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-24 rounded-lg" />
          <Skeleton className="h-8 w-28 rounded-xl" />
        </div>
        <Skeleton className="h-8 sm:h-10 w-72 rounded-xl" />
        <Skeleton className="h-4 w-48 rounded-md" />
        <Skeleton className="h-4 w-full max-w-2xl rounded-md pt-2" />
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Main Content Tabs Skeleton */}
      <div className="p-6 rounded-3xl border border-zinc-200/70 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/60 shadow-sm space-y-6 shimmer-wave">
        <div className="flex gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <Skeleton className="h-8 w-24 rounded-xl" />
          <Skeleton className="h-8 w-24 rounded-xl" />
          <Skeleton className="h-8 w-24 rounded-xl" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-5/6 rounded-md" />
          <Skeleton className="h-4 w-4/6 rounded-md" />
        </div>
      </div>
    </div>
  );
}

// GPA Calculator Page Skeleton
export function GpaSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in" dir="rtl">
      <div className="space-y-3">
        <Skeleton className="h-8 w-48 rounded-xl" />
        <Skeleton className="h-4 w-80 rounded-md" />
      </div>

      {/* GPA Meter Card */}
      <div className="p-8 rounded-3xl border border-zinc-200/70 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/60 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 shimmer-wave">
        <div className="space-y-3 text-center md:text-right">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-12 w-28 rounded-xl" />
          <Skeleton className="h-4 w-40 rounded-md" />
        </div>
        <Skeleton className="h-32 w-32 rounded-full" />
      </div>

      {/* Semester Table Skeletons */}
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="p-6 rounded-3xl border border-zinc-200/70 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/60 shadow-sm space-y-4 shimmer-wave">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-36 rounded-lg" />
              <Skeleton className="h-8 w-24 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Study Planner Page Skeleton
export function PlannerSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in" dir="rtl">
      <div className="space-y-3">
        <Skeleton className="h-8 w-56 rounded-xl" />
        <Skeleton className="h-4 w-96 rounded-md" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/60 shadow-sm flex justify-between items-center shimmer-wave">
            <Skeleton className="h-6 w-44 rounded-lg" />
            <Skeleton className="h-5 w-20 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Departments Page Skeleton
export function DepartmentsSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in" dir="rtl">
      <div className="space-y-3">
        <Skeleton className="h-8 w-56 rounded-xl" />
        <Skeleton className="h-4 w-96 rounded-md" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-14 rounded-2xl" />
        ))}
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-3xl border border-zinc-200/70 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/60 shadow-sm space-y-4 shimmer-wave">
            <Skeleton className="h-6 w-48 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// AI Assistant Page Skeleton
export function AiAssistantSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)] animate-fade-in" dir="rtl">
      {/* Sidebar Skeleton */}
      <div className="hidden lg:flex flex-col p-4 rounded-3xl border border-zinc-200/70 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/60 shadow-sm space-y-4 shimmer-wave">
        <Skeleton className="h-10 w-full rounded-2xl" />
        <Skeleton className="h-4 w-28 rounded-md pt-2" />
        <div className="space-y-2.5 flex-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      </div>

      {/* Main Chat Skeleton */}
      <div className="lg:col-span-3 p-6 sm:p-8 rounded-3xl border border-zinc-200/70 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/60 shadow-sm flex flex-col justify-between shimmer-wave space-y-8">
        <div className="flex flex-col items-center space-y-4 py-8">
          <Skeleton className="h-16 w-16 rounded-3xl" />
          <Skeleton className="h-8 w-60 rounded-xl" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto w-full">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>

        <Skeleton className="h-14 w-full rounded-2xl mt-auto" />
      </div>
    </div>
  );
}

// Legacy aliases for backward compatibility
export function SkeletonCard({ className }: { className?: string }) {
  return <CourseCardSkeleton />;
}

export function SkeletonSensor({ className }: { className?: string }) {
  return <StatCardSkeleton />;
}
