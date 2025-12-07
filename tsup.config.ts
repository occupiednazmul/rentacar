import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node24',
  outDir: process.env.NODE_ENV === 'production' ? 'api' : 'dist',
  clean: true,
  sourcemap: true,
  dts: false,
  minify: false
})
