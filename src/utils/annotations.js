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

export function addWitness(targetHtmlEl, witness, color) {
  const parentEl = targetHtmlEl.parentElement
  const indexOfTarget = [].slice.call(parentEl.children).indexOf(targetHtmlEl)
  const witHtml = createCurrWitHtml(witness, color)

  if(!parentEl.children[indexOfTarget-1].classList.contains("witnesses")) {
    // if the previous element in DOM does not contains 'witnesses chips' then create the 'parent' span of the 'witnesses chips'
    // Create another function - like create 'witnesses' Html element
    const witnessesHtmlEl = document.createElement("span");
    witnessesHtmlEl.classList.add('witnesses')

    witnessesHtmlEl.prepend(witHtml)
    parentEl.insertBefore(witnessesHtmlEl, targetHtmlEl)
  }
  else {
    // get the target element and get the previous element - which we know is the 'witnesses' span list
    // get the witnessesHtml element and append the witHtml element
    let witnessesHtmlEl = parentEl.children[indexOfTarget-1]
    witnessesHtmlEl.appendChild(witHtml)
  }
}

function createCurrWitHtml(witness, witnessColor) {
  // create an html element of the selected witness
  const witHtml = document.createElement("span");
  witHtml.innerHTML = witness
  witHtml.classList.add('t-rounded-3xl', 't-box-border', 't-h-8', 't-py-0.5', 't-px-1.5', 't-text-xs', 't-font-semibold', 't-ml-[3px]')
  witHtml.style.background = colors[witnessColor]['100']
  witHtml.style.color = colors[witnessColor]['600']


  return witHtml
}

export function removeChipsFromOtherViews() {
  const textPanelEl = document.querySelector('#text-content')
  const witnessesHtmlElements = textPanelEl.getElementsByClassName('witnesses')
  if( witnessesHtmlElements ) {
    Array.from(witnessesHtmlElements).forEach((witnesses) => {
      witnesses.remove()
    })
  }
}

export function removeWitness(selector, witness) {
  // find the witnesses span which contains each 'witness' span child element
  // find this witness inside the 'witnesses' html span and remove it

  const witnessesHtmlEl = getWitnessesHtmlEl(selector)
  const witHtml = Array.from(witnessesHtmlEl.children).filter(item => item.innerHTML === witness)
  witHtml[0].remove()
}

export function getWitnessesHtmlEl(selector) {
  // selector represents the target text of a certain variant item
  // we aim to get the html element which contains the 'witnesses chips' related to the target.
  // this html element which contains the 'witnesses chips' is located before the target element
  const targetHtmlEl = document.querySelector(selector)
  const parentEl = targetHtmlEl.parentElement
  const indexOfTarget = [].slice.call(parentEl.children).indexOf(targetHtmlEl)
  const witnessesHtmlEl = parentEl.children[indexOfTarget-1]

  return witnessesHtmlEl
}

export function getWitnessesList(witnessesHtml) {
  // returns the list of witnesses(<string>) which are already selected
  let witnessesList= []
  Array.from(witnessesHtml.children).forEach((witnessHtml) => {
    witnessesList.push(witnessHtml.innerHTML)
  })
  return witnessesList
}

export function unselectVariantItems(variantItemsSelection) {
  let newVariantItemsSelection = {}
  Object.keys(variantItemsSelection).forEach((wit) => {
    newVariantItemsSelection[wit] = false
  })
  return newVariantItemsSelection
}

export function addWitnessesChipsWhenSelectText(variantItemsSelection, selector, variantItemsColors) {
  // variantItemsSelection: JSON object of 'witness name': 'true'
  // this function aims to add all witnesses on the highlighted text when we click on the text

  Object.keys(variantItemsSelection).forEach((witness) => {
    addWitness(selector, witness, variantItemsColors)
  })
}

export function removeWitnessesChipsWhenDeselectText(witnessesList, selector) {
  witnessesList.forEach((witness) => {
    removeWitness(selector, witness)
  })
}

export function isVariant(annotation) {
  return annotation.body['x-content-type'] === 'Variant';
}

export function initVariantItemsSelection(annotation, value) {
  // initialize with the boolean of 'value' variable
  let variantItemsSelection = {}
  annotation.body.value.forEach((variantItem) => {
    variantItemsSelection[variantItem.witness] = value
  } )
  return variantItemsSelection
}

export function getAnnotationListElement(id, container) {
  return [...container.querySelectorAll('.q-item')].find((annotationItem) => {
    if (!annotationItem.hasAttribute('data-annotation-id')) return false;
    return annotationItem.getAttribute('data-annotation-id') === id;
  });
}
