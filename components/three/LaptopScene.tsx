"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Scene } from "./Laptop";

/**
 * R3F mide su contenedor con ResizeObserver y no crea el renderer hasta
 * recibir un tamaño > 0. Algunos entornos (ventanas restauradas, iframes)
 * no disparan el primer callback: forzamos una re-medición al montar.
 */
function SceneResizeKick() {
  useEffect(() => {
    const kick = () => {
      window.dispatchEvent(new Event("resize"));
      document.dispatchEvent(new Event("scroll"));
    };
    kick();
    const timers = [
      window.setTimeout(kick, 120),
      window.setTimeout(kick, 600),
    ];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  return null;
}

export function LaptopScene({ entering }: { entering: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const measure = () => {
      if (element.clientWidth > 0 && element.clientHeight > 0) {
        setReady(true);
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0">
      {ready && (
        <>
          <SceneResizeKick />
          <Canvas
            dpr={[1, 1.7]}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
            camera={{ position: [0, 1.85, 7.0], fov: 33, near: 0.1, far: 40 }}
            onCreated={({ gl }) => {
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.02;
            }}
          >
            <Suspense fallback={null}>
              <Scene entering={entering} />
            </Suspense>
          </Canvas>
        </>
      )}
    </div>
  );
}
