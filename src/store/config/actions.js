import BookmarkService from '@/services/bookmark';

function isUrl(str) {
  let url;
  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

export const load = ({ commit, getters }) => {
  const defaultConfig = getters.config;
  let customConfig = {};
  let configErrorMessage = 'configJsonError';
  let configErrorTitle = 'noConfigTitle';
  let isValid = false;

  const el = document.getElementById('tido-config');

  if (!el) {
    configErrorMessage = 'noConfigMessage';
    configErrorTitle = 'noConfigTitle';
  }

  customConfig = JSON.parse(el.text);

  if (customConfig.manifest && !isUrl(customConfig.manifest)) {
    customConfig.manifest = '';
  }
  if (!customConfig.entrypoint) {
    configErrorMessage = 'noConfigEntrypoint';
    configErrorTitle = 'noConfigTitle';
  }
  isValid = true;

  const query = BookmarkService.getQuery();
  const { item, manifest, collection, panels } = query;
  console.log(isUrl(manifest), manifest)

  const resultConfig = {
    ...defaultConfig,
    ...customConfig,
    ...(isUrl(item) ? {item} : {}),
    ...(isUrl(manifest) ? {manifest} : {}),
    ...(isUrl(collection) ? {collection} : {}),
  }

  // commit('loadConfig', {
  //   configErrorMessage, configErrorTitle, resultConfig, isValid,
  // });

  commit('setConfig', resultConfig);

  return {
    resultConfig,
    configErrorMessage,
    configErrorTitle,
    isValid,
  };
};



export const resetInitialized = ({ commit }) => {
  commit('resetInitialized');
};

