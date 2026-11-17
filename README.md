# ENTER MIGUEL'S WORLD

Portafolio interactivo 3D de **Miguel Borda** — Desarrollador de Software Full Stack.
La experiencia arranca con un portátil 3D en un entorno cinematográfico; al pulsar
**ENTRAR A MI UNIVERSO** la tapa se abre, la pantalla enciende y la cámara entra al
sistema operativo personal con seis módulos.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Estilos | Tailwind CSS v4 + tokens CSS propios |
| 3D | Three.js + React Three Fiber + Drei |
| Animación UI | Motion |
| Iconos | Lucide |
| Datos | `content/cv.ts` (fuente única de verdad) |

## Comandos

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
npm start        # servir el build
npm run typecheck
```

Requiere Node 20.9+ (probado con Node 24).

## Estructura

```
app/
  layout.tsx            Metadatos, fuentes, JSON-LD
  page.tsx              Landing
  globals.css           Sistema de diseño y utilidades
components/
  experience/           Máquina de estados escena → OS, hero, portátil CSS
  three/                Escena WebGL, portátil procedural y texturas canvas
  os/                   Shell del SO, módulos, mascota-asistente
content/cv.ts           TODO el contenido editable
legacy/                 Sitio anterior (HTML/CSS/JS) conservado intacto
```

## Cómo actualizar el contenido

Todo se edita en **`content/cv.ts`**. No hay datos inventados: los campos `null`
no se renderizan.

### Pendientes marcados con `TODO`

1. **Identidad**: `profile.github`, `profile.linkedin`, `profile.location`, `profile.siteUrl`.
2. **Proyectos**: descripción (`summary`), `features`, `url` y `repo` de cada proyecto.
   Mientras `url` sea `null`, la ficha muestra “Demo no publicada”.
3. **Formación académica**: agregar objetos a `education`.
4. **Certificaciones**: `issuer` y `date` de las 7 que faltan.
5. **CV en PDF**: subir el archivo a `public/cv/Miguel-Borda-CV.pdf` y poner
   `profile.cvPdfReady = true`.
6. **Imagen Open Graph**: crear `public/og.png` (1200×630) y referenciarla en
   `app/layout.tsx` cuando exista dominio final.
7. **Fecha de inicio en Empire**: `experience[0].start` está marcada como pendiente
   (`startPending`). La fecha de fin (07/01/2027) ya está confirmada.

### Añadir un proyecto

```ts
{
  id: "mi-proyecto",
  name: "Mi Proyecto",
  category: "Categoría",
  summary: "Qué problema resuelve y tu rol.",
  features: ["...", "..."],
  stack: ["React", "TypeScript"],
  url: "https://...",
  repo: "https://github.com/...",
  image: null,
  status: "confirmed",
}
```

## Rendimiento y accesibilidad

- El 3D se carga con `dynamic import` y solo se monta en equipos capaces
  (WebGL + ≥4 núcleos). En móvil, gama baja o `prefers-reduced-motion` se usa un
  portátil CSS equivalente.
- DPR limitado a 1.7, geometría procedural (sin modelos externos) y texturas
  generadas en canvas: cero descargas de assets 3D.
- Navegación por teclado (`1–6`, `Esc`), foco gestionado, `aria-live`,
  `aria-modal` en fichas y respeto por movimiento reducido.

## Sitio anterior

`legacy/` conserva el CV estático original completo (HTML, CSS, JS e imágenes) y
sigue abriéndose con doble clic en `legacy/index.html`. Nada se eliminó.
