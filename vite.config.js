import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
// Source - https://stackoverflow.com/a/76734768
// Posted by alvescleiton
// Retrieved 2025-12-28, License - CC BY-SA 4.0

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [react(), tailwindcss()],
  // base: process.env.VITE_BASE_PATH || "/Movie-App",
})

