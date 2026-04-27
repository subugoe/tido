import {
  FC,
  memo,
  useEffect,
  useRef,
  useState,
} from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { useTextView } from '@/contexts/TextViewContext.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { useText } from '@/contexts/TextContext.tsx'
import GenericTextRenderer from '@/components/panel/renderers/text/GenericTextRenderer.tsx'
import { getAnnotationContentType } from '@/utils/annotations.ts'
import { addActiveTargetStyle, removeActiveTargetStyle } from '@/utils/text.ts'
import AnnotationPopoverContent from '@/components/panel/annotations/popover/AnnotationPopoverContent.tsx'
import AnnotationPopoverContainer from '@/components/panel/annotations/popover/AnnotationPopoverContainer.tsx'

interface Props {
  htmlString: string
  onReady: () => void
}

const TextRenderer: FC<Props> = memo(({ htmlString, onReady }) => {
  const { showContentTypeToggle } = useConfig()
  const {
    panelState,
    updatePanel,
    annotationsMode,
    updateMatchedAnnotationsMap,
    panelId,
    selectedAnnotation,
    setSelectedAnnotation
  } = usePanel()
  const { annotations: annotationsConfig } = useConfig()

  const { setHoveredAnnotations } = useText()
  const { activeContentUrl, visible } = useTextView()

  const matchedMapRef = useRef<MatchedAnnotationsMap>({})
  const annotationsModeRef = useRef<'aligned' | 'list'>(null)

  const [popoverTarget, setPopoverTarget] = useState<HTMLElement | null>(null)
  const [crossRefAnnotations, setCrossRefAnnotations] = useState<Annotation[]>([])
  const [relatedAnnotations, setRelatedAnnotations] = useState<Annotation[]>([])
  const [popoverWrapper, setPopoverWrapper] = useState<HTMLElement | null>(null)

  const [openPopover, setOpenPopover] = useState(false)

  const selectedAnnotationRef = useRef<Annotation | null>(null)
  const activeTargetRef = useRef<HTMLElement | null>(null)

  // We switch the map when visible state changes to
  useEffect(() => updateMatchedAnnotationsMap(activeContentUrl.current, visible ? matchedMapRef.current : {}), [visible])

  function onMatchedMapUpdate(map: MatchedAnnotationsMap) {
    matchedMapRef.current = map
    updateMatchedAnnotationsMap(activeContentUrl.current, visible ? map : {})
  }

  useEffect(() => {
    annotationsModeRef.current = annotationsMode
  }, [annotationsMode])

  useEffect(() => {
    // when we select another annotation in the popover, we need to use this information when handling a further selection on the target
    selectedAnnotationRef.current = selectedAnnotation
  }, [selectedAnnotation])

  function handleTargetClick(target: Element, annotations: Annotation[], textWrapper: HTMLElement) {
    setPopoverWrapper(textWrapper)

    if (!target || !annotations) return
    const panelEl = document.getElementById(panelId)

    const crossRefContentType = annotationsConfig?.crossRefContentType
    const newCrossRefAnnotations = annotations
      .filter(annotation => {
        if (getAnnotationContentType(annotation) === crossRefContentType) {
          const targetsEl = annotation.target.map(t => panelEl.querySelector((t.selector as CssSelector).value))
          return targetsEl.includes(target)
        }
        return false
      })

    const newRelatedAnnotations: Annotation[] = annotations
      .filter(annotation => {
        if (getAnnotationContentType(annotation) === crossRefContentType) return false

        return annotation.target.some(t => {
          const targetEls = Array.from(panelEl.querySelectorAll((t.selector as CssSelector).value))
          return targetEls.some(el => el === target || el.contains(target))
        })
      })

    const tooltipTypes = annotationsConfig?.tooltipTypes ?? []

    const normalAnnotations = tooltipTypes.length === 0
      ? newRelatedAnnotations
      : newRelatedAnnotations.filter(a => !tooltipTypes.includes(getAnnotationContentType(a)))

    const openTooltip = !(normalAnnotations.length === 1 && newRelatedAnnotations.length === 1 && newCrossRefAnnotations.length === 0)

    if (openTooltip) {
      setOpenPopover(true)
      setPopoverTarget(target as HTMLElement)
      setRelatedAnnotations(newRelatedAnnotations)
      setCrossRefAnnotations(newCrossRefAnnotations)
      if (target !== activeTargetRef.current)  addActiveTargetStyle(target)
    }

    // when we have only one normal annotation then we should select the annotation in Sidebar and not open tooltip. (select + deselect annotation)
    if (!openTooltip) {
      if (normalAnnotations[0].id === selectedAnnotationRef.current?.id) {
        setSelectedAnnotation(null)
        selectedAnnotationRef.current = null
      }
      else {
        setSelectedAnnotation(normalAnnotations[0])
        selectedAnnotationRef.current = normalAnnotations[0]
        if (!panelState.showSidebar) {
          updatePanel({ showSidebar: true })
        }
      }
    }

    activeTargetRef.current = target as HTMLElement
  }

  function handleClose() {
    activeTargetRef.current = null
    removeActiveTargetStyle(popoverTarget)
    setPopoverTarget(null)
    setHoveredAnnotations([])
  }

  return <div className="relative flex">
    <GenericTextRenderer
      htmlString={htmlString}
      onReady={onReady}
      source={activeContentUrl.current}
      onUpdateMatchedAnnotationsMap={onMatchedMapUpdate}
      paddingTop={showContentTypeToggle}
      onTargetClick={handleTargetClick}
    />
    <AnnotationPopoverContainer
      target={popoverTarget}
      wrapper={popoverWrapper}
      open={openPopover}
      onClose={handleClose}>
      <AnnotationPopoverContent
        target={popoverTarget}
        crossRefAnnotations={crossRefAnnotations}
        relatedAnnotations={relatedAnnotations}
        onClose={handleClose}
      />
    </AnnotationPopoverContainer>
  </div>
})

export default TextRenderer
