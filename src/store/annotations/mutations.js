export const setActiveAnnotations = (state, annotations) => {
  state.activeAnnotations = annotations;
};

export const setAnnotations = (state, annotations) => {
  state.annotations = annotations;
};

export const updateAnnotationLoading = (state, isLoading) => {
  state.isLoading = isLoading;
};

export const setFilteredAnnotations = (state, payload) => {
  state.filteredAnnotations = payload;
};
