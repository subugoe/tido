import { FC, useEffect, useState } from 'react'
import { configStore } from '@/store/ConfigStore.tsx'


import { createTree } from '@/utils/tree' 

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
        {collection.title}
      </div>
    ));



    return <div className="tree"> 
                {tree}
           </div>
}

export default Tree
