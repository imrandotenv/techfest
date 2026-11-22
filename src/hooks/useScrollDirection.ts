'use client';

import { useState, useEffect, useRef } from 'react';

export interface UseScrollDirectionOptions {
  threshold?: number;       // Minimum delta threshold (hysteresis) to ignore micro-adjustments, default 10px
  topThreshold?: number;    // Scroll offset threshold considered "at top", default 50px
  initialVisible?: boolean; // Initial navbar visibility, default true
}

export interface UseScrollDirectionReturn {
  isVisible: boolean;
  isAtTop: boolean;
  scrollDirection: 'up' | 'down' | null;
  scrollY: number;
}

/**
 * 60fps Smart Hide-on-Scroll hook using requestAnimationFrame,
 * passive scroll listener, and a 10px hysteresis threshold to eliminate jitter.
 */
export function useScrollDirection({
  threshold = 10,
  topThreshold = 50,
  initialVisible = true,
}: UseScrollDirectionOptions = {}): UseScrollDirectionReturn {
  const [isVisible, setIsVisible] = useState(initialVisible);
  const [isAtTop, setIsAtTop] = useState(true);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [scrollY, setScrollY] = useState(0);

  const prevScrollYRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initialY = window.scrollY;
    prevScrollYRef.current = initialY;
    setScrollY(initialY);
    setIsAtTop(initialY <= topThreshold);
    if (initialY <= topThreshold) {
      setIsVisible(true);
    }

    const handleScroll = () => {
      // Throttle through requestAnimationFrame to guarantee 60fps smooth physics
      if (rafIdRef.current !== null) return;

      rafIdRef.current = window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const prevScrollY = prevScrollYRef.current;
        const delta = currentScrollY - prevScrollY;

        setScrollY(currentScrollY);

        // Anti-jitter: ignore iOS elastic bounce (negative scrollY)
        if (currentScrollY < 0) {
          rafIdRef.current = null;
          return;
        }

        // At Top of Page (window.scrollY <= topThreshold): Always visible and anchored
        if (currentScrollY <= topThreshold) {
          setIsAtTop(true);
          setIsVisible(true);
          setScrollDirection(null);
          prevScrollYRef.current = currentScrollY;
          rafIdRef.current = null;
          return;
        }

        setIsAtTop(false);

        // Hysteresis threshold: only trigger state update if delta exceeds threshold
        if (Math.abs(delta) > threshold) {
          if (delta > 0) {
            // Scrolling down -> hide navbar
            setIsVisible(false);
            setScrollDirection('down');
          } else {
            // Scrolling up -> show navbar
            setIsVisible(true);
            setScrollDirection('up');
          }
          prevScrollYRef.current = currentScrollY;
        }

        rafIdRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [threshold, topThreshold]);

  return { isVisible, isAtTop, scrollDirection, scrollY };
}
