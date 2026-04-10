import { FC } from 'react'
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover'

interface Props {
  annotation: Annotation | null
  targetElement: HTMLElement | null
  open: boolean
  onClose: () => void
}

const AnnotationTooltip: FC<Props> = ({ annotation, targetElement, open, onClose }) => {
  if (!annotation || !targetElement) return null

  const content = annotation.body.value

  return (
    <Popover open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <PopoverAnchor asChild>
        <div
          className="absolute pointer-events-none"
          style={{
            left: targetElement.offsetLeft,
            top: targetElement.offsetTop,
            width: targetElement.offsetWidth,
            height: targetElement.offsetHeight,
          }}
        />
      </PopoverAnchor>
      <PopoverContent
        align="center"
        sideOffset={4}
        side="bottom"
        className="max-w-64"
      >
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </PopoverContent>
    </Popover>
  )
}

export default AnnotationTooltip
