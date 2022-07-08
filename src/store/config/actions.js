export const loadConfig = ({ commit }) => {
  let config = {};
  let configErrorMessage = null;
  let configErrorTitle = null;
  let isValid = false;

  const el = document.getElementById('tido-config');

  if (!el) {
    configErrorMessage = 'noConfigMessage';
    configErrorTitle = 'noConfigTitle';
  } else {
    try {
      config = JSON.parse(el.text);

      if (config.entrypoint) {
        isValid = true;
      } else {
        configErrorMessage = 'noConfigEntrypoint';
        configErrorTitle = 'noConfigTitle';
      }
    } catch (err) {
      configErrorMessage = 'configJsonError';
      configErrorTitle = 'noConfigTitle';
    }
  }

  commit('loadConfig', {
    configErrorMessage, configErrorTitle, config, isValid,
  });

  return {
    config,
    configErrorMessage,
    configErrorTitle,
    isValid,
  };
};

export const resetInitialized = ({ commit }) => {
  commit('resetInitialized');
};

export const setInitialized = ({ commit }, initialized) => {
  commit('setInitialized', { initialized });
};
