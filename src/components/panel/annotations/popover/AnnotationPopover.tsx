import React, { FC, memo, useEffect, useRef, useState } from 'react'
import AnnotationPopoverContent from '@/components/panel/annotations/popover/AnnotationPopoverContent.tsx'
import AnnotationPopoverContainer from '@/components/panel/annotations/popover/AnnotationPopoverContainer.tsx'
import { addActiveTargetStyle, removeActiveTargetStyle } from '@/utils/text.ts'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { getAnnotationContentType } from '@/utils/annotations.ts'

interface Props {
  target: HTMLElement | null,
  triggerCount?: number,
  annotations: Annotation[]
  wrapper: HTMLElement
  children?: React.ReactNode,
  onSelect: () => void
  onClose: () => void,
}

const AnnotationPopover: FC<Props> = memo(({
  target,
  triggerCount,
  annotations,
  wrapper,
  onSelect,
  onClose
}) => {

  const { panelId, selectedAnnotation, setSelectedAnnotation } = usePanel()
  const { annotations: annotationsConfig } = useConfig()

  const [tooltipTargetElement, setTooltipTargetElement] = useState<HTMLElement | null>(null)
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const [crossRefAnnotations, setCrossRefAnnotations] = useState<Annotation[]>([])
  const [relatedAnnotations, setRelatedAnnotations] = useState<Annotation[]>([])

  const selectedAnnotationRef = useRef<Annotation | null>(null)
  const activeTargetRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!target || !annotations) return
    const panelEl = document.getElementById(panelId)

    let newCrossRefAnnotations: Annotation[] = [...crossRefAnnotations]
    let newRelatedAnnotations: Annotation[] = [...relatedAnnotations]

    if (activeTargetRef.current !== target) {
      const crossRefContentType = annotationsConfig?.crossRefContentType
      newCrossRefAnnotations = annotations
        .filter(annotation => {
          if (getAnnotationContentType(annotation) === crossRefContentType) {
            const targetsEl = annotation.target.map(t => panelEl.querySelector((t.selector as CssSelector).value))
            return targetsEl.includes(target)
          }
          return false
        })

      // compute related annotations: all annotations whose targets equal or contain the clicked target
      newRelatedAnnotations = annotations
        .filter(annotation => {
          if (getAnnotationContentType(annotation) === crossRefContentType) return false

          return annotation.target.some(t => {
            const targetEl = panelEl.querySelector((t.selector as CssSelector).value)
            return targetEl && (targetEl === target || targetEl.contains(target))
          })
        })

      setRelatedAnnotations(newRelatedAnnotations)
      setCrossRefAnnotations(newCrossRefAnnotations)
    }

    const tooltipTypes = annotationsConfig?.tooltipTypes ?? []

    const normalAnnotations = tooltipTypes.length === 0
      ? newRelatedAnnotations
      : newRelatedAnnotations.filter(a => !tooltipTypes.includes(getAnnotationContentType(a)))

    const openTooltip = !(normalAnnotations.length === 1 && newRelatedAnnotations.length === 1 && newCrossRefAnnotations.length === 0)

    if (openTooltip) {
      setTooltipOpen(true)
      setTooltipTargetElement(target as HTMLElement)
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
        if (onSelect) onSelect()
      }
    }

    activeTargetRef.current = target as HTMLElement
  }, [triggerCount])

  useEffect(() => {
    // when we select another annotation in the popover, we need to use this information when handling a further selection on the target
    selectedAnnotationRef.current = selectedAnnotation
  }, [selectedAnnotation])

  function handleClose() {
    setTooltipOpen(false)
    setTooltipTargetElement(null)
    setCrossRefAnnotations([])
    setRelatedAnnotations([])
    removeActiveTargetStyle(activeTargetRef.current)
    activeTargetRef.current = null
    onClose()
  }

  return (
    <AnnotationPopoverContainer
      target={tooltipTargetElement}
      wrapper={wrapper}
      open={tooltipOpen}
      onClose={handleClose}>
      <AnnotationPopoverContent
        target={tooltipTargetElement}
        crossRefAnnotations={crossRefAnnotations}
        relatedAnnotations={relatedAnnotations}
        onClose={handleClose}
      />
    </AnnotationPopoverContainer>
  )
})

export default AnnotationPopover
