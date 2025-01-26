
import { FC, Fragment, useRef } from 'react'

import { useTree } from '@/contexts/TreeContext'


interface TreeNodeProps {
    node: TreeNode,
}

const TreeNode: FC<TreeNodeProps> = ({ node }) => {

    const { onClick, selectedKey } = useTree()

    const extended = useRef(false)

    function handleClick(e) {
        onClick(node)
        // add class t-bg-primary
    }


    if ('children' in node)
        return <Fragment>
            <div className="hover:t-bg-gray-100 hover:t-cursor-pointer hover:t-round-md t-mb-1 t-py-[2px] t-px-2" onClick={(e) => handleClick(e)}> {node.label}</div>
            {node.children?.map((item: TreeNode, i) => (
                <ul className="t-ml-2" key={i}>
                    <TreeNode node={item} />
                </ul>
            ))}
        </Fragment>

    return <div className="hover:t-bg-gray-100 hover:t-cursor-pointer hover:t-rounded-md t-mb-1 t-py-[2px] t-px-2" onClick={(e) => handleClick(e)}>{node.label}</div>
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