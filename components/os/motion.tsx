"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

export const staggerParent = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE },
  },
};

export function Stagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}

let reducedCache: boolean | null = null;

function prefersReducedMotion() {
  if (reducedCache === null) {
    reducedCache = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  return reducedCache;
}

/** Inclinación 3D + luz que sigue al cursor. */
export function tiltMove(
  event: React.MouseEvent<HTMLElement>,
  strength = 7,
) {
  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();
  const px = (event.clientX - rect.left) / rect.width - 0.5;
  const py = (event.clientY - rect.top) / rect.height - 0.5;

  element.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  element.style.setProperty("--my", `${event.clientY - rect.top}px`);

  if (prefersReducedMotion()) return;

  element.style.transform = `perspective(900px) rotateY(${px * strength}deg) rotateX(${
    -py * strength
  }deg) translateZ(0)`;
  element.style.setProperty("--ry", `${px * strength}deg`);
  element.style.setProperty("--rx", `${-py * strength}deg`);
}

export function tiltReset(event: React.MouseEvent<HTMLElement>) {
  const element = event.currentTarget;
  element.style.transform = "";
  element.style.setProperty("--ry", "0deg");
  element.style.setProperty("--rx", "0deg");
}

/** Efecto magnético sutil para botones principales. */
export function magneticMove(event: React.MouseEvent<HTMLElement>, strength = 7) {
  if (prefersReducedMotion()) return;
  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();
  const x = ((event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * strength;
  const y = ((event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * strength;
  element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
}

export function magneticReset(event: React.MouseEvent<HTMLElement>) {
  event.currentTarget.style.transform = "";
}

/** Variantes de transición entre espacios del OS. */
export const spaceVariants = {
  initial: {
    opacity: 0,
    y: 26,
    rotateX: 9,
    scale: 0.985,
    filter: "blur(6px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: -14,
    scale: 0.99,
    filter: "blur(4px)",
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};
