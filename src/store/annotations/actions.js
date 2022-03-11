import * as AnnotationUtils from 'src/utils';
import * as DomUtils from '@/utils';

export const addHighlightAttributesToText = ({ getters }, dom) => {
  const { annotations } = getters;

  DomUtils.mapUniqueElements(
    DomUtils.findDomElements('[data-target]:not([value=""])', dom),
    (x) => x.getAttribute('data-target').replace('_start', '').replace('_end', ''),
  ).forEach((selector) => AnnotationUtils.replaceSelectorWithSpan(selector, dom));

  annotations.forEach((annotation) => {
    const { selector } = annotation.target;
    AnnotationUtils.addHighlightToTargetIds(selector, dom);
  });
};

export const addActiveAnnotation = ({ commit, getters }, id) => {
  const { activeAnnotations, annotations } = getters;
  const newActiveAnnotation = annotations.find((annotation) => annotation.id === id);

  if (!newActiveAnnotation || activeAnnotations[id]) {
    return;
  }

  activeAnnotations[id] = newActiveAnnotation;
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
  console.log('annotationsLoaded');
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

/**
 * get annotations of the current item
 * caller: *getItemData()*
 * @param string url
 */
export const initAnnotations = async ({ dispatch }, url) => {
  dispatch('loadAnnotations');

  try {
    const annotations = await request(url);

    if (!annotations.annotationCollection.first) {
      dispatch('annotationLoaded', []);
      return;
    }

    const current = await request(annotations.annotationCollection.first);

    if (current.annotationPage.items.length) {
      dispatch(
        'annotationLoaded',
        current.annotationPage.items.map((x) => ({
          ...x,
          targetId: AnnotationUtils.stripTargetId(x, true),
        })),
      );
    } else {
      dispatch('annotationLoaded', []);
    }
  } catch (err) {
    dispatch('annotationLoaded', []);
  }
};
