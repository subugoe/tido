import * as Utils from '@/utils/index';
import { getIcon } from '@/utils/icons';
import colors from "tailwindcss/colors";


// utility functions that we can use as generic way for perform tranformation on annotations.

export function addHighlightToElements(selector, root, annotationId) {
  const selectedElements = selector
    .split(',')
    .map((selectorPart) => [...root.querySelectorAll(selectorPart.replace(':', '--'))])
    .flat();

  if (selectedElements.length === 0) {
    return;
  }

  selectedElements.forEach((element) => {
    element.setAttribute('data-annotation', true);
    Utils.addToAttribute(element, 'data-annotation-ids', annotationId);
    element.setAttribute('data-annotation-level', -1);
  });
}

export const createSvgIcon = (name) => {
  const iconString = getIcon(name);

  if (!iconString) return null;

  const figure = document.createElement('figure');
  figure.classList.add(...['t-relative', 't-inline-flex', 't-w-4', 't-h-4', 't-mb-[2px]', 't-ml-0.5', 't-text-primary', 't-align-middle']);
  figure.classList.add(`icon-${name}`);
  figure.innerHTML = iconString;
  return figure;
};

export function getNewLevel(element, operation) {
  const currentLevel = element.hasAttribute('data-annotation-level')
    ? parseInt(element.getAttribute('data-annotation-level'), 10)
    : 0;

  if (operation === 'INC') {
    return currentLevel + 1;
  }
  if (operation === 'DEC') {
    return currentLevel - 1;
  }
  return currentLevel;
}

export function highlightTargets(selector, { operation, level } = {}) {
  // If level is given we set it directly ignoring operation.
  const elements = (selector) ? [...document.querySelectorAll(selector)] : [];
  elements.forEach((element) => {
    setLevelRecursively(element, { operation, level });
  });
}

export function getCurrentLevel(element) {
  return element.hasAttribute('data-annotation-level')
    ? parseInt(element.getAttribute('data-annotation-level'), 10)
    : -1;
}

export function setLevelRecursively(element, { operation, level }) {
  if (element.hasAttribute('data-annotation')) {
    const newLevel = level !== undefined ? level : getNewLevel(element, operation);
    element.setAttribute('data-annotation-level', newLevel);
  }
  [...element.children].forEach((child) => setLevelRecursively(child, { operation, level }));
}

export function generateTargetSelector(annotation) {
  // This function generates a CSS selector from
  // different possible sources within the annotation object.
  // Our first goal is to check for a selector object.
  // Selectors can have different types e.g. 'CssSelector' or 'SvgSelector'.
  // If no selector object is present we try to generate a CSS selector from target id.

  let result = null;
  const selector = annotation.target.length > 0 ? annotation.target[0].selector : undefined;

  if (!selector) {
    let targetId = annotation.target.id;

    if (targetId) {
      targetId = targetId.split('/').pop();
      result = `#annotation-${targetId}`;
    }
  } else if (selector.type === 'CssSelector') {
    result = handleCssSelector(selector);
  } else if (selector.type === 'FragmentSelector') {
    result = handleCssSelector(annotation.body.selector);
  }

  const isValid = Utils.isSelectorValid(result);

  return isValid ? result : null;
}

export function handleCssSelector(selector) {
  return selector.value ?? null;
}

export function addIcon(element, annotation, iconName) {
  let foundSvg = false;

  [...element.children].forEach((el) => {
    if (el.nodeName === 'svg' && el.getAttribute('data-annotation-icon')) {
      foundSvg = true;
    }
  });

  if (foundSvg) {
    return;
  }
  try {
    const svg = createSvgIcon(iconName);
    svg.setAttribute(
      'data-annotation-icon',
      annotation.id,
    );

    element.prepend(svg);
  } catch (err) {
    // error message
    console.log(err);
  }
}

export function removeIcon(annotation) {
  const stripeId = annotation.id;
  const el = document
    .querySelector(`figure[data-annotation-icon='${stripeId}']`);

  if (el) {
    el.remove();
  }
}

export function addWitness(target, witness, color) {
  // we create a witnesses wrapper on the same child level as the target due to styling reasons (i.e the witnesses chips should not be underlined and get the highlight color of the target)
  // therefore we need target index in order to find the witnesses wrapper element
  let parentEl = target.parentElement
  const targetIndex = [].slice.call(parentEl.children).indexOf(target)
  if (targetIndex < 0) return;

  const witnessEl = createWitnessEl(witness, color)

  let isWrapper = false
  if (targetIndex === 0) {
    // target is the only child element
    isWrapper = false
  } else {
    isWrapper = parentEl.children[targetIndex-1].classList.contains("witnesses")
  }

  if (isWrapper) {
    const wrapper = parentEl.children[targetIndex-1]
    wrapper.appendChild(witnessEl)
  } else {
      // witnesses wrapper which holds the witnesses 'chips' is not yet created -> we add the first witness
      // create witnesses Html
      const wrapper = createWitnessesWrapper()
      wrapper.appendChild(witnessEl)
      parentEl.insertBefore(wrapper, target)
  }
}


function createWitnessesWrapper() {
  const el = document.createElement("span");
  el.classList.add('witnesses', 't-inline-flex', 't-flex-wrap')

  return el
}

function createWitnessEl(witness, witnessColor) {
  // create a html element of one witness
  const el = document.createElement("span");
  el.innerHTML = witness && witness.idnoAlt ? witness.idnoAlt : '-';
  el.setAttribute('data-idno', witness.idno ?? '-');
  el.classList.add('t-rounded-3xl', 't-box-border', 't-py-0.5', 't-px-1.5', 't-text-xs', 't-font-semibold', 't-font-sans', 't-ml-[3px]')
  el.style.background = colors[witnessColor]['100']
  el.style.color = colors[witnessColor]['600']

  return el
}

export function removeWitnessesWrappers() {
  // remove witnesses in text Panel - it is used when switch off the variants tab
  const textPanelEls = document.querySelectorAll('.content-view')
  const wrappers = [];
  textPanelEls.forEach(textPanel => wrappers.push(...Array.from(textPanel.querySelectorAll('.witnesses'))));

  // each target has its witnesses wrapper; for every target we remove its witnesses wrapper
  wrappers.forEach((wrapper) => {
    wrapper.remove()
  })
}

export function removeWitness(selector, idno) {
  // find the witnesses span which contains each 'witness' span child element
  // find this witness inside the 'witnesses' html span and remove it
  const textPanels = document.querySelectorAll('.content-view')
  if (textPanels.length === 0) return;

  const index = Array.from(textPanels).findIndex(textPanel => textPanel.querySelectorAll('.witnesses').length > 0)

  if (index === -1) return;

  const wrapper = getWitnessesWrapper(selector)
  if (!wrapper) return;
  if (Array.from(wrapper.children).length === 0) return;

  const witnessEl = Array.from(wrapper.children).filter(item => item.getAttribute('data-idno') === idno)
  // witEl: refers to the current Witness chip that we will remove
  if (witnessEl.length > 0) witnessEl[0].remove()
}

export function getWitnessesWrapper(selector) {
  // selector represents the target text of a certain variant item
  // we aim to get the html element which contains the 'witnesses chips' related to the target.
  // this html element which contains the 'witnesses chips' is located before the target element
  const targetEl = document.querySelector(selector)
  if (!targetEl) return null

  const parentEl = targetEl.parentElement
  const targetIndex = [].slice.call(parentEl.children).indexOf(targetEl)
  if(targetIndex < 1) return null

  // witnesses el is placed before the target
  return parentEl.children[targetIndex-1]
}

export function getWitnessesList(wrapper) {
  // wrapper: witnesses html wrapper which belongs to a target
  // returns the list of witnesses(<string>) which belong to a witnesses wrapper
  let list = []
  if (!wrapper) return [];
  if(Array.from(wrapper.children).length === 0) return [];

  Array.from(wrapper.children).forEach((witness) => {
    list.push(witness.innerHTML)
  })
  return list
}


export function isVariant(annotation) {
  return annotation?.body['x-content-type'] === 'Variant';
}

export function getVariantAnnotations(annotations, type) {
  let list = []
  if (!annotations || annotations.length === 0) return []
  annotations.forEach((annotation) => {
      if (annotation.body['x-content-type'] === type) list.push(annotation)
    })

  return list
}


export function getAnnotationListElement(id, container) {
  return [...container.querySelectorAll('.q-item')].find((annotationItem) => {
    if (!annotationItem.hasAttribute('data-annotation-id')) return false;
    return annotationItem.getAttribute('data-annotation-id') === id;
  });
}

