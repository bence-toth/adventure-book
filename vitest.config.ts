/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/__tests__/setup.ts",
    environmentOptions: {
      jsdom: {
        resources: "usable",
      },
    },
    // Use forked processes for test isolation with jsdom environment
    // singleFork: true runs all tests in one forked process for better performance
    // while maintaining isolation from the main process. This is recommended for
    // jsdom environments and helps avoid potential memory leaks and context issues.
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    coverage: {
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/*.config.*",
        "**/__tests__/**",
        "**/*.test.{ts,tsx}",
        "**/testUtils.tsx",
        "**/setup.ts",
      ],
    },
  },
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
