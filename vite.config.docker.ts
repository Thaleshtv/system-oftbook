import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    // Configurações para melhor performance em VPN
    hmr: {
      clientPort: 5173,
    },
    watch: {
      usePolling: true,
      interval: 1000,
    },
    // Configurações de proxy para evitar problemas de CORS em desenvolvimento
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Configurações para builds mais estáveis
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['@tanstack/react-router'],
          ui: ['react-icons', 'react-toastify'],
        },
      },
    },
  },
  // Configurações para resolver módulos
  resolve: {
    alias: {
      '@': '/src',
    },
  },
}))