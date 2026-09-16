import { ReactNode, RefObject, useEffect, useRef, useState } from 'react'
import {
  addActiveTargetStyle,
  addSynopsisSelectedStyle,
  removeActiveTargetStyle,
  removeSynopsisSelectedStyle
} from '@/utils/text.ts'
import { getSelectorValue, getSource, getSyncedTargets } from '@/utils/annotations.ts'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useText } from '@/contexts/TextContext.tsx'
import { EMPTY_SYNOPSIS_CONNECTION, SynopsisConnection, useSynopsisStore } from '@/store/SynopsisStore.tsx'
import AnnotationPopoverContainer from '@/components/panel/annotations/popover/AnnotationPopoverContainer.tsx'
import AnnotationPopoverContent from '@/components/panel/annotations/popover/AnnotationPopoverContent.tsx'
import SynopsisContainer from '@/components/panel/annotations/popover/items/Synopsis/SynopsisContainer.tsx'
import { SelectedAnnotation } from '@/types'

interface Options {
  // The text wrapper the popover is anchored in. It is also the root the cross reference selectors
  // are resolved against, since the rendered text lives inside it.
  wrapperRef: RefObject<HTMLDivElement>
  // The renderer's targets merged with their annotations. Read through a ref because the click
  // listeners are attached once per map and would otherwise see the state of that moment.
  flippedMatchedMapRef: RefObject<MergedAnnotationEntry[]>
  // Each sync target of the text mapped to the sync annotations touching it (same ref reasoning).
  targetsSyncMapRef: RefObject<Map<HTMLElement, Annotation[]>>
  // The annotation types the user currently has selected (same ref reasoning).
  activeAnnotationTypesRef: RefObject<AnnotationTypesDict | null>
  // Called when an annotation is selected - directly on click or from the popover's base item.
  onSelect?: () => void
}

interface AnnotationPopoverLogic {
  // The popover element, rendered by the renderer inside its text wrapper.
  annotationPopover: ReactNode
  // Handles a click on an annotation or sync target: decides what the click selects, what the
  // popover shows and whether it opens at all.
  onTargetClick: (targetEl: HTMLElement, source: string, annotations: Annotation[]) => void
}

// Whether an annotation passes the current type selection: a variant annotation is kept when one of
// its witnesses is selected, any other one when its type is selected. Tooltip types are never filtered.
function isFilteredAnnotation(
  annotation: Annotation,
  selectedAnnotationTypes: AnnotationTypesDict | null,
  tooltipTypes: string[]
) {
  const annotationType = annotation.body.annotationType
  if (!selectedAnnotationTypes || tooltipTypes.includes(annotationType)) return true

  if (annotationType === 'Variant') {
    return selectedAnnotationTypes?.['Variant']?.some(witness => annotation.body.witnesses.includes(witness))
  } else {
    return Object.keys(selectedAnnotationTypes).includes(annotationType)
  }
}

// The annotation popover of a text renderer: its state, the click handling that fills it and the
// element itself, kept out of the renderer. The renderer only forwards a target click and places
// the returned element.
function useAnnotationPopover({
  wrapperRef,
  flippedMatchedMapRef,
  targetsSyncMapRef,
  activeAnnotationTypesRef,
  onSelect
}: Options): AnnotationPopoverLogic {
  const { annotations: annotationsConfig } = useConfig()
  const { setHoveredAnnotations } = useText()
  const { selectedAnnotation, setSelectedAnnotation, getScroller } = usePanel()

  const [popoverTargetElement, setPopoverTargetElement] = useState<HTMLElement | null>(null)
  const [popoverOpen, setPopoverOpen] = useState(false)
  // the source of the text the popover was opened from
  const [popoverSource, setPopoverSource] = useState('')
  const [crossRefAnnotations, setCrossRefAnnotations] = useState<Annotation[]>([])
  const [relatedAnnotations, setRelatedAnnotations] = useState<Annotation[]>([])
  const [tooltipAnnotations, setTooltipAnnotations] = useState<Annotation[]>([])
  // the connection the popover offers for selection - not yet the active one
  const [syncTargets, setSyncTargets] = useState<SynopsisConnection>(EMPTY_SYNOPSIS_CONNECTION)

  // the click listeners are attached once, so the selected annotation is read through a ref
  const selectedAnnotationRef = useRef<SelectedAnnotation | null>(null)
  useEffect(() => {
    selectedAnnotationRef.current = selectedAnnotation
  }, [selectedAnnotation])

  // The cross reference annotations of this source that target the clicked element.
  const getCrossRefAnnotations = (targetEl: HTMLElement, source: string, annotations: Annotation[]) => {
    const root = wrapperRef.current
    if (!root) return []

    return (annotations ?? [])
      .filter(a => {
        const isInSource = a.target && getSource(a.target[0]).id === source
        const isCrossRef = a.body.annotationType === annotationsConfig?.crossRefContentType
        return isInSource && isCrossRef
      })
      .filter(a => {
        const selector = getSelectorValue(a.target[0])
        if (!selector) return false
        return Array.from(root.querySelectorAll(selector)).includes(targetEl)
      })
  }

  // All annotations of the clicked target and of its parent targets, without the cross reference
  // ones (they get their own popover area) and without the ones the type selection filters out.
  const getRelatedAnnotations = (targetEl: HTMLElement) => {
    const seen = new Set<string>()
    const tooltipTypes = annotationsConfig?.tooltipTypes ?? []

    return (flippedMatchedMapRef.current ?? [])
      .filter(entry => entry.target === targetEl || entry.target.contains(targetEl))
      .flatMap(entry => entry.annotations)
      .filter(a => !seen.has(a.id) && seen.add(a.id)
        && a.body.annotationType !== annotationsConfig?.crossRefContentType
        && isFilteredAnnotation(a, activeAnnotationTypesRef.current, tooltipTypes))
  }

  const onTargetClick = (targetEl: HTMLElement, source: string, annotations: Annotation[]) => {
    getScroller().setOriginSelection('text')

    // Resolve the targets the clicked element is synced with on demand, using the clicked target's
    // sync annotations recorded in targetsSyncMapRef.
    // With disableSynopsisSelection a sync target still goes through the regular click handling -
    // only its synopsis behavior (connection, action area) is skipped below.
    const synopsisSelectionDisabled = !!annotationsConfig?.disableSynopsisSelection
    const targetSyncAnnotations = targetsSyncMapRef.current?.get(targetEl) ?? []
    const newSyncTargets = getSyncedTargets(targetEl, source, targetSyncAnnotations)

    // TODO: Fix bug: Click at a new target should check if there are syncedTargets -> if yes -> should make them null or so

    // y-position of the clicked target within its scroll container's visible height
    // (ignoring scroll position), so each synced panel can scroll its own synced target
    // to the same y-position and align it with this one.
    const clickedScrollContainer = targetEl.closest('[data-text-container]') as HTMLElement | null
    const clickedYPos = clickedScrollContainer
      ? targetEl.getBoundingClientRect().top - clickedScrollContainer.getBoundingClientRect().top
      : 0

    const newCrossRefAnnotations = getCrossRefAnnotations(targetEl, source, annotations)
    const newRelatedAnnotations = getRelatedAnnotations(targetEl)

    const tooltipTypes = annotationsConfig?.tooltipTypes ?? []

    let normalAnnotations = []
    const newTooltipAnnotations = [] as Annotation[]

    if (tooltipTypes.length === 0) {
      normalAnnotations = newRelatedAnnotations
    } else {
      normalAnnotations = (newRelatedAnnotations.filter(a => {
        const isTooltipAnnotation = tooltipTypes.includes(a.body.annotationType)
        if (!isTooltipAnnotation) return true
        newTooltipAnnotations.push(a)
        return false
      })) ?? []
    }

    // Sync-target-based clauses only apply when the synopsis is enabled - with it disabled the
    // popover's synopsis area is hidden, so witness counts alone must not open (an empty) popover.
    const openPopover = newTooltipAnnotations.length > 0 || newCrossRefAnnotations.length > 0 || normalAnnotations.length > 1
      || (!synopsisSelectionDisabled && (newSyncTargets.length > 1 || newSyncTargets.length === 1 && normalAnnotations.length === 1))

    if (openPopover) {
      setPopoverOpen(true)
      setPopoverTargetElement(targetEl)
      setPopoverSource(source)
      setRelatedAnnotations(normalAnnotations)
      setTooltipAnnotations(newTooltipAnnotations)
      addActiveTargetStyle(targetEl)
      // pass the synced targets of this entry (and the clicked target's y-position) to the popover content
    }

    const areOnlySyncedTargets = !synopsisSelectionDisabled && newTooltipAnnotations.length === 0
      && newCrossRefAnnotations.length === 0 && normalAnnotations.length === 0
    const clickedConnection: SynopsisConnection = {
      navigatedTarget: targetEl,
      otherSyncedTargets: newSyncTargets,
      yPos: clickedYPos
    }
    if (!synopsisSelectionDisabled) setSyncTargets(clickedConnection)

    // a plain sync target - nothing to show in the popover, so the click establishes the connection
    // right away (the renderer's effect styles and aligns it)
    if (areOnlySyncedTargets && newSyncTargets.length === 1) {
      useSynopsisStore.getState().setActiveSynopsisConnection(clickedConnection)
    }
    if (areOnlySyncedTargets && newSyncTargets.length > 1) {
      addSynopsisSelectedStyle(targetEl)
    }

    setCrossRefAnnotations(newCrossRefAnnotations)

    // when we have only one normal annotation then we should select the annotation in Sidebar and not open the popover. (select + deselect annotation)
    if (!openPopover && normalAnnotations.length === 1) {
      // we need selectedAnnotationRef since the click listener has not an updated value of selectedAnnotation, it has the 'null' when it was initially created
      if (normalAnnotations[0].id === selectedAnnotationRef.current?.annotation.id) {
        setSelectedAnnotation(null)
        selectedAnnotationRef.current = null
      } else {
        const newSelectedAnnotation = {
          annotation: normalAnnotations[0],
          origin: 'text',
          contentUrl: source
        } as SelectedAnnotation

        setSelectedAnnotation(newSelectedAnnotation)
        selectedAnnotationRef.current = newSelectedAnnotation
        if (onSelect) onSelect()
      }
    }
  }

  const closePopover = () => {
    setPopoverOpen(false)
    setPopoverTargetElement(null)
    setCrossRefAnnotations([])
    setRelatedAnnotations([])
    setSyncTargets(EMPTY_SYNOPSIS_CONNECTION)
    setHoveredAnnotations([])
    removeActiveTargetStyle(popoverTargetElement)
    removeSynopsisSelectedStyle(popoverTargetElement)
  }

  // Close the popover when the synopsis is opened. The witness selection publishes the new active
  // connection, whose effect takes care of dropping the style left by the one it replaces.
  const onSynopsisItemClick = () => {
    setPopoverOpen(false)
    setCrossRefAnnotations([])
    setRelatedAnnotations([])
  }

  const annotationPopover = (
    <AnnotationPopoverContainer
      target={popoverTargetElement}
      wrapper={wrapperRef.current}
      open={popoverOpen}
      onClose={closePopover}>
      <AnnotationPopoverContent
        target={popoverTargetElement}
        source={popoverSource}
        crossRefAnnotations={crossRefAnnotations}
        relatedAnnotations={relatedAnnotations}
        tooltipAnnotations={tooltipAnnotations}
        onBaseItemSelection={onSelect}
        onClose={closePopover}
      >
        {!annotationsConfig?.disableSynopsisSelection && syncTargets.otherSyncedTargets.length > 0 &&
          <SynopsisContainer syncTargets={syncTargets} onSelect={onSynopsisItemClick} />}
      </AnnotationPopoverContent>
    </AnnotationPopoverContainer>
  )

  return { annotationPopover, onTargetClick }
}

export { useAnnotationPopover }
