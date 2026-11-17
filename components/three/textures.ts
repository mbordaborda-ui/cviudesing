"use client";

import * as THREE from "three";

/* =============================================================
   Temas de color del portátil (solo color; geometría intacta)
   ============================================================= */

export interface ScreenTheme {
  bg: [string, string, string];
  grid: string;
  halo: [string, string];
  bar: string;
  barText: string;
  mb: [string, string, string];
  mbGlow: string;
  name: string;
  role: string;
  log: string;
  logAccent: string;
  scan: string;
}

export const SCREEN_THEME_DARK: ScreenTheme = {
  bg: ["#050b1c", "#081229", "#04060f"],
  grid: "rgba(53,227,255,0.09)",
  halo: ["rgba(53,227,255,0.30)", "rgba(61,110,255,0.12)"],
  bar: "rgba(4,8,18,0.85)",
  barText: "rgba(233,238,249,0.55)",
  mb: ["#35e3ff", "#7aa2ff", "#8b5cf6"],
  mbGlow: "rgba(53,227,255,0.55)",
  name: "rgba(233,238,249,0.92)",
  role: "rgba(139,148,167,0.9)",
  log: "rgba(139,148,167,0.75)",
  logAccent: "rgba(53,227,255,0.95)",
  scan: "rgba(53,227,255,0.06)",
};

export const SCREEN_THEME_LIGHT: ScreenTheme = {
  bg: ["#ffffff", "#fbfff2", "#f1f8e4"],
  grid: "rgba(143,183,29,0.20)",
  halo: ["rgba(202,242,75,0.35)", "rgba(143,183,29,0.12)"],
  bar: "rgba(255,255,255,0.96)",
  barText: "rgba(11,11,12,0.62)",
  mb: ["#c6f24a", "#9bc41a", "#5f8a00"],
  mbGlow: "rgba(154,196,26,0.85)",
  name: "#0b0b0c",
  role: "#2f2f34",
  log: "#2f2f34",
  logAccent: "#4f7a00",
  scan: "rgba(143,183,29,0.10)",
};

export interface EmblemTheme {
  light: string;
  mid: string;
  deep: string;
  stroke: string;
  core: string;
  glow: string;
}

export const EMBLEM_THEME_DARK: EmblemTheme = {
  light: "#c9f9ff",
  mid: "#35e3ff",
  deep: "#8b5cf6",
  stroke: "rgba(53,227,255,0.45)",
  core: "#d9fbff",
  glow: "rgba(53,227,255,0.9)",
};

export const EMBLEM_THEME_GREEN: EmblemTheme = {
  light: "#f2ffcc",
  mid: "#caf24b",
  deep: "#8fb71d",
  stroke: "rgba(143,183,29,0.55)",
  core: "#f4ffe0",
  glow: "rgba(202,242,75,0.9)",
};

export interface DeckTheme {
  bg: string;
  keyTop: string;
  keyBottom: string;
  keyStroke: string;
  glow: string;
}

export const DECK_THEME_DARK: DeckTheme = {
  bg: "#0b0f18",
  keyTop: "#1d2432",
  keyBottom: "#141a26",
  keyStroke: "rgba(53,227,255,0.05)",
  glow: "rgba(53,227,255,0.5)",
};

export const DECK_THEME_GREEN: DeckTheme = {
  bg: "#0d0f0a",
  keyTop: "#20241a",
  keyBottom: "#14170f",
  keyStroke: "rgba(143,183,29,0.07)",
  glow: "rgba(202,242,75,0.5)",
};

/** Pantalla de arranque dibujada en canvas: cero assets externos. */
export function createScreenTexture(
  theme: ScreenTheme = SCREEN_THEME_DARK,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext("2d")!;

  const bg = ctx.createLinearGradient(0, 0, 1024, 640);
  bg.addColorStop(0, theme.bg[0]);
  bg.addColorStop(0.55, theme.bg[1]);
  bg.addColorStop(1, theme.bg[2]);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1024, 640);

  // Rejilla
  ctx.strokeStyle = theme.grid;
  ctx.lineWidth = 1;
  for (let x = 0; x <= 1024; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 640);
    ctx.stroke();
  }
  for (let y = 0; y <= 640; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Halo central
  const halo = ctx.createRadialGradient(512, 300, 10, 512, 300, 420);
  halo.addColorStop(0, theme.halo[0]);
  halo.addColorStop(0.45, theme.halo[1]);
  halo.addColorStop(1, "rgba(4,6,11,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, 1024, 640);

  // Barra superior
  ctx.fillStyle = theme.bar;
  ctx.fillRect(0, 0, 1024, 44);
  ["#ff5f57", "#febc2e", "#28c840"].forEach((color, i) => {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.85;
    ctx.arc(28 + i * 22, 22, 5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
  ctx.fillStyle = theme.barText;
  ctx.font = "500 16px monospace";
  ctx.fillText("MIGUEL BORDA — boot", 110, 28);

  // Monograma
  ctx.textAlign = "center";
  const mono = ctx.createLinearGradient(380, 0, 660, 0);
  mono.addColorStop(0, theme.mb[0]);
  mono.addColorStop(0.5, theme.mb[1]);
  mono.addColorStop(1, theme.mb[2]);
  ctx.fillStyle = mono;
  ctx.font = "700 200px ui-sans-serif, system-ui, sans-serif";
  ctx.shadowColor = theme.mbGlow;
  ctx.shadowBlur = 48;
  ctx.fillText("MB", 512, 360);
  ctx.shadowBlur = 0;

  ctx.fillStyle = theme.name;
  ctx.font = "600 30px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("MIGUEL BORDA", 512, 420);
  ctx.fillStyle = theme.role;
  ctx.font = "400 18px monospace";
  ctx.fillText("FULL STACK DEVELOPER", 512, 452);

  // Consola
  ctx.textAlign = "left";
  ctx.font = "400 16px monospace";
  const lines = [
    "> initializing portfolio",
    "> loading modules .......... 06/06",
    "> stack: react · ts · node · sql · c#",
    "> status: ready",
  ];
  lines.forEach((line, index) => {
    ctx.fillStyle = index === lines.length - 1 ? theme.logAccent : theme.log;
    ctx.fillText(line, 76, 520 + index * 26);
  });

  // Línea de escaneo
  const scan = ctx.createLinearGradient(0, 0, 0, 640);
  scan.addColorStop(0, "rgba(255,255,255,0)");
  scan.addColorStop(0.5, theme.scan);
  scan.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = scan;
  ctx.fillRect(0, 0, 1024, 640);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/** Teclado + trackpad como textura: 1 solo draw call en lugar de 70 mallas. */
export function createDeckTexture(
  theme: DeckTheme = DECK_THEME_DARK,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 560;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, 1024, 560);

  const keyW = 56;
  const keyH = 48;
  const gap = 12;
  const startX = 88;
  const startY = 40;

  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 14; col += 1) {
      if (row === 4 && col > 3 && col < 10) continue; // espacio
      const x = startX + col * (keyW + gap);
      const y = startY + row * (keyH + gap);
      const grad = ctx.createLinearGradient(x, y, x, y + keyH);
      grad.addColorStop(0, theme.keyTop);
      grad.addColorStop(1, theme.keyBottom);
      ctx.fillStyle = grad;
      roundRect(ctx, x, y, keyW, keyH, 8);
      ctx.fill();
      ctx.strokeStyle = theme.keyStroke;
      ctx.stroke();
    }
  }

  // Barra espaciadora
  const spaceX = startX + 4 * (keyW + gap);
  const spaceY = startY + 4 * (keyH + gap);
  const spaceW = 6 * keyW + 5 * gap;
  const spaceGrad = ctx.createLinearGradient(spaceX, spaceY, spaceX, spaceY + keyH);
  spaceGrad.addColorStop(0, theme.keyTop);
  spaceGrad.addColorStop(1, theme.keyBottom);
  ctx.fillStyle = spaceGrad;
  roundRect(ctx, spaceX, spaceY, spaceW, keyH, 8);
  ctx.fill();

  // Trackpad
  const padX = 340;
  const padY = 360;
  const padW = 344;
  const padH = 150;
  const padGrad = ctx.createLinearGradient(padX, padY, padX, padY + padH);
  padGrad.addColorStop(0, "rgba(255,255,255,0.05)");
  padGrad.addColorStop(1, "rgba(255,255,255,0.015)");
  ctx.strokeStyle = "rgba(233,238,249,0.16)";
  ctx.lineWidth = 2;
  roundRect(ctx, padX, padY, padW, padH, 14);
  ctx.fillStyle = padGrad;
  ctx.fill();
  ctx.stroke();

  // Luz de borde inferior
  const glow = ctx.createLinearGradient(0, 520, 1024, 520);
  glow.addColorStop(0, "rgba(0,0,0,0)");
  glow.addColorStop(0.5, theme.glow);
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 548, 1024, 3);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export function createGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, "rgba(120,200,255,0.85)");
  grad.addColorStop(0.35, "rgba(61,110,255,0.35)");
  grad.addColorStop(1, "rgba(4,6,11,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Emblema geométrico (simétrico) para la tapa: sin texto que pueda espejarse. */
export function createMonogramTexture(
  theme: EmblemTheme = EMBLEM_THEME_DARK,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, 512, 512);

  const gradient = ctx.createLinearGradient(150, 110, 370, 400);
  gradient.addColorStop(0, theme.light);
  gradient.addColorStop(0.45, theme.mid);
  gradient.addColorStop(1, theme.deep);

  const center = 256;
  const hexRadius = 150;

  // Hexágono exterior
  ctx.beginPath();
  for (let i = 0; i < 6; i += 1) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    const x = center + Math.cos(angle) * hexRadius;
    const y = center + Math.sin(angle) * hexRadius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.strokeStyle = theme.stroke;
  ctx.lineWidth = 5;
  ctx.stroke();

  // Rombo interior
  ctx.save();
  ctx.translate(center, center);
  ctx.rotate(Math.PI / 4);
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 14;
  ctx.shadowColor = theme.glow;
  ctx.shadowBlur = 42;
  ctx.strokeRect(-62, -62, 124, 124);
  ctx.restore();

  // Núcleo
  ctx.beginPath();
  ctx.arc(center, center, 16, 0, Math.PI * 2);
  ctx.fillStyle = theme.core;
  ctx.shadowColor = theme.glow;
  ctx.shadowBlur = 36;
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}
