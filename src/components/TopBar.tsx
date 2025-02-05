import { Dispatch, FC, SetStateAction, useState } from 'react'

import { configStore } from '@/store/ConfigStore.tsx'

import IconRenderer from '@/components/base/IconRenderer.tsx'
import { tree } from '@/utils/icons'
import { cross } from '@/utils/icons'

import TreeSelectionModal from '@/components/TreeSelectionModal.tsx'
import TreeSelectionModalContent from '@/components/tree-modal/TreeSelectionModalContent.tsx'


interface TopBarProps {
  setShowGlobalTree: Dispatch<SetStateAction<boolean>>
}

const TopBar: FC<TopBarProps> = ({ setShowGlobalTree }) => {

  const [iconHtmlString, setIconHtmlString] = useState(tree)
  const showGlobalTree = configStore(state => state.config.globalTree)

  function toggleIcon() {
    if (iconHtmlString === tree) {
      // we click the tree icon - now we show the global tree (set the value to true)
      setIconHtmlString(cross)
      setShowGlobalTree(true)
    } else if (iconHtmlString === cross) {
      setIconHtmlString(tree)
      setShowGlobalTree(false)
    }
  }

  const addButton =
    <span
      className="t-bg-blue-500 t-text-white t-rounded t-flex t-pl-4 t-items-center t-justify-items-center t-w-16 t-h-10">
            New
    </span>


  return <div className="t-flex t-flex-row t-ml-[6%] t-mt-10">
    <button className={`t-mr-2 toggle-global-tree ${!showGlobalTree ? 't-hidden' : ''}`} onClick={() => toggleIcon()}>
      <IconRenderer
        htmlString={iconHtmlString}
        width={8}
        height={8}/>
    </button>
    <TreeSelectionModal TriggerButton={addButton} Content={<TreeSelectionModalContent/>}/>
  </div>

}

export default TopBar
