import { FC, RefObject, useEffect, useMemo, useRef, useState } from 'react'
import {
  addCrossRefTargetStyle,
  getDiscoveredAnnotationTypes,
  assignNestedTargetsInFlippedMatched,
  flipMatchedAnnotationsMap,
  getAnnotationIds,
  getHoveredAnnotationsIds,
  getTargetsHoveredAnnotations,
  getTextTargets
} from '@/utils/text.ts'
import {
  applyTargetVisualState,
  getDisabledTargets,
  getTargetVisualState
} from '@/utils/target-visual-state.ts'
import {
  getSelectorValue,
  getSource,
  isFiltered
} from '@/utils/annotations.ts'
import { isCrossRefAnnotation, matchAnnotations } from '@/utils/annotation-matching.ts'
import { createAnnotationErrorReport, reportAnnotationError } from '@/utils/annotation-errors.ts'
import { useHoveredAnnotations, useSetHoveredAnnotations } from '@/contexts/TextContext.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useTextView } from '@/contexts/TextViewContext.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { SelectedAnnotation } from '@/types'
import { useSynopsis } from '@/components/panel/synopsis/useSynopsis.ts'
import { useAnnotationPopover } from '@/components/panel/annotations/popover/useAnnotationPopover.tsx'
import { getAnnotationTargets } from '@/utils/annotation-data.ts'

interface Props {
  // the parsed text, already attached to the wrapper
  parsedDom: Element
  wrapperRef: RefObject<HTMLDivElement>
  onUpdateMatchedAnnotationsMap?: (source: string, map: MatchedAnnotationsMap) => void
  source: string
  sourceType: 'text' | 'annotation'
  onSelect?: () => void
  ignoreFilters: boolean
}

// Everything a text does with its annotations and sync annotations: matching them to the text,
// styling their targets, reacting to the pointer and the popover. Kept apart from the rendering of
// the text itself, so the renderer can put it behind an error boundary of its own - whatever goes
// wrong in here costs the text its annotations, never the text.
const TextAnnotationsLayer: FC<Props> = ({
  parsedDom,
  wrapperRef,
  onUpdateMatchedAnnotationsMap,
  source,
  sourceType,
  onSelect,
  ignoreFilters
}) => {
  const { annotations: annotationsConfig } = useConfig()
  const disabledHighlightTypes = useMemo<Set<string>>(
    () => new Set(annotationsConfig?.disableHighlighting ?? []),
    [annotationsConfig]
  )
  const hoveredAnnotations = useHoveredAnnotations()
  const setHoveredAnnotations = useSetHoveredAnnotations()

  const {
    selectedAnnotation,
    activeAnnotationTypes,
    setSelectedAnnotation,
    updateAnnotationTypesBySource,
    setDynamicAnnotationTypes,
    annotations,
    getScroller,
    updateMatchedAnnotationsMap
  } = usePanel()
  // null when this text is not rendered inside a text view (e.g. in the annotations sidebar)
  const textView = useTextView()

  // The hook finds this text's sync targets once it has the text and hands them back - what a
  // target does when it is clicked or hovered is decided here, the same for them as for the
  // annotation targets below.
  const { onHover, onHoverEnd, setText, syncTargets } = useSynopsis()

  const [matchedMap, setMatchedMap] = useState<MatchedAnnotationsMap>({})

  const selectedAnnotationRef = useRef<SelectedAnnotation | null>(null)
  const targetsRef = useRef<HTMLElement[]>(null)
  const hoveredAnnotationsRef = useRef<string[] | null>(null)
  const activeAnnotationTypesRef = useRef<AnnotationTypesDict | null>(null)
  const { popover, onTargetClick } = useAnnotationPopover({
    source,
    wrapper: wrapperRef.current,
    onBaseItemSelection: onSelect
  })

  // Create and set matchedMap by identifying target nodes. Add listeners to targets.
  useEffect(() => {
    // the hook takes it from here: it finds this text's sync targets and binds its scroll listener
    setText(sourceType === 'text' ? parsedDom : null, source)

    if (!annotations) return

    // A failure in matching the annotations must not prevent the text from being displayed
    const report = createAnnotationErrorReport(source)
    let resultMap: MatchedAnnotationsMap = {}
    try {
      resultMap = matchAnnotations(parsedDom, annotations, source, annotationsConfig, {
        activeAnnotationTypes: activeAnnotationTypesRef.current,
        ignoreFilters,
        onMatchError: (annotation, kind, detail) => report.add(kind, annotation, detail)
      })

      // An entry whose targets are not elements of the text is kept without them - like an annotation
      // whose selector matches nothing - so it neither breaks the binding below nor the styling later.
      // Checked before binding anything, so the listeners only ever go on targets that stay in the map.
      resultMap = Object.fromEntries(Object.entries(resultMap).map(([id, entry]) => {
        if (Array.isArray(entry.target) && entry.target.every(el => el instanceof Element)) return [id, entry]

        report.add('unexpected', entry.annotation, { error: new Error('The matched targets are not elements of the text') })
        return [id, { ...entry, filtered: true, target: [] as Element[] }]
      }))

      // What the matching itself no longer does: give the cross reference targets their style and
      // make every target react to the pointer. Each annotation on its own, so a failure in one of
      // them leaves the others working.
      Object.values(resultMap).forEach(({ annotation, target }) => {
        try {
          const isCrossRef = isCrossRefAnnotation(annotation, annotationsConfig)

          target.forEach(targetEl => {
            if (isCrossRef) addCrossRefTargetStyle(targetEl)
            targetEl.addEventListener('click', onClickTarget)
            targetEl.addEventListener('mouseenter', onMouseEnterTarget)
            targetEl.addEventListener('mouseleave', onMouseLeaveTarget)
          })
        } catch (e) {
          report.add('unexpected', annotation, { error: e })
        }
      })

      // warn once, after all annotations of the text have been matched and bound
      if (report.hasProblems()) textView?.addTextWarning('annotation_matching_error')

      // When no annotation filters were configured, store the types this text contains keyed by its
      // contentUrl (source). PanelContext derives the flat annotationFilters from these per-text entries.
      if (!annotationsConfig?.filters) {
        const discoveredTypes = getDiscoveredAnnotationTypes(resultMap, annotationsConfig)
        updateAnnotationTypesBySource(source, discoveredTypes)

        const discovered = discoveredTypes
          .flatMap(node => node.types ?? [])
          .filter((type): type is string => typeof type === 'string')

        // The aggregated list is extended with the types seen here for the first time (e.g. this item
        // introduced them) as selected; types already in it keep the state the user gave them.
        setDynamicAnnotationTypes(previous => {
          const knownTypes = new Set(previous.map(entry => entry.type))
          const added = discovered
            .filter(type => !knownTypes.has(type))
            .map(type => ({ type, selected: true }))

          return added.length > 0 ? [...previous, ...added] : previous
        })
      }
    } catch (e) {
      // only the matching as a whole or the type discovery end up here - the map holds no broken
      // targets by now, so it is passed on as it is
      report.add('unexpected', null, { error: e })
      textView?.addTextWarning('annotation_matching_error')
    } finally {
      report.flush()
      setMatchedMap(resultMap)
      updateMatchedMap(resultMap)
    }
  }, [parsedDom, annotations, annotationsConfig])


  useEffect(() => {
    if (syncTargets.length === 0) return

    syncTargets.forEach((targetEl) => {
      targetEl.addEventListener('click', onClickTarget)
      targetEl.addEventListener('mouseenter', onMouseEnterTarget)
      targetEl.addEventListener('mouseleave', onMouseLeaveTarget)
    })

    return () => {
      syncTargets.forEach((targetEl) => {
        targetEl.removeEventListener('click', onClickTarget)
        targetEl.removeEventListener('mouseenter', onMouseEnterTarget)
        targetEl.removeEventListener('mouseleave', onMouseLeaveTarget)
      })
    }
  }, [syncTargets])

  // What a target looks like depends on the hover, which changes on every pointer move - but which
  // targets exist, which ones sit inside which, and which ones may not be highlighted do not. That
  // part is derived here instead of in the effect below: finding the parents compares every target
  // with every other one, and it only has to be redone when the matches or the disabled types change.
  //
  // A failure here leaves the targets unstyled instead of costing the text all of its annotations.
  // It is only kept during render and reported by the effect below - reporting means updating the
  // text view's state, which must not happen while rendering.
  const { entries, targets, disabledTargets, targetsError } = useMemo<{
    entries: MergedAnnotationEntry[]
    targets: HTMLElement[]
    disabledTargets: Set<Element>
    targetsError: unknown
  }>(() => {
    try {
      const flipped = flipMatchedAnnotationsMap(matchedMap)
      const targets = getTextTargets(flipped)
      const entries = assignNestedTargetsInFlippedMatched(targets, flipped)

      return { entries, targets, disabledTargets: getDisabledTargets(entries, disabledHighlightTypes), targetsError: null }
    } catch (e) {
      return { entries: [], targets: [], disabledTargets: new Set<Element>(), targetsError: e }
    }
  }, [matchedMap, disabledHighlightTypes])

  useEffect(() => {
    if (!targetsError) return
    reportAnnotationError(source, 'styling', targetsError)
    textView?.addTextWarning('annotation_styling_error')
  }, [targetsError])

  // The one place this text's targets are styled. Their classes are derived from the panel's state
  // rather than added and removed by whoever changed it, so nothing has to undo anyone else's work -
  // see getTargetVisualState.
  useEffect(() => {
    hoveredAnnotationsRef.current = hoveredAnnotations
    selectedAnnotationRef.current = selectedAnnotation
    // the pointer listeners resolve a hovered target against this list
    targetsRef.current = targets

    if (entries.length === 0) return

    // A failure in styling the targets must not prevent the text from being displayed
    try {
      const context = {
        hoveredTargets: getTargetsHoveredAnnotations(hoveredAnnotations, targets, matchedMap),
        selectedTargets: selectedAnnotation && matchedMap[selectedAnnotation.annotation.id]
          ? matchedMap[selectedAnnotation.annotation.id].target
          : [],
        disabledTargets
      }

      entries.forEach((entry) =>
        applyTargetVisualState(entry.target, getTargetVisualState(entry, context)))
    } catch (e) {
      reportAnnotationError(source, 'styling', e)
      textView?.addTextWarning('annotation_styling_error')
    }
  }, [entries, targets, disabledTargets, matchedMap, hoveredAnnotations, selectedAnnotation])


  useEffect(() => {
    if (Object.keys(matchedMap).length === 0 || !activeAnnotationTypes) return

    try {
      activeAnnotationTypesRef.current = activeAnnotationTypes
      const resultMap = { ...matchedMap }

      const tooltipTypes = annotationsConfig?.tooltipTypes ?? []
      Object.keys(resultMap).forEach(id => {
        const { annotation } = resultMap[id]
        resultMap[id].filtered = isFiltered(annotation, activeAnnotationTypes, tooltipTypes)
      })

      setMatchedMap(resultMap)
      updateMatchedMap(resultMap)
    } catch (e) {
      reportAnnotationError(source, 'filtering', e)
      textView?.addTextWarning('annotation_unexpected_error')
    }
  }, [activeAnnotationTypes])

  // A text stores its map in the panel itself, an annotation in the sidebar hands it to its caller
  function updateMatchedMap(map: MatchedAnnotationsMap) {
    if (sourceType === 'text') updateMatchedAnnotationsMap(source, textView?.visible ? map : {})
    if (onUpdateMatchedAnnotationsMap) onUpdateMatchedAnnotationsMap(source, map)
  }

  // Errors thrown in DOM listeners reach no error boundary, so the target listeners catch their own
  function safeListener(listener: (e: Event) => void | Promise<void>) {
    const onError = (error: unknown) => {
      reportAnnotationError(source, 'event', error)
      textView?.addTextWarning('annotation_unexpected_error')
    }

    return (e: Event) => {
      try {
        const result = listener(e)
        if (result instanceof Promise) result.catch(onError)
      } catch (error) {
        onError(error)
      }
    }
  }

  const onMouseEnterTarget = safeListener((e: Event) => {
    const target = e.currentTarget as HTMLElement

    // the annotations of the target and of its parent targets, read from their data-annotation-ids
    const idsArray = getHoveredAnnotationsIds(target, targetsRef.current ?? [])
    if (idsArray.length > 0) {
      hoveredAnnotationsRef.current = idsArray
      setHoveredAnnotations(hoveredAnnotationsRef.current)
    }

    onHover(target, source)
  })

  const onMouseLeaveTarget = safeListener((e: Event) => {
    const target = e.currentTarget as HTMLElement

    // hoveredAnnotations can contain parent targets. So on mouse leave, we want to remove the hover
    // style only for the current target's annotation IDs, read from its data-annotation-ids.
    const idsArray = getAnnotationIds(target)
    if (idsArray.length > 0) {
      hoveredAnnotationsRef.current = hoveredAnnotationsRef.current?.filter(a => !idsArray.includes(a)) ?? null
      setHoveredAnnotations(hoveredAnnotationsRef.current)
    }

    onHoverEnd()
  })

  const onClickTarget = safeListener(async (e: Event) => {
    // Generic click listener
    // TODO:  Be careful with state here. This listener will be added once a new map is created.
    //  So this function will be called with those state values which existed at the time of adding.

    const target = e.currentTarget as HTMLElement

    // e.target = the deepest DOM node the user actually clicked
    // e.currentTarget (target) = the annotation target this listener is attached to
    // If the actual click landed inside a child annotation target, this is a parent
    // that should not process the event — the child's handler will take care of it.
    const clickTarget = e.target as HTMLElement
    const isClickInsideChildTarget = targetsRef.current?.some(
      t => t !== target && target.contains(t) && t.contains(clickTarget)
    )

    if (isClickInsideChildTarget) return

    // This is the deepest annotation target under the click — process it and prevent
    // ancestors from also reacting.
    e.stopPropagation()

    getScroller().setOriginSelection('text')

    // The annotations of the clicked target and of its parent targets - the popover sorts them
    // into the areas it shows (cross references, tooltip items, sidebar items). Any target of an
    // annotation in this text may be the clicked one; a target with an invalid selector cannot.
    const targetAnnotations = (annotations ?? []).filter(annotation =>
      getAnnotationTargets(annotation).some(annotationTarget => {
        if (!annotationTarget || getSource(annotationTarget).id !== source) return false

        const selector = getSelectorValue(annotationTarget)
        if (!selector) return false

        try {
          return Array.from(parsedDom.querySelectorAll(selector))
            .some(el => el === target || el.contains(target))
        } catch {
          return false
        }
      }))

    const { openTooltip, normalAnnotations } = onTargetClick(target, source, targetAnnotations)

    // when we have only one normal annotation then we should select the annotation in Sidebar and not open tooltip. (select + deselect annotation)
    if (!openTooltip && normalAnnotations.length === 1) {
      // we need selectedAnnotationRef since the click listener has not an updated value of selectedAnnotation, it has the 'null' when it was initially created
      if (normalAnnotations[0].id === selectedAnnotationRef.current?.annotation.id) {
        setSelectedAnnotation(null)
        selectedAnnotationRef.current = null
      } else {
        const selectedAnnotation = {
          annotation: normalAnnotations[0],
          origin: 'text',
          contentUrl: source
        } as SelectedAnnotation

        setSelectedAnnotation(selectedAnnotation)
        selectedAnnotationRef.current = selectedAnnotation
        if (onSelect) onSelect()
      }
    }
  })

  return popover
}

export default TextAnnotationsLayer
