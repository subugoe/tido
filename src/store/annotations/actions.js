import * as AnnotationUtils from 'src/utils';

export const addActiveAnnotation = ({ commit, getters }, targetId) => {
  const { activeAnnotations, annotations } = getters;
  const newActiveAnnotation = annotations.find((annotation) => annotation.targetId === targetId);

  if (!newActiveAnnotation || activeAnnotations[targetId]) {
    return;
  }

  activeAnnotations[targetId] = newActiveAnnotation;
  commit('updateActiveAnnotations', { ...activeAnnotations });

  let selector = AnnotationUtils.stripTargetId(newActiveAnnotation, false);

  if (selector.startsWith('.')) {
    selector = selector.replace(/\./g, '');
  }

  const el = document.getElementById(selector) || document.querySelector(`.${selector}`);

  AnnotationUtils.updateHighlightState(selector, 'INC');
  if (el) {
    AnnotationUtils.addIcon(el, newActiveAnnotation);
  }

  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
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

export const removeActiveAnnotation = ({ commit, getters }, { targetId, level }) => {
  const { activeAnnotations, contentIds } = getters;

  if (!contentIds[targetId]) {
    return;
  }

  const removeAnnotation = activeAnnotations[targetId];
  if (!removeAnnotation) {
    return;
  }

  let selector = AnnotationUtils.stripTargetId(removeAnnotation, false);
  if (selector.startsWith('.')) {
    selector = selector.replace(/\./g, '');
  }

  AnnotationUtils.updateHighlightState(selector, 'DEC', level);
  AnnotationUtils.removeIcon(removeAnnotation);

  delete activeAnnotations[targetId];
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
