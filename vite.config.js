import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // ensure relative asset paths for GitHub Pages
  plugins: [react()],
})
