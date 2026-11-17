/**
 * ÚNICA FUENTE DE VERDAD DEL CV.
 * -------------------------------------------------------------
 * Todo lo marcado con `TODO:` está pendiente de confirmar y NO se
 * inventa en la interfaz. Los campos `null` simplemente no se
 * renderizan (o se muestran como "pendiente" al usuario).
 *
 * Para actualizar el portafolio solo se edita este archivo.
 */

export type LinkStatus = "confirmed" | "pending";

export interface ContactLink {
  label: string;
  value: string;
  href: string | null;
  status: LinkStatus;
}

export const profile = {
  name: "Miguel Borda",
  role: "Desarrollador de Software Full Stack",
  tagline:
    "No solo escribo código. Transformo problemas reales en soluciones digitales.",
  email: "mbordaborda@gmail.com",
  /** TODO: confirmar ciudad / país del CV. */
  location: null as string | null,
  /** TODO: URL real de GitHub. */
  github: null as string | null,
  /** TODO: URL real de LinkedIn. */
  linkedin: null as string | null,
  /** TODO: dominio final del portafolio. */
  siteUrl: null as string | null,
  /** Cuando subas el PDF, cambia cvPdfReady a true. */
  cvPdfPath: "/cv/Miguel-Borda-CV.pdf",
  cvPdfReady: false,
  availability: {
    label: "Disponible para empresas",
    modes: ["Remoto", "Híbrido"],
  },
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "B1 · en proceso de certificar B2" },
  ],
} as const;

export const about = {
  headline:
    "Convierto necesidades reales en software claro, rápido y mantenible.",
  paragraphs: [
    "Soy desarrollador Full Stack enfocado en automatizar y ordenar procesos. Disfruto el recorrido completo: entender el problema, diseñar la solución y llevar cada detalle a producción.",
    "Trabajo principalmente en aplicaciones web, sistemas de inventario, bases de datos SQL, APIs e integraciones que ahorran tiempo y reducen errores. Me motiva el código ordenado y las interfaces que se sienten simples incluso cuando el sistema detrás no lo es.",
  ],
  strengths: [
    {
      title: "Automatización de procesos",
      body: "Detecto tareas repetitivas y las convierto en flujos automáticos, reduciendo errores y tiempos muertos.",
    },
    {
      title: "Pensamiento lógico",
      body: "Analizo cada proceso, entiendo su lógica y diseño la solución técnica que mejor lo resuelve.",
    },
    {
      title: "Desarrollo Full Stack",
      body: "Cubro frontend, backend y datos: construyo la solución completa, de la interfaz a la base de datos.",
    },
    {
      title: "Comunicación y documentación",
      body: "Documento, explico y colaboro. El mejor código es el que el equipo entiende y puede mantener.",
    },
  ],
} as const;

export interface SkillCategory {
  id: string;
  label: string;
  hint: string;
  items: string[];
}

/** Confirmado por el autor: perfil Full Stack + C# certificado. */
export const skills: SkillCategory[] = [
  {
    id: "frontend",
    label: "Frontend",
    hint: "Interfaces accesibles, rápidas y medibles.",
    items: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
      "Responsive",
      "Accesibilidad",
      "UI / UX",
    ],
  },
  {
    id: "backend",
    label: "Backend",
    hint: "Servicios, reglas de negocio e integraciones.",
    items: [
      "Node.js",
      "Python",
      "C#",
      "APIs REST",
      "Autenticación",
      "Integraciones",
      "Supabase",
    ],
  },
  {
    id: "data",
    label: "Bases de datos",
    hint: "Modelado, consultas y políticas de acceso.",
    items: [
      "SQL",
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Modelado de datos",
      "RLS / políticas de acceso",
    ],
  },
  {
    id: "tools",
    label: "Herramientas",
    hint: "Flujo de trabajo diario.",
    items: ["Git", "GitHub", "Docker", "Postman", "Figma", "Terminal"],
  },
  {
    id: "methods",
    label: "Metodologías",
    hint: "Cómo trabajo en equipo.",
    items: [
      "Scrum",
      "Kanban",
      "Clean Code",
      "Code Review",
      "Documentación",
      "Testing",
    ],
  },
  {
    id: "analysis",
    label: "Análisis y procesos",
    hint: "Del problema al requerimiento.",
    items: [
      "Análisis lógico de problemas",
      "Documentación técnica",
      "Definición de requerimientos",
      "Lógica de programación",
      "Modelado de procesos",
      "Automatización documental",
    ],
  },
];

export interface ExperienceItem {
  role: string;
  company: string;
  location: string;
  type: string;
  start: string;
  /** Fecha de finalización confirmada por el autor. */
  end: string;
  current: boolean;
  summary: string;
  bullets: string[];
  tags: string[];
  /** TODO: confirmar si el inicio fue 07/07/2026 (dato del CV anterior). */
  startPending?: boolean;
}

export const experience: ExperienceItem[] = [
  {
    role: "Desarrollador Full Stack",
    company: "Empire International",
    location: "Chía · Presencial",
    type: "Prácticas técnicas",
    start: "2026-07-07",
    end: "2027-01-07",
    current: true,
    startPending: true,
    summary:
      "Desarrollo de una solución digital para el manejo de inventarios y la automatización documental de la empresa —documentos, actas y paz y salvo— con protocolos de seguridad y políticas de acceso (RLS).",
    bullets: [
      "Solución digital para el manejo de inventarios.",
      "Automatización documental: documentos, actas y paz y salvo.",
      "Protocolos de seguridad y políticas RLS.",
      "Análisis de problemáticas y levantamiento de requerimientos.",
      "Chatbot con IA para consultas y soporte.",
    ],
    tags: [
      "Full Stack",
      "Automatización documental",
      "Seguridad / RLS",
      "Análisis y requerimientos",
      "IA",
    ],
  },
];

export interface Project {
  id: string;
  name: string;
  category: string;
  /** TODO: descripción a cargo del autor. */
  summary: string | null;
  features: string[];
  stack: string[];
  url: string | null;
  repo: string | null;
  image: string | null;
  status: "confirmed" | "pending";
}

/**
 * Proyectos reales. Los enlaces se agregan en `url` / `repo`.
 * Mientras estén en `null`, la interfaz los muestra deshabilitados
 * (nunca inventa una URL).
 */
export const projects: Project[] = [
  {
    id: "pasion-motors",
    name: "Pasión Motors",
    category: "E-commerce · Panel administrativo",
    summary: null,
    features: [],
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Supabase"],
    url: null,
    repo: null,
    image: null,
    status: "pending",
  },
  {
    id: "orion",
    name: "Orion",
    category: "Asistente personal con IA",
    summary: null,
    features: [],
    stack: ["IA", "Control por voz"],
    url: null,
    repo: null,
    image: null,
    status: "pending",
  },
  {
    id: "saltitos",
    name: "Saltitos",
    category: "Juego web y móvil",
    summary: null,
    features: [],
    stack: ["Web", "Móvil", "Game UI"],
    url: "https://saltitos.netlify.app",
    repo: null,
    image: null,
    status: "confirmed",
  },
  {
    id: "maison-aven",
    name: "Maison Aven",
    category: "Landing de producto",
    summary: null,
    features: [],
    stack: ["Next.js", "React", "Tailwind CSS"],
    url: null,
    repo: null,
    image: null,
    status: "pending",
  },
  {
    id: "linfovit",
    name: "Linfovit",
    category: "Tienda online",
    summary: null,
    features: [],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "Mercado Pago"],
    url: null,
    repo: null,
    image: null,
    status: "pending",
  },
  {
    id: "life-os",
    name: "Life OS",
    category: "App personal · PWA",
    summary: null,
    features: [],
    stack: ["React", "TypeScript", "Vite", "Supabase", "PWA"],
    url: null,
    repo: null,
    image: null,
    status: "pending",
  },
  {
    id: "el-parche",
    name: "El Parche",
    category: "PWA de pedidos",
    summary: null,
    features: [],
    stack: ["React", "Vite", "PWA", "ePayco"],
    url: null,
    repo: null,
    image: null,
    status: "pending",
  },
];

export interface Certification {
  id: string;
  name: string;
  /** null = dato pendiente, no se inventa. */
  issuer: string | null;
  date: string | null;
  credentialUrl: string;
}

export const certifications: Certification[] = [
  {
    id: "csharp-ms",
    name: "Foundational C# with Microsoft",
    issuer: "Microsoft",
    date: null,
    credentialUrl:
      "https://drive.google.com/file/d/1QD8r6jx8g7EDBTN2P7uPASHDcCWfq25l/view?usp=drive_link",
  },
  {
    id: "sql-db",
    name: "Desarrollo de Bases de Datos con SQL",
    issuer: null,
    date: null,
    credentialUrl:
      "https://drive.google.com/file/d/1ZRcURgjuyOszuN5j5j33i-tzKoqC7VGC/view?usp=drive_link",
  },
  {
    id: "excel-basico",
    name: "Aplicación de Herramientas Básicas de la Hoja de Cálculo Microsoft Excel",
    issuer: null,
    date: null,
    credentialUrl:
      "https://drive.google.com/file/d/1RNcdj-cnVVSaJJRpaDszckwCVmNKcQ_w/view?usp=drive_link",
  },
  {
    id: "excel-intermedio",
    name: "Manejo Intermedio de la Herramienta de Hojas de Cálculo Excel",
    issuer: null,
    date: null,
    credentialUrl:
      "https://drive.google.com/file/d/18Yvpcf8_Xt1NN7IqmFRB4BYHNUL0JGmO/view?usp=drive_link",
  },
  {
    id: "games-heritage",
    name: "Traditional Games and Cultural Heritage (Bilingual)",
    issuer: null,
    date: null,
    credentialUrl:
      "https://drive.google.com/file/d/1-WjbFXz5xt9ws2o8x38oeagoYz_x6tMK/view?usp=drive_link",
  },
  {
    id: "sql-soporte",
    name: "Soporte Manejo de Base de Datos SQL",
    issuer: null,
    date: null,
    credentialUrl:
      "https://drive.google.com/file/d/1IeWEYjGOV6doV9ryQSokjuOJHgecdizv/view?usp=sharing",
  },
  {
    id: "excel-soporte-basico",
    name: "Soporte de Manejo de Excel Básico",
    issuer: null,
    date: null,
    credentialUrl:
      "https://drive.google.com/file/d/1xxvZ2jxR02q-qAHHgNkhACFqmj4UoPHf/view?usp=sharing",
  },
  {
    id: "excel-soporte-intermedio",
    name: "Soporte de Manejo de Excel Intermedio",
    issuer: null,
    date: null,
    credentialUrl:
      "https://drive.google.com/file/d/1eMFtXvc3EDENVrshSsYoEgz0nJJbT9A-/view?usp=sharing",
  },
];

export interface EducationItem {
  program: string;
  institution: string;
  city: string;
  status: string;
  start: string;
  end: string;
}

/** TODO: formación académica pendiente de confirmar. */
export const education: EducationItem[] = [];

export const contactLinks: ContactLink[] = [
  {
    label: "GitHub",
    value: "Por confirmar",
    href: profile.github,
    status: "pending",
  },
  {
    label: "LinkedIn",
    value: "Por confirmar",
    href: profile.linkedin,
    status: "pending",
  },
  {
    label: "Correo",
    value: profile.email,
    href: `mailto:${profile.email}`,
    status: "confirmed",
  },
];

export const pendingData = {
  identity: ["GitHub", "LinkedIn", "Ciudad / país", "Dominio del portafolio"],
  education: ["Programa", "Institución", "Ciudad", "Fechas", "Estado"],
  certifications: [
    "Institución emisora y fecha de 7 certificaciones",
  ],
  projects: ["Descripciones, capturas y enlaces de los 7 proyectos"],
  cvPdf: "Subir el PDF a /public/cv/Miguel-Borda-CV.pdf",
} as const;
