"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** Si el elemento nunca entra en pantalla, se muestra igualmente. */
  fallbackDelay?: number;
}

/**
 * Revelado al hacer scroll. Usa IntersectionObserver y un temporizador de
 * seguridad para que el contenido jamás quede invisible.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 22,
  fallbackDelay = 1200,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(element);
    const fallback = window.setTimeout(() => setVisible(true), fallbackDelay);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [fallbackDelay]);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className ?? ""}`}
      style={
        {
          transitionDelay: `${delay}s`,
          "--reveal-y": `${y}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
