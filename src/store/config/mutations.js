export const setConfig = (state, payload) => {
  state.config = payload;
};

export const loadConfig = (state, { config, configErrorMessage, configErrorTitle, isValid}) => {
  state.config = config;
  state.configErrorMessage = configErrorMessage;
  state.configErrorTitle = configErrorTitle;
  state.isValid = isValid;
};

export const resetInitialized = (state) => {
  state.initialized = false;
};

export const setInitialized = (state, { initialized }) => {
  state.initialized = initialized;
};
