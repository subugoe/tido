import { FC } from 'react'
import { GripVertical } from 'lucide-react'

interface Props {
  className?: string
  'data-sidebar-resize-handle'?: boolean
  'data-panel-resize-handle'?: boolean
}

const ResizeHandle: FC<Props> = ({ className = '', ...props }) => {
  return (
    <div
      {...props}
      className={`z-10 absolute flex h-6 w-3 items-center justify-center rounded-sm border border-border bg-muted -translate-y-1/2 top-1/2 ${className}`}
    >
      <GripVertical className="h-4 w-2.5 text-muted-foreground" />
    </div>
  )
}

export default ResizeHandle
