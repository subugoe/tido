function getFilteredAnnotations(matchedAnnotationsMap: MatchedAnnotationsMap) {
  const filteredMatchedAnnotationsMap: MatchedAnnotationsMap = Object.fromEntries(Object.entries(matchedAnnotationsMap).filter(([, value]) => value.filtered === true))
  return Object.values(filteredMatchedAnnotationsMap).map(value => value.annotation)
}

function isSelected(selectedId: string, attrValue: string) {
  return attrValue?.split(',').includes(selectedId) ?? false
}

function getExtendedFullAnnotationsTypesMap(annotations: Annotation[], prevFullAnnotationTypes: AnnotationTypesDict) {
  // a new item might introduce new annotation types.
  // we want to extend our list of annotation types (prevFullAnnotationTypes) with the new annotation types
  // from new item (annotations)
  // preserve selected/not selected value when switching on other items
  // annotations: belongs to the new item
  // i.e on item A we deselect annotation type: Person, if we switch to item B and there are annotations with type
  // Person, then this type should be initially deselected.
  if (!annotations || annotations?.length === 0) return
  // when switching to a new item, we extend our "full" annotationTypes
  const newAnnotationTypes = { ...prevFullAnnotationTypes }
  const types = annotations.map((a) => a.body['x-content-type'])
  const uniqueAnnotationTypes = [...new Set(types)]
  if (uniqueAnnotationTypes.length > 0) {
    uniqueAnnotationTypes.forEach((type) => {
      if (!(type in newAnnotationTypes)) newAnnotationTypes[type] = true
    })
  }

  return newAnnotationTypes
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
  getFilteredAnnotations,
  isSelected,
  getExtendedFullAnnotationsTypesMap,
  computeNewSelectedAnnotationIndex
}
