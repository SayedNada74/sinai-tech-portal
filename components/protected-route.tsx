"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Spinner } from "@/components/ui/spinner";

const PUBLIC_ROUTES = [
  "/gpa",
  "/courses",
  "/roadmaps",
  "/departments",
  "/careers"
];

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated && !isPublicRoute) {
      // Use replace instead of push to avoid trapped history loops when clicking back
      router.replace("/auth/login");
    }
  }, [isAuthenticated, isLoading, router, pathname, isPublicRoute]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">جاري تحميل المنصة...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isPublicRoute) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}
