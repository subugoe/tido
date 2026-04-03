import {
  FC,
  memo,
  useEffect,
  useMemo,
  useRef,
} from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { scrollIntoViewIfNeeded } from '@/utils/dom.ts'
import { useText } from '@/contexts/TextContext.tsx'
import {
  addAnnotationBaseStyle,
  addAnnotationId,
  addHighlightStyle,
  addHoverStyle, addNestedTargetStyle,
  addSelectedStyle,
  assignNestedTargetsInFlippedMatched,
  flipMatchedAnnotationsMap,
  getAnnotationIds,
  getHoveredAnnotationsIds,
  getTargetsHoveredAnnotations,
  getTextTargets,
  isParentHovered,
  isTargetPartOfSelectedAnnotation,
  removeAnnotationBaseStyle,
  removeAnnotationIds,
  removeHighlightStyle,
  removeHoverStyle,
  removeNestedTargetStyle,
  removeSelectedStyle
} from '@/utils/text.ts'
import { computeNewSelectedAnnotationIndex } from '@/utils/annotations.ts'
import { useTextView } from '@/contexts/TextViewContext.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import GenericTextRenderer from '@/components/GenericTextRenderer.tsx'

interface Props {
  htmlString: string
  aGroup?: boolean
  onReady?: () => void
}

const TextRenderer: FC<Props> = memo(({ htmlString, onReady }) => {
  const { showContentTypeToggle } = useConfig()
  const {
    panelState,
    selectedAnnotationTypes,
    setSelectedAnnotation,
    updatePanel,
    selectedAnnotation,
    annotationsMode,
    panelId
  } = usePanel()

  const { hoveredAnnotations, setHoveredAnnotations } = useText()
  const { matchedAnnotationsMap, setMatchedAnnotationsMap, activeContentUrl, visible } = useTextView()


  const prevClickedTargetIndexRef = useRef<number>(null)

  const annotationsModeRef = useRef<'aligned' | 'list'>(null)
  const flippedMatchedAnnotationsMapRef = useRef<MergedAnnotationEntry[]>(null)
  const targetsRef = useRef<HTMLElement[]>(null)

  // This is the actual value for matched annotations that is used for rendering.
  // With the state "matchedAnnotationsMap" we create a data-driven version of the map while with "displayedMap"
  // we create a UI-driven value. This applies when the user toggles on/off the TextView.
  const displayedMap = useMemo(() => visible ? matchedAnnotationsMap : {}, [visible, matchedAnnotationsMap])

  function containsChildren(targets: HTMLElement[], target: HTMLElement) {
    for(const t of targets) {
      if (target.contains(t) && target !== t) return true
    }
    return false
  }

  const onClickTarget = (e: Event) => {
    // Generic click listener
    // TODO:  Be careful with state here. This listener will be added once a new map is created.
    //  So this function will be called with those state values which existed at the time of adding.

    const target = e.currentTarget as Element
    const targetEntry: MergedAnnotationEntry = flippedMatchedAnnotationsMapRef.current.filter(entry => entry.target === target)[0]

    if (!containsChildren(targetsRef.current, target as HTMLElement)) {
      // handle only click events on 'deepest' target -> ignore click events on its containing targets while selection
      e.stopPropagation()
    }

    const idsValue = getAnnotationIds(target)
    if (!idsValue) return

    targetEntry.selectedAnnotationIndex = computeNewSelectedAnnotationIndex(targetEntry, prevClickedTargetIndexRef.current, flippedMatchedAnnotationsMapRef.current)

    const annotation = targetEntry.selectedAnnotationIndex !== -1 ? targetEntry.annotations[targetEntry.selectedAnnotationIndex] : null

    if (annotation) {
      if (!panelState.showSidebar) {
        updatePanel({ showSidebar: true })
      }

      setSelectedAnnotation(annotation)
      prevClickedTargetIndexRef.current = flippedMatchedAnnotationsMapRef.current.findIndex(entry => targetEntry === entry)
    }
    else {
      setSelectedAnnotation(null)
    }
  }

  useEffect(() => {
    annotationsModeRef.current = annotationsMode
  }, [annotationsMode])

  const onMouseEnterTarget = (e: Event) => {
    const target = e.currentTarget as HTMLElement
    const idsArray = getHoveredAnnotationsIds(target, targetsRef.current)
    if (idsArray.length === 0) return

    setHoveredAnnotations(idsArray)
  }

  const onMouseLeaveTarget = (e: Event) => {
    // hoveredAnnotations can contain parent targets.
    // So on mouse leave, we want to remove the hover style only for the current target's annotation IDs.
    const target = e.currentTarget as HTMLElement
    const annotIds = getAnnotationIds(target)
    const idsArray = annotIds.split(',')
    if (idsArray.length === 0) return

    setHoveredAnnotations(hoveredAnnotations?.filter(a => !idsArray.includes(a)))
  }


  // Update hover styles each time hoveredAnnotation changes
  useEffect(() => {
    if (!matchedAnnotationsMap) return
    const panelEl = document.getElementById(panelId)
    const targetsOfHoveredAnnotations = getTargetsHoveredAnnotations(hoveredAnnotations, targetsRef.current, matchedAnnotationsMap)
    const targetsOfSelectedAnnotation = selectedAnnotation && !!(matchedAnnotationsMap[selectedAnnotation.id]) ?
      matchedAnnotationsMap[selectedAnnotation.id].target.map((selector) => panelEl.querySelector(selector)) : []

    flippedMatchedAnnotationsMapRef.current?.forEach(fa => {
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
        } else if (!isTargetPartOfSelectedAnnotation(target, targetsOfSelectedAnnotation)) {
          addHighlightStyle(target)
        }
      }
    })
  }, [hoveredAnnotations])

  // Apply highlighting styles on every map update
  useEffect(() => {
    if (!displayedMap) return
    const flippedMatchedAnnotationsMap = flipMatchedAnnotationsMap(displayedMap)
    targetsRef.current = getTextTargets(flippedMatchedAnnotationsMap)
    flippedMatchedAnnotationsMapRef.current = assignNestedTargetsInFlippedMatched(targetsRef.current, flippedMatchedAnnotationsMap)

    flippedMatchedAnnotationsMapRef.current.forEach(fa => {
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
  }, [displayedMap])

  // Apply selected styles on every selectedAnnotation update
  useEffect(() => {
    if (!displayedMap) return
    const targetsOfSelectedAnnotation =
      selectedAnnotation && !!(displayedMap[selectedAnnotation.id])
        ? displayedMap[selectedAnnotation.id].target.map((selector) => document.querySelector(selector))
        : []

    flippedMatchedAnnotationsMapRef.current.forEach(fa => {
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

      if (isTargetPartOfSelectedAnnotation(target, targetsOfSelectedAnnotation)) {
        addSelectedStyle(target)
        scrollIntoViewIfNeeded(target, target.closest('[data-text-container="true"]'))
        return
      }
      else if(someFiltered) {
        addHighlightStyle(target)
      }
    })
  }, [selectedAnnotation, displayedMap])

  return <div className="relative flex">
    <div data-text-wrapper  className={showContentTypeToggle ? 'pt-16' : 'pt-2'}>
      <GenericTextRenderer  htmlString={htmlString} onReady={onReady} activeContentUrl={activeContentUrl.current} selectedAnnotationTypes={selectedAnnotationTypes} onClickTarget={onClickTarget}
        onMouseEnterTarget={onMouseEnterTarget} onMouseLeaveTarget={onMouseLeaveTarget} isAnnotation={false} updateMatchedAnnotationsMap={setMatchedAnnotationsMap} />
    </div>
  </div>
})

export default TextRenderer
