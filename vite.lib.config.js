import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import * as path from "node:path";
import pkg from './package.json'
import { injectConfig } from ".build/inject-config.js";
import { removeAttrs } from ".build/remove-attrs.js";
import { removeCssLayers } from ".build/remove-css-layers.js";


const externalDeps = [
  ...Object.keys(pkg.peerDependencies || {})
]


export default defineConfig(({ mode}) => {
  const projectName = process.argv.find(arg => arg.startsWith('--project='))?.split('=')[1] || null;
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      tailwindcss(),
      ...(env.VITE_ENV === 'production' ? [removeAttrs(['data-cy'])] : []),
      injectConfig(projectName),
      removeCssLayers()
    ],
    resolve: {
      alias: {
        src: resolve(__dirname, './src'),
        '@': resolve(__dirname, './src'),
      },
    },
    build: {
      lib: {
        entry: ['src/index.ts'],
        formats: ['es', 'cjs'],
        fileName: (format) => `index.${format}.js`,
        // cssFileName: 'tido.min', // TODO: This does not work, why?
      },
      sourcemap: true,
      rollupOptions: {
        external: externalDeps,
        output: {
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'tido.min.css'
            }
            return '[name][extname]'
          },
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
      }
    },
  }
});
