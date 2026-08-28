import { gsap } from "gsap";

/**
 * GSAP Micro-Animations Collection
 * Ultra-sleek, lightweight, high-performance interactions.
 */

// 1. Button Press Animation (Elastic bounce / warning shake)
export const animateButtonPress = (
  element: HTMLElement | null,
  variant: "save" | "delete" | "add" | "default" = "default"
) => {
  if (!element) return;

  gsap.killTweensOf(element);

  if (variant === "delete") {
    // Crisp warning shake
    gsap.fromTo(
      element,
      { x: 0 },
      {
        x: -8,
        duration: 0.06,
        repeat: 3,
        yoyo: true,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(element, { x: 0 });
        }
      }
    );
  } else {
    // Micro elastic bounce
    gsap.fromTo(
      element,
      { scale: 1 },
      {
        scale: 0.90,
        duration: 0.1,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          gsap.set(element, { scale: 1 });
        }
      }
    );
  }
};

// 2. Modal Open & Close Animations
export const animateModalOpen = (element: HTMLElement | null) => {
  if (!element) return;
  gsap.fromTo(
    element,
    { scale: 0.88, opacity: 0, y: 20 },
    {
      scale: 1,
      opacity: 1,
      y: 0,
      duration: 0.32,
      ease: "back.out(1.5)",
      clearProps: "transform"
    }
  );
};

export const animateModalClose = (
  element: HTMLElement | null,
  onComplete?: () => void
) => {
  if (!element) return;
  gsap.to(element, {
    scale: 0.92,
    opacity: 0,
    y: 12,
    duration: 0.2,
    ease: "power2.in",
    onComplete: () => {
      if (onComplete) onComplete();
    }
  });
};

// 3. Card Subtle 3D Tilt Effect
export const initCardTilt = (element: HTMLElement | null) => {
  if (!element) return () => {};

  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = (-y / rect.height) * 12; // Clearly noticeable 3D tilt
    const rotY = (x / rect.width) * 12;

    gsap.to(element, {
      rotationX: rotX,
      rotationY: rotY,
      transformPerspective: 1000,
      duration: 0.25,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.4,
      ease: "power2.out"
    });
  };

  element.addEventListener("mousemove", handleMouseMove);
  element.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    element.removeEventListener("mousemove", handleMouseMove);
    element.removeEventListener("mouseleave", handleMouseLeave);
  };
};

// 4. Counter Animation for Numbers (GPA / Leaderboards / Stats)
export const animateCounter = (
  element: HTMLElement | null,
  endValue: number,
  decimals: number = 2,
  duration: number = 1.2
) => {
  if (!element) return;
  const obj = { val: 0 };
  gsap.to(obj, {
    val: endValue,
    duration: duration,
    ease: "power2.out",
    onUpdate: () => {
      if (element) {
        element.textContent = obj.val.toFixed(decimals);
      }
    }
  });
};
