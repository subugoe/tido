export const config = (state) => state.config;

export const configErrorMessage = (state) => state.configErrorMessage;

export const initialized = (state) => state.initialized;

export const isConfigValid = (state) => state.isValid;

export const getAnnotationIcon = (state) => (type) => {
  const { icon } = state.config.annotations.types.filter(
    (annotation) => annotation.contenttype === type,
  )[0];

  return icon;
};
