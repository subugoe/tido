import { FilterNode } from '@/types'

function getSelectedTypes(nodes: FilterNode[]): AnnotationTypesDict {
  let types: AnnotationTypesDict = {}

  nodes.forEach(node => {
    const nodeTypes = getSelectedTypesFromNode(node)
    types = { ...types, ...nodeTypes }
  })

  return types
}

function getSelectedTypesFromNode(node: FilterNode): AnnotationTypesDict {
  let types: AnnotationTypesDict = {}

  if (node.selected && node.types) {
    const isVariant = node.types.includes('Variant')

    if (isVariant) {
      // If a node has configured type "Variant", we ignore all other types and grandchildren
      // and consider only direct children as "witnesses".
      types['Variant'] = node.items?.filter(item => item.selected).map(item => item.types?.[0] ?? '') ?? []
      return types
    }

    // Otherwise we set each type on the node as key in the result object.
    types = node.types.reduce((acc, cur) => {
      acc[cur] = [] // Empty array just to have default value for the key.
      return acc
    }, types)
  }

  if (node.items) {
    node.items.forEach(child => {
      types = { ...types, ...getSelectedTypesFromNode(child) }
    })
  }

  return types
}

function getFilteredAnnotations(matchedAnnotationsMap: MatchedAnnotationsMap) {
  const filteredMatchedAnnotationsMap: MatchedAnnotationsMap = Object.fromEntries(Object.entries(matchedAnnotationsMap).filter(([, value]) => value.filtered === true))
  return Object.values(filteredMatchedAnnotationsMap).map(value => value.annotation)
}

function isSelected(selectedId: string, attrValue: string) {
  return attrValue?.split(',').includes(selectedId) ?? false
}

function computeNewSelectedAnnotationIndex(targetEntry: MergedAnnotationEntry, prevClickedTargetIndex: number, flippedMatchedAnnotMap: MergedAnnotationEntry[]) {
  let newSelectedAnnotationIndex = -1

  // Clicking at target A -> A.selectedAnnotationIndex becomes 0
  // Clicking at target B -> B.selectedAnnot Index becomes 0
  // Clicking again at target A -> reset first A.selectedAnnotationIndex to -1, since its like clicking for the first time
  // if we do not reset it and target A has only one annotation then it will not be selected

  console.log('flipped matched annot map', flippedMatchedAnnotMap)

  if (flippedMatchedAnnotMap[prevClickedTargetIndex]?.target !== targetEntry.target) targetEntry.selectedAnnotationIndex = -1

  if (targetEntry.selectedAnnotationIndex === -1) {
    newSelectedAnnotationIndex = 0
  }
  else if (targetEntry.selectedAnnotationIndex < targetEntry.annotations.length - 1) {
    newSelectedAnnotationIndex = targetEntry.selectedAnnotationIndex += 1
  }

  return newSelectedAnnotationIndex
}

function getNestedAnnotations(annotation: Annotation, itemAnnotations: Annotation[]) {
  if (itemAnnotations.length === 0) return []
  return itemAnnotations.filter((annot)  => annot.target[0].source === annotation.id)
}

function findInternalTargetsInAnnotation(annotationId: string, itemAnnotations: Annotation[]) {
  // if annotation Id appears as target Array.source -> from each target we get an html element out of selector
  const nestedAnnotations = itemAnnotations.filter((annot) => annot.target[0]?.source === annotationId)

  const annotationEl = document.querySelector(`div[data-annotation="${annotationId}"]`) as HTMLElement

  const elements: HTMLElement[] = []
  const selectors: string[] = []

  nestedAnnotations.forEach((annot) => {
    const target = annot.target[0]
    if (!target?.selector) return {}

    const { selector } = target
    let cssValue: string | null = null

    if (selector.type === 'CssSelector')  cssValue = selector.value
    else if (selector.type === 'RangeSelector') cssValue = selector.startSelector?.value ?? null

    if (!cssValue) return {}

    const el = annotationEl?.querySelector(cssValue)
    if (el) elements.push(el)
    if (cssValue) selectors.push(cssValue)

  })
  return {
    selectors,
    elements
  }
}

function findExternalTargetsInAnnotation(annotation: Annotation) {
  const elements: HTMLElement[] = []
  const selectors: string[] = []
  if (annotation.target[0].source === 'text/html') return { elements, selectors }
  annotation.target.forEach((target: AnnotationTarget) => {
    const selector = target.selector.value
    const el = document.querySelector<HTMLElement>(selector)
    if (el) elements.push(el)
    selectors.push(selector)
  })

  return {
    elements,
    selectors
  }
}

function getFlippedNestedMatchedAnnotationsMap(nestedMatchedAnnotationsMap) {
  //
  // {
  //  'selector': {
  //    'el': HTMLElement,
  //    'annotationIds': string[]
  //  }
  // }


  const flippedNestedMatchedAnnotationsMap = {}

  Object.keys(nestedMatchedAnnotationsMap).forEach((annotationId) => {
    const entry = nestedMatchedAnnotationsMap[annotationId]
    const externalTargetSelectors = entry.externalTargets.selectors
    if (externalTargetSelectors.length < 0) return

    externalTargetSelectors.forEach((selector) => {
      if (!flippedNestedMatchedAnnotationsMap.hasOwnProperty(selector)) {
        const el = document.querySelector<HTMLElement>(selector)
        flippedNestedMatchedAnnotationsMap[selector] = {
          annotationIds: [annotationId],
          el
        }
      }
      else {
        flippedNestedMatchedAnnotationsMap[selector].annotationIds.push(annotationId)
      }
    })
  })


  return flippedNestedMatchedAnnotationsMap
}

function getAnnotationIdsByEl(
  flipped: Record<string, { el: HTMLElement, annotationIds: string[] }>,
  el: HTMLElement
): string[] {
  const entry = Object.values(flipped).find(v => v.el === el)
  return entry?.annotationIds ?? []
}

export {
  getSelectedTypes,
  getFilteredAnnotations,
  isSelected,
  computeNewSelectedAnnotationIndex,
  findInternalTargetsInAnnotation,
  findExternalTargetsInAnnotation,
  getNestedAnnotations,
  getFlippedNestedMatchedAnnotationsMap,
  getAnnotationIdsByEl
}
