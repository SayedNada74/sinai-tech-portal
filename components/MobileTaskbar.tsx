"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/app-context";
import { useAnimationProps } from "@/lib/motion";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  CheckCircle,
  Compass,
  Calculator,
  User
} from "lucide-react";

export function MobileTaskbar() {
  const pathname = usePathname();
  const { t, isLoggedIn } = useApp();
  const { shouldAnimate } = useAnimationProps();

  // Hide mobile taskbar if not logged in or on landing/login pages
  if (!isLoggedIn || pathname === "/" || pathname === "/login") return null;

  const items = [
    { labelAr: "الرئيسية", labelEn: "Home", href: "/dashboard", icon: LayoutDashboard },
    { labelAr: "الخطة", labelEn: "Plan", href: "/departments", icon: CheckCircle },
    { labelAr: "المسار", labelEn: "Path", href: "/planner", icon: Compass },
    { labelAr: "المعدل", labelEn: "GPA", href: "/gpa", icon: Calculator },
    { labelAr: "الملف", labelEn: "Profile", href: "/profile", icon: User }
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/85 backdrop-blur-lg border-t border-zinc-900/60 p-2 pb-safe shadow-[0_-4px_15px_rgba(0,0,0,0.4)]">
      <nav className="flex justify-around items-center w-full px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1.5 relative px-2.5 py-1.5 min-w-[55px] select-none cursor-pointer"
            >
              {/* Icon with active scaling logic */}
              <motion.div
                animate={shouldAnimate ? { scale: active ? 1.15 : 1 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={`${active ? "text-cyan-400" : "text-zinc-500"}`}
              >
                <Icon className="h-5.5 w-5.5" />
              </motion.div>

              {/* Text label */}
              <span className={`text-[9px] font-bold tracking-tight transition-colors duration-200 ${
                active ? "text-cyan-400 font-extrabold" : "text-zinc-500"
              }`}>
                {t(item.labelAr, item.labelEn)}
              </span>

              {/* Animated Glow Active Indicator */}
              {active && (
                <motion.span
                  layoutId={shouldAnimate ? "active-pill-indicator" : undefined}
                  className="absolute -bottom-1 left-2.5 right-2.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
