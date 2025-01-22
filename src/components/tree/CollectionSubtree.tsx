

import { FC } from 'react'
import ManifestSubtree from '@/components/tree/ManifestSubtree'


interface CollectionSubtreeProps {
    collectionData: any
}

const CollectionSubtree: FC<CollectionSubtreeProps>  = ({ collectionData }) => {

    const manifestSubTree = collectionData.children.length > 0 
                &&  
                collectionData.children.map((manifest, i) => (
                    <ManifestSubtree key={i} manifestData={manifest} />
                  ))

    return <div className="collection-subtree"> 
    
          {collectionData.title}
           <div className="t-ml-[5px]">
                { manifestSubTree}
            </div>         
      </div>
}

export default CollectionSubtree