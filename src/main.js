import { createApp, h } from 'vue';
import { Quasar } from 'quasar';
import createStore from './store';
import { i18n } from './i18n';
import App from './App.vue';

import 'quasar/dist/quasar.sass';
import './css/style.scss';

const clickOutside = {
  beforeMount: (el, binding) => {
    console.log(el);
    el.clickOutsideEvent = (event) => {
      console.log(event.target);
      // here I check that click was outside the el and his children
      if (!(el === event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        binding.value();
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted: (el) => {
    document.removeEventListener('click', el.clickOutsideEvent);
  },
};

window.Tido = function Tido(config = {}) {
  this.config = { ...config };

  const instance = this;
  this.app = createApp({
    render() {
      return h(App);
    },

    data() {
      return {
        config: instance.config,
      };
    },
  });

  this.app.directive('click-outside', clickOutside);
  this.app.use(createStore());
  this.app.use(i18n);

  this.app.use(Quasar, {
    plugins: {},
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

    containerEl.classList.add('tido-container');

    this.app.mount(containerEl);

    mounted = true;
  };

  this.destroy = () => {
    this.app.$destroy();
  };

  const container = this.config?.container || '#app';

  this.mount(container);
};

export default window.Tido;
