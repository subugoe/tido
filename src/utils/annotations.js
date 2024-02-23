import * as Utils from '@/utils/index';
import { icon } from '@/utils/icon';
import { i18n } from '@/i18n';

// utility functions that we can use as generic way for perform tranformation on annotations.

export function addHighlightToElements(selector, root, annotationId) {
  const selectedElements = selector
    .split(',')
    .map((selectorPart) => [...root.querySelectorAll(selectorPart.replace(':', '--'))])
    .flat();

  if (selectedElements.length === 0) {
    return;
  }

  // const strippedAnnotationId = stripAnnotationId(annotationId);

  selectedElements.forEach((element) => {
    element.setAttribute('data-annotation', true);
    Utils.addToAttribute(element, 'data-annotation-ids', annotationId);
    // element.classList.add(strippedAnnotationId);
    element.setAttribute('data-annotation-level', -1);
  });
}

export function addRangeHighlightAttributes(id, root) {
  const start = root.querySelector(`[data-target="${id}_start"]`);
  const end = root.querySelector(`[data-target="${id}_end"]`);

  let started = false;
  let ended = false;

  function replaceRecursive(element) {
    if (!element.childNodes) return;

    [...element.childNodes].forEach((childNode) => {
      if (childNode === start) started = true;
      if (childNode === end) ended = true;

      if (ended) return;

      if (childNode.nodeName === 'SPAN' && childNode.getAttribute('data-annotation') && started) {
        Utils(id);
      }

      if (childNode.nodeName === '#text') {
        if (started) {
          if (childNode.textContent && childNode.textContent.trim()) {
            element.classList.add(id);
            element.setAttribute('data-annotation', true);
          }
        }
      } else {
        replaceRecursive(childNode);
      }
    });
  }

  replaceRecursive(root);
  return root;
}

export const createSvgIcon = (name) => {
  const [path, viewBox] = icon(name).split('|');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('class', 'q-icon q-mx-xs');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('role', 'presentation');
  svg.setAttribute('style', 'border:0 !important;');
  svg.setAttribute('viewBox', viewBox);

  path.split('&&').forEach((pathPart) => {
    const [d, style] = pathPart.split('@@');

    const newPath = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path',
    );

    newPath.setAttribute('d', d);
    newPath.setAttribute('style', style);
    svg.appendChild(newPath);
  });

  return svg;
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
    template += `<div class="tooltip-body q-mt-sm">
        <h4 class="q-my-sm">${i18n.global.t('more_annotations')}:</h4>
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

export function highlightTargets(selector, { operation, level }) {
  // If level is given we set it directly ignoring operation.

  const elements = (selector) ? [...document.querySelectorAll(selector)] : [];
  elements.forEach((element) => {
    setLevelRecursively(element, { operation, level });
  });
}

export function setLevelRecursively(element, { operation, level }) {
  if (element.hasAttribute('data-annotation')) {
    const newLevel = level !== undefined ? level : getNewLevel(element, operation);
    element.setAttribute('data-annotation-level', newLevel);
  }
  [...element.children].forEach((child) => setLevelRecursively(child, { operation, level }));
}

export function stripSelector(value) {
  if (!value) {
    return null;
  }
  return `.${value
    .replace("span[data-target='", '')
    .replace("'", '')
    .replace('_start]', '')
    .replace('_end]', '')}`;
}

export function updateTextContentClass(element, task = 'add', ...className) {
  if (!element) {
    return;
  }
  element.classList[task](...className);
}

export function toggleAnnotationSelector(annotation, text = 'toggle') {
  const id = annotation.target.selector.startSelector.value
    .replace("span[data-target='", '')
    .replace("_start']", '');

  const isOverlap = id.includes('Overlap');
  [...document.querySelectorAll(`.${id}`)].forEach((el) => updateTextContentClass(
    el,
    text,
    isOverlap ? 'annotation-disabled-overlap' : 'annotation-disabled',
  ));
}

export function getAllElementsFromSelector(selector) {
  return [...document.querySelectorAll(selector)];
}

export const isHighestAnnotationElement = (el) => {
  let current = el;

  while (current.parentElement.getAttribute('data-annotation')) {
    current = current.parentElement;
  }

  return current && current !== el;
};

export const hasParentAnnotation = (el) => {
  const maxLevelEl = document.getElementById('text-content');

  let current = el;
  let hasParent = false;
  while (current !== maxLevelEl) {
    current = current.parentElement;
    if (current.hasAttribute('data-annotation')) {
      hasParent = true;
      break;
    }
  }

  return hasParent;
};

export function isAnnotationSelected(el) {
  if (!el.hasAttribute('data-annotation-level')) return false;
  return parseInt(el.getAttribute('data-annotation-level'), 10) > 0;
}

// export const isAnnotationSelected = (el) => {
//   const key = el.getAttribute('data-annotation-level');
//   if (el[key] !== undefined) {
//     return el[key];
//   }
//   const innerQueue = [];
//
//   // this logic checks the child spans and their classes.
//   innerQueue.push(el);
//   let matched = false;
//
//   while (innerQueue.length) {
//     const popped = innerQueue.pop();
//     if (parseInt(popped.getAttribute('data-annotation-level'), 10) > 0) {
//       matched = true;
//     } else {
//       [...popped.children].forEach((child) => {
//         innerQueue.push(child);
//       });
//     }
//   }
//
//   // this logic checks the outer spans and their classes.
//   if (!matched) {
//     const outerQueue = [];
//     outerQueue.push(el);
//
//     while (outerQueue.length) {
//       const popped = outerQueue.pop();
//       if (parseInt(popped.getAttribute('data-annotation-level'), 10) > 0) {
//         matched = true;
//       } else if (popped.parentElement.getAttribute('data-annotation')) {
//         outerQueue.push(popped.parentElement);
//       }
//     }
//   }
//
//   return matched;
// };

export function generateTargetSelector(annotation) {
  // This function generates a CSS selector from
  // different possible sources within the annotation object.
  // Our first goal is to check for a selector object.
  // Selectors can have different types e.g. 'CssSelector' or 'SvgSelector'.
  // If no selector object is present we try to generate a CSS selector from target id.

  let result = null;

  console.log('Type of target',typeof annotation.target);
  console.log('Annotation target', annotation.target);
  console.log('Is target Array', annotation.target instanceof Array);
  const { selector } = (annotation.target.length > 0) ? annotation.target[0] : null;
  //const selector = (annotation.target.length > 0) ? annotation.target[0] : null;

  if (!selector) {
    let targetId = annotation.id;
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
  }
}

export function removeIcon(annotation) {
  const stripeId = annotation.id;
  const el = document
    .querySelector(`svg[data-annotation-icon='${stripeId}']`);

  if (el) {
    el.remove();
  }
}

export function getAnnotationListElement(id, container) {
  return [...container.querySelectorAll('.q-item')].find((annotationItem) => {
    if (!annotationItem.hasAttribute('data-annotation-id')) return false;
    return annotationItem.getAttribute('data-annotation-id') === id;
  });
}
