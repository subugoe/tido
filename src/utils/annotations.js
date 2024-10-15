import * as Utils from '@/utils/index';
import { getIcon } from '@/utils/icons';
import { i18n } from '@/i18n';
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
  const style = document.createElement('style');
  figure.classList.add(...['t-relative', 't-inline-flex', 't-w-4', 't-h-4', 'after:t-absolute', 'after:t-left-0', 'after:t-top-0', 'after:t-w-full', 'after:t-h-full']);
  figure.classList.add(`icon-${name}`);
  style.innerHTML = `
    .icon-${name}::after {
      content: url('data:image/svg+xml; utf8, ${iconString}') !important;
    }
  `;
  figure.appendChild(style);
  return figure;
};

export async function createOrUpdateTooltip(element, { closest: closestAnnotation, other: otherAnnotations }, root) {
  const tooltipId = 'annotation-tooltip';
  let tooltipEl = root.querySelector(tooltipId);

  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    root.onmousemove = null;

    root.addEventListener('mousemove', (event) => {
      const { clientX: x, clientY: y } = event;
      tooltipEl.style.top = `${y}px`;
      tooltipEl.style.left = `${x}px`;
    });
    root.append(tooltipEl);
  }

  tooltipEl.id = tooltipId;

  // Display the current annotation that the user has hovered on
  const closestAnnotationTemplate = `
    <div class="referenced-annotation">
      ${createSvgIcon(closestAnnotation.name)?.outerHTML}<span>${closestAnnotation.value}</span>
    </div>
  `;

  let otherAnnotationsTemplate = '';

  otherAnnotations.forEach((item) => {
    otherAnnotationsTemplate += `
      <div class="referenced-annotation">
        ${createSvgIcon(item.name)?.outerHTML}<span>${item.value}</span>
      </div>
      `;
  });

  let template = `
    <div class="tooltip-header">${closestAnnotationTemplate}</div>`;

  if (otherAnnotations.length > 0) {
    template += `<div class="tooltip-body q-mt-2">
        <h4 class="q-my-2">${i18n.global.t('more_annotations')}:</h4>
        <div class="text-body2">${otherAnnotationsTemplate}</div>
      </div>
    `;
  }

  tooltipEl.innerHTML = template;

  setTimeout(() => tooltipEl.classList.add('annotation-animated-tooltip'), 10);

  return tooltipEl;
}

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
  } else if (selector.type === 'RangeSelector') {
    result = handleRangeSelector(selector);
  }

  const isValid = Utils.isSelectorValid(result);

  return isValid ? result : null;
}

export function handleCssSelector(selector) {
  return selector.value ?? null;
}

export function handleRangeSelector(selector) {
  const { startSelector, endSelector } = selector;
  if (startSelector && endSelector) {
    if (startSelector.type === 'CssSelector') {
      const start = document.querySelector(handleCssSelector(startSelector).replaceAll('\'', ''));
      const end = document.querySelector(handleCssSelector(endSelector).replaceAll('\'', ''));

      const elementsInRange = [];

      let started = false;
      let ended = false;

      // eslint-disable-next-line no-inner-declarations
      function findElementsInRangeRecursive(element) {
        if (element === start) started = true;
        if (element === end) {
          ended = true;
          return;
        }

        if (started && element.nodeValue !== ' ' && element.nodeName === '#text') {
          elementsInRange.push(element.parentElement);
          return;
        }

        [...element.childNodes]
          .filter((childNode) => childNode.nodeName !== 'STYLE' && childNode.nodeName !== 'SCRIPT' && childNode.nodeName !== 'svg')
          .forEach((childNode) => {
            if (!ended) {
              findElementsInRangeRecursive(childNode);
            }
          });
      }

      findElementsInRangeRecursive(document.getElementById('text-content'));

      return elementsInRange.map((el) => Utils.elemToSelector(el)).join(',');
    }
  }
  return null;
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
  let parentEl = target.parentElement
  const targetIndex = [].slice.call(parentEl.children).indexOf(target)
  if (targetIndex < 0) return;

  const witEl = createWitHtml(witness, color)
  const isWitnessesEl = parentEl.children[targetIndex-1].classList.contains("witnesses")

  if (isWitnessesEl) {
    let witnessesEl = parentEl.children[targetIndex-1]
    witnessesEl.appendChild(witEl)
  } else {
      // witnesses element which holds the witnesses 'chips' is not yet created -> we add the first witness 
      // create witnesses Html 
      const witnessesEl = createWitnessesWrapper()
      witnessesEl.appendChild(witEl)
      parentEl.insertBefore(witnessesEl, target)
  }
}


function createWitnessesWrapper() {
  const witnessesEl = document.createElement("span");
  witnessesEl.classList.add('witnesses')

  return witnessesEl
}

function createWitHtml(witness, witnessColor) {
  // create an html element of one witness
  const witnessEl = document.createElement("span");
  witnessEl.innerHTML = witness
  witnessEl.classList.add('t-rounded-3xl', 't-box-border', 't-h-8', 't-py-0.5', 't-px-1.5', 't-text-xs', 't-font-semibold', 't-ml-[3px]')
  witnessEl.style.background = colors[witnessColor]['100']
  witnessEl.style.color = colors[witnessColor]['600']

  return witnessEl
}

export function removeChipsFromOtherViews() {
  const textPanelEl = document.querySelector('#text-content')
  const witnessesElements = textPanelEl.getElementsByClassName('witnesses')
  if (!witnessesElements) return;
  if(Array.from(witnessesElements).length === 0) return;

  // each target has its witnesses wrapper; for every target we remove its witnesses wrapper
  Array.from(witnessesElements).forEach((witnesses) => {
    witnesses.remove()
  })
}

export function removeWitness(selector, witness) {
  // find the witnesses span which contains each 'witness' span child element
  // find this witness inside the 'witnesses' html span and remove it
  const textPanel = document.querySelector('#text-content')
  if (!textPanel.querySelector('.witnesses')) return;

  const witnessesEl = getWitnessesHtmlEl(selector)
  if (!witnessesEl) return;
  if (Array.from(witnessesEl.children).length === 0) return;

  const witEl = Array.from(witnessesEl.children).filter(item => item.innerHTML === witness)  
  // witEl: refers to the current Witness chip that we will remove
  if (witEl.length > 0) witEl[0].remove()
}

export function getWitnessesHtmlEl(selector) {
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

export function getWitnessesList(witnessesEl) {
  // returns the list of witnesses(<string>) which are already selected
  let witnessesList= []
  if (!witnessesEl) return [];
  if(Array.from(witnessesEl.children).length === 0) return [];

  Array.from(witnessesEl.children).forEach((witness) => {
    witnessesList.push(witness.innerHTML)
  })
  return witnessesList
}


export function isVariant(annotation) {
  return annotation.body['x-content-type'] === 'Variant';
}


export function getAnnotationListElement(id, container) {
  return [...container.querySelectorAll('.q-item')].find((annotationItem) => {
    if (!annotationItem.hasAttribute('data-annotation-id')) return false;
    return annotationItem.getAttribute('data-annotation-id') === id;
  });
}

