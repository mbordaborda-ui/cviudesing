"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  Command,
  Power,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { certifications, profile, projects } from "@/content/cv";
import { cn } from "@/lib/format";
import { Mascot } from "./Mascot";
import { ModuleContent } from "./Modules";
import { MODULES, type ModuleId } from "./modules-data";

export function OSShell({ onExit }: { onExit: () => void }) {
  const [active, setActive] = useState<ModuleId | null>(null);
  const [clock, setClock] = useState("");
  const mainRef = useRef<HTMLElement>(null);
  const previous = useRef<ModuleId | null>(null);

  useEffect(() => {
    const tick = () => {
      setClock(
        new Intl.DateTimeFormat("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    };
    tick();
    const interval = window.setInterval(tick, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  // Atajos de teclado: 1-6 módulos, Esc vuelve al menú / sale.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || event.metaKey || event.ctrlKey) {
        return;
      }

      if (event.key === "Escape") {
        // Si hay una ficha de proyecto abierta, ese componente gestiona el cierre.
        if (document.querySelector('[role="dialog"]')) return;
        event.preventDefault();
        if (active) setActive(null);
        else onExit();
        return;
      }

      const index = Number(event.key);
      if (index >= 1 && index <= MODULES.length) {
        event.preventDefault();
        setActive(MODULES[index - 1].id);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, onExit]);

  // Foco: al abrir un módulo se enfoca el contenido; al cerrar, el dock.
  useEffect(() => {
    if (active) {
      previous.current = active;
      mainRef.current?.focus();
      return;
    }
    const last = previous.current;
    if (last) {
      document.getElementById(`dock-${last}`)?.focus();
    }
  }, [active]);

  const open = useCallback((id: ModuleId) => setActive(id), []);
  const current = MODULES.find((module) => module.id === active);

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-void">
      <div className="stage-bg" aria-hidden="true" />
      <div className="stage-grid opacity-30" aria-hidden="true" />

      {/* Barra de sistema */}
      <header className="relative z-30 flex items-center gap-3 border-b border-white/8 bg-[#05070d]/70 px-3 py-2 backdrop-blur-xl sm:px-4">
        <div className="flex items-center gap-2.5">
          <span className="grid size-7 place-items-center rounded-lg border border-white/10 bg-white/5 font-mono text-[9px] font-semibold tracking-widest text-cyan">
            MB
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-ink/70 sm:block">
            miguel.os
          </span>
        </div>

        <div className="hidden h-4 w-px bg-white/10 sm:block" />

        <p className="min-w-0 flex-1 truncate font-mono text-[10px] text-muted">
          <span className="text-cyan/70">~/</span>
          {current ? `modulos/${current.index}-${current.id}` : "inicio"}
        </p>

        <div className="hidden items-center gap-1 rounded-md border border-white/8 bg-white/[0.03] px-2 py-1 font-mono text-[9px] text-muted/80 md:flex">
          <Command className="size-3" aria-hidden="true" />
          1–6 · Esc
        </div>

        <span className="font-mono text-[10px] tabular text-ink/70">
          {clock || "--:--"}
        </span>

        <span className="hidden items-center gap-1.5 sm:flex">
          <span className="size-1.5 rounded-full bg-[#28c840] pulse-dot" />
          <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
            online
          </span>
        </span>

        <button
          type="button"
          onClick={onExit}
          aria-label="Salir al inicio de la experiencia"
          className="ml-1 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted transition-colors hover:border-white/20 hover:text-ink"
        >
          <Power className="size-3" aria-hidden="true" />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </header>

      <div className="relative z-10 flex min-h-0 flex-1">
        {/* Dock escritorio */}
        <aside
          aria-label="Módulos del portafolio"
          className="hidden w-[88px] shrink-0 flex-col items-center gap-1 border-r border-white/6 bg-[#05070d]/40 py-3 md:flex"
        >
          {MODULES.map((module) => {
            const Icon = module.icon;
            const isActive = active === module.id;
            return (
              <button
                key={module.id}
                id={`dock-${module.id}`}
                type="button"
                onClick={() => open(module.id)}
                aria-current={isActive ? "page" : undefined}
                aria-label={`${module.index} · ${module.label}`}
                className={cn(
                  "group relative flex w-[68px] flex-col items-center gap-1.5 rounded-xl px-1 py-2.5 transition-colors duration-300",
                  isActive
                    ? "bg-cyan/10 text-cyan"
                    : "text-muted hover:bg-white/[0.04] hover:text-ink",
                )}
              >
                <Icon className="size-[18px]" aria-hidden="true" strokeWidth={1.7} />
                <span className="font-mono text-[8px] uppercase tracking-[0.08em]">
                  {module.short}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="dock-active"
                    className="absolute -left-[9px] h-6 w-[2px] rounded-full bg-cyan"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </button>
            );
          })}

          <div className="mt-auto flex flex-col items-center gap-1 font-mono text-[8px] text-muted/40">
            <span>v1.0</span>
            <span>2026</span>
          </div>
        </aside>

        {/* Contenido */}
        <main
          ref={mainRef}
          tabIndex={-1}
          className="relative min-h-0 flex-1 overflow-y-auto scroll-slim px-4 pb-28 pt-4 outline-none sm:px-6 md:pb-6"
        >
          <div className="mx-auto w-full max-w-6xl">
            <AnimatePresence mode="wait" initial={false}>
              {active && current ? (
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-white/8 pb-4">
                    <div>
                      <p className="font-mono text-[10px] text-cyan/80">
                        {current.index} — {current.short.toUpperCase()}
                      </p>
                      <h1 className="display mt-1.5 text-2xl font-semibold text-ink sm:text-3xl">
                        {current.label}
                      </h1>
                      <p className="mt-1 max-w-xl text-[12px] text-muted">
                        {current.hint}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActive(null)}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[11px] text-ink/75 transition-colors hover:border-cyan/30 hover:text-ink"
                    >
                      <ArrowLeft className="size-3.5" aria-hidden="true" />
                      Volver al menú
                    </button>
                  </div>

                  <ModuleContent id={active} />
                </motion.div>
              ) : (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex flex-wrap items-end justify-between gap-4 pb-5">
                    <div>
                      <p className="kicker">System online</p>
                      <h1 className="display mt-2 text-[clamp(1.75rem,4vw,2.6rem)] font-semibold text-ink">
                        Bienvenido a mi universo.
                      </h1>
                      <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted">
                        Soy {profile.name}, {profile.role.toLowerCase()}. Elige un
                        módulo para explorar mi perfil, stack, experiencia y
                        proyectos.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                      <span className="size-1.5 rounded-full bg-cyan pulse-dot" />
                      <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink/60">
                        {profile.availability.label}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                    {MODULES.map((module, index) => {
                      const Icon = module.icon;
                      return (
                        <motion.button
                          key={module.id}
                          type="button"
                          onClick={() => open(module.id)}
                          onMouseMove={(event) => {
                            const rect = event.currentTarget.getBoundingClientRect();
                            event.currentTarget.style.setProperty(
                              "--mx",
                              `${event.clientX - rect.left}px`,
                            );
                            event.currentTarget.style.setProperty(
                              "--my",
                              `${event.clientY - rect.top}px`,
                            );
                          }}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: index * 0.045,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="spotlight edge-glow group relative rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-left transition-colors duration-300 hover:border-cyan/25 hover:bg-white/[0.05]"
                        >
                          <div className="flex items-start justify-between">
                            <span className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-cyan/90">
                              <Icon className="size-[18px]" strokeWidth={1.6} aria-hidden="true" />
                            </span>
                            <span className="font-mono text-[10px] text-muted/60">
                              {module.index}
                            </span>
                          </div>

                          <h2 className="mt-4 font-display text-[15px] font-semibold text-ink">
                            {module.label}
                          </h2>
                          <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
                            {module.hint}
                          </p>

                          <span className="mt-3 inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.14em] text-cyan/0 transition-colors duration-300 group-hover:text-cyan/80">
                            Abrir módulo
                            <ArrowUpRight className="size-3" aria-hidden="true" />
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="mt-4 grid grid-cols-3 divide-x divide-white/8 overflow-hidden rounded-xl border border-white/8 bg-white/[0.02]">
                    {[
                      { value: MODULES.length, label: "Módulos" },
                      { value: projects.length, label: "Proyectos" },
                      { value: certifications.length, label: "Certificaciones" },
                    ].map((stat) => (
                      <div key={stat.label} className="px-3 py-3 text-center sm:text-left">
                        <p className="font-display text-lg font-semibold text-ink">
                          {String(stat.value).padStart(2, "0")}
                        </p>
                        <p className="font-mono text-[8.5px] uppercase tracking-[0.16em] text-muted">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Dock móvil */}
      <nav
        aria-label="Módulos del portafolio"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-white/8 bg-[#05070d]/90 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden"
      >
        <ul className="flex items-center justify-around">
          {MODULES.map((module) => {
            const Icon = module.icon;
            const isActive = active === module.id;
            return (
              <li key={module.id}>
                <button
                  type="button"
                  onClick={() => open(module.id)}
                  aria-label={`${module.index} · ${module.label}`}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex min-w-[48px] flex-col items-center gap-1 rounded-lg px-2 py-1.5 transition-colors",
                    isActive ? "text-cyan" : "text-muted",
                  )}
                >
                  <Icon className="size-[18px]" strokeWidth={1.7} aria-hidden="true" />
                  <span className="font-mono text-[8px] uppercase">
                    {module.short}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <Mascot onOpenContact={() => setActive("contact")} />

      <p className="sr-only" role="status" aria-live="polite">
        {current ? `Módulo ${current.index}: ${current.label}` : "Menú principal"}
      </p>
    </div>
  );
}
