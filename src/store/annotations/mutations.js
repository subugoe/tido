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

export const updateContentLoading = (state, isLoading) => {
  state.isContentLoading = isLoading;
};

export const setFilteredAnnotations = (state, payload) => {
  state.filteredAnnotations = payload;
};
