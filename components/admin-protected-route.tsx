"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Spinner } from "@/components/ui/spinner";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<"student" | "moderator" | "admin" | "super-admin">;
}

export function AdminProtectedRoute({
  children,
  allowedRoles = ["moderator", "admin", "super-admin"]
}: AdminProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login");
      } else if (user && !allowedRoles.includes(user.role)) {
        alert("⚠️ غير مصرح لك بدخول لوحة تحكم الإدارة.");
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">جاري التحقق من صلاحيات المشرف...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
export default AdminProtectedRoute;
