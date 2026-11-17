import {
  BriefcaseBusiness,
  FolderKanban,
  GraduationCap,
  Layers,
  Mail,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ModuleMeta {
  id: string;
  index: string;
  label: string;
  short: string;
  hint: string;
  icon: LucideIcon;
}

export const MODULES = [
  {
    id: "about",
    index: "01",
    label: "About Me",
    short: "Perfil",
    hint: "Quién soy y cómo pienso el software.",
    icon: User,
  },
  {
    id: "stack",
    index: "02",
    label: "Tech Stack",
    short: "Stack",
    hint: "Tecnologías reales, sin porcentajes inventados.",
    icon: Layers,
  },
  {
    id: "experience",
    index: "03",
    label: "Experience",
    short: "Experiencia",
    hint: "Línea de tiempo profesional.",
    icon: BriefcaseBusiness,
  },
  {
    id: "projects",
    index: "04",
    label: "Projects",
    short: "Proyectos",
    hint: "Productos que puedo mostrar y defender.",
    icon: FolderKanban,
  },
  {
    id: "education",
    index: "05",
    label: "Education",
    short: "Formación",
    hint: "Títulos y certificaciones verificables.",
    icon: GraduationCap,
  },
  {
    id: "contact",
    index: "06",
    label: "Contact",
    short: "Contacto",
    hint: "Hablemos de tu equipo o proyecto.",
    icon: Mail,
  },
] as const satisfies readonly ModuleMeta[];

export type ModuleId = (typeof MODULES)[number]["id"];
