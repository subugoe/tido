import * as Icons from '@quasar/extras/fontawesome-v5';

// utility functions that we can use as generic way for perform tranformation on annotations.

export function addHighlighterAttributes(dom) {
  this.mapUniqueElements(
    this.findDomElements('[data-target]:not([value=""])', dom),
    (x) => x.getAttribute('data-target').replace('_start', '').replace('_end', ''),
  ).forEach((selector) => this.replaceSelectorWithSpan(selector, dom));

  this.mapElements(this.findDomElements('[id]', dom), (x) => x.getAttribute('id')).forEach((selector) => this.addHighlightToTargetIds(selector, dom));
}

export function getAnnotationContentIds(dom) {
  return this.mapElements(this.findDomElements('[data-annotation]', dom), (x) => x.getAttribute('class')).reduce((prev, curr) => {
    (curr || '').split(' ').forEach((c) => {
      prev[c.replace(/\./g, '')] = true;
    });
    return prev;
  }, {});
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
