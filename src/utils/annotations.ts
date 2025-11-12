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

export {
  getFilteredAnnotations,
  isSelected,
  getExtendedFullAnnotationsTypesMap,
}
