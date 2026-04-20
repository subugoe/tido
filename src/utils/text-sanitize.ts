import DOMPurify from 'dompurify'
import { FORBID_TAGS, ADD_ATTR } from './constants'
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
