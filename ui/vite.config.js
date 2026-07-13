import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: false, // we're using our own public/manifest.json
      includeAssets: ["favicon.ico", "robots.txt", "icons/*.png"],
    }),
  ],
  server: {
    port: 5173,
    host:"0.0.0.0"
  },
});