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
  addSelectedStyle,
  assignNestedTargetsInFlippedMatched,
  flipMatchedAnnotationsMap,
  getAnnotationIds,
  getTextTargets,
  isTargetPartOfSelectedAnnotation,
  removeAnnotationBaseStyle,
  removeAnnotationIds,
  removeHighlightStyle,
  removeSelectedStyle
} from '@/utils/text.ts'
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
    updatePanel,
    annotations,
    selectedAnnotation,
    annotationsMode,
  } = usePanel()

  const { setHoveredAnnotations } = useText()
  const { matchedAnnotationsMap, setMatchedAnnotationsMap, activeContentUrl, visible } = useTextView()

  const hoveredAnnotationsRef = useRef<string[] | null>(null)
  const annotationsModeRef = useRef<'aligned' | 'list'>(null)
  const flippedMatchedAnnotationsMapRef = useRef<MergedAnnotationEntry[]>(null)
  const targetsRef = useRef<HTMLElement[]>(null)

  // This is the actual value for matched annotations that is used for rendering.
  // With the state "matchedAnnotationsMap" we create a data-driven version of the map while with "displayedMap"
  // we create a UI-driven value. This applies when the user toggles on/off the TextView.
  const displayedMap = useMemo(() => visible ? matchedAnnotationsMap : {}, [visible, matchedAnnotationsMap])


  function onTargetClick() {
    if (!panelState.showSidebar) {
      updatePanel({ showSidebar: true })
    }
  }

  useEffect(() => {
    annotationsModeRef.current = annotationsMode
  }, [annotationsMode])


  const onMouseLeaveTarget = (e: Event) => {
    // hoveredAnnotations can contain parent targets.
    // So on mouse leave, we want to remove the hover style only for the current target's annotation IDs.
    const target = e.currentTarget as HTMLElement
    const annotIds = getAnnotationIds(target)
    const idsArray = annotIds.split(',')
    if (idsArray.length === 0) return

    setHoveredAnnotations(hoveredAnnotationsRef.current?.filter(a => !idsArray.includes(a)) ?? null)
  }



  // Apply highlighting styles on every map update
  useEffect(() => {
    if (!displayedMap) return
    const flippedMatchedAnnotationsMap = flipMatchedAnnotationsMap(displayedMap)
    targetsRef.current = getTextTargets(flippedMatchedAnnotationsMap)
    console.log('targets', targetsRef.current)
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
        ? displayedMap[selectedAnnotation.id].target
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
      <GenericTextRenderer  htmlString={htmlString} onReady={onReady} source={activeContentUrl.current} annotations={annotations} selectedAnnotationTypes={selectedAnnotationTypes}
        onTargetClick={onTargetClick} onMouseLeaveTarget={onMouseLeaveTarget} isAnnotation={false} updateMatchedAnnotationsMap={setMatchedAnnotationsMap} />
    </div>
  </div>
})

export default TextRenderer
