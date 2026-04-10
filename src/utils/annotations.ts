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
  return Object.values(matchedAnnotationsMap).reduce<Annotation[]>((acc, value) => {
    if (value.filtered === true) acc.push(value.annotation)
    return acc
  }, [])
}

function computeNewSelectedAnnotationIndex(targetEntry: MergedAnnotationEntry, prevClickedTargetIndex: number, flippedMatchedAnnotMap: MergedAnnotationEntry[]) {
  let newSelectedAnnotationIndex = -1

  // Clicking at target A -> A.selectedAnnotationIndex becomes 0
  // Clicking at target B -> B.selectedAnnot Index becomes 0
  // Clicking again at target A -> reset first A.selectedAnnotationIndex to -1, since its like clicking for the first time
  // if we do not reset it and target A has only one annotation then it will not be selected

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

function findTargetsInsideAnnotation(annotationId: string, itemAnnotations: Annotation[]) {
  const nestedAnnotations = itemAnnotations.filter((annot) => annot.target[0]?.source === annotationId)
  const selectors: string[] = []

  nestedAnnotations.forEach((annot) => {
    const target = annot.target[0]
    if (!target?.selector) return {}
    const { selector } = target
    let cssValue: string | null = null

    if (selector.type === 'CssSelector')  cssValue = selector.value
    // TODO: we need to handle Range selectors
    if (cssValue) selectors.push(cssValue)
  })
  return selectors
}

function findTargets(annotation: Annotation): string[] {
  return annotation.target.map((target) => {
    if (target.selector.type === 'CssSelector') return target.selector.value
    // TODO: include case of Range Selectors
  })
}

function getAnnotationIdsByEl(
  flipped: Record<string, { el: HTMLElement, annotationIds: string[] }>,
  el: HTMLElement
): string[] {
  const entry = Object.values(flipped).find(v => v.el === el)
  return entry?.annotationIds ?? []
}

function isFiltered(annotation: Annotation, selectedTypes: AnnotationTypesDict) {
  const type = annotation.body['x-content-type']
  if (!selectedTypes || !selectedTypes[type]) return false

  if (type === 'Variant') {
    const witnesses = annotation.body.witnesses
    return witnesses.some(witness => selectedTypes[type].includes(witness))
  }

  return true
}

export {
  getSelectedTypes,
  getFilteredAnnotations,
  isFiltered,
  computeNewSelectedAnnotationIndex,
  findTargetsInsideAnnotation,
  findTargets,
  getNestedAnnotations,
  getAnnotationIdsByEl
}
