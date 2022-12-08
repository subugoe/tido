import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { quasar } from '@quasar/vite-plugin';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    quasar({
      sassVariables: 'src/css/quasar.variables.scss',
    }),
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
