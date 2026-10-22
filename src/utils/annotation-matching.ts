import { AnnotationsConfig } from '@/types'
import { getNestedAnnotations, getSelectorValue, getSource, isFiltered } from '@/utils/annotations.ts'
import { getAnnotationTargets, getAnnotationType } from '@/utils/annotation-data.ts'
import { AnnotationProblemDetail, AnnotationProblemKind } from '@/utils/annotation-errors.ts'

interface MatchOptions {
  // the filters as they stand - annotations of a type the user switched off are matched as usual
  // and only marked as filtered out
  activeAnnotationTypes: AnnotationTypesDict | null
  ignoreFilters: boolean
  // called for every annotation whose selector is empty, invalid or matches nothing in the text
  onMatchError?: (annotation: Annotation, kind: AnnotationProblemKind, detail: AnnotationProblemDetail) => void
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
  { activeAnnotationTypes, ignoreFilters, onMatchError }: MatchOptions
): MatchedAnnotationsMap {
  const annotationsInText = annotations.filter(annotation => getTargetsInSource(annotation, source).length > 0)
  const tooltipTypes = annotationsConfig?.tooltipTypes ?? []

  return annotationsInText.reduce<MatchedAnnotationsMap>((acc, cur) => {
    const annotationType = getAnnotationType(cur)
    const matchedAnnotation: Omit<MatchedAnnotationsMap[string], 'target'> = {
      filtered: (annotationType && annotationsConfig?.crossRefContentType !== annotationType)
        ? (!activeAnnotationTypes || ignoreFilters || isFiltered(cur, activeAnnotationTypes, tooltipTypes))
        : false,
      annotation: cur,
      nestedAnnotations: getNestedAnnotations(cur, annotationsInText)
    }

    // Every target of the annotation in this text is matched on its own: a broken one is reported
    // and skipped, the elements of the correct ones are kept.
    const matchedNodes = new Set<Element>()

    getTargetsInSource(cur, source).forEach(target => {
      const selector = getSelectorValue(target)

      if (!selector) {
        onMatchError?.(cur, 'empty_selector', { selector })
        return
      }

      let targetNodes: Element[]
      try {
        targetNodes = Array.from(parsedDom.querySelectorAll(selector))
      } catch (e) {
        onMatchError?.(cur, 'invalid_selector', { selector, error: e })
        return
      }

      if (targetNodes.length === 0) {
        onMatchError?.(cur, 'no_match', { selector })
        return
      }

      targetNodes.forEach(node => matchedNodes.add(node))
    })

    // an annotation none of whose targets can be resolved in the text is still part of the map -
    // without targets and shown regardless of the filters, so it does not disappear from the sidebar
    acc[cur.id] = matchedNodes.size > 0
      ? { ...matchedAnnotation, target: [...matchedNodes] }
      : { ...matchedAnnotation, filtered: true, target: [] }

    return acc
  }, {})
}

// The targets of an annotation that point into the given source. A malformed target (e.g. null)
// points nowhere rather than making the whole annotation fail.
function getTargetsInSource(annotation: Annotation, source: string): AnnotationTarget[] {
  return getAnnotationTargets(annotation).filter(target => target && getSource(target).id === source)
}

// Whether an annotation's targets are the elements a cross reference points at, which the text
// renders in its own style.
function isCrossRefAnnotation(annotation: Annotation, annotationsConfig: AnnotationsConfig) {
  return getAnnotationType(annotation) === annotationsConfig?.crossRefContentType
}

export { matchAnnotations, isCrossRefAnnotation }
