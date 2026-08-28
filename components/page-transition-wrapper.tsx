"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { motion } from "framer-motion";

export function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Instantly scroll to top when changing routes to prevent offset jumps
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="w-full min-w-0"
    >
      {children}
    </motion.div>
  );
}

