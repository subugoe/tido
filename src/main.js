import { createApp, h } from 'vue';
import { Quasar } from 'quasar';
import createStore from './store';

import {i18n} from './i18n';

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

  const container = this.options?.config?.container || '#app' // default container

  this.mount(container);
};

export default window.Tido;
