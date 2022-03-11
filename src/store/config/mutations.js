export const loadConfig = (state, { config, configErrorMessage, isValid }) => {
  state.config = config;
  state.configErrorMessage = configErrorMessage;
  state.isValid = isValid;
};

export const resetInitialized = (state) => {
  state.initialized = false;
};

export const updateInitialized = (state, { initialized }) => {
  state.initialized = initialized;
};
