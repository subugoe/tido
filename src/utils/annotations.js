import * as Icons from '@quasar/extras/fontawesome-v5';
import * as Utils from '@/utils/index';

// utility functions that we can use as generic way for perform tranformation on annotations.

export function addHighlightToElements(selector, root, annotationId) {
  const selectedElements = root.querySelectorAll(selector);
  if (selectedElements.length === 0) {
    return;
  }

  const strippedAnnotationId = stripAnnotationId(annotationId);

  function recursiveAddClass(elements) {
    elements.forEach((element) => {
      element.setAttribute('data-annotation', true);

      element.classList.add(strippedAnnotationId);
      element.setAttribute('data-annotation-level', -1);

      recursiveAddClass([...element.children]);
    });
  }

  recursiveAddClass(selectedElements);
}

export function replaceSelectorWithSpan(id, root) {
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
        childNode.classList.add(id);
      }

      if (childNode.nodeName === '#text') {
        if (started) {
          if (childNode.textContent && childNode.textContent.trim()) {
            const span = document.createElement('span');

            span.classList.add(id);
            span.setAttribute('data-annotation', true);
            span.innerHTML = childNode.textContent;
            childNode.replaceWith(span);
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

export function getAnnotationTabs(config) {
  const tabConfig = config?.annotations?.tabs || {};
  return Object.entries(tabConfig).map(([key, data]) => {
    if (Array.isArray(data)) {
      return {
        key,
        collectionTitle: key,
        contentType: 'annotation',
        type: data,
      };
    }
    return {
      key,
      collectionTitle: key,
      contentType: data.contentType || 'annotation',
      type: data?.type,
    };
  });
}

export const createSvgIcon = (name) => {
  const [path, viewBox] = Icons[name].split('|');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('class', 'q-icon q-mx-xs');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('role', 'presentation');
  svg.setAttribute('viewBox', viewBox);

  const newPath = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path',
  );

  newPath.setAttribute('d', path);
  svg.appendChild(newPath);

  return svg;
};

export function createTooltip(element, data) {
  const tooltipEl = document.createElement('span');
  tooltipEl.setAttribute('data-annotation-classes', `${element.className}`);
  tooltipEl.setAttribute('class', 'annotation-tooltip');

  const isMultiple = data.length > 1;

  let annotationLists = '';
  data.forEach((item) => {
    annotationLists += `
      <div class="referenced-annotation">
        ${createSvgIcon(item.name).outerHTML}
          <span>
            ${item.value}
          </span>
      </div>
      `;
  });

  const text = `
    <span class="text-body1">
    ${
  !isMultiple
    ? `${this.$t('toolTip_Reference')}`
    : `${this.$t('toolTip_References')}`
}:
      </span>
      <br>
      <div class="text-body2">
      ${annotationLists}
      </div>
  `;

  tooltipEl.innerHTML = text;
  const tooltipId = `${element.className
    .split(' ')
    .join('')}annotation-tooltip`;
  tooltipEl.setAttribute('id', tooltipId);
  window.top.el = element;

  const r = element.getBoundingClientRect();

  tooltipEl.style.top = `${r.y + r.height}px`;
  tooltipEl.style.left = `${r.x}px`;

  document.querySelector('body').append(tooltipEl);

  setTimeout(() => tooltipEl.classList.add('annotation-animated-tooltip'), 10);
}

export function getNewLevel(element, operation) {
  const currentLevel = parseInt(
    element.getAttribute('data-annotation-level'),
    10,
  );
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
    const newLevel = level !== undefined ? level : getNewLevel(element, operation);
    element.setAttribute('data-annotation-level', newLevel);
  });
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

export function stripAnnotationId(url) {
  if (!url) {
    return '';
  }
  return url.split('/').pop();
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

export const backTrackNestedAnnotations = (el, classNames = []) => {
  let current = el;

  classNames.push(current.className);

  while (
    current.parentElement.getAttribute('data-annotation')
    && current.parentElement.childNodes.length === 1
  ) {
    classNames.push(current.className);
    current = current.parentElement;
  }

  return el;
};

const annotationCache = {};

export const isAnnotationSelected = (el) => {
  const key = el.getAttribute('class');
  if (el[key] !== undefined) {
    return el[key];
  }
  const innerQueue = [];

  // this logic checks the child spans and their classes.
  innerQueue.push(el);
  let matched = false;

  while (innerQueue.length) {
    const popped = innerQueue.pop();
    if (parseInt(popped.getAttribute('data-annotation-level'), 10) > 0) {
      matched = true;
    } else {
      [...popped.children].forEach((child) => {
        innerQueue.push(child);
      });
    }
  }

  // this logic checks the outer spans and their classes.
  if (!matched) {
    const outerQueue = [];
    outerQueue.push(el);

    while (outerQueue.length) {
      const popped = outerQueue.pop();
      if (parseInt(popped.getAttribute('data-annotation-level'), 10) > 0) {
        matched = true;
      } else if (popped.parentElement.getAttribute('data-annotation')) {
        outerQueue.push(popped.parentElement);
      }
    }
  }

  annotationCache[key] = matched;

  return matched;
};

export function generateTargetSelector(annotation) {
  // This function generates a CSS selector from
  // different possible sources within the annotation object.
  // Our first goal is to check for a selector object.
  // Selectors can have different types e.g. 'CssSelector' or 'SvgSelector'.
  // If no selector object is present we try to generate a CSS selector from target id.

  let result = null;

  const { selector } = annotation.target;

  if (!selector) {
    let targetId = annotation.target.id;

    if (targetId) {
      targetId = targetId.split('/').pop();
      result = `#${targetId}`;
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
      return stripSelector(handleCssSelector(startSelector));
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
