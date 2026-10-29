import { FC, RefObject, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { GripVertical } from 'lucide-react'

interface Props {
  containerRef: RefObject<HTMLElement>
}

const PaneResizeHandle: FC = () => (
  <div
    className="pointer-events-none absolute top-1/2 left-1/2 flex h-6 w-3 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-muted-foreground/60 transition-colors duration-100 [.sash:hover_&]:border-primary [.sash:hover_&]:text-primary [.sash-active_&]:border-primary [.sash-active_&]:text-primary [.sash-disabled_&]:hidden"
    data-pane-resize-handle
  >
    <GripVertical  />
  </div>
)

// Allotment creates its sashes imperatively and offers no way to render content into them,
// so a handle is portaled into every vertical sash it currently has.
const PaneResizeHandles: FC<Props> = ({ containerRef }) => {
  const [sashes, setSashes] = useState<HTMLElement[]>([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const update = () => {
      const next = Array.from(container.querySelectorAll<HTMLElement>('.sash-container > .sash-vertical'))
      setSashes(prev => prev.length === next.length && prev.every((el, i) => el === next[i]) ? prev : next)
    }

    update()

    // Sashes are added/removed whenever panes are shown or hidden
    const observer = new MutationObserver((mutations) => {
      if (mutations.some(m => (m.target as HTMLElement).classList?.contains('sash-container'))) update()
    })
    observer.observe(container, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [containerRef])

  return <>{sashes.map((sash, i) => createPortal(<PaneResizeHandle />, sash, `pane-resize-handle-${i}`))}</>
}

export default PaneResizeHandles
