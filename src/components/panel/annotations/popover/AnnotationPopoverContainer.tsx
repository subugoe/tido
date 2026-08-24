import React, { FC, memo } from 'react'
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover.tsx'
import { X } from 'lucide-react'

interface Props {
  target: HTMLElement | null
  wrapper: HTMLElement
  children?: React.ReactNode
  open: boolean
  onClose: () => void
}

const AnnotationPopoverContainer: FC<Props> = memo(({
  target,
  wrapper,
  children,
  open,
  onClose
}) => {

  const wrapperRect = wrapper?.getBoundingClientRect()
  const targetRect = target?.getBoundingClientRect()

  if (!target || !wrapper) return null

  return (
    <Popover open={open} onOpenChange={() => onClose()}>
      <PopoverAnchor asChild>
        <div
          className="absolute pointer-events-none"
          style={{
            left: targetRect.left - wrapperRect.left,
            top: targetRect.top - wrapperRect.top,
            width: targetRect.width,
            height: targetRect.height,
          }}
        />
      </PopoverAnchor>
      <PopoverContent
        align="center"
        sideOffset={4}
        collisionPadding={8}
        onOpenAutoFocus={(e) => e.preventDefault()}
        hideWhenDetached={true}
        className="relative flex max-h-(--radix-popover-content-available-height) max-w-(--radix-popover-content-available-width) flex-col overflow-hidden p-0"
      >
        <div
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground hover:cursor-pointer"
          aria-label="Close"
        >
          <X size={16} />
        </div>
        <div
          data-cy="annotation-popover-scroll-area"
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 break-words"
        >
          {children}
        </div>
      </PopoverContent>
    </Popover>
  )
})

export default AnnotationPopoverContainer
