export const addActiveAnnotation = ({ commit, getters }, annotation) => {
  const { activeAnnotations } = getters;
  activeAnnotations[annotation.targetId] = annotation;
  commit('updateActiveAnnotations', { ...activeAnnotations });
};

export const annotationLoaded = ({ commit }, annotations) => {
  commit('updateAnnotationLoading', false);
  commit('updateAnnotations', annotations);
};

export const decreaseContentFontSize = ({ commit, state }) => {
  commit('updateContentFontSize', state.contentFontSize - 2);
};

export const increaseContentFontSize = ({ commit, state }) => {
  commit('updateContentFontSize', state.contentFontSize + 2);
};

export const loadAnnotations = ({ commit }) => {
  commit('updateAnnotationLoading', true);
  commit('updateAnnotations', []);
};

export const removeActiveAnnotation = ({ commit, getters }, annotation) => {
  const { activeAnnotations } = getters;
  delete activeAnnotations[annotation.targetId];
  commit('updateActiveAnnotations', { ...activeAnnotations });
};

export const resetActiveAnnotations = ({ commit }) => {
  commit('updateActiveAnnotations', {});
};

export const updateActiveTab = ({ commit }, tab) => {
  commit('updateActiveTab', tab);
};

export const updateContentLoading = ({ commit }, isLoading) => {
  commit('updateContentLoading', isLoading);
};

export const updateContentIds = ({ commit }, annotations) => {
  commit('updateContentIds', annotations);
};
