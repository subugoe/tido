import { FC } from 'react'


import TreeSelectionModal from '@/components/TreeSelectionModal'

const TopBar: FC = () => {

  const addButton =
    <span
      className="t-bg-blue-500 t-text-white t-rounded t-flex t-pl-4 t-items-center t-justify-items-center t-w-16 t-h-10">
            New
    </span>


  return <div className="t-flex t-flex-row t-ml-[6%] t-mt-10">
    <TreeSelectionModal TriggerButton={addButton}/>
  </div>

}

export default TopBar
