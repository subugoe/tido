import { FC, ReactNode } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface Position {
    x: number,
    y: number
}

interface LocalTreeProps {
    TriggerButton?: ReactNode,
    Content?: any,
    position?: Position
}

const TreeSelectionModal: FC<LocalTreeProps> = ({ TriggerButton, Content, position }) => {

  console.log('content', Content)

  return <div className="local-tree-modal">
    <Popover>
      <PopoverTrigger style={{
        left: `${position?.x}px`,
        top: `${position?.y}px`,
      }}>
        {TriggerButton}
      </PopoverTrigger>
      <PopoverContent>
      </PopoverContent>
    </Popover>
  </div>
}

export default TreeSelectionModal
