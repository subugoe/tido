export const updateActiveAnnotations = (state, annotations) => {
  state.activeAnnotations = annotations;
};

export const updateActiveTab = (state, tab) => {
  (state.activeTab = tab);
};

export const updateAnnotations = (state, annotations) => {
  state.annotations = annotations;
};

export const updateAnnotationLoading = (state, isLoading) => {
  state.isLoading = isLoading;
};

export const updateContentFontSize = (state, size) => {
  state.contentFontSize = size;
};

export const updateContentIds = (state, annotations) => {
  (state.contentIds = annotations);
};

export const updateContentLoading = (state, isLoading) => {
  state.isContentLoading = isLoading;
};
