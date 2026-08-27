"use client";

import * as React from "react";
import { useInView } from "framer-motion";

interface CountUpProps {
  to: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function CountUp({
  to,
  from = 0,
  delay = 0,
  duration = 1.6,
  className = "",
  startWhen = true,
  prefix = "",
  suffix = "",
  decimals = 0,
}: CountUpProps) {
  const [current, setCurrent] = React.useState<number>(from);
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const prevToRef = React.useRef<number>(from);

  React.useEffect(() => {
    if (!isInView || !startWhen) return;

    let startTime: number | null = null;
    let animationFrameId: number;
    const startVal = prevToRef.current !== to ? prevToRef.current : from;
    const endVal = to;

    const timer = setTimeout(() => {
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

        // easeOutExpo for ultra-smooth deceleration
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const nextVal = startVal + (endVal - startVal) * ease;
        setCurrent(nextVal);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(step);
        } else {
          prevToRef.current = endVal;
        }
      };

      animationFrameId = requestAnimationFrame(step);
    }, delay * 1000);

    return () => {
      clearTimeout(timer);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isInView, startWhen, from, to, duration, delay]);

  const formattedValue = decimals > 0 
    ? current.toFixed(decimals) 
    : Math.round(current).toString();

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}
