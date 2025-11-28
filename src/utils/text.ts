const ANNOTATION_IDS_ATTRIBUTE = 'data-annotation-ids'
const ANNOTATION_HOVER_CLASSES = ['bg-primary/20', 'dark:bg-primary/50']
const SELECTED_ANNOTATION_CLASSES = ['bg-primary/40', 'dark:bg-primary/80']
const SELECTED_ANNOTATION_ATTRIBUTE = 'data-annotation-selected'
const HIGHLIGHTING_STYLE = ['bg-gray-200', 'dark:bg-muted', 'relative', 'cursor-pointer']
const CROSS_REF_ATTRIBUTE = 'data-ref-target'
const CROSS_REF_REL_ATTRIBUTE = 'rel'
const CROSS_REF_REL_STYLE = ['bg-gray-400', 'font-bold']

function addAnnotationId(target: Element, id: string) {
  let old = getAnnotationIds(target)
  old =  old ? `${old},${id}` : id
  target.setAttribute(ANNOTATION_IDS_ATTRIBUTE, [...new Set(old.split(','))].join())
}

function removeAnnotationIds(target: Element) {
  target.removeAttribute(ANNOTATION_IDS_ATTRIBUTE)
}


function addHighlightStyle(target: Element) {
  target.classList.add(...HIGHLIGHTING_STYLE)
}

function removeHighlightStyle(target: Element) {
  target.classList.remove(...HIGHLIGHTING_STYLE)
}

function addHoverStyle(target: Element) {
  target.classList.add(...ANNOTATION_HOVER_CLASSES)
}

function removeHoverStyle(target: Element) {
  target.classList.remove(...ANNOTATION_HOVER_CLASSES)
}

function addSelectedStyle(target: Element) {
  target.classList.add(...SELECTED_ANNOTATION_CLASSES)
  target.setAttribute(SELECTED_ANNOTATION_ATTRIBUTE, 'true')
}

function removeSelectedStyle(target: Element) {
  target.classList.remove(...SELECTED_ANNOTATION_CLASSES)
  target.removeAttribute(SELECTED_ANNOTATION_ATTRIBUTE)
}

function getAnnotationIds(target: Element) {
  return target.getAttribute(ANNOTATION_IDS_ATTRIBUTE)
}

function isCrossRefNested(crossRefNodes, node) {
  let isNested = false
  crossRefNodes.forEach((crossRef) => {
    if (crossRef.contains(node)) {
      isNested = true
      return
    }
  })
  return isNested
}

function getRootCrossRefElements(root: Element) {
  // there might be cases when a cross ref includes other cross ref nodes
  // in the list we append only the parent cross ref node in such cases

  const result = []
  function check(node: Element) {
    // Only process Element nodes (nodeType === 1)
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.hasAttribute(CROSS_REF_ATTRIBUTE) && !isCrossRefNested(result, node)) {
        result.push(node)
      }

      if (isCrossRefRel(node)) {
        addCrossRefRelStyle(node)
      }

      // Recursively check all child nodes
      for (const child of node.children) {
        check(child)
      }
    }
  }

  check(root)

  return result
}

function isCrossRefRel(target: Element) {
  return target.getAttribute(CROSS_REF_REL_ATTRIBUTE) === 'true'
}

function addCrossRefRelStyle(target: Element) {
  target.classList.add(...CROSS_REF_REL_STYLE)
}


function flipMatchedAnnotationsMap(map: MatchedAnnotationsMap): MergedAnnotationEntry[] {
  // Flip the map in favor of targets. Each result array item contains a unique target.
  // Each unique target can be used in multiple annotations. Therefore, annotations and filtered are equal sized arrays.

  const elementMap = new Map<Element, MergedAnnotationEntry>()

  for (const entry of Object.values(map)) {
    const { target, annotation, filtered } = entry

    for (const el of target) {
      let merged = elementMap.get(el)

      if (!merged) {
        merged = {
          target: el,
          annotations: [],
          filtered: [],
          selectedAnnotationIndex: -1
        }
        elementMap.set(el, merged)
      }

      merged.annotations.push(annotation)
      merged.filtered.push(filtered)
    }
  }

  return Array.from(elementMap.values())
}

function isSelected(target: Element) {
  return target.getAttribute(SELECTED_ANNOTATION_ATTRIBUTE) === 'true'
}

export {
  addAnnotationId,
  removeAnnotationIds,
  addHoverStyle,
  removeHoverStyle,
  addSelectedStyle,
  removeSelectedStyle,
  addHighlightStyle,
  removeHighlightStyle,
  getAnnotationIds,
  getRootCrossRefElements,
  flipMatchedAnnotationsMap,
  isSelected
}
