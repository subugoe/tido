function waitForElementInDom(selector: string, textSelector: string, callback: (el: Element) => void) {
  // selector: refers to a container element
  // textSelector: refers to a text part inside the container element

  const el = selector.startsWith('#') ? document.getElementById(selector.slice(1)) : document.querySelector(selector)
  if (el && el.querySelector(textSelector)) {
    callback(el)
    return
  }

  const observer = new MutationObserver((_mutations, obs) => {
    const el = selector.startsWith('#') ? document.getElementById(selector.slice(1)) : document.querySelector(selector)
    if (el && el.querySelector(textSelector)) {
      callback(el)
      obs.disconnect()  // Stop observing once found
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}

// Scrolling a container from code emits exactly the same scroll events as the user's own scrolling:
// a scroll event is trusted either way and carries nothing to tell the two apart. So a container we
// scroll carries this attribute as "true" from the moment we start the scroll, and as "false" once
// the browser fires scrollend. A scroll listener that only cares about the user's own scrolling skips
// the scroll events in between (see isProgrammaticScroll).
const PROGRAMMATIC_SCROLL_ATTRIBUTE = 'data-programmatic-scroll'

// Without scrollend (Safari below 18.2) our scroll counts as ended once the container has had no
// scroll event for this long.
const SCROLL_END_FALLBACK_DELAY = 100

// Browsers without scrollend: lifts the pending fallback of the container's previous scroll of ours.
const pendingScrollEndFallbacks = new WeakMap<Element, () => void>()

function unmarkWhenScrollStops(container: Element) {
  pendingScrollEndFallbacks.get(container)?.()

  let timer = 0
  const onScrollFallback = () => {
    window.clearTimeout(timer)
    timer = window.setTimeout(unmark, SCROLL_END_FALLBACK_DELAY)
  }

  function unmark() {
    cancel()
    container.setAttribute(PROGRAMMATIC_SCROLL_ATTRIBUTE, 'false')
  }

  function cancel() {
    window.clearTimeout(timer)
    container.removeEventListener('scroll', onScrollFallback)
    pendingScrollEndFallbacks.delete(container)
  }

  container.addEventListener('scroll', onScrollFallback, { passive: true })
  pendingScrollEndFallbacks.set(container, cancel)
  // the timer is started before the scroll too, so a scrollTo that moves nothing - and so fires no
  // scroll event - still lifts the mark instead of leaving the container marked for good. A real
  // scroll fires its first scroll event within a frame, long before the timer runs out.
  onScrollFallback()
}

// Scrolls the container to top as a scroll of ours. Returns the scrollTop the container ends up at -
// top clamped to its scroll range.
function scrollProgrammatically(container: Element, top: number, behavior: ScrollBehavior = 'smooth'): number {
  const maxScrollTop = container.scrollHeight - container.clientHeight
  const targetTop = Math.max(0, Math.min(top, maxScrollTop))

  // already there - a scroll that moves nothing never reaches scrollend, so the container would stay
  // marked and the user's own scrolling of it would be ignored from then on
  if (Math.abs(targetTop - container.scrollTop) < 1) return container.scrollTop

  container.setAttribute(PROGRAMMATIC_SCROLL_ATTRIBUTE, 'true')
  if ('onscrollend' in window) {
    container.addEventListener('scrollend', () => container.setAttribute(PROGRAMMATIC_SCROLL_ATTRIBUTE, 'false'), { once: true })
  } else {
    unmarkWhenScrollStops(container)
  }
  container.scrollTo({ top: targetTop, behavior })

  return targetTop
}

// Whether this container is in the middle of a scroll that we started ourselves.
function isProgrammaticScroll(container: Element): boolean {
  return container.getAttribute(PROGRAMMATIC_SCROLL_ATTRIBUTE) === 'true'
}

// Scrolls the target to the vertical center of the container if it is out of view. Returns the
// scrollTop the container ends up at (the current scrollTop when no scroll was needed), so callers
// can derive the target's final y-position within the container.
function scrollIntoViewIfNeeded(target: HTMLElement, container: HTMLElement): number {
  const { bottom: targetBottom, top: targetTop } = target.getBoundingClientRect()
  const { top: containerTop, height: containerHeight } = container.getBoundingClientRect()

  const offsetTop = targetTop - containerTop + container.scrollTop
  const targetHeight = target.offsetHeight

  // Desired scrollTop to bring the element to the vertical center
  const desiredScrollTop = offsetTop - (containerHeight / 2) + (targetHeight / 2)

  // Allow scrollTop be in containers scroll range
  const maxScrollTop = container.scrollHeight - container.clientHeight
  const finalScrollTop = Math.max(0, Math.min(desiredScrollTop, maxScrollTop))

  if (targetBottom > containerHeight || targetTop < containerTop) {
    return scrollProgrammatically(container, finalScrollTop)
  }
  return container.scrollTop
}

// Hard limit for onScrollEnd: the callback runs at the latest after this long, also when the
// scrolling does not come to rest (e.g. the user keeps scrolling).
const SCROLL_END_TIMEOUT = 3000
// Without scrollend the scrolling counts as stopped once the container has stayed quiet this long.
const SCROLL_QUIET_TIMEOUT = 150

// Runs the callback once every scroll inside root has come to rest. Scroll events do not bubble, so
// they are listened to in the capture phase, which catches the scrolling of any container in root.
// After each scrollend (or, without scrollend, after each scroll event) it waits SCROLL_QUIET_TIMEOUT
// for a follow-up scroll, so chained scrolls (a sidebar card, then the text aligned to it) count as
// one. When nothing scrolls at all - the target was on screen already - it runs after that wait too.
function onScrollEnd(root: Element, callback: () => void) {
  const supportsScrollEnd = 'onscrollend' in window
  const listeners = new AbortController()
  let quietTimer = window.setTimeout(done, SCROLL_QUIET_TIMEOUT)
  const hardTimer = window.setTimeout(done, SCROLL_END_TIMEOUT)

  function waitForQuiet() {
    window.clearTimeout(quietTimer)
    quietTimer = window.setTimeout(done, SCROLL_QUIET_TIMEOUT)
  }

  // with scrollend a scroll in progress only holds the callback back, scrollend starts the wait;
  // without it (Safari below 18.2) every scroll event restarts the wait
  function onScroll() {
    if (supportsScrollEnd) window.clearTimeout(quietTimer)
    else waitForQuiet()
  }

  function done() {
    window.clearTimeout(quietTimer)
    window.clearTimeout(hardTimer)
    listeners.abort()
    callback()
  }

  const { signal } = listeners
  root.addEventListener('scroll', onScroll, { capture: true, passive: true, signal })
  if (supportsScrollEnd) root.addEventListener('scrollend', waitForQuiet, { capture: true, signal })
}

// Runs the callback once the element is on screen and the scrolling inside root has stopped -
// whichever container in root scrolls it there and whenever that scroll starts. The observer only
// reports the element once it shows within the viewport and every scroll container around it.
function onScrolledIntoView(el: Element, root: Element, callback: () => void) {
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some(entry => entry.isIntersecting)) return
    observer.disconnect()
    onScrollEnd(root, callback)
  })
  observer.observe(el)
}

function validateSelector(selector: string) {
  return selector.startsWith('#') || selector.startsWith('.')
}

export { waitForElementInDom, scrollIntoViewIfNeeded, validateSelector, scrollProgrammatically, isProgrammaticScroll, onScrollEnd, onScrolledIntoView }
