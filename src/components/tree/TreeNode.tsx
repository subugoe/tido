
import { FC, Fragment, useRef } from 'react'

import { useTree } from '@/contexts/TreeContext'


interface TreeNodeProps {
    node: TreeNode
}

const TreeNode: FC<TreeNodeProps> = ({ node }) => {

    const { onSelect, onExtend } = useTree()

    const extended = useRef(false)

    function handleClick(e) {
        console.log('node clicked', node)
        onSelect(node)
        // add class t-bg-primary
    }


    if ('children' in node)
        return <Fragment>
            <span className="hover:t-text-blue-600" onClick={(e) => handleClick(e)}> {node.label}</span>
            {node.children?.map((item: TreeNode, i) => (
                <ul className="t-ml-2" key={i}>
                    <TreeNode node={item} />
                </ul>
            ))}
        </Fragment>

    return <span className="hover:t-text-blue-600" onClick={(e) => handleClick(e)}>{node.label}</span>
}

export default TreeNode

/*
 function handleClick(e) {
        onSelect(data)

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


*/