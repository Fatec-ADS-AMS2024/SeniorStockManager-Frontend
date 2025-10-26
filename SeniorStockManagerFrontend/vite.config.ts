import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Essa opção deve ser a mesma que a definida em tsconfig.app.json
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
