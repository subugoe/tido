import React, { FC, memo, useEffect, useRef, useState } from 'react'
import {
  addActiveTargetStyle,
  addAnnotationBaseStyle,
  addAnnotationId,
  addCrossRefTargetStyle,
  addSynopsisStyle,
  addHighlightStyle,
  addHoverStyle,
  addNestedTargetStyle,
  addSelectedStyle,
  addSyncAnnotationId,
  addSyncHighlightStyle,
  assignNestedTargetsInFlippedMatched,
  flipMatchedAnnotationsMap,
  getAnnotationIds,
  getHoveredAnnotationsIds,
  getSyncAnnotationIds,
  getTargetsHoveredAnnotations,
  getTextTargets,
  isParentHovered,
  partOfSelectedTargets,
  removeActiveTargetStyle,
  removeAnnotationBaseStyle,
  removeAnnotationIds,
  removeHighlightStyle,
  removeHoverStyle,
  removeSynopsisStyle,
  removeNestedTargetStyle,
  removeSelectedStyle
} from '@/utils/text.ts'
import {
  getNestedAnnotations,
  getSource,
  isFiltered
} from '@/utils/annotations.ts'
import { useText } from '@/contexts/TextContext.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useSynopsisStore, SyncTargets } from '@/store/SynopsisStore.tsx'
import { containsChildren } from '@/utils/text.ts'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import AnnotationPopoverContainer from '@/components/panel/annotations/popover/AnnotationPopoverContainer.tsx'
import AnnotationPopoverContent from '@/components/panel/annotations/popover/AnnotationPopoverContent.tsx'
import SynopsisItem from '@/components/panel/annotations/popover/items/SynopsisItem.tsx'
import { SelectedAnnotation } from '@/types'

interface Props {
  htmlString?: string
  onReady?: () => void
  onUpdateMatchedAnnotationsMap?: (map: MatchedAnnotationsMap) => void
  source: string
  onSelect?: () => void
  ignoreFilters?: boolean
  paddingTop?: number // tailwind scale value i.e 16 for pt-16
}
const GenericTextRenderer: FC<Props> = memo(({
  htmlString,
  onReady,
  onUpdateMatchedAnnotationsMap,
  source,
  onSelect,
  ignoreFilters = false,
  paddingTop = 0
}) => {
  const { annotations: annotationsConfig } = useConfig()
  const { hoveredAnnotations, setHoveredAnnotations } = useText()
  const assignTargetEls = useSynopsisStore(state => state.assignTargetEls)
  const appendSyncTargets = useSynopsisStore(state => state.appendSyncTargets)
  const syncedTargets = useSynopsisStore(state => state.syncedTargets)

  const {
    selectedAnnotation,
    selectedAnnotationTypes,
    setSelectedAnnotation,
    annotations,
    syncAnnotations,
    setHoveredSyncAnnotations,
    panelId
  } = usePanel()
  const [matchedMap, setMatchedMap] = useState<MatchedAnnotationsMap>({})

  const [tooltipTargetElement, setTooltipTargetElement] = useState<HTMLElement | null>(null)
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const [crossRefAnnotations, setCrossRefAnnotations] = useState<Annotation[]>([])
  const [relatedAnnotations, setRelatedAnnotations] = useState<Annotation[]>([])
  const [tooltipAnnotations, setTooltipAnnotations] = useState<Annotation[]>([])
  const [syncTargets, setSyncTargets] = useState<SyncTargets>({ yPos: 0, originTarget: null, targets: [] })

  const textWrapperRef = useRef<HTMLDivElement>(null)
  const flippedMatchedMapRef = useRef<MergedAnnotationEntry[]>(null)
  const selectedAnnotationRef = useRef<SelectedAnnotation | null>(null)
  const targetsRef = useRef<HTMLElement[]>(null)
  const hoveredAnnotationsRef = useRef<string[] | null>(null)
  const activeTargetRef = useRef<HTMLElement | null>(null)
  const selectedAnnotationTypesRef = useRef<AnnotationTypesDict | null>(null)

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

  // When synced targets are chosen from a synopsis popover, highlight the ones that belong to
  // this renderer's source and scroll its container so each sits at the same y-position within
  // the container as the clicked target. Runs once the text is attached (parsedDom) and on every
  // selection change
  useEffect(() => {
    if (!parsedDom || !textWrapperRef.current) return
    if (!syncedTargets || syncedTargets.targets.length === 0) return

    const { yPos, targets, originTarget: prevClickedTarget } = syncedTargets

    // track the elements we highlight so the cleanup can remove their style afterwards
    const highlightedEls: HTMLElement[] = []

    targets.forEach((syncedTarget) => {
      // only handle synced targets that belong to the content rendered here
      if (syncedTarget.source.id !== source) return

      const targetEl = textWrapperRef.current.querySelector(syncedTarget.selector) as HTMLElement
      if (!targetEl) return

      addSynopsisStyle(targetEl)
      highlightedEls.push(targetEl)

      // scroll so this target's y-position within the container matches the clicked target's
      const scrollContainer = targetEl.closest('[data-text-container]') as HTMLElement
      if (scrollContainer) {
        const currentY = targetEl.getBoundingClientRect().top - scrollContainer.getBoundingClientRect().top
        const desiredScrollTop = scrollContainer.scrollTop + currentY - yPos
        const maxScrollTop = scrollContainer.scrollHeight - scrollContainer.clientHeight
        scrollContainer.scrollTo({ top: Math.max(0, Math.min(desiredScrollTop, maxScrollTop)), behavior: 'smooth' })
      }
    })

    // before the next run / on unmount: remove the synopsis style from these sync targets and
    // clear the active style of the previously clicked (origin) target
    return () => {
      highlightedEls.forEach((el) => removeSynopsisStyle(el))
      if (prevClickedTarget) removeActiveTargetStyle(prevClickedTarget)
    }
  }, [syncedTargets, parsedDom, source])

  // Create and set matchedMap by identifying target nodes. Add listeners to targets.
  useEffect(() => {
    if (!parsedDom) return

    if (annotations) {
      const annotationsInText = annotations.filter(annotation => annotation.target?.[0].source === source)

      const result = annotations.reduce<MatchedAnnotationsMap>((acc, cur) => {
        if (!cur.target) return acc
        const isSource = getSource(cur.target[0]).id === source
        const selector = (cur.target[0].selector as CssSelector)?.value

        if (!isSource || !selector) {
          if (!selector) console.error('Annotation error','Selector value of target is empty for this annotation', cur)
          return acc
        }

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
            filtered: annotationsConfig?.crossRefContentType !== cur.body?.annotationType ? (!selectedAnnotationTypes || ignoreFilters || isFiltered(cur, selectedAnnotationTypes, tooltipTypes)) : false,
            annotation: cur,
            nestedAnnotations
          }
        }
        return acc
      }, {})
      setMatchedMap(result)
      if (onUpdateMatchedAnnotationsMap) onUpdateMatchedAnnotationsMap(result)

      flippedMatchedMapRef.current = flipMatchedAnnotationsMap(matchedMap)
      targetsRef.current = getTextTargets(flippedMatchedMapRef.current)
    }


    // add a function to assign html element to each target in syncMaps of SynopsisStore
    // - get all targets for this "source" - contentUrl in syncMaps
    // - for each selectorValue -> we locate the target and assign as targetEl -> panelEl.querySelector()
    assignTargetEls(source, textWrapperRef.current, panelId)

    if (syncAnnotations) {
      syncAnnotations.reduce((acc, cur) => {
        const target = cur.target.find(t => getSource(t).id === source)
        if (!target) return acc

        const selector = (target.selector as CssSelector)?.value
        const targets = Array.from(parsedDom.querySelectorAll(selector))

        if (!targets) return acc

        targets.forEach(target => {
          addSyncAnnotationId(target, cur.id)
          addAnnotationBaseStyle(target)
          addSyncHighlightStyle(target)
          target.addEventListener('click', onClickTarget)
          target.addEventListener('mouseenter', onMouseEnterSyncTarget)
          target.addEventListener('mouseleave', onMouseLeaveSyncTarget)
        })

        return acc
      }, {} as { [key: string]: Element[] })
      // append the panel collection's synoptic annotations into the global syncMaps
      appendSyncTargets(source, syncAnnotations, textWrapperRef.current, panelId)
    }

  }, [parsedDom, annotations, annotationsConfig])

  // Apply highlighting styles on every map update
  useEffect(() => {
    if (Object.keys(matchedMap).length === 0) return

    const flippedMatchedAnnotationsMap = flipMatchedAnnotationsMap(matchedMap)
    targetsRef.current = getTextTargets(flippedMatchedAnnotationsMap)
    flippedMatchedMapRef.current = assignNestedTargetsInFlippedMatched(targetsRef.current, flippedMatchedAnnotationsMap)

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

      if (someFiltered) {
        addHighlightStyle(target)
      }
    })
  }, [matchedMap])

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

        const hasParentHovered = isParentHovered(targetsOfHoveredAnnotations, fa.parents)
        if (targetsOfHoveredAnnotations.includes(target))  {
          addHoverStyle(target)
          if (hasParentHovered) {
            addNestedTargetStyle(target)
          }
        } else if (!partOfSelectedTargets(target, targetsOfSelectedAnnotation)) {
          addHighlightStyle(target)
        }
      }
    })
  }, [hoveredAnnotations])

  // Apply selected styles on every selectedAnnotation update
  useEffect(() => {
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
      } else if (someFiltered) {
        addHighlightStyle(target)
      }
    })
  }, [selectedAnnotation, matchedMap])

  useEffect(() => {
    if (Object.keys(matchedMap).length === 0) return

    const resultMap = { ...matchedMap }
    const tooltipTypes = annotationsConfig?.tooltipTypes ?? []
    if (selectedAnnotationTypes) {
      Object.keys(resultMap).forEach(id => {
        const { annotation } = resultMap[id]
        resultMap[id].filtered = isFiltered(annotation, selectedAnnotationTypes, tooltipTypes)
      })
    }

    setMatchedMap(resultMap)
    if (onUpdateMatchedAnnotationsMap) onUpdateMatchedAnnotationsMap(resultMap)
    selectedAnnotationTypesRef.current = selectedAnnotationTypes
  }, [selectedAnnotationTypes])

  const onMouseEnterTarget = (e: Event) => {
    const target = e.currentTarget as HTMLElement
    const idsArray = getHoveredAnnotationsIds(target, targetsRef.current)
    if (idsArray.length === 0) return
    hoveredAnnotationsRef.current = idsArray
    setHoveredAnnotations(hoveredAnnotationsRef.current)
  }

  const onMouseLeaveTarget = (e: Event) => {
    // hoveredAnnotations can contain parent targets.
    // So on mouse leave, we want to remove the hover style only for the current target's annotation IDs.
    const target = e.currentTarget as HTMLElement
    const idsArray = getAnnotationIds(target)
    if (idsArray.length === 0) return

    hoveredAnnotationsRef.current = hoveredAnnotationsRef.current?.filter(a => !idsArray.includes(a)) ?? null
    setHoveredAnnotations(hoveredAnnotationsRef.current)
  }

  function isFilteredAnnotation(annotation: Annotation, selectedAnnotationTypes: AnnotationTypesDict) {
    // filter Variant Annotations based on witnesses in selectedAnnotationTypes
    // filter all other annotations which have type as key in selectedAnnotation types
    const annotationType = annotation.body.annotationType

    if (!selectedAnnotationTypes || annotationsConfig.tooltipTypes?.includes(annotationType)) return true

    if (annotationType === 'Variant') {
      return selectedAnnotationTypes?.['Variant']?.some(witness => annotation.body.witnesses.includes(witness))
    } else {
      return Object.keys(selectedAnnotationTypes).includes(annotationType)
    }
  }


  const onClickTarget = async (e: Event) => {
    // Generic click listener
    // TODO:  Be careful with state here. This listener will be added once a new map is created.
    //  So this function will be called with those state values which existed at the time of adding.

    const target = e.currentTarget as Element

    // 1) Read the latest store state imperatively to avoid a stale syncMaps closure
    //    (opening another panel can update syncMaps after this listener was attached),
    //    then find the sync entry of this source whose element is the clicked target
    //    and collect its synced targets (the same text in other sources/panels).
    const { syncMaps } = useSynopsisStore.getState()
    const sourceSyncTargets = syncMaps[source] ?? []
    // the same content can be open in several panels, so match the clicked element against
    // each panel's rendered element to find the specific panel entry it belongs to; its
    // synced targets are the ones resolved for that panel
    const clickedPanel = sourceSyncTargets
      .flatMap(syncTarget => Object.values(syncTarget.panels))
      .find(panel => panel.targetEl === target)


    console.log('sync connection', clickedPanel)
    const newSyncTargets = clickedPanel?.syncedTargets ?? []

    // TODO: Fix bug: Click at a new target should check if there are syncedTargets -> if yes -> should make them null or so

    // y-position of the clicked target within its scroll container's visible height
    // (ignoring scroll position), so each synced panel can scroll its own synced target
    // to the same y-position and align it with this one.
    const clickedScrollContainer = (target as HTMLElement).closest('[data-text-container]') as HTMLElement | null
    const clickedYPos = clickedScrollContainer
      ? target.getBoundingClientRect().top - clickedScrollContainer.getBoundingClientRect().top
      : 0

    const targetEntry: MergedAnnotationEntry = (flippedMatchedMapRef.current ?? []).filter(entry => entry.target === target)[0]

    let hasFilteredAnnotations = false
    targetEntry?.annotations.forEach(annotation => {
      if (isFilteredAnnotation(annotation, selectedAnnotationTypesRef.current) || annotation.body.annotationType === annotationsConfig?.crossRefContentType) hasFilteredAnnotations = true
    })

    // nothing to show for this element: neither filtered annotations nor synced targets
    if (!hasFilteredAnnotations && newSyncTargets.length === 0) return

    if (!containsChildren(targetsRef.current, target as HTMLElement)) {
      // handle only click events on 'deepest' target -> ignore click events on its containing targets while selection
      e.stopPropagation()
    }

    const crossRefAnnotations = annotations
      .filter(a => {
        const isInSource = a.target?.[0].source === source
        const isCrossRef = a.body.annotationType === annotationsConfig?.crossRefContentType
        return isInSource && isCrossRef
      })
      .filter(a => {
        const selector = (a.target[0].selector as CssSelector)?.value
        if (!selector) return false
        return Array.from(parsedDom.querySelectorAll(selector)).includes(target)
      })

    const seen = new Set<string>()
    // compute related annotations: all annotations for the clicked target and its parent targets
    const newRelatedAnnotations = (flippedMatchedMapRef.current ?? [])
      .filter(entry => entry.target === target || entry.target.contains(target as HTMLElement))
      .flatMap(entry => entry.annotations)
      .filter(a => !seen.has(a.id) && seen.add(a.id) && a.body.annotationType !== annotationsConfig?.crossRefContentType && isFilteredAnnotation(a, selectedAnnotationTypesRef.current))

    const tooltipTypes = annotationsConfig?.tooltipTypes ?? []

    let normalAnnotations = []
    const _tooltipAnnotations = [] as Annotation[]

    if (tooltipTypes.length === 0) {
      normalAnnotations = newRelatedAnnotations
    } else {
      normalAnnotations = newRelatedAnnotations.filter(a => {
        const isTooltipAnnotation = tooltipTypes.includes(a.body.annotationType)
        if (!isTooltipAnnotation) return true
        _tooltipAnnotations.push(a)
        return false
      })
    }

    const openTooltip = _tooltipAnnotations.length > 0 || crossRefAnnotations.length > 0 || normalAnnotations.length > 1 || newSyncTargets.length > 0

    if (openTooltip) {
      setTooltipOpen(true)
      setTooltipTargetElement(target as HTMLElement)
      setRelatedAnnotations(normalAnnotations)
      setTooltipAnnotations(_tooltipAnnotations)
      // 2) pass the synced targets of this entry (and the clicked target's y-position) to the popover content
      setSyncTargets({ yPos: clickedYPos, originTarget: target as HTMLElement, targets: newSyncTargets })
      if (target !== activeTargetRef.current)  addActiveTargetStyle(target)
    }

    setCrossRefAnnotations(crossRefAnnotations)

    // when we have only one normal annotation then we should select the annotation in Sidebar and not open tooltip. (select + deselect annotation)
    if (!openTooltip && normalAnnotations.length === 1) {
      // we need selectedAnnotationRef since the click listener has not an updated value of selectedAnnotation, it has the 'null' when it was initially created
      if (targetEntry.annotations[0].id === selectedAnnotationRef.current?.annotation.id) {
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

    activeTargetRef.current = target as HTMLElement
  }

  const onMouseEnterSyncTarget = (e: Event) => {
    const target = e.currentTarget as HTMLElement
    const idsArray = getSyncAnnotationIds(target)
    if (idsArray.length === 0) return

    setHoveredSyncAnnotations(idsArray)
  }

  const onMouseLeaveSyncTarget = (e: Event) => {
    // hoveredAnnotations can contain parent targets.
    // So on mouse leave, we want to remove the hover style only for the current target's annotation IDs.
    const target = e.currentTarget as HTMLElement
    const idsArray = getSyncAnnotationIds(target)
    if (idsArray.length === 0) return
    setHoveredSyncAnnotations(null)
  }

  const closeTooltip = () => {
    setTooltipOpen(false)
    setTooltipTargetElement(null)
    setCrossRefAnnotations([])
    setRelatedAnnotations([])
    setSyncTargets({ yPos: 0, originTarget: null, targets: [] })
    setHoveredAnnotations([])
    removeActiveTargetStyle(activeTargetRef.current)
    activeTargetRef.current = null
  }

  // Close the popover when the synopsis is opened, but keep the clicked target's active style
  // so it stays highlighted while its synced targets are shown in the other panels.
  const onSynopsisItemClick = () => {
    setTooltipOpen(false)
    setCrossRefAnnotations([])
    setRelatedAnnotations([])
  }




  return <div data-text-wrapper data-panel-id={panelId} ref={textWrapperRef} className="relative" style={{ paddingTop: `${paddingTop * 0.25}rem` }}>
    <AnnotationPopoverContainer
      target={tooltipTargetElement}
      wrapper={textWrapperRef.current}
      open={tooltipOpen}
      onClose={closeTooltip}>
      <AnnotationPopoverContent
        target={tooltipTargetElement}
        source={source}
        crossRefAnnotations={crossRefAnnotations}
        relatedAnnotations={relatedAnnotations}
        tooltipAnnotations={tooltipAnnotations}
        onBaseItemSelection={onSelect}
        onClose={closeTooltip}
      >
        {syncTargets.targets.length > 0 &&
          <SynopsisItem syncTargets={syncTargets} onSelect={onSynopsisItemClick} />}
      </AnnotationPopoverContent>
    </AnnotationPopoverContainer>
  </div>
})

export default GenericTextRenderer
