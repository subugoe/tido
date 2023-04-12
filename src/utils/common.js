export const loadFont = (url, containerSelector) => {
  const fontStyle = 'normal';
  let fontWeight = 'normal';

  const root = document.querySelector(`${containerSelector} .tido`);

  if (!root) return false;

  const urlParts = url.split('/');
  if (urlParts.length === 0) return false;

  const fontFile = urlParts[urlParts.length - 1];
  const [fileName, fileFormat] = fontFile.split('.');
  if (fileName.toLowerCase().includes('bold')) fontWeight = 700;

  if (!fileName || !fileFormat) return false;

  const styleEl = document.createElement('style');

  styleEl.id = url;

  styleEl.innerHTML = '@font-face {\n'
    + `  font-family: "${fileName}";\n`
    + `  font-weight: ${fontWeight};\n`
    + `  font-style: ${fontStyle};\n`
    + `  src: url(${url}) format("${fileFormat}");\n`
    + '}';

  root.appendChild(styleEl);
  return true;
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
  if (!element || !root) return false;

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
