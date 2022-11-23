// FILE: vite.config.js

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import jsconfigPaths from 'vite-jsconfig-paths';
import { resolve } from 'path';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),

    quasar({
      sassVariables: 'src/css/quasar.variables.scss',
    }),
    jsconfigPaths(),
    cssInjectedByJsPlugin(),
  ],
  resolve: {
    alias: {
      src: resolve(__dirname, './src'),
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: 'tido.js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
  ssr: {
    ssrPwaHtmlFilename: 'offline.html', // do NOT use index.html as name!
    // will mess up SSR

    pwa: false,

    /**
     * Manually serialize the store state and provide it yourself
     * as window.__INITIAL_STATE__ to the client-side (through a <script> tag)
     * (Requires @quasar/app-vite v1.0.0-beta.14+)
     */
    manualStoreSerialization: false,

    /**
     * Manually inject the store state into ssrContext.state
     * (Requires @quasar/app-vite v1.0.0-beta.14+)
     */
    manualStoreSsrContextInjection: false,

    /**
     * Manually handle the store hydration instead of letting Quasar CLI do it.
     * For Pinia: store.state.value = window.__INITIAL_STATE__
     * For Vuex: store.replaceState(window.__INITIAL_STATE__)
     */
    manualStoreHydration: false,

    /**
     * Manually call $q.onSSRHydrated() instead of letting Quasar CLI do it.
     * This announces that client-side code should takeover.
     */
    manualPostHydrationTrigger: false,

    prodPort: 3000, // The default port that the production server should use
    // (gets superseded if ({}).PORT is specified at runtime)

    middlewares: [
      'render', // keep this as last one
    ],
  },
  pwa: {
    workboxMode: 'generateSW', // or 'injectManifest'
    injectPwaMetaTags: true,
    swFilename: 'sw.js',
    manifestFilename: 'manifest.json',
    useCredentialsForManifestTag: false,
    extendGenerateSWOptions(cfg) {},

    extendInjectManifestOptions(cfg) {},

    extendManifestJson(json) {},

    extendPWACustomSWConf(esbuildConf) {},
  },
  electron: {
    bundler: 'packager', // or 'builder'

    packager: {
      //...https://electron.github.io/electron-packager/main/
    },

    builder: {
      // electron-builder options
      // https://www.electron.build/configuration/configuration
    },
  },
});
