"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  Command,
  Power,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { certifications, profile, projects, skills } from "@/content/cv";
import { cn } from "@/lib/format";
import { modalLayer } from "@/lib/modal-layer";
import { BootSequence } from "./BootSequence";
import { Mascot } from "./Mascot";
import { ModuleContent } from "./Modules";
import { MODULES, type ModuleId } from "./modules-data";
import { spaceVariants, tiltMove, tiltReset } from "./motion";

export function OSShell({ onExit }: { onExit: () => void }) {
  const [active, setActive] = useState<ModuleId | null>(null);
  const [clock, setClock] = useState("");
  const mainRef = useRef<HTMLElement>(null);
  const scrollBar = useRef<HTMLDivElement>(null);
  const previous = useRef<ModuleId | null>(null);

  const handleScroll = (event: React.UIEvent<HTMLElement>) => {
    const element = event.currentTarget;
    const max = element.scrollHeight - element.clientHeight;
    const ratio = max > 0 ? element.scrollTop / max : 0;
    if (scrollBar.current) {
      scrollBar.current.style.transform = `scaleX(${ratio})`;
    }
  };

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
        // Una ficha de proyecto abierta consume el primer Escape.
        if (modalLayer.open) return;
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
      mainRef.current?.scrollTo({ top: 0 });
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

      {/* Ambiente animado del sistema */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="aurora-blob"
          style={{
            width: 460,
            height: 460,
            left: "4%",
            top: "6%",
            background: "rgba(61,110,255,0.22)",
          }}
        />
        <span
          className="aurora-blob"
          style={{
            width: 380,
            height: 380,
            right: "4%",
            top: "34%",
            background: "rgba(139,92,246,0.18)",
            animationDelay: "-7s",
          }}
        />
        <span
          className="aurora-blob"
          style={{
            width: 500,
            height: 500,
            left: "36%",
            bottom: "-22%",
            background: "rgba(53,227,255,0.14)",
            animationDelay: "-13s",
          }}
        />
        <div
          className="grid-drift absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(233,238,249,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(233,238,249,0.06) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage:
              "radial-gradient(circle at 50% 40%, #000 0%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 40%, #000 0%, transparent 75%)",
          }}
        />
      </div>

      {/* Barra de sistema */}
      <motion.header
        initial={{ y: -14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-30 flex items-center gap-3 border-b border-white/8 bg-[#05070d]/70 px-3 py-2 backdrop-blur-xl sm:px-4"
      >
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
      </motion.header>

      <div className="relative z-10 flex min-h-0 flex-1">
        {/* Dock escritorio */}
        <motion.aside
          aria-label="Módulos del portafolio"
          initial={{ x: -24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
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
                <Icon
                  className="size-[18px] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110"
                  aria-hidden="true"
                  strokeWidth={1.7}
                />
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
        </motion.aside>

        {/* Contenido */}
        <div
          className="relative min-h-0 flex-1"
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
        >
          <div className="os-glow pointer-events-none absolute inset-0 z-0" aria-hidden="true" />
          <div
            key={active ?? "home"}
            className="sweep pointer-events-none absolute inset-y-0 left-0 z-10 w-1/3 bg-gradient-to-r from-transparent via-cyan/[0.07] to-transparent"
            aria-hidden="true"
          />
          <div
            ref={scrollBar}
            className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-cyan via-electric to-violet"
            aria-hidden="true"
          />
          <main
            ref={mainRef}
            tabIndex={-1}
            onScroll={handleScroll}
            className="relative h-full overflow-y-auto scroll-slim px-4 pb-28 pt-4 outline-none sm:px-6 md:pb-6"
          >
          <div className="mx-auto w-full max-w-6xl">
            <AnimatePresence mode="popLayout" initial={false}>
              {active && current ? (
                <motion.div
                  key={active}
                  variants={spaceVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  style={{ transformPerspective: 1200, transformOrigin: "top center" }}
                >
                  <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-white/8 pb-4">
                    <div className="flex items-start gap-3">
                      <span className="relative mt-0.5 grid size-11 shrink-0 place-items-center rounded-xl border border-cyan/20 bg-cyan/[0.06] text-cyan">
                        <current.icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
                        <span className="absolute -right-1 -top-1 size-2 rounded-full bg-cyan pulse-dot" />
                      </span>
                      <div>
                        <p className="font-mono text-[10px] text-cyan/80">
                          {current.index} — {current.short.toUpperCase()}
                        </p>
                        <h1 className="display mt-1 text-2xl font-semibold text-ink sm:text-3xl">
                          {current.label}
                        </h1>
                        <p className="mt-1 max-w-xl text-[12px] text-muted">
                          {current.hint}
                        </p>
                        <motion.span
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                          className="mt-3 block h-px w-28 origin-left bg-gradient-to-r from-cyan via-electric to-transparent"
                          aria-hidden="true"
                        />
                      </div>
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

                  <div className="hud-corners relative rounded-2xl border border-white/[0.06] bg-[#070b14]/40 p-3 sm:p-5">
                    <ModuleContent id={active} />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="home"
                  variants={spaceVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  style={{ transformPerspective: 1200, transformOrigin: "top center" }}
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
                          onMouseMove={(event) => tiltMove(event, 6)}
                          onMouseLeave={tiltReset}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: index * 0.045,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="spotlight edge-glow sheen tilt group relative rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-left transition-colors duration-300 hover:border-cyan/25 hover:bg-white/[0.05]"
                        >
                          <div className="flex items-start justify-between">
                            <span className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-cyan/90 transition-colors duration-300 group-hover:border-cyan/30 group-hover:bg-cyan/10">
                              <Icon
                                className="size-[18px] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
                                strokeWidth={1.6}
                                aria-hidden="true"
                              />
                            </span>
                            <span className="font-mono text-[10px] text-muted/60 transition-colors group-hover:text-cyan/70">
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

                  {/* Cinta de stack en movimiento */}
                  <div className="relative mt-4 overflow-hidden rounded-xl border border-white/8 bg-white/[0.02] py-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#060910] to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#060910] to-transparent" />
                    <div className="marquee-track flex w-max items-center gap-5 whitespace-nowrap px-4">
                      {[...skills.flatMap((category) => category.items), "React Three Fiber", "Motion", "Next.js"].map(
                        (item, index) => (
                          <span
                            key={`${item}-${index}`}
                            className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-muted/70"
                          >
                            <span className="size-1 rounded-full bg-cyan/50" />
                            {item}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          </main>
        </div>
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
      <BootSequence />

      <p className="sr-only" role="status" aria-live="polite">
        {current ? `Módulo ${current.index}: ${current.label}` : "Menú principal"}
      </p>
    </div>
  );
}
