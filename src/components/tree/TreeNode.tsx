

import { dataStore } from '@/store/DataStore'
import { FC, Fragment, useRef } from 'react'

import { clickedManifestIndices } from '@/utils/tree'
import { getNodeIndices } from '@/utils/tree'

interface TreeNodeProps {
    data: any,
    updateClickedItemUrl: (newUrl: string) => void,
    updateClickedItemIndices: (newIndices) => void
}

const TreeNode: FC<TreeNodeProps> = ({ data, updateClickedItemUrl, updateClickedItemIndices }) => {

    const url = data.id
    const nodes = dataStore(state => state.treeNodes)
    const addManifestChildrenNodes = dataStore(state => state.addManifestChildrenNode)
    const removeManifestChildrenNode = dataStore(state => state.removeManifestChildrenNode)

    const extended = useRef(false)

    function handleClick(e) {
        e.preventDefault()

        // we need to distinguish between different treeNodes: 
        // is it a collection or manifest -> then extend its subtree
        // is it an item -> then call updateClickedItemUrl
        // find the position of the clicked manifest in the tree node 
        //const manifestIndices = clickedManifestIndices(url, nodes)

        const indicesClickedNode = getNodeIndices(url, nodes)

        if (!indicesClickedNode) return

        if (indicesClickedNode['nodeType'] === 'collection') handleCollectionClick(e, indicesClickedNode)
        if (indicesClickedNode['nodeType'] === 'manifest') handleManifestClick(e, indicesClickedNode)
        if (indicesClickedNode['nodeType'] === 'item') handleItemClick(e, indicesClickedNode)
        //const { collectionIndex, manifestIndex } = manifestIndices
    }

    function handleCollectionClick(e, indicesClickedNode) {

    }

    function handleManifestClick(e, indicesClickedNode) {

        const { collectionIndex, manifestIndex } = indicesClickedNode

        if (!extended.current) {
            addManifestChildrenNodes(url, collectionIndex, manifestIndex)
            extended.current = true
            return
        }

        removeManifestChildrenNode(collectionIndex, manifestIndex)
        extended.current = false

    }

    function handleItemClick(e, indicesClickedNode) {
        updateClickedItemUrl(url)
        updateClickedItemIndices(indicesClickedNode)
    }


    if (!('children' in data)) return <li className="hover:t-text-blue-600" onClick={(e) => handleClick(e)}>{data.label}</li>

    return <Fragment>
        <span className="hover:t-text-blue-600" onClick={(e) => handleClick(e)}> {data.label}</span>
        {data.children.map((item, i) => (
            <ul className="t-ml-2" key={i}>
                <TreeNode data={item} updateClickedItemUrl={updateClickedItemUrl} updateClickedItemIndices={updateClickedItemIndices} />
            </ul>
        ))}
    </Fragment>
}

export default TreeNode