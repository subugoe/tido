import { FC } from 'react'

import { contentStore } from '@/store/ContentStore'
import CustomHTML from '@/components/CustomHTML'
import { plus } from '@/utils/icons'

import LocalTreeModal from '@/components/LocalTreeModal'



const TopBar: FC = () => {
  
  const labels = contentStore((state) => state.activeManifestsLabels)

  const manifestLabels =
    labels.length > 0 &&
    labels.map((label, i) => (
      <div
        key={i}
        className="t-bg-slate-200 t-w-40 t-h-10 t-truncate t-p-2 t-rounded t-mr-[20px]"
        title={label}
      >
        {label}
      </div>
    ));

  const addButton =  
          <span className="t-bg-blue-500 t-text-white t-rounded t-flex t-pl-4 t-items-center t-justify-items-center t-w-16 t-h-10">
            New
        </span>
  

return <div className="t-flex t-flex-row t-ml-[6%] t-mt-10"> 
          {manifestLabels}
          <LocalTreeModal TriggerButton = {addButton} />
        </div>
  
}

export default TopBar
