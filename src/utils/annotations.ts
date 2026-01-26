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
      types['Variant'] = node.items?.map(item => item.types?.[0] ?? '') ?? []
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

  if (flippedMatchedAnnotMap[prevClickedTargetIndex]?.target !== targetEntry.target) targetEntry.selectedAnnotationIndex = -1

  if (targetEntry.selectedAnnotationIndex === -1) {
    newSelectedAnnotationIndex = 0
  }
  else if (targetEntry.selectedAnnotationIndex < targetEntry.annotations.length - 1) {
    newSelectedAnnotationIndex = targetEntry.selectedAnnotationIndex += 1
  }

  return newSelectedAnnotationIndex
}

export {
  getSelectedTypes,
  getFilteredAnnotations,
  isSelected,
  computeNewSelectedAnnotationIndex,
}
