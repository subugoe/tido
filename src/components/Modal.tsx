import { FC, ReactNode, useEffect, useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from '@/components/ui/popover'
import { X } from 'lucide-react'

interface ModalProps {
  width?: number,
  children: ReactNode,
  TriggerButton?: ReactNode,
  showPopover?: boolean,
  onOpenChange?: (isOpen: boolean) => void
}

const Modal: FC<ModalProps> = ({
  children, TriggerButton, showPopover = false, onOpenChange, width
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
    <PopoverContent side="bottom" align="start"  sideOffset={8} className={`t-w-[${width ?? 200}px] t-pr-0`} >
      {children}
      <X className="t-absolute t-right-3 t-top-4 t-text-zinc-600 hover:t-text-zinc-700 hover:t-cursor-pointer"  size={15} onClick={() => setIsOpen(false)} />
    </PopoverContent>
  </Popover>
}

export default Modal
