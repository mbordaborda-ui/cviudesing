# 🔒 ZONA PROTEGIDA — PORTÁTIL 3D ORIGINAL

Este apartado del proyecto implementa el **portátil animado original** creado en el
primer prompt del portafolio. Su diseño, geometría, cámara y animación de apertura
**no deben modificarse**.

## Archivos protegidos

```
components/three/Laptop.tsx        ← geometría, materiales, luces, cámara y apertura
components/three/LaptopScene.tsx   ← Canvas, DPR, montaje del renderer
components/three/textures.ts       ← pantalla, teclado, emblema y glow procedurales
components/experience/Experience.tsx  ← máquina de estados stage → entering → OS
components/experience/StageOverlay.tsx ← capa de entrada (nombre, CTA)
```

## Invariantes que no se tocan

- Geometría del portátil, proporciones, posición y escala.
- Ángulo de tapa, bisagra y recorrido de apertura (`CLOSED_LID`, `OPEN_LID`).
- Tiempos: `OPEN_DURATION = 2400 ms` y salto al OS a los `2650 ms`.
- Cámara: posición inicial `[0, 1.9, 7.0]`, fov 33, dolly final `[offsetX, 0.95, 1.1]`.
- Luces, `Environment`, `ContactShadows` y paleta cian/violeta de la escena.
- Composición: texto a la izquierda, portátil a la derecha en escritorio.

## Dónde sí se puede trabajar

- `components/os/**` → módulos, transiciones internas, dock, boot, mascota.
- `content/cv.ts` → contenido.
- `components/experience/CssLaptop.tsx` → respaldo para equipos sin WebGL
  (no es el portátil principal).

## Reglas para futuras mejoras

1. Ninguna transición del OS debe montarse antes de desmontar la escena 3D.
2. No añadir efectos globales (`filter`, `transform`, `opacity`) al `body` o a
   `#__next` que afecten al Canvas.
3. Cualquier cambio en los archivos protegidos requiere revisar este documento
   y verificar el checklist de abajo.

## Checklist de verificación

- [ ] `npm run build` sin errores.
- [ ] La tapa abre y la pantalla enciende.
- [ ] La cámara avanza hacia el monitor.
- [ ] El flash y el paso al OS ocurren a ~2,65 s.
- [ ] El portátil se ve completo (base, tapa, emblema) y sin recortes.
- [ ] Sin errores en consola.

## Puntos de restauración (git)

| Tag | Qué contiene |
|---|---|
| `portatil-original` | Commit `e90817d`: portátil 3D recién creado, sin cambios posteriores |
| `checkpoint-restauracion` | Estado verificado al declarar esta zona protegida |

Para comparar:

```bash
git diff portatil-original HEAD -- components/three
```

Debe salir **vacío**. Si no lo está, alguien modificó el portátil.
