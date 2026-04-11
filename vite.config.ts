import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/docx')) {
            return 'docx'
          }

          if (id.includes('node_modules/@react-pdf') || id.includes('node_modules/@fontsource')) {
            return 'pdf-runtime'
          }
        },
      },
    },
  },
})
