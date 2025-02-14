import { FC, ReactNode, useEffect, useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface ModalProps {
    children: ReactNode,
    TriggerButton?: ReactNode,
    showPopover?: boolean,
}

const Modal: FC<ModalProps> = ({
  children, TriggerButton, showPopover
}) => {

  const [isOpen, setIsOpen] = useState(false)

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
  }

  useEffect(() => {
    if (showPopover) setIsOpen(true)
  }, [showPopover])

  return <Popover open={isOpen} onOpenChange={handleOpenChange}>
    <PopoverTrigger asChild>
      {TriggerButton}
    </PopoverTrigger>
    <PopoverContent>
      {children}
    </PopoverContent>
  </Popover>
}

export default Modal
