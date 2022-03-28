import { request } from '@/utils/http';
import * as Utils from 'src/utils';

export const addActiveAnnotation = ({ commit, getters }, annotation) => {
  const { activeAnnotations } = getters;
  activeAnnotations[annotation.id] = annotation;
  commit('updateActiveAnnotations', { ...activeAnnotations });
};

export const addHighlightAttributesToText = ({ getters }, dom) => {
  const { annotations } = getters;
  console.log('addHighlightAttributesToText', annotations);
  Utils.mapUniqueElements(
    Utils.findDomElements('[data-target]:not([value=""])', dom),
    (x) => x.getAttribute('data-target').replace('_start', '').replace('_end', ''),
  ).forEach((selector) => Utils.replaceSelectorWithSpan(selector, dom));

  annotations.forEach((annotation) => {
    const { id } = annotation;
    const { selector } = annotation.target;
    if (selector) {
      Utils.addHighlightToElements(selector.value, dom, { annotationId: id });
    }
  });
};

export const annotationLoaded = ({ commit, dispatch }, annotations) => {
  console.log('annotations/annotationLoaded', annotations);
  commit('updateAnnotations', annotations);

  dispatch('addHighlightAttributesToText', document.getElementById('text-container'));

  dispatch(
    'updateContentIds',
    Utils.getAnnotationContentIds(),
  );

  commit('updateAnnotationLoading', false);
};

export const decreaseContentFontSize = ({ commit, state }) => {
  commit('updateContentFontSize', state.contentFontSize - 2);
};

export const increaseContentFontSize = ({ commit, state }) => {
  commit('updateContentFontSize', state.contentFontSize + 2);
};

export const loadAnnotations = ({ commit }) => {
  console.log('annotations/loadAnnotations');
  commit('updateAnnotationLoading', true);
  commit('updateAnnotations', []);
};

export const removeActiveAnnotation = ({ commit, getters }, annotation) => {
  const { activeAnnotations } = getters;
  delete activeAnnotations[annotation.id];
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
  console.log('annotations/updateContentIds');
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
      console.log(current.annotationPage.items.length);
      dispatch('annotationLoaded', current.annotationPage.items);
    } else {
      dispatch('annotationLoaded', []);
    }
  } catch (err) {
    console.log(err);
    dispatch('annotationLoaded', []);
  }
};
