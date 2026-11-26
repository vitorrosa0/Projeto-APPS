import { defineConfig, configDefaults } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/helpers/setup.ts"],
    exclude: [...configDefaults.exclude, ".next/**"],
    restoreMocks: true,
  },
});
