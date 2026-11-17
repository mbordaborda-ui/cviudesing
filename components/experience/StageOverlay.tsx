"use client";

import { motion } from "motion/react";
import { ArrowRight, CornerDownLeft, ShieldCheck } from "lucide-react";
import { profile } from "@/content/cv";

interface StageOverlayProps {
  entering: boolean;
  onEnter: () => void;
}

export function StageOverlay({ entering, onEnter }: StageOverlayProps) {
  return (
    <motion.div
      className="pointer-events-none relative z-20 flex h-dvh flex-col"
      animate={entering ? { opacity: 0, y: -24 } : { opacity: 1, y: 0 }}
      initial={false}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <header className="flex items-center justify-between px-6 pt-5 lg:px-10">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/5 font-mono text-[11px] font-semibold tracking-widest text-cyan">
            MB
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
            miguel.os
          </span>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 sm:flex">
          <span className="size-1.5 rounded-full bg-cyan pulse-dot" />
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/70">
            {profile.availability.label}
          </span>
        </div>

        <span className="font-mono text-[10px] tracking-[0.2em] text-muted/70">
          01 / 06
        </span>
      </header>

      <a
        href="#enter-world"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-20 focus:z-50 focus:rounded-lg focus:bg-cyan focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-void"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("enter-world")?.focus();
        }}
      >
        Saltar a entrar al portafolio
      </a>

      <div className="flex flex-1 items-start px-6 pt-[13vh] sm:pt-[15vh] lg:items-center lg:pt-0 lg:pb-16 lg:pl-10">
        <div className="max-w-xl">
          <motion.p
            className="kicker"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Portafolio interactivo · 2026
          </motion.p>

          <motion.h1
            className="display mt-4 text-[clamp(2.7rem,8vw,5.75rem)] font-semibold text-ink sm:mt-5"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            MIGUEL
            <br />
            <span className="bg-gradient-to-r from-cyan via-electric to-violet bg-clip-text pb-2 text-transparent">
              BORDA
            </span>
          </motion.h1>

          <motion.p
            className="mt-4 font-mono text-[10px] uppercase tracking-[0.26em] text-muted sm:text-[11px]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {profile.role}
          </motion.p>

          <motion.p
            className="mt-5 max-w-md border-l border-cyan/30 pl-4 text-[13.5px] leading-relaxed text-ink/70 sm:mt-6 sm:text-[15px]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            «{profile.tagline}»
          </motion.p>

          <motion.div
            className="mt-7 flex flex-col items-start gap-3 sm:mt-9 sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <button
              id="enter-world"
              type="button"
              onClick={onEnter}
              disabled={entering}
              className="group pointer-events-auto inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3.5 text-[13px] font-semibold tracking-wide text-void transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white disabled:opacity-60 sm:px-7"
            >
              ENTRAR A MI UNIVERSO
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </button>

            <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              <CornerDownLeft className="size-3.5" aria-hidden="true" />
              Enter
            </span>
          </motion.div>

          <motion.div
            className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[9.5px] uppercase tracking-[0.16em] text-muted/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-cyan/70" aria-hidden="true" />
              Full Stack
            </span>
            <span className="hidden h-3 w-px bg-white/10 sm:block" />
            <span>Automatización</span>
            <span className="hidden h-3 w-px bg-white/10 sm:block" />
            <span>APIs · SQL · IA</span>
          </motion.div>
        </div>
      </div>

      <footer className="flex items-center justify-between px-6 pb-5 font-mono text-[9px] uppercase tracking-[0.2em] text-muted/60 lg:px-10">
        <span>React · TypeScript · Node · C#</span>
        <span className="hidden sm:block">Experiencia WebGL</span>
      </footer>
    </motion.div>
  );
}
