import * as AnnotationUtils from '@/utils';

export const addActiveAnnotation = ({ commit, getters }, targetId) => {
  const { activeAnnotations, annotations } = getters;

  const newActiveAnnotation = annotations.find((annotation) => targetId === annotation.targetId);

  if (newActiveAnnotation) {
    activeAnnotations[targetId] = newActiveAnnotation;
    commit('updateActiveAnnotations', { ...activeAnnotations });
    let selector = AnnotationUtils.stripTargetId(newActiveAnnotation, false);

    if (selector.startsWith('.')) {
      selector = selector.replace(/\./g, '');
    }

    // const el = document.getElementById(selector) || document.querySelector(`.${selector}`);

    // AnnotationUtils.updateHighlightState(selector, 'INC');
    // if (el) {
    //   AnnotationUtils.addIcon(el, newActiveAnnotation);
    // }

    // if (el) {
    //   el.scrollIntoView({ behavior: 'smooth' });
    // }
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

export const removeActiveAnnotation = ({ commit, getters, dispatch }, annotation) => {
  const { activeAnnotations } = getters;
  delete activeAnnotations[annotation.targetId];
  commit('updateActiveAnnotations', { ...activeAnnotations });
  dispatch('hideAnnotationIcon', annotation.targetId);
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
