import React, { FC, memo } from 'react'
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover.tsx'
import { usePanel } from '@/contexts/PanelContext.tsx'

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

  const { panelRootRef } = usePanel()
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
        container={panelRootRef.current}
        className="flex max-h-(--radix-popover-content-available-height) max-w-(--radix-popover-content-available-width) flex-col gap-2 overflow-hidden p-4"
      >
        {/* the title row (AnnotationPopoverContent) does not scroll, the content below it does */}
        {children}
      </PopoverContent>
    </Popover>
  )
})

export default AnnotationPopoverContainer
