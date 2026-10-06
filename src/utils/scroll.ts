import { AUTO_SCROLLING_ATTR_NAME } from './constants'
import { markProgrammaticScroll } from '@/utils/dom.ts'

function syncScrollPosition(source: HTMLElement, target: HTMLElement) {
  if (!target) return
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

// Scroll each target's own container so the target lands at yPos - the distance from the top of the
// container that the target it is synced with has in its one, which is what keeps the texts aligned.
// 'instant' is for following the user's scrolling frame by frame: a smooth scroll restarted on every
// frame lags behind and stutters.
function scrollToTargets(targetEls: HTMLElement[], yPos: number, behavior: ScrollBehavior = 'smooth') {
  targetEls.forEach((targetEl) => {
    const scrollContainer = targetEl.closest('[data-text-container]') as HTMLElement | null
    if (!scrollContainer) return

    const currentY = targetEl.getBoundingClientRect().top - scrollContainer.getBoundingClientRect().top
    const desiredScrollTop = scrollContainer.scrollTop + currentY - yPos
    const maxScrollTop = scrollContainer.scrollHeight - scrollContainer.clientHeight
    const top = Math.max(0, Math.min(desiredScrollTop, maxScrollTop))

    // already there - a scroll that moves nothing never reaches scrollend, so its mark would hold
    // off the user's own scrolling of this container until it times out
    if (Math.abs(top - scrollContainer.scrollTop) < 1) return

    // ours, so the text's own scroll listener does not take it for the user's scrolling and sync
    // the panels back on top of it
    markProgrammaticScroll(scrollContainer)
    scrollContainer.scrollTo({ top, behavior })
  })
}

export {
  scrollToTargets,
  setAutoScrolling,
  scrollToElement,
  syncScrollPosition,
  isAutoScrolling,
  removeAutoScrolling
}
