export const loadConfig = ({ commit }) => {
  let config = {};
  let configErrorMessage = null;
  let configErrorTitle = null;
  let isValid = false;

  const el = document.getElementById('tido-config');

  try {
    if (!el) {
      throw new Error('noConfigID');
    }

    config = JSON.parse(el.text);

    if (!config.entrypoint) {
      throw new Error('noConfigEntrypoint');
    }

    isValid = true;
  } catch (err) {
    switch (err.message) {
      case 'noConfigID':
        configErrorMessage = 'noConfigMessage';
        configErrorTitle = 'noConfigTitle';
        break;
      case 'noConfigEntrypoint':
        configErrorMessage = 'noConfigEntrypoint';
        configErrorTitle = 'noConfigTitle';
        break;
      default:
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
