import { FC, RefObject, useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover'
import CrossRefActionArea from '@/components/panel/CrossRefActionArea.tsx'

interface Props {
  annotation: Annotation | null
  targetElement: HTMLElement | null,
  wrapperRef: RefObject<HTMLDivElement>,
  crossRefInfo: CrossRefInfo,
  open: boolean
  onClose: () => void
}

interface AnchorRect { left: number; top: number; width: number; height: number }

const TargetTooltip: FC<Props> = ({ annotation, targetElement, wrapperRef, crossRefInfo,  open, onClose }) => {
  const [anchorRect, setAnchorRect] = useState<AnchorRect | null>(null)

  // 1. Reason why storing the coordinates of target in a state: TargetTooltip reads targetElement.offsetLeft/offsetTop directly in the render function. Every time you hover
  //   another target, setHoveredAnnotations triggers a re-render of GenericTextRenderer (and thus TargetTooltip), which re-reads the
  //   live DOM offsets — at that point hover styles may have shifted the layout, so the values differ from when the click happened. fix: capture the position once when targetElement is set, and use those frozen values for the anchor.
  // 2. the calculations are needed to position the targetTooltip correctly when scrolling or when clicking on target which
  // is located close to lower edge of viewport, i.e to show it above the target

  useEffect(() => {
    if (!targetElement || !wrapperRef.current) return
    const wrapperRect = wrapperRef.current.getBoundingClientRect()
    const targetRect = targetElement.getBoundingClientRect()
    setAnchorRect({
      left: targetRect.left - wrapperRect.left,
      top: targetRect.top - wrapperRect.top,
      width: targetRect.width,
      height: targetRect.height,
    })
  }, [targetElement])

  if (!targetElement || !anchorRect) return null

  const content = (annotation?.body as AnnotationBody)?.value


  return (
    <Popover open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <PopoverAnchor asChild>
        <div
          className="absolute pointer-events-none"
          style={anchorRect}
        />
      </PopoverAnchor>
      <PopoverContent
        align="center"
        sideOffset={4}
        side="bottom"
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-w-80"
      >
        {content && <div dangerouslySetInnerHTML={{ __html: content }} className={crossRefInfo ? 'border-b pb-1 border-muted-foreground mb-1' : ''} />}
        {crossRefInfo && <CrossRefActionArea crossRefInfo={crossRefInfo} onSelect={onClose} />}
      </PopoverContent>
    </Popover>
  )
}

export default TargetTooltip
