import { FC, useEffect, useId, useRef, useState } from 'react'
import { AlignCenter, Check, Image, MessageSquareText, type LucideIcon } from 'lucide-react'

import { usePanel } from '@/contexts/PanelContext.tsx'
import { annotationsShown, hasViewToggles, isAnnotationsView, isContentView, paneDomId, paneNames, panelPanes, switchPanes } from '@/utils/panel-views.ts'
import { PanelViewType } from '@/types'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group.tsx'
import { useAnnotationsCount } from '@/components/panel/views/annotations/useAnnotationsCount.ts'

// the icon of each kind of view - shown in narrow panels instead of the name
const VIEW_ICONS: Record<PanelViewType, LucideIcon> = {
  text: AlignCenter,
  image: Image,
  annotations: MessageSquareText,
}

// How long the status message stays on screen
const STATUS_DURATION = 4000

// A status message for a polite live region: emptied first and set on the next tick, so the same message
// twice in a row is announced again. It disappears after a while - it is shown as an overlay.
function useStatusMessage() {
  const [message, setMessage] = useState('')
  const timers = useRef<number[]>([])

  function clearTimers() {
    timers.current.forEach(timer => window.clearTimeout(timer))
    timers.current = []
  }

  useEffect(() => clearTimers, [])

  function announce(text: string) {
    clearTimers()
    setMessage('')
    timers.current.push(
      window.setTimeout(() => setMessage(text), 50),
      window.setTimeout(() => setMessage(''), 50 + STATUS_DURATION),
    )
  }

  function clear() {
    clearTimers()
    setMessage('')
  }

  return { message, announce, clear }
}

// One toggle per pane of the panel, in the order they are shown side by side - the annotations among
// them, so they are switched like any other view and are one click away. Several views can be on at once.
const ViewToggles: FC = () => {
  const { panelId, panelState, updatePanel, usePanelTranslation } = usePanel()
  const { t } = usePanelTranslation()
  const annotationsCount = useAnnotationsCount()
  const status = useStatusMessage()
  const labelId = useId()

  const panes = panelPanes(panelState.panelViews)

  if (!hasViewToggles(panes)) return null

  const value = panes.filter(pane => pane.visible).map(pane => String(pane.key))

  function onValueChange(keys: string[]) {
    const panelViews = switchPanes(panelState.panelViews, keys)

    // a panel always keeps at least one text or image view open - switching off the last one does nothing
    if (!panelViews) {
      status.announce(t('views_one_stays_visible'))
      return
    }
    status.clear()

    updatePanel({
      panelViews,
      // closing the annotations deselects the annotation in the same update
      ...(!annotationsShown(panelViews) && { selectedAnnotation: null }),
    })
  }

  // two text views both labelled "Text" are named by the content type they show
  const names = paneNames(panes, t)

  // Segments as wide as their name plus the room of the checkmark, which is kept free when a segment is
  // not pressed - so nothing shifts when one is switched. Panels narrower than 1000px show the icon of the
  // view only, else its name: below that the names would push into the breadcrumb next to the toggles.
  return <div className="relative flex items-center gap-2 min-w-0">
    <ToggleGroup
      type="multiple"
      size="sm"
      variant="segmented"
      spacing={1}
      // every segment is reached with Tab - no arrow key navigation
      rovingFocus={false}
      value={value}
      onValueChange={onValueChange}
      aria-labelledby={labelId}
      className="min-w-0"
      data-cy="panel-views"
    >
      {panes.map((pane, i) => {
        const Icon = VIEW_ICONS[pane.view]
        const isAnnotations = isAnnotationsView(pane)
        const label = names[i]
        // the annotations pane is only in the DOM while it is shown
        const controlsPane = isContentView(pane) || pane.visible
        // Without any annotations there is nothing to show in their pane: their toggle stays in place but can
        // not be switched on - while they are shown it stays enabled, so they can be closed
        const disabled = isAnnotations && annotationsCount === 0 && !pane.visible
        return (
          <ToggleGroupItem
            key={pane.key}
            value={String(pane.key)}
            aria-controls={controlsPane ? paneDomId(panelId, pane.key) : undefined}
            disabled={disabled}
            title={label}
            className="group/segment"
            data-cy={isAnnotations ? 'annotations-toggle' : 'panel-view-toggle'}
          >
            {/* the checkmark tells a pressed segment apart without colour - its room is kept when it is hidden.
                Narrow panels show the icon of the view only. */}
            <Check aria-hidden="true" className="hidden @min-[1000px]/panel:block @min-[1000px]/panel:invisible @min-[1000px]/panel:group-aria-pressed/segment:visible" />
            <Icon aria-hidden="true" className="@min-[1000px]/panel:hidden" />
            {/* in narrow panels the label is only for screen readers - it is in the title too */}
            <span className="sr-only @min-[1000px]/panel:not-sr-only @min-[1000px]/panel:min-w-0 @min-[1000px]/panel:truncate">{ label }</span>
          </ToggleGroupItem>
        )
      })}
    </ToggleGroup>
    {/* in the DOM from the start, so the message is announced - shown as a bubble below the toggles */}
    <p
      role="status"
      className="absolute right-0 top-full mt-1 z-30 whitespace-nowrap rounded-md bg-tooltip text-tooltip-foreground text-xs shadow-md px-2 py-1 empty:p-0 empty:shadow-none"
      data-cy="panel-views-status"
    >
      { status.message }
    </p>
  </div>
}

export default ViewToggles
