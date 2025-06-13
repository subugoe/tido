import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import * as path from "node:path";
import pkg from './package.json'
import { injectConfig } from ".build/inject-config.js";
import { removeAttrs } from ".build/remove-attrs.js";
import {createPlainTidoCss} from ".build/create-plain-tido-css.js";


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
      {
        name: 'produce-plain-tido-css',
        closeBundle() {createPlainTidoCss()}
      }
    ],
    resolve: {
      alias: {
        src: resolve(__dirname, './src'),
        '@': resolve(__dirname, './src'),
      },
    },
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/index.ts'),
        name: 'Tido',
        formats: ['es', 'cjs'],
        fileName: (format) => `index.${format}.js`,
      },
      sourcemap: true,
      rollupOptions: {
        external: externalDeps,
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
      }
    },
    cssCodeSplit: true,
  }
});
