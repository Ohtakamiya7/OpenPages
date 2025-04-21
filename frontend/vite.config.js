// frontend/vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  root: '.',                // this is your frontend/ folder, since you cd into it
  plugins: [vue()],
  server: {
    proxy: {
      // any request starting with /api will be forwarded to your backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    }
  },
  build: {
    outDir: '../dist',      // this writes to projectRoot/dist
    emptyOutDir: true,
  },
})
