"use client";

import { MotionConfig, motion } from "motion/react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { OSShell } from "@/components/os/OSShell";
import { useQuality } from "@/lib/use-quality";
import { CssLaptop } from "./CssLaptop";
import { StageOverlay } from "./StageOverlay";

const LaptopScene = dynamic(
  () =>
    import("@/components/three/LaptopScene").then((mod) => mod.LaptopScene),
  { ssr: false },
);

type View = "stage" | "os";

export function Experience() {
  const quality = useQuality();
  const [view, setView] = useState<View>("stage");
  const [entering, setEntering] = useState(false);
  // 3D solo en equipos capaces; móvil / gama baja usan el portátil CSS.
  const use3D = quality === "high";

  const enter = useCallback(() => {    if (entering) return;
    if (!use3D) {
      setView("os");
      return;
    }
    setEntering(true);
  }, [entering, use3D]);

  useEffect(() => {
    if (!entering) return;
    const timer = window.setTimeout(() => setView("os"), 2650);
    return () => window.clearTimeout(timer);
  }, [entering]);

  // Enter inicia la experiencia (sin secuestrar el teclado en controles).
  useEffect(() => {
    if (view !== "stage") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" || event.repeat) return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        ["BUTTON", "A", "INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
      ) {
        return;
      }
      enter();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [view, enter]);

  const exitToStage = useCallback(() => {
    setView("stage");
    setEntering(false);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative h-dvh w-full overflow-hidden bg-void">
        <div className="stage-bg" aria-hidden="true" />
        <div className="stage-grid" aria-hidden="true" />

        {view === "stage" ? (
          <>
            {use3D ? (
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.1, ease: "easeOut" }}
                aria-hidden="true"
              >
                <LaptopScene entering={entering} />
              </motion.div>
            ) : (
              <CssLaptop entering={entering} />
            )}

            <StageOverlay entering={entering} onEnter={enter} />

            {entering && (
              <motion.div
                className="pointer-events-none absolute inset-0 z-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0, 0.95] }}
                transition={{ duration: 2.65, times: [0, 0.6, 0.97], ease: "easeIn" }}
                style={{
                  background:
                    "radial-gradient(circle at 50% 44%, #eafcff 0%, #6fe6ff 10%, rgba(61,110,255,0.55) 32%, #04060b 68%)",
                }}
                aria-hidden="true"
              />
            )}

            <div className="stage-noise" aria-hidden="true" />
            <div className="vignette" aria-hidden="true" />
            <p className="sr-only" aria-live="polite">
              {entering ? "Abriendo el sistema de Miguel Borda" : ""}
            </p>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <OSShell onExit={exitToStage} />
          </motion.div>
        )}
      </div>
    </MotionConfig>
  );
}
