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

  const fontFace = new FontFace(fontFamily, `url(${url})`, {style, weight});

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

// export const isInViewport = (element) => {
//   const rect = element.getBoundingClientRect();
//   return (
//     rect.top >= 0
//     && rect.left >= 0
//     && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
//     && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
//   );
// };

export const isElementVisible = (el, root) => {
  // root = root || document.body;
  // const { top, bottom, height } = el.getBoundingClientRect();
  // const { top: rootTop, bottom: rootBottom } = root.getBoundingClientRect();
  // console.log(el.getBoundingClientRect())
  // console.log(top, rootTop, bottom, rootBottom, bottom - rootBottom, height * 0.3)
  // // 70% should be visible then true
  // return top <= rootTop ? rootTop - top <= height : bottom - rootBottom <= height * 0.3;

  let percentX = null;
  let percentY = 70;

  const tolerance = 0.01; // needed because the rects returned by getBoundingClientRect provide the position up to 10 decimals
  if (percentX == null) {
    percentX = 100;
  }
  if (percentY == null) {
    percentY = 100;
  }

  const elementRect = el.getBoundingClientRect();
  const rootRect = root.getBoundingClientRect();

  // const visiblePixelX = Math.min(elementRect.right, rootRect.right) - Math.max(elementRect.left, rootRect.left);
  const visiblePixelY = Math.min(elementRect.bottom, rootRect.bottom) - Math.max(elementRect.top, rootRect.top);
  // const visiblePercentageX = visiblePixelX / elementRect.width * 100;
  const visiblePercentageY = visiblePixelY / elementRect.height * 100;
  // console.log(elementRect.top, rootRect.top);
  // console.log(elementRect.bottom, rootRect.bottom);
  // return /* visiblePercentageX + tolerance > percentX && */ visiblePercentageY + tolerance > percentY;

  const { top, bottom } = el.getBoundingClientRect();

  console.log(top, rootRect.top, root.scrollTop, bottom, rootRect.height)
  return top >= 0 && bottom <= rootRect.height;
};
