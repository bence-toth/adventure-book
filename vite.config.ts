import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === "production" ? "/adventure-book/" : "/",
  assetsInclude: ["**/*.yaml", "**/*.yml"],
  resolve: {
    alias: {
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/constants": path.resolve(__dirname, "./src/constants"),
      "@/context": path.resolve(__dirname, "./src/context"),
      "@/data": path.resolve(__dirname, "./src/data"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/__tests__": path.resolve(__dirname, "./src/__tests__"),
    },
  },
});
