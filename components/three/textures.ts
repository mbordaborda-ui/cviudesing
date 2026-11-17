"use client";

import * as THREE from "three";

/** Pantalla de arranque dibujada en canvas: cero assets externos. */
export function createScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext("2d")!;

  const bg = ctx.createLinearGradient(0, 0, 1024, 640);
  bg.addColorStop(0, "#050b1c");
  bg.addColorStop(0.55, "#081229");
  bg.addColorStop(1, "#04060f");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1024, 640);

  // Rejilla
  ctx.strokeStyle = "rgba(53,227,255,0.09)";
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
  halo.addColorStop(0, "rgba(53,227,255,0.30)");
  halo.addColorStop(0.45, "rgba(61,110,255,0.12)");
  halo.addColorStop(1, "rgba(4,6,11,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, 1024, 640);

  // Barra superior
  ctx.fillStyle = "rgba(4,8,18,0.85)";
  ctx.fillRect(0, 0, 1024, 44);
  ctx.fillStyle = "rgba(233,238,249,0.35)";
  ["#ff5f57", "#febc2e", "#28c840"].forEach((color, i) => {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.85;
    ctx.arc(28 + i * 22, 22, 5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
  ctx.fillStyle = "rgba(233,238,249,0.55)";
  ctx.font = "500 16px monospace";
  ctx.fillText("miguel.os — boot", 110, 28);

  // Monograma
  ctx.textAlign = "center";
  const mono = ctx.createLinearGradient(380, 0, 660, 0);
  mono.addColorStop(0, "#35e3ff");
  mono.addColorStop(0.5, "#7aa2ff");
  mono.addColorStop(1, "#8b5cf6");
  ctx.fillStyle = mono;
  ctx.font = "700 200px ui-sans-serif, system-ui, sans-serif";
  ctx.shadowColor = "rgba(53,227,255,0.55)";
  ctx.shadowBlur = 48;
  ctx.fillText("MB", 512, 360);
  ctx.shadowBlur = 0;

  ctx.fillStyle = "rgba(233,238,249,0.92)";
  ctx.font = "600 30px ui-sans-serif, system-ui, sans-serif";
  ctx.fillText("MIGUEL BORDA", 512, 420);
  ctx.fillStyle = "rgba(139,148,167,0.9)";
  ctx.font = "400 18px monospace";
  ctx.fillText("FULL STACK DEVELOPER", 512, 452);

  // Consola
  ctx.textAlign = "left";
  ctx.font = "400 16px monospace";
  const lines = [
    "> initializing miguel.os",
    "> loading modules .......... 06/06",
    "> stack: react · ts · node · sql · c#",
    "> status: ready",
  ];
  lines.forEach((line, index) => {
    ctx.fillStyle =
      index === lines.length - 1 ? "rgba(53,227,255,0.95)" : "rgba(139,148,167,0.75)";
    ctx.fillText(line, 76, 520 + index * 26);
  });

  // Línea de escaneo
  const scan = ctx.createLinearGradient(0, 0, 0, 640);
  scan.addColorStop(0, "rgba(53,227,255,0)");
  scan.addColorStop(0.5, "rgba(53,227,255,0.06)");
  scan.addColorStop(1, "rgba(53,227,255,0)");
  ctx.fillStyle = scan;
  ctx.fillRect(0, 0, 1024, 640);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/** Teclado + trackpad como textura: 1 solo draw call en lugar de 70 mallas. */
export function createDeckTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 560;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#0b0f18";
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
      grad.addColorStop(0, "#1d2432");
      grad.addColorStop(1, "#141a26");
      ctx.fillStyle = grad;
      roundRect(ctx, x, y, keyW, keyH, 8);
      ctx.fill();
      ctx.strokeStyle = "rgba(53,227,255,0.05)";
      ctx.stroke();
    }
  }

  // Barra espaciadora
  const spaceX = startX + 4 * (keyW + gap);
  const spaceY = startY + 4 * (keyH + gap);
  const spaceW = 6 * keyW + 5 * gap;
  const spaceGrad = ctx.createLinearGradient(spaceX, spaceY, spaceX, spaceY + keyH);
  spaceGrad.addColorStop(0, "#1d2432");
  spaceGrad.addColorStop(1, "#141a26");
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
  glow.addColorStop(0, "rgba(53,227,255,0)");
  glow.addColorStop(0.5, "rgba(53,227,255,0.5)");
  glow.addColorStop(1, "rgba(53,227,255,0)");
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
export function createMonogramTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, 512, 512);

  const gradient = ctx.createLinearGradient(150, 110, 370, 400);
  gradient.addColorStop(0, "#c9f9ff");
  gradient.addColorStop(0.45, "#35e3ff");
  gradient.addColorStop(1, "#8b5cf6");

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
  ctx.strokeStyle = "rgba(53,227,255,0.45)";
  ctx.lineWidth = 5;
  ctx.stroke();

  // Rombo interior
  ctx.save();
  ctx.translate(center, center);
  ctx.rotate(Math.PI / 4);
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 14;
  ctx.shadowColor = "rgba(53,227,255,0.9)";
  ctx.shadowBlur = 42;
  ctx.strokeRect(-62, -62, 124, 124);
  ctx.restore();

  // Núcleo
  ctx.beginPath();
  ctx.arc(center, center, 16, 0, Math.PI * 2);
  ctx.fillStyle = "#d9fbff";
  ctx.shadowColor = "rgba(53,227,255,1)";
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
