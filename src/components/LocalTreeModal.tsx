import { FC, ReactNode } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import ContentModal from '@/components/tree-modal/ContentModal'

interface LocalTreeProps {
  TriggerButton: ReactNode
}

const LocalTreeModal: FC<LocalTreeProps> = ({ TriggerButton }) => {

  // TODO: add a [loading, setLoading] => which shows the pop over when the tree has been loaded -> TreeView Component updates the loading of its parent

  // function of this component: create a new Panel


  return <div className="local-tree-modal">
    <Popover>
      <PopoverTrigger className="open-tree-button t-h-8 t-w-10 t-relative">
        {TriggerButton}
      </PopoverTrigger>
      <PopoverContent className="t-bg-white t-absolute t-z-10">
        <ContentModal/>
      </PopoverContent>
    </Popover>
  </div>
}

export default LocalTreeModal
