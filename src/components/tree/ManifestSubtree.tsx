

import { FC } from 'react'
import ItemTree from '@/components/tree/Item'

interface ManifestSubtreeProps {
    manifestData: any
}

const ManifestSubtree: FC<ManifestSubtreeProps>  = ({ manifestData }) => {

    const itemsLabels = manifestData.children.length > 0 
                &&  
                manifestData.children.map((item: Sequence, i) => (
                    <ItemTree label={item.label} key={i}/>
                  ))

    return <div className="manifest-subtree"> 
    
          {manifestData.label}
           <div className="t-ml-[5px] t-flex t-flex-col">
                { itemsLabels}
            </div>         
      </div>
}

export default ManifestSubtree
