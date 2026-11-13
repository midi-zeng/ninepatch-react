import { defineConfig } from 'vitest/config'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'NinePatchReact',
      formats: ['es', 'cjs'],
      fileName: format => (format === 'es' ? 'index.js' : 'index.cjs')
    },
    sourcemap: true,
    target: 'es2020',
    rollupOptions: {
      external: [/^ninepatch-core/, /^react($|\/)/, /^react-dom($|\/)/],
      output: { exports: 'named' }
    }
  },
  plugins: [
    dts({
      bundleTypes: true
    })
  ],
  test: {
    environment: 'jsdom',
    include: ['test/**/*.spec.tsx']
  }
})
