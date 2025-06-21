import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
      '@/components': path.resolve(process.cwd(), './src/components'),
      '@/hooks': path.resolve(process.cwd(), './src/hooks'),
      '@/lib': path.resolve(process.cwd(), './src/lib'),
      '@/types': path.resolve(process.cwd(), './src/types'),
      '@/api': path.resolve(process.cwd(), './src/api'),
      '@/pages': path.resolve(process.cwd(), './src/pages'),
    },
  },
})
