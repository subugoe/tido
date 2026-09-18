import React, { FC, memo, useEffect, useMemo, useRef, useState } from 'react'
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
import { useHoveredAnnotations, useSetHoveredAnnotations } from '@/contexts/TextContext.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { SelectedAnnotation } from '@/types'
import { useSynopsis } from '@/components/panel/synopsis/useSynopsis.ts'
import { useAnnotationPopover } from '@/components/panel/annotations/popover/useAnnotationPopover.tsx'


interface Props {
  htmlString?: string
  onReady?: () => void
  onUpdateMatchedAnnotationsMap?: (map: MatchedAnnotationsMap) => void
  source: string
  sourceType: 'text' | 'annotation'
  onSelect?: () => void
  ignoreFilters?: boolean
  paddingTop?: number // tailwind scale value i.e 16 for pt-16
}
const GenericTextRenderer: FC<Props> = memo(({
  htmlString,
  onReady,
  onUpdateMatchedAnnotationsMap,
  source,
  sourceType,
  onSelect,
  ignoreFilters = false,
  paddingTop = 0
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
  } = usePanel()

  // The hook finds this text's sync targets once it has the text and hands them back - what a
  // target does when it is clicked or hovered is decided here, the same for them as for the
  // annotation targets below.
  const { onHover, onHoverEnd, setText, syncTargets } = useSynopsis()

  const [matchedMap, setMatchedMap] = useState<MatchedAnnotationsMap>({})

  const textWrapperRef = useRef<HTMLDivElement>(null)
  const selectedAnnotationRef = useRef<SelectedAnnotation | null>(null)
  const targetsRef = useRef<HTMLElement[]>(null)
  const hoveredAnnotationsRef = useRef<string[] | null>(null)
  const activeAnnotationTypesRef = useRef<AnnotationTypesDict | null>(null)
  const { popover, onTargetClick } = useAnnotationPopover({
    source,
    wrapper: textWrapperRef.current,
    onBaseItemSelection: onSelect
  })

  // Document object that is only recreated when htmlString changes - e.g. on item change or content type change
  const parsedDom: Element = React.useMemo(() => {
    if (htmlString === '') return
    const doc = new DOMParser().parseFromString(`${htmlString}`, 'text/html')
    const body = doc.querySelector('body')
    const div = doc.createElement('div')
    div.replaceChildren(...body.childNodes)
    return div
  }, [htmlString])

  // Attach the content of the Document object as children of textWrapperRef.
  useEffect(() => {
    if (!parsedDom) return

    textWrapperRef.current.replaceChildren(parsedDom)
    if (onReady) onReady()
  }, [parsedDom])

  // Create and set matchedMap by identifying target nodes. Add listeners to targets.
  useEffect(() => {
    if (!parsedDom) return

    // the hook takes it from here: it finds this text's sync targets and binds its scroll listener
    setText(sourceType === 'text' ? parsedDom : null, source)

    if (annotations) {
      const result = matchAnnotations(parsedDom, annotations, source, annotationsConfig, {
        activeAnnotationTypes: activeAnnotationTypesRef.current,
        ignoreFilters
      })

      // What the matching itself no longer does: give the cross reference targets their style and
      // make every target react to the pointer.
      Object.values(result).forEach(({ annotation, target }) => {
        const isCrossRef = isCrossRefAnnotation(annotation, annotationsConfig)

        target.forEach(targetEl => {
          if (isCrossRef) addCrossRefTargetStyle(targetEl)
          targetEl.addEventListener('click', onClickTarget)
          targetEl.addEventListener('mouseenter', onMouseEnterTarget)
          targetEl.addEventListener('mouseleave', onMouseLeaveTarget)
        })
      })

      setMatchedMap(result)
      if (onUpdateMatchedAnnotationsMap) onUpdateMatchedAnnotationsMap(result)

      // When no annotation filters were configured, store the types this text contains keyed by its
      // contentUrl (source). PanelContext derives the flat annotationFilters from these per-text entries.
      if (!annotationsConfig?.filters) {
        const discoveredTypes = getDiscoveredAnnotationTypes(result, annotationsConfig)
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
  const { entries, targets, disabledTargets } = useMemo(() => {
    const flipped = flipMatchedAnnotationsMap(matchedMap)
    const targets = getTextTargets(flipped)
    const entries = assignNestedTargetsInFlippedMatched(targets, flipped)

    return { entries, targets, disabledTargets: getDisabledTargets(entries, disabledHighlightTypes) }
  }, [matchedMap, disabledHighlightTypes])

  // The one place this text's targets are styled. Their classes are derived from the panel's state
  // rather than added and removed by whoever changed it, so nothing has to undo anyone else's work -
  // see getTargetVisualState.
  useEffect(() => {
    hoveredAnnotationsRef.current = hoveredAnnotations
    selectedAnnotationRef.current = selectedAnnotation
    // the pointer listeners resolve a hovered target against this list
    targetsRef.current = targets

    if (entries.length === 0) return

    const context = {
      hoveredTargets: getTargetsHoveredAnnotations(hoveredAnnotations, targets, matchedMap),
      selectedTargets: selectedAnnotation && matchedMap[selectedAnnotation.annotation.id]
        ? matchedMap[selectedAnnotation.annotation.id].target
        : [],
      disabledTargets
    }

    entries.forEach((entry) =>
      applyTargetVisualState(entry.target, getTargetVisualState(entry, context)))
  }, [entries, targets, disabledTargets, matchedMap, hoveredAnnotations, selectedAnnotation])


  useEffect(() => {
    if (Object.keys(matchedMap).length === 0 || !activeAnnotationTypes) return

    activeAnnotationTypesRef.current = activeAnnotationTypes
    const resultMap = { ...matchedMap }

    const tooltipTypes = annotationsConfig?.tooltipTypes ?? []
    if (activeAnnotationTypes) {
      Object.keys(resultMap).forEach(id => {
        const { annotation } = resultMap[id]
        resultMap[id].filtered = isFiltered(annotation, activeAnnotationTypes, tooltipTypes)
      })
    }

    setMatchedMap(resultMap)

    if (onUpdateMatchedAnnotationsMap) onUpdateMatchedAnnotationsMap(resultMap)
  }, [activeAnnotationTypes])


  function onMouseEnterTarget(e: Event) {
    const target = e.currentTarget as HTMLElement

    // the annotations of the target and of its parent targets, read from their data-annotation-ids
    const idsArray = getHoveredAnnotationsIds(target, targetsRef.current ?? [])
    if (idsArray.length > 0) {
      hoveredAnnotationsRef.current = idsArray
      setHoveredAnnotations(hoveredAnnotationsRef.current)
    }

    onHover(target, source)
  }

  function onMouseLeaveTarget(e: Event) {
    const target = e.currentTarget as HTMLElement

    // hoveredAnnotations can contain parent targets. So on mouse leave, we want to remove the hover
    // style only for the current target's annotation IDs, read from its data-annotation-ids.
    const idsArray = getAnnotationIds(target)
    if (idsArray.length > 0) {
      hoveredAnnotationsRef.current = hoveredAnnotationsRef.current?.filter(a => !idsArray.includes(a)) ?? null
      setHoveredAnnotations(hoveredAnnotationsRef.current)
    }

    onHoverEnd()
  }

  async function onClickTarget(e: Event) {
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
    // into the areas it shows (cross references, tooltip items, sidebar items).
    const targetAnnotations = (annotations ?? []).filter(annotation => {
      if (!annotation.target || getSource(annotation.target[0]).id !== source) return false

      const selector = getSelectorValue(annotation.target[0])
      if (!selector) return false

      return Array.from(parsedDom.querySelectorAll(selector))
        .some(el => el === target || el.contains(target))
    })

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

  }

  return <div
    data-text-wrapper
    data-text-source={sourceType === 'text' ? source : undefined}
    ref={textWrapperRef}
    className="relative"
    style={{ paddingTop: `${paddingTop * 0.25}rem` }}>
    {popover}
  </div>
})

export default GenericTextRenderer
