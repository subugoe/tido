import { FC, ReactNode, useEffect, useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface ModalProps {
    children: ReactNode,
    TriggerButton?: ReactNode,
    showPopover?: boolean,
    position?: Position
}

const Modal: FC<ModalProps> = ({
  children, TriggerButton, showPopover, position
}) => {

  const [isOpen, setIsOpen] = useState(false)

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
  }

  useEffect(() => {
    if (showPopover) setIsOpen(true)
  }, [position])

  return <div className="local-tree-modal">
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {TriggerButton}
      </PopoverTrigger>
      <PopoverContent
        style={{
          top: `${position?.y + 40}px`,
          left: `${position?.x}px`,
        }}>
        {children}
      </PopoverContent>
    </Popover>
  </div>
}

export default Modal
