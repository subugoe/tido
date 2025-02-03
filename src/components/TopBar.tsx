import { FC, useState } from 'react'

import IconRenderer from '@/components/base/IconRenderer.tsx'
import { tree } from '@/utils/icons'


import TreeSelectionModal from '@/components/TreeSelectionModal'

const TopBar: FC = () => {

  const [iconHtmlString, setIconHtmlString] = useState(tree)

  const addButton =
    <span
      className="t-bg-blue-500 t-text-white t-rounded t-flex t-pl-4 t-items-center t-justify-items-center t-w-16 t-h-10">
            New
    </span>


  return <div className="t-flex t-flex-row t-ml-[6%] t-mt-10">
    <button className="t-mr-2"><IconRenderer htmlString={tree} width={8} height={8}/></button>
    <TreeSelectionModal TriggerButton={addButton}/>
  </div>

}

export default TopBar
