import messages from 'src/i18n';
import BookmarkService from '@/services/bookmark';
import { i18n } from '@/boot/i18n';

function isUrl(str) {
  if (!str) return false;

  let url;
  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}

const defaultPanel = {
  label: 'Panel',
  show: true,
  toggle: true,
  views: [],
};

const defaultView = {
  id: 'view',
  name: 'View',
  default: false,
  connector: {
    id: 1,
    options: {},
  },
};

function validateCollection(value) {
  return isUrl(value);
}

function validateManifest(value) {
  return isUrl(value);
}

function validateItem(value) {
  return isUrl(value);
}

function validateTranslations(value) {
  return !!(value) && Object.keys(value).every((key) => key === 'en' || key === 'de');
}

function validatePanels(value) {
  return !!(value) && Array.isArray(value);
}

function createDefaultActiveViews(panelsConfig) {
  return panelsConfig.filter((p) => p.views && p.views.length > 0).map((panel) => {
    const defaultIndex = panel.views.findIndex((view) => view.default === true);
    return defaultIndex > -1 ? defaultIndex : 0;
  });
}

function discoverCustomConfig() {
  let customConfig = {};

  const el = document.getElementById('tido-config');

  // Parse and validate config from HTML
  try {
    customConfig = JSON.parse(el.text);
  } catch (e) {
    // throw { message: e, title: i18n.global.t('config_error') };
  }

  const {
    translations, collection, manifest, item, panels,
  } = customConfig;

  return {
    ...(validateCollection(collection) && { collection }),
    ...(validateManifest(manifest) && { manifest }),
    ...(validateItem(item) && { item }),
    ...(validateTranslations(translations) && { translations }),
    ...(validatePanels(panels) && { panels }),
  };
  //
  // if (collection === '' && customConfig.manifest === '' && customConfig.item === '') {
  //   throw { message: i18n.global.t('noConfigEntrypoint'), title: i18n.global.t('config_error') };
  // }
  //
  // return customConfig;
}

function discoverUrlConfig() {
  const urlConfig = {};
  const {
    item, manifest, collection, panels, show,
  } = BookmarkService.getQuery();

  const panelsQueryArr = panels ? panels.split(',') : [];

  if (isUrl(item)) urlConfig.item = item;
  if (isUrl(manifest)) urlConfig.manifest = manifest;
  if (isUrl(collection)) urlConfig.collection = collection;
  if (panels) {
    urlConfig.activeViews = panelsQueryArr.reduce((acc, cur) => {
      const [panelIndex, viewIndex] = cur.split('_').map((i) => parseInt(i, 10));
      // if (!Number.isInteger(panelIndex)) return;
      // const panel = customConfig.panels[panelIndex];
      // if (!panel) return;
      //
      // if (!Number.isInteger(viewIndex)) return;
      // const view = panel.views[viewIndex];
      // if (!view) return;

      acc[panelIndex] = viewIndex;
      return acc;
    }, {});
  }
  if (show) urlConfig.show = show ? show.split(',').map((i) => parseInt(i, 10)) : [];

  return urlConfig;
}

function discoverDefaultConfig(config) {
  return {
    ...config,
    activeViews: createDefaultActiveViews(config.panels)
  };
}

export const load = ({ commit, getters }) => {
  const customConfig = discoverCustomConfig();
  const urlConfig = discoverUrlConfig();
  const defaultConfig = discoverDefaultConfig(getters.config);

  // Merge in order: default, custom, url

  // Merge default panel configs with the custom panel configs
  if (customConfig.panels) {
    customConfig.panels = customConfig.panels.map((panel) => {
      if (panel.views) {
        panel.views = panel.views.map((view) => ({
          ...defaultView,
          ...view,
        }));
      }

      return {
        ...defaultPanel,
        ...panel,
      };
    });
  }

  const resultConfig = {
    ...defaultConfig,
    ...customConfig,
    ...urlConfig,
  };

  commit('setConfig', resultConfig);

  if (resultConfig.translations) {
    const locales = Object.keys(resultConfig.translations);

    locales.forEach((locale) => {
      i18n.global.setLocaleMessage(locale, { ...(messages[locale] ? messages[locale] : {}), ...resultConfig.translations[locale] });
    });
  }

  const activeViews = urlConfig.activeViews || createDefaultActiveViews(resultConfig.panels);
  commit('setActiveViews', activeViews);

  // Set visible panels
  // if (resultConfig.show && resultConfig.show.length > 0) {
  //   resultConfig.panels.forEach((panel, i) => customConfig.panels[i].show = false);
  // }
  //
  // resultConfig.show.forEach((panelIndex) => {
  //   if (!Number.isInteger(panelIndex)) return;
  //   const panel = resultConfig.panels[panelIndex];
  //   if (!panel) return;
  //
  //   resultConfig.panels[panelIndex].show = true;
  // });
};

export const setActivePanelView = async ({ commit, getters }, { panelIndex, viewIndex }) => {
  commit('setActivePanelView', { panelIndex, viewIndex });
  await BookmarkService.updatePanels(getters.activeViews);
};

export const setShowPanel = ({ commit, getters }, { index, show }) => {
  commit('setShowPanel', { index, show });

  let panelIndexes = getters.config.panels.reduce((acc, cur, i) => (cur.show ? [...acc, i] : acc), []);
  if (panelIndexes.length === getters.config.panels.length) panelIndexes = [];

  BookmarkService.updateShow(panelIndexes);
};

export const setDefaultActiveViews = async ({ commit, getters }) => {
  const { config } = getters;
  const activeViews = [];

  config.panels.forEach(({ views }) => {
    let defaultViewIndex = views.findIndex((view) => !!(view.default));
    if (defaultViewIndex === -1) defaultViewIndex = 0;
    activeViews.push(defaultViewIndex);
  });

  await BookmarkService.updatePanels(activeViews);

  commit('config/setActiveViews', activeViews, { root: true });
};
