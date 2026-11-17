import { createRoot, type Root } from "react-dom/client";
import { useEffect, useRef, useState } from "react";
import { LaptopScene } from "@/components/three/LaptopScene";
import { LAPTOP_THEME_GREEN } from "@/components/three/Laptop";

/**
 * Envoltorio mínimo para montar el portátil 3D ORIGINAL dentro del sitio
 * estático. No modifica ni redeclara el modelo: reutiliza LaptopScene tal cual.
 */

interface MountOptions {
  onOpened?: () => void;
}

interface LaptopApi {
  mount: (element: HTMLElement, options?: MountOptions) => void;
  enter: () => void;
  destroy: () => void;
}

let root: Root | null = null;

const api: LaptopApi = {
  mount(element, options) {
    function LaptopEmbed() {
      const [entering, setEntering] = useState(false);
      const opened = useRef(options?.onOpened);
      opened.current = options?.onOpened;

      useEffect(() => {
        api.enter = () => {
          setEntering(true);
          window.setTimeout(() => opened.current?.(), 2400);
        };
        return () => {
          api.enter = () => {};
        };
      }, []);

      return <LaptopScene entering={entering} theme={LAPTOP_THEME_GREEN} />;
    }

    if (root) root.unmount();
    root = createRoot(element);
    root.render(<LaptopEmbed />);
  },

  enter() {},

  destroy() {
    if (root) {
      root.unmount();
      root = null;
    }
  },
};

(window as unknown as { MiguelLaptop: LaptopApi }).MiguelLaptop = api;
