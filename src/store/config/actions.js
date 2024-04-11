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

function regexManifestValidationUrl(urlConfig, manifestPart) {
  const regexManifest = /m\d/;
  const m = regexManifest.exec(manifestPart) !== null ? parseInt(manifestPart.slice(1), 10) : -1;
  urlConfig.m = m;

  return [urlConfig, m];
}

function regexItemValidationUrl(urlConfig, itemPart) {
  const regexItem = /i\d+/;
  const i = regexItem.exec(itemPart) !== null ? parseInt(itemPart.slice(1), 10) : -1;
  urlConfig.i = i;

  return [urlConfig, i];
}

function regexPanelsValidationUrl(urlConfig, panelsPart, numberPanels) {
  let p = -1;
  const numbersPartArray = panelsPart.slice(1).split('-');
  const regexNumber = /^\d+$/;
  let isPanelsMatch = true;
  if (panelsPart[0] !== 'p' || numbersPartArray.length !== numberPanels) {
    isPanelsMatch = false;
  }
  else {
    for (let i = 0; i < numbersPartArray.length; i++) {
      const panelTabPair = numbersPartArray[i];
      if (panelTabPair.length !== 3
        || regexNumber.test(panelTabPair[0]) === false
        || regexNumber.test(panelTabPair[2]) === false
        || panelTabPair[1] !== '.') {
        isPanelsMatch = false;
        p = -1;
        break;
      }
    }
  }
  if (isPanelsMatch === true) {
    p = panelsPart.slice(1);
  }

  urlConfig.p = p;
  return [urlConfig, p];
}

function regexShowValidationUrl(urlConfig, showPart, numberPanels) {
  const numbersPart = showPart.slice(1);
  const regexNumbersPart = /\d\-/;
  let s = showPart.slice(1).split('-'); // get the array of panel numbers

  if (s.length > numberPanels) {
    s = -1;
  } 
  else {
    let matchNumbersPart = true;
    for (let i = 0; i < s.length - 1; i++) { //if s0-2 is given and there are in total 4 panels, then it is still fine, since we can show less number of panels than the total one
      const groupMatch = numbersPart.slice(i * 2, i * 2 + 2).match(regexNumbersPart); // match the couples of (d-) -> a digit followed by a "-" character. In total there are (s.length - 1) - so number of panels we want to open - 1
      if (groupMatch === null) {
        matchNumbersPart = false;
        break;
      }
    }
    const lastNumberString = s.slice(-1)[0];
    const lastNumberInt = parseInt(lastNumberString, 10);
    if (/^\d+$/.test(lastNumberString) === false || (lastNumberInt >= numberPanels || lastNumberInt < 0)) {
      matchNumbersPart = false; // last character must have only digits and not be greater than number of max panels
    }
    if (matchNumbersPart === false) {
      s = -1;
    }
    if (s !== -1) {
      s = s.map(Number);
    }
  }
  urlConfig.s = s;
  return [urlConfig, s];
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

// split the url based on '_'
// get the part of attribute: get the attribute name and the value based on the type of attribute
// add each attribute to UrlConfig as key value
function discoverUrlConfig(config) {
  let urlConfig = {};
  const urlQuery = BookmarkService.getQuery();
  const attributes = ['m', 'i', 'p', 's'];
  let [m, i, p, s] = [undefined, undefined, undefined, undefined]; // values of manifest, item Indices ...
  const numberPanels = config.panels.length;

  const [manifestPart, itemPart, panelsPart, showPart] = splitUrlParts(urlQuery, attributes);
  /*
  if (isUrl(item)) urlConfig.item = item;
  if (isUrl(manifest)) urlConfig.manifest = manifest;
  if (isUrl(collection)) urlConfig.collection = collection;
  */

  // reg expression for each part  /\m\\d{+}
  // here we will validate for the structure of each component:, not their value range

  if (manifestPart !== undefined) { // if manifestPart is given in URL, then we use regex to check whether it is given correctly
    [urlConfig, m] = regexManifestValidationUrl(urlConfig, manifestPart);
  }
  if (itemPart !== undefined) {
    [urlConfig, i] = regexItemValidationUrl(urlConfig, itemPart);
  }
  if (panelsPart !== undefined) {
    [urlConfig, p] = regexPanelsValidationUrl(urlConfig, panelsPart, numberPanels);
  }
  else {
    //get the number of panels and then create as many couples of (panel_index.0) until n_panels-1, the last couple need not have the '-' symbol
    p = '';
    for (let j = 0; j < numberPanels; j++) {
      if (j !== numberPanels - 1) {
        p += `${j}.0-`;
      }
      else {
        p += `${j}.0`;
      }
    }
  }
  if (showPart !== undefined) {
    [urlConfig, s] = regexShowValidationUrl(urlConfig, showPart, numberPanels);
  }

  if (s === undefined) {
    urlConfig.s = Array.from({ length: numberPanels }, (value, index) => index);
  } else {
    urlConfig.s = s;
  }
  const panelsQueryArr = p !== -1 ? p.split('-') : [];  //converts 'p' to an object with key, value: 'panel index: visible tab index'
  urlConfig.activeViews = panelsQueryArr.reduce((acc, cur) => {
    // eslint-disable-next-line no-shadow
    const [panelIndex, viewIndex] = cur.split('.').map((i) => parseInt(i, 10));
    acc[panelIndex] = viewIndex;
    return acc;
  }, {});

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
  const urlConfig = discoverUrlConfig(config);
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
