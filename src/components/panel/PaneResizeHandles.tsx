import { FC, RefObject, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import ResizeHandle from '@/components/panel/ResizeHandle.tsx'

interface Props {
  containerRef: RefObject<HTMLElement>
}

// The handle sits in the middle of its sash. It lets the pointer through, so dragging it drags the sash,
// and follows the sash's hover and drag states. A disabled sash - its panes cannot be resized - has none.
const SASH_HANDLE_CLASSES = 'left-1/2 -translate-x-1/2 pointer-events-none transition-colors duration-100 '
  + '[.sash:hover_&]:border-primary [.sash-hover_&]:border-primary [.sash-active_&]:border-primary [.sash-disabled_&]:hidden'

function getSashes(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>('.sash-container > .sash-vertical'))
}

// Allotment creates the sashes between the panes itself and offers no way to render content into
// them, so a handle is portaled into every vertical sash - it then moves with the sash while dragging.
const PaneResizeHandles: FC<Props> = ({ containerRef }) => {
  const [sashes, setSashes] = useState<HTMLElement[]>([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const update = () => {
      const next = getSashes(container)
      setSashes(prev => prev.length === next.length && prev.every((el, i) => el === next[i]) ? prev : next)
    }

    update()

    // the sashes are added and removed when panes are shown or hidden
    const observer = new MutationObserver((mutations) => {
      if (mutations.some(m => (m.target as HTMLElement).classList?.contains('sash-container'))) update()
    })
    observer.observe(container, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [containerRef])

  return <>
    {sashes.map((sash, i) => createPortal(
      <ResizeHandle className={SASH_HANDLE_CLASSES} data-pane-resize-handle />,
      sash,
      `pane-resize-handle-${i}`
    ))}
  </>
}

export default PaneResizeHandles
