import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// base "./" keeps asset paths relative so the build works on GitHub Pages / S3.
export default defineConfig({
  base: "./",
  plugins: [react()],
  test: { environment: "jsdom", globals: true, setupFiles: "./src/test-setup.js" },
});
