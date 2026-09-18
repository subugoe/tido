import { AnnotationsConfig } from '@/types'
import { getNestedAnnotations, getSelectorValue, getSource, isFiltered } from '@/utils/annotations.ts'

interface MatchOptions {
  // the filters as they stand - annotations of a type the user switched off are matched as usual
  // and only marked as filtered out
  activeAnnotationTypes: AnnotationTypesDict | null
  ignoreFilters: boolean
}

// Resolve the annotations of one source to the elements their selectors match in its text.
//
// Pure on purpose: it reads the parsed text and returns the map, it does not style the elements it
// finds and binds nothing to them. Both are the caller's to do with the result, which keeps the
// matching itself a plain function of (text, annotations, config) - the same input gives the same
// map, and nothing about the text on screen has to exist yet for it to run.
function matchAnnotations(
  parsedDom: Element,
  annotations: Annotation[],
  source: string,
  annotationsConfig: AnnotationsConfig,
  { activeAnnotationTypes, ignoreFilters }: MatchOptions
): MatchedAnnotationsMap {
  const annotationsInText = annotations.filter(annotation => annotation.target && getSource(annotation.target[0]).id === source)
  const tooltipTypes = annotationsConfig?.tooltipTypes ?? []

  return annotations.reduce<MatchedAnnotationsMap>((acc, cur) => {
    if (!cur.target) return acc

    const isSource = getSource(cur.target[0]).id === source
    const selector = getSelectorValue(cur.target[0])

    // reported for the annotations of every source, not only this one - kept that way so the error
    // does not silently disappear for a text that is not the one being rendered here
    if (!selector || selector === '#') {
      console.error('Annotation error','Selector value of target is empty for this annotation', cur)
      return acc
    }

    if (!isSource) return acc

    const matchedNodes = Array.from(parsedDom.querySelectorAll(selector))
    if (matchedNodes.length === 0) return acc

    acc[cur.id] = {
      target: matchedNodes,
      filtered: (cur.body.annotationType && annotationsConfig?.crossRefContentType !== cur.body?.annotationType)
        ? (!activeAnnotationTypes || ignoreFilters || isFiltered(cur, activeAnnotationTypes, tooltipTypes))
        : false,
      annotation: cur,
      nestedAnnotations: getNestedAnnotations(cur, annotationsInText)
    }

    return acc
  }, {})
}

// Whether an annotation's targets are the elements a cross reference points at, which the text
// renders in its own style.
function isCrossRefAnnotation(annotation: Annotation, annotationsConfig: AnnotationsConfig) {
  return annotation.body.annotationType === annotationsConfig?.crossRefContentType
}

export { matchAnnotations, isCrossRefAnnotation }
