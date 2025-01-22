import { FC, ReactNode, useRef, useState } from 'react'

import { dataStore } from '@/store/DataStore.tsx'
import { configStore } from '@/store/ConfigStore'

import { Popover, PopoverContent, PopoverTrigger, ClosePopover } from '@/components/ui/popover'
import TreeView from '@/components/TreeView'

import { getClickedItemIndices } from '@/utils/tree'
import { tree } from '@/utils/icons'




interface LocalTreeProps {
    TriggerButton: ReactNode
}

const LocalTreeModal: FC <LocalTreeProps> = ({ TriggerButton }) => {
    
    // TODO: add a [loading, setLoading] => which shows the pop over when the tree has been loaded -> TreeView Component updates the loading of its parent

    const clickedItemUrl = dataStore((state) => state.clickedItemUrl)
    const treeNodes = dataStore((state) => state.treeNodes)
    const addNewPanel = configStore((state) => state.addNewPanel)

    const inputCollectionRef = useRef(null);

    const [selectClicked, setSelectClicked] = useState(false)

    // check for the state temp variable of newCollection - if we have a new collection there -> if so then we retrieve that value and add a new panel in Configstore

    function handleSelectClick(e) {
        // TODO: check whether a value is provided for newCollectionUrl in the data store
                 // if not, then ask the user to provide a value
                 // if yes, then add the new panel in config store with this new entrypoint AND set the newCollectionUrl as empty value
        
        let manifestIndex: number | undefined, itemIndex: number | undefined, collectionUrl: string | undefined

        if (clickedItemUrl) {
            const data = getClickedItemIndices(clickedItemUrl, treeNodes)
            if (!data) {
                console.error('Indices of clicked item could not be found')
                return 
            }

            collectionUrl = data?.collectionUrl
            manifestIndex = data?.manifestIndex
            itemIndex = data?.itemIndex
            addNewPanel({
                entrypoint: {
                    url: collectionUrl,
                    type: "collection",
                  },
                manifestIndex: manifestIndex,
                itemIndex: itemIndex
            }
            )
        }

        if (inputCollectionRef.current.value !== '') {
            console.log('entering the input collectionRef if statement')
            console.log('inputCollectionRef.current', inputCollectionRef.current)
            collectionUrl =  inputCollectionRef.current?.value
            addNewPanel({
                entrypoint: {
                    url: collectionUrl,
                    type: "collection",
                  }
            }
            )
        }
    }

    return <div className="local-tree-modal"> 
            <Popover>
                <PopoverTrigger className="open-tree-button t-h-8 t-w-10 t-relative">
                    { TriggerButton }
                </PopoverTrigger>
                <PopoverContent className="t-bg-white t-absolute t-z-10">
                    <div className="t-flex t-flex-col t-pt-4 t-pl-3 t-w-[500px] t-shadow-md t-border-[1px] t-border-solid t-border-gray-300 t-rounded-md">
                        <span className="t-font-bold">Enter a collection/manifest Url</span>
                        <input ref={inputCollectionRef}  className="t-border-solid t-border-[1.5px] t-w-[200px] t-h-[30px] t-mb-[10px]" />
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