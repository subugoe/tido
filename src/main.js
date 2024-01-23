import { createApp, h } from 'vue';
import { Quasar } from 'quasar';
import createStore from './store';
import { i18n } from './i18n';
import App from './App.vue';

// import 'quasar/dist/quasar.sass';
import './css/style.css';
import { getRGBColor } from '@/utils/color';

function generateId() {
  return Math.random().toString(36).slice(2, 16);
}

window.Tido = function Tido(config = {}) {
  this.config = { ...config };

  this.app = createApp({
    setup() {
      return () => h(App);
    },
  });
  this.app.provide('config', this.config);

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

    const instanceId = generateId();
    this.app.provide('instanceId', instanceId);

    const style = document.createElement('style');

    style.id = instanceId;
    style.innerHTML = `
      ${this.config.container} { ${getRGBColor(this.config.colors.primary, 'primary')} }
    `;
    containerEl.appendChild(style);

    mounted = true;
  };

  this.destroy = () => {
    this.app.$destroy();
  };

  const container = this.config?.container || '#app';

  this.mount(container);
};

export default window.Tido;
