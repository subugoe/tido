
import { FC, useEffect, useRef, useState } from 'react'

import { configStore } from '@/store/ConfigStore'


import TreeView from '@/components/TreeView'
import InputField from '@/components/tree-modal/InputField'
import { ClosePopover } from '@/components/ui/popover'
import { createTree, getNodeIndices } from '@/utils/tree'
import { dataStore } from '@/store/DataStore'



const ContentModal: FC = () => {

    const panels = configStore(state => state.config.panels)
    const initTreeNodes = dataStore(state => state.initTreeNodes)
    const addManifestChildrenNodes = dataStore(state => state.addManifestChildrenNodes)
    const removeManifestChildrenNode = dataStore(state => state.removeManifestChildrenNode)


    const nodes = dataStore(state => state.treeNodes)
    const [loadingTree, setLoadingTree] = useState(true)


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

    useEffect(() => {
        async function initTree(panels?: PanelConfig[]) {
            if (!panels) return
            const nodes = await createTree(panels)
            initTreeNodes(nodes)
            setLoadingTree(false)
        }
        initTree(panels)
    }, [panels])


    function updateInputValue(newValue: string) {
        inputValue.current = newValue
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
            // transfer the clicked item indices
            const indices = { ...clickedItemIndices.current }
            const { collectionIndex, manifestIndex, itemIndex } = indices
            collectionUrl = nodes[collectionIndex].id

            /*
            addNewPanel({
                entrypoint: {
                    url: collectionUrl,
                    type: "collection",
                },
                manifestIndex: manifestIndex,
                itemIndex: itemIndex
            }
            )
            */
        }

        if (inputValue.current !== '') {
            collectionUrl = inputValue.current

            /*
            addNewPanel({
                entrypoint: {
                    url: collectionUrl,
                    type: "collection",
                }
            }
            )
            */
        }

        // lines below serve mainly for showing the error message. Error message appears when a user does not provide input for opening a new a collection/panel

        clickedItemUrl.current = ''
        inputGiven.current = false
        setClickedButton(false)

        return

    }


    function onSelect(node: TreeNode) {
        console.log('on select node', node)
        const { id, type } = node
        if (type === 'manifest' && !('children' in node)) onExpand(node)
        if (type === 'manifest' && 'children' in node) onCollapse(node)
        // handle item url
    }

    async function onExpand(node: TreeNode) {
        const { collectionIndex, manifestIndex } = getNodeIndices(node.id, nodes)
        addManifestChildrenNodes(node.id, collectionIndex, manifestIndex)

    }

    async function onCollapse(node: TreeNode) {
        const { collectionIndex, manifestIndex } = getNodeIndices(node.id, nodes)
        removeManifestChildrenNode(collectionIndex, manifestIndex)
    }

    return <div className="t-flex t-flex-col t-pt-4 t-pl-3 t-w-[500px] t-shadow-md t-border-[1px] t-border-solid t-border-gray-300 t-rounded-md">

        <div className="t-text-red-400" style={{ display: !inputGiven.current && clickedButton && !clickedItemUrl.current ? 'block' : 'none' }}> Please do provide a way to open a new collection</div>
        <span className="t-font-bold">Enter a collection/manifest Url</span>
        <InputField updateInputValue={updateInputValue} />
        <span>Or choose:</span>

        <TreeView nodes={nodes} onSelect={onSelect} onExpand={onExpand} />


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