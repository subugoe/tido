import { FC, memo, useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover'
import TargetTooltipContent from '@/components/panel/TargetTooltipContent.tsx'
import { X } from 'lucide-react'

interface Props {
  targetElement: HTMLElement | null,
  relatedAnnotations: Annotation[],
  crossRefAnnotation: Annotation,
  open: boolean
  onClose: () => void
}

interface Position {
  left: number
  top: number
  width: number
  height: number
}

const TargetTooltipContainer: FC<Props> = memo(({ targetElement, relatedAnnotations, crossRefAnnotation, open, onClose }) => {
  // anchor div reads offsetLeft/Top/Width/Height live on every render. When hover adds/removes classes that affect layout (e.g. a border),
  // those values shift. The fix: snapshot the position in a useEffect that only runs when the element reference changes.

  const [position, setPosition] = useState<Position | null>(null)

  useEffect(() => {
    if (!targetElement) {
      setPosition(null)
      return
    }
    setPosition({
      left: targetElement.offsetLeft,
      top: targetElement.offsetTop,
      width: targetElement.offsetWidth,
      height: targetElement.offsetHeight,
    })
  }, [targetElement])

  if (!targetElement || !position) return null

  return (
    <Popover open={open} onOpenChange={() => onClose()}>
      <PopoverAnchor asChild>
        <div
          className="absolute pointer-events-none"
          style={position}
        />
      </PopoverAnchor>
      <PopoverContent
        align="center"
        sideOffset={4}
        side="bottom"
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-w-92 min-w-40"
      >
        <div
          onClick={onClose}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground hover:cursor-pointer"
          aria-label="Close"
        >
          <X size={16} />
        </div>
        <TargetTooltipContent crossRefAnnotation={crossRefAnnotation} relatedAnnotations={relatedAnnotations} onClose={onClose} />
      </PopoverContent>
    </Popover>
  )
})

export default TargetTooltipContainer
