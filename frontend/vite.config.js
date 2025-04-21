// frontend/vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  root: '.',                // treat frontend/ as the project root
  plugins: [vue()],
  build: {
    outDir: '../dist',      // wherever you want to drop the built files
    emptyOutDir: true,
    rollupOptions: {
      // anything outside ./frontend will be left alone
      external: [
        '../backend/*'
      ]
    }
  },
  optimizeDeps: {
    // don’t even try to pre‑bundle your backend
    exclude: [
      '../backend/*'
    ]
  }
})
