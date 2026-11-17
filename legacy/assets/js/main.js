/* =============================================================
   MIGUEL BORDA · HOJA DE VIDA WEB
   main.js — Interacciones y animaciones
   -------------------------------------------------------------
   01. Utilidades
   02. Navbar (scroll, progreso, menú móvil, enlace activo)
   03. Reveal al hacer scroll
   04. Botones de acción (imprimir CV, copiar correo)
   05. Interacción 3D del elemento gráfico
   06. Enlaces de ejemplo (placeholders)
   ============================================================= */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* -----------------------------------------------------------
     01. Utilidades
     ----------------------------------------------------------- */
  let toastTimer;
  function toast(message) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("is-open");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-open"), 2600);
  }

  /* -----------------------------------------------------------
     02. Navbar
     ----------------------------------------------------------- */
  const nav = $("#nav");
  const progress = $("#nav-progress");
  const burger = $("#nav-burger");
  const menu = $("#nav-menu");

  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    nav.classList.toggle("is-scrolled", y > 24);

    if (progress) {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = docH > 0 ? Math.min(y / docH, 1) : 0;
      progress.style.transform = `scaleX(${ratio})`;
    }
  }

  let raf = null;
  window.addEventListener(
    "scroll",
    () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        onScroll();
        raf = null;
      });
    },
    { passive: true }
  );
  onScroll();

  function closeMenu() {
    if (!menu || !burger) return;
    menu.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Abrir menú");
    document.body.style.overflow = "";
  }

  function openMenu() {
    menu.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Cerrar menú");
  }

  if (burger && menu) {
    burger.addEventListener("click", () => {
      const open = burger.getAttribute("aria-expanded") === "true";
      open ? closeMenu() : openMenu();
    });

    $$("a", menu).forEach((link) => link.addEventListener("click", closeMenu));

    document.addEventListener("click", (e) => {
      if (!menu.classList.contains("is-open")) return;
      if (menu.contains(e.target) || burger.contains(e.target)) return;
      closeMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  // Enlace activo según la sección visible
  const sectionLinks = $$('.nav__menu a[href^="#"]');
  const sections = sectionLinks
    .map((a) => document.getElementById(a.getAttribute("href").slice(1)))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          sectionLinks.forEach((a) =>
            a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`)
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => activeObserver.observe(s));
  }

  /* -----------------------------------------------------------
     03. Reveal al hacer scroll
     ----------------------------------------------------------- */
  const revealEls = $$("[data-reveal]");

  if (!("IntersectionObserver" in window) || prefersReduced) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = parseInt(el.dataset.revealDelay || "0", 10);
          el.style.setProperty("--reveal-delay", `${delay}ms`);
          el.classList.add("is-visible");
          obs.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* -----------------------------------------------------------
     04. Botones de acción
     ----------------------------------------------------------- */
  $$('[data-action="print"]').forEach((btn) =>
    btn.addEventListener("click", () => {
      // Abre el diálogo de impresión: permite "Guardar como PDF" en formato A4.
      window.print();
    })
  );

  $$('[data-action="copy-email"]').forEach((btn) =>
    btn.addEventListener("click", async () => {
      const email = btn.dataset.email || "";
      const label = $(".btn__text", btn) || btn;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          const tmp = document.createElement("textarea");
          tmp.value = email;
          tmp.style.position = "fixed";
          tmp.style.opacity = "0";
          document.body.appendChild(tmp);
          tmp.select();
          document.execCommand("copy");
          document.body.removeChild(tmp);
        }
        if (label.classList.contains("btn__text")) {
          label.textContent = "¡Copiado!";
          setTimeout(() => (label.textContent = "Copiar correo"), 2200);
        }
        toast("Correo copiado al portapapeles");
      } catch (err) {
        toast(email);
      }
    })
  );

  /* -----------------------------------------------------------
     05. Interacción 3D del elemento gráfico (solo escritorio)
     ----------------------------------------------------------- */
  const tiltEl = $("[data-tilt]");
  if (tiltEl && !isTouch && !prefersReduced) {
    const parent = tiltEl.parentElement;
    let frame = null;

    parent.addEventListener("mousemove", (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const rect = parent.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        tiltEl.style.transform = `rotateY(${px * 12}deg) rotateX(${-py * 12}deg)`;
        frame = null;
      });
    });

    parent.addEventListener("mouseleave", () => {
      tiltEl.style.transform = "rotateY(0deg) rotateX(0deg)";
    });
  }

  /* -----------------------------------------------------------
     06. Enlaces de ejemplo (placeholders)
     ----------------------------------------------------------- */
  $$("[data-placeholder-link]").forEach((link) =>
    link.addEventListener("click", (e) => {
      if (link.getAttribute("href") === "#") {
        e.preventDefault();
        toast("Reemplaza este enlace por el de tu proyecto real");
      }
    })
  );

  /* -----------------------------------------------------------
     07. Rotador de especialidad (hero)
     ----------------------------------------------------------- */
  const rotEl = $(".rotator__text");
  if (rotEl) {
    const words = (rotEl.dataset.words || "").split("|").filter(Boolean);
    if (words.length && !prefersReduced) {
      let wi = 0;
      let ci = 0;
      let deleting = false;
      rotEl.textContent = "";
      (function type() {
        const word = words[wi];
        if (!deleting) {
          ci++;
          rotEl.textContent = word.slice(0, ci);
          if (ci === word.length) {
            deleting = true;
            return setTimeout(type, 1700);
          }
          setTimeout(type, 55 + Math.random() * 45);
        } else {
          ci--;
          rotEl.textContent = word.slice(0, ci);
          if (ci === 0) {
            deleting = false;
            wi = (wi + 1) % words.length;
            return setTimeout(type, 320);
          }
          setTimeout(type, 28);
        }
      })();
    } else if (words.length) {
      rotEl.textContent = words[0];
    }
  }

  /* -----------------------------------------------------------
     08. Botones magnéticos (escritorio)
     ----------------------------------------------------------- */
  if (!isTouch && !prefersReduced) {
    const STRENGTH = 0.3;
    const MAXP = 8;
    const clamp = (v) => Math.max(-MAXP, Math.min(MAXP, v));
    $$(".btn").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * STRENGTH;
        const y = (e.clientY - (r.top + r.height / 2)) * STRENGTH;
        btn.style.transform = `translate3d(${clamp(x)}px, ${clamp(y)}px, 0)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* -----------------------------------------------------------
     09. Foco de luz en la sección oscura
     ----------------------------------------------------------- */
  const darkSection = $(".section--dark");
  if (darkSection && !isTouch && !prefersReduced) {
    darkSection.addEventListener("mousemove", (e) => {
      const r = darkSection.getBoundingClientRect();
      darkSection.style.setProperty("--mx", `${e.clientX - r.left}px`);
      darkSection.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
    darkSection.addEventListener("mouseenter", () => darkSection.classList.add("is-lit"));
    darkSection.addEventListener("mouseleave", () => darkSection.classList.remove("is-lit"));
  }

  /* -----------------------------------------------------------
     10. Inclinación 3D de las tarjetas de proyecto
     ----------------------------------------------------------- */
  if (!isTouch && !prefersReduced) {
    $$(".project__media").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty("--ry", `${px * 7}deg`);
        card.style.setProperty("--rx", `${-py * 7}deg`);
      });
      card.addEventListener("mouseleave", () => {
        card.style.setProperty("--ry", "0deg");
        card.style.setProperty("--rx", "0deg");
      });
    });
  }

  /* -----------------------------------------------------------
     11. Mascota esfera amarilla: ojos, expresiones y movimiento
     ----------------------------------------------------------- */
  const mascot = $("#mascot");
  if (mascot) {
    const pupils = $$(".mascot__pupil", mascot);
    const glints = $$(".mascot__glint", mascot);
    const MAX_LOOK = 3.2;
    const NEAR = 155;
    const FAR = 235;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let lookFrame = null;
    let angry = false;
    let forceAngry = false;
    let forceTimer;

    function look() {
      lookFrame = null;
      const r = mascot.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = mx - cx;
      const dy = my - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const f = Math.min(dist / 46, 1);
      const ox = (dx / dist) * f * MAX_LOOK;
      const oy = (dy / dist) * f * MAX_LOOK;
      pupils.forEach((p) => (p.style.transform = `translate(${ox}px, ${oy}px)`));
      glints.forEach((g) => (g.style.transform = `translate(${ox * 0.7}px, ${oy * 0.7}px)`));
      refreshAngry();
    }

    function distanceToCursor() {
      const r = mascot.getBoundingClientRect();
      return Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2));
    }

    // Se enoja por cercanía del cursor o al hacer clic
    function refreshAngry() {
      const should = forceAngry || distanceToCursor() < (angry ? FAR : NEAR);
      if (should === angry) return;
      angry = should;
      mascot.classList.toggle("is-shaking", should);
      mascot.dataset.expression = should ? "angry" : "serious";
    }

    // Mirada curiosa cuando el cursor no se mueve
    function wander() {
      const r = mascot.getBoundingClientRect();
      mx = r.left + r.width / 2 + (Math.random() * 2 - 1) * 70;
      my = r.top + r.height / 2 + (Math.random() * 2 - 1) * 70;
      look();
    }

    if (!isTouch && !prefersReduced) {
      let idleTimer;
      window.addEventListener(
        "mousemove",
        (e) => {
          mx = e.clientX;
          my = e.clientY;
          if (!lookFrame) lookFrame = requestAnimationFrame(look);
          clearTimeout(idleTimer);
          idleTimer = setTimeout(wander, 2600);
        },
        { passive: true }
      );
    }

    // Parpadeo aleatorio
    function blink() {
      mascot.classList.add("is-blinking");
      setTimeout(() => mascot.classList.remove("is-blinking"), 150);
    }

    // Rotación de expresiones
    const expressions = ["serious", "happy", "serious", "serious", "happy", "serious", "surprised"];

    if (!prefersReduced) {
      (function scheduleBlink() {
        setTimeout(() => {
          if (!mascot.matches(":hover")) blink();
          scheduleBlink();
        }, 2400 + Math.random() * 3400);
      })();

      let ei = 0;
      setInterval(() => {
        if (angry || mascot.classList.contains("is-jumping")) return;
        ei = (ei + 1) % expressions.length;
        mascot.dataset.expression = expressions[ei];
      }, 3000);
    }

    mascot.addEventListener("mouseenter", () => {
      if (!angry) mascot.dataset.expression = "happy";
    });

    // Clic: se enoja y salta, luego lleva a Contacto
    mascot.addEventListener("click", () => {
      forceAngry = true;
      refreshAngry();
      mascot.classList.add("is-jumping");
      setTimeout(() => mascot.classList.remove("is-jumping"), 640);
      clearTimeout(forceTimer);
      forceTimer = setTimeout(() => {
        forceAngry = false;
        refreshAngry();
      }, 1600);
      const target = document.getElementById("contacto");
      if (target) target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
    });
  }

  /* -----------------------------------------------------------
     12. Botón volver arriba
     ----------------------------------------------------------- */
  const toTop = $("#to-top");
  if (toTop) {
    const toggleTop = () => toTop.classList.toggle("is-visible", window.scrollY > 700);
    window.addEventListener("scroll", toggleTop, { passive: true });
    toggleTop();
    toTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" })
    );
  }

  /* -----------------------------------------------------------
     Año actual en el footer
     ----------------------------------------------------------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
