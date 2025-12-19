import DOMPurify from 'dompurify'

const FORBID_TAGS = ['input', 'script', 'noscript', 'iframe', 'frame', 'frameset', 'noframes', 'applet', 'base', 'meta', 'form']
const ADD_ATTR = ['target', 'rel']
DOMPurify.addHook('afterSanitizeAttributes', function (node) {
  if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
    node.setAttribute('rel', 'noopener')
  }
})

function sanitize(input: string) {
  const output = DOMPurify.sanitize(input, { FORBID_TAGS, ADD_ATTR })
  const removed = DOMPurify.removed

  return { output, removed }
}

export {
  sanitize
}
