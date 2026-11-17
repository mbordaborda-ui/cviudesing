import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { profile } from "@/content/cv";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Miguel Borda — ENTER MIGUEL'S WORLD",
    template: "%s · Miguel Borda",
  },
  description:
    "Portafolio interactivo de Miguel Borda, Desarrollador de Software Full Stack enfocado en automatización y solución de procesos.",
  keywords: [
    "Miguel Borda",
    "desarrollador full stack",
    "automatización de procesos",
    "portafolio",
    "desarrollo web",
    "APIs",
    "SQL",
    "React",
    "C#",
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "ENTER MIGUEL'S WORLD",
    title: "Miguel Borda — Desarrollador de Software Full Stack",
    description: profile.tagline,
    // TODO: agregar url + imagen OG 1200x630 en PNG cuando exista el dominio.
  },
  twitter: {
    card: "summary_large_image",
    title: "Miguel Borda — Desarrollador Full Stack",
    description: profile.tagline,
  },
  // TODO: canonical cuando exista dominio final.
};

export const viewport: Viewport = {
  themeColor: "#04060b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  knowsAbout: [
    "Desarrollo Full Stack",
    "Automatización de procesos",
    "APIs REST",
    "Bases de datos SQL",
    "C#",
    "React",
    "Next.js",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable}`}
    >
      <body>
        {children}
        <script
          type="application/ld+json"
          // JSON-LD estático y controlado (sin datos de usuario).
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
