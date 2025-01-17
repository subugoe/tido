import { FC, useEffect, useState } from 'react'
import { useConfig } from '@/contexts/ConfigContext'


import { createTree } from '@/utils/tree' 

const Tree: FC  = () => {
    
    const { config } = useConfig()

    const [treeNodes, setTreeNodes] = useState([])
    const [loadingTree, setLoadingTreee] = useState(true)

    useEffect(() => {
        async function initTree(panels) {
            const nodes = await createTree(config.panels)
            
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
