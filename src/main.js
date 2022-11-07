// FILE: main.js

import { createApp, h } from 'vue';
import { Quasar } from 'quasar';
import { createI18n } from 'vue-i18n';
import createRouter from './router';
import createStore from './store';

import messages from './i18n';

// Import icon libraries
import '@quasar/extras/bootstrap-icons/bootstrap-icons.css';

// Import Quasar css
// We load Quasar stylesheet file
import 'quasar/dist/quasar.sass';
import 'quasar/src/css/flex-addon.sass';
import './css/style.scss';

import App from './App.vue';

window.Tido = function Tido(options = {}) {
  const defaultOptions = {};

  this.options = { ...defaultOptions, ...options };

  let readyPromise = null;
  this.ready = new Promise((resolve, reject) => {
    readyPromise = { resolve, reject };
  });

  const instance = this;
  this.app = createApp({
    render() {
      return h(App);
    },

    data() {
      return {
        config: instance.options.config,
      };
    },
  });

  const i18n = createI18n({
    locale: 'en-US',
    fallbackLocale: 'en-us',
    messages,
    silentTranslationWarn: true,
    warnHtmlInMessage: 'off',
  });

  this.app.use(createRouter());
  this.app.use(createStore());
  this.app.use(i18n);

  this.app.use(Quasar, {
    plugins: {}, // import Quasar plugins and add here
  });

  let mounted = false;
  this.mount = (container) => {
    if (mounted) {
      throw new Error('Tido is already mounted');
    }

    const containerEl = typeof container === 'string'
      ? document.querySelector(container)
      : container;

    if (!containerEl) {
      throw new Error('Container element not found');
    }

    this.app.mount(containerEl);

    mounted = true;
  };

  this.destroy = () => {
    this.app.$destroy();
  };

  if (this.options.container) {
    this.mount(this.options.container);
  }
};

export default window.Tido;
