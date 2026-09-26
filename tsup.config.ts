import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts", "src/plugin/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: false,
  terserOptions: {
    compress: {
      passes: 2,
      pure_getters: true,
      unsafe: true,
      unsafe_comps: true,
    },
    mangle: {
      properties: false,
    },
  },
})
