export const load = ({ commit, getters }) => {
  let config = getters.config;
  let configErrorMessage = 'configJsonError';
  let configErrorTitle = 'noConfigTitle';
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
    }
  }

  console.log(configErrorMessage, configErrorTitle, config, isValid,)

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
