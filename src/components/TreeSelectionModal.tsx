import { FC, ReactNode, useEffect, useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import GlobalTreeSelectionModalContent from '@/components/tree-modal/GlobalTreeSelectionModalContent.tsx'

interface Position {
  x: number,
  y: number
}

interface LocalTreeProps {
  TriggerButton?: ReactNode,
  showPopover?: boolean,
  setShowSelectionModal?: (showPopover: boolean) => void,
  Content?: any,
  position?: Position
}

const TreeSelectionModal: FC<LocalTreeProps> = ({
  TriggerButton,
  showPopover,
  setShowSelectionModal,
  Content,
  position
}) => {


  const [isOpen, setIsOpen] = useState(false)

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (setShowSelectionModal) setShowSelectionModal(open)
  }

  useEffect(() => {

    if (showPopover) {
      setIsOpen(true)
    }
  }, [showPopover])


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
        {Content}
      </PopoverContent>
    </Popover>
  </div>
}

export default TreeSelectionModal
