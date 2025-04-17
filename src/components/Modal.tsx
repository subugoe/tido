import { FC, ReactNode, useEffect, useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from '@/components/ui/popover'

interface ModalProps {
  children: ReactNode,
  TriggerButton?: ReactNode,
  showPopover?: boolean,
  onOpenChange?: (isOpen: boolean) => void
}

const Modal: FC<ModalProps> = ({
  children, TriggerButton, showPopover = false, onOpenChange
}) => {

  const [isOpen, setIsOpen] = useState(false)

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (onOpenChange) onOpenChange(open)
  }

  useEffect(() => {
    setIsOpen(showPopover)
  }, [showPopover])

  return <Popover open={isOpen} onOpenChange={handleOpenChange} modal={true}>
    { TriggerButton ? (<PopoverTrigger asChild>{TriggerButton}</PopoverTrigger>) : <PopoverAnchor /> }
    <PopoverContent side="bottom" align="start"  sideOffset={8}>
      {children}
    </PopoverContent>
  </Popover>
}

export default Modal
