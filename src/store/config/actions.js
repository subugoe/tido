import BookmarkService from '@/services/bookmark';
import { i18n } from '@/boot/i18n';
import messages from 'src/i18n';

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
  connector: {
    id: 1,
    options: {}
  }
};

export const load = ({ commit, getters }, customConfig) => {
  const defaultConfig = getters.config;

  const { item, manifest, collection, panels, show } = BookmarkService.getQuery();

  // const el = document.getElementById('tido-config');
  if (!customConfig) {
    throw { message: i18n.global.t('no_config_available'), title: i18n.global.t('config_error')};
  }

  // Parse and validate config from HTML
  // try {
  //   customConfig = JSON.parse(el.text);
  // } catch (e) {
  //   throw { message: e, title: i18n.global.t('config_error')};
  // }
  console.log('temp', customConfig);

  const { translations } = customConfig;
  if (translations) {
    const locales = Object.keys(translations);

    locales.forEach(locale => {
      i18n.global.setLocaleMessage(locale, { ...(messages[locale] ? messages[locale] : {}), ...translations[locale]});
    });
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

  console.log('temp2', customConfig);

  // Set entrypoints from URL
  if (isUrl(item)) customConfig.item = item;
  if (isUrl(manifest)) customConfig.manifest = manifest;
  if (isUrl(collection)) customConfig.collection = collection;

  if (customConfig.collection === '' && customConfig.manifest === '' && customConfig.item === '') {
    throw { message: i18n.global.t('noConfigEntrypoint'), title: i18n.global.t('config_error')};
  }

  // Setup panels
  if (customConfig.panels && Array.isArray(customConfig.panels)) {

    // Merge default panel configs with the custom panel configs
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

    const activeViews = customConfig.panels.filter(p => p.views && p.views.length > 0).map(panel => {
      const defaultIndex = panel.views.findIndex(view => view.default === true);
      return defaultIndex > -1 ? defaultIndex : 0;
    });

    // Set active views
    // Get the panels config from URL query
    // If no correct panel or view to choose, set the first available
    const panelsQueryArr = panels ? panels.split(',') : [];
    panelsQueryArr.forEach(panelQuery => {
      const [panelIndex, viewIndex] = panelQuery.split('_').map(i => parseInt(i));

      if (!Number.isInteger(panelIndex)) return;
      let panel = customConfig.panels[panelIndex];
      if (!panel) return;

      if (!Number.isInteger(viewIndex)) return;
      let view = panel.views[viewIndex];
      if (!view) return;

      activeViews[panelIndex] = viewIndex;
    });

    commit('setActiveViews', activeViews);

    // Set visible panels
    const showQueryArr = show ? show.split(',').map(i => parseInt(i)) : [];

    if (showQueryArr.length > 0) {
      customConfig.panels.forEach((panel, i) => customConfig.panels[i].show = false );
    }

    showQueryArr.forEach(panelIndex => {
      if (!Number.isInteger(panelIndex)) return;
      let panel = customConfig.panels[panelIndex];
      if (!panel) return;

      customConfig.panels[panelIndex].show = true;
    });
  }

  const resultConfig = {
    ...defaultConfig,
    ...customConfig
  };

  console.log('temp',resultConfig);

  commit('setConfig', resultConfig);
};

export const setActivePanelView = async ({ commit, getters, dispatch }, {panelIndex, viewIndex}) => {
  commit('setActivePanelView', {panelIndex, viewIndex});
  await BookmarkService.updatePanels(getters.activeViews);
};

export const setShowPanel = ({ commit, getters, dispatch }, { index, show }) => {
  commit('setShowPanel', {index, show});
  const panelIndexes = getters.config.panels.reduce((acc, cur, i) =>  cur.show ? [...acc, i] : acc, []);
  BookmarkService.updateShow(panelIndexes);
};

export const setDefaultActiveViews = async ({ commit, getters }) => {
  const { config } = getters;
  const activeViews = [];

  config.panels.forEach(({ views }, i) => {
    let defaultViewIndex = views.findIndex(view => !!(view.default));
    if (defaultViewIndex > -1) defaultViewIndex = 0;
    activeViews.push(defaultViewIndex);
  });

  await BookmarkService.updatePanels(activeViews);

  commit('config/setActiveViews', activeViews, { root: true});
};
