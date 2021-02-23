// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js

const path = require('path')

module.exports = function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://quasar.dev/quasar-cli/cli-documentation/boot-files
    boot: [],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: [
      'style.scss'
    ],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    // extras: [],

    // components: [],

    cssAddon: true,

    dark: 'auto', // or Boolean true/false

    // directives: [],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      // Possible values for "all":
      // * 'auto' - Auto-import needed Quasar components & directives
      //            (slightly higher compile time; next to minimum bundle size; most convenient)
      // * false  - Manually specify what to import
      //            (fastest compile time; minimum bundle size; most tedious)
      // * true   - Import everything from Quasar
      //            (not treeshaking Quasar; biggest bundle size; convenient)
      all: 'auto',

      config: {
        brand: {
          primary: '#212121',
          secondary: '#eee',
          accent: '#1a3771'
        },
        notify: {
          color: 'gray'
        }
      },

      iconSet: 'fontawesome-v5',

      lang: 'en-us', // Quasar language pack

      // Quasar plugins
      plugins: [
        'Notify'
      ]
    },

    htmlVariables: {
      title: 'TIDO'
    },

    // https://quasar.dev/quasar-cli/cli-documentation/supporting-ie
    supportIE: false,

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      distDir: 'dist',
      vueRouterMode: 'hash', // available values: 'hash', 'history'
      output: {
        filename: '[name].js',
      },

      // analyze: true,
      // gzip: true,
      // rtl: false, // https://quasar.dev/options/rtl-support
      // showProgress: false,

      // Options below are automatically set depending on the env, set them if you want to override
      // preloadChunks: false,
      extractCSS: false,

      // https://quasar.dev/quasar-cli/cli-documentation/handling-webpack
      extendWebpack (cfg) {
        cfg.output = {
          filename: '[name].js',
        },
        cfg.resolve.alias = {
          ...cfg.resolve.alias, // This adds the existing alias

          '@': path.resolve(__dirname, './src/'),
        },
        cfg.module.rules.push(
          {
            enforce: 'pre',
            exclude: /node_modules/,
            loader: 'eslint-loader',
            options: {
              formatter: require('eslint').CLIEngine.getFormatter('stylish')
            },
            test: /\.(js|vue)$/
          }
        )
      }
    },

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
    devServer: {
      https: false,
      port: 8080,
      open: false // opens browser window automatically
    },

    vendor: {
      disable: false,
    },

    // animations: 'all', // --- includes all animations
    // https://quasar.dev/options/animations
    // animations: [],

    // https://quasar.dev/quasar-cli/developing-ssr/configuring-ssr
    ssr: {
      pwa: false
    },

    // https://quasar.dev/quasar-cli/developing-pwa/configuring-pwa
    pwa: {
      workboxPluginMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
      workboxOptions: {}, // only for GenerateSW
      manifest: {
        name: 'TIDO',
        short_name: 'TIDO',
        description: 'Text vIever for Digital Objects',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
    electron: {
      bundler: 'packager', // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: 'q-app'
      },

      // More info: https://quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: true,

      extendWebpack (cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      }
    }
  }
}
