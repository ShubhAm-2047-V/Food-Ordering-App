'use client';

import React, { useEffect, createContext, useContext, useRef } from 'react';
import Lenis from 'lenis';

interface SmoothScrollContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | HTMLElement | number, options?: { offset?: number; duration?: number; immediate?: boolean }) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  scrollTo: () => {},
});

export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis with smooth momentum physics
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential ease-out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.8,
      infinite: false,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = (target: string | HTMLElement | number, options?: { offset?: number; duration?: number; immediate?: boolean }) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        offset: options?.offset ?? -85,
        duration: options?.duration ?? 1.2,
        immediate: options?.immediate ?? false,
      });
    } else {
      // Fallback for native smooth scroll
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
      } else if (typeof target === 'string') {
        const el = document.querySelector(target);
        if (el) {
          const y = el.getBoundingClientRect().top + window.pageYOffset + (options?.offset ?? -85);
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      } else if (target instanceof HTMLElement) {
        const y = target.getBoundingClientRect().top + window.pageYOffset + (options?.offset ?? -85);
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisRef.current, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
