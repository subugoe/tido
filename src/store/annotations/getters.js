export const activeTab = (state) => state.activeTab;

export const activeAnnotations = (state) => state.activeAnnotations;

export const isAllAnnotationSelected = (state) => (total) => Object.keys(state.activeAnnotations).length === total;

export const isNoAnnotationSelected = (state) => !Object.keys(state.activeAnnotations).length;

export const annotations = (state) => state.annotations;
export const isLoading = (state) => state.isLoading;

export const isContentLoading = (state) => state.isContentLoading;

export const filteredAnnotations = (state) => state.filteredAnnotations;
