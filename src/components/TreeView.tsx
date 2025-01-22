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

    console.log('tree', treeNodes)

    

    if (loadingTree) return <></>

    function getCollectionUrl(itemLabel, treeNodes): string | null {

      for (let i = 0; i < treeNodes.length ; i++) {
        const collectionNode = treeNodes[i]
        for (let j = 0; j < collectionNode.children.length; j++) {
          const manifest = collectionNode.children[j]
          if (isItemInManifest(manifest, itemLabel)) {
            console.log('manifest found', manifest)
            return collectionNode.url
          }
        }
        //if (isItemInManifests(collectionNode.children, itemLabel)) return collectionNode.url
      }

      return null
    }

    function isItemInManifests(manifests, itemLabel) {
      for (let i = 0; i < manifests.length ; i++) {
        if (isItemInManifest(manifests[i], itemLabel)) return true
      }

      return false
    }

    function isItemInManifest(manifest, itemLabel) {
      const items = manifest.children
      for (let i = 0; i < items.length ; i++) {
        if (items[i].url === itemLabel) return true
      }

      return false
    }

    const collectionUrl = getCollectionUrl('https://api.ahiqar.sub.uni-goettingen.de/textapi/ahiqar/arabic-karshuni/3r177/16a/latest/item.json', treeNodes) 
    console.log('collection Url', collectionUrl)
    const tree =
    treeNodes.length > 0 &&
    treeNodes.map((collection, i) => (
      <div
        key={i}
        className=""
      >
        <CollectionSubtree collectionData={collection} />
      </div>
    ))



    return <div className="tree t-h-96 t-overflow-hidden t-overflow-y-auto"> 
                {tree}
           </div>
}

export default Tree
