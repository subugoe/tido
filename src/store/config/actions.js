import BookmarkService from '@/services/bookmark';
import { i18n } from '@/boot/i18n';

function isUrl(str) {
  let url;
  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

const defaultPanel = {
  label: "Panel",
  show: true,
  toggle: true,
  views: []
};

const defaultView = {
  id: "view",
  name: "View",
  default: false,
  active: false,
  connector: {
    id: 1,
    options: {}
  }
};

export const load = ({ commit, getters }) => {
  const defaultConfig = getters.config;
  let customConfig = {};

  const { item, manifest, collection, panels } = BookmarkService.getQuery();

  const el = document.getElementById('tido-config');
  if (!el) {
    throw { message: i18n.global.t('noConfigMessage'), title: i18n.global.t('noConfigTitle')};
  }

  // Parse and validate config from HTML
  try {
    customConfig = JSON.parse(el.text);
  } catch (e) {
    throw { message: e, title: i18n.global.t('noConfigTitle')};
  }

  if (customConfig.collection && !isUrl(customConfig.collection)) {
    customConfig.collection = '';
  }

  if (customConfig.manifest && !isUrl(customConfig.manifest)) {
    customConfig.manifest = '';
  }

  if (customConfig.item && !isUrl(customConfig.item)) {
    customConfig.item = '';
  }

  // Set entrypoints from URL
  if (isUrl(item)) customConfig.item = item;
  if (isUrl(manifest)) customConfig.manifest = manifest;
  if (isUrl(collection)) customConfig.collection = collection;

  if (customConfig.collection === '' && customConfig.manifest === '' && customConfig.item === '') {
    throw { message: i18n.global.t('noConfigEntrypoint'), title: i18n.global.t('noConfigTitle')};
  }

  // Setup panels
  if (customConfig.panels && Array.isArray(customConfig.panels)) {
    customConfig.panels = customConfig.panels.map((panel, i) => {
      if (panel.views) {
        panel.views = panel.views.map((view, j) => ({
          ...defaultView,
          ...view
        }));
      }

      return {
        ...defaultPanel,
        ...panel
      }
    });

    // Set active views
    // Get the panels config from URL query
    // If no correct panel or view to choose, set the first available
    const panelsQueryArr = panels ? panels.split(',') : [];
    panelsQueryArr.forEach(panelQuery => {
      const [panelIndex, viewIndex] = panelQuery.split('_');

      if (panelIndex) {
        let panel = customConfig.panels[parseInt(panelIndex)];
        if (!panel) panel = customConfig.panels[0];
        if (!panel) return;

        let view = panel.views[parseInt(viewIndex)];
        if (!view) view = panel.views[0];
        if (!view) return;

        view.active = true;
      }
    });
  }

  const resultConfig = {
    ...defaultConfig,
    ...customConfig
  };

  commit('setConfig', resultConfig);
};

export const setActivePanelView = ({ commit, getters }, {panelIndex, viewIndex}) => {
  commit('setActivePanelView', { panelIndex, viewIndex } );
};

export const resetInitialized = ({ commit }) => {
  commit('resetInitialized');
};

