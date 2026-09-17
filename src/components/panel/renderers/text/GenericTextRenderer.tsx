import React, { FC, memo, useEffect, useMemo, useRef, useState } from 'react'
import {
  addAnnotationBaseStyle,
  addAnnotationId,
  addCrossRefTargetStyle,
  addHighlightStyle,
  addHoverStyle,
  addNestedTargetStyle,
  addSelectedStyle,
  addSyncAnnotationId,
  getDiscoveredAnnotationTypes,
  assignNestedTargetsInFlippedMatched,
  flipMatchedAnnotationsMap,
  getAnnotationIds,
  getHoveredAnnotationsIds,
  getSyncAnnotationIds,
  getTargetsHoveredAnnotations,
  getTextTargets,
  isParentHovered,
  partOfSelectedTargets,
  removeAnnotationBaseStyle,
  removeAnnotationIds,
  removeHighlightStyle,
  removeHoverStyle,
  removeNestedTargetStyle,
  removeSelectedStyle
} from '@/utils/text.ts'
import {
  getNestedAnnotations,
  getSelectorValue,
  getSource,
  isFiltered
} from '@/utils/annotations.ts'
import { useText } from '@/contexts/TextContext.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useSynopsisStore } from '@/store/SynopsisStore.tsx'
import { useShallow } from 'zustand/react/shallow'
import { isProgrammaticScroll } from '@/utils/dom.ts'
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
  const disabledHighlightTypes = useMemo(
    () => new Set(annotationsConfig?.disableHighlighting ?? []),
    [annotationsConfig]
  )
  const { hoveredAnnotations, setHoveredAnnotations } = useText()
  const { handleScroll, onHover, onHoverEnd, setText } = useSynopsis()
  const sourceSyncAnnotations = useSynopsisStore(
    useShallow(state => state.syncAnnotationsBySource.get(source) ?? [])
  )

  const {
    selectedAnnotation,
    activeAnnotationTypes,
    setSelectedAnnotation,
    updateAnnotationTypesBySource,
    setDynamicAnnotationTypes,
    annotations,
    addSyncedTargets,
    getScroller,
  } = usePanel()

  const [matchedMap, setMatchedMap] = useState<MatchedAnnotationsMap>({})

  const textWrapperRef = useRef<HTMLDivElement>(null)
  const flippedMatchedMapRef = useRef<MergedAnnotationEntry[]>(null)
  const selectedAnnotationRef = useRef<SelectedAnnotation | null>(null)
  const targetsRef = useRef<HTMLElement[]>(null)
  const hoveredAnnotationsRef = useRef<string[] | null>(null)
  const activeAnnotationTypesRef = useRef<AnnotationTypesDict | null>(null)
  // Targets whose annotations are all types in annotations.disableHighlighting. Built for free in
  // the main highlight effect's loop (the flipped map only changes when matchedMap does), and read
  // by the hover/selected effects to skip the grey/nested-border styles for those targets.
  const disabledTargetsRef = useRef<Set<Element>>(new Set())
  // Map of each sync target element in this source to the sync annotations that touch it. Built in
  // the sourceSyncAnnotations effect and read by the click/hover/scroll listeners to resolve synced targets.
  const targetsSyncMapRef = useRef<Map<HTMLElement, Annotation[]>>(new Map())

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

    targetsSyncMapRef.current = new Map()

    textWrapperRef.current.replaceChildren(parsedDom)
    if (onReady) onReady()
  }, [parsedDom])

  // Create and set matchedMap by identifying target nodes. Add listeners to targets.
  useEffect(() => {
    if (!parsedDom) return

    setText(sourceType === 'text' ? parsedDom : null, source)

    const scrollContainer = textWrapperRef.current?.closest('[data-text-container]') as HTMLElement | null
    const onScroll = () => {
      if (!scrollContainer || isProgrammaticScroll(scrollContainer)) return

      handleScroll(source)
    }
    scrollContainer?.addEventListener('scroll', onScroll, { passive: true })

    if (annotations) {
      const annotationsInText = annotations.filter(annotation => annotation.target && getSource(annotation.target[0]).id === source)

      const result = annotations.reduce<MatchedAnnotationsMap>((acc, cur) => {
        if (!cur.target) return acc

        const isSource = getSource(cur.target[0]).id === source
        const selector = getSelectorValue(cur.target[0])

        if (!selector || selector === '#') {
          console.error('Annotation error','Selector value of target is empty for this annotation', cur)
          return acc
        }

        if (!isSource) return acc

        if (cur.body.annotationType === annotationsConfig?.crossRefContentType) {
          Array.from(parsedDom.querySelectorAll(selector)).forEach(el => {
            addCrossRefTargetStyle(el)
          })
        }

        const matchedNodes = Array.from(parsedDom.querySelectorAll(selector))

        if (matchedNodes.length > 0) {
          const tooltipTypes = annotationsConfig?.tooltipTypes ?? []

          matchedNodes.forEach(target => {
            target.addEventListener('click', onClickTarget)
            target.addEventListener('mouseenter', onMouseEnterTarget)
            target.addEventListener('mouseleave', onMouseLeaveTarget)
          })

          const nestedAnnotations = getNestedAnnotations(cur, annotationsInText)

          acc[cur.id] = {
            target: matchedNodes,
            filtered: (cur.body.annotationType && annotationsConfig?.crossRefContentType !== cur.body?.annotationType) ? (!activeAnnotationTypesRef.current || ignoreFilters || isFiltered(cur, activeAnnotationTypesRef.current, tooltipTypes)) : false,
            annotation: cur,
            nestedAnnotations
          }
        }
        return acc
      }, {})

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

      flippedMatchedMapRef.current = flipMatchedAnnotationsMap(result)
      targetsRef.current = getTextTargets(flippedMatchedMapRef.current)
    }

    return () => scrollContainer?.removeEventListener('scroll', onScroll)
  }, [parsedDom, annotations, annotationsConfig])

  // Style and bind listeners on this source's sync targets so they become clickable. Runs when the
  // text is attached and when this source's sync annotations change (e.g. another panel contains completely new sync connections which refer to this text - the newly found targets in this text should become clickable to enable synopsis)
  // synced text). Targets already bound are skipped (they carry a sync annotation id attribute).
  useEffect(() => {
    if (!parsedDom || sourceSyncAnnotations.length === 0) return

    sourceSyncAnnotations.forEach((cur) => {
      const target = cur.target.find((t) => getSource(t).id === source)
      const selector = target ? getSelectorValue(target) : null
      if (!selector) return

      Array.from(parsedDom.querySelectorAll(selector)).forEach((el) => {
        const targetEl = el as HTMLElement

        // accumulate this target's sync annotations; skip an annotation already in its list
        const existing = targetsSyncMapRef.current.get(targetEl) ?? []
        if (!existing.some((a) => a.id === cur.id)) {
          targetsSyncMapRef.current.set(targetEl, [...existing, cur])
        }

        if (getSyncAnnotationIds(targetEl).some(Boolean)) return
        addSyncAnnotationId(targetEl, cur.id)
        // TODO: the synopsis style should be added based on annotation types we allow for default highlighting
        // addHighlightStyle(targetEl)
        addAnnotationBaseStyle(targetEl)
        targetEl.addEventListener('click', onClickTarget)
        targetEl.addEventListener('mouseenter', onMouseEnterTarget)
        targetEl.addEventListener('mouseleave', onMouseLeaveTarget)
      })
    })

    const sortedTargets = Array.from(targetsSyncMapRef.current.keys()).sort((a, b) => {
      const aRect = a.getBoundingClientRect()
      const bRect = b.getBoundingClientRect()
      return aRect.top - bRect.top || aRect.left - bRect.left
    })

    addSyncedTargets(sortedTargets, source)
  }, [parsedDom, sourceSyncAnnotations])

  // Apply highlighting styles on every map update
  useEffect(() => {
    if (Object.keys(matchedMap).length === 0) return

    const flippedMatchedAnnotationsMap = flipMatchedAnnotationsMap(matchedMap)
    targetsRef.current = getTextTargets(flippedMatchedAnnotationsMap)
    flippedMatchedMapRef.current = assignNestedTargetsInFlippedMatched(targetsRef.current, flippedMatchedAnnotationsMap)

    const disabledTargets = new Set<Element>()

    flippedMatchedMapRef.current.forEach(fa => {
      const annotations = fa.annotations
      const target = fa.target

      let someFiltered = false

      removeAnnotationIds(target)
      removeAnnotationBaseStyle(target)
      removeHighlightStyle(target)

      // Look if some of the annotations are visible and add the ids of those to the node
      annotations.forEach((annotation, i) => {
        if (fa.filtered[i]) {
          addAnnotationId(target, annotation.id)
          addAnnotationBaseStyle(target)
        }
        someFiltered = !someFiltered ? fa.filtered[i] : true
      })

      const filteredAnnotations = annotations.filter((_, i) => fa.filtered[i])
      // we need to check only the filtered annotations types if they belong to disabledHighlightTypes
      const allDisabled = filteredAnnotations.length > 0 &&
        filteredAnnotations.every(a => disabledHighlightTypes.has(a.body.annotationType))

      if (allDisabled) disabledTargets.add(target)

      if (someFiltered && !allDisabled) {
        addHighlightStyle(target)
      }
    })

    disabledTargetsRef.current = disabledTargets
  }, [matchedMap, disabledHighlightTypes])

  // Update styles of targets if necessary on update of hoveredAnnotations
  useEffect(() => {
    if (!matchedMap) return
    hoveredAnnotationsRef.current = hoveredAnnotations
    const targetsOfHoveredAnnotations = getTargetsHoveredAnnotations(hoveredAnnotations, targetsRef.current, matchedMap)
    const targetsOfSelectedAnnotation = selectedAnnotation && !!(matchedMap[selectedAnnotation.annotation.id]) ?
      matchedMap[selectedAnnotation.annotation.id].target : []

    flippedMatchedMapRef.current?.forEach(fa => {
      const target = fa.target as HTMLElement
      const annotations = fa.annotations

      let someFiltered = false

      // Look if some of the annotations are visible and add the ids of those to the node
      annotations.forEach((_, i) => {
        if (!fa.filtered[i]) return
        someFiltered = !someFiltered ? fa.filtered[i] : true
      })

      if (someFiltered) {
        removeHoverStyle(target)
        removeNestedTargetStyle(target)
        removeHighlightStyle(target)

        const allDisabled = disabledTargetsRef.current.has(target)
        const hasParentHovered = isParentHovered(targetsOfHoveredAnnotations, fa.parents)
        const hasHighlightedParentHovered = isParentHovered(
          targetsOfHoveredAnnotations,
          fa.parents.filter(parent => !disabledTargetsRef.current.has(parent))
        )

        if (targetsOfHoveredAnnotations.includes(target)) {
          if (!allDisabled && hasHighlightedParentHovered) {
            addHoverStyle(target)
            addNestedTargetStyle(target)
          } else if (!allDisabled && hasParentHovered) {
            // Hovered parent(s) are all disabled annotations: render the grey highlight
            // instead of the nested border so the target reads as a plain highlight.
            addHighlightStyle(target)
          } else {
            addHoverStyle(target)
          }
        } else if (!partOfSelectedTargets(target, targetsOfSelectedAnnotation)) {
          if (!allDisabled) addHighlightStyle(target)
        }
      }
    })
  }, [hoveredAnnotations])

  // Apply selected styles on every selectedAnnotation update
  useEffect(() =>   {
    if (!matchedMap) return

    selectedAnnotationRef.current = selectedAnnotation
    const targetsOfSelectedAnnotation = selectedAnnotation && !!(matchedMap[selectedAnnotation.annotation.id])
      ? matchedMap[selectedAnnotation.annotation.id].target
      : []

    if (!flippedMatchedMapRef.current) return

    flippedMatchedMapRef.current.forEach(fa => {
      const target = fa.target as HTMLElement
      const annotations = fa.annotations

      removeSelectedStyle(target)
      removeHighlightStyle(target)

      let someFiltered = false

      // Look if some of the annotations are visible and add the ids of those to the node
      annotations.forEach((_, i) => {
        if (!fa.filtered[i]) return
        someFiltered = !someFiltered ? fa.filtered[i] : true
      })

      if (partOfSelectedTargets(target, targetsOfSelectedAnnotation)) {
        addSelectedStyle(target)
        return
      } else if (someFiltered && !disabledTargetsRef.current.has(target)) {
        addHighlightStyle(target)
      }
    })
  }, [selectedAnnotation, matchedMap])


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


  const onMouseEnterTarget = (e: Event) => {
    const target = e.currentTarget as HTMLElement

    // the annotations of the target and of its parent targets, read from their data-annotation-ids
    const idsArray = getHoveredAnnotationsIds(target, targetsRef.current ?? [])
    if (idsArray.length > 0) {
      hoveredAnnotationsRef.current = idsArray
      setHoveredAnnotations(hoveredAnnotationsRef.current)
    }

    onHover(target, source)
  }

  const onMouseLeaveTarget = (e: Event) => {
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

  const onClickTarget = async (e: Event) => {
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
