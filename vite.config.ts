import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    assetsInlineLimit: 0,
  },
  server: {
    host: true,
    port: 3000,
  },
  resolve: {
    alias: {
      path: "path-browserify",
    },
  },
});
