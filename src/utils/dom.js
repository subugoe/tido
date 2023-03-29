export function findDomElement(selector, dom = document) {
  const element = dom.querySelector(selector);
  if (!element) {
    return null;
  }

  return element;
}

export function findDomElementById(id, dom = document) {
  const element = dom.getElementById(id);
  if (!element) {
    return null;
  }

  return element;
}

export function findDomElements(selector, dom = document) {
  return [...dom.querySelectorAll(selector)];
}

export function mapUniqueElements(elements, mapFn) {
  return [...new Set(elements.map(mapFn))];
}

export function mapElements(elements, mapFn) {
  return [...elements.map(mapFn)];
}

export function manipulateDomElements(elements, mapFn) {
  return [...elements.map(mapFn)];
}

const queryCheck = (s) => document.createDocumentFragment().querySelector(s);

export const isSelectorValid = (selector) => {
  try { queryCheck(selector); } catch { return false; }
  return true;
};

export function addToAttribute(element, attribute, newValue) {
  const oldValue = element.getAttribute(attribute);
  if (oldValue) {
    if (!oldValue.match(newValue)) {
      element.setAttribute(attribute, `${oldValue} ${newValue}`);
    }
  } else {
    element.setAttribute(attribute, newValue);
  }
}

export function elemToSelector(el) {
  if (el.id === 'text-content') return '#text-content';
  let str = el.tagName.toLowerCase();

  if (el.id !== '') {
    str += `#${el.id}`;
  } else if (el.className) {
    const classes = el.className.trim().split(/\s+/);
    for (let i = 0; i < classes.length; i++) {
      str += `.${classes[i]}`;
    }
  }

  if (el.hasAttribute('data-target')) {
    str += `[data-target=${el.getAttribute('data-target')}]`;
  }

  // if(document.querySelectorAll(str).length === 1) return str;

  return `${elemToSelector(el.parentNode)} > ${str}`;
}

export function getValuesFromAttribute(element, attribute) {
  const value = element.getAttribute(attribute);
  return value ? value.split(' ') : [];
}
