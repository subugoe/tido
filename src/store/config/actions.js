import messages from 'src/i18n';
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
  const urlQuery = BookmarkService.getQuery();

  console.log('url Query in discoverUrlConfig', urlQuery);

  // split the url based on '_'
  // get the part of attribute: get the attribute name and the value based on the type of attribute
  // add each attribute to UrlConfig as key value

  let m;
  let i;
  let p;
  let s;

  const arrayAttributes = urlQuery.split('_');
  const manifestPart = arrayAttributes.find((element) => element.includes('m')); // index of manifest part in the splitted array
  const itemPart = arrayAttributes.find((element) => element.includes('i'));
  const panelsPart = arrayAttributes.find((element) => element.includes('p'));
  const showPart = arrayAttributes.find((element) => element.includes('s'));

  // reg expression for 'manifest index part':  /\m\\d{+}
  const reManifest = /\m\d+/;
  const reItem = /i\d+/;
  const rePanels = /p(\d{1}\.\d{1}\-){3,4}\d{1}\.\d{1}/;
  const reShow = /s(\d\-){0,2}\d{1}/;

  if (manifestPart !== undefined) m = reManifest.exec(manifestPart) !== null ? parseInt(manifestPart.slice(1), 10) : undefined;
  if (itemPart !== undefined) i = reItem.exec(itemPart) !== null ? parseInt(itemPart.slice(1), 10) : undefined;
  if (panelsPart !== undefined) p = rePanels.exec(panelsPart) !== null ? panelsPart.slice(1) : undefined;
  if (showPart !== undefined) s = reShow.exec(showPart) !== null ? showPart.slice(1).split('-') : undefined;
  console.log('s', s);
  if (s !== undefined) s = s.map(Number);

  if (m !== undefined) urlConfig.m = m;
  if (i !== undefined) urlConfig.i = i;
  if (p !== undefined) urlConfig.p = p;
  if (s === undefined) urlConfig.s = [0, 1, 2, 3];
  else {
    urlConfig.s = s;
  }
  console.log('url Config in discoverUrlConfig()', urlConfig);
  // eslint-disable-next-line no-shadow
  //urlConfig.s = s;    //? s.split(',').map((i) => parseInt(i, 10)) : [];
  const panels = p;
  const panelsQueryArr = panels ? panels.split('-') : [];

  if (panels) {
    urlConfig.activeViews = panelsQueryArr.reduce((acc, cur) => {
      // eslint-disable-next-line no-shadow
      const [panelIndex, viewIndex] = cur.split('.').map((i) => parseInt(i, 10));

      acc[panelIndex] = viewIndex;
      return acc;
    }, {});
  }

  return urlConfig;
}

function discoverDefaultConfig(config) {
  return {
    ...JSON.parse(JSON.stringify(config)),
    activeViews: createDefaultActiveViews(config.panels),
  };
}

export const load = ({ commit, getters }, config) => {
  const customConfig = discoverCustomConfig(config);
  const urlConfig = discoverUrlConfig();
  const defaultConfig = discoverDefaultConfig(getters.config);

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

  commit('setConfig', resultConfig);
};

export const setActivePanelView = async ({ commit, getters }, { panelIndex, viewIndex }) => {
  const { activeViews } = getters;
  commit('setActivePanelView', { panelIndex, viewIndex });
  await BookmarkService.updatePanels(activeViews);
};

export const setShowPanel = ({ commit, getters }, { index, show }) => {
  commit('setShowPanel', { index, show });
  
  let panelIndexes = getters.config.panels.reduce((acc, cur, i) => (cur.show ? [...acc, i] : acc), []);
  if (panelIndexes.length === getters.config.panels.length) panelIndexes = [];
  console.log('Panel indexes in setShowPanel', panelIndexes);
  BookmarkService.updateShow(panelIndexes);
};

export const setContentType = ({ commit, getters }, type) => {
  const { config } = getters;
  const newConfig = { ...config };

  newConfig.panels[3].views[0].connector.options = { type };
  commit('setConfig', newConfig);
};

export const setDefaultActiveViews = async ({ commit, getters }) => {
  const { config } = getters;
  const activeViews = [];
  config.panels.forEach(({ views }, panelIndex) => {
    let defaultViewIndex = views.findIndex((view) => !!(view.default));
    if (defaultViewIndex === -1) defaultViewIndex = 0;
    activeViews[panelIndex] = defaultViewIndex;
  });

  await BookmarkService.updatePanels(activeViews);
  commit('config/setActiveViews', activeViews, { root: true });
};
