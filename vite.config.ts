import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // <-- NEW
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()], // <-- tailwindcss() is NEW
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
