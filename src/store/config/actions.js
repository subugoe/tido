import messages from 'src/i18n';
import { isUrl } from '@/utils';
import BookmarkService from '@/services/bookmark';
import { i18n } from '@/i18n';

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
  return !!(value);
}

function validateManifest(value) {
  return !!(value);
}

function validateItem(value) {
  return !!(value);
}

function validateManifestIndex(value) {
  return !!(value);
}

function validateItemIndex(value) {
  return !!(value);
}

function validateTranslations(value) {
  return !!(value) && Object.keys(value).every((key) => key === 'en' || key === 'de');
}

function validatePanels(value) {
  return !!(value) && Array.isArray(value);
}

function validateLang(value) {
  return !!(value);
}

function validateColors(value) {
  return !!(value);
}

function createDefaultActiveViews(panelsConfig) {
  return panelsConfig
    .filter((p) => p.views && p.views.length > 0)
    .map((panel) => {
      const defaultIndex = panel.views.findIndex((view) => view.default === true);
      return defaultIndex > -1 ? defaultIndex : 0;
    })
    .reduce((acc, cur, i) => {
      acc[i] = cur;
      return acc;
    }, {});
}

function discoverCustomConfig(customConfig) {
  const {
    translations, collection, manifest, item, panels, lang, colors,
  } = customConfig;

  return {
    ...(validateCollection(collection) && { collection }),
    ...(validateManifest(manifest) && { manifest }),
    ...(validateItem(item) && { item }),
    ...(validateTranslations(translations) && { translations }),
    ...(validatePanels(panels) && { panels }),
    ...(validateLang(lang) && { lang }),
    ...(validateColors(colors) && { colors }),
  };
}

function discoverUrlConfig() {
  const urlConfig = {};
  let show;
  let panels;
  // 
  //const {
  //  item, manifest, collection, panels, show,
  //} = BookmarkService.getQuery();
  console.log('Url query', BookmarkService.getQuery());
  const urlQuery = BookmarkService.getQuery();
  if ('tido' in urlQuery) {
    const tidoUrlQuery = urlQuery.tido;
    const { manifestIndex, itemIndex} = tidoUrlQuery;
    urlConfig['manifestIndex'] = manifestIndex;
    urlConfig['itemIndex'] = itemIndex;
    show = tidoUrlQuery['show'];
    panels = tidoUrlQuery['panels'];
    
  }
  
  const panelsQueryArr = panels ? panels.split(',') : [];

  // Diese 3 wahrscheinlich sind jetzt obsolete
  //if (isUrl(item)) urlConfig.item = item;
  //if (isUrl(manifest)) urlConfig.manifest = manifest;
  //if (isUrl(collection)) urlConfig.collection = collection;
  
  if (panels) {
    urlConfig.activeViews = panelsQueryArr.reduce((acc, cur) => {
      const [panelIndex, viewIndex] = cur.split('_').map((i) => parseInt(i, 10));

      acc[panelIndex] = viewIndex;
      return acc;
    }, {});
  }

  if (show) urlConfig.show = show ? show.split(',').map((i) => parseInt(i, 10)) : [];
  console.log("Url Config", urlConfig);
  return urlConfig;
}

function discoverDefaultConfig(config) {
  return {
    ...JSON.parse(JSON.stringify(config)),
    activeViews: createDefaultActiveViews(config.panels),
  };
}

export const load = ({ commit, getters }, config) => {
  console.log("Loading the configs");
  const customConfig = discoverCustomConfig(config);
  console.log("CustomConfig", customConfig);
  const urlConfig = discoverUrlConfig();
  console.log("Url config", urlConfig);
  const defaultConfig = discoverDefaultConfig(getters.config);
  console.log("Default config", defaultConfig);

  if (customConfig.panels) {
    // If the custom config provide panels config, we still need to check if it's valid.
    // Here we enhance the potentially missing parts with default panel/view config.
    // Hint: Not to confuse with the "defaultConfig" which provides an out-of-the-box panels setup

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

  const activeViews = urlConfig.activeViews || defaultConfig.activeViews;
  commit('setActiveViews', activeViews);

  if (resultConfig.show && resultConfig.show.length > 0) {
    // Set visible panels
    // First hide all
    resultConfig.panels.map((panel, i) => resultConfig.panels[i].show = false);

    // Next show configured
    resultConfig.show.forEach((panelIndex) => {
      if (!Number.isInteger(panelIndex)) return;
      const panel = resultConfig.panels[panelIndex];
      if (!panel) return;

      resultConfig.panels[panelIndex].show = true;
    });
  }

  if (resultConfig.translations) {
    const locales = Object.keys(resultConfig.translations);

    locales.forEach((locale) => {
      i18n.global.setLocaleMessage(locale, { ...(messages[locale] ? messages[locale] : {}), ...resultConfig.translations[locale] });
    });
  }

  console.log("result Config", resultConfig);
  commit('setConfig', resultConfig);
};

export const setActivePanelView = async ({ commit, getters, dispatch }, { panelIndex, viewIndex }) => {
  console.log("set Active Panel View");
  let activeViews = getters.activeViews;
  console.log("Active views", activeViews);
  commit('setActivePanelView', { panelIndex, viewIndex });
  dispatch('contents/updateActiveView', activeViews, { root: true });
  await BookmarkService.updatePanels(activeViews);
};

export const setShowPanel = ({ commit, getters, dispatch }, { index, show }) => {
  console.log("Set show Panel");
  commit('setShowPanel', { index, show });

  let panelIndexes = getters.config.panels.reduce((acc, cur, i) => (cur.show ? [...acc, i] : acc), []);
  if (panelIndexes.length === getters.config.panels.length) panelIndexes = [];

  dispatch('contents/updatePanelIndexes', panelIndexes, { root: true });
  BookmarkService.updateShow(panelIndexes);
};

export const setContentType = ({ commit, getters }, type) => {
  console.log("Set Content Type");
  const { config } = getters;
  const newConfig = { ...config };

  newConfig.panels[3].views[0].connector.options = { type };
  commit('setConfig', newConfig);
};

export const setDefaultActiveViews = async ({ commit, getters }) => {
  console.log("set Default Active Views");
  const { config } = getters;
  const activeViews = [];
  console.log("default panels", config.panels);
  config.panels.forEach(({ views }, panelIndex) => {
    let defaultViewIndex = views.findIndex((view) => !!(view.default));
    if (defaultViewIndex === -1) defaultViewIndex = 0;
    activeViews[panelIndex] = defaultViewIndex;
  });

  await BookmarkService.updatePanels(activeViews);
  
  commit('config/setActiveViews', activeViews, { root: true });
};
