export const loadConfig = ({ commit }) => {
  let config = {};
  let configErrorMessage = null;
  let isValid = false;

  const el = document.getElementById('tido-config');

  if (!el) {
    configErrorMessage = 'Tido config not present';
  } else {
    try {
      config = JSON.parse(el.text);
      isValid = true;
    } catch (err) {
      configErrorMessage = 'JSON parse error';
    }
  }

  commit('loadConfig', { configErrorMessage, config, isValid });

  return {
    config,
    configErrorMessage,
    isValid,
  };
};

export const resetInitialized = ({ commit }) => {
  commit('resetInitialized');
};

export const setInitialized = ({ commit }, initialized) => {
  commit('setInitialized', { initialized });
};
