// frontend/vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  root: '.',                // this is your frontend/ folder, since you cd into it
  plugins: [vue()],
  build: {
    outDir: '../dist',      // this writes to projectRoot/dist
    emptyOutDir: true,
    rollupOptions: {
      external: [
        // anything that starts with ../backend/
        /^\.\.\/backend\//
      ]
    }
  },
  optimizeDeps: {
    exclude: [
      // if you ever pre‑bundle deps, ignore your backend folder
      /^\.\.\/backend\//
    ]
  }
})
