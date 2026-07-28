import { useState, useEffect } from "react";
import { useApp } from "@/context/app-context";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  
  return reduced;
}

// Hook that returns whether animations should be skipped and standard animation props
export function useAnimationProps() {
  const reducedMotion = useReducedMotion();
  
  // Try to use app context, handle fallback if context is not ready
  let lowPowerMode = false;
  try {
    const app = useApp();
    lowPowerMode = app.lowPowerMode;
  } catch (e) {
    // If called outside AppProvider (e.g. landing page or fallback)
  }

  const shouldAnimate = !reducedMotion && !lowPowerMode;

  return {
    shouldAnimate,
    // Fade in/out animation template
    fade: shouldAnimate ? {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 10 },
      transition: { duration: 0.2 }
    } : {
      initial: { opacity: 1, y: 0 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 1, y: 0 }
    },
    // Scale spring animation template (e.g. for widgets or modals)
    scaleSpring: shouldAnimate ? {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { type: "spring" as const, stiffness: 300, damping: 25 }
    } : {
      initial: { opacity: 1, scale: 1 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 1, scale: 1 }
    }
  };
}
