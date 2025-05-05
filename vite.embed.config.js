import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import fs from 'fs';
import react from '@vitejs/plugin-react'
import * as path from "node:path";
import { injectConfig } from ".build/inject-config.js";
import { removeAttrs } from ".build/remove-attrs.js";


export default defineConfig(({ mode}) => {
  const projectName = process.argv.find(arg => arg.startsWith('--project='))?.split('=')[1] || null;
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      ...(env.VITE_ENV === 'production' ? [removeAttrs(['data-cy'])] : []),
      injectConfig(projectName)
    ],
    resolve: {
      alias: {
        src: resolve(__dirname, './src'),
        '@': resolve(__dirname, './src'),
      },
    },
    build: {
      emptyOutDir: false,
      cssCodeSplit: true,
      rollupOptions: {
        input: path.resolve(__dirname, 'src/index.embed.tsx'),
        output: {
          entryFileNames: 'tido.min.js',
          assetFileNames: 'tido.min.[ext]',
        },
      },
    },
  }
});
