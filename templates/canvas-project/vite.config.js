import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { canvasPlugin } from '@lopezleandro03/canvas-engine/vite'

export default defineConfig({
  plugins: [
    react(),
    canvasPlugin(),
  ],
})
