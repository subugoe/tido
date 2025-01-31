import { FC, ReactNode } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import ContentModal from '@/components/tree-modal/ContentModal'

interface LocalTreeProps {
  TriggerButton: ReactNode
}

const LocalTreeModal: FC<LocalTreeProps> = ({ TriggerButton }) => {


  return <div className="local-tree-modal">
    <Popover>
      <PopoverTrigger>
        {TriggerButton}
      </PopoverTrigger>
      <PopoverContent>
        <ContentModal/>
      </PopoverContent>
    </Popover>
  </div>
}

export default LocalTreeModal
