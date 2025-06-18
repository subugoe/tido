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

export function getValuesFromAttribute(element, attribute) {
  const value = element.getAttribute(attribute);
  return value ? value.split(' ') : [];
}

export function scrollIntoViewIfNeeded(target, container) {
  const { bottom: targetBottom, top: targetTop } = target.getBoundingClientRect();
  const { top: containerTop, height: containerHeight } = container.getBoundingClientRect();

  if (targetBottom > containerHeight || targetTop < containerTop) {
    target.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
}
