import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react'
import * as path from "node:path";
import { injectConfig } from ".build/inject-config.js";
import { removeAttrs } from ".build/remove-attrs.js";
import tailwindcss from "@tailwindcss/vite";
import { renameCssLayers } from ".build/rename-css-layers.js";



export default defineConfig(({ mode}) => {
  const projectName = process.argv.find(arg => arg.startsWith('--project='))?.split('=')[1] || null;
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      tailwindcss(),
      ...(env.VITE_ENV === 'production' ? [removeAttrs(['data-cy'])] : []),
      injectConfig(projectName),
      renameCssLayers()
    ],
    resolve: {
      alias: {
        src: resolve(__dirname, './src'),
        '@': resolve(__dirname, './src'),
      },
    },
    build: {
      emptyOutDir: false,
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
