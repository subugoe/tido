export const setConfig = (state, payload) => {
  state.config = payload;
};

export const setActivePanelView = (state, { panelIndex, viewIndex}) => {
  const { activeViews } = state;
  if (activeViews[panelIndex] !== undefined) {
    activeViews[panelIndex] = viewIndex;
  }
};

export const setPanels = (state, panels) => {
  state.config.panels = panels;
};

export const loadConfig = (state, { config, isValid}) => {
  state.config = config;
  state.isValid = isValid;
};

export const resetInitialized = (state) => {
  state.initialized = false;
};

export const setActiveViews = (state, payload) => {
  state.activeViews = payload;
};
