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
