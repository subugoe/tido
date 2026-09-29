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
// a scroll event is trusted either way and carries nothing to tell the two apart. So every scroll we
// start is marked on its container until it has come to a stop, and a scroll listener that only
// cares about the user's own scrolling skips the marked ones (see isProgrammaticScroll).
const programmaticScrolls = new WeakMap<Element, () => void>()

// Hard limit for a mark: a scrollTo landing on the scrollTop the container already has scrolls
// nothing, so it never reaches scrollend and the mark has to be lifted by time instead.
const PROGRAMMATIC_SCROLL_TIMEOUT = 1000
// Without scrollend the scrolling counts as stopped once the container has stayed quiet this long.
const SCROLL_QUIET_TIMEOUT = 150

// Mark the scroll this container is about to make as ours. Call it right before scrolling.
function markProgrammaticScroll(container: Element) {
  // an ongoing mark is lifted first, so the new scroll is given the full time of its own
  programmaticScrolls.get(container)?.()

  let quietTimer = 0
  const hardTimer = window.setTimeout(unmark, PROGRAMMATIC_SCROLL_TIMEOUT)

  // the scrollend fallback for browsers without it (Safari below 18.2)
  const onScroll = () => {
    window.clearTimeout(quietTimer)
    quietTimer = window.setTimeout(unmark, SCROLL_QUIET_TIMEOUT)
  }

  function unmark() {
    window.clearTimeout(hardTimer)
    window.clearTimeout(quietTimer)
    container.removeEventListener('scrollend', unmark)
    container.removeEventListener('scroll', onScroll)
    programmaticScrolls.delete(container)
  }

  if ('onscrollend' in window) container.addEventListener('scrollend', unmark)
  else container.addEventListener('scroll', onScroll, { passive: true })

  programmaticScrolls.set(container, unmark)
}

// Whether this container is in the middle of a scroll that we started ourselves.
function isProgrammaticScroll(container: Element): boolean {
  return programmaticScrolls.has(container)
}

// 'instant' jumps to the position in one step, 'smooth' animates towards it.
type ScrollBehavior = 'instant' | 'smooth'

// The single place a scroll position is written. Every scroll in the app goes through here, so the
// clamp and the programmatic mark cannot be forgotten by one caller: a scroll we start is ours, and
// the listeners that only care about the user's own scrolling skip it (see isProgrammaticScroll).
// Returns the scrollTop the container ends up at.
function alignContainer(container: HTMLElement, top: number, behavior: ScrollBehavior = 'instant'): number {
  const maxScrollTop = container.scrollHeight - container.clientHeight
  const clamped = Math.max(0, Math.min(top, maxScrollTop))

  // Landing on the scrollTop the container already has scrolls nothing, so it never reaches
  // scrollend and the mark would have to be lifted by time instead - so it is not set at all.
  if (clamped === container.scrollTop) return container.scrollTop

  markProgrammaticScroll(container)
  if (behavior === 'smooth') container.scrollTo({ top: clamped, behavior: 'smooth' })
  else container.scrollTop = clamped

  return clamped
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
    return alignContainer(container, finalScrollTop, 'smooth')
  }
  return container.scrollTop
}

function validateSelector(selector: string) {
  return selector.startsWith('#') || selector.startsWith('.')
}

export {
  waitForElementInDom,
  scrollIntoViewIfNeeded,
  validateSelector,
  markProgrammaticScroll,
  isProgrammaticScroll,
  alignContainer
}

export type { ScrollBehavior }
