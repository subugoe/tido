import { FC, ReactNode, useEffect, useRef } from 'react'
import { usePanel } from '@/contexts/PanelContext.tsx'
import ResizeHandle from '@/components/panel/ResizeHandle.tsx'

interface Props {
  children?: ReactNode
}
const PanelShell: FC<Props> = ({ children }) => {
  const { panelId, initResizer, getScroller, resizer } = usePanel()
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    initResizer(ref.current)
    getScroller()

    // Scroll to this panel
    const scrollPosX = ref.current.offsetLeft - ref.current.offsetWidth / 2
    document.getElementById('panels-wrapper').scrollTo({ left: scrollPosX, behavior: 'smooth' })

    return () => {
      resizer?.clean()
    }
  }, [])

  return <div
    id={panelId}
    ref={ref}
    className={`panel bg-background text-foreground grow-0 shrink-0 relative transition-width`}
    data-cy="panel"
  >
    <div className="h-full overflow-hidden relative border-2 border-border rounded-lg">
      { children }
    </div>
    <ResizeHandle className="-right-1.5" data-panel-resize-handle />
  </div>
}

export default PanelShell
