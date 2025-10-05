import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@fleet/api': path.resolve(__dirname, '../../packages/api/src'),
      '@fleet/utils': path.resolve(__dirname, '../../packages/utils/src'),
      '@fleet/ui': path.resolve(__dirname, '../../packages/ui/src'),
    },
  },
})
