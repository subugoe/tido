import { FC, ReactNode } from 'react'

import { Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'


interface LocalTreeProps {
    TriggerButton: ReactNode
}

const LocalTreeModal: FC <LocalTreeProps> = ({ TriggerButton }) => {
    

    return <div className="local-tree-modal"> 
            <Popover>
                <PopoverTrigger className="open-tree-button t-h-8 t-w-10 t-relative">
                    { TriggerButton }
                </PopoverTrigger>
                <PopoverContent className="t-bg-white t-absolute t-z-10">
                <div className="t-flex t-flex-col t-pt-4 t-pl-3 t-w-80 t-shadow-md t-border-[1px] t-border-solid t-border-gray-300 t-rounded-md">
                    <span className="t-font-bold">Enter a collection/manifest Url</span>
                    <input className="t-border-solid t-border-[1.5px] t-w-[200px] t-h-[30px] t-mb-[10px]" />
                    <span>Or choose:</span>
                </div>
                </PopoverContent>
            </Popover>
            </div>
    
}

export default LocalTreeModal
