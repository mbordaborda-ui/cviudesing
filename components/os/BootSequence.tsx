"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Secuencia de encendido del OS: glitch, scanlines y log de arranque.
 * Es decorativa, no bloquea la interacción y desaparece sola.
 */
export function BootSequence() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGone(true);
      return;
    }
    const timer = window.setTimeout(() => setGone(true), 2100);
    return () => window.clearTimeout(timer);
  }, []);

  if (gone) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[45] flex flex-col items-center justify-center gap-7 overflow-hidden bg-void"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 1.4, duration: 0.6, ease: "easeIn" }}
    >
      <div className="scanlines absolute inset-0 opacity-40" />
      <div className="stage-noise absolute inset-0 opacity-[0.06]" />

      {/* Línea de encendido */}
      <motion.div
        className="absolute inset-x-0 top-1/2 h-px bg-cyan"
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{ boxShadow: "0 0 24px rgba(53,227,255,0.9)" }}
      />

      <div className="flicker relative flex flex-col items-center gap-5 px-6">
        <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-cyan/70">
          Iniciando entorno
        </p>

        <h2
          data-text="MIGUEL.OS"
          className="glitch font-display text-[clamp(2rem,7vw,4.5rem)] font-semibold tracking-tight text-ink"
        >
          MIGUEL.OS
        </h2>

        <div className="h-[3px] w-[min(420px,72vw)] overflow-hidden rounded-full bg-white/10">
          <div className="boot-bar h-full w-full bg-gradient-to-r from-cyan via-electric to-violet" />
        </div>

        <div className="mt-1 flex flex-col items-center gap-1 font-mono text-[10px] text-muted">
          {[
            "> montando escena 3d",
            "> cargando módulos 06/06",
            "> sistema listo",
          ].map((line, index) => (
            <motion.span
              key={line}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + index * 0.28, duration: 0.3 }}
            >
              {line}
            </motion.span>
          ))}
        </div>
      </div>

      <span className="absolute bottom-5 right-6 font-mono text-[9px] uppercase tracking-[0.2em] text-muted/40">
        miguel.os · v1.0
      </span>
    </motion.div>
  );
}
