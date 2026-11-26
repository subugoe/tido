import React, { cloneElement, FC, ReactElement, useEffect, useRef, useState } from 'react'

import { usePanel } from '@/contexts/PanelContext.tsx'

import PanelHeader from '@/components/panel/header/PanelHeader.tsx'
import PanelFooter from '@/components/panel/footer/PanelFooter.tsx'
import ImageView from '@/components/panel/views/image/ImageView.tsx'
import { TextProvider } from '@/contexts/TextContext.tsx'
import TextView from '@/components/panel/views/text/TextView.tsx'
import 'allotment/dist/style.css'
import { Allotment, AllotmentHandle } from 'allotment'
import AnnotationsView from '@/components/panel/views/annotations/AnnotationsView.tsx'
import PanelError from '@/components/panel/PanelError.tsx'
import PaneResizeHandles from '@/components/panel/PaneResizeHandles.tsx'
import { annotationsShown, isAnnotationsView, isContentView, isVisible, paneDomId, panelPanes, shownViews, visibleTextSources } from '@/utils/panel-views.ts'
import EmptyViews from '@/components/panel/views/EmptyViews.tsx'
import { PanelViewState } from '@/types'
import { ANNOTATIONS_PANE_MAX_SHARE, ANNOTATIONS_PANE_MIN_WIDTH, ANNOTATIONS_PANE_DEFAULT_WIDTH } from '@/utils/constants.ts'

const PanelContent: FC = React.memo(() => {
  const { init, panelId, panelState, error, loading, syncedTargetsMap, setSyncedTargets } = usePanel()
  // the rendered text and image views by view key - kept, so a view keeps its state while panes move
  const [contentPanes, setContentPanes] = useState<Record<number, ReactElement>>({})
  const allotmentRef = useRef<AllotmentHandle>(null)
  const allotmentContainerRef = useRef<HTMLDivElement>(null)
  // The width the user last gave the annotations pane - it is reapplied when allotment.reset() lays
  // the panes out again, so changing the views does not snap the annotations back to their default.
  const annotationsWidth = useRef(ANNOTATIONS_PANE_DEFAULT_WIDTH)

  const showAnnotations = annotationsShown(panelState.panelViews)

  // The panes side by side: the views shown on the current item and the annotations among them. The
  // panel shows an empty state when it shows no text or image view.
  const panes = panelPanes(panelState.panelViews)
  const showsNoView = !loading && !!panelState.item && !panes.some(isContentView)
  // the panes allotment renders: the annotations pane only while it is shown, see below
  const renderedPanes = panes.filter(pane => isContentView(pane) ? !!contentPanes[pane.key] : pane.visible)

  // The annotations pane opens at the width it had last, but never takes more than a share of a
  // narrow panel - the views next to it would be squeezed to nothing otherwise.
  const containerWidth = allotmentContainerRef.current?.clientWidth ?? 0
  function getAnnotationsPreferredSize() {
    if (!containerWidth) return annotationsWidth.current
    const maxWidth = Math.max(ANNOTATIONS_PANE_MIN_WIDTH, containerWidth * ANNOTATIONS_PANE_MAX_SHARE)
    return Math.min(annotationsWidth.current, maxWidth)
  }

  // the preferred sizes are computed before rendering - when we call allotment.reset() -> Allotment uses the updated preferred sizes.
  // The annotations take the width they had last, and the visible text and image views share the room left:
  // each by its share of the width ratios of the visible views, or an equal share without ratios.
  const visibleContentViews = panes.filter(pane => isContentView(pane) && isVisible(pane))
  const hasRatios = visibleContentViews.length > 0 && visibleContentViews.every(v => v.widthRatio > 0)
  const ratioSum = !hasRatios ? 0 : visibleContentViews.reduce((sum, v) => sum + v.widthRatio, 0)

  function getPreferredSize(pane: PanelViewState): string | number {
    if (isAnnotationsView(pane)) return getAnnotationsPreferredSize()

    const share = hasRatios ? pane.widthRatio / ratioSum : visibleContentViews.length > 0 ? 1 / visibleContentViews.length : 1
    const annotationsShare = showAnnotations && containerWidth > 0 ? getAnnotationsPreferredSize() / containerWidth : 0
    return `${share * (1 - annotationsShare) * 100}%`
  }

  useEffect(() => {
    const views = shownViews(panelState.panelViews).filter(isContentView)
    const elements = Object.fromEntries(views.map((v) => {
      const key = `${v.view}-${v.label || 'default'}-${v.key}`
      // the visibility of a text view is given when rendering (see paneContent) - not from here, which is a render late
      return [v.key, v.view === 'image' ? <ImageView key={key} viewKey={v.key} /> : <TextView key={key} viewKey={v.key} visible={isVisible(v)} />]
    }))

    allotmentRef.current?.reset()
    setContentPanes(elements)
  }, [panelState.panelViews])

  // Allotment takes the room for a pane that is added from its neighbour only, so opening the
  // annotations would squeeze the last view alone. Laying the panes out again from their preferred
  // sizes lets all the views shrink by their share - and grow back by it once the pane is closed.
  useEffect(() => {
    allotmentRef.current?.reset()
  }, [showAnnotations])

  // Aggregate the per-source sync targets into a single ordered list, walking the panelViews in
  // order and only including the visible text views. Re-runs when the views change or when a
  // renderer adds/updates its targets in syncedTargetsMap.
  useEffect(() => {
    const aggregated = visibleTextSources(panelState).flatMap(source => syncedTargetsMap[source.contentUrl] ?? [])
    setSyncedTargets(aggregated)
  }, [panelState.panelViews, panelState.item, syncedTargetsMap])

  // The element of a text or image pane. A text view gets its visibility in the same render the pane is shown
  // or hidden in, so its annotations are handed to the panel right away - not one render later, after the
  // effect above has built the elements anew, which would make the annotations change twice.
  function paneContent(pane: PanelViewState): ReactElement {
    const element = contentPanes[pane.key]
    return pane.view === 'text' ? cloneElement(element as ReactElement<{ visible: boolean }>, { visible: isVisible(pane) }) : element
  }

  function onPaneSizesChange(sizes: number[]) {
    const width = sizes[renderedPanes.findIndex(isAnnotationsView)]
    if (showAnnotations && width > 0) annotationsWidth.current = width
  }

  if (error && !loading) return <PanelError error={error} resetErrorBoundary={() =>  init(panelState.config)} />

  return (<TextProvider>
    <div
      className={`h-full flex flex-col relative overflow-hidden`} style={{
        '--sash-hover-size': '2px',
        '--focus-border': 'rgb(var(--tido-color-primary))'
      } as React.CSSProperties}>
      <div className="h-full w-full overflow-hidden relative" data-cy="panel-container">
        <div className="main-content flex flex-col h-full @container/panel">
          <PanelHeader />
          <div className="flex-1 min-h-0" ref={allotmentContainerRef}>
            {showsNoView && <EmptyViews />}
            {!showsNoView && <Allotment ref={allotmentRef} proportionalLayout={true} onChange={onPaneSizesChange}>
              {renderedPanes.map(pane => isContentView(pane)
                ? <Allotment.Pane key={contentPanes[pane.key].key} visible={isVisible(pane)} preferredSize={getPreferredSize(pane)}>
                  {/* the element the view toggles control - hidden with the pane */}
                  <div id={paneDomId(panelId, pane.key)} className="h-full w-full" hidden={!isVisible(pane)}>
                    {paneContent(pane)}
                  </div>
                </Allotment.Pane>
                // Only rendered while shown: a hidden pane with a preferred size throws off the layout of the
                // views next to it.
                : <Allotment.Pane key="annotations" minSize={ANNOTATIONS_PANE_MIN_WIDTH} preferredSize={getPreferredSize(pane)}>
                  <div id={paneDomId(panelId, pane.key)} className="h-full w-full">
                    <AnnotationsView />
                  </div>
                </Allotment.Pane>
              )}
            </Allotment>}
            {!showsNoView && <PaneResizeHandles containerRef={allotmentContainerRef} />}
          </div>
          <PanelFooter />
        </div>
      </div>
    </div>
  </TextProvider>
  )
})

export default PanelContent
