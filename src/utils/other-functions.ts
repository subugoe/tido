
function waitForElementInDom(selector: string, callback) {
  const el = selector.startsWith('#') ? document.getElementById(selector.slice(1)) : document.querySelector(selector)
  if (el) {
    callback(el)
    return
  }

  const observer = new MutationObserver((_mutations, obs) => {
    const el = selector.startsWith('#') ? document.getElementById(selector.slice(1)) : document.querySelector(selector)
    if (el) {
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
