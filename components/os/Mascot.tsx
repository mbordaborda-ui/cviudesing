"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Asistente del sistema: la mascota original, reinterpretada como
 * orbe del SO. Sigue el cursor, parpadea y abre Contacto.
 */
export function Mascot({ onOpenContact }: { onOpenContact: () => void }) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let frame = 0;
    const onMove = (event: MouseEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = buttonRef.current?.getBoundingClientRect();
        if (!rect) return;
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        const distance = Math.hypot(dx, dy) || 1;
        const factor = Math.min(distance / 70, 1) * 3.2;
        setLook({ x: (dx / distance) * factor, y: (dy / distance) * factor });
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    let blinkTimeout = 0;
    const blinkInterval = window.setInterval(() => {
      setBlinking(true);
      blinkTimeout = window.setTimeout(() => setBlinking(false), 140);
    }, 4600);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.clearInterval(blinkInterval);
      window.clearTimeout(blinkTimeout);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="fixed bottom-24 right-4 z-40 md:bottom-6 md:right-6">
      <button
        ref={buttonRef}
        type="button"
        onClick={onOpenContact}
        aria-label="Abrir contacto con el asistente"
        className="group relative grid size-14 place-items-center rounded-full outline-offset-4 md:size-16"
      >
        <span
          className="absolute inset-0 rounded-full bg-cyan/25 blur-xl transition-opacity duration-500 group-hover:bg-cyan/40"
          aria-hidden="true"
        />
        <span
          className="relative grid size-14 place-items-center overflow-hidden rounded-full border border-white/25 shadow-[0_12px_40px_rgba(53,227,255,0.35)] transition-transform duration-300 group-hover:scale-105 md:size-16"
          style={{
            background:
              "radial-gradient(circle at 32% 26%, #d8fbff 0%, #35e3ff 26%, #3d6eff 62%, #8b5cf6 100%)",
          }}
          aria-hidden="true"
        >
          <span className="absolute left-[18%] top-[16%] size-3 rounded-full bg-white/70 blur-[2px]" />
          <span className="relative flex items-center gap-1.5">
            {[0, 1].map((eye) => (
              <span
                key={eye}
                className="grid size-3.5 place-items-center rounded-full bg-white/95 md:size-4"
                style={{
                  transform: `scaleY(${blinking ? 0.12 : 1})`,
                  transition: "transform 90ms ease",
                }}
              >
                <span
                  className="size-1.5 rounded-full bg-[#0a0f1a] md:size-2"
                  style={{ transform: `translate(${look.x}px, ${look.y}px)` }}
                />
              </span>
            ))}
          </span>
          <span className="absolute bottom-2.5 h-1 w-3 rounded-b-full border-b-2 border-[#0a0f1a]/70" />
        </span>

        <span className="pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-[#0b0f18]/95 px-3 py-1.5 font-mono text-[10px] text-ink/80 opacity-0 shadow-xl transition-opacity duration-300 group-hover:opacity-100 md:block">
          ¿Hablamos? ↗
        </span>
      </button>
    </div>
  );
}
