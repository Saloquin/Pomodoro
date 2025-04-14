import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Pomodoro/',
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  optimizeDeps: {
    include: ['@fortawesome/fontawesome-free']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          fontawesome: ['@fortawesome/fontawesome-free']
        }
      }
    }
  }
})
