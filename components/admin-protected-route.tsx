"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
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
  const pathname = usePathname();

  React.useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        // Instantly force redirect unauthenticated access to login page
        router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      } else if (!allowedRoles.includes(user.role)) {
        // Block regular students from accessing admin portal
        router.replace("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">جاري التحقق الجنائي من صياغة الجلسة والصلاحيات... ️</p>
        </div>
      </div>
    );
  }

  // Zero-Leak Security Shield: Block rendering completely if unauthenticated or unauthorized
  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-950 text-white p-6 text-center">
        <div className="max-w-md space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="h-16 w-16 mx-auto rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-3xl">
            ️
          </div>
          <h3 className="font-extrabold text-lg text-rose-400">منطقة إدارية شديدة الحماية</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            تم حظر عرض بيانات هذه الصفحة. يتطلب الوصول إليها تسجيل الدخول بحساب إداري مصرح له (Super Admin / Admin / Moderator).
          </p>
          <button
            onClick={() => router.replace("/auth/login")}
            className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-xs font-extrabold text-white cursor-pointer transition-all shadow-lg"
          >
            التوجه لصفحة تسجيل الدخول 
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
export default AdminProtectedRoute;
