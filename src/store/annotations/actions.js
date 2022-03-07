import { request } from '@/utils/http';
import * as AnnotationUtils from '@/utils';

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
