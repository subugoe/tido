function waitForElementInDom(selector: string, textSelector: string, callback) {
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

export { waitForElementInDom }
