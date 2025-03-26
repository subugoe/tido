import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';
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
function injectProjectConfig(projectName) {
  const config = projectName ? fs.readFileSync(`examples/config/${projectName}.json`, 'utf8') : null;
  return {
    name: 'inject-project-config',
    transformIndexHtml(html) {
      return config ? html.replace('<!-- CONFIG PLACEHOLDER -->', `<script id="config" type="application/json">${config}</script>`) : html;
    }
  }
}


export default defineConfig(() => {
  const projectName = process.argv.find(arg => arg.startsWith('--project='))?.split('=')[1] || null;

  return {
    plugins: [
      react(),
      injectProjectConfig(projectName)
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
  }
});
