import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3016,
    proxy: {
      '/api': {
        target: 'http://localhost:8016',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: 'ws://localhost:8016',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
  },
})
