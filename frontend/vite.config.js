import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://real-estate-management-system-rh4j.onrender.com",
        changeOrigin: true,
      },
    },
  },
});
