import { FC, useEffect, useState } from 'react'
import { configStore } from '@/store/ConfigStore.tsx'


import { createTree } from '@/utils/tree' 
import CollectionSubtree from '@/components/tree/CollectionSubtree'

const Tree: FC  = () => {
    
    const config = configStore(state => state.config)

    const [treeNodes, setTreeNodes] = useState([])

    const [loadingTree, setLoadingTreee] = useState(true)

    useEffect(() => {
        async function initTree(panels?: PanelConfig[]) {
          if (!panels) return  
          const nodes = await createTree(panels)
            
            setTreeNodes(nodes)
            setLoadingTreee(false)
        }
        initTree(config.panels)
    
    }, [])

    if (loadingTree) return <></>

    const tree =
    treeNodes.length > 0 &&
    treeNodes.map((collection, i) => (
      <div
        key={i}
        className=""
      >
        <CollectionSubtree collectionData = {collection} />
      </div>
    ));



    return <div className="tree t-h-96 t-overflow-hidden t-overflow-y-auto"> 
                {tree}
           </div>
}

export default Tree
