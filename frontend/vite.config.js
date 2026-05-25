import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Raise warning threshold slightly; we handle it via manual chunks below
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Charts (large libs)
          'vendor-charts': ['recharts', 'react-circular-progressbar'],
          // Animation
          'vendor-motion': ['framer-motion'],
          // UI utilities
          'vendor-ui': ['axios', 'react-hot-toast', 'react-dropzone', 'lucide-react', 'date-fns'],
        },
      },
    },
  },
})
