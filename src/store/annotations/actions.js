import { request } from '@/utils/http';
import * as Utils from '@/utils';
import * as AnnotationUtils from 'src/utils/annotations';

export const addActiveAnnotation = ({ commit, getters, rootGetters }, id) => {
  const { activeAnnotations, annotations } = getters;
  const newActiveAnnotation = annotations.find((annotation) => annotation.id === id);

  if (!newActiveAnnotation || activeAnnotations[id]) {
    return;
  }

  const iconName = rootGetters['config/getAnnotationIcon'](newActiveAnnotation.body['x-content-type']);

  activeAnnotations[id] = newActiveAnnotation;
  commit('updateActiveAnnotations', { ...activeAnnotations });

  const selector = Utils.generateTargetSelector(newActiveAnnotation);
  const elements = (selector) ? [...document.querySelectorAll(selector)] : [];
  Utils.highlightTargets(selector, { operation: 'INC' });

  if (elements.length > 0) {
    Utils.addIcon(elements[0], newActiveAnnotation, iconName);
    elements[0].scrollIntoView({ behavior: 'smooth' });
  }
};

export const setFilteredAnnotations = ({ commit, getters, rootGetters }) => {
  const { activeTab, annotations } = getters;
  const config = rootGetters['config/config'];
  const annotationTypesMapping = rootGetters['config/annotationTypesMapping'];
  const contentTypes = rootGetters['contents/contentTypes'];
  const contentIndex = rootGetters['contents/contentIndex'];

  const tabConfig = config.annotations.tabs;
  const activeEntities = tabConfig[activeTab] ?? [];

  const filteredAnnotations = !activeTab
    ? []
    : annotations.filter(
      (x) => {
        const annotationContentType = annotationTypesMapping[x.body['x-content-type']];

        // First we check if annotation fits to the current tab
        if (!activeEntities.includes(x.body['x-content-type'])) {
          return false;
        }

        let isVisible = false;

        if (
          annotationContentType?.displayWhen
          && annotationContentType?.displayWhen === contentTypes[contentIndex]
        ) {
          // Next we check if annotation should always be displayed on the current content tab
          isVisible = true;
        } else {
          // If the display is not dependent on displayWhen then we check if annotation's target exists in the content
          const selector = AnnotationUtils.generateTargetSelector(x);
          if (selector) {
            const el = document.querySelector(selector);
            if (el) {
              isVisible = true;
            }
          }
        }

        return isVisible;
      },
    );

  commit('setFilteredAnnotations', filteredAnnotations);
};

export const addHighlightAttributesToText = ({ getters }, dom) => {
  const { annotations } = getters;
  Utils.mapUniqueElements(
    Utils.findDomElements('[data-target]:not([value=""])', dom),
    (x) => x.getAttribute('data-target').replace('_start', '').replace('_end', ''),
  ).forEach((selector) => Utils.replaceSelectorWithSpan(selector, dom));

  annotations.forEach((annotation) => {
    const { id } = annotation;
    const selector = Utils.generateTargetSelector(annotation);
    if (selector) {
      Utils.addHighlightToElements(selector, dom, id);
    }
  });
};

export const annotationLoaded = ({ commit }, annotations) => {
  commit('updateAnnotations', annotations);
  commit('updateAnnotationLoading', false);
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

export const removeActiveAnnotation = ({ commit, getters }, id) => {
  const { activeAnnotations } = getters;

  const removeAnnotation = activeAnnotations[id];
  if (!removeAnnotation) {
    return;
  }

  delete activeAnnotations[id];
  commit('updateActiveAnnotations', { ...activeAnnotations });

  const selector = AnnotationUtils.generateTargetSelector(removeAnnotation);
  if (selector) {
    AnnotationUtils.highlightTargets(selector, { operation: 'DEC' });
    AnnotationUtils.removeIcon(removeAnnotation);
  }
};

export const resetActiveAnnotations = ({ commit, getters }) => {
  const { activeAnnotations } = getters;

  Object.keys(activeAnnotations).forEach((key) => {
    const activeAnnotation = activeAnnotations[key];
    const selector = AnnotationUtils.generateTargetSelector(activeAnnotation);
    if (selector) {
      AnnotationUtils.highlightTargets(selector, { level: -1 });
      AnnotationUtils.removeIcon(activeAnnotation);
    }
  });
  commit('updateActiveAnnotations', {});
};

export const updateActiveTab = ({ commit }, tab) => {
  commit('updateActiveTab', tab);
};

export const updateContentLoading = ({ commit }, isLoading) => {
  commit('updateContentLoading', isLoading);
};

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
      dispatch('annotationLoaded', current.annotationPage.items);
    } else {
      dispatch('annotationLoaded', []);
    }
  } catch (err) {
    dispatch('annotationLoaded', []);
  }
};

export const addHighlightClickListeners = ({ dispatch, getters }) => {
  document.getElementById('text-content').addEventListener('click', ({ target }) => {
    let annotationIds = {};
    getValuesFromAttribute(target, 'data-annotation-ids').forEach((value) => annotationIds[value] = true);
    annotationIds = discoverParentAnnotationIds(target, annotationIds);
    annotationIds = discoverChildAnnotationIds(target, annotationIds);

    const { filteredAnnotations } = getters;
    Object.keys(annotationIds).forEach((id) => {
      // We need to check here if the right annotations panel tab is active
      // a.k.a. it exists in the current filteredAnnotations
      const index = filteredAnnotations.findIndex((annotation) => annotation.id === id);
      if (index > -1) {
        dispatch('addActiveAnnotation', id);
      }
    });
  });

  function getValuesFromAttribute(element, attribute) {
    const value = element.getAttribute(attribute);
    return value ? value.split(' ') : [];
  }

  function discoverParentAnnotationIds(el, annotationIds = {}) {
    const parent = el.parentElement;
    if (parent.dataset.annotation) {
      getValuesFromAttribute(parent, 'data-annotation-ids').forEach((value) => annotationIds[value] = true);
      return discoverParentAnnotationIds(parent, annotationIds);
    }
    return annotationIds;
  }

  function discoverChildAnnotationIds(el, annotationIds = {}) {
    const { children } = el;

    [...children].forEach((child) => {
      if (child.dataset.annotation) {
        getValuesFromAttribute(child, 'data-annotation-ids').forEach((value) => annotationIds[value] = true);
        annotationIds = discoverChildAnnotationIds(child, annotationIds);
      }
    });
    return annotationIds;
  }
};
