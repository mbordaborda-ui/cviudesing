"use client";

import { useEffect, useState } from "react";

export type Quality = "high" | "low" | "none";

/**
 * Detecta la capacidad del equipo para decidir el nivel de la escena 3D.
 * - `none`  → sin WebGL o movimiento reducido: se usa el portátil CSS.
 * - `low`   → móvil, pocos núcleos o poca memoria: 3D simplificado.
 * - `high`  → escritorio capaz: reflejos, sombras y dpr alto.
 */
export function useQuality(): Quality {
  const [quality, setQuality] = useState<Quality>("low");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const cores = navigator.hardwareConcurrency ?? 4;
    const memory =
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;

    let webgl = false;
    try {
      const canvas = document.createElement("canvas");
      webgl = Boolean(
        canvas.getContext("webgl2") ?? canvas.getContext("webgl"),
      );
    } catch {
      webgl = false;
    }

    if (!webgl || reduced) {
      setQuality("none");
      return;
    }

    if (coarse || cores < 4 || memory < 4) {
      setQuality("low");
      return;
    }

    setQuality("high");
  }, []);

  return quality;
}
