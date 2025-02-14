const AUTO_SCROLLING_ATTR_NAME = 'data-auto-scrolling'

function syncScrollPosition(source: HTMLElement, target: HTMLElement) {
  setAutoScrolling(target)
  target.scrollTop = (source.scrollTop ?? 0) + 20
}

function isAutoScrolling(container: HTMLElement) {
  return container.hasAttribute(AUTO_SCROLLING_ATTR_NAME)
}

function setAutoScrolling(el: HTMLElement) {
  el.setAttribute(AUTO_SCROLLING_ATTR_NAME, '')
}

function removeAutoScrolling(el: HTMLElement) {
  el.removeAttribute(AUTO_SCROLLING_ATTR_NAME)
}

function scrollToElement(container: HTMLElement, target: HTMLElement) {
  container.scrollTo({
    top: target.offsetTop - container.offsetTop,
    behavior: 'smooth'
  })
}

export {
  setAutoScrolling,
  scrollToElement,
  syncScrollPosition,
  isAutoScrolling,
  removeAutoScrolling
}
