"use client";

import * as React from"react";
import { Download, Smartphone, WifiOff, CheckCircle2, X, Sparkles } from"lucide-react";
import { motion, AnimatePresence } from"framer-motion";
import { useApp } from"@/context/app-context";
import { Button } from"@/components/ui/button";

export function PWAInstaller() {
  const { t, dir } = useApp();
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = React.useState(false);
  const [isOffline, setIsOffline] = React.useState(false);
  const [showOfflineToast, setShowOfflineToast] = React.useState(false);

  React.useEffect(() => {
    // 1. Register Service Worker (Production mode or non-localhost only)
    if (typeof window !=="undefined" &&"serviceWorker" in navigator) {
      const isLocalhost = Boolean(
        window.location.hostname ==="localhost" ||
        window.location.hostname ==="[::1]" ||
        window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
      );

      if (isLocalhost) {
        // In local development, unregister any existing service worker to prevent HMR infinite reload loops
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister();
        });
      } else {
        window.addEventListener("load", () => {
          navigator.serviceWorker
            .register("/sw.js")
            .then((reg) => {
              console.log("PWA: Service Worker registered successfully with scope:", reg.scope);
            })
            .catch((err) => {
              console.warn("PWA: Service Worker registration failed:", err);
            });
        });
      }
    }

    // 2. Listen for Install Prompt Event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Check if user already dismissed install banner in this session
      const dismissed = sessionStorage.getItem("su_pwa_dismissed");
      if (!dismissed) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 3. Listen for App Installed Event
    const handleAppInstalled = () => {
      setShowInstallBanner(false);
      setDeferredPrompt(null);
      console.log("PWA: Application was installed successfully!");
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    // 4. Listen for Online / Offline Status
    const handleOnline = () => {
      setIsOffline(false);
      setShowOfflineToast(true);
      setTimeout(() => setShowOfflineToast(false), 4000);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowOfflineToast(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check
    if (typeof navigator !=="undefined" && !navigator.onLine) {
      setIsOffline(true);
      setShowOfflineToast(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`PWA: User response to install prompt: ${outcome}`);

    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    sessionStorage.setItem("su_pwa_dismissed","true");
  };

  return (
    <>
      {/* Offline Status Toast Bar */}
      <AnimatePresence>
        {showOfflineToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-[10000] px-4 py-2.5 rounded-2xl border shadow-2xl backdrop-blur-2xl flex items-center gap-3 text-xs sm:text-sm font-bold ${
              isOffline
                ?"bg-amber-950/95 border-amber-500/60 text-amber-200 shadow-amber-500/20"
                :"bg-emerald-950/95 border-emerald-500/60 text-emerald-200 shadow-emerald-500/20"
            }`}
            dir={dir}
          >
            {isOffline ? (
              <>
                <WifiOff className="h-4.5 w-4.5 text-amber-400 animate-pulse shrink-0" />
                <span>{t("أنت تعمل حالياً بدون اتصال بالإنترنت (وضع PWA). بياناتك ومحفوظاتك متوفرة.","Working Offline (PWA Mode). Your saved data is available.")}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4.5 w-4.5 text-primary shrink-0" />
                <span>{t("تم إعادة الاتصال بالشبكة بنجاح!","Reconnected to network successfully!")}</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Glassmorphism PWA Install Banner */}
      <AnimatePresence>
        {showInstallBanner && deferredPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type:"spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[9990] p-4 sm:p-5 rounded-3xl border border-sky-500/40 bg-zinc-950/95 text-zinc-100 shadow-2xl shadow-sky-900/30 backdrop-blur-2xl"
            dir={dir}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-sky-600/30">
                  <Smartphone className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm sm:text-base text-zinc-50">
                      {t("تثبيت تطبيق SU IT Guide","Install SU IT Guide App")}
                    </h4>
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  </div>
                  <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5 leading-relaxed">
                    {t("ثبّت المنصة كتطبيق مثبت على هاتفك لتصفح سريع بدون إنترنت وسهولة الوصول.","Install as a native mobile app for faster browsing, offline access, and 1-tap launch."
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="opacity-70 hover:opacity-100 p-1 rounded-xl hover:bg-white/10 transition-colors shrink-0 text-zinc-400 hover:text-zinc-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Button
                onClick={handleInstallClick}
                className="w-full h-10 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs gap-2 shadow-lg shadow-sky-600/30 transition-all cursor-pointer"
              >
                <Download className="h-4 w-4" />
                {t("تثبيت التطبيق على الهاتف الآن","Install App Now")}
              </Button>
              <Button
                onClick={handleDismiss}
                variant="outline"
                className="h-10 px-4 rounded-xl border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-semibold cursor-pointer"
              >
                {t("لاحقاً","Later")}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
