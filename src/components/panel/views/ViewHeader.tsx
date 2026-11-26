import { FC, HTMLAttributes } from 'react'
import { VIEW_HEADER_HEIGHT } from '@/utils/constants.ts'
import { cn } from '@/lib/utils'

// The toolbar of a view - text, image or annotations. All of them are of the same height, so the views
// that scroll in lockstep (the texts and the aligned annotations) start at the same height below them.
const ViewHeader: FC<HTMLAttributes<HTMLDivElement>> = ({ className, style, children, ...props }) => {
  return <div
    className={cn('shrink-0 flex items-center gap-1 px-3 min-w-0 bg-background border-b border-border', className)}
    style={{ height: `${VIEW_HEADER_HEIGHT}px`, ...style }}
    {...props}
  >
    { children }
  </div>
}

export default ViewHeader
