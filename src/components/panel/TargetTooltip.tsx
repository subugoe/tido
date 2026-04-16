import { FC } from 'react'
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover'
import CrossRefActionArea from '@/components/panel/CrossRefActionArea.tsx'

interface Props {
  annotation: Annotation | null
  targetElement: HTMLElement | null,
  crossRefInfo: CrossRefInfo,
  open: boolean
  onClose: () => void
}

const TargetTooltip: FC<Props> = ({ annotation, targetElement, crossRefInfo,  open, onClose,  }) => {

  if (!targetElement) return null

  const content = (annotation?.body as AnnotationBody)?.value


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
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div dangerouslySetInnerHTML={{ __html: content }} />
        {crossRefInfo && <CrossRefActionArea crossRefInfo={crossRefInfo} onSelect={onClose} />}
      </PopoverContent>
    </Popover>
  )
}

export default TargetTooltip
