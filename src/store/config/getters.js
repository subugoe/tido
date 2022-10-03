export const config = (state) => state.config;

export const configErrorMessage = (state) => state.configErrorMessage;

export const configErrorTitle = (state) => state.configErrorTitle;

export const initialized = (state) => state.initialized;

export const isConfigValid = (state) => state.isValid;

export const getAnnotationIcon = (state) => (type) => {
  const { icon } = state.config.annotations.types.filter(
    (annotation) => annotation.contenttype === type,
  )[0];

  return icon;
};

export const annotationTypesMapping = (state) => state.config.annotations.types.reduce((acc, curr) => {
  acc[curr.contenttype] = {
    type: curr.annotationType || 'annotation',
    displayWhen: curr.displayWhen,
  };
  return acc;
}, {});

export const activeViews = (state) => state.activeViews;

export const activeContentType = ({ config, activeViews }) => {
  const contentConnectorId = 4;
  const panelIndex = config.panels.findIndex(({views }) => views.find(({ connector }) => contentConnectorId === connector.id));

  if (panelIndex === -1) return -1;
  console.log(panelIndex);

  const viewIndex = activeViews[panelIndex];
  return config.panels[panelIndex].views[viewIndex].connector.options.type;
}


