"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase, isSupabaseConfigured, insertToSupabase } from "@/lib/supabase";
import { useAuth } from "@/context/auth-context";
import { Logo } from "@/components/ui/logo";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, CheckCircle2, ArrowLeft, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth() as any;

  const [status, setStatus] = React.useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  React.useEffect(() => {
    let isMounted = true;

    async function handleAuthCallback() {
      try {
        if (!isSupabaseConfigured || !supabase) {
          throw new Error("تكوين قاعدة بيانات Supabase غير مكتمل في النظام.");
        }

        // 1. Check for explicit Auth Error in URL
        const errorParam = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");
        if (errorParam || errorDescription) {
          throw new Error(errorDescription || errorParam || "فشل التحقق من الهوية من قبل المزود.");
        }

        // 2. Handle PKCE Code Exchange (`?code=...`)
        const code = searchParams.get("code");
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          if (data?.session && data?.user) {
            await syncSessionAndRedirect(data.user);
            return;
          }
        }

        // 3. Handle Token Hash verification (`?token_hash=...&type=signup|recovery|email_change`)
        const tokenHash = searchParams.get("token_hash");
        const type = searchParams.get("type") as any;
        if (tokenHash && type) {
          const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
          if (error) throw error;
          if (type === "recovery") {
            if (isMounted) router.push("/auth/reset-password");
            return;
          }
          if (data?.session && data?.user) {
            await syncSessionAndRedirect(data.user);
            return;
          }
        }

        // 4. Handle Implicit Hash Fragment (`#access_token=...`) if present in window.location
        if (typeof window !== "undefined" && window.location.hash.includes("access_token")) {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) throw error;
          if (session?.user) {
            await syncSessionAndRedirect(session.user);
            return;
          }
        }

        // 5. Fallback check for active Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await syncSessionAndRedirect(session.user);
          return;
        }

        throw new Error("لم يتم العثور على رمّز مصادقة صالح أو جلسة مفعلة.");

      } catch (err: any) {
        console.error("Auth callback error:", err);
        if (isMounted) {
          setErrorMessage(err.message || "حدث خطأ غير متوقع أثناء تفعيل الجلسة.");
          setStatus("error");
        }
      }
    }

    async function syncSessionAndRedirect(authUser: any) {
      const userEmail = authUser.email || "";
      const userName = authUser.user_metadata?.full_name || authUser.user_metadata?.name || userEmail.split("@")[0] || "طالب سيناء";
      const userLevel = authUser.user_metadata?.level || "الفرقة الأولى";
      const userDepartment = authUser.user_metadata?.department || "تكنولوجيا المعلومات وعلوم الحاسب (IT & CS)";
      const userStudentId = authUser.user_metadata?.student_id || `2026${Math.floor(1000 + Math.random() * 9000)}`;

      const sessionUser = {
        id: authUser.id,
        name: userName,
        email: userEmail,
        level: userLevel,
        department: userDepartment,
        studentId: userStudentId,
        bio: "مستخدم مسجل وموثق في المنصة الأكاديمية.",
        skills: [],
        socialLinks: {},
        avatar: authUser.user_metadata?.avatar_url || "🎓",
        role: "student",
        badges: ["حساب موثق"],
        points: 100,
        following: [],
        needsOnboarding: !authUser.user_metadata?.student_id
      };

      // Persist in local storage for instantaneous client hydration
      if (typeof window !== "undefined") {
        localStorage.setItem("su_user_session", JSON.stringify(sessionUser));
      }

      // Sync with Context State if available
      if (setUser) {
        setUser(sessionUser);
      }

      // Upsert profile in Supabase Database
      try {
        await insertToSupabase("profiles", {
          id: authUser.id,
          email: userEmail,
          name: userName,
          role: "student",
          level: userLevel,
          department: userDepartment,
          student_id: userStudentId,
          avatar: sessionUser.avatar
        });
      } catch (e) {
        console.warn("Profile database sync warning:", e);
      }

      if (isMounted) {
        setStatus("success");
        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      }
    }

    handleAuthCallback();

    return () => {
      isMounted = false;
    };
  }, [searchParams, router, setUser]);

  if (status === "loading") {
    return (
      <Card className="border border-zinc-200/80 bg-white/70 shadow-xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/60 p-8 text-center">
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="h-10 w-10 rounded-full border-3 border-violet-600 border-t-transparent animate-spin" />
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">جاري توثيق الهوية وإنشاء الجلسة...</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">يرجى الانتظار لحظة أثناء توجيهك إلى لوحتك الأكاديمية.</p>
        </div>
      </Card>
    );
  }

  if (status === "success") {
    return (
      <Card className="border border-emerald-500/30 bg-emerald-500/5 shadow-xl backdrop-blur-md text-center p-8">
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-2">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">تم توثيق الحساب والدخول بنجاح!</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">جاري تحويلك الآن إلى منصة التعلم والخدمات...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border border-red-500/30 bg-red-500/5 shadow-xl backdrop-blur-md text-center">
      <CardContent className="pt-8 pb-6 px-6">
        <div className="mx-auto h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">تعذر تفعيل الجلسة أو التحقق من الرابط</h1>
        <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed mb-6 bg-red-500/10 p-3 rounded-xl border border-red-500/20 font-mono text-centerDir dir-ltr">
          {errorMessage}
        </p>

        <div className="space-y-2">
          <Button className="w-full gap-2 font-bold shadow-md" onClick={() => router.push("/auth/login")}>
            <RefreshCw className="h-4 w-4" />
            إعادة محاولة تسجيل الدخول
          </Button>
        </div>
      </CardContent>

      <CardFooter className="justify-center border-t border-zinc-100/50 py-4 dark:border-zinc-800/30">
        <Button variant="ghost" onClick={() => router.push("/")} className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
          <ArrowLeft className="h-3.5 w-3.5 ml-1" />
          العودة للرئيسية
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-center items-center px-6 py-12 relative" dir="rtl">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-violet-600/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
          <Logo size="xl" href="/" className="mb-4" />
        </div>

        <React.Suspense fallback={
          <Card className="border border-zinc-200/80 bg-white/70 shadow-xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/60 p-8 text-center">
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="h-8 w-8 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" />
              <p className="text-sm text-zinc-500 dark:text-zinc-400">جاري معالجة رابط التفعيل...</p>
            </div>
          </Card>
        }>
          <CallbackHandler />
        </React.Suspense>
      </motion.div>
    </div>
  );
}
