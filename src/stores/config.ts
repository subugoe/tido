import { defineStore } from 'pinia'
import {
    computed, ref,
  } from 'vue';

import messages from 'src/i18n';
import BookmarkService from '@/services/bookmark';
import { i18n } from '@/i18n';

  export const useConfigStore = defineStore('config', () => {
     // States ('Setup Pinia': refs)
     const instanceId = ref(null)
     const config = ref({
        container: '#app',
        collection: '',
        manifest: '',
        item: '',
        panels: [
          {
            label: 'contents',
            toggle: true,
            show: true,
            views: [
              {
                id: 'tree',
                label: 'contents',
                connector: {
                  id: 1,
                  options: {
                    labels: {
                      item: 'Sheet',
                      manifest: 'Manuscript',
                    },
                  },
                },
              },
            ],
          },
          {
            label: 'metadata',
            show: true,
            toggle: true,
            views: [
              {
                id: 'metadata',
                label: 'metadata',
                connector: {
                  id: 2,
                  options: {
                    collection: {
                      all: true,
                    },
                    manifest: {
                      all: true,
                    },
                    item: {
                      all: true,
                    },
                  },
                },
              },
            ],
          },
          {
            label: 'image',
            show: true,
            toggle: true,
            views: [
              {
                id: 'image',
                label: 'Image',
                connector: {
                  id: 3,
                },
              }],
          },
          {
            label: 'text',
            show: true,
            toggle: true,
            views: [
              {
                id: 'text1',
                label: 'Transcription',
                default: true,
                connector: {
                  id: 4,
                },
              },
            ],
          },
          {
            label: 'annotations',
            show: true,
            toggle: true,
            views: [
              {
                id: 'annotations1',
                label: 'annotations',
                connector: {
                  id: 5,
                  options: {
                    types: [],
                  },
                },
              },
            ],
          },
        ],
        colors: {
          forceMode: 'none',
          primary: '',
          secondary: '',
          accent: '',
        },
        header: {
          show: true,
          navigation: true,
          panelsToggle: true,
          languageSwitch: false,
        },
        labels: {
          item: 'Sheet',
          manifest: 'Manuscript',
        },
        lang: 'en',
        meta: {
          collection: {
            all: true,
          },
          manifest: {
            all: true,
          },
          item: {
            all: true,
          },
        },
        notificationColors: {
          info: 'blue-400',
          warning: 'red-400',
        },
      })
      const activeViews = ref([])
      const isValid = ref(false)


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

      // Getters ('Setup Pinia' computed())
      const activeContentType = computed(() => {
       const contentConnectorId = 4;
       const panelIndex = config.value.panels.findIndex(({ views }) => views.find(({ connector }) => contentConnectorId === connector.id));

       if (panelIndex === -1) return -1;

       const viewIndex = activeViews.value[panelIndex];
       return config.value.panels[panelIndex].views[viewIndex].connector.options.type;
      })

      // I think it doesn't matter whether getIconByType is a function or a computed property, since its only being called by actions in config
      function getIconByType(type) {
       const annotationsConnectorId = 5;
       const panelIndex = config.value.panels.findIndex(({ views }) => views.find(({ connector }) => annotationsConnectorId === connector.id));

       if (panelIndex === -1) return -1;

       const viewIndex = activeViews.value[panelIndex];
       const types = config.value.panels[panelIndex].views[viewIndex].connector.options?.types;
       return types.find(({ name }) => name === type)?.icon || 'biPencilSquare';
      }

     // Functions (mutators and actions in Vuex are now converted to functions in Pinia)

     function setConfig(payload) {
        config.value = payload;
     }

    async function setActivePanelView(viewIndex, panelIndex) {
        if(activeViews.value[panelIndex] !== undefined) {
            activeViews.value[panelIndex] = viewIndex;
        }
        await BookmarkService.updatePanels(activeViews.value);
    }

    function setPanels(panels) {
        config.value.panels = panels;
    }

    function setShowPanelSetter(index, show) {
        config.value.panels[index].show = show;
    }

    function loadConfig(config, isValid) {
        config.value = config;
        isValid.value = isValid;
    }

    function setActiveViews(payload) {
        activeViews.value = payload;
    }

    function setInstanceId(payload) {
        instanceId.value = payload;
    }

     // Actions to functions

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

    function validateLabels(labels, validLabels: Labels) {
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

    function discoverCustomConfig(customConfig, defaultConfig)  {
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

    function load(custConfig) {
        const customConfig = discoverCustomConfig(custConfig, config.value);
        const urlConfig = discoverUrlConfig(custConfig);
        const defaultConfig = discoverDefaultConfig(config.value);

        const header: Header = {
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
        setActiveViews(activeViews)

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
        setConfig(resultConfig)

        if (urlConfig.activeViews)   setActiveViews(activeViews)
        else   setDefaultActiveViews(false)   //dispatch('setDefaultActiveViews', false);
    }


    function setShowPanel( {index, show} ) {
      setShowPanelSetter(index, show)

      let panelIndexes = config.value.panels.reduce((acc, cur, i) => (cur.show ? [...acc, i] : acc), []);
      if (panelIndexes.length === config.value.panels.length) panelIndexes = [];

      BookmarkService.updateShow(panelIndexes);
    }

    function setContentType( type) {
      const newConfig = { ...config.value };

      newConfig.panels[3].views[0].connector.options = { type };
      setConfig(newConfig)
    }

    async function setDefaultActiveViews (bookmark = true){
      const activeViews = [];

      config.value.panels.forEach(({ views }, panelIndex) => {
        let defaultViewIndex = views.findIndex((view) => !!(view.default));
        if (defaultViewIndex === -1) defaultViewIndex = 0;
        activeViews[panelIndex] = defaultViewIndex;
      });

      if (bookmark) await BookmarkService.updatePanels(activeViews);
      setActiveViews(activeViews)
    }

    return {
        instanceId, config, activeViews, isValid,
        activeContentType, getIconByType,
        setConfig, setActivePanelView, setPanels, setShowPanelSetter, loadConfig, setActiveViews, setInstanceId,
        validateCollection, validateManifest, validateItem, validateTranslations, validatePanels, validateLang, validateColors, validateContainer, validateLabels, validateHeader,
        createDefaultActiveViews, splitUrlParts, isManifestPartValid, isItemPartValid, isShowPartValid, isPanelsPartValid,
        createDefaultPanelValue, createActiveViewsFromPanelsArray, discoverCustomConfig, discoverUrlConfig, discoverDefaultConfig,
        load, setShowPanel, setContentType, setDefaultActiveViews
    }
  })
