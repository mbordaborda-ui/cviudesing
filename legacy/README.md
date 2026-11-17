# Hoja de vida web — Miguel Borda

Sitio de hoja de vida / portafolio para un **Desarrollador de Software**, con una
estética editorial inspirada en [melonn.com](https://www.melonn.com/): fondo claro,
tipografía grande, cuadrículas limpias, composiciones asimétricas y acentos verde lima.

Construido con **HTML5 + CSS3 + JavaScript vanilla**. No requiere build, ni frameworks,
ni dependencias. Basta con abrir `index.html`.

---

## Estructura del proyecto

```
PROYECTOMIGUELBORDA/
├── index.html                  → Todo el contenido y la estructura
├── assets/
│   ├── css/styles.css          → Sistema de diseño, responsive y estilos de impresión
│   ├── js/main.js              → Navbar, animaciones de scroll, interacciones
│   └── img/                    → Mockups SVG de proyectos, favicon y portada social
└── README.md
```

---

## Cómo editar tu información

Todo el contenido está en `index.html`, organizado por secciones y con comentarios
`<!-- EDIT: ... -->`. Busca los textos **entre corchetes `[...]`**: son marcadores de
ejemplo que debes reemplazar.

### 1. Datos personales y SEO
- En el `<head>`: `<title>`, `description`, `canonical`, Open Graph y el bloque JSON-LD.
- Cambia **Miguel Borda**, el correo `correo@ejemplo.com`, el teléfono/ciudad y las URLs
  de GitHub y LinkedIn (aparecen en el navbar, el hero, el contacto y el footer).

### 2. Secciones
| Sección | Dónde | Qué editar |
|---|---|---|
| Hero | `<section class="hero">` | Nombre, cargo, descripción, botones y redes |
| Sobre mí | `#sobre-mi` | Perfil, enfoque, fortalezas |
| Experiencia | `#experiencia` | Bloque `<li class="tl">` por cada empleo |
| Proyectos | `#proyectos` | Bloque `<article class="project">` por proyecto |
| Habilidades | `#habilidades` | Etiquetas (`.tag`) de cada categoría |
| Certificaciones | `#certificaciones` | Bloque `<article class="cert">` |
| Formación | `#formacion` | Bloque `<article class="edu-item">` |
| Contacto | `#contacto` | Correo y tarjetas de redes |

Para **duplicar** un elemento, copia el bloque completo `<!-- EDIT: duplica ... -->`
y cambia su contenido. No inventes experiencia, títulos ni certificaciones: usa los
marcadores y complétalos con tus datos reales.

### 3. Imágenes de proyectos
Reemplaza los archivos en `assets/img/` por capturas reales (mismo nombre) o cambia el
`src` de cada `<img>`. Recomendado: **1200 × 800 px**, formato `.webp` o `.svg`.

### 4. Colores y tipografía
En `assets/css/styles.css`, dentro de `:root`:
- `--lime` / `--lime-2` → acento verde lima.
- `--bg`, `--ink`, `--dark` → superficies y tinta.
- `--font-display`, `--font-body`, `--font-mono` → tipografías (se cargan desde Google Fonts).

---

## Descargar el CV en PDF

El botón **«Descargar CV»** (hero y contacto) abre el diálogo de impresión del navegador.
Elige **«Guardar como PDF»** para obtener un documento **A4** limpio: la hoja de estilos
incluye un bloque `@media print` que oculta navbar, animaciones y elementos interactivos,
compacta las secciones y evita cortes de página dentro de cada entrada.

> Consejo: en el diálogo de impresión activa «Gráficos de fondo» si quieres conservar los
> acentos de color.

---

## Características

- Responsive real: escritorio, tablet y móvil (menú hamburguesa).
- Animaciones: entrada del hero, revelado al hacer scroll, transiciones, microinteracciones,
  marquesina de tecnologías y movimiento 3D sutil del elemento gráfico del hero.
- **Mascota esfera lima** (estilo esfera LED de Las Vegas, en el color de acento de la CV)
  fija abajo a la derecha: **los ojos siguen el cursor**, parpadea, tiene **expresiones**
  (feliz, sorprendida, risa, juguetona) y se mueve con rebote y squash/stretch. Lleva gafas y
  chips de código flotantes (`</>`, `{ }`, `$_`) para un look de desarrollador.
  **Se enoja** cuando el cursor se acerca demasiado o al hacer clic (cejas fruncidas, mirada
  estrecha, tinte rojo y vibración). Al hacer clic salta y te lleva a Contacto.
- **Micro-animaciones extra**: botones magnéticos, foco de luz que sigue el cursor en la
  sección de habilidades, inclinación 3D en las tarjetas de proyecto, texto rotativo
  («Enfoque») y botón «volver arriba».
- Enfoque **orientado a empresas**: el perfil y el contacto están redactados para postular a
  equipos y empresas de tecnología (Desarrollo **Full Stack** enfocado en **automatización y
  solución de procesos**; modalidad remoto · híbrido).
- Respeta `prefers-reduced-motion` y desactiva efectos pesados en dispositivos táctiles.
- Navbar con estado al hacer scroll, barra de progreso y enlace de sección activo.
- SEO básico (metaetiquetas, Open Graph, JSON-LD), accesibilidad (foco visible, `aria`, skip link)
  y carga rápida (sin dependencias).

### Personalizar la mascota
- Texto del bocadillo: busca `mascot__bubble` en `index.html`.
- Color: la esfera usa el acento lima; ajusta `--mascot` / `--mascot-2` en `:root` y el
  degradado `#mbBall` (dentro del SVG de la mascota en `index.html`).
- Enojo: umbral de cercanía (`NEAR` / `FAR`) y reproducción al clic en la sección **11** de `main.js`.
- Tamaño: `.mascot` y `.mascot__globe` en la sección **18** de `styles.css`.
- Expresiones y movimiento: keyframes `mascotAlive`, `mascotWiggle`, `mascotJump` en `styles.css`.
- Comportamiento (seguir el cursor, parpadeo, expresiones, clic a Contacto): sección **11**
  de `main.js`.

---

## Ver el sitio localmente

Abre `index.html` directamente en el navegador, o sirve la carpeta:

```bash
# Python 3
python -m http.server 8000

# Node (si tienes npx)
npx serve
```

Luego visita `http://localhost:8000`.
