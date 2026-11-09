// Block-level TEI elements are mapped to <p>, everything else is unwrapped to plain children.
// shortcut: inline TEI markup loses its styling, upgrade when editions need styled rendering
const BLOCK_ELEMENTS = new Set([
  'ab', 'argument', 'byline', 'closer', 'dateline', 'div', 'epigraph', 'head', 'item',
  'l', 'lg', 'list', 'opener', 'p', 'quote', 'row', 'salute', 'seg', 'signed', 'sp',
  'speaker', 'table', 'trailer'
])

// TEI documents root in <TEI> (optionally prefixed) or contain a teiHeader
function isTeiDocument(input: string): boolean {
  return /<\s*(?:[\w.-]+:)?(?:TEI|teiHeader)[\s>/]/.test(input)
}

// TEI elements are not valid HTML, so DOMPurify strips them with their text content. This
// unwraps every TEI element into plain children, wrapping block-level ones in <p> to keep
// the structure readable. The teiHeader is skipped by starting at the <text> element.
function teiToHtml(xml: string): string {
  const doc = new DOMParser().parseFromString(xml, 'application/xml')
  if (doc.getElementsByTagName('parsererror').length > 0) return xml

  const root = doc.getElementsByTagName('text')[0] ?? doc.documentElement
  if (!root) return xml

  const container = document.createElement('div')

  function walk(node: Node): Node[] {
    if (node.nodeType === Node.TEXT_NODE) {
      return [document.createTextNode(node.textContent ?? '')]
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return []

    const children = Array.from(node.childNodes).flatMap(walk)
    const name = node.nodeName.toLowerCase().replace(/^[\w.-]+:/, '')

    if (BLOCK_ELEMENTS.has(name)) {
      const block = document.createElement('p')
      children.forEach(child => block.appendChild(child))
      return [block]
    }

    return children
  }

  Array.from(root.childNodes).flatMap(walk).forEach(node => container.appendChild(node))

  return container.innerHTML
}

export {
  isTeiDocument,
  teiToHtml
}
