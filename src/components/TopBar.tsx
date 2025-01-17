import { FC } from 'react'

import { contentStore } from '@/store/ContentStore'


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
  

return <div className="t-flex t-flex-row t-ml-[6%] t-mt-10"> {manifestLabels} </div>
  
}

export default TopBar
