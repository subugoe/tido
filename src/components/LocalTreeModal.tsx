import { FC, ReactNode, useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger, ClosePopover } from '@/components/ui/popover'
import TreeView from '@/components/TreeView'


interface LocalTreeProps {
    TriggerButton: ReactNode
}

const LocalTreeModal: FC <LocalTreeProps> = ({ TriggerButton }) => {
    
    // TODO: add a [loading, setLoading] => which shows the pop over when the tree has been loaded -> TreeView Component updates the loading of its parent

    const [selectClicked, setSelectClicked] = useState(false)

    function handleSelectClick(e) {
        // TODO: check whether input text is provided or an item is clicked
        // add a class hidden to ref div PopoverContent, in order to close the pop up
        console.log('click select button')
    }

    return <div className="local-tree-modal"> 
            <Popover>
                <PopoverTrigger className="open-tree-button t-h-8 t-w-10 t-relative">
                    { TriggerButton }
                </PopoverTrigger>
                <PopoverContent className="t-bg-white t-absolute t-z-10">
                    <div className="t-flex t-flex-col t-pt-4 t-pl-3 t-w-[500px] t-shadow-md t-border-[1px] t-border-solid t-border-gray-300 t-rounded-md">
                        <span className="t-font-bold">Enter a collection/manifest Url</span>
                        <input className="t-border-solid t-border-[1.5px] t-w-[200px] t-h-[30px] t-mb-[10px]" />
                        <span>Or choose:</span>

                        <TreeView />

                        <div className="t-pb-4">
                            <ClosePopover className='t-bg-blue-500 t-text-white t-rounded t-flex t-text-center t-pl-2 t-ml-[80%] t-mt-10 t-items-center t-justify-items-center t-w-16 t-h-10'
                                onClick = {(e) => handleSelectClick(e)}>
                                    Select
                            </ClosePopover>
                        </div>
                       
                    </div>
                </PopoverContent>
            </Popover>
            </div>
}

export default LocalTreeModal