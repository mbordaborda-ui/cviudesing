"use client";

import { useMemo } from "react";

interface CinematicTransitionProps {
  /** Cambia este valor (id del módulo) para reiniciar la secuencia. */
  trigger: string;
}

/**
 * Capa visual que se reproduce al cambiar de espacio:
 * barrido diagonal, destellos, partículas, líneas y línea de escaneo.
 * Solo transform/opacity para no castigar la GPU. Se desactiva con
 * prefers-reduced-motion (ver CSS).
 */
export function CinematicTransition({ trigger }: CinematicTransitionProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, index) => ({
        id: index,
        left: 12 + Math.random() * 76,
        top: 18 + Math.random() * 64,
        px: (Math.random() - 0.5) * 180,
        py: (Math.random() - 0.5) * 140,
        dur: 0.6 + Math.random() * 0.55,
        delay: Math.random() * 0.16,
        size: 1 + Math.random() * 2.4,
      })),
    [trigger],
  );

  return (
    <div
      key={trigger}
      className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
      aria-hidden="true"
    >
      {/* Flash ambiental */}
      <div className="cinema-flash absolute inset-0 bg-[radial-gradient(circle_at_62%_38%,rgba(53,227,255,0.20),transparent_58%)]" />

      {/* Barridos diagonales */}
      <div className="cinema-sweep absolute inset-y-[-25%] left-0 w-[36%] bg-gradient-to-r from-transparent via-cyan/20 to-transparent blur-md" />
      <div
        className="cinema-sweep absolute inset-y-[-25%] left-0 w-[9%] bg-gradient-to-r from-transparent via-white/45 to-transparent"
        style={{ animationDelay: "70ms" }}
      />
      <div
        className="cinema-sweep absolute inset-y-[-25%] left-0 w-[2px] bg-cyan/70"
        style={{ animationDelay: "120ms" }}
      />

      {/* Líneas verticales de energía */}
      <div
        className="cinema-streak absolute left-[22%] h-[70%] w-px bg-gradient-to-b from-transparent via-electric/70 to-transparent"
        style={{ animationDelay: "40ms" }}
      />
      <div
        className="cinema-streak absolute left-[68%] h-[60%] w-px bg-gradient-to-b from-transparent via-violet/60 to-transparent"
        style={{ animationDelay: "140ms" }}
      />
      <div
        className="cinema-streak absolute left-[46%] h-[50%] w-px bg-gradient-to-b from-transparent via-cyan/60 to-transparent"
        style={{ animationDelay: "220ms" }}
      />

      {/* Anillo de distorsión */}
      <div className="cinema-flash absolute left-1/2 top-1/2 size-[42vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan/20" />

      {/* Línea de escaneo */}
      <div className="cinema-scan absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-cyan/10 to-transparent" />

      {/* Partículas */}
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="cinema-particle absolute rounded-full bg-cyan/70"
          style={
            {
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              width: particle.size,
              height: particle.size,
              animationDelay: `${particle.delay}s`,
              "--px": `${particle.px}px`,
              "--py": `${particle.py}px`,
              "--pdur": `${particle.dur}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
