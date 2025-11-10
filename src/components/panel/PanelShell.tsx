import { FC, ReactNode, useEffect, useRef } from 'react'
import { GripVertical } from 'lucide-react'
import { usePanel } from '@/contexts/PanelContext.tsx'

interface Props {
  children?: ReactNode
}
const PanelShell: FC<Props> = ({ children }) => {
  const { panelId, initResizer, getSidebarScroller } = usePanel()
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    initResizer(ref.current)
    getSidebarScroller()
  }, [ref])

  return <div
    id={panelId}
    ref={ref}
    className={`panel bg-background text-foreground grow-0 shrink-0 relative @container/panel`}
    data-cy="panel"
  >
    <div className="h-full overflow-hidden relative border-2 border-border rounded-lg">
      { children }
    </div>
    <div data-resize-handle className="z-10 absolute flex h-6 w-3 items-center justify-center rounded-sm border border-border bg-muted -translate-y-1/2 top-1/2 -right-[6px]">
      <GripVertical className="h-4 w-2.5 text-muted-foreground" />
    </div>
  </div>
}

export default PanelShell
