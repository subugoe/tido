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

function scrollIntoViewIfNeeded(target: HTMLElement, container: HTMLElement) {
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
    container.scrollTo({ top: finalScrollTop, behavior: 'smooth' })
  }
}

function validateSelector(selector: string) {
  return selector.startsWith('#') || selector.startsWith('.')
}

export { waitForElementInDom, scrollIntoViewIfNeeded, validateSelector }
