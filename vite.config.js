import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import fs from 'fs';
import react from '@vitejs/plugin-react'

function removeAttributes(attributes = []) {
  return {
    name: 'remove-attributes',
    enforce: 'post',
    transform(code, id) {
      if (id.endsWith('.js') || id.endsWith('.tsx') || id.endsWith('.jsx')) {
        const regex = new RegExp(`\(${attributes.join('|')})`, 'g');
        return code.replace(regex, '');
      }
      return code;
    },
  }
}

function injectProjectConfig(projectName) {
  const config = projectName ? fs.readFileSync(`examples/config/${projectName}.json`, 'utf8') : null;
  return {
    name: 'inject-project-config',
    transformIndexHtml(html) {
      return config ? html.replace('<!-- CONFIG PLACEHOLDER -->', `<script id="config" type="application/json">${config}</script>`) : html;
    }
  }
}


export default defineConfig(({ mode}) => {
  const projectName = process.argv.find(arg => arg.startsWith('--project='))?.split('=')[1] || null;
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
      ...(env.VITE_ENV === 'production' ? [removeAttributes(['data-cy'])] : []),
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
