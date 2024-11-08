import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      src: resolve(__dirname, './src'),
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: 'tido.js',
        assetFileNames: 'tido.[ext]',
      },
    },
  },
});
