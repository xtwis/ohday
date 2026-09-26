import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["test/**/*.test.ts"],
    alias: {
      "@xtwis/ohday/plugin": fileURLToPath(new URL("./src/plugin/index.ts", import.meta.url)),
      "@xtwis/ohday": fileURLToPath(new URL("./src/index.ts", import.meta.url)),
    },
  },
})
