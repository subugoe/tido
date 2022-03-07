export const loadConfig = (state, config) => {
  state.config = config;
};

export const resetInitialized = (state) => {
  state.initialized = false;
};

export const updateInitialized = (state, { initialized }) => {
  state.initialized = initialized;
};
