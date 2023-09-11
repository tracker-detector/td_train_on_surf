import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: "src/popup/main.tsx",
        background: "src/background/background.ts",
      },
      output: {
        entryFileNames: "[name]/[name].js",
        assetFileNames: "lib/[name].css",
        chunkFileNames: "lib/[name].js",
        esModule: false,
        inlineDynamicImports: false,
      },
    },
  },
});
