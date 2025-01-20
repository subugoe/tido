

import { FC } from 'react'
import { configStore } from '@/store/ConfigStore.tsx'


interface ManifestSubtreeProps {
    manifestData: any
}

const ManifestSubtree: FC<ManifestSubtreeProps>  = ({manifestData}) => {

    const itemsLabels = manifestData.children.length > 0 
                &&  
                manifestData.children.map((item, i) => (
                    <button
                      key={i}
                      className="t-text-left t-bg-white hover:t-bg-gray-200 t-cursor-pointer"
                    >
                      { item.label }
                    </button>
                  ));

    return <div className="manifest-subtree"> 
    
          {manifestData.label}
           <div className="t-ml-[5px] t-flex t-flex-col">
                { itemsLabels}
            </div>         
      </div>
}

export default ManifestSubtree
