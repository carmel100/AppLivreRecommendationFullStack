import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  server: {
    headers: {
      "Content-Security-Policy": "default-src 'self'; connect-src 'self' https://ton-backend-domaine.com;"
    }
  },
  
  // Pour la version de production (build)
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  }
})