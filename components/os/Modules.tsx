"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  Check,
  Copy,
  Lock,
  Mail,
  MapPin,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  about,
  certifications,
  education,
  experience,
  profile,
  projects,
  skills,
  type Project,
} from "@/content/cv";
import { cn, formatMonth, formatRange } from "@/lib/format";
import { setModalOpen } from "@/lib/modal-layer";
import { Stagger, StaggerItem, tiltMove, tiltReset } from "./motion";
import type { ModuleId } from "./modules-data";

/* ------------------------------------------------------------------ */
/* Shared                                                              */
/* ------------------------------------------------------------------ */

const cardMotion = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
};

function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "cyan" | "violet";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em]",
        tone === "cyan" &&
          "border-cyan/25 bg-cyan/10 text-cyan",
        tone === "violet" &&
          "border-violet/25 bg-violet/10 text-violet",
        tone === "neutral" && "border-white/10 bg-white/[0.04] text-muted",
      )}
    >
      {children}
    </span>
  );
}

function Spotlight({
  children,
  className,
  onMove,
}: {
  children: React.ReactNode;
  className?: string;
  onMove?: (event: React.MouseEvent<HTMLElement>) => void;
}) {
  const handleMove =
    onMove ??
    ((event: React.MouseEvent<HTMLElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.setProperty(
        "--mx",
        `${event.clientX - rect.left}px`,
      );
      event.currentTarget.style.setProperty(
        "--my",
        `${event.clientY - rect.top}px`,
      );
    });

  return (
    <div
      className={cn("spotlight rounded-2xl", className)}
      onMouseMove={handleMove}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 01 · About                                                          */
/* ------------------------------------------------------------------ */

function AboutModule() {
  const meta = [
    { key: "Rol", value: profile.role },
    { key: "Enfoque", value: "Automatización · APIs · Datos" },
    { key: "Modalidad", value: profile.availability.modes.join(" · ") },
    {
      key: "Idiomas",
      value: profile.languages.map((item) => `${item.name} ${item.level}`).join(" · "),
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <motion.section {...cardMotion}>
        <p className="kicker">Perfil</p>
        <h2 className="display mt-3 text-2xl font-semibold text-ink sm:text-3xl">
          <span className="bg-gradient-to-r from-ink via-cyan/90 to-ink bg-clip-text text-transparent text-shimmer">
            {about.headline}
          </span>
        </h2>
        <div className="mt-4 space-y-3 text-[13.5px] leading-relaxed text-ink/70">
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>

        <dl className="mt-6 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/[0.06] sm:grid-cols-2">
          {meta.map((item) => (
            <div key={item.key} className="bg-[#080c15] px-4 py-3">
              <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                {item.key}
              </dt>
              <dd className="mt-1 text-[12.5px] text-ink/85">{item.value}</dd>
            </div>
          ))}
        </dl>

        {profile.location && (
          <p className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] text-muted">
            <MapPin className="size-3.5" aria-hidden="true" />
            {profile.location}
          </p>
        )}
      </motion.section>

      <Stagger className="grid gap-3 sm:grid-cols-2">
        {about.strengths.map((strength, index) => (
          <StaggerItem key={strength.title} className="h-full">
            <article
              onMouseMove={(event) => tiltMove(event, 8)}
              onMouseLeave={tiltReset}
              className="spotlight glass tilt sheen flex h-full flex-col justify-between rounded-2xl p-4"
            >
              <span className="font-mono text-[10px] text-cyan/70">
                0{index + 1}
              </span>
              <h3 className="mt-6 font-display text-[15px] font-semibold text-ink">
                {strength.title}
              </h3>
              <p className="mt-2 text-[12px] leading-relaxed text-muted">
                {strength.body}
              </p>
            </article>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 02 · Tech stack                                                     */
/* ------------------------------------------------------------------ */

function StackModule() {
  const [selected, setSelected] = useState(skills[0].id);
  const active = skills.find((category) => category.id === selected) ?? skills[0];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {skills.map((category) => {
          const isActive = category.id === active.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelected(category.id)}
              aria-pressed={isActive}
              className={cn(
                "relative rounded-full border px-3.5 py-2 text-[11.5px] transition-colors duration-300",
                isActive
                  ? "border-cyan/40 bg-cyan/10 text-ink"
                  : "border-white/10 bg-white/[0.03] text-muted hover:border-white/20 hover:text-ink",
              )}
            >
              {category.label}
              {isActive && (
                <motion.span
                  layoutId="stack-active"
                  className="absolute inset-0 -z-10 rounded-full bg-cyan/10"
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.section
          key={active.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="mt-5"
        >
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-[12.5px] text-muted">{active.hint}</p>
            <span className="font-mono text-[10px] text-muted/70">
              {String(active.items.length).padStart(2, "0")} tecnologías
            </span>
          </div>

          <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {active.items.map((item, index) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                className="group flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5 transition-colors duration-300 hover:border-cyan/30 hover:bg-cyan/[0.06]"
              >
                <span className="size-1 rounded-full bg-cyan/50 transition-colors group-hover:bg-cyan" />
                <span className="text-[12px] text-ink/85">{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.section>
      </AnimatePresence>

      <p className="mt-6 flex items-start gap-2 rounded-xl border border-white/8 bg-white/[0.02] px-3.5 py-3 font-mono text-[10px] leading-relaxed text-muted">
        <Sparkles className="mt-0.5 size-3.5 shrink-0 text-violet" aria-hidden="true" />
        Sin niveles ni porcentajes: solo tecnologías que uso y puedo defender.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 03 · Experience                                                     */
/* ------------------------------------------------------------------ */

function ExperienceModule() {
  return (
    <div className="relative">
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-gradient-to-b from-cyan/60 via-white/15 to-transparent"
        aria-hidden="true"
      />

      {experience.map((job, index) => (
        <motion.article
          key={`${job.company}-${job.role}`}
          {...cardMotion}
          transition={{ ...cardMotion.transition, delay: index * 0.08 }}
          className="relative pl-8"
        >
          <span
            className="node-pulse absolute left-0 top-1.5 grid size-3.5 place-items-center rounded-full border border-cyan/50 bg-void"
            aria-hidden="true"
          >
            <span className="size-1.5 rounded-full bg-cyan" />
          </span>

          <div
            onMouseMove={(event) => tiltMove(event, 3)}
            onMouseLeave={tiltReset}
            className="glass tilt sheen rounded-2xl p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">
                  {job.role}
                </h3>
                <p className="mt-1 text-[12px] text-muted">
                  {job.company} · {job.location}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge tone={job.current ? "cyan" : "neutral"}>
                  {job.current ? "En curso" : "Finalizado"}
                </Badge>
                <span className="font-mono text-[10px] text-muted/80">
                  {formatRange(job.start, job.end, job.current)}
                </span>
              </div>
            </div>

            <p className="mt-4 text-[13px] leading-relaxed text-ink/70">
              {job.summary}
            </p>

            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {job.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2 text-[12px] text-ink/75">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-cyan/80" aria-hidden="true" />
                  {bullet}
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {job.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </div>

          {job.startPending && (
            <p className="mt-2 pl-1 font-mono text-[9px] text-muted/50">
              Fecha de inicio por confirmar en el CV definitivo.
            </p>
          )}
        </motion.article>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 04 · Projects                                                       */
/* ------------------------------------------------------------------ */

function ProjectPreview({ project }: { project: Project }) {
  const initials = project.name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative h-24 overflow-hidden rounded-xl border border-white/8 bg-[#070b14]">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(53,227,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(53,227,255,0.07) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(61,110,255,0.35),transparent_60%)]" />
      <span className="absolute inset-0 grid place-items-center font-display text-3xl font-semibold text-white/15">
        {initials}
      </span>
      <span className="absolute right-2 top-2 rounded-full border border-white/10 bg-void/60 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.16em] text-muted">
        {project.status === "confirmed" ? "Live" : "Próximamente"}
      </span>
    </div>
  );
}

function ProjectsModule() {
  const [openId, setOpenId] = useState<string | null>(null);
  const openProject = projects.find((project) => project.id === openId) ?? null;

  useEffect(() => {
    if (!openId) return;
    setModalOpen(true);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopImmediatePropagation();
        event.preventDefault();
        setOpenId(null);
      }
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      setModalOpen(false);
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, [openId]);

  return (
    <div>
      <p className="font-mono text-[10px] leading-relaxed text-muted">
        Proyectos reales. Las fichas y enlaces se completan desde{" "}
        <code className="rounded bg-white/5 px-1 py-0.5 text-cyan/80">
          content/cv.ts
        </code>
        .
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, index) => (
          <motion.button
            key={project.id}
            type="button"
            onClick={() => setOpenId(project.id)}
            onMouseMove={(event) => tiltMove(event, 6)}
            onMouseLeave={tiltReset}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.04 }}
            className="spotlight tilt sheen group rounded-2xl border border-white/8 bg-white/[0.03] p-3 text-left transition-colors duration-300 hover:border-cyan/30"
          >
            <ProjectPreview project={project} />
            <div className="mt-3 flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display text-[14px] font-semibold text-ink">
                  {project.name}
                </h3>
                <p className="mt-0.5 text-[11px] text-muted">{project.category}</p>
              </div>
              <ArrowUpRight
                className="mt-0.5 size-4 shrink-0 text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cyan"
                aria-hidden="true"
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {project.stack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-white/8 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[9px] text-muted"
                >
                  {tech}
                </span>
              ))}
              {project.stack.length > 3 && (
                <span className="rounded-md px-1.5 py-0.5 font-mono text-[9px] text-muted/70">
                  +{project.stack.length - 3}
                </span>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {openProject && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setOpenId(null)}
            className="fixed inset-0 z-50 bg-void/75 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            key="sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`project-${openProject.id}`}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="glass-strong fixed right-0 top-0 z-50 flex h-dvh w-full max-w-lg flex-col border-l"
          >
              <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                  Proyecto
                </span>
                <button
                  type="button"
                  autoFocus
                  onClick={() => setOpenId(null)}
                  aria-label="Cerrar ficha del proyecto"
                  className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-muted transition-colors hover:text-ink"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.06 }}
                className="flex-1 overflow-y-auto scroll-slim px-5 py-5"
              >
                <ProjectPreview project={openProject} />

                <h2
                  id={`project-${openProject.id}`}
                  className="display mt-5 text-2xl font-semibold text-ink"
                >
                  {openProject.name}
                </h2>
                <p className="mt-1 text-[12px] text-muted">
                  {openProject.category}
                </p>

                <div className="mt-5">
                  <p className="kicker">Descripción</p>
                  {openProject.summary ? (
                    <p className="mt-2 text-[13px] leading-relaxed text-ink/75">
                      {openProject.summary}
                    </p>
                  ) : (
                    <p className="mt-2 rounded-lg border border-dashed border-white/12 bg-white/[0.02] px-3 py-3 font-mono text-[10px] leading-relaxed text-muted">
                      Ficha en actualización — pendiente de describir en
                      content/cv.ts.
                    </p>
                  )}
                </div>

                {openProject.features.length > 0 && (
                  <div className="mt-5">
                    <p className="kicker">Funcionalidades</p>
                    <ul className="mt-2 grid gap-1.5">
                      {openProject.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-[12px] text-ink/75"
                        >
                          <Check className="mt-0.5 size-3.5 text-cyan/80" aria-hidden="true" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-5">
                  <p className="kicker">Stack</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {openProject.stack.map((tech) => (
                      <Badge key={tech}>{tech}</Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {openProject.url ? (
                    <a
                      href={openProject.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[11.5px] font-semibold text-void"
                    >
                      Ver demo
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-mono text-[10px] text-muted">
                      <Lock className="size-3.5" aria-hidden="true" />
                      Demo no publicada
                    </span>
                  )}

                  {openProject.repo ? (
                    <a
                      href={openProject.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2 text-[11.5px] text-ink/80"
                    >
                      Repositorio
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-mono text-[10px] text-muted">
                      <Lock className="size-3.5" aria-hidden="true" />
                      Repo no publicado
                    </span>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 05 · Education                                                      */
/* ------------------------------------------------------------------ */

function EducationModule() {
  return (
    <div className="space-y-7">
      <section>
        <div className="flex items-center justify-between">
          <p className="kicker">Formación académica</p>
          <Badge>Por confirmar</Badge>
        </div>

        {education.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-dashed border-white/12 bg-white/[0.02] px-4 py-6">
            <p className="font-display text-[14px] text-ink/80">
              Programa, institución, ciudad y fechas pendientes.
            </p>
            <p className="mt-1.5 max-w-lg text-[12px] leading-relaxed text-muted">
              Este espacio está reservado para la formación académica real. No se
              muestra información inventada: se completará cuando esté confirmada.
            </p>
          </div>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {education.map((item) => (
              <article
                key={`${item.program}-${item.institution}`}
                className="glass rounded-2xl p-4"
              >
                <h3 className="font-display text-[14px] text-ink">{item.program}</h3>
                <p className="mt-1 text-[12px] text-muted">
                  {item.institution} · {item.city}
                </p>
                <p className="mt-2 font-mono text-[10px] text-muted/80">
                  {formatMonth(item.start)} — {item.end}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-baseline justify-between">
          <p className="kicker">Certificaciones</p>
          <span className="font-mono text-[10px] text-muted/70">
            {String(certifications.length).padStart(2, "0")} credenciales
          </span>
        </div>

        <Stagger className="mt-3 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
          {certifications.map((cert, index) => (
            <StaggerItem key={cert.id} className="h-full">
              <article
                onMouseMove={(event) => tiltMove(event, 7)}
                onMouseLeave={tiltReset}
                className="spotlight tilt sheen group flex h-full flex-col justify-between rounded-xl border border-white/8 bg-white/[0.03] p-3.5"
              >
              <div>
                <span className="grid size-7 place-items-center rounded-lg border border-cyan/20 bg-cyan/[0.08] font-mono text-[9px] text-cyan">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-[12.5px] font-medium leading-snug text-ink/90">
                  {cert.name}
                </h3>
                {(cert.issuer || cert.date) && (
                  <p className="mt-1.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-muted">
                    {cert.issuer ?? ""}
                    {cert.issuer && cert.date ? " · " : ""}
                    {cert.date ?? ""}
                  </p>
                )}
              </div>

              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-cyan/80 transition-colors hover:text-cyan"
              >
                Ver credencial
                <ArrowUpRight className="size-3" aria-hidden="true" />
              </a>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 06 · Contact                                                        */
/* ------------------------------------------------------------------ */

function ContactModule() {
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState(0);

  // Secuencia de terminal: las líneas aparecen una a una.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(4);
      return;
    }
    const timer = window.setInterval(() => {
      setStep((value) => (value < 4 ? value + 1 : value));
    }, 380);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <motion.section {...cardMotion} className="glass-strong overflow-hidden rounded-2xl">
        <div className="flex items-center gap-2 border-b border-white/8 px-4 py-2.5">
          <span className="size-2 rounded-full bg-[#ff5f57]/70" />
          <span className="size-2 rounded-full bg-[#febc2e]/70" />
          <span className="size-2 rounded-full bg-[#28c840]/70" />
          <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
            ~/contacto
          </span>
        </div>

        <div className="space-y-4 px-4 py-4 font-mono text-[11.5px] leading-relaxed">
          {step >= 1 && (
            <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-cyan">$</span>{" "}
              <span className="text-ink/80">whoami</span>
            </motion.p>
          )}

          {step >= 2 && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-muted"
            >
              {profile.name} — {profile.role}
            </motion.p>
          )}

          {step >= 3 && (
            <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-cyan">$</span>{" "}
              <span className="text-ink/80">cat contacto.json</span>
              <span
                className="caret ml-2 inline-block h-3 w-1.5 translate-y-0.5 bg-cyan/80"
                aria-hidden="true"
              />
            </motion.p>
          )}

          {step >= 4 && (
            <motion.pre
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="overflow-x-auto rounded-lg border border-white/8 bg-void/60 p-3 text-[10.5px] text-muted"
            >
{`{
  "email": "${profile.email}",
  "github": ${profile.github ? `"${profile.github}"` : "null"},
  "linkedin": ${profile.linkedin ? `"${profile.linkedin}"` : "null"}
}`}
            </motion.pre>
          )}

          <div className="flex flex-wrap gap-2 pt-1 font-sans">
            <button
              type="button"
              onClick={copyEmail}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[11.5px] font-semibold text-void transition-transform hover:-translate-y-0.5"
            >
              {copied ? (
                <Check className="size-3.5" aria-hidden="true" />
              ) : (
                <Copy className="size-3.5" aria-hidden="true" />
              )}
              {copied ? "Correo copiado" : "Copiar correo"}
            </button>

            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2.5 text-[11.5px] text-ink/80 transition-colors hover:border-cyan/30 hover:text-ink"
            >
              <Mail className="size-3.5" aria-hidden="true" />
              Escribir correo
            </a>
          </div>

          <p className="sr-only" role="status" aria-live="polite">
            {copied ? "Correo copiado al portapapeles" : ""}
          </p>
        </div>
      </motion.section>

      <div className="grid gap-2.5 content-start">
        {[
          {
            label: "GitHub",
            value: profile.github,
            fallback: "Perfil por confirmar",
          },
          {
            label: "LinkedIn",
            value: profile.linkedin,
            fallback: "Perfil por confirmar",
          },
        ].map((link) =>
          link.value ? (
            <a
              key={link.label}
              href={link.value}
              target="_blank"
              rel="noopener noreferrer"
              className="spotlight flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 transition-colors hover:border-cyan/30"
            >
              <span>
                <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                  {link.label}
                </span>
                <span className="text-[12.5px] text-ink/85">{link.value}</span>
              </span>
              <ArrowUpRight className="size-4 text-cyan/70" aria-hidden="true" />
            </a>
          ) : (
            <div
              key={link.label}
              className="flex items-center justify-between rounded-xl border border-dashed border-white/12 bg-white/[0.02] px-4 py-3"
            >
              <span>
                <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
                  {link.label}
                </span>
                <span className="text-[12px] text-muted">{link.fallback}</span>
              </span>
              <Lock className="size-3.5 text-muted/60" aria-hidden="true" />
            </div>
          ),
        )}

        {profile.cvPdfReady ? (
          <a
            href={profile.cvPdfPath}
            download
            className="rounded-xl border border-cyan/25 bg-cyan/[0.08] px-4 py-3 transition-colors hover:bg-cyan/[0.12]"
          >
            <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-cyan/80">
              Hoja de vida
            </span>
            <span className="text-[12.5px] text-ink">Descargar PDF</span>
          </a>
        ) : (
          <div className="rounded-xl border border-dashed border-white/12 bg-white/[0.02] px-4 py-3">
            <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
              Hoja de vida
            </span>
            <span className="text-[12px] text-muted">
              PDF en preparación
            </span>
          </div>
        )}

        <div className="mt-auto rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted">
            Modalidad
          </p>
          <p className="mt-1 text-[12px] text-ink/80">
            {profile.availability.modes.join(" · ")}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function ModuleContent({ id }: { id: ModuleId }) {
  switch (id) {
    case "about":
      return <AboutModule />;
    case "stack":
      return <StackModule />;
    case "experience":
      return <ExperienceModule />;
    case "projects":
      return <ProjectsModule />;
    case "education":
      return <EducationModule />;
    case "contact":
      return <ContactModule />;
  }
}
