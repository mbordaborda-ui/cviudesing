"use client";

import { profile } from "@/content/cv";

/**
 * Portátil 100% CSS: alternativa para móvil, equipos sin WebGL,
 * movimiento reducido o hardware limitado. Misma narrativa, cero GPU.
 */
export function CssLaptop({ entering }: { entering: boolean }) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex h-[44vh] items-end justify-center sm:h-[50vh]"
      aria-hidden="true"
    >
      <div className="relative w-[min(560px,88vw)] pb-[3vh]">
        <div className="absolute -inset-x-16 bottom-0 h-48 rounded-full bg-[radial-gradient(closest-side,rgba(61,110,255,0.32),transparent)] blur-2xl" />

        <div style={{ perspective: "1400px" }}>
          <div
            className="relative"
            style={{
              transform: `rotateX(${entering ? 2 : 9}deg) scale(${entering ? 1.04 : 1})`,
              transformStyle: "preserve-3d",
              transition: "transform 1.7s cubic-bezier(.16,1,.3,1)",
            }}
          >
            {/* Tapa */}
            <div
              className="relative overflow-hidden rounded-t-2xl border border-white/10 bg-[#0a0e17] p-1.5 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.95)] sm:p-2"
              style={{
                aspectRatio: "16 / 10",
                transform: `rotateX(${entering ? -2 : -96}deg)`,
                transformOrigin: "bottom center",
                transition: "transform 1.8s cubic-bezier(.16,1,.3,1)",
              }}
            >
              <div
                className="relative flex h-full w-full flex-col overflow-hidden rounded-lg"
                style={{
                  background:
                    "linear-gradient(160deg,#050b1c 0%,#081229 55%,#04060f 100%)",
                  boxShadow: entering
                    ? "0 0 60px rgba(53,227,255,0.35) inset"
                    : "0 0 24px rgba(53,227,255,0.12) inset",
                  transition: "box-shadow 1.2s ease",
                }}
              >
                <div
                  className="absolute inset-0 opacity-50"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(53,227,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(53,227,255,0.08) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(53,227,255,0.24),transparent_62%)]" />

                <div className="relative flex items-center gap-1.5 border-b border-white/5 px-3 py-2">
                  <span className="size-1.5 rounded-full bg-[#ff5f57]/80" />
                  <span className="size-1.5 rounded-full bg-[#febc2e]/80" />
                  <span className="size-1.5 rounded-full bg-[#28c840]/80" />
                  <span className="ml-2 font-mono text-[7px] tracking-widest text-muted/70">
                    miguel.os — boot
                  </span>
                </div>

                <div className="relative flex flex-1 flex-col items-center justify-center px-4 text-center">
                  <span className="bg-gradient-to-r from-cyan via-[#7aa2ff] to-violet bg-clip-text font-display text-[clamp(2rem,7vw,4rem)] font-bold leading-none text-transparent">
                    MB
                  </span>
                  <span className="mt-2 font-display text-[clamp(0.6rem,2vw,0.9rem)] font-semibold tracking-[0.18em] text-ink/90">
                    MIGUEL BORDA
                  </span>
                  <span className="mt-1 font-mono text-[7px] uppercase tracking-[0.2em] text-muted/80">
                    Full Stack Developer
                  </span>
                </div>

                <div className="relative px-4 pb-3 font-mono text-[7px] leading-relaxed text-cyan/70">
                  <p>&gt; initializing miguel.os</p>
                  <p className="text-muted/60">&gt; loading modules 06/06</p>
                  <p className="text-muted/60">&gt; status: ready</p>
                </div>

                {entering && (
                  <div className="scanline pointer-events-none absolute inset-x-0 h-12 bg-gradient-to-b from-transparent via-cyan/20 to-transparent" />
                )}
              </div>
            </div>

            {/* Base */}
            <div className="relative h-2.5 rounded-b-2xl border-x border-b border-white/10 bg-gradient-to-b from-[#1c2331] to-[#080b12] sm:h-3" />
            <div className="mx-auto h-1 w-28 rounded-b-full bg-[#04060b]" />
          </div>
        </div>

        <div className="mx-auto mt-3 h-8 w-[80%] rounded-[100%] bg-[radial-gradient(closest-side,rgba(53,227,255,0.20),transparent)] blur-lg" />
        <p className="sr-only">
          Representación del portátil de {profile.name}
        </p>
      </div>
    </div>
  );
}
