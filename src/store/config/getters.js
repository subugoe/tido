export const config = (state) => state.config;

export const getAnnotationIcon = (state) => (type) => {
  const { icon } = state.config.annotations.types.filter(
    (annotation) => annotation.contenttype === type,
  )[0];

  return icon;
};

export const activeViews = (state) => state.activeViews;

export const activeContentType = ({ config, activeViews }) => {
  const contentConnectorId = 4;
  const panelIndex = config.panels.findIndex(({ views }) => views.find(({ connector }) => contentConnectorId === connector.id));

  if (panelIndex === -1) return -1;

  const viewIndex = activeViews[panelIndex];
  return config.panels[panelIndex].views[viewIndex].connector.options.type;
}

export const getIconByType = ({ config, activeViews }) => (type) => {
  const annotationsConnectorId = 5;
  const panelIndex = config.panels.findIndex(({ views }) => views.find(({ connector }) => annotationsConnectorId === connector.id));

  if (panelIndex === -1) return -1;

  const viewIndex = activeViews[panelIndex];
  const types = config.panels[panelIndex].views[viewIndex].connector.options?.types;
  return types.find(({name }) => name === type)?.icon;
};


