import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const isCI = !!process.env.CI;
const isReplit = !!process.env.REPL_ID && !isCI;

let port = 3000;

if (isReplit) {
  const rawPort = process.env.PORT;
  if (!rawPort) throw new Error("PORT environment variable is required but was not provided.");
  port = Number(rawPort);
  if (Number.isNaN(port) || port <= 0) throw new Error(`Invalid PORT value: "${rawPort}"`);

  if (!process.env.BASE_PATH) throw new Error("BASE_PATH environment variable is required but was not provided.");
} else {
  const rawPort = process.env.PORT;
  if (rawPort) port = Number(rawPort);
}

const replitPlugins = async () => {
  if (!isReplit) return [];
  const plugins = [];
  try {
    const errorOverlay = await import("@replit/vite-plugin-runtime-error-modal");
    plugins.push(errorOverlay.default());
  } catch {}
  if (process.env.NODE_ENV !== "production") {
    try {
      const cartographer = await import("@replit/vite-plugin-cartographer");
      plugins.push(cartographer.cartographer({ root: path.resolve(import.meta.dirname, "..") }));
    } catch {}
    try {
      const devBanner = await import("@replit/vite-plugin-dev-banner");
      plugins.push(devBanner.devBanner());
    } catch {}
  }
  return plugins;
};

export default defineConfig({
  base: isReplit ? (process.env.BASE_PATH || "/") : "/AzulejOS/",
  plugins: [
    react(),
    tailwindcss(),
    ...(await replitPlugins()),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
