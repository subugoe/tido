
import { FC, useRef, useState } from 'react'

import { dataStore } from '@/store/DataStore'
import { configStore } from '@/store/ConfigStore'


import TreeView from '@/components/TreeView'
import InputField from '@/components/tree-modal/InputField'
import { ClosePopover } from '@/components/ui/popover'



const ContentModal: FC = () => {

    const treeNodes = dataStore((state) => state.treeNodes)
    const addNewPanel = configStore((state) => state.addNewPanel)

    const inputGiven = useRef(false)
    const inputValue = useRef('')
    const clickedItemUrl = useRef('')

    const clickedItemIndices = useRef({
        collectionIndex: -1,
        manifestIndex: -1,
        itemIndex: -1,
        nodeType: 'item'
    })


    const [clickedButton, setClickedButton] = useState(false)


    function updateInputValue(newValue: string) {
        inputValue.current = newValue
    }

    function updateClickedItemUrl(newUrl: string) {
        clickedItemUrl.current = newUrl
    }

    function updateClickedItemIndices(newIndices) {
        clickedItemIndices.current = newIndices
    }

    function handleSelectClick(e) {

        let collectionUrl: string | undefined

        if (!clickedItemUrl.current && inputValue.current === '') {
            setClickedButton(true)
            e.preventDefault();
            return
        }

        inputGiven.current = true

        if (clickedItemUrl.current) {
            const indices = { ...clickedItemIndices.current }
            const { collectionIndex, manifestIndex, itemIndex } = indices
            collectionUrl = treeNodes[collectionIndex].id

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

        if (inputValue.current !== '') {
            collectionUrl = inputValue.current

            addNewPanel({
                entrypoint: {
                    url: collectionUrl,
                    type: "collection",
                }
            }
            )
        }

        // lines below serve mainly for showing the error message. Error message appears when a user does not provide input for opening a new a collection/panel

        clickedItemUrl.current = ''
        inputGiven.current = false
        setClickedButton(false)

        return

    }

    return <div className="t-flex t-flex-col t-pt-4 t-pl-3 t-w-[500px] t-shadow-md t-border-[1px] t-border-solid t-border-gray-300 t-rounded-md">

        <div className="t-text-red-400" style={{ display: !inputGiven.current && clickedButton && !clickedItemUrl.current ? 'block' : 'none' }}> Please do provide a way to open a new collection</div>
        <span className="t-font-bold">Enter a collection/manifest Url</span>
        <InputField updateInputValue={updateInputValue} />
        <span>Or choose:</span>

        <TreeView updateClickedItemUrl={updateClickedItemUrl} updateClickedItemIndices={updateClickedItemIndices} />

        <div className="t-pb-4">
            <ClosePopover className='t-bg-blue-500 t-text-white t-rounded t-flex t-text-center t-pl-2 t-ml-[80%] t-mt-10 t-items-center t-justify-items-center t-w-16 t-h-10'
                onClick={(e) => handleSelectClick(e)}>
                Select
            </ClosePopover>
        </div>
    </div>
}

//        

export default ContentModal