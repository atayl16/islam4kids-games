import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb for better performance
    sourcemap: false, // Disable sourcemaps in production for smaller bundle
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'dnd-vendor': ['react-dnd', 'react-dnd-html5-backend', 'react-dnd-touch-backend'],
        },
      },
    },
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
