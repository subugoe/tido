import * as AnnotationUtils from 'src/utils/annotations';
import { request } from '@/utils/http';
import * as Utils from '@/utils';
import BookmarkService from '@/services/bookmark';

export const addActiveAnnotation = ({ commit, getters, rootGetters }, id) => {
  const { activeAnnotations, annotations } = getters;
  const newActiveAnnotation = annotations.find((annotation) => annotation.id === id);

  if (!newActiveAnnotation || activeAnnotations[id]) {
    return;
  }

  const iconName = rootGetters['config/getAnnotationIcon'](newActiveAnnotation.body['x-content-type']);

  const activeAnnotationsList = { ...activeAnnotations };

  activeAnnotationsList[id] = newActiveAnnotation;
  commit('updateActiveAnnotations', activeAnnotationsList);

  const selector = Utils.generateTargetSelector(newActiveAnnotation);
  const elements = (selector) ? [...document.querySelectorAll(selector)] : [];
  Utils.highlightTargets(selector, { operation: 'INC' });

  if (elements.length > 0) {
    Utils.addIcon(elements[0], newActiveAnnotation, iconName);
    elements[0].scrollIntoView({ behavior: 'smooth' });
  }
};

export const setFilteredAnnotations = ({ commit, getters, rootGetters }, types) => {
  const { annotations } = getters;
  const activeContentType = rootGetters['config/activeContentType'];
  const filteredAnnotations = annotations.filter(
      (annotation) => {

        const type = types.find(({ name }) => name === annotation.body['x-content-type']);
        // First we check if annotation fits to the current view
        if (!type) return false;

        let isVisible = false;

        if (type?.displayWhen && type?.displayWhen === activeContentType) {
          // Next we check if annotation should always be displayed on the current content tab
          isVisible = true;
        } else {
          // If the display is not dependent on displayWhen then we check if annotation's target exists in the content
          const selector = AnnotationUtils.generateTargetSelector(annotation);
          console.log(selector);
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
  ).forEach((selector) => Utils.addRangeHighlightAttributes(selector, dom));

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

  const activeAnnotationsList = { ...activeAnnotations };

  delete activeAnnotationsList[id];
  commit('updateActiveAnnotations', activeAnnotationsList);

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

export const updateActiveTab = ({ commit }, { tab, index }) => {
  BookmarkService.updateAnnotationQuery(index);
  commit('updateActiveTab', tab);
};

export const updateContentLoading = ({ commit }, isLoading) => {
  commit('updateContentLoading', isLoading);
};

export const initAnnotations = async ({ dispatch }, url) => {
  console.log('initAnnotations');
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
  document.querySelector('#text-content>div>*').addEventListener('click', ({ target }) => {
    // The click event handler works like this:
    // When clicking on the text we pick the whole part of the text which belongs to the highest parent annotation.
    // Since the annotations can be nested we avoid handling each of them separately
    // and select/deselect the whole cluster at once.
    // The actual click target decides whether it should be a selection or a deselection.

    // First we make sure to have a valid target.
    // Although we receive a target from the event it can be a regular HTML element within the annotation.
    // So we try to find it's nearest parent element that is marked as annotation element.
    if (!target.dataset.annotation) {
      target = getNearestParentAnnotation(target);
    }

    if (!target) {
      return;
    }

    // Next we look up which annotations need to be selected
    let annotationIds = {};
    getValuesFromAttribute(target, 'data-annotation-ids').forEach((value) => annotationIds[value] = true);
    annotationIds = discoverParentAnnotationIds(target, annotationIds);
    annotationIds = discoverChildAnnotationIds(target, annotationIds);

    const { filteredAnnotations } = getters;

    // We check the highlighting level to determine whether to select or deselect.
    // TODO: it might be better to check the activeAnnotations instead
    const targetIsSelected = parseInt(target.getAttribute('data-annotation-level'), 10) > 0;

    Object.keys(annotationIds).forEach((id) => {
      // We need to check here if the right annotations panel tab is active
      // a.k.a. it exists in the current filteredAnnotations
      const annotation = filteredAnnotations.find((filtered) => filtered.id === id);
      if (annotation) {
        if (targetIsSelected) {
          dispatch('removeActiveAnnotation', id);
        } else {
          dispatch('addActiveAnnotation', id);
        }
      }
    });
  });

  function getNearestParentAnnotation(element) {
    const parent = element.parentElement;
    if (parent.dataset?.annotation) {
      return parent;
    }
    const higherParent = getNearestParentAnnotation(parent);
    return higherParent ?? null;
  }

  function getValuesFromAttribute(element, attribute) {
    const value = element.getAttribute(attribute);
    return value ? value.split(' ') : [];
  }

  function discoverParentAnnotationIds(el, annotationIds = {}) {
    const parent = el.parentElement;
    if (parent && parent.id !== 'text-content') {
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
