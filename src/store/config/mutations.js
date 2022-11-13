export const setConfig = (state, payload) => {
  console.log('set config');

  state.config = payload;
};

export const setActivePanelView = (state, { panelIndex, viewIndex }) => {
  const { activeViews } = state;
  if (activeViews[panelIndex] !== undefined) {
    activeViews[panelIndex] = viewIndex;
  }
};

export const setPanels = (state, panels) => {
  state.config.panels = panels;
};

export const setShowPanel = (state, { index, show }) => {
  state.config.panels[index].show = show;
};

export const loadConfig = (state, { config, isValid }) => {
  state.config = config;
  state.isValid = isValid;
};

export const setActiveViews = (state, payload) => {
  state.activeViews = payload;
};
