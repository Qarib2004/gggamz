import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import 'dotenv/config'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@client': '/src/client',
      '@server': '/src/server',
      '@shared': '/src/shared'
    }
  },
  define: {
    'import.meta.env.VITE_SERVER_URL': JSON.stringify(process.env.VITE_SERVER_URL)
  },
  server: {
    port: 3001,
    proxy: {
      '/api': process.env.SERVER_URL || 'http://localhost:4200'
    }
  }
})