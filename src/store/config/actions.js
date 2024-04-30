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

function validateContainer(value) {
  return !!(value);
}

function validateHeader(value, defaultValue) {
  if (!value) return false;

  const defaultKeys = Object.keys(defaultValue);
  const invalidKeys = Object.keys(value)
    .filter((key) => defaultKeys.findIndex((defaultKey) => defaultKey === key) === -1);
  return invalidKeys.length === 0;
}

function validateLabels(labels, validLabels) {
  // valid labels are the labels from the default config
  // we consider the custom labels, in the case when all the keys have a value, otherwise we would have the button with empty text i.e for the following scenario
  // when the item is ''
  if (!labels || !validLabels) return false;

  let isValid = true;
  Object.keys(labels).forEach((key) => {
    if (!(key in validLabels) || labels[key] === '') {
      isValid = false;
    }
  });

  return isValid;
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

// URL Config
function splitUrlParts(urlQuery, attributes) {
  if (urlQuery === '') {
    return [undefined, undefined, undefined, undefined];
  }
  const arrayAttributes = urlQuery.split('_');
  const manifestPart = arrayAttributes.find((element) => element[0].includes(attributes[0])); // index of manifest part in the splitted array: element[0] is 'm' the first letter of the part ?
  const itemPart = arrayAttributes.find((element) => element[0].includes(attributes[1]));
  const panelsPart = arrayAttributes.find((element) => element[0].includes(attributes[2]));
  const showPart = arrayAttributes.find((element) => element[0].includes(attributes[3]));
  return [manifestPart, itemPart, panelsPart, showPart];
}

function isManifestPartValid(manifestPart) {
  const regexManifest = /m\d+$/;
  return regexManifest.exec(manifestPart) !== null;
}

function isItemPartValid(itemPart) {
  const regexItem = /i\d+$/;
  return regexItem.exec(itemPart) !== null;
}

function isPanelsPartValid(panelsPart, panelsValue, numberPanels) {
  const numbersPartArray = panelsValue.split('-');
  const regexNumber = /^\d+$/;
  if (panelsPart[0] !== 'p' || numbersPartArray.length !== numberPanels) {
    return false;
  }

  for (let i = 0; i < numbersPartArray.length; i++) {
    const panelTabPair = numbersPartArray[i];
    if (panelTabPair.length !== 3
      || regexNumber.test(panelTabPair[0]) === false
      || regexNumber.test(panelTabPair[2]) === false
      || panelTabPair[1] !== '.') {
      return false;
    }
  }
  return true;
}

function isShowPartValid(showValue, numberPanels) {
  const showValueAsArray = showValue.split('-');
  const regexNumbersPart = /\d\-/;
  if (showValueAsArray.length > numberPanels) {
    return false;
  }
  for (let i = 0; i < showValueAsArray.length - 1; i++) {
    // if s0-2 is given and there are in total 4 panels, then it is still fine, since we can show less number of panels than the total one
    // match the couples of (d-) -> a digit followed by a "-" character. In total there are (s.length - 1) - so number of panels we want to open - 1
    const groupMatch = showValue.slice(i * 2, i * 2 + 2).match(regexNumbersPart);
    if (groupMatch === null) {
      return false;
    }
  }
  const lastNumberString = showValue.slice(-1)[0];
  const lastNumberInt = parseInt(lastNumberString, 10);
  // last character must have only digits and not be greater than number of max panels
  if (/^\d+$/.test(lastNumberString) === false || (lastNumberInt >= numberPanels || lastNumberInt < 0)) {
    return false;
  }
  return true;
}

function createDefaultPanelValue(numberPanels) {
  // get the number of panels and then create as many couples of (panel_index.0) until n_panels-1, the last couple need not have the '-' symbol
  let p = '';
  for (let j = 0; j < numberPanels; j++) {
    if (j !== numberPanels - 1) {
      p += `${j}.0-`;
    } else {
      p += `${j}.0`;
    }
  }
  return p;
}

function createActiveViewsFromPanelsArray(panelsArray) {
  // converts 'panelsArray' to an object with key, value: 'panel index: visible tab index'
  return panelsArray.reduce((acc, cur) => {
    // eslint-disable-next-line no-shadow
    const [panelIndex, viewIndex] = cur.split('.').map((i) => parseInt(i, 10));
    acc[panelIndex] = viewIndex;
    return acc;
  }, {});
}

function discoverCustomConfig(customConfig, defaultConfig) {
  const {
    container, translations, collection, manifest, item, panels, lang, colors, header, labels
  } = customConfig;

  return {
    ...(validateContainer(container) && { container }),
    ...(validateCollection(collection) && { collection }),
    ...(validateManifest(manifest) && { manifest }),
    ...(validateItem(item) && { item }),
    ...(validateTranslations(translations) && { translations }),
    ...(validatePanels(panels) && { panels }),
    ...(validateLang(lang) && { lang }),
    ...(validateColors(colors) && { colors }),
    ...(validateHeader(header, defaultConfig.header) && { header }),
    ...(validateLabels(labels, defaultConfig.labels) && { labels }),
  };
}

function discoverUrlConfig(config) {
  // split the url based on '_'
  // get the part of attribute: get the attribute name and the value based on the type of attribute
  // add each attribute to UrlConfig as key value
  let urlConfig = {};
  const urlQuery = BookmarkService.getQuery();
  const attributes = ['m', 'i', 'p', 's'];
  // values of manifest, item Indices ...
  let [m, i, p, s] = [undefined, undefined, undefined, undefined];
  const numberPanels = config.panels ? config.panels.length : 0;
  const [manifestPart, itemPart, panelsPart, showPart] = splitUrlParts(urlQuery, attributes);
  /*
  if (isUrl(item)) urlConfig.item = item;
  if (isUrl(manifest)) urlConfig.manifest = manifest;
  if (isUrl(collection)) urlConfig.collection = collection;
  */
  // here we will validate for the structure of each component:, not their value range
  if (manifestPart !== undefined) {
    if (!isManifestPartValid(manifestPart)) {
      throw new Error(i18n.global.t('error_manifestpart_tido_url'));
    } else {
      urlConfig.m = parseInt(manifestPart.slice(1), 10);
    }
  }
  if (itemPart !== undefined) {
    if (!isItemPartValid(itemPart)) {
      throw new Error(i18n.global.t('error_itempart_tido_url'));
    } else {
      urlConfig.i = parseInt(itemPart.slice(1), 10);
    }
  }
  if (panelsPart !== undefined) {
    const panelsValue = panelsPart.slice(1);
    if (!isPanelsPartValid(panelsPart, panelsValue, numberPanels)) {
      throw new Error(i18n.global.t('error_panelspart_tido_url'));
    } else {
      p = panelsValue;
    }
  } else {
    p = createDefaultPanelValue(numberPanels);
  }
  const panelsArray = p !== '' ? p.split('-') : [];
  urlConfig.activeViews = createActiveViewsFromPanelsArray(panelsArray);

  if (showPart !== undefined) {
    const showValue = showPart.slice(1);
    if (!isShowPartValid(showValue, numberPanels)) {
      throw new Error(i18n.global.t('error_showpart_tido_url'));
    } else {
      // showValue needs to be an array of opened panel indices (Integers)
      s = showValue.split('-').map(Number);
    }
  }
  if (s === undefined) {
    // If 's' is not given in URL, then we open all the panels which are given in config
    urlConfig.show = Array.from({ length: numberPanels }, (value, index) => index);
  } else {
    urlConfig.show = s;
  }
  return urlConfig;
}

function discoverDefaultConfig(config) {
  return {
    ...JSON.parse(JSON.stringify(config)),
    activeViews: createDefaultActiveViews(config.panels),
  };
}

export const load = ({ commit, getters, dispatch }, config) => {
  const customConfig = discoverCustomConfig(config, getters.config);
  const urlConfig = discoverUrlConfig(config);
  const defaultConfig = discoverDefaultConfig(getters.config);

  const header = {
    ...defaultConfig.header,
    ...customConfig.header,
  };

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
    header,
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

  if (urlConfig.activeViews) commit('setActiveViews', activeViews);
  else dispatch('setDefaultActiveViews', false);
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

export const setContentType = ({ commit, getters }, type) => {
  const { config } = getters;
  const newConfig = { ...config };

  newConfig.panels[3].views[0].connector.options = { type };
  commit('setConfig', newConfig);
};

export const setDefaultActiveViews = async ({ commit, getters }, bookmark = true) => {
  const { config } = getters;
  const activeViews = [];

  config.panels.forEach(({ views }, panelIndex) => {
    let defaultViewIndex = views.findIndex((view) => !!(view.default));
    if (defaultViewIndex === -1) defaultViewIndex = 0;
    activeViews[panelIndex] = defaultViewIndex;
  });

  if (bookmark) await BookmarkService.updatePanels(activeViews);

  commit('config/setActiveViews', activeViews, { root: true });
};

export const setInstanceId = ({ commit }, id) => {
  commit('config/setInstanceId', id);
};
