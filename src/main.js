import { createApp, h } from 'vue';
import PrimeVue from 'primevue/config';
import { createPinia } from 'pinia';
import { i18n } from './i18n';
import App from './App.vue';
import CollectionMetadata from '@/components/metadata/CollectionMetadata.vue';
import ManifestMetadata from '@/components/metadata/ManifestMetadata.vue';
import ItemMetadata from '@/components/metadata/ItemMetadata.vue';

import './css/preflight.scss';
import './css/style.css';
import './css/style.scss';
import { getRGBColor } from '@/utils/color';

import { useToggle } from '@vueuse/core/index';
import { isDark } from '@/utils/is-dark';

function generateId() {
  return Math.random().toString(36).slice(2, 16);
}

window.Tido = function Tido(config = {}) {
  const pinia = createPinia();

  this.config = { ...config };

  this.app = createApp({
    setup() {
      return () => h(App);
    },
  })

  this.app.provide('config', this.config);
  this.app.use(PrimeVue);
  this.app.use(pinia);
  this.app.use(i18n);
  this.app.component('CollectionMetadata', CollectionMetadata);
  this.app.component('ManifestMetadata', ManifestMetadata);
  this.app.component('ItemMetadata', ItemMetadata);

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
      ${this.config.container || '#app'} { ${getRGBColor(this.config.colors?.primary ?? '#3456aa', 'primary')} }
    `;
    containerEl.appendChild(style);

    mounted = true;
  };

  const container = this.config?.container || '#app';

  this.mount(container);

  this.setTheme = (name) => {
    if (!name || name !== 'light' && name !== 'dark') return;
    const toggleDark = useToggle(isDark);

    let darkValue = false;
    if (name === 'dark') darkValue = true;

    toggleDark(darkValue);
  }
};

export default window.Tido;
