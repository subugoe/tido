import { FC, ReactNode } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import TreeSelectionModalContent from '@/components/tree-modal/TreeSelectionModalContent.tsx'

interface LocalTreeProps {
  TriggerButton: ReactNode
}

const TreeSelectionModal: FC<LocalTreeProps> = ({ TriggerButton }) => {


  return <div className="local-tree-modal">
    <Popover>
      <PopoverTrigger>
        {TriggerButton}
      </PopoverTrigger>
      <PopoverContent>
        <TreeSelectionModalContent/>
      </PopoverContent>
    </Popover>
  </div>
}

export default TreeSelectionModal
