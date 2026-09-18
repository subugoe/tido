import { ReactNode, useEffect, useRef, useState } from 'react'
import AnnotationPopoverContainer from '@/components/panel/annotations/popover/AnnotationPopoverContainer.tsx'
import AnnotationPopoverContent from '@/components/panel/annotations/popover/AnnotationPopoverContent.tsx'
import SynopsisContainer from '@/components/panel/annotations/popover/items/Synopsis/SynopsisContainer.tsx'
import { useSynopsis } from '@/components/panel/synopsis/useSynopsis.ts'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useSetHoveredAnnotations } from '@/contexts/TextContext.tsx'
import { EMPTY_SYNOPSIS_CONNECTION, SynopsisConnection } from '@/store/SynopsisStore.tsx'
import { getSelectorValue } from '@/utils/annotations.ts'
import {
  addActiveTargetStyle,
  addSynopsisSelectedStyle,
  removeActiveTargetStyle,
  removeSynopsisSelectedStyle
} from '@/utils/text.ts'

interface Props {
  source: string
  // the renderer's text wrapper - the popover is positioned relative to it
  wrapper: HTMLElement
  // called when an annotation is selected from the popover's base item
  onBaseItemSelection?: () => void
}

// What the renderer still has to act on after a click: with the popover closed a single annotation
// is selected in the sidebar instead, which is the renderer's own (selection) state.
export interface TargetClickResult {
  openTooltip: boolean
  normalAnnotations: Annotation[]
}

export interface AnnotationPopover {
  popover: ReactNode
  onTargetClick: (targetEl: HTMLElement, source: string, annotations: Annotation[]) => TargetClickResult
}

// The annotation popover of a text renderer: the content it shows for a clicked target
function useAnnotationPopover({ source, wrapper, onBaseItemSelection }: Props): AnnotationPopover {
  const { annotations: annotationsConfig } = useConfig()
  const { activeAnnotationTypes } = usePanel()
  const setHoveredAnnotations = useSetHoveredAnnotations()
  const { getOtherSyncedTargets, handleSynopsisSelection } = useSynopsis()

  const [open, setOpen] = useState(false)
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const [crossRefAnnotations, setCrossRefAnnotations] = useState<Annotation[]>([])
  const [relatedAnnotations, setRelatedAnnotations] = useState<Annotation[]>([])
  const [tooltipAnnotations, setTooltipAnnotations] = useState<Annotation[]>([])
  // the connection the popover offers for selection - not yet the selected one
  const [syncTargets, setSyncTargets] = useState<SynopsisConnection>(EMPTY_SYNOPSIS_CONNECTION)

  // onTargetClick is handed to listeners that are attached to the targets once, so the types it
  // filters with are kept in a ref - state would be the one from the render that attached them.
  const activeAnnotationTypesRef = useRef<AnnotationTypesDict | null>(null)
  useEffect(() => {
    activeAnnotationTypesRef.current = activeAnnotationTypes
  }, [activeAnnotationTypes])

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

  // Sort the annotations of a clicked target into the areas the popover shows - cross references,
  // tooltip items and the ones offered for the sidebar - and resolve the target's synced targets.
  // `annotations` are the annotations of the clicked target and of its parent targets.
  function onTargetClick(targetEl: HTMLElement, source: string, annotations: Annotation[]): TargetClickResult {
    const crossRefContentType = annotationsConfig?.crossRefContentType
    const tooltipTypes = annotationsConfig?.tooltipTypes ?? []
    // With disableSynopsisSelection a sync target still goes through the regular click handling -
    // only its synopsis behavior (connection, action area) is skipped.
    const synopsisSelectionDisabled = !!annotationsConfig?.disableSynopsisSelection

    const newCrossRefAnnotations = annotations.filter((annotation) =>
      annotation.body.annotationType === crossRefContentType &&
      annotation.target.some((target) => {
        const selector = getSelectorValue(target)
        return selector && targetEl.matches(selector)
      })
    )

    const newRelatedAnnotations = annotations.filter((annotation) =>
      annotation.body.annotationType !== crossRefContentType &&
      isFilteredAnnotation(annotation, activeAnnotationTypesRef.current)
    )

    const newTooltipAnnotations = newRelatedAnnotations.filter((a) => tooltipTypes.includes(a.body.annotationType))
    const normalAnnotations = newRelatedAnnotations.filter((a) => !tooltipTypes.includes(a.body.annotationType))

    // the targets the clicked one is synced with, from the sync annotations in the SynopsisStore
    const otherSyncedTargets = synopsisSelectionDisabled ? [] : getOtherSyncedTargets(targetEl, source)

    const openTooltip = newTooltipAnnotations.length > 0 || newCrossRefAnnotations.length > 0 || normalAnnotations.length > 1
      || (!synopsisSelectionDisabled && (otherSyncedTargets.length > 1 || otherSyncedTargets.length === 1 && normalAnnotations.length === 1))

    if (openTooltip) {
      setOpen(true)
      setTargetElement(targetEl)
      setRelatedAnnotations(normalAnnotations)
      setTooltipAnnotations(newTooltipAnnotations)
      addActiveTargetStyle(targetEl)
    }

    setCrossRefAnnotations(newCrossRefAnnotations)

    // y-position of the clicked target within its scroll container's visible height (ignoring
    // scroll position), so each synced panel can scroll its own target to the same y-position.
    const scrollContainer = targetEl.closest('[data-text-container]') as HTMLElement | null
    const yPos = scrollContainer
      ? targetEl.getBoundingClientRect().top - scrollContainer.getBoundingClientRect().top
      : 0

    const clickedConnection: SynopsisConnection = {
      navigatedTarget: targetEl,
      otherSyncedTargets,
      yPos
    }
    if (!synopsisSelectionDisabled) setSyncTargets(clickedConnection)

    const areOnlySyncedTargets = !synopsisSelectionDisabled && newTooltipAnnotations.length === 0 &&
      newCrossRefAnnotations.length === 0 && normalAnnotations.length === 0

    // a plain sync target - nothing to show in the popover, so the click selects the connection right away
    if (areOnlySyncedTargets && otherSyncedTargets.length === 1) handleSynopsisSelection(clickedConnection)
    // several witnesses to choose from: the popover offers them, the click only marks the target
    if (areOnlySyncedTargets && otherSyncedTargets.length > 1) addSynopsisSelectedStyle(targetEl)

    return { openTooltip, normalAnnotations }
  }

  function closePopover() {
    setOpen(false)
    setCrossRefAnnotations([])
    setRelatedAnnotations([])
    setSyncTargets(EMPTY_SYNOPSIS_CONNECTION)
    setHoveredAnnotations([])
    removeActiveTargetStyle(targetElement)
    removeSynopsisSelectedStyle(targetElement)
    setTargetElement(null)
  }

  // Close the popover when the synopsis is opened. The witness selection selects the new
  // connection, which drops the style left by the one it replaces.
  function onSynopsisItemClick() {
    setOpen(false)
    setCrossRefAnnotations([])
    setRelatedAnnotations([])
  }

  const popover = (
    <AnnotationPopoverContainer
      target={targetElement}
      wrapper={wrapper}
      open={open}
      onClose={closePopover}>
      <AnnotationPopoverContent
        target={targetElement}
        source={source}
        crossRefAnnotations={crossRefAnnotations}
        relatedAnnotations={relatedAnnotations}
        tooltipAnnotations={tooltipAnnotations}
        onBaseItemSelection={onBaseItemSelection}
        onClose={closePopover}
      >
        {!annotationsConfig?.disableSynopsisSelection && syncTargets.otherSyncedTargets.length > 0 &&
          <SynopsisContainer syncTargets={syncTargets} onSelect={onSynopsisItemClick} />}
      </AnnotationPopoverContent>
    </AnnotationPopoverContainer>
  )

  return { popover, onTargetClick }
}

export { useAnnotationPopover }
