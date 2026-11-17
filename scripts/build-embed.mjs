import { build } from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outfile = path.resolve(
  root,
  "..",
  "PROYECTOMIGUELBORDA",
  "assets",
  "js",
  "laptop-3d.js",
);

await build({
  entryPoints: [path.join(root, "embed", "laptop-embed.tsx")],
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2020",
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  alias: { "@": root },
  outfile,
  logLevel: "info",
});
