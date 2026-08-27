"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

export function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Instantly scroll to top when changing routes to prevent offset jumps
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return (
    <div key={pathname} className="w-full animate-fade-in">
      {children}
    </div>
  );
}

