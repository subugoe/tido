import * as AnnotationUtils from '@/utils/annotations';
import { request } from '@/utils/http';
import * as Utils from '@/utils';
import { scrollIntoViewIfNeeded } from '@/utils';
import { getAnnotationListElement } from '@/utils/annotations';

export const addActiveAnnotation = ({ getters, rootGetters, dispatch }, id) => {
  const { activeAnnotations, annotations } = getters;
  const newActiveAnnotation = annotations.find((annotation) => annotation.id === id);

  if (!newActiveAnnotation || activeAnnotations[id]) {
    return;
  }

  const iconName = rootGetters['config/getIconByType'](newActiveAnnotation.body['x-content-type']);

  const activeAnnotationsList = { ...activeAnnotations };

  activeAnnotationsList[id] = newActiveAnnotation;

  dispatch('setActiveAnnotations', activeAnnotationsList);

  const selector = Utils.generateTargetSelector(newActiveAnnotation);
  const elements = (selector) ? [...document.querySelectorAll(selector)] : [];
  Utils.highlightTargets(selector, { operation: 'INC' });

  if (elements.length > 0) {
    Utils.addIcon(elements[0], newActiveAnnotation, iconName);
    scrollIntoViewIfNeeded(elements[0], document.getElementById('text-content'));

    // Get the scroll container of Quasar tab panel
    const annotationsView = document.querySelector('.annotations-view').parentElement.parentElement;

    const annotationEl = getAnnotationListElement(id, annotationsView);
    scrollIntoViewIfNeeded(annotationEl, annotationsView);
  }
};

export const setActiveAnnotations = ({ commit }, activeAnnotations) => {
  commit('setActiveAnnotations', activeAnnotations);
};

export const setFilteredAnnotations = ({ commit, getters, rootGetters }, types) => {
  const { annotations } = getters;
  const activeContentType = rootGetters['config/activeContentType'];
  let filteredAnnotations = [];

  if (annotations !== null) {
    filteredAnnotations = types.length === 0 ? annotations : annotations.filter(
      (annotation) => {
        const type = types.find(({ name }) => name === annotation.body['x-content-type']);
        // First we check if annotation fits to the current view
        if (!type) return false;

        // Next we check if annotation should always be displayed on the current content tab
        if (type?.displayWhen && type?.displayWhen === activeContentType) return true;

        // If the display is not dependent on displayWhen then we check if annotation's target exists in the content
        const selector = AnnotationUtils.generateTargetSelector(annotation);
        if (selector) {
          const el = document.querySelector(selector);
          if (el) {
            return true;
          }
        }

        return false;
      },
    );
  }

  commit('setFilteredAnnotations', filteredAnnotations);
};

export const addHighlightAttributesToText = ({ getters }, dom) => {
  const { annotations } = getters;

  annotations.forEach((annotation) => {
    const { id } = annotation;
    const selector = Utils.generateTargetSelector(annotation);
    if (selector) {
      Utils.addHighlightToElements(selector, dom, id);
    }
  });
};

export const annotationLoaded = ({ commit }, annotations) => {
  commit('setAnnotations', annotations);
  commit('updateAnnotationLoading', false);
};

export const removeActiveAnnotation = ({ getters, dispatch }, id) => {
  const { activeAnnotations } = getters;

  const removeAnnotation = activeAnnotations[id];
  if (!removeAnnotation) {
    return;
  }

  const activeAnnotationsList = { ...activeAnnotations };

  delete activeAnnotationsList[id];
  dispatch('setActiveAnnotations', activeAnnotationsList);

  const selector = AnnotationUtils.generateTargetSelector(removeAnnotation);
  if (selector) {
    AnnotationUtils.highlightTargets(selector, { operation: 'DEC' });
    AnnotationUtils.removeIcon(removeAnnotation);
  }
};

export const resetAnnotations = ({ dispatch, getters }) => {
  const { annotations } = getters;

  if (annotations !== null) {
    annotations.forEach((annotation) => {
      const selector = AnnotationUtils.generateTargetSelector(annotation);
      if (selector) {
        AnnotationUtils.highlightTargets(selector, { level: -1 });
        AnnotationUtils.removeIcon(annotation);
      }
    });
  }

  dispatch('setActiveAnnotations', {});
};

export const initAnnotations = async ({ dispatch }, url) => {
  let annotations = null;
  try {
    annotations = await request(url);

    if (!annotations.first) {
      dispatch('annotationLoaded', []);
      return;
    }

    const current = await request(annotations.first);
    if (Array.isArray(current.items)) {
      dispatch('annotationLoaded', current.items);
    }
  } catch (err) {
    dispatch('annotationLoaded', []);
  }
};

export const addHighlightHoverListeners = ({ getters, rootGetters }) => {
  const annotationElements = Array.from(document.querySelectorAll('[data-annotation]'));

  const tooltipEl = null;

  // Annotations can be nested, so we filter out all outer elements from this selection and
  // iterate over the deepest elements
  annotationElements.forEach((el) => {
    el.addEventListener(
      'mouseenter',
      ({ clientX: x, clientY: y }) => {
        let elementFromPoint = document.elementFromPoint(x, y);

        if (!elementFromPoint.hasAttribute('data-annotation')) {
          elementFromPoint = null;
        }

        const currentElement = elementFromPoint ?? el;

        const { filteredAnnotations } = getters;
        const annotationTooltipModels = filteredAnnotations.reduce((acc, curr) => {
          const { id } = curr;
          const name = rootGetters['config/getIconByType'](curr.body['x-content-type']);
          acc[id] = {
            value: curr.body.value,
            name,
          };
          return acc;
        }, {});

        const currentAnnotations = Utils.getValuesFromAttribute(currentElement, 'data-annotation-ids');
        const closestAnnotationId = currentAnnotations[currentAnnotations.length - 1];
        const closestAnnotationTooltipModel = annotationTooltipModels[closestAnnotationId];
        let annotationIds = discoverParentAnnotationIds(currentElement);
        annotationIds = discoverChildAnnotationIds(currentElement, annotationIds);

        const otherAnnotationTooltipModels = Object.keys(annotationIds)
          .map((id) => annotationTooltipModels[id])
          .filter((m) => m);

        AnnotationUtils.createOrUpdateTooltip.bind(
          this,
          currentElement,
          { closest: closestAnnotationTooltipModel, other: otherAnnotationTooltipModels },
          document.getElementById('text-content'),
        )();
      },
      false,
    );
    el.addEventListener('mouseout', () => tooltipEl.remove(), false);
  });
};

export const addHighlightClickListeners = ({ dispatch, getters }) => {
  const textEl = document.querySelector('#text-content>div>*');

  if (!textEl) return;

  textEl.addEventListener('click', ({ target }) => {
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

    Utils.getValuesFromAttribute(target, 'data-annotation-ids').forEach((value) => annotationIds[value] = true);
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

    if (!parent) return null;

    if (parent.dataset?.annotation) {
      return parent;
    }
    return getNearestParentAnnotation(parent);
  }
};

export const selectAll = ({ getters, dispatch }) => {
  const { filteredAnnotations, activeAnnotations } = getters;
  filteredAnnotations.forEach(({ id }) => !activeAnnotations[id] && dispatch('addActiveAnnotation', id));
};

export const selectNone = ({ getters, dispatch }) => {
  const { filteredAnnotations, activeAnnotations } = getters;
  filteredAnnotations.forEach(({ id }) => activeAnnotations[id] && dispatch('removeActiveAnnotation', id));
};

function discoverParentAnnotationIds(el, annotationIds = {}) {
  const parent = el.parentElement;
  if (parent && parent.id !== 'text-content') {
    Utils.getValuesFromAttribute(parent, 'data-annotation-ids').forEach((value) => annotationIds[value] = true);
    return discoverParentAnnotationIds(parent, annotationIds);
  }
  return annotationIds;
}

function discoverChildAnnotationIds(el, annotationIds = {}) {
  const { children } = el;

  [...children].forEach((child) => {
    if (child.dataset.annotation) {
      Utils.getValuesFromAttribute(child, 'data-annotation-ids').forEach((value) => annotationIds[value] = true);
      annotationIds = discoverChildAnnotationIds(child, annotationIds);
    }
  });
  return annotationIds;
}
