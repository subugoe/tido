export const loadFont = async (url) => {
  let style = 'normal';
  let weight = 'normal';
  let fontFamily;

  if (url.endsWith('italic.woff')) {
    fontFamily = 'SertoJerusalemItalic';
    style = 'italic';
  }

  if (url.endsWith('bold.woff')) {
    fontFamily = 'SertoJerusalemBold';
    weight = 700; // https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-weight
  }

  if (url.endsWith('syrcomedessa.woff')) {
    fontFamily = 'Estrangelo Edessa';
  }

  if (url.endsWith('syrcomjerusalem.woff')) {
    fontFamily = 'Serto Jerusalem';
  }

  const fontFace = new FontFace(fontFamily, `url(${url})`, { style, weight });

  const loadedFont = await fontFace.load();

  document.fonts.add(loadedFont);
};

export const onlyIf = (condition, fn) => {
  if (condition) {
    fn();
  }
};

export const loadCss = (url) => {
  const element = document.createElement('link');

  element.setAttribute('rel', 'stylesheet');
  element.setAttribute('type', 'text/css');
  element.setAttribute('href', url);
  element.setAttribute('id', url);

  document.head.appendChild(element);
};

export const delay = async (ms = 2500) => new Promise((resolve) => setTimeout(resolve, ms));

export const domParser = (data) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(data, 'text/html');

  return dom;
};

export const isUrl = (str) => {
  if (!str) return false;

  let url;
  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
};

export const isElementVisible = (element, root) => {
  // Get the position of the element relative to the root element
  const elementRect = element.getBoundingClientRect();
  const rootRect = root.getBoundingClientRect();

  // Calculate the amount of the element that is visible within the root element
  const visibleHeight = Math.min(elementRect.bottom, rootRect.bottom) - Math.max(elementRect.top, rootRect.top);

  // Calculate the percentage of the element that is visible within the root element
  const percentageVisible = visibleHeight / elementRect.height;

  // Return true if the element is at least 70% visible within the root element, false otherwise
  return percentageVisible >= 0.7;
};
