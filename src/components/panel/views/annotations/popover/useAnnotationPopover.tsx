import { ReactNode, useEffect, useRef, useState } from 'react'
import AnnotationPopoverContainer from '@/components/panel/views/annotations/popover/AnnotationPopoverContainer.tsx'
import AnnotationPopoverContent from '@/components/panel/views/annotations/popover/AnnotationPopoverContent.tsx'
import SynopsisContainer from '@/components/panel/views/annotations/popover/items/Synopsis/SynopsisContainer.tsx'
import { useConfig } from '@/contexts/ConfigContext.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'
import { useSetHoveredAnnotations } from '@/contexts/TextContext.tsx'
import { EMPTY_SYNOPSIS_CONNECTION, useSynopsisStore } from '@/store/SynopsisStore.tsx'
import { flattenSyncedTargets, getSelectorValue } from '@/utils/annotations.ts'
import { getOtherSyncedTargets } from '@/utils/synopsis.ts'
import { ANNOTATION_IDS_ATTRIBUTE } from '@/utils/constants.ts'
import {
  addActiveTargetStyle,
  addSynopsisSelectedStyle,
  removeActiveTargetStyle,
  removeSynopsisSelectedStyle
} from '@/utils/text.ts'
import { getAnnotationTargets, getAnnotationType, getTextualBody } from '@/utils/annotation-data.ts'

interface Props {
  source: string
  // the renderer's text wrapper - the popover is positioned relative to it
  wrapper: HTMLElement
  // called when an annotation is selected from the popover's base item
  onBaseItemSelection?: () => void
}

// What the renderer still has to act on after a click: with the popover closed a single annotation
// is selected in the annotations view instead, which is the renderer's own (selection) state.
export interface TargetClickResult {
  openTooltip: boolean
  normalAnnotations: Annotation[]
}

export interface AnnotationPopover {
  popover: ReactNode
  // the clicked target while the popover is open for it - styled as active by the renderer
  activeTarget: HTMLElement | null
  onTargetClick: (targetEl: HTMLElement, source: string, annotations: Annotation[]) => TargetClickResult
}

// The annotation popover of a text renderer: the content it shows for a clicked target
function useAnnotationPopover({ source, wrapper, onBaseItemSelection }: Props): AnnotationPopover {
  const { annotations: annotationsConfig } = useConfig()
  const { activeAnnotationTypes } = usePanel()
  const setHoveredAnnotations = useSetHoveredAnnotations()

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
    const annotationType = getAnnotationType(annotation)
    if (!selectedAnnotationTypes || annotationsConfig.tooltipTypes?.includes(annotationType)) return true

    if (annotationType === 'Variant') {
      return selectedAnnotationTypes?.['Variant']?.some(witness => (getTextualBody(annotation)?.witnesses ?? []).includes(witness))
    } else {
      return Object.keys(selectedAnnotationTypes).includes(annotationType)
    }
  }

  // The sync target a click on the given target offers the synopsis of: the target itself when it is
  // synced, else the closest element around it that is - looked for up to the outermost annotation
  // target containing the click and no further, so a target nested in a sync target (e.g. a cross ref
  // link) offers that one's synced targets, while an element around all of its targets does not.
  function findSyncTarget(targetEl: HTMLElement, source: string): { syncTargetEl: HTMLElement, otherSyncedTargets: SyncedTargetsMap } {
    const textContainer = targetEl.closest('[data-text-container]')

    // the outermost annotation target containing the click - the clicked target itself when it is not
    // nested in one (e.g. a plain sync target)
    let boundary = targetEl
    for (let el = targetEl.parentElement; el && el !== textContainer; el = el.parentElement) {
      if (el.hasAttribute(ANNOTATION_IDS_ATTRIBUTE)) boundary = el
    }

    for (let el: HTMLElement | null = targetEl; el; el = el === boundary ? null : el.parentElement) {
      const otherSyncedTargets = getOtherSyncedTargets(el, source)
      if (Object.keys(otherSyncedTargets).length > 0) return { syncTargetEl: el, otherSyncedTargets }
    }

    return { syncTargetEl: targetEl, otherSyncedTargets: {} }
  }

  // Sort the annotations of a clicked target into the areas the popover shows - cross references,
  // tooltip items and the ones offered for the annotations view - and resolve the target's synced targets.
  // `annotations` are the annotations of the clicked target and of its parent targets.
  function onTargetClick(targetEl: HTMLElement, source: string, annotations: Annotation[]): TargetClickResult {
    const crossRefContentType = annotationsConfig?.crossRefContentType
    const tooltipTypes = annotationsConfig?.tooltipTypes ?? []
    // With disableSynopsisSelection a sync target still goes through the regular click handling -
    // only its synopsis behavior (connection, action area) is skipped.
    const synopsisSelectionDisabled = !!annotationsConfig?.disableSynopsisSelection

    const textContainer = targetEl.closest('[data-text-container]') ?? document
    const newCrossRefAnnotations = annotations.filter((annotation) =>
      getAnnotationType(annotation) === crossRefContentType &&
      getAnnotationTargets(annotation).some((target) => {
        const selector = getSelectorValue(target)
        if (!selector) return false
        // we might click at a target which is inside a cross ref link. we should still be able to retrieve the cross ref
        // annotation in this case
        const crossRefEl = textContainer.querySelector(selector)
        return !!crossRefEl && crossRefEl.contains(targetEl)
      })
    )

    const newRelatedAnnotations = annotations.filter((annotation) =>
      getAnnotationType(annotation) !== crossRefContentType &&
      isFilteredAnnotation(annotation, activeAnnotationTypesRef.current)
    )

    const newTooltipAnnotations = newRelatedAnnotations.filter((a) => tooltipTypes.includes(getAnnotationType(a)))
    const normalAnnotations = newRelatedAnnotations.filter((a) => !tooltipTypes.includes(getAnnotationType(a)))

    // the targets the clicked one is synced with, from the sync annotations in the SynopsisStore. A target
    // nested in a sync target (e.g. a cross ref link inside it) offers the synopsis of that sync target,
    // just as it offers the annotations of its parent targets.
    const { syncTargetEl, otherSyncedTargets } = synopsisSelectionDisabled
      ? { syncTargetEl: targetEl, otherSyncedTargets: {} }
      : findSyncTarget(targetEl, source)

    // how many targets it is synced with, across all of its sync connections
    const syncedTargetsCount = flattenSyncedTargets(otherSyncedTargets).length

    const openTooltip = newTooltipAnnotations.length > 0 || newCrossRefAnnotations.length > 0 || normalAnnotations.length > 1
      || (!synopsisSelectionDisabled && (syncedTargetsCount > 1 || syncedTargetsCount === 1 && normalAnnotations.length === 1))

    if (openTooltip) {
      setOpen(true)
      setTargetElement(targetEl)
      setRelatedAnnotations(normalAnnotations)
      setTooltipAnnotations(newTooltipAnnotations)
      addActiveTargetStyle(targetEl)
    }

    setCrossRefAnnotations(newCrossRefAnnotations)

    // y-position of the sync target within its scroll container's visible height (ignoring
    // scroll position), so each synced panel can scroll its own target to the same y-position.
    const scrollContainer = syncTargetEl.closest('[data-text-container]') as HTMLElement | null
    const yPos = scrollContainer
      ? syncTargetEl.getBoundingClientRect().top - scrollContainer.getBoundingClientRect().top
      : 0

    const clickedConnection: SynopsisConnection = {
      navigatedTarget: syncTargetEl,
      otherSyncedTargets,
      yPos
    }
    if (!synopsisSelectionDisabled) setSyncTargets(clickedConnection)

    const areOnlySyncedTargets = !synopsisSelectionDisabled && newTooltipAnnotations.length === 0 &&
      newCrossRefAnnotations.length === 0 && normalAnnotations.length === 0

    // a plain sync target - nothing to show in the popover, so the click selects the connection right away
    if (areOnlySyncedTargets && syncedTargetsCount === 1) useSynopsisStore.getState().setActiveSynopsisConnection(clickedConnection)
    // several witnesses to choose from: the popover offers them, the click only marks the target
    if (areOnlySyncedTargets && syncedTargetsCount > 1) addSynopsisSelectedStyle(targetEl)

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
        {!annotationsConfig?.disableSynopsisSelection && Object.keys(syncTargets.otherSyncedTargets).length > 0 &&
          <SynopsisContainer syncTargets={syncTargets} onSelect={onSynopsisItemClick} />}
      </AnnotationPopoverContent>
    </AnnotationPopoverContainer>
  )

  return { popover, activeTarget: open ? targetElement : null, onTargetClick }
}

export { useAnnotationPopover }
