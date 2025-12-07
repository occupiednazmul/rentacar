import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node24',
  outDir: 'api',
  clean: true,
  sourcemap: true,
  dts: false,
  minify: false
})
