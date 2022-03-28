import * as Icons from '@quasar/extras/fontawesome-v5';

// utility functions that we can use as generic way for perform tranformation on annotations.

export function addHighlightToElements(selector, root, data) {
  console.log('addHighlightToElements');
  const selectedElements = root.querySelectorAll(selector);
  if (selectedElements.length === 0) {
    return;
  }

  console.log('addHighlightToElements', selectedElements);

  const { annotationId } = data;

  function recursiveAddClass(elements) {
    elements.forEach((element) => {
      element.setAttribute('data-annotation', true);

      let annotationIds = element.hasAttribute('data-annotation-ids')
        ? element.getAttribute('data-annotation-ids').split(' ')
        : [];
      annotationIds = [...annotationIds, annotationId];
      element.setAttribute('data-annotation-ids', annotationIds.join(' '));

      console.log(element.children);
      recursiveAddClass([...element.children]);
    });
  }
  recursiveAddClass(selectedElements);
}

export function replaceSelectorWithSpan(selector, root) {
  const start = root.querySelector(`[data-target="${selector}_start"]`);
  const end = root.querySelector(`[data-target="${selector}_end"]`);

  let started = false;
  let ended = false;

  function replaceRecursive(element) {
    if (!element.childNodes) return;

    [...element.childNodes].forEach((childNode) => {
      if (childNode === start) started = true;
      if (childNode === end) ended = true;

      if (ended) return;

      if (childNode.nodeName === 'SPAN' && childNode.getAttribute('data-annotation') && started) {
        childNode.classList.add(selector);
      }

      if (childNode.nodeName === '#text') {
        if (started) {
          if (childNode.textContent && childNode.textContent.trim()) {
            const span = document.createElement('span');

            span.setAttribute('class', selector);
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

export function addHighlighterAttributes(dom) {
  this.mapUniqueElements(
    this.findDomElements('[data-target]:not([value=""])', dom),
    (x) => x.getAttribute('data-target').replace('_start', '').replace('_end', ''),
  ).forEach((selector) => replaceSelectorWithSpan(selector, dom));

  this.mapElements(this.findDomElements('[id]', dom), (x) => x.getAttribute('id')).forEach((selector) => addHighlightToElements(selector, dom));
}

export function getAnnotationContentIds() {
  return [...document.querySelectorAll('[data-annotation]')]
    .map((element) => element.getAttribute('data-annotation-ids'))
    .reduce((acc, cur) => {
      (cur || '')
        .split(' ')
        .forEach((annotationId) => {
          acc[annotationId] = true;
        });
      return acc;
    }, {});
  // return this.mapElements(this.findDomElements('[data-annotation]', dom), (x) => x.getAttribute('class')).reduce((prev, curr) => {
  //   (curr || '').split(' ').forEach((c) => {
  //     prev[c.replace(/\./g, '')] = true;
  //   });
  //   return prev;
  // }, {});
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

export function getAnnotationIcon(contentType, types) {
  const { icon } = types.filter(
    (annotation) => annotation.contenttype === contentType,
  )[0];

  const svg = createSvgIcon(icon);

  return svg;
}

export function createTooltip(element, annotationClasses, config) {
  const tooltipEl = document.createElement('span');
  tooltipEl.setAttribute('data-annotation-classes', `${element.className}`);
  tooltipEl.setAttribute('class', 'annotation-tooltip');

  const isMultiple = annotationClasses.length > 1;

  let annotationLists = '';
  annotationClasses.forEach((annotationList) => {
    annotationLists += `
      <div class="referenced-annotation">
        ${
  getAnnotationIcon(
    annotationList.contentType,
    config.annotations.types,
  ).outerHTML
}
          <span>
            ${annotationList.value}
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

export function getElementById(id) {
  if (!id) {
    return null;
  }

  return document.getElementById(id.replace(/#/g, ''));
}

export function getNewLevel(element, operation) {
  const currentLevel = parseInt(
    element.getAttribute('data-annotation-level'),
    10,
  );
  if (operation === 'INC') {
    return currentLevel + 1;
  }
  if (currentLevel !== 0) {
    return currentLevel - 1;
  }
  return currentLevel;
}

export function setHighlightLevel0(annotationId) {
  if (!annotationId) {
    return;
  }
  element.setAttribute('data-annotation-level', 0);

  [...element.children].forEach((child) => {
    child.setAttribute('data-annotation-level', 0);
    setHighlightLevel0(child);
  });
}

export function stripId(val) {
  if (!val) {
    return '';
  }
  return val.replace(/-/g, '.').replace(/[^.0-9]/g, '');
}

export function stripSelector(annotation) {
  return `.${annotation.target.selector.startSelector.value
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

export function stripTargetId(annotation, removeDot = true) {
  let output = '';
  if (annotation.target.selector) {
    output = stripSelector(annotation);
  } else {
    output = stripAnnotationId(annotation.target.id);
  }

  return removeDot ? output.replace(/\./g, '') : output;
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

export function getAllElementsFromSelector(selector, arr = []) {
  const el = document.getElementById(selector);
  if (el) {
    // https://www.geeksforgeeks.org/queue-data-structure/
    const queue = [];

    queue.push(el);

    while (queue.length) {
      const popped = queue.pop();
      arr.push(popped);
      [...popped.children].forEach((child) => {
        queue.push(child);
      });
    }
    return arr;
  }

  return [...document.querySelectorAll(selector)];
}

export function highlightActiveContent(annotations) {
  annotations.forEach((annotation) => {
    const { selector } = annotation.target;
    if (selector && selector.value) {
      getAllElementsFromSelector(selector.value)
        .forEach((element) => {
          element.setAttribute('data-annotation-level', 0);
        });
    } else {
      // [...document.querySelectorAll(`.${stripTargetId(el)}`)].map((x) => x.setAttribute('data-annotation-level', 0));
    }
  });
}

export function updateHighlightState(selector, operation, level) {
  getAllElementsFromSelector(selector).forEach((el) => el.setAttribute(
    'data-annotation-level',
    level || getNewLevel(el, operation),
  ));
}

export const backTrackNestedAnnotations = (el, classNames = []) => {
  let current = el;

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
