export const config = (state) => state.config;

export const activeViews = (state) => state.activeViews;

// eslint-disable-next-line no-shadow
export const activeContentType = ({ config, activeViews }) => {
  const contentConnectorId = 4;
  const panelIndex = config.panels.findIndex(({ views }) => views.find(({ connector }) => contentConnectorId === connector.id));

  if (panelIndex === -1) return -1;

  const viewIndex = activeViews[panelIndex];
  return config.panels[panelIndex].views[viewIndex].connector.options.type;
};

// eslint-disable-next-line no-shadow
export const getIconByType = ({ config, activeViews }) => (type) => {
  const annotationsConnectorId = 5;
  const panelIndex = config.panels.findIndex(({ views }) => views.find(({ connector }) => annotationsConnectorId === connector.id));

  if (panelIndex === -1) return -1;

  const viewIndex = activeViews[panelIndex];
  const types = config.panels[panelIndex].views[viewIndex].connector.options?.types;
  return types.find(({ name }) => name === type)?.icon || 'biPencilSquare';
};
