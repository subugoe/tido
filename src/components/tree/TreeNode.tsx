

import { dataStore } from '@/store/DataStore'
import { FC, Fragment } from 'react'

import { clickedManifestIndices } from '@/utils/tree'

interface TreeNodeProps {
    data: any
}

const TreeNode: FC<TreeNodeProps> = ({ data }) => {

    const url = data.id
    const nodes = dataStore(state => state.treeNodes)
    const addManifestChildrenNodes = dataStore(state => state.addManifestChildrenNode)

    function handleClick(e) {
        e.preventDefault()

        // find the position of the clicked manifest in the tree node 
        const manifestIndices = clickedManifestIndices(url, nodes)
        if (!manifestIndices) return
        const { collectionIndex, manifestIndex } = manifestIndices
        addManifestChildrenNodes(url, collectionIndex, manifestIndex)
    }

    if (!('children' in data)) return <li className="hover:t-text-blue-600" onClick={(e) => handleClick(e)}>{data.label}</li>

    return <Fragment>
        {data.label}
        {data.children.map((item, i) => (
            <ul className="t-ml-2" key={i}>
                <TreeNode data={item} />
            </ul>
        ))}
    </Fragment>
}

export default TreeNode