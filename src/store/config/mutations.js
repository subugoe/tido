export const setConfig = (state, payload) => {
  state.config = payload;
};

export const setActivePanelView = (state, { panelIndex, viewIndex}) => {
  const { panels } = state.config;
  panels[panelIndex].views = panels[panelIndex].views.map((view, i) => {
    view.active = i === viewIndex;
    return view;
  });
};

export const setPanels = (state, panels) => {
  state.config.panels = panels;
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
